'use strict';

function Translator() {
  this.knownWords = {};
};

Translator.prototype.addWord = function (word, translation) {
  this.knownWords[word] = translation;
  console.log(this.knownWords);
}

Translator.prototype.getWord = function (word) {
  console.log(this.knownWords);
  return this.knownWords[word] || false;
}

module.exports = new Translator;
