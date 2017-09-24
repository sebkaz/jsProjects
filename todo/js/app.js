"use strict";

String.prototype.escapeHTML = function () {
    return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

Node.prototype.empty = function () {
    if (this.childNodes.length) {
        for (var x = this.childNodes.length - 1; x >= 0; x--) {
            this.removeChild(this.childNodes[x]);
        }
    }
};
//noinspection JSUnusedAssignment
var MyApp = MyApp || {};
MyApp = {
    //this is my first dev app TO DO in Module Pattern
    myConfig: {
        Author: "Sebastian",
        Version: "1.4",
        sendTaskId: "submit",
        taskList: "tasksList",
        versionId: "version",
        authorId: "author",
        counterTaskId: "counterOfTask",
        counterOfTask: 0,
        maxCounterTask: 0,
        errorDate: "errorDate",
        errorName: "errorName",
        errorContent: "errorContent",
        message: "taskMessage",
        cookiesStorage: false,
        localBase: false
    },
    localTab: [],
    TagsTable: [],

    init: function () {
        var self = this;
        self.getVersionAndAuthor();
        self.getTasks();
        self.listen();
        setInterval(function () {
            self.checkTimeForTask();
        }, 3600000);
        self.modifyTask();
        self.taskChoose();
    },

    getVersionAndAuthor: function () {
        var self = this,
            authorId = self.myConfig.authorId,
            author = self.myConfig.Author,
            versionId = self.myConfig.versionId,
            version = self.myConfig.Version;
        self.findAndPutText(authorId, author);
        self.findAndPutText(versionId, version);
    },

    findAndPutText: function (idElement, content) {
        var element = document.getElementById(idElement);
        element.innerHTML = content;
    },
    getTasks: function () {
        var self = this;
        if (window.localStorage) {
            self.myConfig.localBase = true;
            self.myConfig.cookiesStorage = false;
            self.getTasksFromLS();
            document.getElementById("tags-add").empty();
            self.getTagsTable();
        }
        else if (document.cookie) {
            self.myConfig.localBase = false;
            self.myConfig.cookiesStorage = true;
            self.getTaskFromCookies();

        } else {
            self.findAndPutText(self.myConfig.message, "You don't use any base for task!!!");
        }
    },
    getTasksFromLS: function () {
        var self = this,
            count = self.myConfig.counterOfTask;

        if (localStorage.length == 0) {
            self.myConfig.counterOfTask = 0;
            self.findAndPutText(self.myConfig.message, "You don't have any task in local storage");
        } else {
            self.findAndPutText(self.myConfig.message, " ");
            for (var item in localStorage) {
                if(localStorage.hasOwnProperty(item)){
                    if (item.substring(0, 4) == "task") {
                        var str = localStorage.getItem(item);
                        var obStr = JSON.parse(str);
                        count += 1;
                        self.putTask(obStr, count);
                        self.localTab.push(obStr);
                    }
                }
            }
            self.putCounter(count);
            self.myConfig.counterOfTask = count;
            self.myConfig.maxCounterTask = self.maxTaskId(self.localTab);
        }
    },
    getTaskFromCookies: function () {
        console.log("tego jeszcze nie dodałem");
    },
    putTask: function (ob, count) {
        var self = this,
            number = ob.id,
            tagi = '';
        for (var i in ob.tags) {
            if(ob.tags.hasOwnProperty(i))
            {
                tagi += ob.tags[i] + ' ';
            }
        }
        var ul = document.getElementById(self.myConfig.taskList),
            liTaskElement = document.createElement("li"),
            taskTextContainer = document.createElement("div"),
            taskButtonsContainer = document.createElement("div");
        var isActual = ob.dateEND - ob.dateADD;
        if (isActual <= 0) {
            liTaskElement.classList.add("new-task", "bg-danger");
        } else {
            liTaskElement.classList.add("new-task", "bg-info");
        }
        liTaskElement.setAttribute("data-end", ob.dateEND);
        liTaskElement.setAttribute("data-screen-id", count);
        liTaskElement.setAttribute("data-tags", tagi);
        taskTextContainer.classList.add("task-text");
        taskButtonsContainer.classList.add("task-buttons");
        var buttonsContent = self.addButton("del-task", "fa fa-trash-o", number)
            + self.addButton("edit-task", "fa fa-pencil", number);
        taskTextContainer.innerHTML = 'TASK:  ' + count + ': '
            + ob.name.toString().escapeHTML() + '. You should:  '
            + ob.content.toString().escapeHTML();
        taskButtonsContainer.innerHTML = buttonsContent;
        liTaskElement.appendChild(taskTextContainer);
        liTaskElement.appendChild(taskButtonsContainer);
        ul.appendChild(liTaskElement);

    },
    addButton: function (className, ico, num) {
        return '<button type="button" data-modify="'
            + className
            + '" data-id="' + num + '"><i data-id="' + num + '" data-modify="' + className + '" class="'
            + ico
            + '"></i></button>';
    },
    putCounter: function (count) {
        var self = this,
            el = document.getElementById("taskTitle");
        if (count == 1) {
            if (el.hasAttribute('style')) {
                el.removeAttribute('style')
            }
            el.innerHTML = 'Your <span id="' + self.myConfig.counterTaskId + '"></span> Task';
        }
        else {
            if (el.hasAttribute('style')) {
                el.removeAttribute('style')
            }
            el.innerHTML = 'Your <span id="' + self.myConfig.counterTaskId + '"></span> Tasks';
        }
        if (count != 0) {
            self.findAndPutText(self.myConfig.counterTaskId, count);
        } else {
            el.setAttribute('style', 'display:none');
        }
    },
    listen: function () {
        var self = this,
            taskId = self.myConfig.sendTaskId,
            element = document.getElementById(taskId);
        element.addEventListener('click', function (e) {
            var field1 = document.getElementById("taskName").value,
                field2 = document.getElementById("taskContent").value,
                field3 = document.getElementById("taskDate").value,
                field4 = document.getElementById("taskTags").value,
                fieldArray = [field1, field2, field3],
                eName = self.myConfig.errorName,
                eContent = self.myConfig.errorContent,
                eDate = self.myConfig.errorDate,
                nameFieldArray = [eName, eContent, eDate];
            var tagsArray = field4.split(" ", 3);
            for (var item in fieldArray) {
                if (self.isEmpty(fieldArray[item])) {
                    self.findAndPutText(nameFieldArray[item], "This field is require !!!");
                } else {
                    self.findAndPutText(nameFieldArray[item], " ");
                }
            }
            var whenEnd = new Date(field3),
                dataEnd = whenEnd.getTime(),
                whenAdd = new Date(),
                dataAdd = whenAdd.getTime();
            if (!(self.isEmpty(field1) || self.isEmpty(field2) || self.isEmpty(field3))) {
                var test = e.target, taskObject, count, counter;

                if (test.value == 'Save') {
                    self.myConfig.maxCounterTask += 1;
                    self.myConfig.counterOfTask += 1;

                    count = self.myConfig.maxCounterTask;
                    counter = self.myConfig.counterOfTask;
                    whenEnd = new Date(field3);
                    dataEnd = whenEnd.getTime();

                    taskObject = {
                        id: count,
                        name: field1,
                        content: field2,
                        dateEND: dataEnd,
                        dateADD: dataAdd,
                        dataString: field3,
                        tags: tagsArray
                    };
                    self.localTab.push(taskObject);
                    for (i in nameFieldArray) {
                        self.findAndPutText(nameFieldArray[i], ' ');
                    }
                    self.findAndPutText(self.myConfig.message, " ");
                    self.putTask(taskObject, counter);
                    self.putCounter(counter);
                    if (self.myConfig.localBase) {
                        self.saveToLS(taskObject);
                    } else if (self.myConfig.cookiesStorage) {
                        //self.saveToCookie(taskObject);
                        console.log('You need add save To Cookie method!!!');
                    }
                    document.getElementById("taskName").value = '';
                    document.getElementById("taskContent").value = '';
                    document.getElementById("taskDate").value = '';
                    document.getElementById("taskTags").value = '';
                    document.getElementById("tags-add").empty();
                    self.getTagsTable();

                } else if (test.value == 'Edit') {

                    var element = document.getElementById("checker"),
                        base = element.getAttribute("data-id");
                    for (var i in nameFieldArray) {
                        self.findAndPutText(nameFieldArray[i], ' ');
                    }
                    self.findAndPutText(self.myConfig.message, " ");
                    taskObject = self.checkTabTask(self.localTab, base);

                    taskObject.name = field1;
                    taskObject.content = field2;
                    taskObject.dateEND = dataEnd;
                    taskObject.dateADD = dataAdd;
                    taskObject.dataString = field3;
                    taskObject.tags = field4.split(" ", 3);
                    //console.log(taskObject);
                    self.saveToLS(taskObject, base);
                    document.getElementById("taskName").value = '';
                    document.getElementById("taskContent").value = '';
                    document.getElementById("taskDate").value = '';
                    document.getElementById("taskTags").value = '';
                    var button = document.getElementById(taskId);
                    self.renameButton(button, "Save");
                    self.myConfig.counterOfTask = 0;
                    var ul = document.getElementById("tasksList");
                    ul.empty();
                    self.localTab = [];
                    self.TagsTable = [];
                    self.getTasks();
                    element.setAttribute("data-id", '');
                }
            }
        });
    },
    isEmpty: function (napis) {
        napis = napis.trim();
        return napis.length == 0;
    },
    maxTaskId: function (array) {
        var max = 0;
        if (!array) return max;
        for (var item in array) {
            if(array.hasOwnProperty(item)){
                if (array[item].id > max) {
                    max = array[item].id;
                }
            }
        }
        return max;
    },
    saveToLS: function (ob, num) {
        num = num || this.myConfig.maxCounterTask;
        var id = ('task_' + num),
            str = JSON.stringify(ob);
        localStorage.setItem(id, str);
    },
    modifyTask: function () {
        var self = this,
            str = self.myConfig.taskList,
            el = document.getElementById(str);
        el.addEventListener("click", function (e) {
            var whatToChange = e.target.getAttribute("data-modify"),//aby okreslic czy usuwac czy edytowac
                idToChange = e.target.getAttribute("data-id"); //id do zmiany w bazie local storage
            if (whatToChange == 'del-task') {
                var check = document.getElementById("checker"),
                    id = check.getAttribute("data-id");
                if (id != idToChange) {
                    self.removeTask(idToChange);
                    self.myConfig.counterOfTask = 0;
                    var ul = document.getElementById("tasksList");
                    ul.empty();
                    self.localTab = [];
                    self.TagsTable = [];
                    self.getTasks();
                } else {
                    alert("nie mozesz usunac edytowanego taska!!!");
                }
            } else if (whatToChange == 'edit-task') {
                self.editTask(idToChange);
            }
        });
    },
    removeTask: function (taskId) {
        var key = 'task_' + taskId.toString(),
            str = 'You remove task from local storage with id: ' + key,
            test = confirm(str);
        if (test) {
            localStorage.removeItem(key);
        }
    },
    editTask: function (idToRename) {

        var self = this,
            taskId = self.myConfig.sendTaskId,
            element = document.getElementById(taskId);
        self.renameButton(element, "Edit");
        var array = self.localTab,
            SearchObject = self.checkTabTask(array, idToRename);

        var field1 = document.getElementById("taskName"),
            field2 = document.getElementById("taskContent"),
            field3 = document.getElementById("taskDate"),
            field4 = document.getElementById("checker");

        field1.value = SearchObject.name;
        field2.value = SearchObject.content;
        field3.value = SearchObject.dataString;
        field4.setAttribute('data-id', idToRename);
    },
    renameButton: function (what, name) {
        if (what.hasAttribute('value')) {
            what.removeAttribute('value');
            what.value = name;
        }
    },
    checkTabTask: function (array, idToRename) {
        for (var item in array) if (array.hasOwnProperty(item)) {
            if (array[item].id == idToRename) {
                return array[item];
            }
        }
    },
    checkTimeForTask: function () {
        var elements = document.querySelectorAll('#tasksList li.bg-info');
        if (elements) {
            for (var i = 0; i < elements.length; i++) {
                var dataEnd = elements[i].getAttribute("data-end"),
                    dataNow = new Date().getTime(),
                    diff = dataEnd - dataNow;
                if (diff <= 0) {
                    elements[i].remove("bg-info");
                    elements[i].add("bg-danger");
                } else {
                    console.log("sprawdzilem element o id " + elements[i].getAttribute("data-screen-id"));
                    console.log("jeszcze za wcześnie aby go wygasić");
                }
            }
        }
    },
    getTagsTable: function () {
        var self = this,
            tab = self.TagsTable;
        for (var item in self.localTab) {
            var tagsTabInObj = self.localTab[item].tags;
            for (var k in tagsTabInObj) {
                if(tagsTabInObj.hasOwnProperty(k)){
                    if (tab.indexOf(tagsTabInObj[k]) == (-1)) {
                        if (!self.isEmpty(tagsTabInObj[k]))
                            tab.push(tagsTabInObj[k]);
                    }
                }
            }
        }
        self.putTags(tab);
    },
    putTags: function (array) {
        if (array.length != 0) {
            var element = document.getElementById("tags-add");
            for (var item in array) {
                if(array.hasOwnProperty(item)){
                    var button = document.createElement("button");
                    button.classList.add("btn", "btn-primary", "add");
                    button.innerHTML = array[item];
                    element.appendChild(button);
                }
            }
        }
    },
    taskChoose: function () {
        var element = document.getElementById("task-tags");
        element.addEventListener('click', function (e) {


            var tasks = document.querySelectorAll('#tasksList>li');
            if (e.target.className == "btn btn-primary") {
                if (tasks) {
                    for(var i in tasks){
                        if(tasks.hasOwnProperty(i)){
                            tasks[i].style.display = 'list-item';
                        }
                    }
                }
            } else if (e.target.className == "btn btn-primary add") {
                if (tasks) {
                    var str = e.target.textContent;
                    for (i = 0; i < tasks.length; i++) {
                        var tags = tasks[i].getAttribute("data-tags");
                        var taskArray = tags.split(" ", 3);
                        if (taskArray.indexOf(str) == (-1)) {
                            tasks[i].style.display = 'none';
                        } else {
                            tasks[i].style.display = 'list-item';
                        }
                    }
                }
            }
        });
    }

};


window.addEventListener('load', function () {
    //get start
    MyApp.init();
});