
var MapVisualizer = Class.extend({
    init: function(){
    }, 

    draw: function(map){
        var context = document.getElementById("gc").getContext('2d'); 
        //context.clearRect(0,0,map.width,map.height);
        context.globalAlpha = 1;
        context.clearRect(0,0,map.width*32,map.height*32);
        context.fillStyle = "#000000";
        context.fillRect(0,0,map.width*32,map.height*32);
        for(var i = 0; i < map.width; i++){
            for(var j = 0; j < map.height; j++){
                var tile = map.getTile(i,j);
                context.globalAlpha = tile.value;
                if( tile.value > 0.7)
                    context.fillStyle = "1100FF";
                else if( tile.value > 0.5 )
                    context.fillStyle = "#2200FF";
                else 
                    context.fillStyle = "#11FF00";
                context.fillRect(tile.x * tile.w, tile.y * tile.h, tile.w,tile.w);
            }

        } 

    },
});