// // src/test/SimpleSocketService.js
// import { io } from 'socket.io-client';

// class SimpleSocketService {
//   constructor() {
//     this.socket = null;
//   }

//   connect(url, token) {
//     if (this.socket) {
//       this.disconnect();
//     }

//     console.log(`Connecting to socket server: ${url}`);
//     console.log(`Using token: ${token ? 'yes' : 'no'}`);

//     this.socket = io(url, {
//       auth: token ? { token } : undefined,
//       transports: ['websocket', 'polling'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 20000,
//       forceNew: true
//     });

//     this.socket.on('connect', () => {
//       console.log('✅ Socket connected!', this.socket.id);
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('❌ Socket connection error:', error.message);
//     });

//     this.socket.on('error', (error) => {
//       console.error('Socket error:', error);
//     });

//     this.socket.on('disconnect', (reason) => {
//       console.warn('Socket disconnected:', reason);
//     });

//     return this.socket;
//   }

//   isConnected() {
//     return this.socket && this.socket.connected;
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       console.log('Socket disconnected');
//     }
//   }

//   emit(event, data) {
//     if (!this.socket || !this.socket.connected) {
//       console.error('Cannot emit event: socket not connected');
//       return false;
//     }

//     console.log(`Emitting ${event}:`, data);
//     this.socket.emit(event, data);
//     return true;
//   }
// }

// export default new SimpleSocketService();