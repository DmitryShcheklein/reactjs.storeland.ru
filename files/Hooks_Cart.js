import { queryClient, QUERY_KEYS } from '/design/Hooks_Main.js';
import {
  useQuery
} from 'ReactQuery';

export function useCartState() {
  const INITIAL_FORM_DATA = {
    form: {
      delivery: {
        id: undefined,
        zone_id: undefined,
      },
      payment: {
        id: undefined,
      },
      coupon_code: '',
      isCouponSend: false,
    },
  };
  const key = QUERY_KEYS.CartState;
  const query = useQuery({
    queryKey: [key],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
  });

  return [query.data, (value) => queryClient.setQueryData([key], value)];
}

export function useCart() {
  const [cartState, setCartState] = useCartState();
  const {
    form: {
      delivery: { id: deliveryId },
    },
  } = cartState;

  return useQuery({
    queryKey: [QUERY_KEYS.Cart],
    queryFn: async () => {
      const {
        form: {
          delivery: { id: deliveryId, zone_id: zoneId },
          coupon_code: couponCode,
          isCouponSend,
        },
      } = cartState;

      const formData = new FormData();
      formData.append('form[delivery][id]', deliveryId);
      formData.append('form[delivery][zone_id]', zoneId);

      if (isCouponSend) {
        formData.append('form[coupon_code]', couponCode);
      }

      cartState?.cartItems?.forEach((item) =>
        formData.append(
          `form[quantity][${item.GOODS_MOD_ID}]`,
          item.ORDER_LINE_QUANTITY
        )
      );

      const { data: cartPageDataString } = await axios.post(`/cart`, formData, {
        responseType: 'text',
        params: {
          only_body: 1,
          hash: window.HASH,
        },
      });
      const cartPageData = JSON.parse(cartPageDataString);

      let orderStepsPageData;
      if (isCouponSend && couponCode) {
        const { cartRelatedGoods } = cartPageData;
        const { data: stepsOrderDataString } = await axios.post(
          `/order/stage/confirm`,
          formData,
          {
            responseType: 'text',
            params: {
              only_body: 1,
              ajax_q: 1,
            },
          }
        );
        orderStepsPageData = JSON.parse(stepsOrderDataString);
        orderStepsPageData.cartRelatedGoods = cartRelatedGoods; // BUG: в пошаговом заказе нет массива сопутствующих
      }
      const cardData = orderStepsPageData || cartPageData;

      return cardData;
    },
    onSuccess(data = {}) {
      const { cartItems, goodsModInfo, favoritesGoods, cartDiscount } = data;
      const isCouponEnabled = cartDiscount?.DISCOUNT_TYPE === 'coupon';

      setCartState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          isCouponSend: isCouponEnabled,
        },
        cartItems: cartItems?.map(({ GOODS_MOD_ID, ORDER_LINE_QUANTITY }) => ({
          GOODS_MOD_ID,
          ORDER_LINE_QUANTITY,
        })),
        compareGoods: goodsModInfo,
        favoritesGoods,
      }));
    },
    enabled: Boolean(deliveryId),
  });
}

export function useCheckCartEmpty() {
  const { data: cartData, isFetched } = useCart();
  const isCartEmpty =
    window.CART_IS_EMPTY || (!cartData?.CART_COUNT_TOTAL && isFetched);

  return isCartEmpty;
}

export function useClearCartMutation(options) {
  return useMutation({
    mutationFn: async () => {
      await axios.get(`/cart/truncate/`);

      queryClient.setQueryData([QUERY_KEYS.Cart], {});
    },
    ...options,
  });
}
export function useClearCartItemMutation(options) {
  return useMutation({
    mutationFn: async (itemId) => {
      await axios.get(`/cart/delete/${itemId}`);
    },
    ...options,
  });
}
export function useClearCartItemsMutation(options) {
  return useMutation({
    mutationFn: async (itemsIdArray) => {
      const formData = new FormData();

      itemsIdArray.forEach((id) => formData.append('id[]', id));

      await axios.post(`/cart/delete/`, formData, {
        params: {
          ajax_q: 1,
        },
      });
    },
    ...options,
  });
}
export function useCompareGoodMutation() {
  const [_, setCartState] = useCartState();

  return useMutation({
    mutationFn: async ({ goodsModId, isInCompare }) => {
      const { data } = await axios.post(
        `/compare/${isInCompare ? 'delete' : 'add'}`,
        {},
        {
          params: {
            id: goodsModId,
            ajax_q: 1,
          },
        }
      );

      const isOk = data.status === 'ok';

      if (isOk) {
        setCartState((prev) => {
          let newCompareList;

          if (isInCompare) {
            newCompareList = prev.compareGoods.filter(
              (el) => el.GOODS_MOD_ID !== goodsModId
            );
          } else {
            newCompareList = [
              ...prev.compareGoods,
              {
                GOODS_MOD_ID: goodsModId,
              },
            ];
          }

          return {
            ...prev,
            compareGoods: newCompareList,
          };
        });
      }
    },
  });
}

export function useFavoritesGoodMutation() {
  const [cartState, setCartState] = useCartState();

  return useMutation({
    mutationFn: async ({ goodsId, goodsModId, isFavorite }) => {
      const { favoritesGoods } = cartState;
      const currentModId =
        favoritesGoods.find((el) => el.ID === goodsId)?.GOODS_MOD_ID ||
        goodsModId;
      const { data } = await axios.post(
        `/favorites/${isFavorite ? 'delete' : 'add'}`,
        {},
        {
          params: {
            id: currentModId,
            ajax_q: 1,
          },
        }
      );

      const isOk = data.status === 'ok';

      if (isOk) {
        setCartState((prev) => {
          let newFavoritesList;

          if (isFavorite) {
            newFavoritesList = prev.favoritesGoods.filter(
              (el) => el.ID !== goodsId
            );
          } else {
            newFavoritesList = [
              ...prev.favoritesGoods,
              {
                ID: goodsId,
                GOODS_MOD_ID: currentModId,
              },
            ];
          }

          return {
            ...prev,
            favoritesGoods: newFavoritesList,
          };
        });
      }
    },
  });
}


export function useAddCartMutation(options) {
  return useMutation({
    mutationFn: async (form) => {
      const formData = new FormData(form);

      for (const pair of formData.entries()) {
        // console.log(pair[0] + ', ' + pair[1]);formData
      }
      const response = await axios.post(`/cart/add/`, formData, {
        params: {
          ajax_q: 1,
          hash: window.HASH,
        },
      });
      // console.log(response);
      return response;
    },
    ...options,
  });
}