const { useState, useEffect, useRef, useCallback } = window.React;
const queryClient = window.queryClient;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const { QueryClientProvider } = window.ReactQuery;
const container = document.getElementById('root-cart');
const { createRoot } = window.ReactDOM;
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

const EmptyCart = window.EmptyCart;

function App() {
  return (
    <>
      <EmptyCart />
      {/* <Cart /> */}
      {/* <OrderForm /> */}
    </>
  );
}
