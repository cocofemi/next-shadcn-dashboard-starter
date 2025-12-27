import axios from 'axios';

export const getAllListing = async (
  page: number,
  limit: number,
  search: string = ''
) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/get/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
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

export const createListing = async (formData: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/create`,
      headers: {},
      method: 'POST',
      data: formData,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getListing = async (listingId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/get/?listingId=${listingId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateListing = async (formData: any, listingId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/update?id=${listingId}`,
      headers: {},
      method: 'PATCH',
      data: formData,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteListing = async (listingId: any, userId: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listing/delete?id=${listingId}&userId=${userId}`,
      headers: {},
      method: 'DELETE',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
