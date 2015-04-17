var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', function(req, res, next) {
  var hashtag = req.body.hashtag || false;

  if (!hashtag) return res.end('');
  var dictionary = req.app.get('dictionary');
  console.log('Translating %s', hashtag);
  dictionary.translateHashtag(hashtag)
    .then(function(hash) {
      console.log('Done translating');
      res.end(hash);
    })
    .catch(function(e) {
      console.error(e.stack);
      res.end('');
    })
});

module.exports = router;
