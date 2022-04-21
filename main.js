// Input espn home page url
let homePageUrl = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require('request');
const cheerio = require('cheerio');
const AllMatchObj = require('./AllMatch')
const fs = require('fs');
const path = require('path');

const iplPath = path.join(__dirname, "IPL");

dirCreator(iplPath);


request(homePageUrl, callBackFn);

function callBackFn(error, response, html) {
    if(error == true) {
        console.log(error);
    }
    else {
        // console.log(html);
        extractHTML(html);
    }
}


function extractHTML(html) {
    let $ = cheerio.load(html);

    let viewAllResult = $('a[data-hover="View All Results"]');

    let viewAllResultLink = viewAllResult.attr('href')

    // console.log(viewAllResultLink)

    let fullViewAllResultLink = 'https://www.espncricinfo.com' + viewAllResultLink;

    // console.log(fullViewAllResultLink);

    
    AllMatchObj.gtAllMatches(fullViewAllResultLink);
}


function dirCreator(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}
