import axios from 'axios';

export const getAllLabels = async (
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping-label/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStoreLabels = async (
  storeId: any,
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping-label/${storeId}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getShippingLabelTransactions = async (
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/wallet/transactions`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getShippingWalletBalance = async () => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/wallet`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
