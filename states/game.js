import { Toolbox } from "../helpers/toolbox.js";
import { Sprite } from "../helpers/sprite.js"

export class Game {

    context; 
    sittables;
    people;
    couch;
    sittableWidth;
    sittableHeight;
    peopleWidth;
    peopleHeight;


    constructor(context) {
        this.context = context;
        this.update = this.update.bind(this);
        this.enter = this.enter.bind(this);
    }

    enter() {
        console.log("Entered game.")

        this.sittables = [];
        this.people = [];

        const sittableIds = this.context.model.getRandomSittables(4);
        for(let i = 0; i < sittableIds.length; i++) {
            let id = sittableIds[i];
            let sprite = new Sprite(this.context, id, this.context.model.spriteScale);
            // sprite.showBounds = true;
            this.sittables.push(sprite);
        }

        this.sittableWidth = this.sittables[0].width;
        this.sittableHeight = this.sittables[0].height;

        const couchId = this.context.model.getRandomCouch();
        this.couch = new Sprite(this.context, couchId, this.context.model.spriteScale)
        // this.couch.showBounds = true;

        const peopleIds = this.context.model.getRandomPeople(4);
        for(let i = 0; i < peopleIds.length; i++) {
            let id = peopleIds[i];
            let sprite = new Sprite(this.context, id, this.context.model.spriteScale);
            // sprite.showBounds = true;
            this.people.push(sprite);
        }

        this.peopleWidth = this.people[0].width;
        this.peopleHeight = this.people[0].height;

    }

    update() {
        let middleX = this.context.canvas.width /2;
        let middleY = this.context.canvas.height /2;

        this.couch.draw(middleX, middleY);

        let couchBounds = this.couch.getBounds();
        let onCouchY = couchBounds.y.max - (this.couch.height * .5) - (this.sittableHeight * .5)
        let sittableGap = this.context.model.spriteScale * 12.25;
        let currX = this.couch.x + (this.couch.width * .2);
        for(let i = 0; i < this.sittables.length; i++) {
            this.sittables[i].draw(currX, onCouchY);
            currX += sittableGap;
        }

        let peopleGap = this.context.model.spriteScale * 15;
        let peopleWaitingY = this.context.canvas.height - (this.peopleHeight * .6);
        for(let i = 0; i < this.people.length; i++) {
            this.people[i].draw((i + 1) * peopleGap, peopleWaitingY)
        }
    }

    

    exit() {

      
        // if(this.score > this.highScore) { 
        //     localStorage.setItem("highScore", this.score);
        //     localStorage.setItem("newHighScore", true);
        //     console.log("Set high score!")
        // }
        // clearTimeout(this.asteroidTimeoutId);

    }

   


}