
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

export const fetchWithCurrency = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const selectedCurrency = await AsyncStorage.getItem('selectedCurrency');

  const headers = new Headers(init?.headers);
  if (selectedCurrency) {
    headers.set('X-Currency', selectedCurrency);
  }

  let url = input.toString();
  if (url.startsWith(BASE_URL)) {
    return fetch(url, {
      ...init,
      headers,
    });
  }

  return fetch(input, init);
};
