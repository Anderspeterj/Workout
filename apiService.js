import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://exercisedb.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': '8635fbc913mshbb084128b19528fp1f742djsn79f2d47b3468',  
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
});

export default apiClient;
