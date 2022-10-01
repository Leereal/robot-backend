// Node.js socket server script
const net = require('net');
require('dotenv').config();
const token = process.env.TOKEN; // Replace with your API token.
var open_trade = false;
var stake = process.env.STAKE;
const expiration = process.env.EXPIRATION; //In seconds
const app_id = process.env.APP_ID; // Replace with your app_id or leave as 1089 for testing.
// You can get your token here https://app.deriv.com/account/api-token.

var expiration_time;
//Martingale Variables
var current_level = 1;
const payout = process.env.CURRENT_PAYOUT;

console.log(process.env.TOKEN);
// Create a server object
const server = net
  .createServer((socket) => {
    socket.on('data', (data) => {
      ws.onmessage({ data: data });
    });

    socket.write('SERVER: Hello! This is server speaking.');
    socket.end('SERVER: Closing connection now.');
  })
  .on('error', (err) => {
    console.error(err);
  });

// Open server on port 8888
server.listen(8080, () => {
  console.log('opened server on', server.address().port);
});
const WebSocket = require('ws');

// You can register for an app_id here https://api.deriv.com/docs/app-registration/.

const ws = new WebSocket(
  'wss://ws.binaryws.com/websockets/v3?app_id=' + app_id
);

ws.onopen = function (evt) {
  ws.send(JSON.stringify({ authorize: token })); // First send an authorize call.
  setInterval(ping, 30000);
};

ws.onmessage = function (msg) {
  var data = JSON.parse(msg.data);
  // console.log('Response: %o', data); // Uncomment this to see full response data.
  if (data.error !== undefined) {
    console.log(data.error.message);
  } else if (data.msg_type == 'authorize') {
    console.log('Authorized to buy');
    ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
  } else if (data.msg_type == 'balance') {
    console.log('Current Balance: %o', data.balance.balance);
    dynamicStake(data.balance.balance);
    if (balance_target(data.balance.balance)) {
      ws.close();
    }
  } else if (data.msg_type == 'buy') {
    // Our buy request was successful let's print the results.
    console.log('Contract Id ' + data.buy.contract_id + '\n');
    console.log('Details ' + data.buy.longcode + '\n');
    open_trade = true;
    console.log('Signal Placed Successfully:' + new Date().toLocaleString());
  } else if (data.msg_type == 'proposal_open_contract') {
    // Because we subscribed to the buy request we will receive updates on our open contract.
    var isSold = data.proposal_open_contract.is_sold;
    if (isSold) {
      // If `isSold` is true it means our contract has finished and we can see if we won or not.
      console.log('Contract ' + data.proposal_open_contract.status + '\n');
      console.log('Profit ' + data.proposal_open_contract.profit + '\n');
      open_trade = false;
      if (data.proposal_open_contract.profit < 0) {
        current_level = current_level + 1;
      } else {
        current_level = 1;
        // ws.send(JSON.stringify({ "balance": 1, "subscribe": 1 }))
      }
    } else {
      // We can track the status of our contract as updates to the spot price occur.
      // console.log(data);
      var currentSpot = data.proposal_open_contract.current_spot;
      var entrySpot = 0;
      var currentProfit = data.proposal_open_contract.profit_percentage;
      var entryTickTime = data.proposal_open_contract.entry_tick_time;

      if (typeof data.proposal_open_contract.entry_tick != 'undefined') {
        entrySpot = data.proposal_open_contract.entry_tick;
      }
      open_trade = true;
      // console.log("Entry spot " + entrySpot + "\n");
      // console.log("Current spot " + currentSpot + "\n");
      // console.log("Difference " + (currentSpot - entrySpot) + "\n");
      console.log('Current Profit: ' + currentProfit + '%');
      if (close_on_profit(currentProfit, entryTickTime)) {
        //Close trade here
      }
    }
  } else if (data.msg_type == 'signal') {
    console.log('Open Trade: ' + open_trade);

    console.log('Signal received:' + new Date().toLocaleString());
    let symbol_code;
    const symbol = data.symbol;
    if (symbol == 'Volatility 10 Index') symbol_code = 'R_10';
    else if (symbol == 'Volatility 25 Index') symbol_code = 'R_25';
    else if (symbol == 'Volatility 50 Index') symbol_code = 'R_50';
    else if (symbol == 'Volatility 75 Index') symbol_code = 'R_75';
    else if (symbol == 'Volatility 100 Index') symbol_code = 'R_100';
    else if (symbol == 'Volatility 10 (1s) Index') symbol_code = '1HZ10V';
    else if (symbol == 'Volatility 25 (1s) Index') symbol_code = '1HZ25V';
    else if (symbol == 'Volatility 50 (1s) Index') symbol_code = '1HZ50V';
    else if (symbol == 'Volatility 75 (1s) Index') symbol_code = '1HZ75V';
    else if (symbol == 'Volatility 100 (1s) Index') symbol_code = '1HZ100V';
    // #Jumps
    else if (symbol == 'Jump 10 Index') symbol_code = 'JD10';
    else if (symbol == 'Jump 25 Index') symbol_code = 'JD25';
    else if (symbol == 'Jump 50 Index') symbol_code = 'JD50';
    else if (symbol == 'Jump 75 Index') symbol_code = 'JD75';
    else if (symbol == 'Jump 100 Index') symbol_code = 'JD100';
    else {
      symbol_code = symbol;
    }
    if (!open_trade) {
      place_order(symbol_code, data.trade_option);
    }
  } else if (data.msg_type == 'tick') {
    console.log('Connected: R_100 (' + data.tick.ask + ')');
  } else if (data.msg_type == 'ping') {
    console.log('Connection still alive');
    if (Date.now() > expiration_time) {
      open_trade = false;
    }
  } else {
    console.log(data);
  }
};

function ping() {
  ws.send(JSON.stringify({ ping: 1 }));
}

function place_order(symbol_code, trade_option) {
  console.log('Open Trade: ' + open_trade);
  let local_stake = stake;
  if (process.env.MARTINGALE === 'true') {
    local_stake = martingale();
  }
  open_trade = true;
  expiration_time = Date.now() + expiration * 60;
  ws.send(
    JSON.stringify({
      buy: 1,
      subscribe: 1,
      price: 3,
      parameters: {
        amount: 3,
        basis: 'stake',
        contract_type: trade_option === 'buy' ? 'CALL' : 'PUT',
        currency: 'USD',
        duration: expiration,
        duration_unit: 'm',
        symbol: symbol_code,
      },
    })
  );
}

function martingale() {
  let totalLastStakes = 0;
  let new_stake = 0;
  for (i = 1; i <= current_level; i++) {
    new_stake = (stake * i * payout + totalLastStakes) / payout;
    totalLastStakes =
      totalLastStakes + (stake * i * payout + totalLastStakes) / payout;
  }
  console.log('Martingale Stake: ' + Math.round(new_stake * 100) / 100);
  return Math.round(new_stake * 100) / 100;
}

function dynamicStake(balance) {
  if (current_level === 1) {
    stake = Math.round(0.0158 * balance * 100) / 100;
  }
}

function close_on_profit(current_profit, entry_time) {
  const max_close_time = entry_time + process.env.CLOSE_IN_PROFIT_TIME;
  if (current_profit >= 80 && Date.now() < max_close_time) {
    console.log('Profit above 80%. Close the Trade');
    return true;
  }
  return false;
}

function balance_target(balance) {
  if (balance > process.env.BALANCE_TARGET) {
    console.log('DAILY TARGET REACHED');
    return true;
  }
  return false;
}
