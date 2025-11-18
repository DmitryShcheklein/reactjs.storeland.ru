const { useState, useEffect, useRef, useCallback } = window.React;
const { createRoot } = ReactDOM;
const { QueryClient, QueryClientProvider, useQuery, useMutation } = ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const {
  queryClient,

  useQuickFormData,
  useCartData,
  useCartGlobalState,
  useCreateOrderMutation,
  useClearCartMutation,
  useDeleteItemMutation,
} = window.ReactQueryHooks;

const root = createRoot(document.getElementById('root'));
root.render(<App />);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartPage />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

function CartPage() {
  const { data: cartData, isLoading: isCartLoading } = useCartData();
  const { isLoading: isQuickFormLoading } = useQuickFormData();

  const isCartEmpty =
    window.CART_IS_EMPTY || (cartData && !cartData.CART_COUNT_TOTAL);

  return (
    <>
      {isCartEmpty ? (
        <div className="notification is-warning">
          <p className="is-size-5">Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          {isCartLoading || isQuickFormLoading ? (
            <h2 className="title is-6">Загрузка корзины...</h2>
          ) : (
            <div className={`columns`}>
              {/* Левая колонка: Корзина и форма заказа */}
              <div className="column is-8">
                <Cart />
                <OrderForm />
              </div>

              {/* Правая колонка: Итоги и купон */}
              <div className="column is-4">
                <Total />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
function Cart() {
  const { data: cartData, isPreviousData } = useCartData();

  if (!cartData) {
    return null;
  }

  return (
    <div className="box mb-5">
      <table
        className="table is-fullwidth is-striped is-hoverable"
        style={isPreviousData ? { opacity: 0.5 } : {}}
      >
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
          {cartData?.cartItems?.map((goods) => (
            <GoodsItem key={goods.GOODS_MOD_ID} goods={goods} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GoodsItem({ goods }) {
  const {
    GOODS_MOD_ID,
    GOODS_NAME,
    GOODS_PRICE,
    ORDER_LINE_QUANTITY,
    ORDER_LINE_SUM,
    GOODS_IMAGE,
    GOODS_MOD_ART_NUMBER,
    GOODS_MOD_PRICE_NOW,
    ORDER_LINE_PRICE_NOW,
  } = goods;
  const [cartState, setCartState] = useCartGlobalState();
  const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);

  useEffect(() => {
    setCartState({
      ...cartState,
      cartItems: cartState.cartItems.map((item) =>
        item.id === GOODS_MOD_ID ? { ...item, qty: inputValue } : item
      ),
    });
  }, [inputValue]);

  const clearCartItemMutation = useDeleteItemMutation();

  return (
    <tr key={goods.GOODS_ID}>
      <td>
        <div className="is-flex is-align-items-center">
          {GOODS_IMAGE && (
            <figure className="image is-64x64 mr-2">
              <img src={GOODS_IMAGE} alt={GOODS_NAME} />
            </figure>
          )}
          <div>
            <p className="is-size-5">{GOODS_NAME}</p>
            <p className="is-size-7 has-text-grey">{GOODS_MOD_ART_NUMBER}</p>
          </div>
        </div>
      </td>
      <td className="has-text-weight-bold">{GOODS_MOD_PRICE_NOW}</td>
      <td>
        <div className="field has-addons">
          <p className="control">
            <button
              className="button is-small"
              onClick={() => setInputValue(Math.max(1, inputValue - 1))}
            >
              -
            </button>
          </p>
          <p className="control">
            <input
              name={`form[quantity][${GOODS_MOD_ID}]`}
              className="input is-small has-text-centered"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              style={{ width: '50px' }}
            />
          </p>
          <p className="control">
            <button
              className="button is-small"
              onClick={() => setInputValue(Math.max(1, Number(inputValue) + 1))}
            >
              +
            </button>
          </p>
        </div>
      </td>
      <td className="has-text-weight-bold">{ORDER_LINE_PRICE_NOW}</td>
      <td>
        <button
          className="button is-small is-danger is-light"
          onClick={() => clearCartItemMutation.mutate(GOODS_MOD_ID)}
        >
          <span className="icon">
            <i className="icon-delete"></i>
          </span>
        </button>
      </td>
    </tr>
  );
}

function Total() {
  const [cartState, setCartState] = useCartGlobalState();
  const { isLoading: isQuickFormLoading } = useQuickFormData();
  const [couponCode, setCouponCode] = useState('0000');
  const [isCouponSend, setIsCouponSend] = useState(false);
  const {
    data: cartData,
    isLoading: isCartLoading,
    isPlaceholderData,
    isPending,
    isRefetching,
  } = useCartData();
  // console.log({
  //   isLoading: isCartLoading,
  //   isPlaceholderData,
  //   isPending,
  //   isRefetching,
  // });
  // console.log(cartData?.CART_SUM_DELIVERY);

  const clearCartMutation = useClearCartMutation();

  const createOrderMutation = useCreateOrderMutation();

  // Компонент скелетона для цен
  const PriceSkeleton = () => (
    <span style={{ width: '100px', height: '50px' }}>...</span>
  );
  const isActiveCoupon = cartState.form.isCouponSend;

  if (!isActiveCoupon && isCouponSend && couponCode) {
    console.error('Купон не применён');
  }

  return (
    <div className="box sticky-top" style={{ position: 'sticky', top: '20px' }}>
      <h3 className="title is-4 mb-4">Ваш заказ</h3>

      {/* Купон */}
      <div className="field has-addons mb-5">
        <div className="control is-expanded">
          <input
            readOnly={isActiveCoupon}
            className="input"
            type="text"
            placeholder="Введите промокод"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
            }}
          />
        </div>

        {couponCode ? (
          <div className="control">
            <button
              className="button is-error"
              onClick={() => {
                setIsCouponSend(false);
                setCouponCode('');
                setCartState((prev) => {
                  return {
                    ...prev,
                    form: {
                      ...prev.form,
                      couponCode: '',
                    },
                  };
                });
              }}
            >
              <span className="icon">
                <i className="icon-delete"></i>
              </span>
            </button>
          </div>
        ) : null}

        <div className="control">
          <button
            className={`button is-info ${isCartLoading || isPlaceholderData ? 'is-loading' : ''}`}
            onClick={() => {
              setIsCouponSend(true);
              setCartState((prev) => {
                return {
                  ...prev,
                  form: {
                    ...prev.form,
                    couponCode,
                  },
                };
              });
            }}
            disabled={isActiveCoupon || isCartLoading}
          >
            {isActiveCoupon ? <>Применён</> : <>Применить</>}
          </button>
        </div>
      </div>

      {/* Итоги заказа */}
      <div className="content">
        <div className="is-size-5 is-flex is-justify-content-space-between">
          <span>Итого:</span>
          <div className="has-text-weight-bold">
            {isRefetching || isCartLoading || isQuickFormLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_NOW
            )}
          </div>
        </div>
        <div className="is-size-5 is-flex is-justify-content-space-between">
          <span>Скидка:</span>
          <div className="has-text-weight-bold has-text-danger">
            {isRefetching || isCartLoading || isQuickFormLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_DISCOUNT
            )}
          </div>
        </div>

        <div className="is-size-5 is-flex is-justify-content-space-between">
          <span>Доставка:</span>
          <div className="has-text-weight-bold">
            {isRefetching || isCartLoading || isQuickFormLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_DELIVERY
            )}
          </div>
        </div>
        <hr />
        <div className="is-size-4 is-flex is-justify-content-space-between">
          <span>Итого:</span>
          <div className="has-text-weight-bold">
            {isCartLoading || isQuickFormLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT
            )}
          </div>
        </div>
      </div>

      <div className="buttons is-flex is-justify-content-space-between">
        <button
          className="button is-danger"
          onClick={() => clearCartMutation.mutate()}
        >
          Очистить корзину
        </button>
        <button
          className="button is-primary is-fullwidth mt-3"
          onClick={() => createOrderMutation.mutate()}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

function OrderForm() {
  const { data, isLoading: isDeliveryLoading } = useQuickFormData();
  const [cartState, setCartState] = useCartGlobalState();
  const deliveryOptions = data?.orderDelivery || [];

  return (
    <div className="box mb-5">
      {/* Выбор доставки */}
      <div className="field mb-4">
        <label className="label">Доставка</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select
              value={cartState?.form?.delivery?.id}
              onChange={(e) => {
                const deliveryId = e.target.value;

                setCartState({
                  ...cartState,
                  form: {
                    ...cartState.form,
                    delivery: {
                      ...cartState.form.delivery,
                      id: deliveryId,
                    },
                  },
                });
              }}
              disabled={isDeliveryLoading}
            >
              {deliveryOptions.map((delivery) => (
                <option key={delivery.id} value={delivery.id}>
                  {delivery.name} ({delivery.id}) {delivery.price}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h3 className="title is-4 mb-4">Данные для заказа</h3>

      <div className="field">
        <label className="label">ФИО</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Введите ваше полное имя"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Введите ваш email"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Телефон</label>
        <div className="control">
          <input
            className="input"
            type="tel"
            placeholder="Введите ваш телефон"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Адрес доставки</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Введите адрес доставки"
          ></textarea>
        </div>
      </div>

      <div className="field">
        <label className="label">Комментарий к заказу</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Дополнительная информация к заказу"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
