/**
 * Created by seba on 2015-12-04.
 */
"use strict";
Node.prototype.empty = function () {
    if (this.childNodes.length) {
        for (var x = this.childNodes.length - 1; x >= 0; x--) {
            this.removeChild(this.childNodes[x]);
        }
    }
};
/**
 * Object Spotify from Template method
 */
var Spotify = {};

Spotify = {
	config : {
		baseURL: "https://api.spotify.com",
        typeURL: "*&type=artist&limit=50",
		searchURL: "/v1/search?q=",
		artistsURL: "v1/artists/",
		albumsURL: "/albums",
		track_one: "/v1/albums/",
		track_two: "/tracks",
        $searchForm: "search-form",
        $resultDiv: "results",
        $searchField: "wpis",
    },

	init: function () {
	var self = this,
        c = self.config,
        searchInput = document.getElementById(c.$searchForm),
        albumTrackSearch = document.getElementById(c.$resultDiv);
        //console.log(albumTrackSearch);
        searchInput.addEventListener('keyup', function(e){
		    var str = self.addWpis(c.$searchField,e.target.value);
		    if(str.trim().length != 0){
			    var url = c.baseURL + c.searchURL + str + c.typeURL;
			    self.doSearch(url,self.getInfo);
		    }else{
			    self.addWpis(c.$resultDiv,"");
		    }
	    });

        albumTrackSearch.addEventListener('click', function(e){
            if(e.target.parentNode.className != 'container'){

                var id = e.target.getAttribute('data-artist-id');
                //czyszczenie wybranego wczesniej elementu
                var item = document.querySelector(".choose");
                if(item){
                    item.classList.remove("choose");
                }
                e.target.classList.add("choose");
                self.searchAlbum(id);
            }
	    });
    },

    addWpis: function(idElement,content){
	    var element = document.getElementById(idElement);
	    element.innerText = content;
	    return content;
    },

    doSearch: function(url,callback){
	    var read,obj;
        var self = this;
        var xmlhttp = new XMLHttpRequest();

	    xmlhttp.open("GET",url,true);
        xmlhttp.addEventListener('load',function(){
		    if(xmlhttp.readyState==4 && xmlhttp.status === 200){
			    read = xmlhttp.responseText;
			    obj = JSON.parse(read);
			    document.getElementById("results").empty();

			    if(obj.hasOwnProperty('artists')){
				    callback(obj.artists.items);
			    }else{
				    callback(obj.items);
			    }
		    }
	});
        xmlhttp.send(null);
},
getInfo: function(array){
	var item;
	console.log(array);
	 for(item in array){
            if(array.hasOwnProperty(item)){
                var div = document.createElement("div");
                div.classList.add("cover");
                console.log(array[item]);
                var test = array[item].images.length;
               if(test !=0 ){
                    var logo = array[item].images[0].url;
                    var backImg = "background-image:url("+logo+")";
                    div.setAttribute("style",backImg);
                }else{
                    backImg = 'background-image:url("logo.png")';
                    div.setAttribute("style",backImg);
                    div.innerHTML='<div>'+array[item].name+'</div>';
                }
                var albumId = array[item].id;
                div.setAttribute("data-artist-id",albumId);
                document.getElementById("results").appendChild(div);
            }
        }
}
};


window.addEventListener('load',function(){
	Spotify.init();
})