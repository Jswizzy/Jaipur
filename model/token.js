//data used to build the token objects and token stacks
var goodsTokens = [
    {"name":"diamond","count":2,"value":7,"sprite": "Tdiamond"},
    {"name":"diamond","count":3,"value":5,"sprite": "Tdiamond"},
    {"name":"gold","count":2,"value":6,"sprite": "Tgold"},
    {"name":"gold","count":3,"value":5,"sprite": "Tgold"},
    {"name":"silver","count":5,"value":5,"sprite": "Tsilver"},
    {"name":"silk","count":1,"value":5,"sprite": "Tsilk"},
    {"name":"silk","count":2,"value":3,"sprite": "Tsilk"},
    {"name":"silk","count":2,"value":2,"sprite": "Tsilk"},
    {"name":"silk","count":2,"value":1,"sprite": "Tsilk"},
    {"name":"spice","count":1,"value":5,"sprite": "Tspice"},
    {"name":"spice","count":2,"value":3,"sprite": "Tspice"},
    {"name":"spice","count":2,"value":2,"sprite": "Tspice"},
    {"name":"spice","count":2,"value":1,"sprite": "Tspice"},
    {"name":"leather","count":1,"value":4,"sprite": "Tleather"},
    {"name":"leather","count":1,"value":3,"sprite": "Tleather"},
    {"name":"leather","count":1,"value":2,"sprite": "Tleather"},
    {"name":"leather","count":6,"value":1,"sprite": "Tleather"}
];
var bonusTokens = [
    {"name":"five","count":2,"value":10,"sprite": "Tb5"},
    {"name":"five","count":1,"value":9,"sprite": "Tb5"},
    {"name":"five","count":2,"value":8,"sprite": "Tb5"},
    {"name":"four","count":2,"value":6,"sprite": "Tb4"},
    {"name":"four","count":2,"value":5,"sprite": "Tb4"},
    {"name":"four","count":2,"value":4,"sprite": "Tb4"},
    {"name":"three","count":2,"value":3,"sprite": "Tb3"},
    {"name":"three","count":3,"value":2,"sprite": "Tb3"},
    {"name":"three","count":2,"value":1,"sprite": "Tb3"}
];
var camelTokens = [
    {"name":"camel","count":"1","value":5,"sprite": "Tcamel"}
];
var sealTokens = [
    {"name":"sealOfExcellence","count":"3","value":1,"sprite": "Tseal"}
];

// token object
var Token = function (name, value, sprite) {
    var self = this;

    self.name = name;
    self.value = value;
    self.spriteName =  sprite;
};

Token.prototype = {
    constructor: Token,

    toString: function () {
        return JSON.stringify(this);
    }
};
