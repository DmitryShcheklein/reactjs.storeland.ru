const { useState, useEffect, useRef } = React;
const { Provider, useSelector, useDispatch } = ReactRedux;

function Good({ item }) {
  return (
    <Provider store={goodsStore}>
      <GoodBlock item={item} />
    </Provider>
  );
}

function GoodBlock({ item }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  return (
    <>
      <h2>Hello from: {item.id}</h2>
      {/* <button
        type="button"
        onClick={() => {
          console.log(added);
          if (added) {
            dispatch(removeModId(item.id));
            setAdded(false);
          } else {
            dispatch(setModId(item.id));
            setAdded(true);
          }
        }}
        className="button"
      >
        {!added ? "add" : "remove"}
      </button> */}
    </>
  );
}
