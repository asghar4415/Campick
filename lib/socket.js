import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const socket = io(API_URL, {
  withCredentials: true,
  transports: ['websocket'] // Optional: Use websocket for performance
});

// Debugging connection
socket.on('connect', () => {
  // console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;
