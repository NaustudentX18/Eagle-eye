/**
 * OmniRecon — Backend Server Entry Point
 */

import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', name: 'OmniRecon API' }));
});

server.listen(PORT, () => {
  console.log(`OmniRecon backend listening on port ${PORT}`);
});

export default server;
