/**
 * Created by seba on 2015-11-16.
 */
"use strict";
var TaskWiget, c;

TaskWiget={
    localTab: [],
    myConfig: {
        $Author: $("#author"),
        $Version: $("#version"),
        $message: $("#taskMessage"),
        $sendForm: $("#submit"),
        $formTab: [$("#taskName"),$("#taskContent"),$("#taskDate")],
        $errorTab: [$("#errorName"),$("#errorContent"),$("#errorDate")],
        $tags: $("#taskTags"),
        cookiesStorage: false,
        localBase: false,
        maxCounterTask: 0,
        counterOfTask: 0

    },
    init: function () {
        "use strict";
        var self = this;
        c = self.myConfig;
        self.getVerAndAuthorInfo();
        if(self.checkLocalBase()){
            self.getTasks();
        }
        self.listen();

    },
    checkLocalBase: function () {
        if(window.localStorage){
            c.cookiesStorage = false;
            c.localBase = true;
            return true;
        }else if(document.cookie){
            c.cookiesStorage = true;
            c.localBase = false;
            return true;
        }else {
            c.cookiesStorage = false;
            c.localBase = false;
            return false;
        }
    },
    getVerAndAuthorInfo: function () {
        "use strict";
        c.$Author.text("jQuery");
        c.$Version.text("2.0")
    },
    getTasks: function () {
        "use strict";
        if(c.localBase){
            console.log("pobieram z local storage")
        }else if(c.cookiesStorage){

        }else{
            c.$message.text("You don't have any local base to use");
        }
    },
    listen: function () {
        "use strict";
        var self = this;
       c.$sendForm.on('click',function (e){
            var array = c.$formTab,
                FormTab = [],
                errorArray = c.$errorTab,
                emptyTest = false,
                whatToDo = e.target.value;

            for(var item in array){
                if(array.hasOwnProperty(item)){
                      if(self.isEmpty(array[item].val())){
                          errorArray[item].text("This field is require !!!");
                          emptyTest = true;
                    }
                 else{
                          errorArray[item].text(" ");
                          FormTab.push(array[item].val());
                      }
                }
            }// end check is not empty
            if(!emptyTest){
                var whenEnd = new Date(FormTab[2]),
                    dataEnd = whenEnd.getTime(),
                    whenAdd = new Date(),
                    dataAdd = whenAdd.getTime(),
                    tagsArray = c.$tags.text().split(" ", 3);
                if (whatToDo == "Save") {

                    c.maxCounterTask += 1;
                    c.counterOfTask += 1;

                    //noinspection JSDuplicatedDeclaration
                    var count = c.maxCounterTask,
                        counter = c.counterOfTask,
                        taskObject = {
                        id: count,
                        name: FormTab[0],
                        content: FormTab[1],
                        dateEND: dataEnd,
                        dateADD: dataAdd,
                        dataString: FormTab[2],
                        tags: tagsArray
                    };
                self.localTab.push(taskObject);


} else if (whatToDo == "Edit") {
                    console.log("edytowac");
}
            }
        });

    },
    isEmpty: function (napis) {
        napis = napis.trim();
        return napis.length == 0;
    },

};

$(document).on("ready", function(){
    TaskWiget.init();
});



