const { useState, useEffect, useRef, createContext, useContext } = window.React;
const {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} = window.ReactQuery;
const { ReactQueryDevtools } = window.ReactQueryDevtools;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
const container = document.getElementById('root-cart');
const root = ReactDOM.createRoot(container);
const { HASH, Utils } = window;
const axios = window.axios;

const FormContext = createContext(null);

const INITIAL_FORM_DATA = {
  form: {
    contact: {
      person: 'Bob',
      phone: '898739525',
    },
    delivery: {
      id: undefined,
    },
    payment: {
      id: undefined,
    },
    coupon_code: '',
  },
};
const useFormState = (
  // key = 'formstate', initialData = INITIAL_FORM_DATA
  options
) => {
  const key = 'formState';
  // return [
  //   useQuery([key], ()=>initialData, {enabled: false, initialData}).data,
  //   (value)=>queryClient.setQueryData(key, value)
  // ]
  const query = useQuery({
    queryKey: [key],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
    ...options,
  });

  return [query.data, (value) => queryClient.setQueryData([key], value)];
};

const useDeliveries = (options) => {
  return useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const { data } = await axios.get(`/cart/add`, {
        responseType: 'text',
        params: {
          ajax_q: 1,
          fast_order: 1,
        },
      });
      const formData = JSON.parse(data);

      return formData.data;
    },
    ...options,
  });
};

const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await axios.get(`/cart`, {
        responseType: 'text',
        params: {
          only_body: 1,
          hash: HASH,
        },
      });

      const cardData = JSON.parse(data);

      return cardData;
    },
  });
};

const useClearCartMutation = (options) => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(`/cart/truncate/`);

      return response.status === 200;
    },
    ...options,
  });
};

const useCartMutation = (options) => {
  return useMutation({
    mutationFn: async (formState) => {
      const { form } = formState;
      // console.log('data', form, currentDeliveryId, currentPaymentId);
      const formData = new FormData();
      formData.append('only_body', 1);
      formData.append('hash', HASH);
      formData.append('form[delivery][id]', form.delivery.id);
      formData.append('form[payment][id]', form.payment.id);
      formData.append('form[coupon_code]', form.coupon_code);
      for (const pair of formData.entries()) {
        // console.log(pair[0] + ', ' + pair[1]);
      }
      const { data } = await axios.post(`/cart`, formData, {
        responseType: 'text',
      });

      const cardData = JSON.parse(data);

      queryClient.setQueryData(['cart'], cardData);
    },
    ...options,
  });
};

const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (formData) => {
      formData.append('ajax_q', 1);
      formData.append('hash', HASH);

      return axios.post(`/order/stage/confirm`, formData);
    },
  });
};

function Cart() {
  const formRef = useRef();
  const { data: cartData, refetch: refetchCart } = useCart();
  const cartMutation = useCartMutation();
  const clearCartMutation = useClearCartMutation({
    onSuccess: () => {
      refetchCart();
    },
  });
  const [formState, setFormState] = useFormState({
    onSuccess: (formData) => {
      cartMutation.mutate(formData);
    },
  });

  const { isLoading: isLoadingDeliveries } = useDeliveries({
    onSuccess: (deliveries) => {
      const [delivery] = deliveries;

      setFormState((prev) => ({
        form: {
          ...prev.form,
          delivery: {
            id: delivery?.id,
          },
          payment: {
            id: delivery?.availablePaymentList[0]?.id,
          },
        },
      }));
      // console.log(formRef.current);
      // cartMutation.mutate(formRef.current);
    },
  });

  const { currentDeliveryId, currentPaymentId, couponCode } = {
    currentDeliveryId: formState?.form?.delivery?.id,
    currentPaymentId: formState?.form?.payment?.id,
  };

  if (!cartData) {
    return null;
  }

  const {
    CART_SUM_DISCOUNT,
    CART_SUM_DISCOUNT_PERCENT,
    CART_COUNT_TOTAL,
    CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT,
    cartItems,
    CART_SUM_NOW,
    FORM_NOTICE,
    FORM_NOTICE_STATUS,
    CART_SUM_DELIVERY,
    CART_SUM_NOW_WITH_DELIVERY,
  } = cartData;

  if (!CART_COUNT_TOTAL) {
    return null;
  }

  const handleSubmit = (event) => {
    event?.preventDefault();
    console.log('handle');

    Utils.debounce(() => {
      cartMutation.mutate(formState);
    }, 300)();
  };

  return (
    <>
      <h1>Корзина</h1>
      <div style={{ display: 'flex' }}>
        <button
          className="button _transparent"
          onClick={() => {
            console.log('clear');
            clearCartMutation.mutate();
          }}
        >
          Очистить корзину
        </button>

        {cartMutation.isLoading && <span>(Обновление корзины...)</span>}
      </div>

      <form onSubmit={handleSubmit} ref={formRef} id="card">
        <input
          name="form[delivery][id]"
          defaultValue={currentDeliveryId}
          hidden
        />
        <input
          name="form[payment][id]"
          defaultValue={currentPaymentId}
          hidden
        />
        <input name="form[coupon_code]" defaultValue={couponCode} hidden />
        <ul>
          {cartItems.map((item) => (
            <CartItem
              item={item}
              key={item.GOODS_MOD_ID}
              handleSubmit={handleSubmit}
            />
          ))}
        </ul>
      </form>

      <ul>
        <li>Товаров: {CART_COUNT_TOTAL} шт.</li>
        <li>Сумма товаров: {CART_SUM_NOW}</li>
        <li>
          Доставка: {CART_SUM_DELIVERY} - {currentDeliveryId}
        </li>
        <li>Метод оплаты: {currentPaymentId}</li>
        <li>Скидка: {CART_SUM_DISCOUNT}</li>
        <li>Скидка процент: {CART_SUM_DISCOUNT_PERCENT}</li>
        <li>Итого с доставкой: {CART_SUM_NOW_WITH_DELIVERY}</li>
        <li>
          Итого с доставкой и скидкой: {CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT}
        </li>
      </ul>
    </>
  );
}

function CartItem({ item, handleSubmit }) {
  const {
    GOODS_MOD_ID,
    GOODS_NAME,
    GOODS_MOD_PRICE_NOW,
    ORDER_LINE_QUANTITY,
    GOODS_IMAGE,
  } = item;
  const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);

  // useEffect(() => {
  //   if (inputValue > 0) {
  //     handleSubmit();
  //   }
  // }, [inputValue]);

  const handleBlur = (event) => {
    const { value } = event.target;

    if (value < 1) {
      setInputValue(1);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(Number(value));

    if (value > 0) {
      handleSubmit();
    }
  };

  const handlePaste = () => {};

  return (
    <li data-key={GOODS_MOD_ID}>
      <h3>{GOODS_NAME}</h3>
      <div>
        <strong>Кол-во:{inputValue}</strong>
      </div>
      <div>
        <strong>Цена:{GOODS_MOD_PRICE_NOW}</strong>
      </div>
      <img width="80" src={GOODS_IMAGE} />
      <div className="qty">
        <div className="qty__wrap">
          <button
            type="submit"
            className="qty__btn"
            onClick={() => {
              setInputValue(inputValue - 1);
            }}
          >
            <svg className="icon">
              <use xlinkHref="/design/sprite.svg#minus-icon"></use>
            </svg>
          </button>
          <input
            name={`form[quantity][${GOODS_MOD_ID}]`}
            min="1"
            type="number"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onPaste={handlePaste}
            className="input qty__input"
          />
          <button
            type="submit"
            className="qty__btn"
            onClick={() => {
              setInputValue(inputValue + 1);
            }}
          >
            <svg className="icon">
              <use xlinkHref="/design/sprite.svg#plus-icon"></use>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

function OrderForm() {
  const { data: cartData, refetch: refetchCart } = useCart();
  const [formState, setFormState] = useFormState();
  const { data: orderDelivery, isLoading } = useDeliveries();
  const createOrderMutation = useCreateOrderMutation();
  const isOrderLoading = createOrderMutation.isLoading;
  const {
    form: {
      delivery: { id: deliveryId },
      payment: { id: paymentId },
      coupon_code: couponCode,
    },
  } = formState;
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    for (const pair of formData.entries()) {
      // console.log(pair[0] + ', ' + pair[1]);formData
    }
    createOrderMutation.mutate(formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Разбиваем строку "form[contact][person]" на массив ключей ["form", "contact", "person"]
    const keys = name.split(/\[|\]/).filter(Boolean);

    const fieldData = keys.reduceRight((acc, key, index) => {
      const isLast = index === keys.length - 1;

      return { [key]: isLast ? value : acc };
    }, {});
    // console.dir(fieldData);
    const newData = Utils.mergeWith(
      { ...formState },
      fieldData,
      Utils.customizer
    );
    // const newData = _.mergeWith({ ...formState }, fieldData);
    // console.log(newData);

    setFormState(newData);
  };

  if (isLoading) {
    return <div>Загружаю варианты доставки...</div>;
  }

  if (!orderDelivery?.length || !cartData) {
    return null;
  }

  return (
    <>
      {/* Форма заказа */}
      <form onSubmit={handleSubmit} id="orderForm">
        <input
          className="input"
          name="form[contact][person]"
          value={formState.form.contact.person}
          onChange={handleChange}
          maxLength="100"
          type="text"
          placeholder="Имя"
          required
        />
        <input
          className="input"
          name="form[contact][phone]"
          value={formState.form.contact.phone}
          onChange={handleChange}
          maxLength="255"
          pattern="\+?\d*"
          type="tel"
          placeholder="Телефон"
          required
        />
        <input
          className="input"
          name="form[coupon_code]"
          value={couponCode}
          onChange={handleChange}
          maxLength="255"
          type="text"
          placeholder="Купон"
        />
        {orderDelivery?.length ? (
          <>
            <select
              onChange={handleChange}
              name="form[delivery][id]"
              className="quickform__select"
              value={deliveryId}
            >
              {orderDelivery.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </select>
            <select
              onChange={handleChange}
              name="form[payment][id]"
              className="quickform__select"
              value={paymentId}
            >
              {orderDelivery
                .filter((el) => el.id === deliveryId)
                .map((el) => {
                  return el.availablePaymentList.map(({ id, name }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ));
                })}
            </select>
          </>
        ) : null}
        <hr />
        <button className="button" disabled={isOrderLoading}>
          {isOrderLoading ? 'Оформляется...' : 'Оформить'}
        </button>
      </form>
    </>
  );
}

function EmptyCart() {
  const { data, isLoading } = useCart();

  if (isLoading) {
    return <>Загрузка...</>;
  }

  if (data?.CART_COUNT_TOTAL && !isLoading) {
    return null;
  }

  return (
    <>
      <h1>Ваша корзина пуста</h1>
      <a className="button" href="/">
        Перейти на главную
      </a>
    </>
  );
}

function App() {
  return (
    <>
      <EmptyCart />
      <Cart />
      <OrderForm />
    </>
  );
}

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
