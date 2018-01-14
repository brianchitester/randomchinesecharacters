var fs = require('fs');
var chineseConv = require('chinese-conv');

var path = './1500 most common characters.txt';
var jsonBlob = {};
function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      fs.writeFile("test.json", JSON.stringify(jsonBlob), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
    }
  });
}

function func(data) {
  var spaceSplit = data.split("\t");
  //number
  var number = spaceSplit[0];
  var character = spaceSplit[1];
  var tradCharacter = chineseConv.tify(spaceSplit[1]);
  var definition = spaceSplit[2];
  var pinyin = spaceSplit[spaceSplit.length - 1];
  pinyin = pinyin.substring(0, pinyin.length - 1);
  jsonBlob[number] = {
    characters: {
      tradtional: tradCharacter,
      simplfied: character
    },
    definition: definition,
    pinyin: pinyin
  };

  console.log('Number: ' + number);
  console.log('tradCharacter: ' + tradCharacter);
  console.log('character: ' + character);
  console.log('definition: ' + definition);
  console.log('pinyin: ' + pinyin);

  //console.log('Line: ' + number + ' ' + character + ' ' + pinyin);
}

var input = fs.createReadStream(path);
readLines(input, func);