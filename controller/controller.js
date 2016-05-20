var Controller = function(model, view){
    var me = this;

    me.model = model;
    me.view = view;

    me.currentPlayer = me.model.table.p1;
    me.selected = [];

};

// This is the code that ties the buttons in the GUI to the game model.

Controller.prototype = {

    //setup: function () {
    //    var me = this;
    //
    //    me.model.setup();
    //},

    // this is called when the take button is pressed
    take: function (marketCards, handCards) {
        var me = this;

        var goodsInHand = 0;
        for (var i = 0; i < handCards.length; i++) {
            // this was a bug that I fixed. originally I omitted the .name part on accident and I was able to have more than 7 goods.
            if (handCards[i].name != camel)
                goodsInHand++;
        }
        //console.log("goods in hand = " + goodsInHand);

        //take one card
        if (me.currentPlayer.hand.cardCount() < 7 && marketCards.length == 1 &&
            handCards.length == 0 && marketCards[0].name != camel){
            console.log("taken: " + marketCards[0].toString());
            var draw_card = me.model.table.drawPile.deal();
            var takeCard = me.model.table.market.removeCard(marketCards[0]);

            me.currentPlayer.hand.addCard(takeCard);
            me.model.table.market.addCard(draw_card);
            me.view.takeCardAnimation(takeCard,me.currentPlayer);
            me.view.drawCardAnimation(draw_card);

            console.log("market:" + me.model.table.market.toString());
            console.log("p1 Hand: " + me.currentPlayer.hand.toString());
            console.log("taken: " + takeCard.toString());
        }
        //exchange cards
        else if (handCards.length >= 2 && marketCards.length == handCards.length &&
            marketCards.length - goodsInHand + me.currentPlayer.hand.cardCount() <= 7) {
            //swap cards
            for (var i = 0; i < marketCards.length; i++){
                me.view.swapCardsAnimation(handCards[i],marketCards[i],me.currentPlayer);
                if (handCards[i].name != camel) {
                    this.currentPlayer.hand.addCard(this.model.table.market.removeCard(marketCards[i]));
                    this.model.table.market.addCard(this.currentPlayer.hand.removeCard(handCards[i]));
                }
                else {
                    this.currentPlayer.hand.addCard(this.model.table.market.removeCard(marketCards[i]));
                    this.model.table.market.addCard(this.currentPlayer.herd.removeCard(handCards[i]));
                }
                me.view.swapCardsAnimation(handCards[i],marketCards[i],me.currentPlayer);
            }
        }
        //get camel
        else if (handCards.length == 0 && marketCards.length > 0 && marketCards[0].name == camel){
            var drawCard;
            while (me.model.table.market.countCard(camel) > 0){
                var camel_card = me.model.table.market.drawCard(camel);
                drawCard = me.model.table.drawPile.deal();
                me.currentPlayer.herd.addCard(camel_card);
                me.model.table.market.addCard(drawCard);
                console.log(camel_card);
            }
            //me.currentPlayer.takeCamels();
            me.view.drawCardAnimation(drawCard);
            me.view.takeCamelsAnimation(me.currentPlayer);
        }
        else
            me.view.NoTradeAnimation();
        me.view.updateBoard();
    },

    // this is called when the sell button is pressed. It takes an array of cards that represent the selected hand cards
    sell: function (handCards) {
        var me = this;

        if (handCards.length > 0 && me.match(handCards[0],handCards)) {

            if (handCards[0].name == diamond || handCards[0].name == silver || handCards[0].name == gold){
                if (handCards.length >= 2){
                    me.takeSell(handCards)
                } else {
                    me.view.NoTradeAnimation();
                    return;
                }
            } else {
                me.takeSell(handCards);
                //var sells = 0;
                //for (var i = 0; i < handCards.length; i++) {
                //    me.model.table.discardPile.addCard(me.currentPlayer.hand.removeCard(handCards[i]));
                //    me.takeToken(handCards[0].name);
                //    sells++;
                //}
                //me.takeBonus(sells);
            }
            me.view.discardCardAnimation();
        }
        else
            me.view.NoTradeAnimation();
        me.view.updateBoard();
    },

    // these are all helper functions.
    match: function(card, hand){
        //see if they all match
        var match = true;
        for (var i = 1; i < hand.length; i++) {
            if (hand[i].name != card.name)
                return false;
        }
        return match;
    },

    //if a valid take action happened call animations in view and update the model,
    takeToken: function(token){
        //if undefined then don't do a take animation
        var player = (this.currentPlayer == this.model.table.p1)?1:2;
        if (token == bonus3)
            this.currentPlayer.tokens.add(this.model.table.bonus3.take());
        else if (token == bonus4)
            this.currentPlayer.tokens.add(this.model.table.bonus4.take());
        else if (token == bonus5)
            this.currentPlayer.tokens.add(this.model.table.bonus5.take());
        else
            this.model.table.goods.take(token,this.currentPlayer);
        this.view.takeTokenAnimation(token, player);
    },

    // if a valid sell action action happened call animations in view and update the model,
    takeSell: function(handCards){
        var me = this;
        var sells = 0;
        for (var i = 0; i < handCards.length; i++) {
            me.model.table.discardPile.addCard(me.currentPlayer.hand.removeCard(handCards[i]));
            me.takeToken(handCards[0].name);
            sells++;
        }

        //apply bonus for selling multiple cards
        if (sells == 3) me.takeToken(bonus3);
        else if (sells == 4) me.takeToken(bonus4);
        else if (sells >= 5) me.takeToken(bonus5);
    }

};
