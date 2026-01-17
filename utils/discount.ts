import axios from 'axios';

export const createDiscount = async (
  code: string,
  type: string,
  description: string,
  value: number,
  minPurchase: number,
  maxDiscount: number,
  usageLimit: number,
  startDate: Date,
  endDate: Date
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/discount`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        code,
        type,
        description,
        value,
        minPurchase,
        maxDiscount,
        usageLimit,
        startDate,
        endDate
      },
      method: 'POST',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllDiscounts = async (
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/discount/?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
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

export const getDiscount = async (id: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/discount/${id}`,
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

export const updateDiscount = async (id: any, data: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/discount/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data,
      method: 'PUT',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteDiscount = async (id: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/discount/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
