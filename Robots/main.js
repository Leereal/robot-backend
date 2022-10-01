const Server = require('./server.js');

const server = new Server(
  1,
  4000,
  1089,
  'MAjSCirrXFH83Be',
  0.35,
  3,
  0.95,
  'martingale',
  '50000'
);
server.start();
server.connect();
