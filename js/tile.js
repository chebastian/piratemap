//var COLORS = ["#FF0000","#00FF00","#FFFFFF","FFFF00"];
var COLORS = ["#000000","#FFFFFF","#FF0000","#00FF00"];

for(var i in _.range(100)){
    COLORS.push('#'+Math.floor(Math.random()*16777215).toString(16));
}

var Tile = Class.extend({
    init: function(){
        this.type = 1;
        this.gradient = 1.0;
        this.x = 0;
        this.y = 0;
        this.sz = 1;
        this.w = this.sz;
        this.h = this.sz;
        //this.value = Math.random();
        this.value = 0.5;
    }, 

    setPos: function(x,y){
        this.x = x; 
        this.y = y;
        return this; 
    },

    setValue: function(val){
        this.type = val;
        return this;
    },

    setGradient: function(val){
        this.gradient = val;
        return this;
    },

    draw: function(g){
        var context = document.getElementById("gc").getContext('2d');
        context.globalAlpha = this.value;
        if(this.value > 0.7)
            context.fillStyle = "1100FF";
        else if(this.value > 0.5 )
            context.fillStyle = "#2200FF";
        else 
            context.fillStyle = "#11FF00";
        context.fillRect(this.x * this.w, this.y * this.h, this.w,this.w);
        context.strokeStyle = COLORS[this.type];//"#FFffF";
        //context.strokeRect(this.x * this.w, this.y * this.h, this.w,this.w);

        context.font = "12px Arial";
    } 

});
