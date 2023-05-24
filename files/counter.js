const container = document.getElementById("rootCounter");
const root = ReactDOM.createRoot(container);
const {configureStore,createSlice} = RTK;
const {Provider, useSelector, useDispatch} = ReactRedux;

const initialState = {
  value: 0,
  data: null,
  isLoading: false,
  error: null,
};
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    hasError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setData: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    }
  },
});
const { increment, decrement,startLoading, hasError, setData } = counterSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);



function App() {
  return (
    <div>
      <h1>RTK Toolkit Example</h1>
      <Counter />
    </div>
  );
}



function Counter() {
  const count = useSelector((state) => state.counter.value);
  const data = useSelector((state) => state.data);
  const isLoading = useSelector((state) => state.isLoading);
  const d = useDispatch();
  console.log(data);
  const fetchData = () => async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      dispatch(setData(response.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

  const onClick = ()=>{
    d(fetchData)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button className="button" onClick={() => d(increment())}>+</button>
      <button className="button" onClick={() => d(decrement())}>-</button>
      <hr/>
      {isLoading? (<>Загрузка</>):(

        <pre>
        {data}
        </pre>
      )}
      <button className="button" onClick={onClick}>fetch</button>

    </div>
  );
};