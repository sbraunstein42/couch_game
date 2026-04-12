import { Sprite } from "../stubble/sprite.js";
import '../stubble/howler.min.js';

export class Splash {

    context;

    clickSprite;
    titleAnim;
    staticSpriteLeft;
    staticSpriteRight;

    command;
    middleX;
    middleY;

    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);
        this.onPlayerClicked = this.onPlayerClicked.bind(this);

        this.middleX = this.context.canvas.width / 2;
        this.middleY = this.context.canvas.height / 2;
    }

    async playStatic(duration) {
        let staticAnim = this.context.model.staticAnim;

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

    async onPlayerClicked(e) {
        let wrongKeyPressed = e.key !== undefined && e.key.toLowerCase() !== this.context.model.actionKey.toLowerCase();
        if (wrongKeyPressed) return;

        document.removeEventListener("click", this.onPlayerClicked);
        document.removeEventListener("keydown", this.onPlayerClicked);
        this.clickSprite = undefined;

        await this.playStatic(500);

        let titleAppearAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAppearAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(0.5, 0.5);
        this.titleAnim.setPosition(this.middleX, this.middleY);

        this.context.model.playRandomSound("title", 6);
        this.context.model.playTitleMusic();

        let appearTime = this.titleAnim.play(titleAppearAnim, 1.5, 1);
        await this.context.toolbox.waitForMS(appearTime);

        let decorateTime = this.titleAnim.play(this.context.model.titleDecorateAnim, 6, 1);
        await this.context.toolbox.waitForMS(decorateTime);

        this.command = "title";
    }

    enter() {
        this.clickSprite = new Sprite(this.context, "titleClick", this.context.model.spriteScale);
        this.clickSprite.setPosition(this.middleX, this.middleY);
        document.addEventListener("click", this.onPlayerClicked);
        document.addEventListener("keydown", this.onPlayerClicked);
    }

    exit() {
        this.titleAnim?.stop();
        this.titleAnim = undefined;
        this.clickSprite = undefined;
        this.staticSpriteLeft = undefined;
        this.staticSpriteRight = undefined;
        this.command = undefined;
    }

    update() {
        this.titleAnim?.draw();
        this.clickSprite?.draw();
        this.staticSpriteLeft?.draw();
        this.staticSpriteRight?.draw();
        return this.command;
    }
}
