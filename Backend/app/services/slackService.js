const request = require('request');

exports.sendToSlack = function (error) {
    
var options = { method: 'POST',
  url: 'https://hooks.slack.com/services/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',
  headers: 
   { 'content-type': 'application/json' },
  body: { 
      text:error._name  + '\n' + 
      error._status + '\n' +
      error._url  + '\n' + 
      JSON.stringify(error._parameters) + '\n' + 
      error._userId
       }, 
       json: true};

request(options, function (error,response,body) {
  if (error) console.log(error);

  console.log(body);
});

}