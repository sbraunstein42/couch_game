import { Sprite } from "../helpers/sprite.js";
import '../helpers/howler.min.js';

export class Title {

    context;

    staticSprite;
    titleAnim;
    clickSprite;
    
    command;
    middleX;
    middleY;


    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);
        this.showTitle = this.showTitle.bind(this);
        this.titleComplete = this.titleComplete.bind(this);

        this.middleX = this.context.canvas.width / 2;
        this.middleY = this.context.canvas.height / 2;
    }

    async playStatic(duration) {

        let staticAnim = this.context.model.staticAnim;
        this.staticSprite = new Sprite(this.context, staticAnim[0], this.context.model.spriteScale);
        this.staticSprite.setPosition(this.middleX, this.middleY);
        this.staticSprite.play(staticAnim, 30, -1);
        await this.context.model.playStaticSound(duration);
        this.staticSprite = undefined;

    }

    async showTitle() {

        await this.playStatic(500);

        this.clickSprite = undefined;

        document.removeEventListener("click", this.showTitle)

        let titleAppearAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAppearAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(.5,.5)

        // this.titleAnim.showBounds = true;

        this.titleAnim.setPosition(this.middleX, this.middleY);

        this.context.model.playRandomSound("title", 6);
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

        this.clickSprite = new Sprite(this.context, "titleClick", this.context.model.spriteScale);
        this.clickSprite.setPosition(this.middleX, this.middleY);

    }

    exit() {
        this.titleAnim.stop();
        this.titleAnim = undefined;
        this.clickSprite = undefined;
        this.staticSprite = undefined;
    }

    update() {
        this.titleAnim?.draw();
        this.clickSprite?.draw();
        this.staticSprite?.draw();
        return this.command;
    }


}
