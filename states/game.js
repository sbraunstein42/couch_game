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
    isSitRequested = false;
    tweens = [];
    sprites = [];

    //layers
    renderOrders = {
        behindCouch : 0,
        couch : 10,
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
    }

    enter() {
        this.thingsYouCanSitOn = [];
        this.people = [];
        this.positionsOnCouch = [];
        this.positionsBelowCouch = [];

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

        this.sortSprites();
        this.gameRoutine();

        
    }

    onPlayerRequestedSit() {
        this.isSitRequested = true;
    }

    async shiftItemsRoutine() {
            
    }

    async shiftPeopleRoutine(sec) {
            
        let shifts = 0;

        while(this.isRotatingItems) {

            //remove filled positions
            let emptyPositionsOnCouch = this.positionsOnCouch.filter((x, i) => {
                return this.context.model.isCouchSpotEmpty(i);
            });
            if(emptyPositionsOnCouch.length < this.thingsYouCanSitOn.length) {
                throw new Error("Too many items, not enough spaces?");
            }

            let posBelowCouchIndex = (this.positionsBelowCouch.length-1) - (shifts % this.positionsOnCouch.length);
            let posBelowCouch = this.positionsBelowCouch[posBelowCouchIndex];
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
            person.hopTo(spotlightX, spotlightY, sec, 7);
            await this.context.toolbox.waitForMS(sec);

            //rotate items through couch positions
            let isRotatingItems = true;

            this.shiftPeopleRoutine();
            this.shiftItemsRoutine();

            while(isRotatingItems) {


            
                //remove filled positions
                let emptyPositionsOnCouch = this.positionsOnCouch.filter((x, i) => {
                    return this.context.model.isCouchSpotEmpty(i);
                });
                if(emptyPositionsOnCouch.length < this.thingsYouCanSitOn.length) {
                    throw new Error("Too many items, not enough spaces?");
                }
                for(let j = 0; j < this.thingsYouCanSitOn.length; j++) {
                    let thing = this.thingsYouCanSitOn[j];
                    let posOnCouchIndex = (j + shifts) % emptyPositionsOnCouch.length;
                    let posOnCouch = emptyPositionsOnCouch[posOnCouchIndex];
                    thing.hopTo(posOnCouch.x, posOnCouch.y, sec * .5, 1);
                }

                let posBelowCouchIndex = (this.positionsBelowCouch.length-1) - (shifts % this.positionsOnCouch.length);
                let posBelowCouch = this.positionsBelowCouch[posBelowCouchIndex];
                person.hopTo(posBelowCouch.x, posBelowCouch.y, sec * .25, 1);

                await this.context.toolbox.waitForMS(sec);
                shifts++;

                if(this.isSitRequested) {
                    //cause player to sit!
                    isRotatingItems = false;
                    this.isSitRequested = false; //reset this
                    let onCouchPos = this.positionsOnCouch[posBelowCouchIndex];
                    person.hopTo(onCouchPos.x, onCouchPos.y, sec * .5, 4);
                    await this.context.toolbox.waitForMS(sec);
                    this.context.model.setPersonInCouchIndex(posBelowCouchIndex, person.currentImage.id);
                    person.renderOrder = this.renderOrders.sittingOnCouch;
                    this.sortSprites();
                }

            }

            //faster next
        }
            
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
        document.removeEventListener("click", this.onPlayerRequestedSit)
    }

   


}