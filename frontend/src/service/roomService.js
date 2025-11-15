import api from '../lib/axios';

// get all room by api 
export const Rooms = async () => {
  try {
    const response = await api.get('/rooms');
    console.log('Rooms API response:', response.data);
    console.log('Number of rooms fetched:', response.data.length);
    return response.data;

  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}