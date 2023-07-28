const { useState, useEffect, useRef } = React;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { configureStore, createSlice, createAsyncThunk } = RTK;
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
const { HASH, Utils } = window;
const api = axios.create();

const getCardAction = createAsyncThunk(
  "card/get",
  async (_, { extra: api, getState }) => {
    const state = getState();
    const {
      form: {
        form: { currentDeliveryId, currentPaymentId },
      },
    } = state;

    const formData = new FormData();
    formData.append("only_body", 1);
    formData.append("hash", HASH);
    formData.append("form[delivery][id]", currentDeliveryId);
    formData.append("form[payment][id]", currentPaymentId);

    const { data } = await api.post(`/cart`, formData, {
      responseType: "text",
    });

    const cardData = JSON.parse(data);

    return cardData;
  }
);
const updateCardAction = createAsyncThunk(
  "card/update",
  async (formData, { extra: api }) => {
    formData.append("fast_order", 1);
    formData.append("only_body", 1);
    formData.append("hash", HASH);

    // formData.append("form[delivery][id]", "430658");
    // formData.append("form[payment][id]", "422958");

    const { data } = await api.post(`/cart`, formData, {
      responseType: "text",
    });
    const newCardData = JSON.parse(data);

    return newCardData;
  }
);
const clearCardAction = createAsyncThunk(
  "card/clear",
  async (_, { extra: api }) => {
    const response = await api.get(`/cart/truncate/`);

    return response.status === 200;
  }
);

const getFormAction = createAsyncThunk(
  "form/get",
  async (_, { extra: api }) => {
    const params = new URLSearchParams({ ajax_q: 1, fast_order: 1 });

    const { data } = await api.post(`/cart/add`, params, {
      responseType: "text",
    });

    const newOrderFormData = JSON.parse(data);

    return newOrderFormData;
  }
);
const createOrderAction = createAsyncThunk(
  "form/createOrder",
  async (formData, { extra: api }) => {
    formData.append("ajax_q", 1);
    formData.append("hash", HASH);

    const { data } = await api.post(`/order/stage/confirm`, formData);

    // console.log(data);

    return data;
  }
);

const cardSlice = createSlice({
  name: "card",
  initialState: {
    data: {},
    loading: false,
    updating: false,
    error: false,
  },
  extraReducers(builder) {
    builder.addCase(getCardAction.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getCardAction.pending, state => {
      state.loading = true;
    });
    builder.addCase(getCardAction.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateCardAction.fulfilled, (state, action) => {
      state.data = action.payload;
      state.updating = false;
    });
    builder.addCase(updateCardAction.pending, state => {
      state.updating = true;
    });
    builder.addCase(updateCardAction.rejected, state => {
      state.updating = false;
    });
    builder.addCase(clearCardAction.fulfilled, (state, action) => {
      state.data.cartItems = action.payload ? [] : state.data.cartItems;
      state.loading = false;
    });
    builder.addCase(clearCardAction.pending, state => {
      state.loading = true;
    });
    builder.addCase(clearCardAction.rejected, state => {
      state.loading = false;
    });
  },
});

const formSlice = createSlice({
  name: "form",
  initialState: {
    form: {
      currentDeliveryId: "",
      currentPaymentId: "",
      couponCode: "",
    },
    order: {
      loading: false,
      location: undefined,
      status: undefined,
      error: undefined,
    },
    data: {
      orderDelivery: [],
    },
    dataLoading: false,
    error: false,
  },
  reducers: {
    setCouponCode: (state, action) => {
      state.form.couponCode = action.payload;
    },
    setCurrentDeliveryId: (state, action) => {
      state.form.currentDeliveryId = action.payload;
    },
    setCurrentPaymentId: (state, action) => {
      state.form.currentPaymentId = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getFormAction.fulfilled, (state, action) => {
      const { payload } = action;
      state.data = payload;
      state.dataLoading = false;
      const { orderDelivery } = payload;
      const delivery = orderDelivery[0];

      state.form.currentDeliveryId = delivery?.id;
      state.form.currentPaymentId = delivery?.availablePaymentList[0]?.id;
    });
    builder.addCase(getFormAction.pending, state => {
      state.dataLoading = true;
    });
    builder.addCase(getFormAction.rejected, state => {
      state.dataLoading = false;
    });
    builder.addCase(createOrderAction.fulfilled, (state, action) => {
      const { status, location } = action.payload;

      state.order.loading = false;
      state.order.status = status;
      state.order.location = location;
    });
    builder.addCase(createOrderAction.pending, state => {
      state.order.loading = true;
    });
    builder.addCase(createOrderAction.rejected, state => {
      state.order.loading = false;
    });
  },
});
const { setCurrentDeliveryId, setCurrentPaymentId, setCouponCode } =
  formSlice.actions;

const store = configureStore({
  reducer: {
    card: cardSlice.reducer,
    form: formSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

store.dispatch(getFormAction());

function Card() {
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
  } = useSelector(state => state.card.data);
  const isUpdating = useSelector(state => state.card.updating);
  const form = useSelector(state => state.form.form);
  const { currentDeliveryId, currentPaymentId, couponCode } = form;
  const dispatch = useDispatch();
  const formRef = useRef();

  const debouncedSubmit = Utils.debounce(() => {
    const formData = new FormData(formRef.current);

    dispatch(updateCardAction(formData));
  }, 300);

  const handleSubmit = event => {
    event?.preventDefault();
    debouncedSubmit();
  };

  useEffect(() => {
    if (currentDeliveryId) {
      handleSubmit();
    }
  }, [currentDeliveryId]);

  // useEffect(()=>{
  //   new Noty({
  //     text: `<div class="noty_content">${FORM_NOTICE}</div>`,
  //     type: `${FORM_NOTICE_STATUS}`
  //   }).show()
  // }, [FORM_NOTICE])

  return (
    <>
      <button
        className="button _transparent"
        onClick={() => {
          console.log("clear");
          dispatch(clearCardAction());
        }}
      >
        Очистить корзину
      </button>

      {isUpdating && <>Обновление корзины...</>}
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
          {cartItems.map(item => (
            <CardItem
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

function CardItem({ item, handleSubmit }) {
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

  const handleBlur = event => {
    const { value } = event.target;

    if (value < 1) {
      setInputValue(1);
    }
  };

  const handleChange = event => {
    const { value } = event.target;
    setInputValue(Number(value));

    if (value > 0) {
      handleSubmit();
    }
  };

  const handlePaste = () => {};

  return (
    <li key={GOODS_MOD_ID}>
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
  const { orderDelivery } = useSelector(state => state.form.data);
  const form = useSelector(state => state.form.form);
  const { currentDeliveryId, currentPaymentId } = form;
  const isDataLoading = useSelector(state => state.form.dataLoading);
  const isOrderLoading = useSelector(state => state.form.order.loading);
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (couponCode) {
      dispatch(setCouponCode(couponCode));
    }
  }, [couponCode]);

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

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData(event.target);

    dispatch(createOrderAction(formData));
  };

  const handleChange = event => {
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
      {isDataLoading && <>Загружаю варианты доставки...</>}
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
        {orderDelivery.length ? (
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
                .filter(el => el.id === Number(deliveryId))
                .map(el => {
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
  );
}

function App() {
  const { cartItems } = useSelector(state => state.card.data);
  const isLoading = useSelector(state => state.card.loading);
  const isDataLoading = useSelector(state => state.form.dataLoading);
  const status = useSelector(state => state.form.order.status);
  const location = useSelector(state => state.form.order.location);
  const form = useSelector(state => state.form.form);
  const { currentDeliveryId } = form;
  const dispatch = useDispatch();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (currentDeliveryId && firstRender) {
      console.log("currentDeliveryId", currentDeliveryId);
      dispatch(getCardAction());
      setFirstRender(false);
    }
  }, [currentDeliveryId]);

  if (status === "ok") {
    return (
      <>
        <h2>Заказ успешно оформлен!</h2>
        <a href={location}>ссылка на заказ</a>
      </>
    );
  }

  if (isLoading || isDataLoading || !currentDeliveryId) {
    return <h2>Загрузка корзины...</h2>;
  }

  return (
    <>
      {cartItems?.length ? (
        <>
          <Card />
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
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
