(() => {
  const { useState, useEffect, useRef } = window.React;
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
  const { createRoot } = window.ReactDOM;
  const root = createRoot(container);

  const QUERY_KEYS = {
    Cart: 'Cart',
    FormState: 'FormState',
    QuickFormData: 'QuickFormData',
  };

  const INITIAL_FORM_DATA = {
    form: {
      contact: {
        person: '',
        phone: '',
        email: '',
      },
      delivery: {
        id: undefined,
        zone_id: undefined,
      },
      payment: {
        id: undefined,
      },
      coupon_code: '',
      isCouponSend: false,
    },
  };
  const useFormState = (options) => {
    const key = QUERY_KEYS.FormState;
    const query = useQuery({
      queryKey: [key],
      initialData: INITIAL_FORM_DATA,
      queryFn: () => initialData,
      enabled: false,
      ...options,
    });

    return [query.data, (value) => queryClient.setQueryData([key], value)];
  };

  const useQuickFormData = (option) => {
    const [_, setFormState] = useFormState();

    return useQuery({
      queryKey: [QUERY_KEYS.QuickFormData],
      initialData: {},
      queryFn: async () => {
        const { data: dataString } = await axios.get(`/cart/add`, {
          responseType: 'text',
          params: {
            ajax_q: 1,
            fast_order: 1,
          },
        });

        return JSON.parse(dataString).data;
      },
      onSuccess: (data) => {
        const {
          ORDER_FORM_CONTACT_PERSON,
          ORDER_FORM_CONTACT_PHONE,
          ORDER_FORM_CONTACT_EMAIL,
        } = data;

        const [firstDelivery] = data?.deliveries;

        setFormState((prev) => ({
          form: {
            ...prev.form,
            contact: {
              person: ORDER_FORM_CONTACT_PERSON || 'User',
              phone: ORDER_FORM_CONTACT_PHONE || '89876543210',
              email: ORDER_FORM_CONTACT_EMAIL || 'user@test.ru',
            },
            delivery: {
              id: firstDelivery?.id,
              zone_id: firstDelivery?.zoneList[0]?.zoneId,
            },
            payment: {
              id: firstDelivery?.availablePaymentList[0]?.id,
            },
          },
        }));
      },
      ...option,
    });
  };

  const useCart = (option, formElement) => {
    return useQuery({
      queryKey: [QUERY_KEYS.Cart],
      queryFn: async () => {
        if (!formElement) return;
        const formData = new FormData(formElement);
        // formData.append('ajax_q', 1);
        // formData.append('only_body', 1);

        for (const pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
        const { data } = await axios.post(`/cart`, formData, {
          // const { data } = await axios.post(`/order/stage/confirm`, formData, {
          responseType: 'text',
          params: {
            only_body: 1,
            hash: window.HASH,
          },
        });

        const cardData = JSON.parse(data);

        return cardData;
      },
      enabled: Boolean(formElement),
      ...option,
    });
  };

  const useClearCartMutation = (options) => {
    return useMutation({
      mutationFn: async () => {
        const response = await axios.get(`/cart/truncate/`);
        const isOk = response.status === 200;
        if (isOk) {
          queryClient.setQueryData([QUERY_KEYS.Cart], null);
        }
        return isOk;
      },
      ...options,
    });
  };
  const useClearCartItemMutation = (options) => {
    return useMutation({
      mutationFn: async (itemId) => {
        const response = await axios.get(`/cart/delete/${itemId}`);

        return response.status;
      },
      ...options,
    });
  };

  const useCreateOrderMutation = () => {
    return useMutation({
      mutationFn: (form) => {
        const formData = new FormData(form);

        for (const pair of formData.entries()) {
          // console.log(pair[0] + ', ' + pair[1]);formData
        }

        return axios.post(`/order/stage/confirm`, formData, {
          params: {
            ajax_q: 1,
            hash: window.HASH,
          },
        });
      },
      onSuccess: ({ data }) => {
        location.href = data.location;
      },
    });
  };

  function Cart() {
    const formRef = useRef(null);
    const formElement = formRef?.current;
    const [formState, setFormState] = useFormState();
    const {
      form: {
        delivery: { id: currentDeliveryId, zone_id: zoneId },
        payment: { id: currentPaymentId },
        coupon_code: couponCode,
        isCouponSend,
      },
    } = formState;

    const {
      data: cartData,
      refetch: refetchCart,
      isSuccess: isSuccessCart,
      isLoading: isLoadingCart,
      isFetching: isFetchingCart,
    } = useCart(
      {
        onSuccess: () => {
          setFormState({
            ...formState,
            form: {
              ...formState.form,
              isCouponSend: false,
            },
          });
        },
      },
      formElement
    );

    useEffect(() => {
      console.log(isCouponSend, currentDeliveryId, zoneId);
      if (isCouponSend || currentDeliveryId || zoneId) {
        refetchCart();
      }
    }, [isCouponSend, currentDeliveryId, zoneId]);

    const {
      CART_SUM_DISCOUNT,
      CART_SUM_DISCOUNT_PERCENT,
      CART_COUNT_TOTAL,
      CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT,
      cartItems,
      CART_SUM_NOW,
      CART_SUM_DELIVERY,
      CART_SUM_OLD_WITH_DELIVERY,
      CART_SUM_SUPPLIER_WITH_DELIVERY,
      CART_SUM_NOW_WITH_DELIVERY,
    } = cartData || {};
    const isCartItemsLength = cartItems?.length;
    const clearCartMutation = useClearCartMutation();

    const handleSubmit = (event) => {
      event?.preventDefault();

      window.Utils.debounce(() => {
        refetchCart();
      }, 300)();
    };

    if (window.CART_IS_EMPTY) {
      return null;
    }

    return (
      <>
        <div className="cart" style={{ position: 'relative' }}>
          {(isFetchingCart || clearCartMutation.isLoading) && <Preloader />}

          {isCartItemsLength ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
              <h1>Корзина</h1>
              <button
                className="button"
                onClick={() => {
                  clearCartMutation.mutate();
                }}
              >
                {clearCartMutation.isLoading
                  ? '(Очищается..)'
                  : 'Очистить корзину'}
              </button>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} ref={formRef} id="card">
            <input
              name="form[delivery][id]"
              defaultValue={currentDeliveryId}
              hidden
            />
            {zoneId && (
              <input
                name="form[delivery][zone_id]"
                defaultValue={zoneId}
                hidden
              />
            )}
            <input
              name="form[payment][id]"
              defaultValue={currentPaymentId}
              hidden
            />
            {isCouponSend && couponCode && (
              <input
                name="form[coupon_code]"
                defaultValue={couponCode}
                hidden
              />
            )}

            {isCartItemsLength ? (
              <ul>
                {cartItems.map((item) => (
                  <CartItem
                    item={item}
                    key={item.GOODS_MOD_ID}
                    handleSubmit={handleSubmit}
                    refetchCart={refetchCart}
                  />
                ))}
              </ul>
            ) : null}
          </form>
          {isCartItemsLength ? (
            <ul>
              <li>Товаров: {CART_COUNT_TOTAL} шт.</li>
              <li>Сумма товаров: {CART_SUM_NOW}</li>
              <li>
                Доставка (id: {currentDeliveryId}):{' '}
                <b>{zoneId ? CART_SUM_OLD_WITH_DELIVERY : CART_SUM_DELIVERY}</b>
              </li>
              {zoneId && (
                <li>
                  Зона доставки (zoneId: {zoneId}): <b></b>
                </li>
              )}
              <li>Метод оплаты (id): {currentPaymentId}</li>
              <li>Купон : {couponCode}</li>
              <li>Скидка: {CART_SUM_DISCOUNT}</li>
              <li>Скидка процент: {CART_SUM_DISCOUNT_PERCENT}</li>
              <li>Итого с доставкой: {CART_SUM_NOW_WITH_DELIVERY}</li>
              {/* <li>Итого old с доставкой: {CART_SUM_OLD_WITH_DELIVERY}</li> */}
              <li>
                Итого с доставкой и скидкой:{' '}
                <b>{CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT}</b>
              </li>
            </ul>
          ) : null}
        </div>
      </>
    );
  }

  function CartItem({ item, handleSubmit, refetchCart }) {
    const {
      GOODS_MOD_ID,
      GOODS_NAME,
      GOODS_MOD_PRICE_NOW,
      ORDER_LINE_QUANTITY,
      GOODS_IMAGE,
    } = item;
    const deleteCartItemMutation = useClearCartItemMutation({
      onSuccess: () => {
        refetchCart();
      },
    });
    const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);
    const handleBlur = (event) => {
      const { value } = event.target;

      if (value < 1) {
        setInputValue(1);
      }
    };

    const handleChange = (event) => {
      const { value } = event.target;
      setInputValue(Number(value));

      if (Number(value) > 0) {
        handleSubmit();
      }
    };
    const handleRemoveItem = () => {
      deleteCartItemMutation.mutate(GOODS_MOD_ID);
    };
    const handlePaste = () => {};

    if (deleteCartItemMutation.isSuccess) {
      return null;
    }

    return (
      <li data-key={GOODS_MOD_ID} style={{ position: 'relative' }}>
        {deleteCartItemMutation.isLoading && <Preloader />}
        <div style={{ display: 'flex', gap: 20 }}>
          <h3>{GOODS_NAME}</h3>
          <button
            // hidden
            onClick={handleRemoveItem}
            type="button"
            title="Удалить из корзины"
          >
            <span className="cart__delete-icon">
              <svg className="icon _close">
                <use xlinkHref="/design/sprite.svg#close"></use>
              </svg>
            </span>
          </button>
        </div>
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
    const { data: cartData } = useCart();
    const [formState, setFormState] = useFormState();
    const { data: quickFormData, isLoading: isLoadingDelivery } =
      useQuickFormData({
        enabled: !Boolean(window.CART_IS_EMPTY),
      });
    const { deliveries, CLIENT_IS_LOGIN } = quickFormData;
    const createOrderMutation = useCreateOrderMutation();
    const { isLoading: isOrderLoading } = createOrderMutation;
    const {
      form: {
        delivery: { id: deliveryId, zone_id: zoneId },
        payment: { id: paymentId },
        coupon_code: couponCode,
      },
    } = formState;
    const zoneList = deliveries?.find(({ id }) => id === deliveryId)?.zoneList;
    const localFormState = useState({
      wantRegister: false,
      addressCollapsed: false,
      extraDontCall: false,
    });
    const [localForm, setLocalFormState] = localFormState;
    const { wantRegister, extraDontCall } = localForm;
    const handleSubmit = (event) => {
      event.preventDefault();
      const formElement = event.target;

      createOrderMutation.mutate(formElement);
    };

    const handleChange = (event) => {
      const { name, value, id } = event.target;
      // Разбиваем строку "form[contact][person]" на массив ключей ["form", "contact", "person"]
      const keys = name.split(/\[|\]/).filter(Boolean);

      const fieldData = keys.reduceRight((acc, key, index) => {
        const isLast = index === keys.length - 1;

        return { [key]: isLast ? value : acc };
      }, {});

      if (id === 'delivery-select') {
        const zL = deliveries?.find(({ id }) => id === value)?.zoneList;

        fieldData.form.delivery.zone_id = zL[0]?.zoneId;
        console.log(keys, zL, fieldData);
      }
      console.log(fieldData);
      const newData = Utils.mergeWith(
        { ...formState },
        fieldData,
        Utils.customizer
      );

      setFormState(newData);
    };
    const handleCouponBtn = () => {
      setFormState({
        ...formState,
        form: {
          ...formState.form,
          isCouponSend: true,
        },
      });
      console.log('reset');
    };

    if (window.CART_IS_EMPTY || !cartData?.CART_COUNT_TOTAL) {
      return null;
    }

    if (isLoadingDelivery) {
      return <div>Загружаю варианты доставки...</div>;
    }
    // console.log(zoneList);
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
            name="form[contact][email]"
            value={formState.form.contact.email}
            onChange={handleChange}
            maxLength="255"
            type="email"
            placeholder="Email"
          />
          {!CLIENT_IS_LOGIN && (
            <>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="contactWantRegister"
                  name="form[contact][want_register]"
                  value="1"
                  onChange={() =>
                    setLocalFormState({
                      ...localForm,
                      wantRegister: !wantRegister,
                    })
                  }
                />
                <label htmlFor="contactWantRegister">
                  Я хочу зарегистрироваться
                </label>
              </div>
              {wantRegister && (
                <input
                  className="input"
                  type="password"
                  name="form[contact][pass]"
                  maxLength="50"
                  minLength="6"
                  placeholder="Придумайте пароль"
                />
              )}
            </>
          )}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <input
              className="input"
              name="form[coupon_code]"
              value={couponCode}
              onChange={handleChange}
              maxLength="255"
              type="text"
              placeholder="Купон (123456)"
            />
            <button
              disabled={!couponCode}
              onClick={handleCouponBtn}
              className="button"
              type="button"
            >
              Применить
            </button>
          </div>
          {deliveries?.length ? (
            <>
              <select
                onChange={handleChange}
                name="form[delivery][id]"
                className="quickform__select"
                value={deliveryId}
                id="delivery-select"
              >
                {deliveries.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name} - (id:{id})
                  </option>
                ))}
              </select>
              {zoneList?.length ? (
                <select
                  onChange={handleChange}
                  name="form[delivery][zone_id]"
                  className="quickform__select"
                  value={zoneId}
                >
                  {zoneList.map(({ zoneId, name }) => (
                    <option value={zoneId} key={zoneId}>
                      {name} - (zoneId:{zoneId})
                    </option>
                  ))}
                </select>
              ) : null}

              <select
                onChange={handleChange}
                name="form[payment][id]"
                className="quickform__select"
                value={paymentId}
              >
                {deliveries
                  .filter((el) => el.id === deliveryId)
                  .map((el) => {
                    return el.availablePaymentList.map(({ id, name }) => (
                      <option value={id} key={id}>
                        {name} -(id:{id})
                      </option>
                    ));
                  })}
              </select>
            </>
          ) : null}
          <hr />
          <Adresses
            localFormState={localFormState}
            quickFormData={quickFormData}
          />
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <input
              type="checkbox"
              id="contactWantRegister"
              onChange={() =>
                setLocalFormState({
                  ...localForm,
                  extraDontCall: !extraDontCall,
                })
              }
              checked={extraDontCall}
              name="form[extra][Дозвон]"
              value="НЕ ПЕРЕЗВАНИВАТЬ"
            />
            <label htmlFor="contactWantRegister">Не перезванивать</label>
          </div>
          <button className="button _big" disabled={isOrderLoading}>
            {isOrderLoading ? 'Оформляется...' : 'Оформить'}
          </button>
        </form>
      </>
    );
  }

  function Preloader() {
    return (
      <div className="preloader _opacity">
        <span className="content-loading"></span>
      </div>
    );
  }

  function EmptyCart() {
    const { data: cartData, isSuccess } = useCart();
    const isCartEmpty =
      window.CART_IS_EMPTY || (!cartData?.CART_COUNT_TOTAL && isSuccess);

    if (!isCartEmpty) {
      return null;
    }

    return (
      <div className="empty-cart">
        <h3>Ваша корзина пуста</h3>
        <p>Вернитесь на главную и выберите интересующий товар.</p>
        <a className="button" href="/">
          Перейти на главную
        </a>
      </div>
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

  function Adresses({ localFormState, quickFormData }) {
    const Nouislider = window.ReactNouislider;
    const [localForm, setLocalFormState] = localFormState;
    const { addressCollapsed } = localForm;
    const {
      ORDER_FORM_CONTACT_ADDR,
      ORDER_FORM_CONTACT_CITY,
      ORDER_FORM_CONTACT_REGION,
      ORDER_FORM_CONTACT_ZIP_CODE,
      ORDER_FORM_CONTACT_COUNTRY,
      ORDER_FORM_DELIVERY_REGION,
      ORDER_FORM_DELIVERY_CITY,
      ORDER_FORM_DELIVERY_COUNTRY_ID,
      countryList,
      SETTINGS_ORDER_FIELDS,
    } = quickFormData;
    const { Country, ConvenientTime, ZipCode, Region, City, Address, Comment } =
      SETTINGS_ORDER_FIELDS;
    const [{ from, to }, setConvenentState] = useState({
      from: 0,
      to: 24,
    });
    const [date, setDate] = useState('');

    return (
      <>
        {/* <!-- Адрес доставки--> */}
        <section className="quickform__row -adress form-callapse">
          <button
            type="button"
            className="form-callapse__title"
            onClick={() => {
              setLocalFormState({
                ...localForm,
                addressCollapsed: !addressCollapsed,
              });
            }}
          >
            <span className="quickform__title">Адрес доставки заказа</span>
          </button>
          <div
            className={
              'quickform__list -adress-inputs-list form-callapse__list' +
              (addressCollapsed ? '' : ' _active')
            }
          >
            <div>
              {/* <!-- Если поле страны доставки запрашивается --> */}
              {Country.isVisible && (
                <div className="quickform__item">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">Выберите страну</label>
                    <select
                      placeholder="Выберите страну"
                      className="quickform__select"
                      id="quickDeliveryCountry"
                      name="form[delivery][country_id]"
                      className="quickform__country-select"
                      required
                    >
                      <option></option>
                      {countryList?.map(({ id, name }) => {
                        return (
                          <option
                            key={id}
                            defaultValue={id}
                            selected={id === ORDER_FORM_DELIVERY_COUNTRY_ID}
                            //  {% IF country_list.ID=ORDER_FORM_DELIVERY_COUNTRY_ID %}selected="selected"{% ENDIF %}
                          >
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}

              {/* <!-- Если поле области запрашивается --> */}
              {Region.isVisible && (
                <div className="quickform__item">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">Область</label>
                    <input
                      placeholder=""
                      type="text"
                      id="quickDeliveryRegion"
                      name="form[delivery][region]"
                      value={ORDER_FORM_CONTACT_REGION}
                      maxLength="255"
                      className="input"
                    />
                  </div>
                </div>
              )}

              {/* <!-- Если поле города запрашивается --> */}
              {City.isVisible && (
                <div className="quickform__item">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">Город</label>
                    <input
                      placeholder=""
                      type="text"
                      id="quickDeliveryCity"
                      name="form[delivery][city]"
                      value={ORDER_FORM_CONTACT_CITY}
                      className="input"
                      maxLength="255"
                    />
                  </div>
                </div>
              )}

              {/* <!-- Если поле адреса доставки запрашивается --> */}
              {Address.isVisible && (
                <>
                  {/* <!-- Улица --> */}
                  <div className="quickform__item">
                    <div className="quickform__input-wrap">
                      <label className="quickform__label">Улица</label>
                      <input
                        placeholder=""
                        type="text"
                        id="quickDeliveryAddressStreet"
                        name="form[delivery][address_street]"
                        value=""
                        maxLength="500"
                        className="input"
                      />
                    </div>
                  </div>
                  {/* <!-- Поле Дом/Корпус --> */}
                  <div className="quickform__item -small -first">
                    <div className="quickform__input-wrap">
                      <label className="quickform__label">Дом</label>
                      <input
                        placeholder=""
                        type="text"
                        id="quickDeliveryAddressHome"
                        name="form[delivery][address_home]"
                        value=""
                        maxLength="50"
                        className="input"
                      />
                    </div>
                  </div>
                  {/* <!-- Поле Квартира --> */}
                  <div className="quickform__item -small -second">
                    <div className="quickform__input-wrap">
                      <label className="quickform__label">Квартира</label>
                      <input
                        placeholder=""
                        type="text"
                        id="quickDeliveryAddressFlat"
                        name="form[delivery][address_flat]"
                        value=""
                        maxLength="50"
                        className="input"
                      />
                    </div>
                  </div>

                  <input
                    placeholder=""
                    type="hidden"
                    id="quickDeliveryAddress"
                    name="form[delivery][address]"
                    value={ORDER_FORM_CONTACT_ADDR}
                    maxLength="500"
                    className="input"
                  />
                </>
              )}

              {/* <!-- Если поле почтового индекса запрашивается --> */}
              {ZipCode.isVisible && (
                <div className="quickform__item -small -third">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">Индекс</label>
                    <input
                      placeholder=""
                      type="number"
                      id="quickDeliveryZipCode"
                      name="form[delivery][zip_code]"
                      value={ORDER_FORM_CONTACT_ZIP_CODE}
                      minLength="5"
                      maxLength="6"
                      className="input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* <!-- Если поле даты доставки запрашивается --> */}
            {ConvenientTime.isVisible && (
              <div className="quickform__list -deliveryConvenient">
                <div className="quickform__item -deliveryConvenientDate">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">
                      Дата доставки {ConvenientTime.isRequired && <em>*</em>}
                    </label>
                    <input
                      placeholder="01.01.2021"
                      type="date"
                      id="deliveryConvenientDate"
                      name="form[delivery][convenient_date]"
                      value={date}
                      className="input quickform__input-deliveryConvenientDate"
                      autoComplete="off"
                      onChange={(evt) => {
                        const { value } = evt.target;

                        setDate(value);
                      }}
                    />
                  </div>
                </div>
                <div className="quickform__item -deliveryConvenientTime">
                  <div className="quickform__select-box _full">
                    <input
                      type="hidden"
                      name="form[delivery][convenient_time_from]"
                      defaultValue={from}
                    />
                    <input
                      type="hidden"
                      name="form[delivery][convenient_time_to]"
                      defaultValue={to}
                    />

                    <label className="quickform__label">
                      Удобное время доставки
                    </label>
                    <Nouislider
                      id="convenient-time"
                      style={{ marginTop: 6 }}
                      range={{ min: 0, max: 24 }}
                      start={[0, 24]}
                      step={1}
                      connect
                      tooltips
                      pips={{ mode: 'steps' }}
                      onSlide={(render, handle, value, un, percent) => {
                        const [firstValue, secondValue] = value;
                        setConvenentState({
                          from: firstValue,
                          to: secondValue,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* <!-- Если поле комментарии запрашивается --> */}
            {Comment.isVisible && (
              <section className="quickform__row -comment">
                <div className="quickform__list">
                  <div className="quickform__item">
                    <label className="quickform__label">
                      Комментарий к заказу
                    </label>
                    <div className="quickform__input-wrap">
                      <textarea
                        cols="100"
                        rows="5"
                        id="quickDeliveryComment"
                        name="form[delivery][comment]"
                        className="input textarea quickform-textarea"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </>
    );
  }
})();
