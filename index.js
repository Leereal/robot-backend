const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnect = require('./database/connect');
require('dotenv').config({ path: require('find-config')('.env') }); //This will recurse parent directories until it finds a .env file to use.
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
//Socket
const server = require('http').createServer(app);
const { io } = require('./utils/socket');
io.attach(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
  // anything else you'd like to do here
});
io.on('check', (socket) => {
  console.log('Connected to socket');
});
//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser()); //For cookies
app.use(express.urlencoded({ extended: true }));

//routers
const signalRouter = require('./Routes/signalRouter.js');
const robotRouter = require('./Routes/robotRouter.js');
const robotSettingsRouter = require('./Routes/robotSettingsRouter.js');
const userRouter = require('./Routes/userRouter.js');
const mainRouter = require('./Routes/mainRouter.js');
const sequelize = require('./database/sqlite-connect');

app.use('/api/v1/signals', signalRouter);
app.use('/api/v1/robots', robotRouter);
app.use('/api/v1/robots-settings', robotSettingsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1', mainRouter);
//Main URL for testing
app.get('/', (req, res) => {
  res.json({ message: 'This is the home page but no data so far' });
});
app.use(notFound);
app.use(errorHandler);

//Start Server
const PORT = process.env.APP_PORT || 5000;
const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URL);
    await sequelize.sync({ alter: true });
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Main server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
