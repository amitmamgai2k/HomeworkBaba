import { initSocket } from './socket.js';
import http from 'http';
import app from './app.js';

const port = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});