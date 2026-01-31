import axios from 'axios';

export const getAllOrders = async (
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
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

export const getOrder = async (orderId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/get?orderId=${orderId}`,
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

export const getStoreOrderDetails = async (storeId: any, orderId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/store/get?storeId=${storeId}&orderId=${orderId}`,
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

export const getShippingRates = async (
  fromAddress: any,
  toAddress: any,
  parcels: any
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping/rates`,
      headers: {},
      method: 'POST',
      data: {
        fromAddress,
        toAddress,
        parcels
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const buyLabel = async (
  rateId: any,
  orderNumber: string,
  orderId: string,
  storeId: string
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/buy/shipping-label`,
      headers: {},
      method: 'POST',
      data: {
        rateId,
        orderNumber,
        orderId,
        storeId
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getShippingLabel = async (orderId: string, storeId: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shipping-label?orderId=${orderId}&storeId=${storeId}`,
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

export const completeOrder = async (
  orderId: any,
  storeId: any,
  trackingNumber: string,
  shippingProvider: string,
  shipmentDate: string,
  notes: string | any
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/new/fulfillment`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: {
        orderId,
        storeId,
        trackingNumber,
        shippingProvider,
        shipmentDate,
        notes
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
