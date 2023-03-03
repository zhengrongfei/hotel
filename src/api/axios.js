import axios from "axios"

const BASE_URL = "https://localhost:3000"

export default axios.create({
  baseURL: BASE_URL
})

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json"},
  withCredentials: true
})