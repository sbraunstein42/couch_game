import { Toolbox } from "../helpers/toolbox.js";
import { Sprite } from "../helpers/sprite.js"

export class Game {

    context; 
    sittables;
    couch;
    spriteScale = 10;


    constructor(context) {
        this.context = context;
        this.update = this.update.bind(this);
        this.enter = this.enter.bind(this);
    }

    enter() {
        this.sittables = [];

        const sittablePaths = this.context.model.getRandomSittables(4);
        for(let i = 0; i < sittablePaths.length; i++) {
            let path = sittablePaths[i];
            let sprite = new Sprite(this.context, path, this.spriteScale);
            this.sittables.push(sprite);
        }

        const couchPath = this.context.model.getRandomCouch();
        this.couch = new Sprite(this.context, couchPath, this.spriteScale)
    }

    update() {
        for(let i = 0; i < this.sittables.length; i++) {
            this.sittables[i].draw(i * 100, 10);
        }
        this.couch.draw(200, 200);
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