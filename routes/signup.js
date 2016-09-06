var express = require('express');
var router = express.Router();

/* GET Userlist page. */
// router.get('/polls', function(req, res) {
//     var db = req.db;
//     var collection = db.get('polldata');
//
//     collection.find({},{"sort": {"date" : -1}}, function(e,docs){
//         res.render('testdatalist', {
//             "polldata" : docs
//         });
//     });
// });

module.exports = function(req, res, next) {
  var db = req.db;
  var collection = db.get('emaillist');

  collection.find({email:req.body}, function(err, results) {
    if (results == 0) {
      collection.insert(req.body, function(err, results) {
        console.log("added " + req.body + " to email list");
      });
      res.redirect('/success');
    } else {
      res.redirect('/duplicate');
    }
  })

};
