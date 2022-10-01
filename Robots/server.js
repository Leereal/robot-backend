const net = require('net');
const WebSocket = require('ws');
const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=' + 1089);
const {
  getRobotSettings,
  deactivateRobot,
} = require('../Controllers/functions');

module.exports = class Server {
  constructor(
    user_id,
    port,
    token,
    stake,
    expiration,
    payout,
    risk_management,
    balance_target,
    dynamic_stake = true
  ) {
    this.port = port;
    this.token = token;
    this.stake = stake;
    this.expiration = expiration;
    this.payout = payout;
    this.user_id = user_id;
    this.risk_management = risk_management;
    this.dynamic_stake = dynamic_stake;
    this.multiplier = 0.0158;
    this.balance_target = balance_target;
    this.netServer = net
      .createServer((socket) => {
        socket.on('data', async (data) => {
          ws.onmessage({ data: data });
        });
        socket.write('SERVER: Hello! This is server speaking.');
        socket.end('SERVER: Closing connection now.');
      })
      .on('error', (err) => {
        console.error(err);
      });
  }

  check_target() {
    if (this.get_balance > this.balance_target) {
      console.log('DAILY TARGET REACHED');
      return true;
    }
    return false;
  }
  dynamicStake() {
    const balance = this.get_balance();
    if (this.dynamic_stake === true) {
      if (current_level === 1) {
        return Math.round(this.multiplier * balance * 100) / 100;
      } else {
        //return saved this.stake;
      }
    } else {
      return this.stake;
    }
  }

  async get_balance() {}

  get_stake(current_level) {
    if (this.risk_management === 'martingale' && current_level > 1) {
      let totalLastStakes = 0;
      let new_stake = 0;
      for (i = 1; i <= current_level; i++) {
        new_stake =
          (this.dynamicStake * i * this.payout + totalLastStakes) / this.payout;
        totalLastStakes =
          totalLastStakes +
          (this.dynamicStake * i * this.payout + totalLastStakes) / this.payout;
      }
      console.log('Martingale Stake: ' + Math.round(new_stake * 100) / 100);
      return Math.round(new_stake * 100) / 100;
    } else {
      return this.dynamicStake;
    }
  }

  ping() {
    ws.send(JSON.stringify({ ping: 1 }));
  }

  place_order(symbol_code, trade_option) {
    console.log('Open Trade: '); //+ open_trade);
    //open_trade = true;//Close to avoid multiple trades
    const expiration_time = Date.now() + this.expiration * 60;
    ws.send(
      JSON.stringify({
        buy: 1,
        subscribe: 1,
        price: this.get_stake(current_level),
        parameters: {
          amount: this.get_stake(current_level),
          basis: 'stake',
          contract_type: trade_option === 'buy' ? 'CALL' : 'PUT',
          currency: 'USD',
          duration: this.expiration,
          duration_unit: 'm',
          symbol: symbol_code,
        },
      })
    );
  }

  start() {
    this.netServer.listen(this.port, () => {
      console.log('Robot Server started on', this.port);
    });
  }

  stop() {
    this.netServer.close(function () {
      //   ws.close();
      console.log('Robot Server Stopped');
    });
  }

  //==========================================================WS Code =====================================================//
  async connect() {
    ws.onopen = function (evt) {
      ws.send(JSON.stringify({ authorize: this.token })); // First send an authorize call.
      setInterval(this.ping, 30000);
    };
    ws.onmessage = async function (msg) {
      const data = JSON.parse(msg.data);
      const account_settings = await getRobotSettings(1);
      if (!account_settings.active) {
        console.log('Trading is not active on this account');
      } else {
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
            //We must set active to false on the current robot not to close socket
            deactivateRobot(account.id);
            ws.close();
          }
        } else if (data.msg_type == 'buy') {
          // Our buy request was successful let's print the results.
          console.log('Contract Id ' + data.buy.contract_id + '\n');
          console.log('Details ' + data.buy.longcode + '\n');
          open_trade = true;
          console.log(
            'Signal Placed Successfully:' + new Date().toLocaleString()
          );
        } else if (data.msg_type == 'proposal_open_contract') {
          // Because we subscribed to the buy request we will receive updates on our open contract.
          var isSold = data.proposal_open_contract.is_sold;
          if (isSold) {
            // If `isSold` is true it means our contract has finished and we can see if we won or not.
            console.log(
              'Contract ' + data.proposal_open_contract.status + '\n'
            );
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
            console.log(
              'Current Profit: ' +
                currentProfit +
                '% | Current Level: ' +
                current_level +
                ' Martingale :' +
                account.martingale
            );
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
          else if (symbol == 'Volatility 100 (1s) Index')
            symbol_code = '1HZ100V';
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
      }
    };
  }
};
