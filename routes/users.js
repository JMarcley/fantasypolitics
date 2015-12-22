var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('testdata');
    collection.find({},{},function(e,docs){
        res.json(docs);
        console.log(docs);
    });
});

module.exports = router;
