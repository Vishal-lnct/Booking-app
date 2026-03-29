// src/api/bookingService.js

import axios from "axios";
import { BASE_URL } from "./config";

//  AXIOS INSTANCE
const API = axios.create({
  baseURL: BASE_URL,
});

// REQUEST INTERCEPTOR 
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Token ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

//  RESPONSE INTERCEPTOR 
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

//  ROOMS APIs

export const getRooms = async () => {
  try {
    const res = await API.get("/rooms/");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getRoomById = async (id) => {
  const res = await API.get(`/rooms/${id}/`);
  return res.data;
};

export const createRoom = async (data) => {
  const res = await API.post("/rooms/", data);
  return res.data;
};

export const updateRoom = async (id, data) => {
  const res = await API.put(`/rooms/${id}/`, data);
  return res.data;
};

export const deleteRoom = async (id) => {
  const res = await API.delete(`/rooms/${id}/`);
  return res.data;
};

//  BOOKINGS APIs

export const getBookings = async () => {
  const res = await API.get("/occupied-dates/");
  return res.data;
};

export const createBooking = async (data) => {
  const res = await API.post("/occupied-dates/", data);
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await API.put(`/occupied-dates/${id}/`, data);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await API.delete(`/occupied-dates/${id}/`);
  return res.data;
};

// AUTH APIs 

export const loginUser = async (data) => {
  try {
    const res = await API.post("/login/", data);

    // Don't store token here (we already do in AuthForm)
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/register/", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

//  USER APIs 

export const getUser = async (id) => {
  const res = await API.get(`/users/${id}/`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/users/");
  return res.data;
};

// EXPORT 
export default API;