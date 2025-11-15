// get all room by api 
export const Rooms = async () => {
  try {
    const response = await fetch('/api/rooms');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return [];
  }
}