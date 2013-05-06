(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.Protocol = factory();
    }
}(this, function () {
    //Builds a protocol
    //Input:
    /*
        {
            "JOIN": function(data){
                //code
            },
            "UPDATE": {
                'send': function(one, two, three){
                    var data
                    //build data out of one, two, and three
                    return data;
                },
                'recieve': function(data){
                    //like above
                }
            }
        }
    */
   /**
    * [Protocol description]
    * @param {String} name [description]
    * @param {JSON} json [description]
    * @param {Function} send [description]
    */
    var Protocol = function(name, json, stream){
        var protocol = this;
        protocol.name = name;

        function createSend(type){
            console.log(type);
            function addType(obj){    
                console.log("adding ", type);
                if(!(obj instanceof Object)){
                    obj = {
                        message: obj,
                        type: type
                    };
                } else {
                    obj.type = type;
                }
                return obj
            }
            return function(data){
                addType(data, type);
                console.log("writing ", data);
                stream.write(data);
            };
        };

        function createExtendedSend(type, send){
            function addType(obj){    
                console.log("adding ", type);
                if(!(obj instanceof Object)){
                    obj = {
                        message: obj,
                        type: type
                    };
                } else {
                    obj.type = type;
                }
                return obj
            }

            return function(){
                var data = send.call(arguments);
                addType(data, type);
                console.log("writing ", data);
                stream.write(data);
            };
        }

        for(var i in json){
            console.log(i);
            var type = i;

            

            if(json[type].hasOwnProperty('send')){
                protocol[type] = createExtendedSend(type, json[type].send);
            } else {
                protocol[type] = createSend(type);
            }
        }
        //recieve
        stream.on('data', function(data){
            var recieve = json[data.type];
            if(recieve.hasOwnProperty('recieve'))
                recieve = recieve.recieve;
            recieve(data);
        });
    }


    return Protocol;
}));