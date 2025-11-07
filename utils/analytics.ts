import axios from 'axios';

export const getStoreRevenue = async (
  storeId: string,
  period: string,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/store/revenue?storeId=${storeId}&period=${period}`,
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

export const getStoreTopProducts = async (
  storeId: string,
  limit: number,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/store/top-products?storeId=${storeId}&limit=${limit}`,
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

export const getStoreFulfillments = async (
  storeId: string,
  days: number,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/store/fullfilments?storeId=${storeId}&days=${days}`,
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

export const getAllRevenue = async (period: string, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/revenue/all?period=${period}`,
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

export const getTopStores = async (days: number, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/top-stores?days=${days}`,
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

export const getAllFulfillments = async (days: number, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/fulfillment/all?days=${days}`,
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
