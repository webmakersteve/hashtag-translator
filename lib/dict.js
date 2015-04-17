'use strict';

var request = require('request');
var xmlParser = require('xml2js').parseString;
var Promise = require('bluebird');
var util = require('util');
var async = require('async');

var translator = require('./translator');

function DictionaryApi(key) {

  this.urlBase = 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/%s?key=' + key;

  this.iterations = 0;

}

DictionaryApi.prototype.createUrl = function (word) {
  return util.format(this.urlBase, word);
};

DictionaryApi.prototype.isWord = function (word, cacheOnly) {

  if (cacheOnly !== true) cacheOnly = false;

  var self = this;
  word = word.toLowerCase();

  return new Promise(function (resolve, reject) {

    var precheck = translator.getWord(word);
    console.log(word + '=> ' + precheck);
    if (precheck) return resolve(precheck);

    if (cacheOnly) return reject(false);

    console.log('Doing an HTTP request');

    request(self.createUrl(word),
      function(error, response, body) {

        if (error) return reject(error);

        xmlParser(body, function (err, result) {
            var root = result.entry_list;
            if (!root.hasOwnProperty('entry')) {
              return reject(false);
            }
            translator.addWord(word, word);
            resolve(word);

        });

      });

  });

};

DictionaryApi.prototype.translateHashtag = function(hashtag) {

  var self = this;

  return new Promise(function (resolve, reject) {

    var words = [];
    var currentString = '';

    var characters = hashtag.split('');

    async.eachSeries(characters, function(character, callback) {
      currentString += character;

      // we kind of want to prioritize the longer words if we can, which sucks.

      self.isWord(currentString, currentString.length < 3)
        .then(function(word) {
          currentString = '';
          words.push(word);
          callback();

        })
        .catch(function() {
          callback();
        });

    }, function(err) {
      if(err) {
        reject(err);
      } else {
        resolve(words.join(' '));
      }
    });

  });

};

module.exports = DictionaryApi;
