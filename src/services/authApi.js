import axios from "axios";

const API_URL = process.env.VITE_API_URL + '/api';

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/signup`, credentials);
  return response.data;
};

export const registerGoogle = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/google`, credentials);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
  return response.data;
}

export const resendVerification = async (email) => {
  const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
  return response.data;
}