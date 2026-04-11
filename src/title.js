import { Sprite } from "../stubble/sprite.js";
import '../stubble/howler.min.js';

export class Title {

    context;

    staticSpriteLeft;
    staticSpriteRight;
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

        //two static sprites back to back, covers 160px screen because they're both 100px wide
        this.staticSpriteLeft = new Sprite(this.context, staticAnim[0], this.context.model.spriteScale);
        this.staticSpriteLeft.setPivot(1, 0.5);
        this.staticSpriteLeft.setPosition(this.middleX, this.middleY);
        this.staticSpriteLeft.play(staticAnim, 30, -1);

        this.staticSpriteRight = new Sprite(this.context, staticAnim[0], this.context.model.spriteScale);
        this.staticSpriteRight.setPivot(0, 0.5);
        this.staticSpriteRight.setPosition(this.middleX, this.middleY);
        this.staticSpriteRight.play(staticAnim, 30, -1);

        await this.context.model.playStaticSound(duration);
        this.staticSpriteLeft = undefined;
        this.staticSpriteRight = undefined;

    }

    async showTitle(e) {

        //handle keys here if we're here because of a keypress
        let wrongKeyPressed = e.key !== undefined && e.key.toLowerCase() !== this.context.model.actionKey.toLowerCase();
        if(wrongKeyPressed) return;

        document.removeEventListener("click", this.showTitle);
        document.removeEventListener("keydown", this.showTitle);
        this.clickSprite = undefined;

        //do that for 500 ms
        await this.playStatic(500);

        let titleAppearAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAppearAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(.5,.5)
        this.titleAnim.setPosition(this.middleX, this.middleY);

        //announce!
        this.context.model.playRandomSound("title", 6);
        this.context.model.playTitleMusic();

        let appearTime = this.titleAnim.play(titleAppearAnim, 1.5, 1);
        await this.context.toolbox.waitForMS(appearTime);

        let decorateTime = this.titleAnim.play(this.context.model.titleDecorateAnim, 6, 1);
        await this.context.toolbox.waitForMS(decorateTime);

        //goes forever, but we wait for a click
        this.titleAnim.play(this.context.model.titleWiggleAnim, 6, -1);
        document.addEventListener("click", this.titleComplete);
        document.addEventListener("keydown", this.titleComplete);


        //left this here to show why async is better than callbacks.

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

    titleComplete(e) {
        //handle keys here if we're here because of a keypress
        let wrongKeyPressed = e.key !== undefined && e.key.toLowerCase() !== this.context.model.actionKey.toLowerCase();
        if(wrongKeyPressed) return;

        this.titleAnim.stop();
        document.removeEventListener("click", this.titleComplete);
        document.removeEventListener("keydown", this.titleComplete);
        this.command = "game";
    }


    enter() {
        console.log("Entered title.");

        this.clickSprite = new Sprite(this.context, "titleClick", this.context.model.spriteScale);
        this.clickSprite.setPosition(this.middleX, this.middleY);

        document.addEventListener("click", this.showTitle);
        document.addEventListener("keydown", this.showTitle);
    }

    //unassign all sprites for next time
    exit() {
        this.titleAnim.stop();
        this.titleAnim = undefined;
        this.clickSprite = undefined;
        this.staticSpriteLeft = undefined;
        this.staticSpriteRight = undefined;
    }

    //draw them if they exist
    update() {
        this.titleAnim?.draw();
        this.clickSprite?.draw();
        this.staticSpriteLeft?.draw();
        this.staticSpriteRight?.draw();
        return this.command;
    }


}
