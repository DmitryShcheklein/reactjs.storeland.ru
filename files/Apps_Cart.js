import { EmptyCart } from '/design/Components_EmptyCart-copy.js'
import { Test } from '/design/Components_Test.js'
import { queryClient } from '/design/Hooks_cart.js'
// import { useState, useEffect, useRef, useCallback } from 'React';
import { ReactQueryDevtools } from 'ReactQueryDevtools';
import { QueryClientProvider } from 'ReactQuery';


const container = document.getElementById('root-cart');

const root = ReactDOM.createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);



function App() {
  return (
    <>
      123
      <Test />
      <EmptyCart />
      {/* <Cart /> */}
      {/* <OrderForm /> */}
    </>
  );
}
