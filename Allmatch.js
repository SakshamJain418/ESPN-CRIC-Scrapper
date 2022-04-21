const request = require('request');
const cheerio = require('cheerio');
const scorecardObj = require('./scorecard');

function getAllMatchesLink(fullLink) {

    request(fullLink, callBackFn);

    function callBackFn(error, response, html) {
        if(error == true) {
            console.log(error);
        }
        else {
            // console.log(html);
            getHTML(html);
        }
    }
}


function getHTML(html) {
    let $ = cheerio.load(html);

    let scorecardElems = $('a[data-hover="Scorecard"]');
    
    // let count = 0;
    for(let i = 0; i < scorecardElems.length; i++) {

        let eachLink = $(scorecardElems[i]).attr("href");

        let fullLink = 'https://www.espncricinfo.com' + eachLink;

        //console.log(fullLink)
        scorecardObj.ps(fullLink)
        // count++;
    }

    // console.log(count)
    
}


module.exports = {
    gtAllMatches : getAllMatchesLink
}
