
	var element = document.getElementById('submit');
	element.onclick = function(){
		console.log('klik');
	}


// constructor for Task object
function Task(name,content,date) {
	this.taskName 			= name || 'noName';
	this.taskContent 		= content || 'noContent';
	this.taskDate			= date  || 'noDate'; 
}

//funkcje do local storage

function saveToLocalStorage(obj){
	
	console.log(arguments);
}
var task1 = {asda:"sdsad",sasdaqwe: "qweqwasd"};
for (var prop in task1){
	console.log(prop + ':' + task1[prop]);
}

var getAllelements = function(){

};

putTask: function(tagName,where, what) {
        var newTag = document.createElement(tagName);
        newTag.innerHTML = what;
        var ul = document.getElementById(where);
        ul.appendChild(newTag);
    },

    	id:1,
    	name: "bla bla",
    	content: "asdasdasdasd asdasd",
    	data: "asadasd"
    }

    event.target

    field1[0].value


        //  put ALL tasks to local storage
    saveAllTaskToLS: function(array){
        if(array.length != 0){
            for(var item in array){
                console.log(array[item]);
            this.saveToLS(array[item]); 
        }
        }else
        {
            console.log("nothing to add!!!");
        }
    },
    // 2. print all task form array to the screen
    putTasksToTheScreen: function(array){
        if(array.length == 0){
            console.log('brak zadan do wykonania');
            this.findAndPutText('taskMessage',"You don't have any task");
        } else{
            for(var i in array){
                console.log(array[i].name);
                var str = array[i].id + ' ' + array[i].name + ' ' +array[i].content;
                this.putTask("li","tasksList",str);
                }
              }
    },