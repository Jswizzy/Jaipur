var Player = function (table) {
    var me = this;

    me.hand = new Stack();
    me.herd = new Stack();
    me.tokens = new TokenStack();

    me.table = table;
};

Player.prototype = {
    constructor: Player,

    // move camels from hand to herd
    camelify: function () {
        while (this.hand.hasCard(camel)) {
            this.herd.addCard(this.hand.drawCard(camel));
        }
    },

    //take all the camels
    takeCamels: function () {
        var me = this;

        while (me.table.market.hasCard(camel)){
            me.herd.addCard(me.table.market.drawCard(camel));
        }
    },

    //calculate the players score by adding up token values
    getRupees: function () {
        return this.tokens.value();
    },

    getCardAt: function (n) {
        return this.hand.getCardNameAt(n);
    },

    getHerdCardAt: function (n) {
        return this.herd.getCardNameAt(n);
    }
};
