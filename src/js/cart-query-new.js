const { useState, useEffect, useRef, useCallback } = window.React;
const { createRoot } = ReactDOM;
const { QueryClient, QueryClientProvider, useQuery, useMutation } = ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const {
  quickFormApi,
  cartApi,
  orderApi,
  useQuickFormState,
  useCartWithDelivery,
  queryClient,
  useCartState,
} = window.ReactQueryHooks;

// const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <h1 className="title is-2">Корзина</h1>

        <div className="columns">
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
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

function Cart() {
  const { data: cartData, isLoading: isCartLoading } = useCartWithDelivery();

  return (
    <div className="box mb-5">
      {!cartData?.cartItems?.length ? (
        <div className="notification is-warning">
          <p className="is-size-5">Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          <table className="table is-fullwidth is-striped is-hoverable">
            {isCartLoading ? (
              <thead>
                <tr>
                  <th>Грузим корзину...</th>
                </tr>
              </thead>
            ) : null}

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
                <GoodsItem key={goods.GOODS_MOD_ID} goods={goods} />
              ))}
            </tbody>
          </table>
        </>
      )}
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
  const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);

  const clearCartItemMutation = useMutation({
    mutationFn: cartApi.deleteItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });

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
            <button className="button is-small">-</button>
          </p>
          <p className="control">
            <input
              name={`form[quantity][${GOODS_MOD_ID}]`}
              className="input is-small has-text-centered"
              type="text"
              value={inputValue}
              onChange={(e) => {
                console.log(e.target.value);
                setInputValue(e.target.value);
                queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
              }}
              style={{ width: '50px' }}
            />
          </p>
          <p className="control">
            <button className="button is-small">+</button>
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
  const [couponCode, setCouponCode] = useState('');
  const [isCouponSend, setIsCouponSend] = useState(false);
  // const [cartState, setCartState] = useCartState();
  const { selectedDelivery, isLoading: isDeliveryLoading } =
    useQuickFormState();
  // console.log(selectedDelivery.id);
  const { data: cartData, isLoading: isCartLoading } = useCartWithDelivery(
    // selectedDelivery.id,
    // selectedDelivery.zoneId,
    couponCode,
    isCouponSend
  );

  // console.log(cartData?.CART_SUM_DELIVERY);

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: ({ data }) => {
      const { status, location: redirectLink, message } = data;

      if (status === 'error') {
        console.error(message);
      }

      if (redirectLink) {
        location.href = redirectLink;
      }
    },
  });

  // Компонент скелетона для цен
  const PriceSkeleton = () => (
    <span
      className="skeleton"
      style={{ width: '100px', height: '24px', display: 'inline-block' }}
    ></span>
  );

  return (
    <div className="box sticky-top" style={{ position: 'sticky', top: '20px' }}>
      <h3 className="title is-4 mb-4">Ваш заказ</h3>

      {/* Купон */}
      <div className="field has-addons mb-5">
        <div className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="Введите промокод"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>
        <div className="control">
          <button
            className="button is-info"
            onClick={() => setIsCouponSend(true)}
            disabled={!couponCode}
          >
            Применить
          </button>
        </div>
      </div>

      {/* Итоги заказа */}
      <div className="content">
        <p className="is-size-5 is-flex is-justify-content-space-between">
          <span>Итого:</span>
          <span className="has-text-weight-bold">
            {isCartLoading || isDeliveryLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_NOW
            )}
          </span>
        </p>
        <p className="is-size-5 is-flex is-justify-content-space-between">
          <span>Скидка:</span>
          <span className="has-text-weight-bold has-text-danger">
            {isCartLoading || isDeliveryLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_DISCOUNT
            )}
          </span>
        </p>

        <p className="is-size-5 is-flex is-justify-content-space-between">
          <span>Доставка:</span>
          <span className="has-text-weight-bold">
            {isCartLoading || isDeliveryLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_DELIVERY
            )}
          </span>
        </p>
        <hr />
        <p className="is-size-4 is-flex is-justify-content-space-between">
          <span>Итого:</span>
          <span className="has-text-weight-bold">
            {isCartLoading || isDeliveryLoading ? (
              <PriceSkeleton />
            ) : (
              cartData?.CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT
            )}
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
  const {
    deliveryOptions,
    selectedDelivery,
    setSelectedDelivery,
    isLoading: isDeliveryLoading,
  } = useQuickFormState();

  // const { data: cartData, isLoading: isCartLoading } = useCartWithDelivery(
  //   selectedDelivery.id,
  //   selectedDelivery.zoneId
  // );
  const [cartState, setCartState] = useCartState();
  // useEffect(() => {
  //   queryClient.invalidateQueries(['Cart']);
  // }, [selectedDelivery.id, selectedDelivery.zoneId]);
  // console.log('form', selectedDelivery.id);
  // console.log(cartData?.CART_SUM_DELIVERY);
  return (
    <div className="box mb-5">
      {/* Выбор доставки */}
      <div className="field mb-4">
        <label className="label">Доставка</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select
              // value={selectedDelivery.id}
              value={cartState?.form?.delivery?.id}
              onChange={(e) => {
                const deliveryId = e.target.value;
                const delivery =
                  deliveryOptions.find((d) => d.id === deliveryId) ||
                  deliveryOptions[0];
                // setSelectedDelivery(delivery);
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
              {isDeliveryLoading ? (
                <option>Загрузка...</option>
              ) : (
                deliveryOptions.map((delivery) => (
                  <option key={delivery.id} value={delivery.id}>
                    {delivery.name} ({delivery.price})
                  </option>
                ))
              )}
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
