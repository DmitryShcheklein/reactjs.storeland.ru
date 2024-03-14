import { queryClient, QUERY_KEYS } from '/design/Hooks_Main.js'
import {
  useCartState
} from '/design/Hooks_Cart.js';
import {
  useQuery
} from 'ReactQuery';

export function useFormState() {
  const INITIAL_FORM_DATA = {
    form: {
      contact: {
        person: undefined,
        phone: undefined,
        email: undefined,
      },
      delivery: {
        address_street: undefined,
        address_home: undefined,
        address_flat: undefined,
      },
    },
  };
  const key = QUERY_KEYS.FormState;
  const query = useQuery({
    queryKey: [key],
    initialData: INITIAL_FORM_DATA,
    queryFn: () => initialData,
    enabled: false,
  });

  return [query.data, (value) => queryClient.setQueryData([key], value)];
}

export function useQuickFormData() {
  const [, setFormState] = useFormState();
  const [, setCartState] = useCartState();

  return useQuery({
    queryKey: [QUERY_KEYS.QuickFormData],
    initialData: { SETTINGS_ORDER_FIELDS: {} },
    queryFn: async () => {
      const { data: dataString } = await axios.get(`/cart/add`, {
        responseType: 'text',
        params: {
          ajax_q: 1,
          fast_order: 1,
        },
      });

      return JSON.parse(dataString).data;
    },
    onSuccess: (data) => {
      const {
        ORDER_FORM_CONTACT_PERSON,
        ORDER_FORM_CONTACT_PHONE,
        ORDER_FORM_CONTACT_EMAIL,
      } = data;

      const [firstDelivery] = data?.deliveries;

      setCartState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          delivery: {
            id: firstDelivery?.id,
            zone_id: firstDelivery?.zoneList[0]?.zoneId,
          },
          payment: {
            id: firstDelivery?.availablePaymentList[0]?.id,
          },
        },
      }));

      setFormState((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          contact: {
            person: ORDER_FORM_CONTACT_PERSON,
            //  || 'User'
            phone: ORDER_FORM_CONTACT_PHONE,
            // || '89876543210'
            email: ORDER_FORM_CONTACT_EMAIL,
            //  || 'user@test.ru'
          },
        },
      }));
    },
    enabled: !window.CART_IS_EMPTY,
  });
}

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: async (form) => {
      const formData = new FormData(form);

      for (const pair of formData.entries()) {
        // console.log(pair[0] + ', ' + pair[1]);formData
      }
      const response = await axios.post(`/order/stage/confirm`, formData, {
        params: {
          ajax_q: 1,
          hash: window.HASH,
        },
      });

      return response;
    },
    onSuccess: ({ data }) => {
      const { status, location: redirectLink, message } = data;

      if (status === 'error') {
        console.error(message);
      }
      if (redirectLink) {
        location.href = redirectLink;
      }
    },
  });
}