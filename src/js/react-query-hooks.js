const { QueryClient, useQuery, useMutation, queryOptions } = ReactQuery;
const queryClient = new QueryClient();

const QUERY_KEYS = {
  Cart: 'Cart',
  QuickForm: 'QuickForm',
  Order: 'Order',
  CartGlobalState: 'CartGlobalState',
};

// Cart global state
function useCartGlobalState() {
  const INITIAL_FORM_DATA = {
    form: {
      delivery: {
        id: undefined,
        zoneId: undefined,
      },
      payment: {
        id: undefined,
      },
      couponCode: '',
      isCouponSend: false,
    },
    cartItems: [],
  };

  const query = useQuery({
    queryKey: [QUERY_KEYS.CartGlobalState],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
  });

  return [
    query.data,
    (value) => queryClient.setQueryData([QUERY_KEYS.CartGlobalState], value),
  ];
}

// QuickForm
const quickFormApi = {
  baseKey: QUERY_KEYS.QuickForm,
  getData: () => {
    const [cartState, setCartState] = useCartGlobalState();

    return queryOptions({
      queryKey: [QUERY_KEYS.QuickForm],
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      queryFn: async () => {
        const { data } = await axios.get(`/cart/add`, {
          responseType: 'json',
          params: {
            ajax_q: 1,
            fast_order: 1,
          },
        });

        return data;
      },
      onSuccess: (data) => {
        // Получаем первую доставку и зону по умолчанию
        const firstDelivery = data?.orderDelivery?.[0] || {};
        const firstZone = firstDelivery?.zoneList?.[0] || {};

        // Обновляем состояние при загрузке данных
        setCartState({
          ...cartState,
          form: {
            ...cartState.form,
            delivery: {
              ...cartState.form.delivery,
              id: firstDelivery?.id,
              zoneId: firstZone?.zoneId,
            },
          },
        });
      },
    });
  },
};

function useQuickFormData() {
  return useQuery(quickFormApi.getData());
}

// Cart
const cartApi = {
  baseKey: QUERY_KEYS.Cart,
  getCart: () => {
    const [cartState, setCartState] = useCartGlobalState();
    const deliveryId = cartState.form.delivery.id;
    const zoneId = cartState.form.delivery.zoneId;
    const isCouponSend = cartState.form.isCouponSend;
    const couponCode = cartState.form.couponCode;
    const cartItems = cartState.cartItems;

    return queryOptions({
      queryKey: [QUERY_KEYS.Cart, deliveryId, zoneId, couponCode, cartItems],
      enabled: Boolean(deliveryId && !window.CART_IS_EMPTY),
      keepPreviousData: true,
      queryFn: async () => {
        const formData = new FormData();

        if (deliveryId) {
          formData.append('form[delivery][id]', deliveryId);
        }

        if (zoneId) {
          formData.append('form[delivery][zone_id]', zoneId);
        }
        console.log('couponCode', couponCode);

        if (couponCode) {
          formData.append('form[coupon_code]', couponCode);
        }

        cartItems?.forEach((item) =>
          formData.append(`form[quantity][${item.id}]`, item.qty)
        );

        const { data: cartPageData } = await axios.post(`/cart`, formData, {
          responseType: 'json',
          params: {
            only_body: 1,
            hash: window.HASH,
          },
        });

        let orderStepsPageData;
        if (couponCode) {
          const { cartRelatedGoods } = cartPageData;
          const { data: stepsOrderData } = await axios.post(
            `/order/stage/confirm`,
            formData,
            {
              responseType: 'json',
              params: {
                only_body: 1,
                ajax_q: 1,
              },
            }
          );
          orderStepsPageData = stepsOrderData;
          orderStepsPageData.cartRelatedGoods = cartRelatedGoods;
        }

        return orderStepsPageData || cartPageData;
      },
      onSuccess: (data = {}) => {
        const { cartItems, goodsModInfo, favoritesGoods, cartDiscount } = data;
        const isCouponEnabled = cartDiscount?.DISCOUNT_TYPE === 'coupon';

        setCartState((prev) => ({
          ...prev,
          form: {
            ...prev.form,
            isCouponSend: isCouponEnabled,
          },
          cartItems: cartItems?.map(
            ({ GOODS_MOD_ID, ORDER_LINE_QUANTITY }) => ({
              id: GOODS_MOD_ID,
              qty: ORDER_LINE_QUANTITY,
            })
          ),
          compareGoods: goodsModInfo,
          favoritesGoods,
        }));
      },
    });
  },
  clearCart: async () => axios.get(`/cart/truncate/`),
  deleteItem: async (itemId) => axios.get(`/cart/delete/${itemId}`),
  addToCart: async (form) => {
    const formData = new FormData(form);

    return axios.post(`/cart/add/`, formData, {
      params: {
        ajax_q: 1,
        hash: window.HASH,
      },
    });
  },
};

function useCartData() {
  return useQuery(cartApi.getCart());
}
const useClearCartMutation = () => {
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });
};
const useDeleteItemMutation = () => {
  return useMutation({
    mutationFn: cartApi.deleteItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });
};

// Order
const orderApi = {
  baseKey: QUERY_KEYS.Order,
  createOrder: async (form) => {
    const formData = new FormData(form);

    const response = await axios.post(`/order/stage/confirm`, formData, {
      params: {
        ajax_q: 1,
        hash: window.HASH,
      },
    });

    return response;
  },
};

function useCreateOrderMutation() {
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: ({ data }) => {
      const { status, location: redirectLink, message } = data;

      if (status === 'error') {
        console.error(message);
      }
      if (redirectLink) {
        location.href = redirectLink;
      }
    },
  });
}

window.ReactQueryHooks = {
  queryClient,
  quickFormApi,

  useQuickFormData,
  useCartData,
  useCartGlobalState,
  useCreateOrderMutation,
  useClearCartMutation,
  useDeleteItemMutation,
};
