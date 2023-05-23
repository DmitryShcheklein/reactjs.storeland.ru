const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);

function App() {
  return (
    <>
      <CardPage />
    </>
  );
}

// начальное состояние счетчика
const initialState = REACT_DATA;

// редуктор
function reducer(state, action) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload};
    case "decrementItem":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
function CardPage() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {CART_COUNT_TOTAL,CART_TRUNCATE_URL,cartItems,CART_SUM_NOW,HASH } = state;
  const [deliveryItems, setDeliveryItems] = React.useState([]);

  const loadData = (queryString = "") => {
    const params = new URLSearchParams({
      fast_order: 1,
      only_body: 1,
      hash: HASH,
      ...params,
    });
    params.append(queryString.split("=")[0], queryString.split("=")[1]);

    axios
      .get("/cart", {
        params,
        responseType: "text",
      })
      .then(response => {
        console.log(response.data);
        const data = JSON.parse(response.data);
        dispatch({ type: 'update', payload: data })
        // console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    // loadData();
  }, []);
  React.useEffect(() => {
    const params = new URLSearchParams({ ajax_q: 1, fast_order: 1 });
    axios({
      method: "post",
      url: "/cart/add",
      responseType: "text",
      data: params,
    }).then(response => {
      const data = JSON.parse(response.data);
      // console.log(response.data);
      setDeliveryItems(data);
      console.log(data);
    });
  }, []);

  const changeCount = (good, type) => {
    const { ORDER_LINE_QUANTITY, GOODS_MOD_ID } = good;
    const qty =
      type === "inc" ? ORDER_LINE_QUANTITY + 1 : ORDER_LINE_QUANTITY - 1;
    const queryString = `form[quantity][${GOODS_MOD_ID}]=${qty}`;

    loadData(queryString);
  };
  return (
    <>
      <ul>
        {deliveryItems.map(el => {
          return <li key={el.id}>{el.name}</li>;
        })}
      </ul>

      <a className="button _transparent" href={CART_TRUNCATE_URL}>
        Очистить корзину
      </a>
      <ul>
        {cartItems.map(item => {
          return (
            <li key={item.GOODS_MOD_ID}>
              <h3>{item.GOODS_NAME}</h3>
              <div>
                <strong>Кол-во:{item.ORDER_LINE_QUANTITY}</strong>
              </div>
              <div>
                <strong>Цена:{item.GOODS_MOD_PRICE_NOW}</strong>
              </div>
              <img width="80" src={item.GOODS_IMAGE} />
              <button
                className="button _reverse"
                onClick={() => changeCount(item, "dec")}
              >
                -
              </button>
              <button
                className="button _reverse"
                onClick={() => changeCount(item, "inc")}
              >
                +
              </button>
            </li>
          );
        })}
      </ul>
      <h2>Итого: {CART_COUNT_TOTAL} шт. за {CART_SUM_NOW} </h2>
    </>
  );
}
