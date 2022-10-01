const Signal = require("../Models/Signal");
const jwt = require("jsonwebtoken");
//Main Work
const { Socket } = require("../utils/socket");

//1. Create Signal
const createSignal = async (req, res) => {
  console.log(req.body);
  try {
    //   Save to database
    const signal = await Signal.create(req.body);
    res.status(201).json({ signal });

    //Socket emit
    //   global.io.emit('post_signal', { hello: 'world' });

    //Broadcast Signal to the users
    Socket.emit("post_signal", signal);

    //Send to Emails
    //Send to Telegram Channel
    //Send to WhatsApp
    //Send to SMS
  } catch (err) {
    res.status(500).json({ Error: "Failed to Save", err });
  }
};

//2. Get All Signals
const getSignals = async (req, res) => {
  try {
    const signals = await Signal.find().sort({ createdAt: -1 }).exec();
    res.status(200).json({ signals });
  } catch (err) {
    res.status(500).json({ Error: "Failed to Get Values", err });
  }
};

//3. Get one signal
const getSignal = async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);
    res.status(200).json({ signal });

    if (!signal) {
      res.status(404).json({ Error: "Not Found" });
    }
  } catch (err) {
    res.status(500).json({ Error: "Failed to Get Signal", err });
  }
};

//4. Edit Signal
const updateSignal = async (req, res) => {
  try {
    const signal = await Signal.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({ signal });
  } catch (err) {
    res.status(500).json({ Error: "Failed to Update", err });
  }
};

//5. Delete Signal
const deleteSignal = async (req, res) => {
  try {
    const signal = await Signal.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ Error: "Failed to Delete", err });
  }
};

//A very dangerous operation
const deleteSignals = async (req, res) => {
  try {
    const signals = await Signal.deleteMany();
    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ Error: "Failed to Update", err });
  }
};

// const filterSignals = (req, res) => {
//   const search = req.query.search;

//   const booksPerPage = 2;
//   let signals = [];

//   console.log(search);

//   if (search) {
//     db.collection('signals')
//       .find({ symbol: search })
//       .sort({ _id: 1 })
//       .skip(page.booksPerPage)
//       .limit(booksPerPage)
//       .forEach((signal) => signals.push(signal))
//       .then(() => {
//         res.status(200).json(signals);
//       })
//       .catch(() => {
//         res.status(500).json({ error: 'Could not fetch documents' });
//       });
//   } else {
//     res.status(500).json({ error: 'Not a valid record' });
//   }
// };

module.exports = {
  getSignals,
  getSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  deleteSignals,
};
