module.exports.store = function(data, db) {

  // var db = require('monk')('localhost:27017/test');

  var exclude = {
                 general : [
                            // "Congressional",
                            "Governor",
                            // ":",
                            "senate",
                            "House",
                            "Assembly",
                            "Law"
                          ],
                 specific : [
                            //  "President Obama Job Approval",
                            //  "Direction of Country",
                            //  "Congressional Job Approval"
                           ]
                };

  var pollTypes = ['presidential nomination', 'direction of country',
                   'obama job approval', 'general election', 'congressional job approval'];

  var party = ['republican', 'democratic'];

  var uSStates = ['california', 'oregon', 'washington', 'alaska', 'hawaii',
                'arizona', 'nevada', 'idaho', 'uath', 'wyoming',
                'new mexico', 'colorado', 'montana', 'texas', 'oklahoma',
                'kansas', 'nebraska', 'iowa', 'south dakota', 'north dakota',
                'louisiana', 'arkansas', 'missouri', 'minnesota', 'illinois',
                'michigan', 'mississippi', 'tennessee', 'kentucky', 'ohio',
                'alabama', 'georgia', 'florida', 'south carolina', 'north carolina',
                'virginia', 'west virginia', 'indiana', 'maryland', 'pennsylvania',
                'new jersey', 'new york', 'connecticut', 'rhode island', 'massechusetts',
                'new hampshire', 'vermont', 'maine', 'delaware', 'wisconsin'];

  data.forEach( function (elem, i) {
    if ( !CheckExactMatch(elem.race, exclude.specific) || !CheckPartialMatch(elem.race, exclude.general) ) {
      // DO MONGODB STORAGE HERE
      var collection = db.get('polldata');
      QueryForDuplicate({dbCollection: collection, newEntry: elem}, function (db, entryRaw, queryResult){
        if (queryResult.length == 0) {
          var entry = FormatEntry( {uSStates: uSStates, party: party, pollTypes: pollTypes}, entryRaw );
          // console.log(res);
          db.insert(entry, function(err, results){
            console.log("added poll: " + entry.race + " from " + entry.date);
          });
        }
      });
    }
  });

}

function FormatEntry( options, rawData ) {

  rawData.region = '';
  rawData.topic = '';
  rawData.party = '';

  // check state or national
  options.uSStates.forEach( function (elem, i) {
    if (rawData.race.toLowerCase().search(elem) !== -1) {
      console.log(elem);
      console.log(rawData.race.toLowerCase());
      rawData.region = elem;
      if (rawData.race.toLowerCase().search('presidential') !== -1) {
        rawData.topic = 'presidential primary';
      } else if (rawData.race.toLowerCase().search(':') !== -1) {
        rawData.topic = 'general election state head to head';
      }
    } else if (rawData.race.toLowerCase().search('presidential nomination') !== -1) {
      rawData.region = 'national'
    }
  });

  options.party.forEach (function (elem, i) {
    if (rawData.race.toLowerCase().search(elem) !== -1) {
      rawData.party = elem;
    }
  });

  options.pollTypes.forEach( function (elem, i) {
    if (rawData.race.toLowerCase().search(elem) !== -1) {
      rawData.topic = elem;
    }
  })
  console.log(rawData);
  return rawData;

}

function QueryForDuplicate(options, callback) {
  // options {collection: mongoDB collection, newEntry: {date: Date object,
  // dateString: Date.tostring, race: string, poll: string,
  // results: [[candidate, points],[candidate, points]]}}
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

function CheckExactMatch (item, list) {
  var exclude = false;
  //Check for exact text match
  list.forEach( function (elem, i) {
    if (elem.toLowerCase() === item.toLowerCase()) {
      exclude = true;
    }
  });

  return exclude;
}

function CheckPartialMatch(item, list) {
  var exclude = false;
  //Check for match in any part of string
  list.forEach( function (elem, i) {
    if ( item.toLowerCase().search(elem.toLowerCase()) !== -1 ) {
      exclude = true;
    }
  });

  return exclude;
}
