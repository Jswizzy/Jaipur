//code to handle the deck some of it is from brainjar other of it inspired from a java card game I made however
// that used enums and interfaces and plus I'm not really anywhere near as familiar with javascript as I am with java
// in fact this is my first none trivial javascript program. I also read a few articles from javascript is sexy about
// how to use functions as classes. I think most of this code is self explanatory.
var Stack = function () {
    // create an empty array of cards
    this.cards = [];
};

Stack.prototype = {
    constructor: Stack,

    makeDeck: function () {
        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < cards[i].count; j++) {
                this.cards.push(new Card(cards[i].name, cards[i].sprite));
            }
        }
    },

    shuffle: function (n) {
        var i, j, k, temp;
        for (i = 0; i < n; i++) {
            for (j = 0; j < this.cards.length; j++) {
                k = Math.floor(Math.random() * this.cards.length);
                temp = this.cards[j];
                this.cards[j] = this.cards[k];
                this.cards[k] = temp;
            }
        }
    },

    deal: function () {
        if (this.cards.length > 0)
            return this.cards.shift();
        else
            return null;
    },

    draw: function (n) {
        var card;
        if (n >= 0 && n < this.cards.length) {
            card = this.cards[n];
            this.cards.splice(n, 1);
        }
        else
            card = null;
        return card;
    },

    drawCard: function (name) {
        for (var i = 0; i < this.cardCount(); i++) {
            if (this.cards[i].name == name)
                return this.draw(i);
        }

    },

    addCard: function (card) {
        if (card instanceof Card)
            this.cards.push(card);
        else
            return false;
    },

    hasCard: function (name) {
        var hasCard = false;
        for (var i = 0; i < this.cardCount(); i++) {
            if (this.cards[i].name == name)
                return true;
        }
        return hasCard;
    },

    countCard: function (name) {
        var cardCount = 0;
        for (var i = 0; i < this.cardCount(); i++) {
            if (this.cards[i].name == name)
                cardCount++;
        }
        return cardCount;
    },

    combine: function (stack) {
        if (stack instanceof Stack) {
            this.cards = this.cards.concat(stack.cards);
            stack.cards = [];
        }
        else
            return false;
    },

    cardCount: function () {
        return this.cards.length;
    },

    getCard: function (i) {
        return (i < this.cardCount()) ?
            this.cards[i] :
            false;
    },

    removeCard: function (card) {
        var index = this.cards.indexOf(card);
        if (index != -1) {
            return this.cards.splice(index,1)[0];
        }
    },

    toString: function () {
        return JSON.stringify(this, null, 4);
    }

};


