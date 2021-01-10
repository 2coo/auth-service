import io from "socket.io-client";

const socket = io(String(process.env.REACT_APP_DOMAIN));
socket.on("connect", () => {
  socket.emit("join", { userid: localStorage.userid });
});

export default socket;
