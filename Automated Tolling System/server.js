const db = require('./models/db');
const express = require('express');
const rp = require('request-promise');
const $ = require('cheerio');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const tagController = require('./controllers/tagController');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/tag', tagController);

const port = new SerialPort('COM11',{baudRate: 115200}, function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  });

const parser = new Readline();
port.pipe(parser);

parser.on('data', (line) => {
  let tmp = line.split(" "), i , tagIDD = "";
  for(i in tmp){
    let tmp2 = tmp[i].split("x");
    tagIDD += tmp2[1]+"";
  }

  tagIDD = tagIDD.substring(0, tagIDD.length-1);
  
  db.collection.findOne({tagID: tagIDD},function(err, result){
    if(err){
        console.log(err);
    }
    if(result){
      if(tagIDD.length==8){
        tmp=result.carType.split(" ")
        make=tmp[0],model=tmp[1],year=tmp[2]
      }
    }
    
    const url = 'https://www.fueleconomy.gov/feg/PowerSearch.do?action=noform&path=1&year1='+year+'&year2='+year+'&make='+make+'&baseModel='+model+'&srchtyp=ymm';

    rp(url).then(function(html) {
      gramsList= $('.ghg-score', html).text().split(" grams/mile")
      gramsList.pop()

      grams=0
      for(i in gramsList){
        grams+=parseInt(gramsList[i])
      }
      grams/=gramsList.length

      tollFee=(Math.ceil(grams/100)*10)

      db.collection.updateOne({tagID:tagIDD},{"$inc":{"tollCredit": -tollFee}},{"upsert":false},function(err, result) {
        if(err){
          console.log(err);
        }
        if(result.modifiedCount == 1){
          console.log("Car with tag ID: " + tagIDD + " passed.");
        }
        else{
          console.log("This car is not registered.");
        }
      });
    }).catch(function(err) {
        console.log(err)
      });
  });
});