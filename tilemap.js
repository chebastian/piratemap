var TileMap = Class.extend({

    init: function(){
        this.type = 0;
        this.w = 0;
        this.h = 0;
        this.tiles = [];
    },

    fill: function(val){
        for(var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                this.tiles[i][j].type = val;
            }

        }
    },

    createMap: function(w,h)
    {
        this.height = h;
        this.width = w;
        for(var i = 0; i < w; i++)
        {
            var row = [];
            var rowObj = [];
            for(var j = 0; j < h; j++)
            {
                row.push(new Tile().setPos(i,j));
            }
            this.tiles.push(row);
        }
        return this;
    },

    addTile:function(x,y,value){
        this.tiles[x][y] = new Tile(value).setPos(x,y).setValue(value);
        return this.tiles[x][y];
    }, 

    setTileValue: function(x,y,val){
        this.tiles[x][y].value = val;
    },

    draw: function(g){
        for(var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                this.tiles[i][j].draw(null);
            }

        }
    } ,

    subMap: function(sx,sy,w,h){
        var map = [];
        var nmap = new TileMap().createMap(w,h);
        for(var i = 0; i < w; i++){
            var row = [];
            for(var j = 0; j < h; j++){
                row.push(this.tiles[i+sx][j+sy]);
            }
            map.push(row); 
        }
        nmap.tiles = map;
        return nmap; 
    },

    splitMap: function(){ 
        var halfW = parseInt((1.0+this.width)*0.5);
        var halfH = parseInt((1.0+this.height)*0.5);

        //alert(halfW);
        //var topLeft = this.subMap(0,0,halfW,halfH);
        //var topRight = this.subMap(halfW,0,halfW,halfH);
        //var bottomLeft = this.subMap(0,halfH,halfW,halfH);
        //var bottomRight = this.subMap(halfW,halfH,halfW,halfH);
        var topLeft = this.subMap(0,0, halfW,halfH);
        var topRight = this.subMap(halfW-1,0, halfW,halfH);
        var bottomLeft = this.subMap(0,halfH-1, halfW,halfH);
        var bottomRight = this.subMap(halfW-1,halfH-1, halfW,halfH);
        var arr = [];
        arr.push(topLeft);
        arr.push(topRight);
        arr.push(bottomLeft);
        arr.push(bottomRight);
        return arr;
    },

    getAverageOfTiles: function(x,y,x1,y1){
        var val1 = this.tiles[x][y].value;
        var val2 = this.tiles[x1][y1].value;
        return (val1 + val2)*0.5;
    },

    accept: function(visitor){
    } 
});
