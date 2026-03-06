import { Sprite } from "../helpers/sprite.js";
import { Person } from "../helpers/person.js";

export class Game {

    context; 
    sittables;
    people;
    couch;
    sittableWidth;
    sittableHeight;
    peopleWidth;
    peopleHeight;

    peopleCount = 1;
    sittablesCount = 1;


    ball = { x: 50, y: 100, radius: 30 };
    tweens = [];


    constructor(context) {
        this.context = context;
        this.update = this.update.bind(this);
        this.enter = this.enter.bind(this);
    }

    enter() {
        console.log("Entered game.")

        this.sittables = [];
        this.people = [];

        const sittableIds = this.context.model.getRandomSittables(this.sittablesCount);
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
        
        const peopleIds = this.context.model.getRandomPeople(this.peopleCount);
        for(let i = 0; i < peopleIds.length; i++) {
            let id = peopleIds[i];
            let sprite = new Person(this.context, id, this.context.model.spriteScale);
            // sprite.showBounds = true;
            this.people.push(sprite);
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
        for(let i = 0; i < this.sittables.length; i++) {
            currX += sittableGap;
            this.sittables[i].setPosition(currX, onCouchY);
        }

        let peopleGap = this.context.model.spriteScale * 15;
        let peopleWaitingY = this.context.canvas.height - (this.peopleHeight * .6);
        
        for(let i = 0; i < this.people.length; i++) {
            let finalX = (i + 1) * peopleGap;
            this.people[i].setPosition(finalX - 300, peopleWaitingY);
            this.people[i].hopTo(finalX, peopleWaitingY, 2000, 10);
        }

        

    }

    update() {

        this.couch.draw();

        for(let i = 0; i < this.sittables.length; i++) {
            this.sittables[i].draw();
        }

        let peopleGap = this.context.model.spriteScale * 15;
        let peopleWaitingY = this.context.canvas.height - (this.peopleHeight * .6);
        for(let i = 0; i < this.people.length; i++) {
            this.people[i].draw()
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