function Greeting(props) {
    const [name, setName] = React.useState(props.name);
    const [items, setItems] = React.useState([])
    const [goods, setGoods] = React.useState(REACT_DATA.cartItems)
    const totalPrice = goods.reduce((acc, current)=>{
      return acc+=current.GOODS_MOD_PRICE_NOW * current.ORDER_LINE_QUANTITY
    },0)
    
    React.useEffect(()=>{
      const params = new URLSearchParams({ ajax_q: 1, fast_order: 1 });
      axios({
        method: "post",
        url: "/cart/add",
        responseType: "text",
        data: params,
      }).then((response) => {
        const data = JSON.parse(response.data);
        // console.log(response.data);
        setItems(data)
        console.log(data);
      });  
    }, [])

    const changeCount = (good, type)=>{
      // console.log(good, type);
      const {ORDER_LINE_QUANTITY,GOODS_MOD_ID }= good;
      const qty = type === 'inc'? ORDER_LINE_QUANTITY + 1: ORDER_LINE_QUANTITY-1;
      const queryString = `form[quantity][${GOODS_MOD_ID}]=${qty}`;
      const params = new URLSearchParams({
        fast_order: 1,
        hash: REACT_DATA.HASH,        
      });
      params.append(queryString.split('=')[0], queryString.split('=')[1]);
      params.append("only_body", 1)
      params.append("_", 1684735260403)

      // axios({
      //   method: "get",
      //   url: "/cart",
      //   responseType: "text",
      //   data: params,
      // }).then((response) => {
      //   console.log(response.data);
      //   // const data = JSON.parse(response.data);
      //   // console.log(response.data);
      //   // setItems(data)
      //   // console.log(data);
      // });  

      axios.get('/cart', {
        params: params,
        responseType: 'text'
      })
      .then(response => {
        const data = JSON.parse(response.data);
        setGoods(data.cartItems)
        console.log(data);        
      })
      .catch(error => {
        console.log(error);
      });
    }
    return (
        <>
          {REACT_DATA.CartTotal}
            <h1>Hello, { name }!</h1>
            <input type="text" value={ name } onChange={(event) => setName(event.target.value)} />
            <ul>
              {items.map(el=>{
                return <li key={el.id}>{el.name}</li>
              })}
            </ul>
            
            <a className="button _transparent" href={REACT_DATA.CART_TRUNCATE_URL}>Очистить корзину</a>
            <ul>
            {goods.map(item=>{
              return (
              <li key={item.GOODS_MOD_ID}>
                <h3>{item.GOODS_NAME}</h3>
                <div>
                <strong>Кол-во:{item.ORDER_LINE_QUANTITY}</strong>
                </div>
                <div>
                <strong>Цена:{item.GOODS_MOD_PRICE_NOW}</strong>
                </div>
                <img width="80" src={item.GOODS_IMAGE}/>
                <button className="button _reverse" onClick={()=>changeCount(item, 'dec')}>-</button>
                <button className="button _reverse" onClick={()=>changeCount(item, 'inc')}>+</button>
              </li>)
            })}
            </ul>
            <h2>Итого: {totalPrice} </h2>
        </>);
    
}  
function MyApp() {
  return (        <>
  <Greeting name="My" />
  </>)
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MyApp />);
