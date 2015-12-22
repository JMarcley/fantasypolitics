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
        res.render('pollquery', {
            "polldata" : docs
        });
    });
});

router.post('/query', function(req, res){
  var db = req.db;
  var collection = db.get('polldata');
  var query = req.body.query;
  collection.find({"race":{$regex:query, $options: "i"}},{"sort": {"date" : -1}}, function(e,docs){
      res.render('pollquery', {
          "polldata" : docs
      });
  });
})

module.exports = router;
