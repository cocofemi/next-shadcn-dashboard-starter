import axios from 'axios';

export const getAllStores = async (
  page: number,
  limit: number,
  search: string = '',
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/get/stores/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStore = async (storeName: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/get/store?storeName=${storeName}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getUserStore = async (userId: string, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/get/user/store/admin?userId=${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStoreListing = async (
  storeId: any,
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/store/get?storeId=${storeId}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getStoreOrders = async (
  storeId: any,
  token: string,
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/store/get/all?storeId=${storeId}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const storePaymentOnboarding = async (
  storeId: string,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/store/payment/onboarding?storeId=${storeId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const storePayoutCompleteCheck = async (
  storeId: string,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/store/payment/onboarding/complete?storeId=${storeId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
