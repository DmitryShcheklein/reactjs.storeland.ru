const { createRoot } = ReactDOM;
const { QueryClient, QueryClientProvider } = ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const { useQuickFormData, useCart } = window.ReactQueryHooks;

const queryClient = new QueryClient();

function Cart() {
  const { data } = useQuickFormData();
  console.log('quickFormdata', data);
  const [firstDelivery] = data?.deliveries || [];

  const { data: cartData } = useCart({
    deliveryId: firstDelivery?.id,
    zoneId: firstDelivery?.zoneList[0]?.zoneId,
    couponCode: '0000',
    isCouponSend: true,
  });
  console.log('cartData', cartData);
  return (
    <div>
      <h1>Корзина</h1>
      {cartData?.cartItems.map((goods) => (
        <div key={goods.GOODS_ID}>{goods.GOODS_NAME}</div>
      ))}

      <hr />
      <div>
        Итого с доставкой и скидкой:{' '}
        <b>{cartData?.CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT}</b>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Cart />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
