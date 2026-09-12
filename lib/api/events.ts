import apiClient from '../api-client';

export const eventsService = {
  getEvents: async () => {
    const response = await apiClient.get('/events/');
    return response.data;
  },
  
  createEvent: async (eventData: any) => {
    const response = await apiClient.post('/events/', eventData);
    return response.data;
  },
  
  deleteEvent: async (eventId: string) => {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  }
};
