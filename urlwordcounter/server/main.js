import express from 'express';
const app = express();

import bodyParser from'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    // if(req.method == "OPTIONS"){
    //     res.set('Access-Control-Allow-Origin', '*');
    //     res.set('Access-Control-Allow-Headers', 'Content-Type');
    //     next();
    // }
    
  });
const port = 4000;
import puppeteer  from 'puppeteer';
import request from "request";
import cheerio from "cheerio"
// parse application/json
app.post('/getdata', function(req, res) {
    console.log(' req.body', req.body);

    //All the web scraping magic will happen here
  var url = req.body.URL;
  var allText;
  var getTheText = function() {
    request(url, function getText(error, response, html) {

      // First we'll check to make sure no errors occurred when making the request

      if (!error) {
        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

        var $ = cheerio.load(html);

        // Finally, we'll define the variables we're going to capture
        var allText = $('body')
          .children()
          // .find('p')
          .text()

        //   allText = allText.replace(/\s+/g, " ")
        //     .replace(/[^a-zA-Z ]/g, "")
        //     .toLowerCase();
        // console.log('allText');
        // console.log(allText);

        // allText.split(" ").forEach(function (word) {
            
        //     if (corpus[word]) {
        //       // If this word is already in our corpus, our collection
        //       // of terms, increase the count for appearances of that 
        //       // word by one.
        //       corpus[word]++;
        //     } else {
        //       // Otherwise, say that we've found one of that word so far.
        //       corpus[word] = 1;
        //     }
        //   });
        // return allText;
        let data = allText.toString().replace(/<iframe.*>.*<\/iframe>/ims, " ").replace(/<style.*>.*<\/style>/ims, " ").replace(/<script.*>.*<\/script>/ims, " ").split(/,| |\n|\t/).filter(f=>f!==""&&f!=="-")
        console.log("data", data, data.length);
        //res.setHeader('Content-Type', 'text/plain');
        res.send({count: data.length, url}); // Send response from here  

      } else {}

      //return result;
    });
    console.log(allText);

  }

  getTheText();
  //console.log('gettheText is ' + getTheText());
  // res.send(allText); // Remove this line
    // (async () => {
    //     console.log("req.body.url", req.params.url)

    //     req.params.url = "http://" + req.params.url
    //     console.log("req.body.url", req.params.url)

    //     const browser = await puppeteer.launch({           
    //     })
    //     const page = await browser.newPage()
                        
    //     await page.goto(req.params.url, {waitUntil: 'networkidle2'})
    //     await page.evaluate(()=> new XMLSerializer().serializeToString(document))
    //     let html = (await (await page.content()).toString())
        

    //     await browser.close()
    // })()
    // console.log("html", res)
    // res.send({status :  true})
});


app.listen(port, () => console.log(`Example app listening on 
  ${port}!`))

