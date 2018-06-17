const request = require('request');

exports.sendToSlack = function (errname,errstatus) {
    
var options = { method: 'POST',
  url: 'https://hooks.slack.com/services/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',
  headers: 
   { 'content-type': 'application/json' },
  body: { 
      text:errname + '\n' + errstatus
       }, 
       json: true};

request(options, function (error, response, body) {
  if (error) console.log(error);

  console.log(body);
});

}