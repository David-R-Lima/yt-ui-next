import { io } from 'socket.io-client'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const socket = io(baseURL + '/now-listening')
