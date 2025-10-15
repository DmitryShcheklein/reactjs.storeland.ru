const { useQuery, useMutation, queryOptions } = ReactQuery;

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

        window.CART?.cartItems?.forEach((item) =>
          formData.append(
            `form[quantity][${item.GOODS_MOD_ID}]`,
            item.ORDER_LINE_QUANTITY
          )
        );

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
  quickFormApi,
  cartApi,
  orderApi,
};
