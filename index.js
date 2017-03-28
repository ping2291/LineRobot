var linebot = require('linebot');
var express = require('express');
var rate = require('./src/query_rate');
const updateDuringTime = 1000*60*60; //每一小時更新一次匯率

var bot = linebot({
  channelId: '1507809147',
  channelSecret: '19abedc7a873bd705cf76bdb06f8faaf',
  channelAccessToken: '7CNicd1iAoHlllHo1peevvAZMqcSMedV3PE6qTyeBGvGx9OYDoqo3bLDTQm66eInjXUvGgmBf5Fevx7MIOpTzq0kE8HFFXvc51YVJeUhEyIMTuCxAeSs2dAs0nzM/sHjzFw7SA5QJfMgyZZjODDWvQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function (event) {
  const input = event.message.text.trim();
  console.log('text: ', input);
  if(/^\$/g.test(input)){
    //resquest('http://rate.bot.com.tw/xrt?Lang=zh-TW');
    event.reply(rate.queryRate(input));
  }else{
    event.reply(input);
  }
});

const app = express();
const linebotParser = bot.parser();
//line Basic information => Webhook URL https://mylinebotv1.herokuapp.com/linewebhook
app.post('/linewebhook', linebotParser);
// app.get('/query', function(req, res){
//   res.send('quert get!');
// })
//app.listen(3000);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port : ", port);
  //每1小時抓取一次匯率
  rate.updateRate();
  setInterval(rate.updateRate, updateDuringTime);
  // setTimeout(function(){
  //   rate.queryRate('$jpy');
  // }, 2000);
});
