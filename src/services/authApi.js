import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/signup`, credentials);
  return response.data;
};