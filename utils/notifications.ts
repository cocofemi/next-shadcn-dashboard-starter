import axios from 'axios';

export const getNotifications = async (storeId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/notification?storeId=${storeId}`,
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

export const markNotificationRead = async (id: any, storeId: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/notification/read?id=${id}&storeId=${storeId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const markAllNotificationsAsRead = async (storeId: string) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/notification/read-all?storeId=${storeId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
