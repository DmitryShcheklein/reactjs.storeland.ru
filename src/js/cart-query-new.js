const { createRoot } = ReactDOM;
const { QueryClient, QueryClientProvider, useQuery, useMutation } = ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;

const { quickFormApi, cartApi } = window.ReactQueryHooks;

function Cart() {
  const { data: quickFormData } = useQuery(quickFormApi.getQuickFormData());
  const [firstDelivery] = quickFormData?.deliveries || [];
  const { data: cartData } = useQuery(
    cartApi.getCart({
      deliveryId: firstDelivery?.id,
      zoneId: firstDelivery?.zoneList[0]?.zoneId,
      couponCode: '0000',
      isCouponSend: !!1,
    })
  );

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });

  const clearCartItemMutation = useMutation({
    mutationFn: cartApi.deleteItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });

  return (
    <div className="container">
      <h1 className="title is-2">Корзина</h1>

      {!cartData?.cartItems?.length ? (
        <div className="notification is-warning">
          <p className="is-size-5">Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="box">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Сумма</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartData?.cartItems.map((goods) => (
                  <tr key={goods.GOODS_ID}>
                    <td>
                      <div className="is-flex is-align-items-center">
                        {goods.GOODS_IMAGE && (
                          <figure className="image is-64x64 mr-2">
                            <img
                              src={goods.GOODS_IMAGE}
                              alt={goods.GOODS_NAME}
                            />
                          </figure>
                        )}
                        <div>
                          <p className="is-size-5">{goods.GOODS_NAME}</p>
                          <p className="is-size-7 has-text-grey">
                            {goods.GOODS_MOD_ART_NUMBER}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="has-text-weight-bold">
                      {goods.GOODS_MOD_PRICE_NOW}
                    </td>
                    <td>
                      <div className="field has-addons">
                        <p className="control">
                          <button className="button is-small">-</button>
                        </p>
                        <p className="control">
                          <input
                            className="input is-small has-text-centered"
                            type="text"
                            value={goods.ORDER_LINE_QUANTITY}
                            readOnly
                            style={{ width: '50px' }}
                          />
                        </p>
                        <p className="control">
                          <button className="button is-small">+</button>
                        </p>
                      </div>
                    </td>
                    <td className="has-text-weight-bold">
                      {goods.ORDER_LINE_PRICE_NOW}
                    </td>
                    <td>
                      <button
                        className="button is-small is-danger is-light"
                        onClick={() =>
                          clearCartItemMutation.mutate(goods.GOODS_MOD_ID)
                        }
                      >
                        <span className="icon">
                          <i className="icon-trash"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="columns">
            <div className="column is-8">
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Введите промокод"
                  />
                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="box">
                <div className="content">
                  <p className="is-size-5">
                    Итого:{' '}
                    <span className="has-text-weight-bold">
                      {cartData?.CART_SUM_NOW}
                    </span>
                  </p>
                  <p className="is-size-5">
                    Скидка:{' '}
                    <span className="has-text-weight-bold has-text-danger">
                      {cartData?.CART_SUM_DISCOUNT}
                    </span>
                  </p>
                  <p className="is-size-5">
                    Доставка:{' '}
                    <span className="has-text-weight-bold">
                      {cartData?.CART_SUM_DELIVERY}
                    </span>
                  </p>
                  <hr />
                  <p className="is-size-4">
                    Итого с доставкой и скидкой:{' '}
                    <span className="has-text-weight-bold">
                      {cartData?.CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT}
                    </span>
                  </p>
                </div>

                <div className="buttons is-flex is-justify-content-space-between">
                  <button
                    className="button is-danger"
                    onClick={() => clearCartMutation.mutate()}
                  >
                    Очистить корзину
                  </button>
                  <button className="button is-primary">Оформить заказ</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const queryClient = new QueryClient();

queryClient.prefetchQuery(quickFormApi.getQuickFormData());

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
