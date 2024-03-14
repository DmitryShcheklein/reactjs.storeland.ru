import { EmptyCart } from '/design/Components_EmptyCart.js'
import { Cart } from '/design/Components_Cart.js'
import { OrderForm } from '/design/Components_OrderForm.js'
import { queryClient } from '/design/Hooks_Main.js'
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
      {/* <EmptyCart /> */}
      <Cart />
      {/* <OrderForm /> */}
    </>
  );
}
