const { QueryClient, useQuery, useMutation, queryOptions, keepPreviousData } =
  ReactQuery;
const { useState, useEffect, useRef, useCallback } = window.React;
const queryClient = new QueryClient();

const QUERY_KEYS = {
  Cart: 'Cart',
  QuickForm: 'QuickForm',
  Order: 'Order',
  CartGlobalState: 'CartGlobalState',
};

const quickFormApi = {
  baseKey: QUERY_KEYS.QuickForm,
  getQuickFormData: () => {
    return queryOptions({
      queryKey: [QUERY_KEYS.QuickForm],
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      queryFn: async () => {
        const { data } = await axios.get(`/cart/add`, {
          responseType: 'text',
          params: {
            ajax_q: 1,
            fast_order: 1,
          },
        });

        return JSON.parse(data);
      },
    });
  },
};

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
    cartItems:
      window.BODY.cartItems?.map(({ GOODS_MOD_ID, ORDER_LINE_QUANTITY }) => ({
        id: GOODS_MOD_ID,
        qty: ORDER_LINE_QUANTITY,
      })) || [],
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
// Хук для управления состоянием выбранной доставки
function useQuickFormData() {
  const { data, isLoading } = useQuery(quickFormApi.getQuickFormData());

  // Получаем первую доставку и зону по умолчанию
  const firstDelivery = data?.orderDelivery?.[0] || {};
  const firstZone = firstDelivery?.zoneList?.[0] || {};

  const [cartState, setCartState] = useCartGlobalState();

  // Обновляем состояние при загрузке данных
  useEffect(() => {
    if (data && !isLoading) {
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
    }
  }, [data, isLoading]);

  return {
    deliveryOptions: data?.orderDelivery || [],
    isLoading,
  };
}

// Хук для управления корзиной с учетом выбранной доставки
function useCartData() {
  return useQuery(cartApi.getCart());
}

const cartApi = {
  baseKey: QUERY_KEYS.Cart,
  getCart: () => {
    const [cartState] = useCartGlobalState();
    const deliveryId = cartState.form.delivery.id;
    const zoneId = cartState.form.delivery.zoneId;
    const isCouponSend = cartState.form.isCouponSend;
    const couponCode = cartState.form.couponCode;
    const cartItems = cartState.cartItems;

    if (!deliveryId) {
      return queryOptions({
        queryKey: ['empty'],
      });
    }
    return queryOptions({
      queryKey: [QUERY_KEYS.Cart, deliveryId, zoneId, cartItems],
      // queryKey: [QUERY_KEYS.Cart],
      enabled: Boolean(deliveryId && window.BODY.CART_COUNT_TOTAL),
      keepPreviousData: true,
      placeholderData: window.BODY,
      // initialData: window.BODY,
      queryFn: async () => {
        const formData = new FormData();

        if (deliveryId) {
          formData.append('form[delivery][id]', deliveryId);
        }

        if (zoneId) {
          formData.append('form[delivery][zone_id]', zoneId);
        }

        if (isCouponSend && couponCode) {
          formData.append('form[coupon_code]', couponCode);
        }

        cartItems?.forEach((item) =>
          formData.append(`form[quantity][${item.id}]`, item.qty)
        );

        const { data: cartPageData } = await axios.post(`/cart`, formData, {
          responseType: 'json',
          params: {
            only_body: 1,
            hash: window.BODY.HASH,
          },
        });

        let orderStepsPageData;
        if (isCouponSend && couponCode) {
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
    });
  },
  clearCart: async () => await axios.get(`/cart/truncate/`),
  deleteItem: async (itemId) => {
    await axios.get(`/cart/delete/${itemId}`);

    return itemId;
  },
  addToCart: async (form) => {
    const formData = new FormData(form);

    const response = await axios.post(`/cart/add/`, formData, {
      params: {
        ajax_q: 1,
        hash: window.BODY.HASH,
      },
    });

    return response;
  },
};

const useClearCartMutation = () => {
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });
};
const useDeleteItemMutation = () => {
  const [cartState, setCartState] = useCartGlobalState();

  return useMutation({
    mutationFn: cartApi.deleteItem,
    onError: async (error) => {
      console.error('Error deleting item:', error);
    },
    onSuccess: async (itemId) => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
      setCartState({
        ...cartState,
        cartItems: cartState.cartItems.filter((item) => item.id !== itemId),
      });
    },
  });
};

const orderApi = {
  baseKey: QUERY_KEYS.Order,
  createOrder: async (form) => {
    const formData = new FormData(form);

    const response = await axios.post(`/order/stage/confirm`, formData, {
      params: {
        ajax_q: 1,
        hash: window.BODY.HASH,
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
