const {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} = window.ReactQuery;

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

window.queryClient = queryClient;

function useCheckCartEmpty() {
  const { data: cartData, isFetched } = useCart();
  const isCartEmpty =
    window.CART_IS_EMPTY || (!cartData?.CART_COUNT_TOTAL && isFetched);

  return isCartEmpty;
}
