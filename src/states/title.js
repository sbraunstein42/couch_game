import { Sprite } from "../../stubble/sprite.js";

export class Title {

    context;

    titleAnim;

    command;
    middleX;
    middleY;

    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);
        this.titleComplete = this.titleComplete.bind(this);

        this.middleX = this.context.canvas.width / 2;
        this.middleY = this.context.canvas.height / 2;
    }

    titleComplete(e) {
        let wrongKeyPressed = e.key !== undefined && e.key.toLowerCase() !== this.context.model.actionKey.toLowerCase();
        if (wrongKeyPressed) return;

        this.titleAnim.stop();
        document.removeEventListener("click", this.titleComplete);
        document.removeEventListener("keydown", this.titleComplete);
        this.command = "game";
    }

    enter() {
        if (!this.context.sounds.music) this.context.sounds.playTitleMusic();

        let titleAnim = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleAnim[0], this.context.model.spriteScale);
        this.titleAnim.setPivot(0.5, 0.5);
        this.titleAnim.setPosition(this.middleX, this.middleY);
        this.titleAnim.play(this.context.model.titleWiggleAnim, 6, -1);

        document.addEventListener("click", this.titleComplete);
        document.addEventListener("keydown", this.titleComplete);
    }

    exit() {
        this.titleAnim.stop();
        this.titleAnim = undefined;
        this.command = undefined;
    }

    update() {
        this.titleAnim?.draw();
        return this.command;
    }
}
