/*jshint esversion: 8 */
import * as constants from './standards.js';

window.onload = function(){
  if(location.pathname.split("/").slice(-1)[0] == "admin"){
    doAutoFill();
    addSignOff();
    fillMessages();
  }
  if(location.pathname.split("/").slice(-1)[0] == ""){
  setStandards();  
  }

  applyDates();
  fillBoard();
};

const fillMessages = async function(){

  const table = document.getElementById("messages");
  const response = await fetch('/messages');
  const messages = await response.json();

  messages.forEach(function(msg){
    var tableRow = table.insertRow(1);
        var tCell1 = tableRow.insertCell(0);
        var tCell2 = tableRow.insertCell(1);
        var tCell3 = tableRow.insertCell(2);

    tCell1.innerHTML = msg.from;
    tCell2.innerHTML = msg.message;
  });
};

const addSignOff = function(){
  var table = document.getElementById("row").getElementsByTagName("TR");
  for (let job of table) {
  
    if(job.id !== ""){
      let buttonCell = job.insertCell(2);
      var modifyBtn = document.createElement("input");
      modifyBtn.type="button";
      modifyBtn.value="SignOff";
      modifyBtn.addEventListener("click", function() {
        let jobToSign = {jobCode:job.id};
        fetch('/signoff', {
          method:'POST',
          body: JSON.stringify(jobToSign),
          headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
          if(res.status === 200){
            console.log('Job Signed Off:', jobToSign.jobCode);
          }
        });
      });
      modifyBtn.style = "width:100%";
      buttonCell.append(modifyBtn);
    }
  }
};

const applyDates = function(){
  let date = new Date();
  var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1); 
  let day = new Date(date.setDate(diff)); //Finds monday of the current week
  document.getElementById("tuesday").innerHTML += (" " + (day.getMonth()+1) + "/" + (day.getDate()+1) + "/" + day.getFullYear());
  document.getElementById("thursday").innerHTML += (" " + (day.getMonth()+1) + "/" + (day.getDate()+3) + "/" + day.getFullYear());
};

const setStandards = function(){
  var table = document.getElementById("row").getElementsByTagName("TR");
  for (let job of table) {
    
    let jobCode = job.id.substring(4);
    
    if(jobCode !== ""){
      if(jobCode === '3br' || jobCode === '2brVan' || jobCode === '2brFloor' || jobCode === "1br"){
        job.cells[0].addEventListener("click", function() {
          changeStandardText("_br");});
      } else {
      job.cells[0].addEventListener("click", function() {
        changeStandardText("_"+jobCode);});
      }
    }
  }
};

const changeStandardText = function(job){
    document.getElementById("standards").innerHTML = constants[job];
};

const doAutoFill = async function(){
  const names = [];
  try{
      const response = await fetch('/users');
      let data = await response.json();
      data.forEach(function(result){ names.push(result.name);});
  } 
  catch(error){
       console.log(error);
  }

  autocomplete(document.getElementById("name"), names);
};

const fillBoard = async function(){
    try{ 
        const jobR = await fetch('/jobList');
        let jobs = await jobR.json();
        jobs.forEach(function(job){
            document.getElementById(job.jobCode).cells[1].innerHTML = job.name;
        });
    }
    catch(error){
         console.log(error);
    }
};


// Chunk taken from W3 Schools
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
  //End W3 Schools
