// import { EmptyCart } from '/design/components_EmptyCart.js';
const EmptyCart = window.EmptyCart;

const { useState, useEffect, useRef } = window.React;
const {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} = window.ReactQuery;
const { IMaskInput } = window.ReactIMask;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const classNames = window.classNames;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
const QUERY_KEYS = {
  Cart: 'Cart',
  FormState: 'FormState',
  QuickFormData: 'QuickFormData',
};
const container = document.getElementById('root-cart');
const { createRoot } = window.ReactDOM;
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

function App() {
  return (
    <>
      <EmptyCart />
      123
      {/* 
        <Cart />
        <OrderForm /> */}
    </>
  );
}
