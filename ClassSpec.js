describe("Class Library", function() {
    var ClassA = Class.extend({
        init: function(a){
            this.a = a;
        } ,

        name: function(){
            return this.a;
        }
    });

    var ClassB = ClassA.extend({
        init: function(){
            this._super("B");
        },
        notInA: function(){
            return true;
        }
    });

    var ClassC = ClassB.extend({
        init: function(b){
            this._super();
            this.a = "C";
            this.b = b;
        } ,
        notInA: function(){
            return this.b;
        }
    });

    var A;
    var B;
    var C;

    beforeEach(function() {
        this.A = new ClassA("A");
        this.B = new ClassB();
        this.C = new ClassC(false);
    });


    describe("When creating class A", function() {
        it("it should be defined",function(){
            expect(this.A).toBeDefined();
        });

        it("should have name A",function(){
            expect(this.A.name()).toBe("A");
        });
    });

    describe("When creating class B", function() {
        it("it should be defined",function(){
            expect(this.B).toBeDefined();
        });

        it("should have name B",function(){
            expect(this.B.name()).toBe("B");
        });

        it("should have function notInA",function(){
            expect(this.B.notInA()).toBeTruthy();
        });
    });

    describe("When creating class C",function(){
        it("should be defined",function(){
            expect(this.C).toBeDefined();
        });

        it("should override function from B",function(){
            expect(this.C.notInA()).toBeFalsy();
        });
    });
});
