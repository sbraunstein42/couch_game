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
        this.titleComplete = this.titleComplete.bind(this);
    }

    async showTitle() {

        document.removeEventListener("click", this.showTitle)

        let titleAppearAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAppearAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(.5,.5)
        // this.titleAnim.showBounds = true;

        let middleX = this.context.canvas.width / 2;
        let middleY = this.context.canvas.height / 2;
        this.titleAnim.setPosition(middleX, middleY);

        this.context.model.playSound("title", 6);
        this.context.model.playTitleMusic();

        // play(pathsForAnimationFrames, fps, loops, onComplete) {
        let appearTime = this.titleAnim.play(titleAppearAnim, 1.5, 1);
        await this.context.toolbox.waitForMS(appearTime);

        let decorateTime = this.titleAnim.play(this.context.model.titleDecorateAnim, 6, 1);
        await this.context.toolbox.waitForMS(decorateTime);

        //goes forever, but we wait for a click
        this.titleAnim.play(this.context.model.titleWiggleAnim, 6, -1);
        document.addEventListener("click", this.titleComplete);

        // // play(pathsForAnimationFrames, fps, loops, onComplete) {
        // this.titleAnim.play(titleAppearAnim, 1.5, 1, () => {
        //     this.titleAnim.play(this.context.model.titleDecorateAnim, 6, 1, () => {
        //         this.titleAnim.play(this.context.model.titleWiggleAnim, 6, 20, () => {
        //             this.addEventListener("click", this.titleComplete);
        //         });
        //     });
        // })
        // this.context.model.playSound("title", 6);

        // document.removeEventListener("click", this.showTitle)
    }

    titleComplete() {
        this.titleAnim.stop();
        document.removeEventListener("click", this.titleComplete);
        this.command = "game";
    }

    enter() {
        console.log("Entered title.");
        document.addEventListener("click", this.showTitle)
    }

    exit() {}

    update() {
        this.titleAnim?.draw();
        return this.command;
    }


}
