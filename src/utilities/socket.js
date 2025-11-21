import { io } from "socket.io-client";

const socket = io(process.env.SOCKET_BACKEND_SERVER_URI);

export default socket;
