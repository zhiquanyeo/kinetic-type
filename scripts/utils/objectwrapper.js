//Object Wrapper
//This module will wrap a spec of an object up and hook up the relevant
//properties and methods
define([]
function() {
    function createWrappedObject(typeName, spec) {
        
        var WrappedObject = function() {
            this.data = {}; //store internal
            this.type = typeName;

            var internal = spec.create.call({
                data: this.data
            });

            this._internal = function() {
                return internal;
            }
        };

        for (var n in spec.properties) {
            (function(properties, name) {
                var propValue = properties[name];
                Object.defineProperty(WrappedObject.prototype, name, {
                    get: function() {
                        return propValue.call(this, this);
                    },
                    set: function(val) {
                        propValue.call(this, this, val);
                    },
                    enumerable: true,
                });
            })(spec.properties, n);
        }

        for (var n in spec.methods) {
            (function(methods, name) {
                var propValue = methods[name];
                WrappedObject.prototype[name] = function() {
                    var args = Array.prototype.slice.call(arguments);
                    return propValue.apply(this, args);
                }
            })(spec.methods, n);
        }

        return WrappedObject;
    }

    return {
        wrap: createWrappedObject
    }
);
