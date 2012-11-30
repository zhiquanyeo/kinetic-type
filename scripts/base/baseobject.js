define([],
function() {
    function subclass(subObj) {
        var base = this;
        if (!subObj.properties)
            subObj.properties = {};
        subObj.properties.__proto__ = base.properties;

        if (!subObj.methods) 
            subObj.methods = {};
        subObj.methods.__proto__ = base.methods;

        subObj.subclass = subclass;
        return subObj;
    }

    var BaseObject = {
        create: function() { //Constructor
            
        },
        properties: {
            
        },
        methods: {

        },
        subclass: subclass,
    };

    return BaseObject;
});
