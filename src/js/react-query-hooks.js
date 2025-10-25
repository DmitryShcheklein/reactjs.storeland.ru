const { QueryClient, useQuery, useMutation, queryOptions } = ReactQuery;
const { useState, useEffect, useRef, useCallback } = window.React;
const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnWindowFocus: false, // default: true
  //   },
  // },
});
const QUERY_KEYS = {
  Cart: 'Cart',
  QuickFormData: 'QuickFormData',
  Order: 'Order',
};

const quickFormApi = {
  baseKey: QUERY_KEYS.QuickFormData,
  getQuickFormData: () => {
    return queryOptions({
      queryKey: [QUERY_KEYS.QuickFormData],
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

function useCartState() {
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
    queryKey: [QUERY_KEYS.CartState],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
  });

  return [
    query.data,
    (value) => queryClient.setQueryData([QUERY_KEYS.CartState], value),
  ];
}
// Хук для управления состоянием выбранной доставки
function useQuickFormState() {
  const { data, isLoading } = useQuery(quickFormApi.getQuickFormData());

  // Получаем первую доставку и зону по умолчанию
  const firstDelivery = data?.orderDelivery?.[0] || {};
  const firstZone = firstDelivery?.zoneList?.[0] || {};

  const [cartState, setCartState] = useCartState();

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
function useCartWithDelivery() {
  const [cartState] = useCartState();
  const deliveryId = cartState.form.delivery.id;
  const zoneId = cartState.form.delivery.zoneId;
  const isCouponSend = cartState.form.isCouponSend;
  const couponCode = cartState.form.coupon_code;

  return useQuery({
    queryKey: [QUERY_KEYS.Cart, deliveryId, zoneId],
    enabled: Boolean(deliveryId),
    initialData: window.CART,
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
  addCart: async (form) => {
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

function useCreateOrderMutation() {
  return useMutation({
    mutationFn: async (form) => {
      const formData = new FormData(form);

      for (const pair of formData.entries()) {
        // console.log(pair[0] + ', ' + pair[1]);formData
      }
      const response = await axios.post(`/order/stage/confirm`, formData, {
        params: {
          ajax_q: 1,
          hash: window.HASH,
        },
      });

      return response;
    },
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

window.ReactQueryHooks = {
  queryClient,
  quickFormApi,
  cartApi,
  orderApi,
  useQuickFormState,
  useCartWithDelivery,
  useCartState,
};
