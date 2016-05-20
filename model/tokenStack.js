// this is pretty much just a stack. I should of used inheritance here I wasn't sure how to do that without breaking my
// code
var TokenStack = function () {
    // create an empty array of cards
    this.tokens = [];
};

TokenStack.prototype = {
    constructor: TokenStack,

    setup: function (type, name) {
        for (var i = 0; i < type.length; i++) {
            for (var j = 0; j < type[i].count; j++) {
                if (type[i].name == name)
                    this.tokens.push(new Token(type[i].name, type[i].value, type[i].sprite));
            }
        }
    },
    //shift returns value and undefined if length is 0;
    take: function () {
        return this.tokens.shift();
    },

    add: function (token) {
        this.tokens.push(token);
    },

    shuffle: function (n) {
        var i, j, k, temp;
        for (i = 0; i < n; i++) {
            for (j = 0; j < this.tokens.length; j++) {
                k = Math.floor(Math.random() * this.tokens.length);
                temp = this.tokens[j];
                this.tokens[j] = this.tokens[k];
                this.tokens[k] = temp;
            }
        }
    },

    combine: function (stack) {
        if (stack instanceof TokenStack) {
            this.tokens = this.tokens.concat(stack.tokens);
            stack.tokens = [];
        }
        else
            return false;
    },

    tokenCount: function () {
        var total = 0;
        for (var i = 0; i < this.tokens.length; i++) {
            total++;
        }
        return total;
    },

    isEmpty: function () {
        return this.tokenCount() == 0;
    },

    value: function () {
        var total = 0;
        for (var i = 0; i < this.tokens.length; i++) {
            total += this.tokens[i].value;
        }
        return total;
    },

    toString: function () {
        //return JSON.stringify(this);
        return "Stack[" + this.tokens.join(",") + "]";
    }

};
