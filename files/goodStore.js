const { configureStore, createSlice, createAsyncThunk } = RTK;
const goodsSlice = createSlice({
  name: "goodsStore",
  initialState: {
    data: ["testModId"],
    loading: false,
    error: false,
  },
  reducers: {
    setModId: (state, action) => {
      state.data = [...state.data, action.payload];
    },
    removeModId: (state, action) => {
      state.data = [...state.data].filter(el => el !== action.payload);
    },
  },
  extraReducers(builder) {},
});

const goodsStore = configureStore({
  reducer: {
    goods: goodsSlice.reducer,
  },
});
const { setModId, removeModId } = goodsSlice.actions;
