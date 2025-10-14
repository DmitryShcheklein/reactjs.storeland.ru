const { useQuery, useMutation } = ReactQuery;

const QUERY_KEYS = {
  Cart: 'Cart',
  QuickFormData: 'QuickFormData',
};

function useQuickFormData() {
  return useQuery({
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
}

function useCart({ deliveryId, zoneId, couponCode, isCouponSend }) {
  return useQuery({
    queryKey: [QUERY_KEYS.Cart],
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

      return orderStepsPageData || cartPageData;
    },
    // enabled: Boolean(deliveryId),
  });
}
function useClearCartMutation(options) {
  return useMutation({
    mutationFn: async () => {
      await axios.get(`/cart/truncate/`);

      queryClient.setQueryData([QUERY_KEYS.Cart], {});
    },
    ...options,
  });
}

function useClearCartItemMutation(options) {
  return useMutation({
    mutationFn: async (itemId) => {
      await axios.get(`/cart/delete/${itemId}`);
    },
    ...options,
  });
}

window.QUERY_KEYS = QUERY_KEYS;
window.ReactQueryHooks = {
  useQuickFormData,
  useCart,
  useClearCartMutation,
  useClearCartItemMutation,
};
