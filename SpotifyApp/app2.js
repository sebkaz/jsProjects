/**
 * Created by domowy on 09.12.2015.
 */
"use strict";
Node.prototype.empty = function () {
    if (this.childNodes.length) {
        for (var x = this.childNodes.length - 1; x >= 0; x--) {
            this.removeChild(this.childNodes[x]);
        }
    }
};

var Spotify;

Spotify = {

    baseURL: "https://api.spotify.com",
    typeURL: "*&type=artist&limit=50",
    searchURL: "/v1/search?q=",
    artistsURL: "v1/artists/",
    albumsURL: "/albums",
    track_one: "/v1/albums/",
    track_two: "/tracks",
    init: function(){
        var artistSearch, results, self;
        self = this;
        artistSearch = document.getElementById("search-form");
        results = document.getElementById("results");

        artistSearch.addEventListener('keyup',function(e){
            var element = document.getElementById("wpis");
            element.innerText = e.target.value;
            self.doSearchArtists(e.target.value);
        });
        results.addEventListener('click',function(e){
            if(e.target.parentNode.className != 'container'){

                var id = e.target.getAttribute('data-artist-id');
                //czyszczenie wybranego wczesniej elementu
                var item = document.querySelector(".choose");
                if(item){
                    item.classList.remove("choose");
                }
                e.target.classList.add("choose");
                self.doSearchAlbum(id);
            }
        });
    },
    doSearchArtists: function (artist) {
        var self = this;
        var url = self.baseURL+ self.searchURL + artist + self.typeURL;
        console.log(url);
        var obj = self.connect(url);
        console.dir(obj);
        self.showArtists_Album(obj);
    },
    connect: function (url) {
        var read,
            obj = {};
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",url,true);
        xmlhttp.addEventListener('load',function(){
            if(xmlhttp.readyState==4 && xmlhttp.status === 200) {
                read = xmlhttp.responseText;
                obj = JSON.parse(read);
                document.getElementById("results").empty();
            }
        });
        xmlhttp.send(null);
        console.dir(obj);
        return obj;
    },
    showArtists_Album: function (object) {
        var item;
        if(object.hasOwnProperty('artists')){
            var array = object.artists.items;
        }else{
            var array = object.items;
        }
        for(item in array){
            if(array.hasOwnProperty(item)){
                var div = document.createElement("div");
                div.classList.add("cover");
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

    },
    doSearchAlbum: function (id) {
        var url = self.baseURL + self.albumURL + id + self.albumsURL;
        var obj = self.connect(url);
        self.showArtists_Album(obj);
    }
};


(function(){
    Spotify.init();
})();
