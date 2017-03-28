var cheerio = require('cheerio');
var request = require('request');

const rateRules = [/美金|美元|美國|USD|usd/g, /港幣|香港|HKD|hkd/g, /英鎊|英國|GBP|gbp/g, /澳幣|澳洲|AUD|aud/g, /日圓|日幣|日本|JPY|jpy/g];
const rateTypes = ['美金', '港幣', '英鎊', '澳幣', '日圓']
var allRate = {};//暫存所有匯率

var requestOptions = {
  url: '',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }
}


function updateRate(){
  requestOptions.url = 'http://rate.bot.com.tw/xrt?Lang=zh-TW';
  request(requestOptions, function(error, response, body){
    if(error){
      console.log('error:', error); // Print the error if one occurred
    }
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    var $ = cheerio.load(body);
    var rateList = $('div.print_show');

    rateList.each(function(i,e){
      allRate[$(this).text().trim().split(' ')[0]] = $($('.rate-content-cash[data-table=本行現金買入]')[i]).text();
    });
    console.log('allRate : ', allRate);
  });
}

function queryRate(queryText){
  for(let i = 0 ; i < rateRules.length ; i++){
    if(rateRules[i].test(queryText)){
       return rateTypes[i] + ' 買入匯率 : ' + allRate[rateTypes[i]];
    }
  }
}

module.exports = {
  updateRate: updateRate,
  queryRate: queryRate
};
