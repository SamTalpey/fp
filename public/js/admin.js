/*jshint esversion: 8 */
const modifyForm = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();
    
    var jobBox = document.getElementById("job");
    var jobCode = jobBox.options[jobBox.selectedIndex].value;
    var day = document.querySelector('input[name="day"]:checked').value;
    
    const job = day+jobCode;
    var mod =  document.getElementById(job).innerHTML;
    
    
};

async function submitAllMods(){
    const newJobs = [];
    const names = [];
    const badNames = [];
    try{
        const response = await fetch('/users');
        let data = await response.json();
        data.forEach(function(result){ names.push(result.name); });
    }
    catch(error){console.log(error);}
    var table = document.getElementById("row").getElementsByTagName("TR");
    for (let job of table) {
        if(job.id !== ""){
            if(job.cells[1].innerHTML !== "<br>"){
                let name = job.cells[1].textContent;
                
                if(names.includes(name)){
                    newJobs.push({jobCode:job.id, name:name} );
                }else { 
                    alert(name + " does not exist. Please fix");
                    break;
                }
            }
        }
    }
    fetch('/modifyAll', {
        method:'POST',
        body: JSON.stringify(newJobs),
        headers: {'Content-Type': 'application/json'}
    });
}

//async function forceUpdate() {
//    await fetch('/forceUpdate', {
//        method: 'POST',
//        credentials: 'include'
//    })
//    fetch('/', {
//        method: 'GET',
//        credentials: 'include'
//    });
//}

function resetJobs() {
    fetch('/resetJobs', {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => console.log(res));
}


// For testing purposes
function fill(){
    var table = document.getElementById("row").getElementsByTagName("TR");
    for (let job of table) {

      if(job.id !== ""){
          job.cells[1].innerHTML = "Jimmy Tran";

      }
    }
}

function showHide(){
    let inner = document.getElementById("editForm");
    //var inner = obj.parentNode.getElementsByTagName("div")[0];
    if (inner.style.display == "none") {
        inner.style.display = "";
    }
    else{
        inner.style.display = "none";
    }
}