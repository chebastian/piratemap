function FieldPercolationFinder(field)
{
    this.field = field;
    this.percolatingPaths = [];
    this.pathLengths = [];
    this.dirs = [
            [0,-1,function(){}],//TOP
            [-1,-1],//TOP LEFT
            [-1,0],//LEFT 
            [-1,1],//BOTTOM LEFT

            [0,1],//BOTTOM
            [1,1],//BOTTOM RIGHT
            [1,0],//RIGHT
            [1,-1]//TOP RIGHT 
            ];

    this.trimPath = function(path)
    {
        var newp = path;
        var temp = path;
        if(!_.isArray(temp))
            return path;

        while(this.pathIsPercolating(temp.slice(1,temp.length)))
        {
            temp = temp.slice(1,temp.length);
        }

        return temp;
    }

    this.pathIsPercolating = function(path)
    {
        for(var i = 0; i < path.length; i++)
        {
            if(path[i][0] >= this.field.width-1)
                return true;
        }

        return false;
    }

    this.getSoroundingConnectedBlocks = function(x,y,checked)
    {
        var sorounding = [];
        var ix = 0; 
        var iy = 1;
        var _this = this;
        _.map(this.dirs,function(dir){
            var px = x + dir[ix];
            var py = y + dir[iy];
            if((px >= 0 && px < _this.field.width) && (py >= 0 && py < _this.field.height))
            { 
                var bl = _this.field.getBlock(px,py);
                if(_this.field.areConnected(_this.field.getBlock(x,y),bl,dir[ix],dir[iy]))
                {
                    var isInList = function(a,list){
                        for(var i = 0; i < list.length; i++)
                        {
                            if(list[i][0] == a[0] &&
                                list[i][1] == a[1])
                                return true;
                        }
                    return false;
                }
                    if(!isInList([px,py],checked))
                    {
                        //connections.push([px,py]); 
                        sorounding.push([px,py]);
                    }
                    checked.push([px,py])
                }
            } 
        }); 

        return sorounding; 
    }

    this.getPathMax = function(path)
    {
        var maxX = 0;
        var maxY = 0;
        _.each(path,function(node) { 
            var pos = node;
                maxX = Math.max(maxX,pos[0]);
                maxY = Math.max(maxY,pos[1]);
            });

        return [maxX,maxY];
    }

    this.getBlockConnections = function(x,y,checked)
    {
        var ix = 0; 
        var iy = 1; 

        var _this = this; 
        var connections = [];
        var counter = 0; 
        var parentNode = new Node(x,y); 
        var parent_connections = this.getSoroundingConnectedBlocks(x,y,checked); 
        var plen = parent_connections.length;

        while(parent_connections.length > 0 && !this.pathIsConnectedToRight(connections) && !(this.pathIsConnectedToRight(connections) && this.pathIsConnectedToTheLeft(connections)) && !this.pathIsConnectedToRight([x,y]))
        { 
            var block = _.last(parent_connections);
            checked.push(block);
            parent_connections = _.initial(parent_connections);
            var res = this.getBlockConnections(block[0],block[1],_.union(
                            checked,parent_connections
                            ));
            _.map(res,function(node)
                    {
                        connections.push(node);
                    }); 
        } 


        connections.push([x,y]);

        if(this.pathIsConnectedToRight(connections))
            return connections;

        return [];
    }

    this.appendBranchesToPath = function(path)
    {
        var temp = [];
        var tempPath = $.extend(true,[],path);
        var me = this;

        _.map(path,function(node){
            tempPath = $.extend(true,[],path);
            var sorounding = me.getSoroundingConnectedBlocks(node[0],node[1],tempPath);
            tempPath = $.extend(true,[],path);
            _.map(sorounding,function(node){
                temp.push(me.getBlockConnections(node[0],node[1],tempPath));
            });
        });

        console.log(temp);
        return temp;
    }

    this.pathIsConnectedToRight = function(node)
    {
        for(var i = 0; i < node.length; i++)
        {
            if(node[i][0] >= this.field.width-1)
                return true;
        }

        return false;
    }

    this.pathIsConnectedToTheLeft = function(node)
    {
        for(var i = 0; i < node.length; i++)
        {
            if(node[i][0] == 0)
                return true;
        }

        return false; 
    } 

    this.getRowPath = function(row)
    {
        var path = this.getBlockConnections(0,row,[]);
        return this.getBlockConnections(0,row,[]);
    }

    this.rowPercolates = function(row)
    {
        return this.getBlockConnections(0,row,[]).length > 0;
    }

    this.percolates = function()
    {
        var checked = [];
        for(var i = 0; i < this.field.height; i++)
        {
            var path = this.getBlockConnections(0,i,[]);
            if(path.length > 0)
            {
                var branches = this.appendBranchesToPath(path);
                this.percolatingPaths.push(path);
                //return true; 
            }
        }

        return this.percolatingPaths.length > 0;
    }
}
