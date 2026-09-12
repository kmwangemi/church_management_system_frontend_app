import apiClient from '../api-client';

export const financesService = {
  getOfferings: async () => {
    const response = await apiClient.get('/finances/offerings');
    return response.data;
  },
  
  recordOffering: async (offeringData: any) => {
    const response = await apiClient.post('/finances/offerings', offeringData);
    return response.data;
  }
};
