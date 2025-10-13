// import React from 'https://esm.sh/react@18.2.0';
// import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
// import {
//   QueryClient,
//   QueryClientProvider,
// } from 'https://esm.sh/@tanstack/react-query';
// // import { ReactQueryDevtools } from 'https://esm.sh/@tanstack/react-query-devtools';

// const queryClient = new QueryClient();

// const container = document.getElementById('root-cart');
// const root = ReactDOM.createRoot(container);

// root.render(
//   <QueryClientProvider client={queryClient}>
//     <App />
//     {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//   </QueryClientProvider>
// );

// function App() {
//   return (
//     <>
//       <h1>hiiii</h1>
//     </>
//   );
// }

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['time', count],
    queryFn: async () => {
      const res = await fetch('https://worldtimeapi.org/api/ip');
      return res.json();
    },
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка при загрузке данных</p>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>React + TanStack Query</h1>
      <p>
        <b>Текущее время:</b> {data.datetime}
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          background: '#f5f5f5',
          cursor: 'pointer',
        }}
      >
        Обновить
      </button>

      {/* Панель Devtools */}
      <ReactQueryDevtools initialIsOpen={true} />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
