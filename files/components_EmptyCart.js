const EmptyCart = () => {
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
};

window.EmptyCart = EmptyCart;
