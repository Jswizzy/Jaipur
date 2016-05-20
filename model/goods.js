//good is a collection of token stacks that players get points from
//I probably wouldn't bother with this class if I was to do this again. Most of this can go into the table class
var Goods = function (game) {
    var self = this;

    //goods array
    self.goods = [];
    //good stacks
    self.diamonds = new TokenStack();
    self.gold = new TokenStack();
    self.silver = new TokenStack();
    self.silk = new TokenStack();
    self.spice = new TokenStack();
    self.leather = new TokenStack();

    self.game = game;

    self.diamonds.setup(goodsTokens, diamond);
    self.gold.setup(goodsTokens, gold);
    self.silver.setup(goodsTokens, silver);
    self.silk.setup(goodsTokens, silk);
    self.spice.setup(goodsTokens, spice);
    self.leather.setup(goodsTokens, leather);

    self.goods.push(self.diamonds);
    self.goods.push(self.gold);
    self.goods.push(self.silver);
    self.goods.push(self.silk);
    self.goods.push(self.spice);
    self.goods.push(self.leather);

};

Goods.prototype = {
    constructor: Goods,

    threeGoodsEmpty: function () {
        var total = 0;
        for (var i = 0; i < this.goods; i++) {
            if (this.goods[i].isEmpty())
                total++;
        }
        return total >= 3;
    },

    take: function (good, player) {
        switch (good) {
            case diamond:
                player.tokens.add(this.diamonds.take());
                break;
            case silver:
                player.tokens.add(this.gold.take());
                break;
            case gold:
                player.tokens.add(this.silver.take());
                break;
            case silk:
                player.tokens.add(this.silk.take());
                break;
            case leather:
                player.tokens.add(this.spice.take());
                break;
            case spice:
                player.tokens.add(this.leather.take());
                break;
            default:
                return false;
        }
    },
    toString: function () {
        return "\nDiamonds:" + this.diamonds.toString() + "\n" +
            "Gold:" + this.gold.toString() + "\n" +
            "Silver" + this.silver.toString() + "\n" +
            "Silk:" + this.silk.toString() + "\n" +
            "Spice:" + this.spice.toString() + "\n" +
            "Leather:" + this.leather.toString() + "\n"
    }


};
