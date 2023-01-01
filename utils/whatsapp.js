var qs = require('querystring');
var http = require('https');
require('dotenv').config({ path: require('find-config')('.env') });

var options = {
  method: 'POST',
  hostname: 'api.ultramsg.com',
  port: null,
  path: `/${process.env.INSTANCE_ID}/messages/chat`,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});
const message = `
This message is coming from a robot. Testing
   *❤️ NEW SIGNAL ❤️* 
  SYMBOL: EURUSD
  OPTION: BUY
  EXPIRATION: 3 minutes
  `;
req.write(
  qs.stringify({
    token: `${process.env.WHATSAPP_TOKEN}`,
    to: `${process.env.GROUP_ID}`,
    body: message,
    priority: '10',
    referenceId: '',
  })
);
req.end();
