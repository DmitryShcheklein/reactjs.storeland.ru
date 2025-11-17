import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
console.dir(ReactQueryDevtools);
const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// function App() {
//   return <CartPage />;
// }
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartPage />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const QUERY_KEYS = {
  Cart: 'Cart',
  QuickForm: 'QuickForm',
  Order: 'Order',
  CartGlobalState: 'CartGlobalState',
};

const quickFormApi = {
  baseKey: QUERY_KEYS.QuickForm,
  getQuickFormData: () => {
    return queryOptions({
      queryKey: [QUERY_KEYS.QuickForm],
      keepPreviousData,
      staleTime: 1000 * 60 * 5,
      placeholderData: {
        ORDER_FORM_CONTACT_PERSON: 'Dima',
      },
      queryFn: async () => {
        const { data } = await axios.get(`/cart/add`, {
          responseType: 'text',
          params: {
            ajax_q: 1,
            fast_order: 1,
          },
        });

        return JSON.parse(data);
      },
    });
  },
};

function CartPage() {
  // const [counter, setCounter] = React.useState(0);
  const { data: quickFormData } = useQuery(quickFormApi.getQuickFormData());
  console.log(quickFormData);
  return (
    <div>
      <h1>Cart Page</h1>
      <h2>Name: {quickFormData?.ORDER_FORM_CONTACT_PERSON}</h2>

      {/* <p>Counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increment</button> */}
    </div>
  );
}
