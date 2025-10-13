const { createRoot } = ReactDOM;
const { QueryClient, QueryClientProvider } = ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const { useQuickFormData, useCart } = window.ReactQueryHooks;

const queryClient = new QueryClient();

function Cart() {
  const { data } = useQuickFormData();

  const [firstDelivery] = data?.deliveries || [];
  console.log(firstDelivery?.id);
  const { data: cartData } = useCart({
    deliveryId: firstDelivery?.id,
    zoneId: firstDelivery?.zoneList[0]?.zoneId,
    couponCode: '',
    isCouponSend: false,
  });
  console.log(cartData);
  return (
    <div>
      <h2>hi</h2>
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
