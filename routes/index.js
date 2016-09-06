var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.get('Referrer'));
  res.render('index', { title: 'Express' });
});

router.get('/success', function(req, res, next) {
  res.render('index', { message: "Thanks for signing up."});
});

router.get('/duplicate', function(req, res, next) {
  res.render('index', { message: "You have already signed up with that email address." });
})
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
