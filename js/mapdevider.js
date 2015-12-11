var Walker = Class.extend({
    init: function(){
        Math.seed = 256;
        this.iteration = 0;
        this.initialWidth = 0; 
    }, 

    generateMap: function(){
        var sc = 2;
        var sz = 8*sc;
        var size = (sz*sz)+1;
        var test = new Tile().setPos(1,1);
        this.initialWidth = size;
        var map = new TileMap().createMap(size,size); 

        Math.seedrandom($("#randSeed").val());

        this.cornerStep(map); 
        this.devideMap(map);

        var visualizer = new MapVisualizer(map);
        visualizer.setupValues();
        visualizer.draw(map); 
        return map;
    },

    initValues: function(){
        this.grainModifier = $("#grainModifier").val();
        this.signChanger = $("#signChanger").val();

    },

    devideMap :function(map){
        var hw = parseInt(map.width * 0.5);
        var hh = parseInt(map.height * 0.5); 
        var is_x = 0;
        var is_y = 1; 

        if(hw > 1)
        {
                var splits = map.splitMap();
                for(var split in splits){
                    if(this.halfSize(split) <= 2)
                        return;


                    this.squareStep(splits[split]);
                    this.diamondStep(splits[split]);
                }
                for(var split in splits){
                    this.devideMap(splits[split]);
                }
            } 

    },

    squareAvg: function(map,col){
        //get avg of corners
        var points = [];
        points.push([0,0]);
        points.push([map.width-1,0]);
        points.push([0,map.height-1]);
        points.push([map.width-1,map.height-1]);
        var avg = 0;
        for(var p in points){
            var point = points[p];
            avg += map.tiles[point[0]][point[1]].value;
        } 

        return avg/4;
    },

    diamondStep: function(map){
        var avg = this.squareAvg(map); 
        var hsz = this.halfSize(map);
        map.tiles[hsz[0]][hsz[1]].type = 1;
        var deep = map.width / this.initialWidth; 

        //this.grain = 0.165 * Math.random();
        //this.grain = Math.random() * ((this.grainModifier * deep));
        this.grain = ((this.grainModifier * deep));

        if(Math.random() > this.signChanger)
            this.grain *= -1;

        var newvalue = avg + (this.grain);
        map.setTileValue(hsz[0],hsz[1],newvalue);
    },

    cornerStep: function(map){
        var points = [];
        points.push([0,0]);
        points.push([map.width-1,0]);
        points.push([0,map.height-1]);
        points.push([map.width-1,map.height-1]);
        var avg = 0;
        var rand = Math.random();
        for(var p in points){
            var point = points[p];
            map.setTileValue(point[0],point[1],Math.random());
        } 
    },

    squareStep: function(map){
        var points = [];
        var hsz = this.halfSize(map);
        var hw = hsz[0];
        var hh = hsz[1];
        points.push([hw,0]);
        points.push([map.width-1,hh]);
        points.push([0,hh]);
        points.push([hw,map.height-1]);

        var values = [];
        values.push(map.getAverageOfTiles(0,0,map.width-1,0));
        values.push(map.getAverageOfTiles(map.width-1,0,map.width-1,map.height-1));
        values.push(map.getAverageOfTiles(0,0,0,map.height-1));
        values.push(map.getAverageOfTiles(map.width-1,map.height-1,0,map.height-1));

        var avg = 0;
        for(var p in points){
            var point = points[p];
            map.setTileValue(point[0],point[1],values[p]);
        } 
    },

    calculatePoint : function(x,iteration){
        var res = x;
        for(var i in _.range(iteration))
            res = parseInt(res / 2);

        return res;
    }, 

    halfSize: function(map){
        return [parseInt(map.width*0.5),parseInt(map.height*0.5)];
    } ,

});
