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

var Spotify = Spotify || {};
Spotify = {
    conf: {
        baseURL : "https://api.spotify.com",
        searchURL: "/v1/search",
        albumURL: "/v1/artists/",
        albumsURL: "/albums",
        track1URL: "/v1/albums/",
        track2URL: "/tracks?limit=50"

    },
    init: function() {
        var self = this;
        document.getElementById("search-form").addEventListener('keyup',function(e){
            var el = document.getElementById("wpis");
            var str = e.target.value;
                el.innerText = str;
               self.searchArtist(str);
        });
        document.getElementById("results").addEventListener('click',function(e){

            if((e.target.parentNode.className != 'container' ) && (e.target.className !='trackList')){

                if(!(e.target.hasAttribute("data-album-id"))){
                    var id = e.target.getAttribute('data-artist-id');
                    self.toogleChoose(e.target);
                    self.searchAlbum(id);
                }else{
                    var id = e.target.getAttribute("data-album-id");
                    self.searchTrack(id);
                }
            }
        });
    },
    searchTrack: function (id) {
        var self = this;
        var c = self.conf;
        var url = c.baseURL+c.track1URL + id + c.track2URL;
        self.newConnect(url,self.getTracks);

    },
    toogleChoose: function(element) {
        var item = document.querySelector(".choose");
        if(item){
            item.classList.remove("choose");
        }
        element.classList.add("choose");
    },
    searchArtist: function(artistName) {
        var self = this;
        var c = self.conf;
        if(artistName.trim().length!=0){
            var url = c.baseURL+c.searchURL+'?q=' + artistName + '*&type=artist&limit=50';
            self.newConnect(url,self.getInfo);
        }else{
            document.getElementById("results").innerHTML = '';
        }
    },
   searchAlbum: function(id){
        var self = this;
        var c = self.conf;
        var str = c.baseURL+c.albumURL+ id + c.albumsURL;
        self.newConnect(str,self.getInfo);
   },
    newConnect: function(str,callback){
        var read,obj,connect;
        connect = new XMLHttpRequest();
        connect.open('GET',str,true);
        connect.addEventListener('load',function(){
            if(connect.status === 200){
                read = connect.responseText;
                obj = JSON.parse(read);
                document.getElementById("results").empty();
                callback(obj);
         }
        });
        connect.send(null);
    },
    getInfo: function(respond){
        var item,artysta;
        if(respond.hasOwnProperty('artists')){
            artysta = true;
            var array = respond.artists.items;
        }else{
            artysta = false;
            var array = respond.items;
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
                var Id = array[item].id;
                var Name = array[item].name;
                if(artysta){
                    div.setAttribute("data-artist-id",Id);
                    div.setAttribute("data-artist-name",Name);
                }else{
                    div.setAttribute("data-album-id",Id);
                    div.setAttribute("data-album-name",Name);
                }
                document.getElementById("results").appendChild(div);
            }
        }
    },
    getTracks: function(respond){
        console.log(respond);
        var array = respond.items;
        var art = array[0].artists;

        var artist = art[0].name;
        var span = document.createElement("div");
        span.innerText = "Artist: " + artist;
        var where = document.getElementById("results");


        var ul = document.createElement("ul");
        ul.className="trackList";

        for(var item in array){

           var li = document.createElement("li");
            var a = document.createElement("a");
            console.dir(array[item]);
            a.setAttribute("href",array[item].preview_url);
            a.setAttribute("target" ,"blank");
            a.textContent = array[item].name;
            li.appendChild(a);
            ul.appendChild(li);

        }
        where.appendChild(span);
        where.appendChild(ul);
    }

  };



window.addEventListener('load', function () {
    //get start
    Spotify.init();
 });


