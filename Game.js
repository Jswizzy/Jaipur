document.write('<script language="javascript" src="controller/controller.js"></script>');

//this is the game loop and the view for the game. Buttons hook into the controller and update the model.
//the game also tracks which cards are selected and passes them to the controller when take or sell is pressed.
//used the phaser example page to figure out how to do a lot of this

/**
 * The main view for the game and the game loop
 * @param game
 * @constructor
 */
BasicGame.Game = function (game) {
    var me = this;
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    me.cardWidth = 0;
    me.cardHeight = 0;

    me.tokenWidth = 0;
    me.tokenHeight = 0;

    me.model = new Model();
    me.controller = new Controller(me.model, this);

    //Keep track of the users score
    me.score1 = 0;
    me.scoreBuffer1 = 0;

    me.score2 = 0;
    me.scoreBuffer2 = 0;
};

BasicGame.Game.prototype = {

    /**
     * init the view for the game
     */
    create: function () {
        var me = this;

        //Get the dimensions of the cards we are using
        me.cardWidth = this.cache.getFrameData("sprites").getFrameByName("Cback").width;
        me.cardHeight = this.cache.getFrameData("sprites").getFrameByName("Cback").height;
        me.tokenWidth = this.cache.getFrameData("sprites").getFrameByName("Tgold").width;
        me.tokenHeight = this.cache.getFrameData("sprites").getFrameByName("Tgold").height;

        // create background
        me.add.sprite(0, 0, "table");
        me.draw = me.add.sprite(10,312,'sprites');
        me.discard = me.add.sprite(10,180,'sprites','Cback');
        me.discard.visible = false;


        // create buttons
        me.add.button(568, 530, "buttons", this.take, this, "takeN", "takeF", "takeF");
        me.add.button(658, 530, 'buttons', this.sell, this, "sellN", "sellF", "sellF");

        // set up the table
        //groups to store sprites
        me.market = me.game.add.group();
        me.p1Herd = me.game.add.group();
        me.p2Herd = me.game.add.group();
        me.p1Hand = me.game.add.group();
        me.p2Hand = me.game.add.group();
        me.tokensGroup = [];
        //cards remaining in deck text
        me.deckSizeText = me.createText(Math.floor(me.draw.x + me.cardWidth / 2),Math.floor(me.draw.y + me.cardHeight / 2),
            me.model.table.drawPile.cardCount(),"#428bca",45,"center",.5);
        console.log(me.model.table.p1.getRupees());
        me.scoreP1 = me.createText(115,570,"R:" + me.model.table.p1.getRupees(), "#d9534f", 8);
        me.scoreLabelTween1 = me.add.tween(me.scoreP1.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
        me.scoreP2 =  me.createText(115,30,"R:" + me.model.table.p2.getRupees(),"#d9534f", 8);
        me.scoreLabelTween2 = me.add.tween(me.scoreP2.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

        //me.controller.setup();
        this.initTable();

        //var debugCard = me.createCard(250,250,"Cgold");

    },

    /**
     * Factory for text
     * @param x, position where text is anchored
     * @param y, position where text is anchored
     * @param txt, text displayed
     * @param color, text color
     * @param size, font size
     * @param align, text alignment
     * @param anchor, where texted is positioned relative to x and y
     * @returns {*} phaser text object
     */
    createText:function(x,y,txt,color,size,align,anchor){
        var me = this;
        size = size || 15;
        anchor = anchor || 0.5;
        if (typeof align === 'undefined') align = "left";
        var text;
        var style = {font: "45px Arial Black", fill: color, fontWeight: 'bold'};
        text = me.add.text(x,y, txt, style);
        text.align = align;
        text.size = size;
        text.setShadow(3,3,"rgba(0,0,0,0.5)",2,true,false);
        text.stroke = 'de77ae';
        text.strokeThickness = 15;
        text.anchor.set(anchor);
        return text;
    },

    /**
     * called ever frame of the game, I updated the sprites with updateboard for the most part instead
     * because most things in the game are static and don't need to change every frame. Animates the score.
     */
    update: function () {
        var me = this;
        //score animation adapted from
        //http://www.joshmorony.com/creating-animated-scoring-in-an-html5-phaser-game/
        if(me.scoreBuffer1 > 0){
            me.score1 += 1;
            me.scoreP1.text = "R:" + me.score1;
            me.scoreBuffer1--;
        }
        if(me.scoreBuffer2 > 0){
            me.score2 += 1;
            me.scoreP2.text = "R:" + me.score2;
            me.scoreBuffer2--;
        }
    },

    createScoreAnimation: function(x, y, message, score, playerNumber){

        var me = this;

        var scoreFont = "60px Arial";

        //Create a new label for the score
        var scoreAnimation = me.game.add.text(x, y, message, {font: scoreFont, fill: "#ffffff", stroke: 'de77ae', strokeThickness: 15});
        scoreAnimation.anchor.setTo(0.5, 0.5);
        scoreAnimation.align = 'center';

        y = 540;
        x = 115;
        if (playerNumber == 2)
            y = 2;

        //Tween this score label to the total score label
        var scoreTween = me.game.add.tween(scoreAnimation).to({x: x, y: y}, 800, Phaser.Easing.Exponential.In, true);

        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            if (playerNumber == 1) {
                me.scoreLabelTween1.start();
                me.scoreBuffer1 += score;
            } else {
                me.scoreLabelTween2.start();
                me.scoreBuffer2 += score;
            }

        }, me);
    },

    /**
     * updates the view with model data, this whole section is a mess and could be refactored
     */
    updateBoard: function(){
        var me = this;
        var card;
        card = me.discard;
        if (me.model.table.discardPile.cardCount() > 0) {
            card.frameName = me.model.table.discardPile.getCard(me.model.table.discardPile.cards.length - 1).spriteName;
        }
        for (var i = 0; i < 5; i++){
            card = me.market.getAt(i);
            card.card = me.model.getMarketCardAt(i);
            card.frameName = card.card.spriteName;
        }
        for (var i = 0; i < 11; i++){
            card = me.p1Herd.getAt(i);
            card.card = me.model.table.p1.herd.getCard(i);
            if (i < me.model.table.p1.herd.cardCount()) {
                card.frameName = card.card.spriteName;
                card.visible = true;
            }
            else
                card.visible = false;
        }
        for (var i = 0; i < 11; i++){
            card = me.p2Herd.getAt(i);
            card.card = me.model.table.p2.herd.getCard(i);
            if (i < me.model.table.p2.herd.cardCount()) {
                card.frameName = card.card.spriteName;
                card.visible = true;
            }
            else
                card.visible = false;
        }
        for (var i = 0; i < 7; i++){
            card = me.p1Hand.getAt(i);
            card.card = me.model.table.p1.hand.getCard(i);
            if (i < me.model.table.p1.hand.cardCount()) {
                card.frameName = card.card.spriteName;
                card.visible = true;
            }
            else
                card.visible = false;
        }
        for (var i = 0; i < 7; i++){
            card = me.p2Hand.getAt(i);
            card.card = me.model.table.p2.hand.getCard(i);
            if (i < me.model.table.p2.hand.cardCount()) {
                //card.frameName = card.card.spriteName;
                card.frameName = "Cback";
                card.visible = true;
            }
            else
                card.visible = false;
        }
        me.deckSizeText.setText(me.model.table.drawPile.cardCount());

        me.updateScore();
    },

    updateScore: function(){
        var me = this;
        var scoreChangeP1 = me.model.table.p1.getRupees() - me.score1;
        var scoreChangeP2 = me.model.table.p2.getRupees() - me.score2;

        if (scoreChangeP1 > 0)
            me.createScoreAnimation(me.game.world.centerX, me.game.world.centerY, "+" + scoreChangeP1, scoreChangeP1, 1);
        if (scoreChangeP2 > 0)
            me.createScoreAnimation(me.game.world.centerX, me.game.world.centerY, "+" + scoreChangeP2, scoreChangeP2, 2);
        //me.scoreP1.setText("R:" + me.model.table.p1.getRupees());
        //me.scoreP2.setText("R:" + me.model.table.p2.getRupees());
    },

    //init all the sprites for the tokens and cards
    initTable: function () {
        var me = this;

        //cards
        me.initCards();
        //tokens
        me.initTokens();
        //score
        me.updateBoard();
    },

    initCards: function () {
        var me = this;
        //market
        me.initMarket();
        //herds
        me.initHerd();
        //hands
        me.initHands();
    },

    initMarket: function () {
        var me = this;

        var x = 105;
        var y = 245;

        for (var i = 0; i < 5; i++){
            var card = me.createCard(x, y, me.model.getMarketCardAt(i));
            me.market.add(card);
            x += me.cardWidth + 1;
            card.events.onInputDown.add(me.selectMarket, this);
        }
    },

    initHands: function () {
        var me = this;

        var x = 215;
        var y = 470;

        var playerHand = me.model.table.p1.hand;
        var card;
        for (var i = 0; i < 7; i++){
            card = me.createCard(x, y, playerHand.getCard(i));
            x += me.cardWidth - 45;
            card.events.onInputDown.add(me.selectHand, this);
            me.p1Hand.add(card);
        }
        x = 215;
        y = 10;
        playerHand = me.model.table.p2.hand;
        for (var i = 0; i < 7; i++){
            card = me.createCard(x, y, playerHand.getCard(i));
            x += me.cardWidth - 45;
            me.p2Hand.add(card);
        }
    },

    initHerd: function () {
        var me = this;

        var x = 25;
        var y = 450;

        var playerHand = me.model.table.p1.herd;
        var card;
        for (var i = 0; i < 11; i++){
            card = me.createCard(x, y, playerHand.getCard(i));
            x += me.cardWidth - 45;
            card.events.onInputDown.add(me.selectHand, this);
            me.p1Herd.add(card);
        }
        x = 25;
        y = 30;
        playerHand = me.model.table.p1.herd;
        for (var i = 0; i < 11; i++){
            card = me.createCard(x, y, playerHand.getCard(i));
            x += me.cardWidth - 45;
            me.p2Herd.add(card);
        }
    },

    initTokens: function () {
        var me = this;

        var x = 600;
        var y = 30;

        me.stacks = [me.model.table.bonus3,me.model.table.bonus4,me.model.table.bonus5
            ,me.model.table.goods.diamonds,me.model.table.goods.gold, me.model.table.goods.silver,
            me.model.table.goods.spice,me.model.table.goods.silk,me.model.table.goods.leather];
        for (var i = 0; i < me.stacks.length; i++){
            if (i <= 2) {
                me.initTokenBonusStack(x, y, me.stacks[i]);
                x += Math.floor(me.tokenWidth);
            }
            else
                x = 720;
            if (i > 2) {
                y += me.tokenHeight + 5;
                me.initTokenGoodStack(x, y, me.stacks[i]);
            }
        }
    },

    initTokenGoodStack: function(x,y,tokenStack){
        var me = this;

        var tokenArray = [];
        var count = tokenStack.tokenCount();
        var token;
          for (var i = count - 1; i >= 0; i--){
              token = me.createToken(x,y, tokenStack.tokens[i]);
              x -= me.tokenWidth / 5;
              tokenArray.push(token);
              //console.log(token.token.toString());
          }
        me.tokensGroup.push(tokenArray);
        //console.log(tokenArray);
    },

    initTokenBonusStack: function(x,y,tokenStack){
        var me = this;

        var tokenArray = [];
        var count = tokenStack.tokenCount();
        var token;
        for (var i = count - 1; i >= 0; i--){
            token = me.createToken(x,y, tokenStack.tokens[i]);
            //x -= me.tokenWidth / 5;
            tokenArray.push(token);
            y -= 2;
            //console.log(token.token.toString());
        }
        me.tokensGroup.push(tokenArray);
    },

    //draws a card sprite
    createCard: function (x, y, cardModel) {
        var me = this;

        var card = this.add.sprite(x, y, "sprites", cardModel.spriteName);
        card.inputEnabled = true;
        //card.input.enableDrag(true);  //cool but makes selecting cards annoying
        card.events.onDragStop.add(me.fixLocation);
        card.savedX = card.x;
        card.savedY = card.y;
        card.card = cardModel;
        //card.visible = true;
        card.selected = false;
        this.add.tween(card).from({y: 312, x: 10}, 320, Phaser.Easing.Linear.In, true);
        return card;
    },

    //creates a token sprite
    createToken: function (x,y, tokenModel) {
        var me = this;

        var token = me.add.sprite(x, y, "sprites", tokenModel.spriteName);
        token.token = tokenModel;
        this.add.tween(token).from({y: 0, x: 0}, 320, Phaser.Easing.Linear.In, true);

        return token;
    },

    //animation and logic for selecting a market card
    selectMarket: function(card) {
        var me = this;
        // if selected deselect and if camel deselect all camels
        if (card.selected && card.card.name == camel){
            me.market.forEach(function(item){
                if (item.card.name == camel){
                    item.alpha = 1.0;
                    item.selected = false;
                }
            })
        } else if (card.selected) {
            card.alpha = 1.0;
            card.selected = false;
            //else selectMarket card and if good deselect all camels, if camel deselect all goods and selectMarket all camels
        } else if (card.card.name == camel) {
            me.market.forEach(function(item){
                if (item.card.name == camel){
                    item.alpha = 0.8;
                    item.selected = true;
                } else {
                    item.alpha = 1;
                    item.selected = false;
                }
            })
        } else {
            card.alpha = 0.8;
            card.selected = true;
            me.market.forEach(function(item){
                if (item.card.name == camel){
                    item.alpha = 1.0;
                    item.selected = false;
                }
            });
        }
    },

    //animation and logic for selected a hand card
    selectHand: function(sprite) {
        if (sprite.selected){
            sprite.selected = false;
            this.add.tween(sprite).to({y: sprite.savedY}, 200, Phaser.Easing.Linear.None, true);
        }
        else {
            sprite.selected = true;
            this.add.tween(sprite).to({y: sprite.savedY -45}, 200, Phaser.Easing.Linear.None, true);
        }
    },

    //Animation only stuff, do if time
    drawCardAnimation: function () {
        //console.log("draw: ");
        this.add.tween(this.market.getAt(4)).from({y: 312, x: 10}, 220, Phaser.Easing.Linear.In, true);
    },

    swapCardsAnimation: function (card1,card2,player) {
        console.log("swap: ");
        var me = this;
        //move the selected market card to the current player hand
    },

    // place a card in player hand
    takeCardAnimation: function (card,player) {
        var me = this;
        //move the selected market card to the current player hand
        var hand = (player === me.model.table.p1)?me.p1Hand:me.p2Hand;
        var x = 0;
        var y = 0;
        for (var i = 0; i < 5 ;i++){
            if (me.market.getAt(i).selected){
                x = me.market.getAt(i).x;
                y = me.market.getAt(i).y;
            }
        }
        this.add.tween(hand.getAt(player.hand.cardCount()-1 || 0)).from({
            y: y,
            x: x},
            80, Phaser.Easing.Linear.In, true);
    },

    takeCamelsAnimation: function (player) {
        var me = this;
        //move the selected market card to the current player hand
    },

    discardCardAnimation: function () {
        this.discard.visible = true;
    },

    NoTradeAnimation: function () {
        //play a sound or something
    },

    //animate a token being taken
    takeTokenAnimation:function(token, player){
        // I would not do this this way on a redesign but this was a learning process and I wrote to much at this point
        console.log("Take token from stack of " + token);
        var tokenArray;
        switch (token) {
            case bonus3:
                tokenArray = this.tokensGroup[0];
                break;
            case bonus4:
                tokenArray = this.tokensGroup[1];
                break;
            case bonus5:
                tokenArray = this.tokensGroup[2];
                break;
            case diamond:
                tokenArray = this.tokensGroup[3];
                break;
            case gold:
                tokenArray = this.tokensGroup[4];
                break;
            case silver:
                tokenArray = this.tokensGroup[5];
                break;
            case silk:
                tokenArray = this.tokensGroup[6];
                break;
            case spice:
                tokenArray = this.tokensGroup[7];
                break;
            case leather:
                tokenArray = this.tokensGroup[8];
                break;
            default:
        }
        var sprite = null;

        for (var i = tokenArray.length - 1; i >= 0; i--){
            if (tokenArray[i].visible == true){
                sprite = tokenArray[i];
                sprite.visible = false;
                break;
            }
        }
    },

    // end of animation stuff

    //called when take is pressed
    take: function () {
        var me = this;

        this.controller.take(me.getMarketSelection(),me.getHandSelection());
        me.clearSelection();
    },

    //called when sell is pressed
    sell: function () {
        var me = this;

        this.controller.sell(me.getHandSelection());
        me.clearSelection();
    },

    //get the cards in the players hand that are selected
    getHandSelection: function(){
        var me = this;

        var hand_cards = [];
        for (var i = 0; i < 7 ;i++){
            if (me.p1Hand.getAt(i).selected){
                hand_cards.push(me.p1Hand.getAt(i).card);
            }
        }
        for (var i = 0; i < 11 ;i++){
            if (me.p1Herd.getAt(i).selected){
                hand_cards.push(me.p1Herd.getAt(i).card);
            }
        }
        return hand_cards;
    },

    //get the cards in market that are selected
    getMarketSelection: function(){
        var me = this;

        var market_cards = [];
        for (var i = 0; i < 5 ;i++){
            if (me.market.getAt(i).selected){
                market_cards.push(me.market.getAt(i).card);
            }
        }
        return market_cards;
    },

    /**
     * clears the cards that are selected
     */
    clearSelection: function(){
        var me = this;

        me.market.forEach(function(item){
            item.alpha = 1;
            item.selected = false;
        });
        me.p1Hand.forEach(function(item){
            item.selected = false;
            me.add.tween(item).to({y: item.savedY}, 100, Phaser.Easing.Linear.None, true);
        });
        me.p1Herd.forEach(function(item){
            item.selected = false;
            me.add.tween(item).to({y: item.savedY}, 100, Phaser.Easing.Linear.None, true);
        });
    },

    //this was code that allowed cards to be dragged around, it worked but made selected cards a choir since a drag
    //action could call the select methods multiple times
    fixLocation: function (card) {
        card.x = card.savedX;
        card.y = card.savedY;
    },

    /**
     * exits game
     * @param pointer
     */
    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
