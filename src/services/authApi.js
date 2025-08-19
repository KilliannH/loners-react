import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api";

export const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
  return response.data;
}

export const resendVerification = async (email) => {
  const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
  return response.data;
}