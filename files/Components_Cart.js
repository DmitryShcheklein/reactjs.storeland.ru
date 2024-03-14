import { useState, useEffect } from 'React';
import { GoodsList } from '/design/Components_CartGoodsList.js';
import { useCheckCartEmpty, useCartState, useQuickFormData, useCart, useFavoritesGoodMutation, useClearCartItemMutation, useClearCartMutation, useClearCartItemsMutation, useCompareGoodMutation } from '/design/Hooks_cart.js';

export const Cart = () => {
  const isCartEmpty = useCheckCartEmpty();
  const [cartState] = useCartState();

  const {
    form: {
      delivery: { id: deliveryId, zone_id: zoneId },
      coupon_code: couponCode,
      isCouponSend,
    },
  } = cartState;

  const { data: quickFormData } = useQuickFormData();

  const {
    data: cartData = {},
    refetch: refetchCart,
    isSuccess: isSuccessCart,
    isLoading: isLoadingCart,
    isFetching: isFetchingCart,
    isFetched: isFetchedCart,
  } = useCart();

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
    SETTINGS_STORE_ORDER_MIN_ORDER_PRICE,
    SETTINGS_STORE_ORDER_MIN_PRICE_WITHOUT_DELIVERY,
    cartDiscount,
    cartRelatedGoods,
    recentlyViewedGoods,
    goodsFromCategory6037761,
  } = cartData;

  const recentlyViewedGoodsFiltered = recentlyViewedGoods?.filter(
    (item) => !item.NB_GOODS_IN_CART
  );

  useEffect(() => {
    if (deliveryId || zoneId || isCouponSend) {
      refetchCart();
    }
  }, [deliveryId, zoneId, isCouponSend]);

  const clearCartMutation = useClearCartMutation();

  const [deletedItemsArray, setDeletedItemsArray] = useState([]);
  const clearCartItemsMutation = useClearCartItemsMutation({
    onSuccess: () => {
      refetchCart();
      setDeletedItemsArray([]);
    },
  });
  const changeDeletedItemHandler = (goodsId) => {
    setDeletedItemsArray((prev) => {
      const isInDeletedArray = prev.includes(goodsId);

      if (isInDeletedArray) {
        return prev.filter((id) => id !== goodsId);
      } else {
        return [...prev, goodsId];
      }
    });
  };

  if (isLoadingCart) {
    return <Preloader />;
  }
  if (isCartEmpty || !isFetchedCart) {
    return null;
  }

  return (
    <>
      <div className="cart" style={{ position: 'relative' }}>
        {(isFetchingCart || clearCartMutation.isLoading) && <Preloader />}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <h1 style={{ width: '100%' }}>Корзина</h1>

          <label style={{ display: 'flex', gap: 10 }}>
            <input
              type="checkbox"
              onChange={(evt) => {
                const { checked } = evt.target;

                setDeletedItemsArray(
                  checked ? cartItems.map((el) => el.GOODS_MOD_ID) : []
                );
              }}
              checked={cartItems?.length === deletedItemsArray?.length}
            />
            Выбрать всё
          </label>

          {deletedItemsArray?.length &&
            !(deletedItemsArray?.length === cartItems?.length) ? (
            <button
              className="button"
              onClick={() => {
                clearCartItemsMutation.mutate(deletedItemsArray);
              }}
            >
              {clearCartMutation.isLoading
                ? '(Очищается..)'
                : `Удалить выбранные (${deletedItemsArray.length})`}
            </button>
          ) : (
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
          )}
        </div>

        <form id="card">
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              listStyle: 'none',
              padding: 0,
            }}
          >
            {cartItems?.map((item) => (
              <CartItem
                item={item}
                key={item.GOODS_MOD_ID}
                refetchCart={refetchCart}
                checked={deletedItemsArray.includes(item.GOODS_MOD_ID)}
                changeDeletedItemHandler={changeDeletedItemHandler}
                isLogin={quickFormData.CLIENT_IS_LOGIN}
              />
            ))}
          </ul>
        </form>

        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>Товаров: {CART_COUNT_TOTAL} шт.</li>
          <li>Сумма товаров: {CART_SUM_NOW}</li>
          <li>
            Доставка (id: {deliveryId}):{' '}
            <b>{zoneId ? CART_SUM_OLD_WITH_DELIVERY : CART_SUM_DELIVERY}</b>
            {/* BUG: бек неверно отдаёт цену доставки при выбранной зоне */}
          </li>
          {zoneId && (
            <li>
              Зона доставки (zoneId: {zoneId}): <b></b>
            </li>
          )}

          {cartDiscount.DISCOUNT_VALUE && (
            <li>
              <h4>{cartDiscount.DISCOUNT_TYPE_DESCRIPTION}</h4>
              <ul>
                <li>
                  {cartDiscount.DISCOUNT_VALUE}{' '}
                  {cartDiscount.IS_PERCENT ? '%' : 'р.'}
                </li>
                <li>{cartDiscount.END_PRICE}</li>
              </ul>
            </li>
          )}
          {/* <li> Скидка: {CART_SUM_DISCOUNT} </li> */}
          {/* <li>Скидка процент: {CART_SUM_DISCOUNT_PERCENT}</li> */}
          <li>Итого с доставкой: {CART_SUM_NOW_WITH_DELIVERY}</li>
          {SETTINGS_STORE_ORDER_MIN_ORDER_PRICE ? (
            <li>
              Минимальная сумма заказа (
              {SETTINGS_STORE_ORDER_MIN_PRICE_WITHOUT_DELIVERY
                ? 'Без учёта стоимости доставки'
                : 'с доставкой'}
              ): {SETTINGS_STORE_ORDER_MIN_ORDER_PRICE}, Осталось:{' '}
              {getCurrentMinOrderPrice(cartData)}
            </li>
          ) : null}
          {/* <li>Итого old с доставкой: {CART_SUM_OLD_WITH_DELIVERY}</li> */}
          <li>
            Итого с доставкой и скидкой:{' '}
            <b>{CART_SUM_NOW_WITH_DELIVERY_AND_DISCOUNT}</b>
          </li>
        </ul>
      </div>

      <GoodsList
        title="С этим товаром покупают"
        goods={cartRelatedGoods}
        refetchCart={refetchCart}
      />

      <br />

      <GoodsList
        title="Вы смотрели"
        goods={recentlyViewedGoodsFiltered}
        refetchCart={refetchCart}
      />

      <br />

      <GoodsList
        title="Подарки"
        goods={goodsFromCategory6037761}
        refetchCart={refetchCart}
        inCart={goodsFromCategory6037761?.some((item) => item.NB_GOODS_IN_CART)}
      />

      <br />
    </>
  );
}

export const CartItem = ({
  item,
  refetchCart,
  checked,
  changeDeletedItemHandler,
  isLogin,
}) => {
  const [cartState, setCartState] = useCartState();
  const { compareGoods, favoritesGoods } = cartState;
  const {
    GOODS_ID,
    GOODS_MOD_ID,
    GOODS_NAME,
    ORDER_LINE_PRICE_NOW,
    ORDER_LINE_QUANTITY = 1,
    GOODS_MOD_REST_VALUE,
    GOODS_IMAGE_ICON,
    GOODS_IMAGE_EMPTY_URL,
    GOODS_URL,
    GOODS_MOD_ART_NUMBER,
    GOODS_DONT_PUT_MORE_THAN_AVAILABLE,
    distinctiveProperties,
  } = item;

  const favoritesGoodMutation = useFavoritesGoodMutation();
  const isFavorite = Boolean(favoritesGoods?.find((el) => el.ID === GOODS_ID));

  const isInCompare = Boolean(
    compareGoods?.find((el) => el.GOODS_MOD_ID === GOODS_MOD_ID)
  );
  const compareGoodMutation = useCompareGoodMutation();
  const deleteCartItemMutation = useClearCartItemMutation({
    onSuccess: () => {
      refetchCart();
    },
  });
  const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);

  useEffect(() => {
    if (inputValue && inputValue !== ORDER_LINE_QUANTITY) {
      setCartState((prev) => ({
        ...prev,
        cartItems: prev?.cartItems?.map((el) => {
          if (el.GOODS_MOD_ID === GOODS_MOD_ID) {
            return {
              ...el,
              ORDER_LINE_QUANTITY: inputValue,
            };
          }

          return el;
        }),
      }));

      window.Utils.debounce(() => {
        refetchCart();
      }, 300)();
    }
  }, [inputValue]);

  const handleBlur = (event) => {
    const { value, min, max } = event.target;
    const numericValue = Math.min(
      Math.max(Number(value), Number(min)),
      max ? Number(max) : Infinity
    );

    setInputValue(numericValue);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      setInputValue(value === '' ? '' : numericValue);
    }
  };
  const handleRemoveItem = () => {
    deleteCartItemMutation.mutate(GOODS_MOD_ID);
  };
  const handlePaste = () => { };

  if (deleteCartItemMutation.isSuccess) {
    return null;
  }

  return (
    <li
      style={{ position: 'relative' }}
      data-product-id={GOODS_ID}
      data-mod-id={GOODS_MOD_ID}
    >
      {deleteCartItemMutation.isLoading && <Preloader />}
      <div className="cart__good">
        <div>
          <input
            type="checkbox"
            title="Удалить выбранный"
            checked={checked}
            onChange={() => {
              changeDeletedItemHandler(GOODS_MOD_ID);
            }}
          />
        </div>
        <div>
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
            <strong>Артикул:{GOODS_MOD_ART_NUMBER}</strong>
          </div>
          {distinctiveProperties?.length ? (
            <>
              {distinctiveProperties.map(({ NAME, VALUE }, idx) => (
                <div key={idx}>
                  <strong>
                    {NAME}: {VALUE}
                  </strong>
                </div>
              ))}
            </>
          ) : null}
          <div>
            <strong>Кол-во:{ORDER_LINE_QUANTITY}</strong>
            <br />
            <strong>В наличии:{GOODS_MOD_REST_VALUE}</strong>
          </div>
          <div>
            <strong>Цена:{ORDER_LINE_PRICE_NOW / ORDER_LINE_QUANTITY}</strong>{' '}
            {/* BUG: бек отдаёт неверную цену товара при скидке по сумме заказа */}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
            <button
              id="cartCompare"
              className={classNames({
                ['_added']: isInCompare,
              })}
              type="button"
              onClick={() => {
                compareGoodMutation.mutate({
                  goodsModId: GOODS_MOD_ID,
                  isInCompare,
                });
              }}
            >
              <svg className="icon _compare">
                <use xlinkHref="/design/sprite.svg#compare"></use>
              </svg>
              <span>{isInCompare ? 'В сравнении' : 'Сравнить'}</span>
            </button>
            {isLogin ? (
              <button
                id="favoritesCompare"
                type="button"
                className={classNames({
                  ['_added']: isFavorite,
                })}
                onClick={() => {
                  favoritesGoodMutation.mutate({
                    goodsId: GOODS_ID,
                    goodsModId: GOODS_MOD_ID,
                    isFavorite,
                  });
                }}
              >
                <svg className="icon _compare">
                  <use xlinkHref="/design/sprite.svg#favorites"></use>
                </svg>
                <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>
            ) : null}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href={GOODS_URL}>
            <img width="80" src={GOODS_IMAGE_ICON || GOODS_IMAGE_EMPTY_URL} />
          </a>

          <div className="qty">
            <div className="qty__wrap">
              <button
                type="button"
                className="qty__btn"
                onClick={() => {
                  setInputValue(inputValue - 1 || 1);
                }}
                disabled={inputValue <= 1}
              >
                <svg className="icon">
                  <use xlinkHref="/design/sprite.svg#minus-icon"></use>
                </svg>
              </button>
              <input
                name={`form[quantity][${GOODS_MOD_ID}]`}
                min="1"
                max={
                  GOODS_DONT_PUT_MORE_THAN_AVAILABLE
                    ? GOODS_MOD_REST_VALUE
                    : undefined
                }
                pattern="[0-9]*"
                inputMode="numeric"
                type="number"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onPaste={handlePaste}
                className="input qty__input"
              />
              <button
                type="button"
                className="qty__btn"
                onClick={() => {
                  setInputValue(inputValue + 1);
                }}
                disabled={
                  inputValue === GOODS_MOD_REST_VALUE &&
                  GOODS_DONT_PUT_MORE_THAN_AVAILABLE
                }
              >
                <svg className="icon">
                  <use xlinkHref="/design/sprite.svg#plus-icon"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function Preloader() {
  return (
    <div className="preloader _opacity">
      <span className="content-loading"></span>
    </div>
  );
}