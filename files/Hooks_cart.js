import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'ReactQuery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const QUERY_KEYS = {
  Cart: 'Cart',
  CartState: 'CartState',
  FormState: 'FormState',
  QuickFormData: 'QuickFormData',
};


function useFormState() {
  const INITIAL_FORM_DATA = {
    form: {
      contact: {
        person: undefined,
        phone: undefined,
        email: undefined,
      },
      delivery: {
        address_street: undefined,
        address_home: undefined,
        address_flat: undefined,
      },
    },
  };
  const key = QUERY_KEYS.FormState;
  const query = useQuery({
    queryKey: [key],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
  });

  return [query.data, (value) => queryClient.setQueryData([key], value)];
}

function useCartState() {
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

function useQuickFormData() {
  const [, setFormState] = useFormState();
  const [, setCartState] = useCartState();

  return useQuery({
    queryKey: [QUERY_KEYS.QuickFormData],
    initialData: { SETTINGS_ORDER_FIELDS: {} },
    queryFn: async () => {
      const { data: dataString } = await axios.get(`/cart/add`, {
        responseType: 'text',
        params: {
          ajax_q: 1,
          fast_order: 1,
        },
      });

      return JSON.parse(dataString).data;
    },
    onSuccess: (data) => {
      const {
        ORDER_FORM_CONTACT_PERSON,
        ORDER_FORM_CONTACT_PHONE,
        ORDER_FORM_CONTACT_EMAIL,
      } = data;

      const [firstDelivery] = data?.deliveries;

      setCartState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          delivery: {
            id: firstDelivery?.id,
            zone_id: firstDelivery?.zoneList[0]?.zoneId,
          },
          payment: {
            id: firstDelivery?.availablePaymentList[0]?.id,
          },
        },
      }));

      setFormState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          contact: {
            person: ORDER_FORM_CONTACT_PERSON,
            //  || 'User'
            phone: ORDER_FORM_CONTACT_PHONE,
            // || '89876543210'
            email: ORDER_FORM_CONTACT_EMAIL,
            //  || 'user@test.ru'
          },
        },
      }));
    },
    enabled: !window.CART_IS_EMPTY,
  });
}

function useCart() {
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
function useCheckCartEmpty() {
  const { data: cartData, isFetched } = useCart();
  const isCartEmpty =
    window.CART_IS_EMPTY || (!cartData?.CART_COUNT_TOTAL && isFetched);

  return isCartEmpty;
}
export { queryClient, useCheckCartEmpty, useCart }