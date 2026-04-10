import { Sprite } from "../helpers/sprite.js";
import { HoppingSprite } from "../helpers/hoppingSprite.js";
import { Person } from "../helpers/person.js";
import * as TWEEN from "../helpers/tween.esm.js";

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
    personPositionIndex;
    itemsByIndex;

    isWaitingForSit = false;
    isWaitingForRestart = false;

    presentationLabel = null;
    presentationLabelY = 0;
    pendingPresentation = null;

    //layers
    renderOrders = {
        background : 0,
        behindCouch : 5,
        couch : 10,
        youWinAnim : 15,
        sittingOnCouch : 20,
        itemOnCouch : 30,
        inFrontOfCouch : 40,
        pieces : 50
    }


    constructor(context) {
        this.context = context;
        this.update = this.update.bind(this);
        this.enter = this.enter.bind(this);
        this.gameRoutine = this.gameRoutine.bind(this);
        this.onPlayerRequestedSit = this.onPlayerRequestedSit.bind(this);
        this.shiftItemsRoutine = this.shiftItemsRoutine.bind(this);
        this.shiftPeopleRoutine = this.shiftPeopleRoutine.bind(this);
        this.sortSprites = this.sortSprites.bind(this);
        this.pitchMusic = this.pitchMusic.bind(this);
        this.goToTitle = this.goToTitle.bind(this);
        this.onPlayerRequestedSitOnKey = this.onPlayerRequestedSitOnKey.bind(this);
        this.goToTitleOnKey = this.goToTitleOnKey.bind(this);
    }

    enter() {
        this.thingsYouCanSitOn = [];
        this.people = [];
        this.positionsOnCouch = [];
        this.positionsBelowCouch = [];
        this.sprites = [];

        this.isWaitingForSit = false;

        for(let i = 0; i < this.context.model.howManySpotsOnCouch; i++) {
            this.context.model.peopleOnCouch[i] = this.context.model.empty;
        }

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
            sprite.mute = true;
            this.thingsYouCanSitOn.push(sprite);
            this.sprites.push(sprite);
        }

        this.sittableWidth = this.thingsYouCanSitOn[0].width;
        this.sittableHeight = this.thingsYouCanSitOn[0].height;

        const couchId = this.context.model.getNextCouch();
        this.couch = new Sprite(this.context, couchId, this.context.model.spriteScale)
        this.couch.renderOrder = this.renderOrders.couch;
        this.sprites.push(this.couch);
        // this.couch.showBounds = true;
        
        const peopleIds = this.context.model.getRandomPeople(this.context.model.howManyContestants);
        for(let i = 0; i < peopleIds.length; i++) {
            let id = peopleIds[i];
            let sprite = new Person(this.context, id, this.context.model.spriteScale);
            sprite.setAnimations(id);
            sprite.setIdle();
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

        document.addEventListener("click", this.onPlayerRequestedSit);
        document.addEventListener("keydown", this.onPlayerRequestedSitOnKey);

        this.context.model.makeMusicQuiet();

        this.sortSprites();
        this.gameRoutine();

        
    }

    onPlayerRequestedSit() {
        this.isWaitingForSit = false;
    }

    onPlayerRequestedSitOnKey(e) {
        if (e.key.toLowerCase() === this.context.model.actionKey.toLowerCase()) this.onPlayerRequestedSit();
    }

    async shiftItemsRoutine(sec) {
        let shifts = 0;

        let emptyIndexes = this.context.model.getEmptyIndexes();
        let emptyPositionsOnCouch = emptyIndexes.map(x => this.positionsOnCouch[x]);

        let hopHeight = -30;
        let isLastSpot = false;


        if(emptyPositionsOnCouch.length == 1) {
            hopHeight = -100;
            isLastSpot = true;
        }

        while(this.isWaitingForSit) {
            this.itemsByIndex = [];

            for(let j = 0; j < this.thingsYouCanSitOn.length; j++) {
                let thing = this.thingsYouCanSitOn[j];
                let posInEmptyArray = (j + shifts) % emptyIndexes.length;
                let posOnCouchIndex = emptyIndexes[posInEmptyArray];

                let isGoingBehindCouch = isLastSpot && (shifts % 2 == 1);

                this.itemsByIndex[posOnCouchIndex] = thing.currentImage.id;
                let posOnCouch = emptyPositionsOnCouch[posInEmptyArray];
                let hopTime = sec * .5;
                thing.hopHeight = hopHeight;
                thing.hopTo(posOnCouch.x, posOnCouch.y, hopTime, 1);
                setTimeout(() => {
                    let order = isGoingBehindCouch ? this.renderOrders.behindCouch : this.renderOrders.itemOnCouch;
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

    async shiftPeopleRoutine(person, sec) {
            
        let shifts = 0;

        while(this.isWaitingForSit) {

            //remove filled positions
            let emptyIndexes = this.context.model.getEmptyIndexes();
            let indexInEmptyArray = (emptyIndexes.length-1) - (shifts % emptyIndexes.length);
            this.personPositionIndex = emptyIndexes[indexInEmptyArray];
            let posBelowCouch = this.positionsBelowCouch[this.personPositionIndex];
            let xOffset = 0;
            if(emptyIndexes.length == 1) {
                xOffset = 40;
            }
            person.hopTo(posBelowCouch.x + xOffset, posBelowCouch.y, sec * .25, 1);

            await this.context.toolbox.waitForMS(sec);
            shifts++;
        }
    }

    async gameRoutine() {

        let sec = 1000;
        let shiftDurationMult = 1;
        let shiftDurationDecay = .75;
        let spotlightX = this.context.canvas.width/2;
        let spotlightY = this.context.canvas.height * .7;
        let peopleGap = this.context.model.spriteScale * 15;
        let peopleWaitingY = this.context.canvas.height - (this.peopleHeight * .6);
        
        this.pendingPresentation = this.thingsYouCanSitOn[0];

        this.context.model.playRandomSound("ready", 1);

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
            person.setThink();

            if (this.pendingPresentation) {
                await this.presentSittable(this.pendingPresentation);
                this.pendingPresentation = null;
            }

            //rotate items through couch positions
            this.isWaitingForSit = true;
            this.shiftPeopleRoutine(person, sec * shiftDurationMult);
            this.shiftItemsRoutine(sec * .5 * shiftDurationMult);
            
            while(this.isWaitingForSit) {
                await this.context.toolbox.waitForMS(10);
            }

            let onCouchPos = this.positionsOnCouch[this.personPositionIndex];

            //cause player to sit!
            
            let idOfItemThatWasSatOn = this.itemsByIndex[this.personPositionIndex];

            const sitDown = async (sitDownDurationMS) => {
                person.hopTo(onCouchPos.x, onCouchPos.y, sitDownDurationMS, 4);
                this.context.model.setPersonInCouchIndex(this.personPositionIndex, person.currentImage.id);
                await this.context.toolbox.waitForMS(sitDownDurationMS);
                person.setSit();
                person.renderOrder = this.renderOrders.sittingOnCouch;
                this.sortSprites();
            }

            if(idOfItemThatWasSatOn) {
                let itemSatOn = this.thingsYouCanSitOn.find(x => x.currentImage.id == idOfItemThatWasSatOn)
                await this.pitchMusic(0, sec * 1.25);
                let r = Math.random();
                let reactionSound = undefined;
                if(r > .5) {
                    reactionSound = this.context.model.playRandomSound("ohno", 4);
                } else if(r > .3) {
                    reactionSound = this.context.model.playRandomSound("whoops", 1);
                } else {
                    reactionSound = this.context.model.playRandomSound("inhale", 2);
                }

                sitDown(sec);
                //awkward pause
                await this.context.toolbox.waitForMS(sec * 2.5);

                itemSatOn.shake(10, sec * 2);
                person.setSurprise();
                person.shake(8, sec * 2);
                this.explodeSittable(itemSatOn);
                const newSprite = this.replaceExplodedSittable(itemSatOn);
                this.context.model.playSittableSound(idOfItemThatWasSatOn);
                await this.context.toolbox.waitForMS(sec * 2);
                person.setSit();
                await this.pitchMusic(1, sec * 2);
                this.pendingPresentation = newSprite;

            } else {
                if(Math.random() > .5) {
                    this.context.model.playRandomSound("ooh", 2);
                } else {
                    this.context.model.playRandomSound("ahh", 2);
                }
                await sitDown(sec * .5);
            }

            //faster next
            shiftDurationMult *= shiftDurationDecay;
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
        this.context.model.playRandomSound("yay", 2);
        let youWinIntroTime = this.youWinAnim.play(winAnimIds, 4, 1);
        await this.context.toolbox.waitForMS(youWinIntroTime);
        this.youWinAnim.play(this.context.model.youWinWiggleAnim, 6, -1);

        await this.context.toolbox.waitForMS(2000);

        document.addEventListener("click", this.goToTitle);
        document.addEventListener("keydown", this.goToTitleOnKey);
    }

    goToTitle() {
        document.removeEventListener("click", this.goToTitle);
        document.removeEventListener("keydown", this.goToTitleOnKey);
        this.command = "title";
    }

    goToTitleOnKey(e) {
        if (e.key.toLowerCase() === this.context.model.actionKey.toLowerCase()) this.goToTitle();
    }

    sortSprites() {
        this.sprites.sort((a, b) => a.renderOrder - b.renderOrder);
    }

    update() {
        for(let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw();
        }
        if (this.presentationLabel) this.drawPresentationLabel();
        return this.command;
    }

    drawPresentationLabel() {
        const pencil = this.context.pencil;
        const x = this.context.canvas.width / 2;
        pencil.save();
        pencil.font = "28px 'Press Start 2P'";
        pencil.textAlign = "center";
        pencil.textBaseline = "top";
        pencil.lineWidth = 6;
        pencil.strokeStyle = "#000000";
        pencil.fillStyle = "#ffffff";
        pencil.strokeText(this.presentationLabel, x, this.presentationLabelY);
        pencil.fillText(this.presentationLabel, x, this.presentationLabelY);
        pencil.restore();
    }

    exit() {
        //stop all the sprites, we're out of here
        for(let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].stop();
        }
        this.sprites = [];
        document.removeEventListener("click", this.onPlayerRequestedSit);
        document.removeEventListener("keydown", this.onPlayerRequestedSitOnKey);
        this.context.model.stopTitleMusic();
    }


    async presentSittable(sprite) {
        const name = this.context.model.sittableNames[sprite.currentImage.id];
        if (!name) return;

        const presentX = this.context.canvas.width / 2;
        const presentY = this.context.canvas.height * 0.22;
        sprite.setPosition(presentX, presentY);

        this.presentationLabel = name;
        this.presentationLabelY = presentY + sprite.height * 0.6 + 20;
        this.context.model.playSound(['audio/presentItem.wav']);

        await this.context.toolbox.waitForMS(1800);

        this.presentationLabel = null;
    }

    replaceExplodedSittable(explodedSittable) {
        this.sprites = this.sprites.filter(s => s !== explodedSittable);

        const newId = this.context.model.sittables.take();
        const newSprite = new HoppingSprite(this.context, newId, this.context.model.spriteScale);
        newSprite.setPosition(this.context.canvas.width / 2, -100);
        newSprite.renderOrder = this.renderOrders.itemOnCouch;
        newSprite.mute = true;

        const index = this.thingsYouCanSitOn.indexOf(explodedSittable);
        this.thingsYouCanSitOn[index] = newSprite;

        this.sprites.push(newSprite);
        this.sortSprites();
        return newSprite;
    }

    explodeSittable(sittable) {
        const pieceIds = this.context.model.getPiecesFor(sittable.currentImage.id);
        if (!pieceIds) return;

        sittable.alpha = 0;

        const cx = sittable.x + sittable.width / 2;
        const cy = sittable.y + sittable.height / 2;
        const durationMS = 1400;
        const gravityPxPerSec2 = 600;
        const fadeStartPhase = 0.5;

        pieceIds.forEach((id, i) => {
            const piece = new Sprite(this.context, id, this.context.model.spriteScale);
            piece.setPivot(0.5, 0.5);
            piece.setPosition(cx, cy);
            piece.renderOrder = this.renderOrders.pieces;
            this.sprites.push(piece);
            this.sortSprites();

            const angle = (Math.PI * 2 / pieceIds.length) * i + (Math.random() - 0.5) * 0.6;
            const speed = this.context.toolbox.getRandomInRange(100, 300);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 250; // bias upward
            const targetRotation = (Math.random() - 0.5) * Math.PI * 0.6;
            const startX = piece.x;
            const startY = piece.y;

            const state = { phase: 0 };
            this.context.tweens.push(new TWEEN.Tween(state)
                .to({ phase: 1 }, durationMS)
                .onUpdate(() => {
                    const t = state.phase * (durationMS / 1000);
                    piece.x = startX + vx * t;
                    piece.y = startY + vy * t + 0.5 * gravityPxPerSec2 * t * t;
                    piece.rotation = targetRotation * state.phase;
                    piece.alpha = state.phase < fadeStartPhase ? 1 : 1 - ((state.phase - fadeStartPhase) / (1 - fadeStartPhase));
                })
                .onComplete(() => {
                    this.sprites = this.sprites.filter(s => s !== piece);
                })
                .start()
            );
        });
    }

    async pitchMusic(newPitch, duration) {
        let music = this.context.model.music;
        let musicId = this.context.model.musicId;
        if (!music || !music.playing(musicId)) return;

        let currentPitch = music.rate(musicId);
        const intervalMS = 50;
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