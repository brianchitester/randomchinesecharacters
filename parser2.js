var fs = require('fs');
var chineseConv = require('chinese-conv');

var path = './1000 most common chinese wiktionary.txt';
var jsonBlob = {};
var lineNumber = 1;
var dupeCheck = "";
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
  if (data == dupeCheck){
    return;
  }
  dupeCheck = data;
  var spaceSplit = data.split(" ");
  var commaSplit = data.split(",");
  var dashSplit = data.split("-");
  //number
  var number = lineNumber;
  lineNumber++;
  var simplfied = spaceSplit[1];
  var tradtional = commaSplit[0];
  var definition = dashSplit[1].slice( 1 );
  definition = definition.substring(0, definition.length - 1)
  var pinyin = data.match(/\(([^()]+)\)/g ).toString();
  pinyin = pinyin.replace("(", "").replace(")", "");

  jsonBlob[number] = {
    characters: {
      tradtional: tradtional,
      simplfied: simplfied
    },
    definition: definition,
    pinyin: pinyin
  };

  console.log('Number: ' + number);
  console.log('tradtional: ' + tradtional);
  console.log('simplfied: ' + simplfied);
  console.log('definition: ' + definition);
  console.log('pinyin: ' + pinyin);

  //console.log('Line: ' + number + ' ' + simplfied + ' ' + pinyin);
}

var input = fs.createReadStream(path);
readLines(input, func);