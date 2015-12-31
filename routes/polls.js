var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('polldata');

    collection.find({},{"sort": {"date" : -1}}, function(e,docs){
        res.render('testdatalist', {
            "polldata" : docs
        });
    });
});

router.get('/query', function(req, res) {
    var db = req.db;
    var collection = db.get('polldata');

    collection.find({},{"sort": {"date" : -1}}, function(e,docs){
        docs = FormatForQuery(docs);
        res.render('pollquery', {
            "polldata" : docs
        });
    });
});

router.post('/query', function(req, res){
  var db = req.db;
  var collection = db.get('polldata');
  // console.log(req.body);
  if (req.body.query !== '') {
    collection.find({"region":req.body.region.toLowerCase(), "party":requestBody.party.toLowerCase()},
                    {"sort": {"date" : -1}},
                    function(e,docs){
                      docs = FormatForQuery(docs);
                      res.render('pollquery', {
                                  "polldata" : docs
                                });
                   });
  } else {
    if (req.body.party.toLowerCase() == 'all') {
      req.body.party = '';
    }
    if (req.body.region.toLowerCase() == 'all') {
      req.body.region = '';
    }
    if (req.body.topic.toLowerCase() == 'all') {
      req.body.topic = '';
    }
    collection.find({"region":req.body.region.toLowerCase(),
                     "party":req.body.party.toLowerCase(),
                     "topic":req.body.topic.toLowerCase()},
                    {"sort": {"date" : -1}},
                    function(e,docs){
                      docs = FormatForQuery(docs);
                      res.render('pollquery', {
                                  "polldata" : docs
                                });
                   });
  }
});

// function queryDB(collection, requestBody, callback) {
//   var results;
//
//   for (var key in requestBody) {
//     console.log(key);
//   }
//
//   if (requestBody.party.toLowerCase() == 'all') {
//     requestBody.party = '';
//   }
//
//   if (requestBody.region.toLowerCase() == 'all') {
//     requestBody.region = '';
//   }
//
//   if (requestBody.query == '') {
//     collection.find({"region":requestBody.region.toLowerCase(), "party":requestBody.party.toLowerCase()},
//                     {"sort": {"date" : -1}},
//                     function(e,docs){
//                       callback(FormatForQuery(docs));
//                     });
//   } else {
//     collection.find({"race":{$regex:requestBody.query, $options: "i"}},
//                     {"sort": {"date" : -1}},
//                     function(e,docs){
//                       console.log(FormatForQuery(docs));
//                       callback(FormatForQuery(docs));
//                     });
//   }
// }

function FormatForQuery(param) {
  param = StateFilter(param);
  param.partySelect = ['All', 'Democratic', 'Republican'];
  param = TopicFilter(param);

  return param;
}

function TopicFilter(cursor) {
  var topics = [];
  var uniqueTopics = [];
  var topicList = ["All"];

  cursor.forEach( function (elem, i) {
    if (elem.topic !== '') {
        topics.push( elem.topic.toTitleCase() );
    }
  });

  uniqueTopics = topics.unique().sort();

  uniqueTopics.forEach( function(elem, i) {
    topicList.push(elem);
  });

  cursor.topicSelect = topicList.unique();

  return cursor;

}

function StateFilter(cursor) {
  var allStates = [];
  var uniqueStates = [];
  var stateList = [];
  stateList.push('All', 'National');

  cursor.forEach( function (elem, i) {
    if (elem.region !== '') {
        allStates.push( elem.region.toTitleCase() );
    }
  });

  uniqueStates = allStates.unique().sort();

  uniqueStates.forEach( function(elem, i) {
    stateList.push(elem);
  });

  cursor.regionSelect = stateList.unique();

  return cursor;
}

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = router;
