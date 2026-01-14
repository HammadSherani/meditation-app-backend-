import dotenv from 'dotenv';
dotenv.config();

import os from 'os';
// import config from './src/config/index.js';
import { server } from './src/app.js';

const port  = process.env.PORT || 3000;
const config = {
    port: port
};

server.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${config.port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🌐 Accessible on network: http://${getLocalIp()}:${config.port}`);
  }
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});