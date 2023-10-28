const { useState, useEffect, useRef } = window.React;
const { Provider, useSelector, useDispatch } = window.ReactRedux;
const { configureStore, createSlice, createAsyncThunk } = window.RTK;
const {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} = window.ReactQuery;
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
const { HASH, Utils } = window;
const axios = window.axios;

const useForm = () => {
  return useQuery({
    queryKey: ["form"],
    queryFn: async () => {
      const { data } = await axios.get(`/cart/add?ajax_q=1&fast_order=1`, {
        responseType: "text",
      });
      const formData = JSON.parse(data);

      return formData;
    },
  });
};

const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("only_body", 1);
      formData.append("hash", HASH);
      formData.append("form[delivery][id]", "");
      formData.append("form[payment][id]", "");

      const { data } = await axios.post(`/cart`, formData, {
        responseType: "text",
      });

      const cardData = JSON.parse(data);

      return cardData;
    },
  });
};

const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (formData) => {
      formData.append("ajax_q", 1);
      formData.append("hash", HASH);

      return axios.post(`/order/stage/confirm`, formData);
    },
  });
};

function Cart() {
  const { data } = useCart();
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
  } = data;
  // const isUpdating = useSelector((state) => state.card.updating);
  // const form = useSelector((state) => state.form.form);
  // const { currentDeliveryId, currentPaymentId, couponCode } = form;
  const { currentDeliveryId, currentPaymentId, couponCode } = {};
  // const dispatch = useDispatch();
  const formRef = useRef();

  const debouncedSubmit = Utils.debounce(() => {
    const formData = new FormData(formRef.current);
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    // dispatch(updateCardAction(formData));
  }, 300);

  const handleSubmit = (event) => {
    event?.preventDefault();
    debouncedSubmit();
  };

  // useEffect(() => {
  //   if (currentDeliveryId) {
  //     handleSubmit();
  //   }
  // }, [currentDeliveryId]);

  // useEffect(()=>{
  //   new Noty({
  //     text: `<div class="noty_content">${FORM_NOTICE}</div>`,
  //     type: `${FORM_NOTICE_STATUS}`
  //   }).show()
  // }, [FORM_NOTICE])
  return (
    <>
      {/* <button
        className="button _transparent"
        onClick={() => {
          console.log("clear");
          dispatch(clearCardAction());
        }}
      >
        Очистить корзину
      </button> */}

      {/* {isUpdating && <>Обновление корзины...</>} */}
      {/* {FORM_NOTICE && <p>{FORM_NOTICE}</p>} */}
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
        <li>Доставка: {CART_SUM_DELIVERY}</li>
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
  const { data, isLoading } = useForm();

  // const { orderDelivery } = useSelector((state) => state.form.data);
  const orderDelivery = data?.orderDelivery;
  console.log(data, orderDelivery);

  // const form = useSelector((state) => state.form.form);
  // const { currentDeliveryId, currentPaymentId } = form;
  const { currentDeliveryId, currentPaymentId } = {
    currentDeliveryId: "123",
    currentPaymentId: "111",
  };
  // const isDataLoading = useSelector((state) => state.form.dataLoading);
  const createOrderMutation = useCreateOrderMutation();
  const isOrderLoading = createOrderMutation.isLoading;
  // const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    form: {
      contact: {
        person: "Bob",
        phone: "898739525",
      },
      delivery: {
        id: currentDeliveryId,
      },
      payment: {
        id: currentPaymentId,
      },
      coupon_code: "",
    },
  });
  const {
    form: {
      delivery: { id: deliveryId },
      payment: { id: paymentId },
      coupon_code: couponCode,
    },
  } = formState;
  console.log(formState);
  // useEffect(() => {
  //   if (couponCode) {
  //     dispatch(setCouponCode(couponCode));
  //   }
  // }, [couponCode]);

  // useEffect(() => {
  //   if (deliveryId || paymentId) {
  //     dispatch(setCurrentDeliveryId(deliveryId));
  //     dispatch(setCurrentPaymentId(paymentId));
  //   }
  // }, [deliveryId, paymentId]);

  // useEffect(() => {
  //   const [delivery] = orderDelivery;

  //   setFormState(prev => ({
  //     form: {
  //       ...prev.form,
  //       delivery: {
  //         id: delivery?.id,
  //       },
  //       payment: {
  //         id: delivery?.availablePaymentList[0]?.id,
  //       },
  //     },
  //   }));
  // }, [orderDelivery]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    createOrderMutation.mutate(formData);
    // dispatch(createOrderAction(formData));
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

  return (
    <>
      {isLoading ? (
        <>Загружаю варианты доставки...</>
      ) : (
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
                    .filter((el) => el.id === Number(deliveryId))
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
              {isOrderLoading ? "Оформляется..." : "Оформить"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

function App() {
  const { data, isLoading, error } = useCart();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {data?.cartItems?.length ? (
        <>
          <Cart />
          <OrderForm />
        </>
      ) : (
        <>
          <h2>Корзина пуста</h2>
        </>
      )}
    </>
  );
}

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
