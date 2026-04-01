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

        let titleAppearAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAppearAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(.5,.5)
        // this.titleAnim.showBounds = true;

        let middleX = this.context.canvas.width / 2;
        let middleY = this.context.canvas.height / 2;
        this.titleAnim.setPosition(middleX, middleY);

        console.log(titleAppearAnim.length)

        // play(pathsForAnimationFrames, fps, loops, onComplete) {
        this.titleAnim.play(titleAppearAnim, 1.5, 1, () => {
            this.titleAnim.play(this.context.model.titleWiggleAnim, 2.25, 30, () => {
                this.command = "game"
            });
        })
        this.context.model.playSound("title", 6);

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