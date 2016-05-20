// minus three camels that are assigned to the market
// the cards in an easy to parse format this data is used to build the deck in the table class
var cards = [{
    "name": "camel",
    "count": 8,
    "sprite": "Ccamel"
}, {
    "name": "diamond",
    "count": 6,
    "sprite": "Cdiamond"
}, {
    "name": "gold",
    "count": 6,
    "sprite": "Cgold"
}, {
    "name": "silver",
    "count": 6,
    "sprite": "Csilver"
}, {
    "name": "silk",
    "count": 8,
    "sprite": "Csilk"
}, {
    "name": "spice",
    "count": 8,
    "sprite": "Cspice"
}, {
    "name": "leather",
    "count": 10,
    "sprite": "Cleather"
}];

// card object
var Card = function(name, sprite) {
    var self = this;

    self.name = name;
    self.spriteName = sprite;
};

Card.prototype = {
    constructor: Card,

    toString: function() {
        return JSON.stringify(this);
    }
};
