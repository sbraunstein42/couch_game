import { Sprite } from "../helpers/sprite.js";
import { HoppingSprite } from "../helpers/hoppingSprite.js";
import { Person } from "../helpers/person.js";

export class Game {

    //boilerplate
    context; 

    //sprites
    thingsYouCanSitOn;
    people;
    couch;
    japaneseStar;
    youWinAnim;

    //sizes
    sittableWidth;
    sittableHeight;
    peopleWidth;
    peopleHeight;

    //determined later
    positionsOnCouch;
    positionsBelowCouch;

    //state
    howManyPeopleSatDown = 0;
    tweens = [];
    sprites = [];
    personPositionIndex;
    itemsByIndex;

    isWaitingForSit = false;

    //layers
    renderOrders = {
        background : 0,
        behindCouch : 5,
        couch : 10,
        youWinAnim : 15,
        sittingOnCouch : 20,
        itemOnCouch : 30,
        inFrontOfCouch : 40
    }


    constructor(context) {
        this.context = context;
        this.update = this.update.bind(this);
        this.enter = this.enter.bind(this);
        this.gameRoutine = this.gameRoutine.bind(this);
        this.onPlayerRequestedSit = this.onPlayerRequestedSit.bind(this);
        this.shiftItemsRoutine = this.shiftItemsRoutine.bind(this);
        this.shiftPeopleRoutine = this.shiftPersonRoutine.bind(this);
        this.sortSprites = this.sortSprites.bind(this);
        this.pitchMusic = this.pitchMusic.bind(this);
    }

    enter() {
        this.thingsYouCanSitOn = [];
        this.people = [];
        this.positionsOnCouch = [];
        this.positionsBelowCouch = [];


        if(!this.context.model.music) {
            this.context.model.playTitleMusic();
        }

        const sittableIds = this.context.model.getRandomSittables(this.context.model.howManyThingsOnCouch);
        for(let i = 0; i < sittableIds.length; i++) {
            let id = sittableIds[i];
            let sprite = new HoppingSprite(this.context, id, this.context.model.spriteScale);
            // sprite.showBounds = true;
            sprite.setPosition(this.context.canvas.width/2, -100);
            sprite.renderOrder = this.renderOrders.itemOnCouch;
            this.thingsYouCanSitOn.push(sprite);
            this.sprites.push(sprite);
        }

        this.sittableWidth = this.thingsYouCanSitOn[0].width;
        this.sittableHeight = this.thingsYouCanSitOn[0].height;

        const couchId = this.context.model.getRandomCouch();
        this.couch = new Sprite(this.context, couchId, this.context.model.spriteScale)
        this.couch.renderOrder = this.renderOrders.couch;
        this.sprites.push(this.couch);
        // this.couch.showBounds = true;
        
        const peopleIds = this.context.model.getRandomPeople(this.context.model.howManyContestants);
        for(let i = 0; i < peopleIds.length; i++) {
            let id = peopleIds[i];
            let sprite = new Person(this.context, id, this.context.model.spriteScale);
            sprite.renderOrder = this.renderOrders.inFrontOfCouch;
            // sprite.showBounds = true;
            this.people.push(sprite);
            this.sprites.push(sprite);
        }

        this.peopleWidth = this.people[0].width;
        this.peopleHeight = this.people[0].height;

        let middleX = this.context.canvas.width /2;
        let middleY = this.context.canvas.height /2;
        this.couch.setPosition(middleX, middleY);

        let couchBounds = this.couch.getBounds();
        let onCouchY = couchBounds.y.max - (this.couch.height * .5) - (this.sittableHeight * .5)
        let sittableGap = this.context.model.spriteScale * 12.25;
        let currX = this.couch.x + (this.context.model.spriteScale * 1);

        for(let i = 0; i < this.context.model.howManySpotsOnCouch; i++) {
            currX += sittableGap;
            this.positionsOnCouch.push({x : currX, y:onCouchY});
            this.positionsBelowCouch.push({x : currX, y : onCouchY + 100})
        }

        document.addEventListener("click", this.onPlayerRequestedSit)

        this.context.model.music?.volume(0.75);

        this.sortSprites();
        this.gameRoutine();

        
    }

    onPlayerRequestedSit() {
        this.isWaitingForSit = false;
    }

    async shiftItemsRoutine(sec) {
        let shifts = 0;

        let emptyPositionsOnCouch = this.positionsOnCouch.filter((x, i) => {
            return this.context.model.isCouchSpotEmpty(i);
        });

        let hopHeight = -30;

        if(emptyPositionsOnCouch.length == 1) {
            hopHeight = -100;
            let behindPos = {
                x: emptyPositionsOnCouch[0].x,
                y: emptyPositionsOnCouch[0].y,
                isBehind : true,
            }
            emptyPositionsOnCouch.push(behindPos)
        }

        while(this.isWaitingForSit) {
            //remove filled positions
            
            if(emptyPositionsOnCouch.length < this.thingsYouCanSitOn.length) {
                throw new Error("Too many items, not enfough spaces?");
            }
            this.itemsByIndex = {};

           
            for(let j = 0; j < this.thingsYouCanSitOn.length; j++) {
                let thing = this.thingsYouCanSitOn[j];
                let posOnCouchIndex = (j + shifts) % emptyPositionsOnCouch.length;
                this.itemsByIndex[posOnCouchIndex] = thing.currentImage.id;
                let posOnCouch = emptyPositionsOnCouch[posOnCouchIndex];
                let hopTime = sec * .75;
                thing.hopHeight = hopHeight;
                thing.hopTo(posOnCouch.x, posOnCouch.y, hopTime, 1);
                setTimeout(() => {
                    let order = posOnCouch.isBehind ? this.renderOrders.behindCouch : this.renderOrders.itemOnCouch;
                    let changedOrder = order !== thing.renderOrder;
                    thing.renderOrder = order;
                    if(changedOrder) {
                        this.sortSprites();
                    }
                }, hopTime * .5);
            }

            await this.context.toolbox.waitForMS(sec * this.context.model.itemMoveDelayMult);
            shifts++;
        }

    }

    async shiftPersonRoutine(person, sec) {
            
        let shifts = 0;

        while(this.isWaitingForSit) {

            //remove filled positions
            let emptyIndexes = [];
            for(let i = 0; i < this.context.model.howManySpotsOnCouch; i++) {
                if(this.context.model.isCouchSpotEmpty(i)) {
                    emptyIndexes.push(i);
                }
            }

            let indexInEmptyArray = (emptyIndexes.length-1) - (shifts % emptyIndexes.length);
            this.personPositionIndex = emptyIndexes[indexInEmptyArray];
            let posBelowCouch = this.positionsBelowCouch[this.personPositionIndex];
            person.hopTo(posBelowCouch.x, posBelowCouch.y, sec * .25, 1);

            await this.context.toolbox.waitForMS(sec);
            shifts++;
        }
    }

    async gameRoutine() {

        let sec = 1000;
        let secDecay = .75;
        let spotlightX = this.context.canvas.width/2;
        let spotlightY = this.context.canvas.height * .7;
        let peopleGap = this.context.model.spriteScale * 15;
        let peopleWaitingY = this.context.canvas.height - (this.peopleHeight * .6);
        
        this.context.model.playSound("ready", 1);

        //people get into waiting position
        for(let i = 0; i < this.people.length; i++) {
            let startX = this.peopleWidth - ((i + 1) * peopleGap) + this.context.canvas.width/2;
            let offset = this.context.toolbox.getRandomInRange(200, 500);
            this.people[i].setPosition(startX - offset, peopleWaitingY);
            this.people[i].hopTo(startX, peopleWaitingY, sec * 2, 10);
        }
        await this.context.toolbox.waitForMS(sec * 2);

        //let people sit one by one
        for(let i = 0; i < this.people.length; i++) {

            //person gets in front of the couch
            let person = this.people[i];
            if (i > 0) this.context.model.restartMusic();
            person.hopTo(spotlightX, spotlightY, sec, 7);

            await this.context.toolbox.waitForMS(sec);

            //rotate items through couch positions
            this.isWaitingForSit = true;
            this.shiftPersonRoutine(person, sec);
            this.shiftItemsRoutine(sec * .5);
            
            while(this.isWaitingForSit) {
                await this.context.toolbox.waitForMS(100);
            }

            let onCouchPos = this.positionsOnCouch[this.personPositionIndex];

            //cause player to sit!
            
            let idOfItemThatWasSatOn = this.itemsByIndex[this.personPositionIndex];

            const sitDown = async (sitDownDurationMS) => {
                person.hopTo(onCouchPos.x, onCouchPos.y, sitDownDurationMS, 4);
                this.context.model.setPersonInCouchIndex(this.personPositionIndex, person.currentImage.id);
                await this.context.toolbox.waitForMS(sitDownDurationMS);
                person.renderOrder = this.renderOrders.sittingOnCouch;
                this.sortSprites();
            }

            console.log("ON SAT DOWN....")
            console.log(this.personPositionIndex + " for person");
            console.log("ITEMS BY INDEX:")
            console.log(this.itemsByIndex);
            console.log(idOfItemThatWasSatOn)

            if(idOfItemThatWasSatOn) {
                let itemSatOn = this.thingsYouCanSitOn.find(x => x.currentImage.id == idOfItemThatWasSatOn)
                await this.pitchMusic(0, sec);
                let r = Math.random();
                let reactionSound = undefined;
                if(r > .7) {
                    reactionSound = this.context.model.playSound("ohno", 4);
                } else if(r > .6) {
                    reactionSound = this.context.model.playSound("whoops", 1);
                } else if(r > .4) {
                    reactionSound = this.context.model.playSound("ooh", 2);
                } else {
                    reactionSound = this.context.model.playSound("inhale", 2);
                }

                sitDown(sec);
                await this.context.toolbox.waitForMS(sec * 2);

                this.context.model.playSound("fart", 3);
                await this.context.toolbox.waitForMS(sec * .8);
                await this.pitchMusic(1, sec * 1.5);

            } else {
                this.context.model.playSound("ahh", 2);
                await sitDown(sec * .5);
            }

            //faster next
            sec *= secDecay;
        }

        //wait for it to resolve
        await this.context.toolbox.waitForMS(1000);

        let middleX = this.context.canvas.width /2;
        let middleY = this.context.canvas.height /2;

        //show sf2 e honda win effect
        this.japaneseStar = new Sprite(this.context, "japaneseStar2", this.context.model.spriteScale)
        this.japaneseStar.renderOrder = this.renderOrders.background;
        this.japaneseStar.setPosition(middleX, middleY);
        this.sprites.push(this.japaneseStar);
        this.sortSprites();
        this.japaneseStar.play(this.context.model.japaneseStarAnim, 5, -1);

        //show you win
        let winAnimIds = this.context.model.youWinAnim;
        this.youWinAnim = new Sprite(this.context, winAnimIds[0], this.context.model.spriteScale)
        this.youWinAnim.renderOrder = this.renderOrders.youWinAnim;
        this.youWinAnim.setPosition(middleX, middleY);
        this.sprites.push(this.youWinAnim);
        this.sortSprites();
        this.context.model.playSound("yay", 2);
        let youWinIntroTime = this.youWinAnim.play(winAnimIds, 4, 1);
        await this.context.toolbox.waitForMS(youWinIntroTime);
        this.youWinAnim.play(this.context.model.youWinWiggleAnim, 6, -1);

    }

    sortSprites() {
        this.sprites.sort((a, b) => a.renderOrder - b.renderOrder);
    }

    update() {
        for(let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw();
        }
    }

    exit() {
        for(let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].stop();
        }
        document.removeEventListener("click", this.onPlayerRequestedSit)
    }


    async pitchMusic(newPitch, duration) {
        let music = this.context.model.music;
        let musicId = this.context.model.musicId;
        if (!music || !music.playing(musicId)) return;

        let currentPitch = music.rate();
        const intervalMS = 30;
        const steps = duration / intervalMS;
        const rateStep = (newPitch - currentPitch) / steps;

        for(let i = 0; i < steps; i++) {
            await this.context.toolbox.waitForMS(intervalMS);
            currentPitch += rateStep;
            music.rate(currentPitch, musicId);
        }

        music.rate(currentPitch, musicId);
    }
   


}