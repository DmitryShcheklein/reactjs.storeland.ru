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
      return { ...state, ...action.payload };
    case "decrementItem":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
function CardPage() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { CART_COUNT_TOTAL, CART_TRUNCATE_URL, cartItems, CART_SUM_NOW, HASH } =
    state;
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
        // console.log(response.data);
        const data = JSON.parse(response.data);
        dispatch({ type: "update", payload: data });
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
        {cartItems.map(item => (
          <CardItem item={item} loadData={loadData} key={item.GOODS_MOD_ID} />
        ))}
      </ul>

      <h2>
        Итого: {CART_COUNT_TOTAL} шт. за {CART_SUM_NOW}{" "}
      </h2>
    </>
  );
}

function CardItem(props) {
  const { item, loadData } = props;
  const {
    GOODS_MOD_ID,
    GOODS_NAME,
    GOODS_MOD_PRICE_NOW,
    ORDER_LINE_QUANTITY,
    GOODS_IMAGE,
  } = item;
  const [inputValue, setInputValue] = React.useState(ORDER_LINE_QUANTITY);

  React.useEffect(() => {
    const queryString = `form[quantity][${GOODS_MOD_ID}]=${inputValue}`;

    loadData(queryString);
  }, [inputValue]);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

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
            className="qty__btn"
            onClick={() => setInputValue(inputValue - 1)}
          >
            <svg className="icon">
              <use xlinkHref="/design/sprite.svg#minus-icon"></use>
            </svg>
          </button>
          <input
            min="1"
            type="number"
            value={inputValue}
            onChange={handleChange}
            className="input qty__input"
          />
          <button
            className="qty__btn"
            onClick={() => setInputValue(inputValue + 1)}
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
