/**
 * Created by Justin on 11/21/15.
 * Code inspiration for model data from http://www.brainjar.com/js/cards/default.asp also previous java of these classes
 * that I made for a blackjack game that was made using an article from Havard or Duke I forget but it was a while back
 */
//-----------------------------------------------------------------------------
// View class.
//-----------------------------------------------------------------------------
var Table = function () {
    var self = this;
    //players
    self.p1 = new Player(this);
    self.p2 = new Player(this);

    //card spaces;
    self.drawPile = new Stack();
    self.discardPile = new Stack();
    self.market = new Stack();

    //token spaces;
    self.goods = new Goods(this);
    self.camel = new TokenStack();
    self.bonus3 = new TokenStack();
    self.bonus4 = new TokenStack();
    self.bonus5 = new TokenStack();

    //make tokens
    self.camel.add(new Token(camel, 5));
    self.bonus3.setup(bonusTokens, bonus3);
    self.bonus4.setup(bonusTokens, bonus4);
    self.bonus5.setup(bonusTokens, bonus5);

    //make deck
    self.drawPile.makeDeck();
    self.setup();
};

Table.prototype = {
    constructor:Table,

    setup: function () {
        this.drawPile.shuffle(3);
        for (var i = 0; i < 5; i++) {
            if (i < 3)
                this.market.addCard(new Card("camel", "Ccamel"));
            else
                this.market.addCard(this.drawPile.deal());
            this.p1.hand.addCard(this.drawPile.deal());
            this.p2.hand.addCard(this.drawPile.deal());
        }
        this.p1.camelify();
        this.p2.camelify();
    },

    isEndofRound: function () {
        //while 4 token stacks have tokens and cards in draw pile
        return this.goods.threeGoodsEmpty() || this.drawPile.cardCount() < 0;
    },

    toString: function () {
        return "=====================================(View)=========================================\n" +
            "P1Tokens:{" + this.p1.tokens.toString() + "}\n" +
            "P2Tokens:{" + this.p2.tokens.toString() + "}\n" +
            "Goods" + this.goods.toString() +
            "Camel:{" + this.camel.toString() + "}\n" +
            "Market:{" + this.market.toString() + "}\nDrawPile:{" + this.drawPile.toString() +
            "}\nDiscardPile:{" + this.discardPile.toString() +
            "}\nP1Hand:{" + this.p1.hand.toString() + "}\nP2Hand:{" + this.p2.hand.toString() +
            "}\nP1Herd:{" + this.p1.herd.toString() + "}\nP2Herd:{" + this.p2.herd.toString() + "}";
    }
};

console.log("View Game class Loaded");



