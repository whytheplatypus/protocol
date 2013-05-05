(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.amdWeb = factory();
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
        for(var i in json){
            //send
            var send = function(data){
                if(data !instanceof Object){
                    data = {
                        message: data
                        type: i
                    }
                } else {
                    data.type = i;
                }
                //change to write if working with nodejs stream
                stream.send(data);
            }
            
            if(json[i].hasOwnProperty('send'))
                send = function(){
                    var data = protocol[i].send.call(arguments);
                    if(data !instanceof Object){
                        data = {
                            message: data
                            type: i
                        }
                    } else {
                        data.type = i;
                    }
                    //change to write if working with nodejs stream
                    stream.send(data);
                }
            protocol[i] = send;
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