import AxiosInstance from "./AxiosInstance"

interface StoreGenderPayload {
  gender: string
}

const GenderService = {
  loadGenders: async () => {
    try {
      const response = await AxiosInstance.get('/gender/loadGenders')
      return response; 
    } catch(error) {
      throw error 
    }
  }, 
  storeGender: async (data: StoreGenderPayload) => {
    try {
      const response = await AxiosInstance.post('/gender/storeGender', data);
      return response
    } catch (error) {
      throw error;
    }
  }
}

export default GenderService