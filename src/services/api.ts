import axios, { AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL
const authorization = process.env.NEXT_PUBLIC_TOKEN

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: 'Bearer ' + authorization,
  },
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error: AxiosError) {
    if (error instanceof AxiosError) {
      if (error.request.status === 500) {
        console.log(error)
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(error)
      }
    }

    return Promise.reject(error)
  },
)
