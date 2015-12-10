describe("State Manager", function() {

    describe("When mgr is created", function() {
        var stateManager;

        beforeEach(function() {
            this.stateManager = new StateManager();
        });

        it("Current state should be null", function() {
            expect(this.stateManager.getCurrentState()).toBe(null);
        });

        it("has state should be false", function() {
            expect(this.stateManager.hasState()).toBe(false);
        });

    });

    describe("When state is changed", function() {
        var stateManager;

        beforeEach(function() {
            this.stateManager = new StateManager(); 
        });

        it("currentState should be equal to that state", function() {
            var state = new BlockState(null);
            this.stateManager.changeState(state);
            expect(this.stateManager.getCurrentState()).toBe(state);
        });

        it("currentState should have its onEnter called", function() {
            var state = new BlockState(null);
            state.onEnter = jasmine.createSpy("entered");

            this.stateManager.changeState(state);
            expect(this.stateManager.getCurrentState().onEnter).toHaveBeenCalled();
        });

        it("should have called onExit on any previous state", function() {
            var state = new BlockState(null);
            state.onExit = jasmine.createSpy("exited");

            this.stateManager.changeState(state);
            this.stateManager.changeState(new BlockState(null));

            expect(state.onExit).toHaveBeenCalled();
        });

        it("should return true on is in state set", function() {
            var state = new BlockState(null);

            this.stateManager.changeState(state); 
            expect(this.stateManager.isInState(new BlockState(null))).toBeTruthy();
        });

        it("should return false  on is in state set when not equal", function() {
            var state = new BlockState(null);

            this.stateManager.changeState(state); 
            expect(this.stateManager.isInState(new BlockIdleState(null))).toBeFalsy();
        });

    });
});

describe("Block Field", function() {

  var field; 
  beforeEach(function() {
    field = new BlockField(5,5);
    field.createField();
  });

  it("should create a field 5 in width and height", function() {
    expect(field.field.length).toEqual(5);
  });

  it("should set block 4,4 to 1 and read 4,4 as 1", function() {
      field.setBlock(4,4,1);
    expect(field.getBlock(4,4)).toEqual(1);
  });

  it("should find block 0,0 to have right eq to TOP", function() {
      field.setBlock(0,0,2);
    expect(getBlockRight(field.getBlock(0,0))).toEqual(BOT);
    expect(getBlockLeft(field.getBlock(0,0))).toEqual(TOP);
  });

  it("should not find connection between blocks 0,0 and 1,0", function() {
      field.setBlock(0,0,0);
      field.setBlock(1,0,3);
      field.setBlock(0,1,3);
      field.setBlock(0,3,0);
    expect(field.areConnected(field.getBlock(0,0),field.getBlock(1,0)),1,0).toBeFalsy();
  });

  it("should find connection between 0,0 and 0,1", function() {
      field.setBlock(0,0,3);
      field.setBlock(0,1,0);
    expect(field.areConnected(field.getBlock(0,0),field.getBlock(0,1),0,1)).toBeTruthy();
  });

  it("should not find connection between 0,0 and 0,1", function() {
      field.setBlock(0,0,3);
      field.setBlock(0,1,3);
    expect(field.areConnected(field.getBlock(0,0),field.getBlock(0,1),0,1)).toBeFalsy();
  });

  it("should find diagonal connection between 2,2 and 1,1", function() {
      field.setBlock(2,2,2);
      field.setBlock(1,1,2);
    expect(field.areConnected(field.getBlock(2,2),field.getBlock(1,1),-1,-1)).toBeTruthy();
  });

  it("should percolate on first row",function(){
      field.setRow(0,[2,3,0,3,0]); 
      field.setRow(1,[3,2,3,0,3]); 
      field.setRow(2,[0,3,2,3,0]); 
      field.setRow(3,[3,0,3,2,3]); 
      field.setRow(4,[0,3,0,3,2]); 
      expect(field.percolates()).toBeTruthy(); 
  });

  it("block 0,0 should have vertices 0 1+W 2",function(){
      var vertices = field.getBlockVertices(0,0);
      expect(vertices).toEqual([0,0,2]);
  } );
});

describe("Field Percolations Finder", function() {
  var field; 
  var finder;

  beforeEach(function() {
    this.field = new BlockField(5,5);
    this.field.createField(); 
    this.finder = new FieldPercolationFinder(this.field); 
  }); 

  it("should not percolate on row 0", function() {
        expect(this.field).toBeDefined();
        this.field.setRow(0,[0,3,0,3,0]);
        this.field.setRow(1,[3,0,3,0,3]);
        this.field.setRow(2,[0,3,0,3,0]);
        this.field.setRow(3,[0,0,0,0,0]);
        expect(this.finder.rowPercolates(0)).toBeFalsy();
    }); 

  it("should percolate on row 3", function() {
        expect(this.field).toBeDefined();
        this.field.setRow(0,[0,3,0,3,0]);
        this.field.setRow(1,[3,0,3,0,3]);
        this.field.setRow(2,[0,3,0,3,0]);
        this.field.setRow(3,[0,0,0,0,0]);
        expect(this.finder.rowPercolates(3)).toBeTruthy();
    }); 

  it("should find path greater than 0 on row 3",function(){
        this.field.setRow(0,[0,3,0,3,0]);
        this.field.setRow(1,[3,0,3,0,3]);
        this.field.setRow(2,[0,3,0,3,0]);
        this.field.setRow(3,[0,0,0,0,0]);

        var path = this.finder.getRowPath(3);
        console.log(path);
        expect(path.length).toBeGreaterThan(0); 
  });

  it("should find max X of path to equal field W",function(){
        this.field.setRow(0,[0,3,0,3,0]);
        this.field.setRow(1,[3,0,3,0,3]);
        this.field.setRow(2,[0,3,0,3,0]);
        this.field.setRow(3,[0,0,0,0,0]);

        var path = this.finder.getRowPath(3);
        //console.log(path);
        expect(this.finder.getPathMax(path)[0]).toBe(this.field.width-1);
  }); 

  it("should find max X of path to equal field W",function(){
        expect(this.field).toBeDefined();
        this.field.setRow(0,[0,3,0,3,0]);
        this.field.setRow(1,[3,0,3,0,3]);
        this.field.setRow(2,[0,3,0,3,0]);
        this.field.setRow(3,[0,0,0,0,0]);
        console.log("BRANCHES: " + this.finder.getBlockConnections(0,3,[]));
        console.log("RES: " + this.finder.nodes);

      expect(true).toBeTruthy();
  });

});

describe("Row queue", function() {
    var queue;
    beforeEach(function() {
        field = new BlockField(5,5);
        field.createField();

        queue = new RowQueue(0);
    }); 

    describe("Uppon creating Row Queue", function() { 
        it("should return empty queue",function(){
            expect(queue.queueLength()).toBe(0);
        } ); 
    });

    describe("Uppon inserting one item into Row Queue", function() { 
        it("should return queue with length 1 ",function(){
            queue.addToQueue({});
            expect(queue.queueLength()).toBe(1);
        }); 
    });

    describe("When deleting the only item", function() { 
        it("it should be removed from the queue,and queue be empty",function(){
            queue.addToQueue({});
            queue.pop();
            expect(queue.queueLength()).toBe(0);
        }); 
    });

    describe("When adding item with cooldown of 5 seconds", function() { 
        it("queues timer should be 5seconds",function(){
            queue.addToQueue({time: 5});
            expect(queue.peek().time).toBe(5);
        }); 
    });

    describe("When no items is added to queue", function() { 
        it("queue timer should be negative 1",function(){
            expect(queue.peek().time).toBe(-1);
        }); 

        it("removing should throw exception ",function(){
            expect(function(){queue.pop()}).toThrow(new Error("No item in queue"));
        }); 
    });

    describe("when more than one item is in queue ", function() { 
        it("he one with the least amount of time is the first item in the queue",function(){
            queue.addToQueue({time: 3});
            queue.addToQueue({time: 2});
            queue.addToQueue({time: 1});
            queue.addToQueue({time: 2});
            expect(queue.peek().time).toBe(1);
        }); 
    });

    describe("when queue contains 2 and 5", function() { 
        it("will after update 3seconds have first item active ",function(){

            queue.addToQueue(new QueueItem(2));
            queue.addToQueue(new QueueItem(5)); 

            queue.update(3);
            expect(queue.peek().active).toBeTruthy();
        });
    });

    describe("when an item is added with cooldown of 2 seconds", function() { 
        it("will first be un active",function(){
            queue.addToQueue({time: 2, active: false});
            expect(queue.peek().active).toBeFalsy();
        }); 

        it("will after 1 seconds be inactive",function(){
            queue.addToQueue(new QueueItem(2)); 

            queue.update(1); 
            expect(queue.peek().active).toBeFalsy(); 
        }); 

        it("will after 0.5 seconds have 1.5 seconds left",function(){
            queue.addToQueue(new QueueItem(2)); 

            queue.update(0.5); 
            expect(queue.peek().timeLeft()).toBe(1.5);
        }); 

        it("will after 1.5 seconds have a percanteage complete of 0.75",function(){
            queue.addToQueue(new QueueItem(2)); 

            queue.update(1.5); 
            expect(queue.peek().percentageComplete()).toBe(0.75);
        }); 

        it("will after 3 seconds be active",function(){
            queue.addToQueue(new QueueItem(2)); 

            queue.update(3); 
            expect(queue.peek().active).toBeTruthy(); 
        }); 

        it("will be cleared after activation",function(){
            queue.addToQueue(new QueueItem(2));
            queue.update(3);
            queue.clean();
            expect(queue.queueLength()).toBe(0); 
        }); 

        it("will after 1 seconds NOT  have called it onTimeout function",function(){
            var queueItem = new QueueItem(2);
            queueItem.onTimeout = jasmine.createSpy("Timed-out");
            queue.addToQueue(queueItem);
            queue.update(1);
            expect(queueItem.onTimeout).not.toHaveBeenCalled();
        }); 

        it("will after 3 seconds have called it onTimeout function",function(){
            var queueItem = new QueueItem(2);
            queueItem.onTimeout = jasmine.createSpy("Timed-out");
            queue.addToQueue(queueItem);
            queue.update(3);
            expect(queueItem.onTimeout).toHaveBeenCalled();
        }); 
    }); 

    describe("when queue contains 2 and 5", function() { 
        it("will after 3 seconds contain only one item",function(){

            queue.addToQueue(new QueueItem(2));
            queue.addToQueue(new QueueItem(5));
            queue.update(3);
            queue.clean();
            expect(queue.queueLength()).toBe(1); 
        });
    }); 
});


describe("Visible field synchronizer", function() {

    var field;
    var fieldSynch;
    var visibleField;

    beforeEach(function() {
        this.field = new BlockField(5,5);
        this.field.createField(); 
        this.visibleField = new BlockField(5,5);
        this.visibleField.createField();

        this.fieldSynch = new FieldSynch(this.field,this.visibleField);
    }); 

    describe("when visible field is updated", function() { 

        it("will be reflecten in underlaying field",function(){
            this.fieldSynch.setBlock(1,1,2);
        });
    }); 
});
