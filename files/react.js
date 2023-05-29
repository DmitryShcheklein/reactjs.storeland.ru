const {useState, useEffect} = React;
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
    const [key, value] = queryString.split("=");
    const params = new URLSearchParams({
      fast_order: 1,
      only_body: 1,
      hash: REACT_DATA.HASH
    });
    params.append(key,value);

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
  'form/get',
  async (_, { extra: api }) => {
    const params = new URLSearchParams({ ajax_q: 1, fast_order: 1 });
    const {data} = await api.post(`/cart/add`, params, {
      responseType: "text"
    });

    const newOrderFormData= JSON.parse(data)

    return newOrderFormData;
  },
);
const createOrderAction = createAsyncThunk(
  'form/createOrder',
  async (formData, { extra: api }) => {    
    formData.append('ajax_q', 1);
    formData.append('hash', REACT_DATA.HASH);
    const {data} = await api.post(`/order/stage/confirm`, formData);

    console.log(data);  
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
    order: {
      loading: false,
      location: undefined,
      status: undefined,
      error: undefined
    },    
    data: {
      orderDelivery: []
    },
    dataLoading: false,
    error: false
  },
  extraReducers(builder) {
    builder.addCase(getFormAction.fulfilled, (state, action) => {
      state.data =  action.payload;
      state.dataLoading = false;
    });
    builder.addCase(getFormAction.pending, (state) => {
      state.dataLoading = true;
    });
    builder.addCase(getFormAction.rejected, (state) => {      
      state.dataLoading = false;
    });
    builder.addCase(createOrderAction.fulfilled, (state, action) => {
      state.order.loading = false;
    });
    builder.addCase(createOrderAction.pending, (state) => {
      state.order.loading = true;
    });
    builder.addCase(createOrderAction.rejected, (state) => {      
      state.order.loading = false;
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

store.dispatch(getFormAction())



function Card() {
  const { CART_COUNT_TOTAL, cartItems, CART_SUM_NOW,FORM_NOTICE} =  useSelector((state) => state.card.data);;
  const isLoading = useSelector((state) => state.card.loading);;
  const dispatch = useDispatch();

  return (
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
        {FORM_NOTICE && <p>{FORM_NOTICE}</p>}
        <ul>
          {cartItems.map(item => (
            <CardItem item={item} key={item.GOODS_MOD_ID} />
          ))}
        </ul>

        <h2>
          Итого: {CART_COUNT_TOTAL} шт. за {CART_SUM_NOW}
        </h2>      
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
  const [inputValue, setInputValue] = useState(ORDER_LINE_QUANTITY);
  const dispatch = useDispatch();

  useEffect(()=>{
    
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
  const isDataLoading =  useSelector((state) => state.form.dataLoading);
  const isOrderLoading =  useSelector((state) => state.form.order.loading);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    form: {
      contact: {
        person: 'Bob',
        phone: '898739525'
      },
      delivery: {
        id: ''
      },
      payment: {
        id: ''
      }
    }
  });

  useEffect(()=>{
    const delivery = orderDelivery[0]

    setFormState(prev=>({
      form: {      
          ...prev.form,
          delivery: {
            id: delivery?.id
          },
          payment: {
            id: delivery?.availablePaymentList[0]?.id
          }        
      }
    }))
}, [orderDelivery])  
  

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData(event.target)
    
    dispatch(createOrderAction(formData))
  };

  const handleChange = event => {
    const { name, value } = event.target;
    // Разбиваем строку "form[contact][person]" на массив ключей ["form", "contact", "person"]
    const keys = name.split(/\[|\]/).filter(Boolean)   

    const fieldData = keys.reduceRight((acc, key, index) => {
      const isLast = index === keys.length - 1; 

      return {[key]: isLast? value : acc}
    }, {});
    console.dir(fieldData)
    const newData =  _.mergeWith({...formState}, fieldData);    
    console.log(newData);
    setFormState(newData)
    

  };

  return <>
        {isDataLoading && <>Загружаю варианты доставки...</>}
        {/* Форма заказа */}
        <form onSubmit={handleSubmit}>
          <input className="input" name="form[contact][person]" value={formState.form.contact.person} onChange={handleChange} maxLength="100" type="text" placeholder="" required/>
          <input className="input" name="form[contact][phone]" value={formState.form.contact.phone} onChange={handleChange} maxLength="255" pattern="\+?\d*" type="tel" placeholder="" required />
          {orderDelivery.length ?(
            <>
            <select onChange={handleChange} name="form[delivery][id]" className="quickform__select" value={formState.form.delivery.id}>
              {orderDelivery.map(({id, name}) => (
                <option value={id} key={id}>
                {name}
                </option>
              ))}
            </select>
            <select onChange={handleChange} name="form[payment][id]" className="quickform__select" value={formState.form.payment.id}>
              {orderDelivery.filter(el=>el.id === Number(formState.form.delivery.id)).map((el)=>{
                return el.availablePaymentList.map(({id, name}) => (
                  <option value={id} key={id}>
                  {name}
                  </option>
                ))
              })}
            </select>
            </>
          ): null}
          <hr/>
          <button className="button" disabled={isOrderLoading}>
            {isOrderLoading? 'Оформляется': 'Оформить'}            
          </button>
        </form>
  </>
}

function App() {
  const {cartItems} =  useSelector((state) => state.card.data);;
  return (
    <>
    {cartItems.length? (
      <>
      <Card />
      <OrderForm />
      </>
    ): (
      <>
      <h2>Корзина пуста</h2>
      </>
    )}
    </>
  );
}
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);