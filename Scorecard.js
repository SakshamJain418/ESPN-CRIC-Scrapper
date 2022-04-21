// one link of match
//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request = require('request');
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const xlsx = require('xlsx');


function processScorecard(url) {
    request(url, callBackFn);
}


function callBackFn(error, response, html) {
    if(error == true) {
        console.log(error);
    }
    else {
        // console.log(html);

        extractHTML(html);
    }
}


// Venue, Date, Opponent, Result, Runs, Balls, Fours, Sixes, STR
function extractHTML(html) {
    let $ = cheerio.load(html);

    let elements = $('.header-info .description').text();
    // console.log(elements);

    elements = elements.split(",");
    // console.log(elements);

    let venue = elements[1].trim();
    let date  = elements[2].trim();
    let result = $('.match-header .status-text').text();

    // console.log(venue);
    // console.log(date)
    // console.log(result);

    let innings = $('.card.content-block.match-scorecard-table .Collapsible');
    //let htmlString = "";

    // Mumbai Indian's > Chennai Super Kings 
    for(let i = 0; i < innings.length; i++) {
        //htmlString += $(innings[i]).html();

        let teamName = $(innings[i]).find("h5").text();
        let index = i == 0 ? 1 : 0;
        
        let opponentName = $(innings[index]).find("h5").text();

        teamName = teamName.split("INNINGS")[0].trim();
        opponentName = opponentName.split("INNINGS")[0].trim();

        let cInnings = $(innings[i]);

        console.log(` ${venue} | ${date} | ${teamName} | ${opponentName} | ${result}`);

        let allRow = cInnings.find('.table.batsman tbody tr');

        for(let j = 0; j < allRow.length; j++) {
            let allCols = $(allRow[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell")

            if(isWorthy == true) {
                let btName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let str   = $(allCols[7]).text().trim();
                
                console.log(` ${btName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${str}`)

                processPlayer(teamName, btName, runs, balls,fours, sixes, str, opponentName, venue, date, result);
            }
        }

        console.log("-----------------------------");
    }

    // console.log(htmlString);
}


function processPlayer(teamName, btName, runs, balls,fours, sixes, str, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "IPL", teamName);
    dirCreator(teamPath)

    let filePath = path.join(teamPath, btName + ".xlsx")

    let content = excelReader(filePath, btName)

    let playerObj = {
        teamName,
        btName,
        runs,
        balls,
        fours,
        sixes,
        str,
        opponentName,
        venue,
        date,
        result
    }

    content.push(playerObj);

    excelWriter(filePath, content, btName);
}


function dirCreator(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}


function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new(); 
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName)
    xlsx.writeFile(newWB, filePath)
}


function excelReader(filePath, sheetName) {
    if(fs.existsSync(filePath) == false) {
        return [];
    }
    
    let wb = xlsx.readFile(filePath)  
    let excelData = wb.Sheets[sheetName]
    let ans = xlsx.utils.sheet_to_json(excelData)
    return ans;
}


module.exports = {
    ps:processScorecard
}
