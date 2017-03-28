var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '1507809147',
  channelSecret: '19abedc7a873bd705cf76bdb06f8faaf',
  channelAccessToken: '7CNicd1iAoHlllHo1peevvAZMqcSMedV3PE6qTyeBGvGx9OYDoqo3bLDTQm66eInjXUvGgmBf5Fevx7MIOpTzq0kE8HFFXvc51YVJeUhEyIMTuCxAeSs2dAs0nzM/sHjzFw7SA5QJfMgyZZjODDWvQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function (event) {
  console.log('message : ' + event);
  event.reply(event.message.text).then(function (data) {
      // success
      console.log('success : ' + data);
  }).catch(function (error) {
      // error
      console.log('error : ' + error);
  });
});

const app = express();
const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);
//app.listen(3000);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
