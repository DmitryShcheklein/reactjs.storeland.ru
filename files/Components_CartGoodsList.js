import { useAddCartMutation } from '/design/Hooks_cart.js';
import { useState } from 'React';

export function GoodsList({ refetchCart, goods, title, inCart }) {
  const [collapsed, setCollapsed] = useState(true);

  if (!goods?.length) {
    return null;
  }

  return (
    <div className="form-callapse">
      <button
        type="button"
        className={classNames('form-callapse__title', {
          ['_active']: !collapsed,
        })}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <span className="quickform__title">{title}</span>
      </button>
      <div
        className={classNames('form-callapse__list', {
          ['_active']: !collapsed,
        })}
      >
        <ul
          style={{
            display: 'flex',
            gap: 20,
            listStyle: 'none',
            padding: 0,
            margin: 0,
            overflow: 'auto',
          }}
        >
          {goods.map((item) => {
            return (
              <GoodItem
                key={item.GOODS_MOD_ID}
                item={item}
                refetchCart={refetchCart}
                inCart={inCart}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function GoodItem({ item, refetchCart, inCart }) {
  const [quantity, setQuantity] = useState(1);
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const addCartMutation = useAddCartMutation({
    onSuccess: refetchCart,
  });

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const form = event.target;

    addCartMutation.mutate(form);
  };

  const {
    GOODS_MOD_ID,
    GOODS_NAME,
    MIN_PRICE_NOW_WITHOUT_DISCOUNT,
    ORDER_LINE_QUANTITY,
    GOODS_IMAGE,
  } = item;

  return (
    <li
      className={classNames({ ['_inCart']: inCart })}
      key={GOODS_MOD_ID}
      style={{ position: 'relative' }}
    >
      <form onSubmit={onSubmitHandler}>
        <input type="hidden" name="form[goods_mod_id]" value={GOODS_MOD_ID} />

        <div style={{ display: 'flex', gap: 20 }}>
          <h3>{GOODS_NAME}</h3>
        </div>

        <div className="qty qty--good">
          <div className="qty__wrap">
            <button
              className="qty__btn qty__btn--minus"
              title="Уменьшить"
              onClick={handleDecrease}
              type="button"
            >
              <svg className="icon">
                <use xlinkHref="/design/sprite.svg#minus-icon"></use>
              </svg>
            </button>
            <input
              type="number"
              pattern="\d*"
              name="form[goods_mod_quantity]"
              value={quantity}
              title="Количество"
              className="input qty__input"
              onChange={handleChange}
              autoComplete="off"
              readOnly
            />
            <button
              className="qty__btn qty__btn--plus"
              title="Увеличить"
              onClick={handleIncrease}
              type="button"
            >
              <svg className="icon">
                <use xlinkHref="/design/sprite.svg#plus-icon"></use>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <strong>Цена:{MIN_PRICE_NOW_WITHOUT_DISCOUNT}</strong>
        </div>
        <img width="80" src={GOODS_IMAGE} />
        <div>
          <button className="button">
            {addCartMutation.isLoading ? 'Добавляется...' : 'В корзину'}
          </button>
        </div>
      </form>
    </li>
  );
}