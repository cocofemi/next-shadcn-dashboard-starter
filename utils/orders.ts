import axios from 'axios';

export const getAllOrders = async (
  page: number,
  limit: number,
  token: string = '',
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
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

export const getOrder = async (orderId: any, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/get?orderId=${orderId}`,
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

export const getStoreOrderDetails = async (
  storeId: any,
  orderId: any,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/store/get?storeId=${storeId}&orderId=${orderId}`,
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

export const getShippingRates = async (
  fromAddress: any,
  toAddress: any,
  parcels: any,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping/rates`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      data: {
        fromAddress,
        toAddress,
        parcels
      }
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const buyLabel = async (
  rateId: any,
  orderId: string,
  storeId: string,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/buy/shipping-label`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      data: {
        rateId,
        orderId,
        storeId
      }
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getShippingLabel = async (orderId: any, token: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping-label?orderId=${orderId}`,
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

export const completeOrder = async (
  orderId: any,
  storeId: any,
  trackingNumber: string,
  shippingProvider: string,
  shipmentDate: string,
  notes: string | any,
  token: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/new/fulfillment`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      data: {
        orderId,
        storeId,
        trackingNumber,
        shippingProvider,
        shipmentDate,
        notes
      }
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
