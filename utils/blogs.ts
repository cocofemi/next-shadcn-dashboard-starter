import axios from 'axios';

export const getBlogs = async (search: string = '') => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/getall?search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const createBlog = async (formData: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/create`,
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

export const getBlog = async (blogId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/get/?blogId=${blogId}`,
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

export const updateBlog = async (formData: any, blogId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/update?blogId=${blogId}`,
      headers: {},
      method: 'PUT',
      data: formData,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteBlog = async (blogId: any) => {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/delete?blogId=${blogId}`,
      headers: {},
      method: 'DELETE',
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
