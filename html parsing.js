const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const eol = require('eol')
const ObjectsToCsv = require('objects-to-csv');
const { constants } = require('buffer');
const { JSDOM } = jsdom;


//const vgmUrl='https://www.sanfoundry.com/engineering-materials-metallurgy-questions-answers-refractory-materials-superalloys/'
//const vgmUrl= 'https://www.sanfoundry.com/avionics-problems/'
//const vgmUrl = 'https://www.sanfoundry.com/software-engg-mcqs-software-engineering-ethics-1/'
const vgmUrl='https://www.sanfoundry.com/avionics-questions-answers-control-data-entry/'
got(vgmUrl).then(response => {
  const dom = new JSDOM(response.body);
  let container2 = [], container = [], Option1 = [], Option2 = [], Option3 = [], Option4 = [],
    s, genre, fQues = [], newArr2 = [], data = [],
    ans = [], str = [], questions = [],
    //    op1 = [], op2 = [], op3 = [], op4 = [],
    noOfQues = 0, r = 0, test, ansLen

  while (1) {
    test = dom.window.document.getElementsByClassName('collapseomatic_content')[noOfQues].textContent
    if (test.includes("Answer: ")) {
      container2[noOfQues] = test
      noOfQues++
    }
    else {
      break
    }

  }
  let op1 = [], op2=[], op3=[], op4=[]
  

  genre = dom.window.document.querySelectorAll('div.entry-content, p')[1].textContent

  var matches = genre.match(/\“(.*?)\”/);
  genre = matches[1]

  for (j = 2; j <= noOfQues + 3; j++) {
    container[r] = dom.window.document.querySelectorAll('div.entry-content, p')[j].textContent
    r++
  }



  for (i = 0; i < noOfQues; i++) {
    ans[i] = eol.split(container2[i])
    ansLen = ans[i][0].length
    ans[i] = ans[i][0][ansLen - 1]

    str[i] = eol.split(container[i])
    str[i].splice(str[i].length - 1, str[i].length)

    if (ans[i] == 'a') { ans[i] = 'Option1' }
    if (ans[i] == 'b') { ans[i] = 'Option2' }
    if (ans[i] == 'c') { ans[i] = 'Option3' }
    if (ans[i] == 'd') { ans[i] = 'Option4' }
  }

  questions = str
  for (i = 0; i < noOfQues; i++) {
    s = str[i].length - 1

    for (j = 0; j <= s; j++) {
      if (questions[i][j].includes("a)") == true) {
        var l = j
        for (k = 0; k < j; k++) {
          fQues[i] = questions[i][k]
          fQues[i] = fQues[i].replace(/[0-9\. ]+/, "");
        }
        op1[i] = questions[i][j].replace('a) ', '');
      }

      if (questions[i][j].includes("b)") == true) {
        op2[i] = questions[i][j].replace('b) ', '');

      }
      if (questions[i][j].includes("c)") == true) {
        op3[i] = questions[3][3].replace('c) ', '');

      }

      if (questions[i][j].includes("d)") == true) {
        op4[i] = questions[i][j].replace('d) ', '');
      }
    }
    data.push({ Q_id: i + 1 })

    newArr2 = data.map(v => ({ ...v, Genre: genre, Question: fQues[i], Option1: op1[i], Option2: op2[i], Option3: op3[i], Option4: op4[i], Answer: ans[i] }))
    data[i] = newArr2[i]


  }
  console.log(data)
  new ObjectsToCsv(data).toDisk('./test.csv', { allColumns: true });

}).catch(err => {
  console.log(err);

});
