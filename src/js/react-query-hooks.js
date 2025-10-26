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
      placeholderData: keepPreviousData,
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
  const [cartState] = useCartGlobalState();
  const deliveryId = cartState.form.delivery.id;
  const zoneId = cartState.form.delivery.zoneId;
  const isCouponSend = cartState.form.isCouponSend;
  const couponCode = cartState.form.coupon_code;

  return useQuery({
    queryKey: [QUERY_KEYS.Cart, deliveryId, zoneId],
    enabled: Boolean(deliveryId),
    initialData: window.CART,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const formData = new FormData();

      if (deliveryId) {
        formData.append('form[delivery][id]', deliveryId);
      }

      if (zoneId) {
        formData.append('form[delivery][zone_id]', zoneId);
      }

      if (isCouponSend) {
        formData.append('form[coupon_code]', couponCode);
      }

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
        orderStepsPageData.cartRelatedGoods = cartRelatedGoods;
      }

      return orderStepsPageData || cartPageData;
    },
  });
}

const cartApi = {
  baseKey: QUERY_KEYS.Cart,
  getCart: ({ deliveryId, zoneId, couponCode, isCouponSend } = {}) => {
    return queryOptions({
      queryKey: [QUERY_KEYS.Cart, deliveryId, zoneId],
      initialData: window.CART,
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 3_0000));
        const formData = new FormData();

        if (deliveryId) {
          formData.append('form[delivery][id]', deliveryId);
        }

        if (zoneId) {
          formData.append('form[delivery][zone_id]', zoneId);
        }

        if (isCouponSend) {
          formData.append('form[coupon_code]', couponCode);
        }

        // cartItems?.forEach((item) =>
        //   formData.append(
        //     `form[quantity][${item.GOODS_MOD_ID}]`,
        //     item.ORDER_LINE_QUANTITY
        //   )
        // );

        const { data: cartPageDataString } = await axios.post(
          `/cart`,
          formData,
          {
            responseType: 'text',
            params: {
              only_body: 1,
              hash: window.HASH,
            },
          }
        );
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

        return orderStepsPageData || cartPageData;
      },
      enabled: Boolean(deliveryId || zoneId),
    });
  },
  clearCart: async () => await axios.get(`/cart/truncate/`),
  deleteItem: async (itemId) => {
    await axios.get(`/cart/delete/${itemId}`);
  },
  addToCart: async (form) => {
    const formData = new FormData(form);

    const response = await axios.post(`/cart/add/`, formData, {
      params: {
        ajax_q: 1,
        hash: window.HASH,
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
  return useMutation({
    mutationFn: cartApi.deleteItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
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
  useQuickFormData,
  useCartData,
  useCartGlobalState,
  useCreateOrderMutation,
  useClearCartMutation,
  useDeleteItemMutation,
};
