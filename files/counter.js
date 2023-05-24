const container = document.getElementById("rootCounter");
const root = ReactDOM.createRoot(container);
const {configureStore,createSlice,createAsyncThunk} = RTK;
const {Provider, useSelector, useDispatch} = ReactRedux;

const initialState = {
  value: 0,
  users: [],
  usersLoading: false,
  usersError: false,
  userAddLoading: false
};
const createUserAction = createAsyncThunk(
  'data/createUser',
  async (userData, { extra: api }) => {
    await new Promise(resolve=>{
      setTimeout(()=>{
        resolve()
      }, 1000)
    })
    const {data} = await api.post(`/users`, {userData});
    const newUser = {id: data.id, ...data.userData};
    console.log('new', newUser);
    return newUser;
  },
);
const fetchUsersAction = createAsyncThunk(
  'data/fetchUsers',
  async (_, { extra: api }) => {
    await new Promise(resolve=>{
      setTimeout(()=>{
        resolve()
      }, 1000)
    })
    const {data} = await api.get(`/users`);

    return data;
  },
);

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
  },
  extraReducers(builder) {
    builder.addCase(createUserAction.fulfilled, (state, action) => {
      state.users = [...state.users, action.payload];
      state.userAddLoading = false;
    });
    builder.addCase(createUserAction.pending, (state) => {
      state.userAddLoading = true;
    });
    builder.addCase(fetchUsersAction.fulfilled, (state, action) => {
      state.users = action.payload;
      state.usersLoading = false;
    });
    builder.addCase(fetchUsersAction.pending, (state) => {
      state.usersLoading = true;
    });
    builder.addCase(fetchUsersAction.rejected, (state) => {
      state.usersLoading = false;
    });
  }  
});
const { increment, decrement } = counterSlice.actions;

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    thunk: {
      extraArgument: api,
    },
  }),
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
  const users = useSelector((state) => state.counter.users);
  const isLoading = useSelector((state) => state.counter.usersLoading);
  const userAddLoading = useSelector((state) => state.counter.userAddLoading);
  const dispatch = useDispatch();
  console.log(users);

  const onClick = ()=>{    
    dispatch(fetchUsersAction())
  }
  const onAdd = ()=>{    
    dispatch(createUserAction({
      "name": "Bob",
      "username": "Bobobobob",
      "email": "Sincere@april.biz",
    }))
  }

  return (
    <div>
      <h1>{count}</h1>
      <button className="button" onClick={() => dispatch(increment())}>+</button>
      <button className="button" onClick={() => dispatch(decrement())}>-</button>
      <hr/>
      {isLoading? (<h1>Загрузка...</h1>):(

        <ul>
        {users.map(el=>(
        <li key={el.id}>
          <h2>{el.name}-{el.id}</h2>
        </li>
        ))}
        </ul>
      )}
      {userAddLoading && <>Добавляю юзера</>}
      <button className="button" onClick={onClick}>fetch</button>
      <button className="button" onClick={onAdd}>addUser</button>

    </div>
  );
};