var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

module.exports = router;
