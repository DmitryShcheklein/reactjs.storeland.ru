const {configureStore,createSlice,createAsyncThunk} = RTK;
const {Provider, useSelector, useDispatch} = ReactRedux;
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

const api = axios.create();

const updateCardAction = createAsyncThunk(
  'card/update',
  async (cardData, { extra: api }) => {
    const {modId, count} = cardData;
    const queryString = `form[quantity][${modId}]=${count}`;
    const params = new URLSearchParams({
      fast_order: 1,
      only_body: 1,
      hash: REACT_DATA.HASH
    });
    params.append(queryString.split("=")[0], queryString.split("=")[1]);

    const {data} = await api.get(`/cart`, {
      params,
      responseType: "text"
    });
    const newCardData = JSON.parse(data)

    return newCardData;
  },
);
const clearCardAction = createAsyncThunk(
  'card/clear',
  async (_, { extra: api }) => {
    const response = await api.get(`/cart/truncate/`);    

    return response.status === 200;
  },
);

const getFormAction = createAsyncThunk(
  'orderForm/get',
  async (_, { extra: api }) => {
    const params = new URLSearchParams({ ajax_q: 1, fast_order: 1 });
    const {data} = await api.post(`/cart/add`, params, {
      responseType: "text"
    });

    const newOrderFormData= JSON.parse(data)
    console.log(newOrderFormData);

    return newOrderFormData;
  },
);

const cardSlice = createSlice({
  name: 'card',
  initialState: {
    data: REACT_DATA,
    loading: false,
    error: false
  },
  extraReducers(builder) {
    builder.addCase(updateCardAction.fulfilled, (state, action) => {
      state.data =  action.payload;
      state.loading = false;
    });
    builder.addCase(updateCardAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCardAction.rejected, (state) => {      
      state.loading = false;
    });
    builder.addCase(clearCardAction.fulfilled, (state, action) => {    
      state.data.cartItems =  action.payload ? []: state.data.cartItems;  
      state.loading = false;
    });
    builder.addCase(clearCardAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearCardAction.rejected, (state) => {      
      state.loading = false;
    });
  }  
});


const formSlice = createSlice({
  name: 'form',
  initialState: {
    data: {
      orderDelivery: []
    },
    loading: false,
    error: false
  },
  extraReducers(builder) {
    builder.addCase(getFormAction.fulfilled, (state, action) => {
      state.data =  action.payload;
      state.loading = false;
    });
    builder.addCase(getFormAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFormAction.rejected, (state) => {      
      state.loading = false;
    });
  }  
});


const store = configureStore({
  reducer: {
    card: cardSlice.reducer,
    form: formSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});





function Card() {
  const { CART_COUNT_TOTAL, cartItems, CART_SUM_NOW } =  useSelector((state) => state.card.data);;
  const isLoading = useSelector((state) => state.card.loading);;
  const dispatch = useDispatch();
  
  return (
    <>
    {cartItems.length ? (
      <>
        <button className="button _transparent" onClick={()=> {
          console.log(
            'clear'
          );
          dispatch(clearCardAction())
        }}>
          Очистить корзину
        </button>

        {isLoading && <>Обновление...</>}
        <ul>
          {cartItems.map(item => (
            <CardItem item={item} key={item.GOODS_MOD_ID} />
          ))}
        </ul>

        <h2>
          Итого: {CART_COUNT_TOTAL} шт. за {CART_SUM_NOW}
        </h2>      
      </>
    ): (
    <>
      <h2>Корзина пуста</h2>
    </>)
    }
    </>
  );
}

function CardItem({ item }) {  
  const {
    GOODS_MOD_ID,
    GOODS_NAME,
    GOODS_MOD_PRICE_NOW,
    ORDER_LINE_QUANTITY,
    GOODS_IMAGE,
  } = item;
  const [inputValue, setInputValue] = React.useState(ORDER_LINE_QUANTITY);
  const dispatch = useDispatch();

  React.useEffect(()=>{
    dispatch(updateCardAction({
      modId: GOODS_MOD_ID,
      count: inputValue
    })) 
  },[inputValue])

  const handleChange = event => {
    const {value} = event.target
    setInputValue(value);
    
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
            onClick={() => {setInputValue(inputValue - 1);}}
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
            onClick={() => {setInputValue(inputValue + 1);}}
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

function OrderForm(){
  const {orderDelivery} =  useSelector((state) => state.form.data);
  const isLoading =  useSelector((state) => state.form.loading);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(getFormAction())
  }, []);

  return <>
      {isLoading && <>Загружаю варианты доставки...</>}
      <ul>
        {orderDelivery.map(el => {
          return (
          <li key={el.id}>
            <h3>{el.name}</h3>
            <strong>{el.price}</strong>
          </li>            
          )
        })}
      </ul>
  </>
}

function App() {
  return (
    <>
      <Card />
      <OrderForm />
    </>
  );
}
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);