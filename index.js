var linebot = require('linebot');
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var allRate = {};//暫存所有匯率
var bot = linebot({
  channelId: '1507809147',
  channelSecret: '19abedc7a873bd705cf76bdb06f8faaf',
  channelAccessToken: '7CNicd1iAoHlllHo1peevvAZMqcSMedV3PE6qTyeBGvGx9OYDoqo3bLDTQm66eInjXUvGgmBf5Fevx7MIOpTzq0kE8HFFXvc51YVJeUhEyIMTuCxAeSs2dAs0nzM/sHjzFw7SA5QJfMgyZZjODDWvQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function (event) {
  if(/日幣|日圓|JPY|jpy|¥/g.test(event.message.text)){
    //resquest('http://rate.bot.com.tw/xrt?Lang=zh-TW');
    reply(event, '日圓現金買入匯率為 : ' + allRate['日圓 (JPY)']);
  }else{
    reply(event, event.message.text);
  }
});

const app = express();
const linebotParser = bot.parser();
//line Basic information => Webhook URL https://mylinebotv1.herokuapp.com/linewebhook
app.post('/linewebhook', linebotParser);
// app.get('/query', function(req, res){
//   queryRate();
// })
//app.listen(3000);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port : ", port);
  queryRate();//抓取匯率
});

function reply(e, msg){
  e.reply(msg).then(function(data){
    //success
  }).catch(function(error){
    //error
    console.log('error : ', error);
  });
}

function queryRate(){
  request('http://rate.bot.com.tw/xrt?Lang=zh-TW', function(error, response, body){
    if(error){
      console.log('error:', error); // Print the error if one occurred
    }
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    var $ = cheerio.load(body)
    // var content = '日圓現金買入匯率為 : ';
    //幣別從第三個開始
    var rateList = $('div.print_show');
    // var index = 0;

    rateList.each(function(i,e){
      allRate[$(this).text().trim()] = $($('.rate-content-cash[data-table=本行現金買入]')[i]).text();
      // if(.includes('日圓')){
      //   // console.log(i, $(this).text().trim());
      //   index = i;
      // }
    });
    console.log('allRate : ', allRate);
    // console.log($($('.rate-content-cash[data-table=本行現金買入]')[index]).text());
    // content += $($('.rate-content-cash[data-table=本行現金買入]')[index]).text();
  });
}
