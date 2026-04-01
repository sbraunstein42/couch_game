import { Sprite } from "../helpers/sprite.js";
import '../helpers/howler.min.js';

export class Title {

    context;
    titleAnim;
    command;
    music;

    pitchDownDuration = 1800;   // ms for the full slowdown
    pitchDownInterval = 30;     // ms between each rate update step
    pitchDownTargetRate = 0.05; // rate to slow down to before stopping

    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);
        this.showTitle = this.showTitle.bind(this);
        this.titleComplete = this.titleComplete.bind(this);
        this.pitchDown = this.pitchDown.bind(this);

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

        this.music = new Howl({
            src: ['../audio/music/spanish_flea.mp4'],
            preload: true
        });
        this.music.play();

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
        this.pitchDown();
    }

    pitchDown() {
        if (!this.music) {
            this.command = "game";
            return;
        }
        const steps = this.pitchDownDuration / this.pitchDownInterval;
        const rateStep = (1.0 - this.pitchDownTargetRate) / steps;
        let currentRate = 1.0;

        const interval = setInterval(() => {
            currentRate -= rateStep;
            if (currentRate <= this.pitchDownTargetRate) {
                this.music.stop();
                clearInterval(interval);
                this.command = "game";
            } else {
                this.music.rate(currentRate);
            }
        }, this.pitchDownInterval);
    }

    enter() {
        console.log("Entered title.");
        document.addEventListener("click", this.showTitle)
    }

    exit() {
        this.music?.stop();
    }

    update() {
        this.titleAnim?.draw();
        return this.command;
    }


}