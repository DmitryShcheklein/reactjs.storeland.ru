import { useCheckCartEmpty } from '/design/Hooks_cart.js';

const EmptyCart = () => {
  const isCartEmpty = useCheckCartEmpty();

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
};

window.EmptyCart = EmptyCart;
