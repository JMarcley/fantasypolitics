var request = require('request');
var cheerio = require('cheerio');

module.exports.pullData = function(callback) {

  var pollData = [];

  // var pageToVisit = 'http://www.realclearpolitics.com/epolls/latest_polls/';
  var pageToVisit = 'http://www.hannahspuzzles.com/polls/polls.html';
  // var pageToVisit = 'file:/Users/joshuamarcley/developer/fantasypolitics/polls.html'
  console.log("Visiting page " + pageToVisit);
  request(pageToVisit, function(error, response, body) {
     if(error) {
       console.log("Error: " + error);
     }
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode === 200) {
       // Parse the document body
       var $ = cheerio.load(body);

       var rows = $('tr');
       var date;
       rows.each(function(i,elem) {
         if ($(this).find($('td')).length == 1) {
           date = new Date( $(this).find($('td')).text() );
           var d = new Date();
           if ( date.getMonth() > d.getMonth() ) {
             date.setFullYear( d.getFullYear() - 1 );
           } else {
             date.setFullYear( d.getFullYear() );
           }


          //  console.log("Date: " + $(this).find($('td')).text());
         }
         if ($(this).find($('td')).length == 4) {

           if (checkTypeRPP( $(this).find($('td')).first().text() )) {

             // poll data to push to json
             var thisPoll = {
               date: date,
               dateString: date.toDateString(),
               race: $(this).find($('td')).first().text(),
               poll: $(this).find($('td')).first().next().text(),
               results: parseResults($(this).find($('td')).first().next().next().text())
             };
             pollData.push(thisPoll);
            //  console.log(date);
            //  console.log("Race: " + $(this).find($('td')).first().text());
            //  console.log("Poll: " + $(this).find($('td')).first().next().text() );
            //  console.log("Results: ");
            //  console.log(parseResults($(this).find($('td')).first().next().next().text()));
           }

          //  $(this).find($('td')).each(function(i,elem) {
          //    if (i == 0) {
          //      console.log("Race: " + $(this).text());
          //      if (typeOfPoll()) {
          //      }
          //    }
          //    if (i == 1) {
          //      console.log("Poll: " + $(this).text());
          //    }
          //    if (i == 2) {
          //      console.log(parseResults($(this).text()));
          //    }
          //  })
         }
       })
       if (typeof callback === "function") {
           callback(pollData);
       }
     }
  });
}

function parseResults (str) {
  var candidates = str.split(", ");
  var temp = [];
  var res = [];
  for (var j = 0; j < candidates.length; j++) {
    temp = candidates[j].split(" ");
    if (temp.length == 1) {
      temp.push(0);
    }
    res.push(temp);
  }
  return res;
}

function checkTypeRPP (str) {
  if (str.search("") !== -1) {
    return true;
  }
}
