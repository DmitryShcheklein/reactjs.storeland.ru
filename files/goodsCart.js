const { useState, useEffect, useRef } = React;
const { Provider, useSelector, useDispatch } = ReactRedux;

function GoodsCart() {
  return (
    <Provider store={goodsStore}>
      <GoodsCartBlock />
    </Provider>
  );
}

function GoodsCartBlock() {
  const data = useSelector(state => state.goods.data);

  return (
    <ul>
      {data.map((el, idx) => (
        <li key={idx + el}>{el}</li>
      ))}
    </ul>
  );
}
