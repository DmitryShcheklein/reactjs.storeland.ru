import { useState, useEffect } from 'React';
import {
  useCheckCartEmpty, useCartState, useCart, getCurrentMinOrderPrice
} from '/design/Hooks_Cart.js';
import {
  useCreateOrderMutation, useFormState, useQuickFormData
} from '/design/Hooks_OrderForm.js';
import {
  Utils
} from '/design/Helpers_Utils';

export function OrderForm() {
  const [cartState, setCartState] = useCartState();

  const {
    form: {
      delivery: { id: deliveryId, zone_id: zoneId },
      payment: { id: paymentId },
      coupon_code: couponCode,
      isCouponSend,
    },
  } = cartState;

  const { data: cartData = {}, isFetched: isFetchedCart } = useCart();
  const [formState, setFormState] = useFormState();
  const { data: quickFormData } = useQuickFormData();
  const { deliveries, CLIENT_IS_LOGIN, ORDER_DISCOUNT_COUPON_IS_ENABLED } =
    quickFormData;
  const createOrderMutation = useCreateOrderMutation();
  const { isLoading: isOrderLoading } = createOrderMutation;
  const zoneList = deliveries?.find(({ id }) => id === deliveryId)?.zoneList;
  const [localForm, setLocalFormState] = useState({
    wantRegister: false,
    showPassword: false,
    extraAddSubscribes: false,
    agreePolitics: true,
  });
  const { wantRegister, extraAddSubscribes, showPassword, agreePolitics } =
    localForm;
  const { formErrors, validateElement, checkFormValid } = useFormValidation();
  const handleSubmit = (event) => {
    event.preventDefault();

    const formElement = event.target;
    const isFormValid = checkFormValid(formElement);

    if (!isFormValid) {
      return;
    }

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

    const setStateAction = (prev) => {
      const newData = Utils.mergeWith({ ...prev }, fieldData, Utils.customizer);

      return newData;
    };

    if (id === 'deliveryId' || id === 'deliveryZoneId' || id === 'couponCode') {
      const [firstZone] =
        deliveries?.find(({ id }) => id === value)?.zoneList || [];

      if (id === 'deliveryId') {
        fieldData.form.delivery.zone_id = firstZone?.zoneId;
      }

      setCartState(setStateAction);
    } else {
      setFormState(setStateAction);
    }

    validateElement(event.target);
  };

  const handleCouponBtn = () => {
    setCartState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        isCouponSend: true,
      },
    }));
  };

  const handleResetCouponBtn = () => {
    setCartState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        coupon_code: '',
        isCouponSend: false,
      },
    }));
  };
  const { cartDiscount } = cartData;
  const isCouponEnabled =
    cartDiscount?.DISCOUNT_TYPE === 'coupon' && isCouponSend;
  const isMinOrderPrice = Boolean(getCurrentMinOrderPrice(cartData));

  const isCartEmpty = useCheckCartEmpty();

  if (isCartEmpty || !isFetchedCart) {
    return null;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        id="orderForm"
        noValidate="novalidate"
        className="quickform"
      >
        <h3 className="quickform__title">Оформление заказа</h3>

        <div className="quickform__input-wrap">
          <input
            id="person"
            className={classNames(`input`, {
              ['error']: formErrors.person,
            })}
            name="form[contact][person]"
            value={formState.form.contact.person}
            onChange={handleChange}
            maxLength="100"
            type="text"
            placeholder="Имя"
            required
          />
          {formErrors.person && (
            <label className="error">{formErrors.person}</label>
          )}
        </div>
        <div className="quickform__input-wrap">
          <IMaskInput
            id="phone"
            className={classNames(`input`, {
              ['error']: formErrors.phone,
            })}
            placeholder="+7 999 999-99-99"
            type="tel"
            mask="+{7} {#00} 000-00-00"
            definitions={{ '#': /[01234569]/ }}
            name="form[contact][phone]"
            value={formState.form.contact.phone}
            unmask={false}
            onChange={handleChange}
            required
          />
          {formErrors.phone && (
            <label className="error">{formErrors.phone}</label>
          )}
        </div>
        <div className="quickform__input-wrap">
          <input
            id="email"
            className={classNames(`input`, {
              ['error']: formErrors.email && wantRegister,
            })}
            name="form[contact][email]"
            value={formState.form.contact.email}
            onChange={handleChange}
            maxLength="255"
            type="email"
            placeholder={`Email ${wantRegister ? '*' : ''}`}
            required={wantRegister ? 'required' : undefined}
          />
          {formErrors.email && wantRegister && (
            <label className="error">{formErrors.email}</label>
          )}
        </div>

        {!CLIENT_IS_LOGIN && (
          <>
            <label style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <input
                type="checkbox"
                name="form[contact][want_register]"
                value="1"
                onChange={() =>
                  setLocalFormState({
                    ...localForm,
                    wantRegister: !wantRegister,
                  })
                }
              />
              Я хочу зарегистрироваться
            </label>

            {wantRegister && (
              <div className="quickform__input-wrap">
                <input
                  id="password"
                  className={classNames(`input`, {
                    ['error']: formErrors.password,
                  })}
                  type={showPassword ? 'text' : 'password'}
                  name="form[contact][pass]"
                  maxLength="50"
                  minLength="6"
                  placeholder="Придумайте пароль"
                  onChange={handleChange}
                  required
                />
                {formErrors.password && (
                  <label className="error">{formErrors.password}</label>
                )}
                <button
                  type="button"
                  className="show-password"
                  onClick={() => {
                    setLocalFormState({
                      ...localForm,
                      showPassword: !showPassword,
                    });
                  }}
                >
                  <svg className={`icon ${showPassword ? '_active' : ''}`}>
                    <use xlinkHref={'/design/sprite.svg#hide-icon'}></use>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        {ORDER_DISCOUNT_COUPON_IS_ENABLED && (
          <div className="coupon">
            <div className="coupon__box" style={{ display: 'flex' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="couponCode"
                  className="input"
                  name="form[coupon_code]"
                  value={couponCode}
                  onChange={handleChange}
                  maxLength="255"
                  type="text"
                  placeholder="Купон (123456)"
                  readOnly={isCouponEnabled}
                />
                <button
                  type="button"
                  className={classNames('coupon__clear', {
                    [' _active']: couponCode,
                  })}
                  title="Очистить купон"
                  onClick={handleResetCouponBtn}
                >
                  <svg className="icon _close">
                    <use xlinkHref="/design/sprite.svg#close"></use>
                  </svg>
                </button>
              </div>
              <button
                disabled={!couponCode || isCouponEnabled}
                onClick={handleCouponBtn}
                className="button coupon__btn"
                type="button"
              >
                {isCouponEnabled ? 'Применён' : 'Применить'}
              </button>
            </div>
            <pre>1234567</pre>
          </div>
        )}
        {deliveries?.length ? (
          <>
            <select
              id="deliveryId"
              onChange={handleChange}
              name="form[delivery][id]"
              className="quickform__select"
              value={deliveryId}
            >
              {deliveries.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name} - (id:{id})
                </option>
              ))}
            </select>
            {zoneList?.length ? (
              <select
                id="deliveryZoneId"
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
              id="paymentId"
              name="form[payment][id]"
              className="quickform__select"
              defaultValue={paymentId}
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
          quickFormData={quickFormData}
          handleChange={handleChange}
          formErrors={formErrors}
        />

        <button
          className="button _big"
          disabled={isMinOrderPrice || isOrderLoading || !agreePolitics}
        >
          {isOrderLoading ? 'Оформляется...' : 'Оформить'}
        </button>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <input
            type="checkbox"
            onChange={() =>
              setLocalFormState({
                ...localForm,
                agreePolitics: !agreePolitics,
              })
            }
            checked={agreePolitics}
            value="ДА"
            id="agreePolitics"
          />
          <label htmlFor="agreePolitics">
            Я принимаю условия политики конфиденциальности
          </label>
        </div>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <input
            type="checkbox"
            onChange={() =>
              setLocalFormState({
                ...localForm,
                extraAddSubscribes: !extraAddSubscribes,
              })
            }
            checked={extraAddSubscribes}
            name="form[extra][Скидки и предложения]"
            value="ДА"
            id="contactWantSubscribes"
          />
          <label htmlFor="contactWantSubscribes">
            Хочу получать скидки и специальные предложения
          </label>
        </div>
      </form>
    </>
  );
}

function Adresses({ quickFormData, handleChange, formErrors }) {
  // const Nouislider = window.ReactNouislider;
  const [formState] = useFormState();
  const {
    form: {
      delivery: {
        address_street: addressStreet,
        address_home: addressHome,
        address_flat: addressFlat,
      },
    },
  } = formState;

  const fullAddress = []
    .concat(addressStreet ? [`Улица: ${addressStreet}`] : [])
    .concat(addressHome ? [`Дом/Корпус: ${addressHome}`] : [])
    .concat(addressFlat ? [`Квартира: ${addressFlat}`] : [])
    .join(', ');

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
    convenient_time_from_list,
    convenient_time_to_list,
  } = quickFormData;
  const { Country, ConvenientTime, ZipCode, Region, City, Address, Comment } =
    SETTINGS_ORDER_FIELDS;
  const [collapsed, setCollapsed] = useState(
    Object.values(SETTINGS_ORDER_FIELDS).every((el) => !el.isRequired)
  );
  const [{ from, to }, setConvenientState] = useState({
    from: 0,
    to: 24,
  });

  return (
    <>
      {/* <!-- Адрес доставки--> */}
      <section className="quickform__row -adress form-callapse">
        <button
          type="button"
          className={classNames('form-callapse__title', {
            ['_active']: !collapsed,
          })}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <span className="quickform__title">Адрес доставки заказа</span>
        </button>
        <div
          className={classNames(
            'quickform__list -adress-inputs-list form-callapse__list',
            {
              ['_active']: !collapsed,
            }
          )}
        >
          <div>
            {/* <!-- Если поле страны доставки запрашивается --> */}
            {Country?.isVisible && (
              <div className="quickform__item">
                <div className="quickform__input-wrap">
                  <label className="quickform__label">
                    Выберите страну {Country.isRequired && <em>*</em>}
                  </label>
                  <select
                    placeholder="Выберите страну"
                    className={classNames(`input`, {
                      ['error']: formErrors.country,
                    })}
                    id="country"
                    name="form[delivery][country_id]"
                    defaultValue={ORDER_FORM_DELIVERY_COUNTRY_ID}
                    required={Country.isRequired}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    {countryList?.map(({ id, name }) => (
                      <option
                        key={id}
                        value={id}
                      // selected={id === ORDER_FORM_DELIVERY_COUNTRY_ID}
                      //  {% IF country_list.ID=ORDER_FORM_DELIVERY_COUNTRY_ID %}selected="selected"{% ENDIF %}
                      >
                        {name}
                      </option>
                    ))}
                  </select>
                  {formErrors.country && (
                    <label className="error">{formErrors.country}</label>
                  )}
                </div>
              </div>
            )}

            {/* <!-- Если поле области запрашивается --> */}
            {Region?.isVisible && (
              <div className="quickform__item">
                <div className="quickform__input-wrap">
                  <label className="quickform__label">
                    Область {Region.isRequired && <em>*</em>}
                  </label>
                  <input
                    placeholder=""
                    type="text"
                    id="region"
                    name="form[delivery][region]"
                    defaultValue={ORDER_FORM_CONTACT_REGION}
                    maxLength="255"
                    onChange={handleChange}
                    className={classNames(`input`, {
                      ['error']: formErrors.region,
                    })}
                    required={Region.isRequired}
                  />
                  {formErrors.region && (
                    <label className="error">{formErrors.region}</label>
                  )}
                </div>
              </div>
            )}

            {/* <!-- Если поле города запрашивается --> */}
            {City?.isVisible && (
              <div className="quickform__item">
                <div className="quickform__input-wrap">
                  <label className="quickform__label">
                    Город {City.isRequired && <em>*</em>}
                  </label>
                  <input
                    placeholder=""
                    type="text"
                    id="city"
                    name="form[delivery][city]"
                    defaultValue={ORDER_FORM_CONTACT_CITY}
                    maxLength="255"
                    onChange={handleChange}
                    className={classNames(`input`, {
                      ['error']: formErrors.city,
                    })}
                    required={City.isRequired}
                  />
                  {formErrors.city && (
                    <label className="error">{formErrors.city}</label>
                  )}
                </div>
              </div>
            )}

            {/* <!-- Если поле адреса доставки запрашивается --> */}
            {Address?.isVisible && (
              <>
                {/* <!-- Улица --> */}
                <div className="quickform__item">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">
                      Улица {Address.isRequired && <em>*</em>}
                    </label>
                    <input
                      placeholder=""
                      type="text"
                      id="addressStreet"
                      name="form[delivery][address_street]"
                      defaultValue=""
                      maxLength="500"
                      className={classNames(`input`, {
                        ['error']: formErrors.addressStreet,
                      })}
                      onChange={handleChange}
                      required={Address.isRequired}
                    />
                    {formErrors.addressStreet && (
                      <label className="error">
                        {formErrors.addressStreet}
                      </label>
                    )}
                  </div>
                </div>
                {/* <!-- Поле Дом/Корпус --> */}
                <div className="quickform__item -small -first">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">
                      Дом {Address.isRequired && <em>*</em>}
                    </label>
                    <input
                      placeholder=""
                      type="text"
                      id="addressHome"
                      name="form[delivery][address_home]"
                      defaultValue=""
                      maxLength="50"
                      className={classNames(`input`, {
                        ['error']: formErrors.addressHome,
                      })}
                      onChange={handleChange}
                      required={Address.isRequired}
                    />
                    {formErrors.addressHome && (
                      <label className="error">{formErrors.addressHome}</label>
                    )}
                  </div>
                </div>
                {/* <!-- Поле Квартира --> */}
                <div className="quickform__item -small -second">
                  <div className="quickform__input-wrap">
                    <label className="quickform__label">
                      Квартира {Address.isRequired && <em>*</em>}
                    </label>
                    <input
                      placeholder=""
                      type="text"
                      id="addressFlat"
                      name="form[delivery][address_flat]"
                      defaultValue=""
                      maxLength="50"
                      className={classNames(`input`, {
                        ['error']: formErrors.addressFlat,
                      })}
                      onChange={handleChange}
                      required={Address.isRequired}
                    />
                    {formErrors.addressFlat && (
                      <label className="error">{formErrors.addressFlat}</label>
                    )}
                  </div>
                </div>

                <input
                  placeholder=""
                  type="hidden"
                  id="address"
                  name="form[delivery][address]"
                  defaultValue={ORDER_FORM_CONTACT_ADDR || fullAddress}
                  maxLength="500"
                  className="input"
                  required={Address.isRequired}
                />
              </>
            )}

            {/* <!-- Если поле почтового индекса запрашивается --> */}
            {ZipCode?.isVisible && (
              <div className="quickform__item -small -third">
                <div className="quickform__input-wrap">
                  <label className="quickform__label">
                    Индекс {ZipCode.isRequired && <>*</>}
                  </label>
                  <input
                    placeholder=""
                    type="number"
                    id="zipCode"
                    name="form[delivery][zip_code]"
                    defaultValue={ORDER_FORM_CONTACT_ZIP_CODE}
                    minLength="5"
                    maxLength="6"
                    className={classNames(`input`, {
                      ['error']: formErrors.zipCode,
                    })}
                    onChange={handleChange}
                    required={ZipCode.isRequired}
                  />
                  {formErrors.zipCode && (
                    <label className="error">{formErrors.zipCode}</label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* <!-- Если поле даты доставки запрашивается --> */}
          {ConvenientTime?.isVisible && (
            <div className="quickform__list -deliveryConvenient">
              <div className="quickform__item -deliveryConvenientDate">
                <div className="quickform__input-wrap">
                  <label className="quickform__label">
                    Дата доставки {ConvenientTime.isRequired && <em>*</em>}
                  </label>

                  <AirDatepickerReact
                    placeholder="01.01.2021"
                    name="form[delivery][convenient_date]"
                    onChange={handleChange}
                    id="convenientDate"
                    required={ConvenientTime.isRequired}
                    className={classNames(`input`, {
                      ['error']: formErrors.convenientDate,
                    })}
                  />
                  {formErrors.convenientDate && (
                    <label className="error">{formErrors.convenientDate}</label>
                  )}
                </div>
              </div>
              <div className="quickform__item -deliveryConvenientTime">
                <div className="quickform__select-box _full">
                  {/* <input
                    type="hidden"
                    name="form[delivery][convenient_time_from]"
                    defaultValue={from}
                  />
                  <input
                    type="hidden"
                    name="form[delivery][convenient_time_to]"
                    defaultValue={to}
                  /> */}

                  <label className="quickform__label">
                    Удобное время доставки{' '}
                    {ConvenientTime.isRequired && <em>*</em>}
                  </label>
                  <div
                    style={{ display: 'flex', gap: 5, alignItems: 'center' }}
                  >
                    <div className="quickform__select-box -from">
                      <label className="quickform__label">С</label>
                      <select
                        id="convenientTimeFrom"
                        className={classNames(`input`, {
                          ['error']: formErrors.convenientDate,
                        })}
                        name="form[delivery][convenient_time_from]"
                        defaultValue=""
                        required={ConvenientTime.isRequired}
                      >
                        <option value=""></option>
                        {convenient_time_from_list?.map(
                          ({ HOUR, HOUR_INT, SELECTED }) => (
                            <option
                              key={HOUR_INT}
                              value={HOUR_INT}
                            // selected={SELECTED ? 'selected' : ''}
                            >
                              {HOUR}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="quickform__select-box -to">
                      <label className="quickform__label">До</label>
                      <select
                        id="convenientTimeTo"
                        className={classNames(`input`, {
                          ['error']: formErrors.convenientDate,
                        })}
                        name="form[delivery][convenient_time_to]"
                        defaultValue=""
                        required={ConvenientTime.isRequired}
                      >
                        <option value=""></option>
                        {convenient_time_to_list?.map(
                          ({ HOUR, HOUR_INT, SELECTED }) => (
                            <option
                              key={HOUR_INT}
                              value={HOUR_INT}
                            // selected={SELECTED ? 'selected' : ''}
                            >
                              {HOUR}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* {false && (
                    <Nouislider
                      
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
                  )} */}
                </div>
              </div>
            </div>
          )}

          {/* <!-- Если поле комментарии запрашивается --> */}
          {Comment?.isVisible && (
            <section className="quickform__row -comment">
              <div className="quickform__list">
                <div className="quickform__item">
                  <label className="quickform__label">
                    Комментарий к заказу {Comment.isRequired && <>*</>}
                  </label>
                  <div className="quickform__input-wrap">
                    <textarea
                      required={Comment.isRequired}
                      onChange={handleChange}
                      cols="100"
                      rows="5"
                      id="comment"
                      name="form[delivery][comment]"
                      className={classNames(
                        `input textarea quickform-textarea`,
                        { ['error']: formErrors.comment }
                      )}
                    ></textarea>
                    {formErrors.comment && (
                      <label className="error">{formErrors.comment}</label>
                    )}
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

function AirDatepickerReact(props) {
  const { createPopper } = window.Popper;
  const $input = useRef(null);
  const dp = useRef(null);

  useEffect(() => {
    if ($input.current) {
      dp.current = new AirDatepicker($input.current, {
        ...props,
        // inline: true,
        autoClose: true,
        minDate: new Date(),
        buttons: ['clear'],
        position({ $datepicker, $target, $pointer, done }) {
          const popper = createPopper($target, $datepicker, {
            placement: 'bottom',
            modifiers: [
              {
                name: 'flip',
                options: {
                  padding: {
                    top: 0,
                  },
                },
              },
              {
                name: 'offset',
                options: {
                  offset: [0, 1],
                },
              },
              {
                name: 'arrow',
                options: {
                  element: $pointer,
                },
              },
            ],
          });

          return function completeHide() {
            popper.destroy();
            done();
          };
        },
      });
    }

    return () => {
      dp.current?.destroy();
    };
  }, []);

  useEffect(() => {
    dp.current?.update({
      ...props,
    });
  }, [props]);

  return <input readOnly ref={$input} {...props} />;
}
function useFormValidation() {
  const [formErrors, setFormErrors] = useState({});
  const validateElement = (element) => {
    const { id, value, required, minLength } = element;

    // console.log(id, required, !value.length);

    if (id === 'person' && value.length < 3) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: 'Name must be at least 3 characters long.',
      }));

      return false;
    } else if (id === 'email' && !isValidEmail(value)) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: 'Please enter a valid email address.',
      }));

      return false;
    } else if (id === 'password' && value.length < minLength) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: `Password must be at least ${minLength} characters long.`,
      }));

      return false;
    } else if (id === 'phone' && !isValidPhone(value)) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: 'Пожалуйста, введите корректный телефон.',
      }));

      return false;
    } else if (id === 'zipCode' && required && value.length < minLength) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: 'Please enter zipCode.',
      }));

      return false;
    } else if (required && !value) {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: 'Это поле необходимо заполнить.',
      }));

      return false;
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: '', // Reset error message
      }));

      return true;
    }

    function isValidEmail(email) {
      // Регулярное выражение для проверки валидности email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Проверка совпадения с регулярным выражением
      return emailRegex.test(email);
    }

    function isValidPhone(phone) {
      // Регулярное выражение для проверки валидности телефонного номера
      var phoneRegex = /^\+\d{1,3}\s\d{1,3}\s\d{2,3}-\d{2}-\d{2}$/;

      // Проверка совпадения с регулярным выражением
      return phoneRegex.test(phone);
    }
  };

  const checkFormValid = (form) => {
    const formElements = Array.from(form.elements).filter((el) => el.required);

    const isValid = formElements.map(validateElement).every(Boolean);

    return isValid;
  };

  return {
    formErrors,
    setFormErrors,
    validateElement,
    checkFormValid,
  };
}