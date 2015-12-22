module.exports.store = function(data, db) {

  // var db = require('monk')('localhost:27017/test');

  var exclude = {
                 general : ["Congressional",
                            "Governor",
                            ":",
                            "senate",
                            "House",
                            "Assembly",
                            "Law"],
                 specific : ["President Obama Job Approval",
                             "Direction of Country",
                             "Congressional Job Approval"]
                }

  data.forEach( function (elem, i) {
    if ( !CheckMatch(elem.race, exclude) ) {
      // DO MONGODB STORAGE HERE
      var collection = db.get('polldata');
      QueryForDuplicate({dbCollection: collection, newEntry: elem}, function (db, entry, queryResult){
        if (queryResult.length == 0) {
          // console.log(res);
          db.insert(entry, function(err, results){
            console.log("added poll: " + entry.race + " from " + entry.date);
          });
        }
      });
    }
  })

}

function QueryForDuplicate(options, callback) {
  options.dbCollection.find(
        {
          date: options.newEntry.date,
          race: options.newEntry.race,
          poll: options.newEntry.poll
        },
        function(e,docs){
          callback(options.dbCollection, options.newEntry, docs);
        });
}

function CheckMatch (race, exclusions) {
  var exclude = false;

  //Check for exact text match
  exclusions.specific.forEach( function (elem, i) {
    if (elem.toLowerCase() === race.toLowerCase()) {
      exclude = true;
    }
  });

  //Check for match in any part of string
  exclusions.general.forEach( function (elem, i) {
    if ( race.toLowerCase().search(elem.toLowerCase()) !== -1 ) {
      exclude = true;
    }
  });

  return exclude;
}
