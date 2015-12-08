var Tile = Class.extend({
    init: function(){
        this.type = 0;
    },

    draw: function(g){
        var context = document.getElementById("gc").getContext('2d');
        context.fillStyle = "#CC00CC";
        context.fillRect(0,0,200,200);
    } 

});
