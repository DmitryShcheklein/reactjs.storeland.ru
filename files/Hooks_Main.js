import {
  QueryClient,
} from 'ReactQuery';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export const QUERY_KEYS = {
  Cart: 'Cart',
  CartState: 'CartState',
  FormState: 'FormState',
  QuickFormData: 'QuickFormData',
};
