import { Sprite } from "../helpers/sprite.js";
import '../helpers/howler.min.js';

export class Title {

    context;
    titleAnim;
    command;

    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);
        this.showTitle = this.showTitle.bind(this);

        
    }

    showTitle() {
        this.context.model.playSound("title", 6);

        let titleSpriteIds = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleSpriteIds[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(.5,.5)
        this.titleAnim.showBounds = true;

        let middleX = this.context.canvas.width / 2;
        let middleY = this.context.canvas.height / 2;
        this.titleAnim.setPosition(middleX, middleY);

        // play(pathsForAnimationFrames, fps, loops, onComplete) {
        this.titleAnim.play(titleSpriteIds, 1, 1, () => {
            this.command = "game"
        })
        document.removeEventListener("click", this.showTitle)

    }

    enter() {
        console.log("Entered title.");
        document.addEventListener("click", this.showTitle)
    }

    exit() {
    }

    update() {
            this.titleAnim?.draw();
        return this.command;
    }


}