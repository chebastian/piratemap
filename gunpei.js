$(document).ready(function(){

    Class.extend({

    });

    function timestamp(){
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
    
    //console.log('t');
    canvas = document.getElementById("gc"); 
    ctx = canvas.getContext("2d");
    var TOP = 1;
    var BOT = 2;
    var MID = 0;
    var field = [];
    var blockValues = [];
    var blockIds = [];
    var now, delta,last = timestamp();
    var FIELD_H = 6;
    var FIELD_W = 5;
    var blockmap = [];
    var colors = ["#FFF00F","#40FF40","#0A0","#FF00FF"];
    var currentColor = 0;
    var doUpdate = true;

    var BLOCK_DRAW_W = 30;
    var BLOCK_DRAW_H = 40;

    var gameloop =  function frame(){
        now = timestamp();
        delta = (now - last) / 1000; 
        update(delta);
        render(delta);

        last = now;
    }

    function update(time)
    {
    }

    function render(time){

    } 

    var walk = new Walker();
    var sc = 1;
    var sz = 8*sc;
    var size = (sz*sz)+1;
    var test = new Tile().setPos(1,1);
    var map = new TileMap().createMap(size,size); 
    //var map = new TileMap().createMap(5*9,5*9); 
    walk.cornerStep(map);
    //walk.devideMap(map,5*sc);
    walk.devideMap(map,6);
    map.draw(null);
    setInterval(gameloop,1000/30); 
});
