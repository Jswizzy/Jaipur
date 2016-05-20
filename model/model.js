const camel = "camel";
const diamond = "diamond";
const gold = "gold";
const silver = "silver";
const silk = "silk";
const spice = "spice";
const leather = "leather";
const bonus5 = "five";
const bonus4 = "four";
const bonus3 = "three";
const market = "market";
const player = "player";

// import everything
document.write('<script language="javascript" src="model/card.js"></script>');
document.write('<script language="javascript" src="model/stack.js"></script>');
document.write('<script language="javascript" src="model/token.js"></script>');
document.write('<script language="javascript" src="model/tokenStack.js"></script>');
document.write('<script language="javascript" src="model/goods.js"></script>');
document.write('<script language="javascript" src="model/player.js"></script>');
document.write('<script language="javascript" src="model/table.js"></script>');

var Model = function(){
    var me = this;

    me.table = new Table();
    console.log(me.table);
};

Model.prototype = {

    setup: function () {
        this.table.setup();
    },

    getMarketCardAt: function (n) {
        return this.table.market.getCard(n);
    }
};