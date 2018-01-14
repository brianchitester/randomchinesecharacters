var fs = require('fs');
var chineseConv = require('chinese-conv');

var path = './18,896 HSK sentences.txt';
var lineNumber = 1;
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
      fs.writeFile("test.json", JSON.stringify(jsonBlob,null, "\t"), function(err) {
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
  var number = lineNumber;
  lineNumber++;
  var simp = spaceSplit[0];
  var trad = chineseConv.tify(spaceSplit[0]);
  var pinyin = spaceSplit[1];
  var english = spaceSplit[2];
  jsonBlob[number] = {
    simplified: simp,
    traditional: trad,
    pinyin: pinyin,
    english: english
  };
}

var input = fs.createReadStream(path);
readLines(input, func);