import { Sprite } from "../helpers/sprite.js";

export class Title {

    context;
    titleAnim;
    command;

    constructor(context) {
        this.context = context;

        this.enter = this.enter.bind(this);
        this.exit = this.exit.bind(this);
        this.update = this.update.bind(this);

        
    }

    enter() {
        console.log("Entered title.");
        // document.addEventListener("keypress", this.onKeyPressed )
        // document.addEventListener("click", this.onClicked)

        let titleSpriteIds = this.context.model.titleAnim;
        this.titleAnim = new Sprite(this.context, titleSpriteIds[0], this.context.model.spriteScale);
        
            // play(pathsForAnimationFrames, fps, loops) {

        this.titleAnim.play(titleSpriteIds, 4, 1, () => {
            this.command = "game"
        })

    }

    exit() {
        // document.addEventListener("keypress", this.onKeyPressed )
        // document.addEventListener("click", this.onClicked)
        // this.changeToGame = false; //consume it; so we reset the title screen for next time.
    }

    // onKeyPressed() {
    //     this.changeToGame = true;
    // }
    
    // onClicked(event) {
    //     let isHitButton = this.toolbox.isWithinRect(
    //         event.offsetX, event.offsetY, 
    //         this.startButtonX, this.startButtonY, 
    //         this.startButtonW, this.startButtonH
    //     );
    //     this.changeToGame = isHitButton;
    // }

    update() {
        this.titleAnim.draw(0, 0);
        // // this.pencil.fillStyle = "gray";
        // // this.pencil.font = "20px Georgia";
        // // this.pencil.fillText("Title", 10, 50);

        // this.pencil.fillStyle = "#690604ff";
        // this.pencil.fillRect(
        //     this.startButtonX, this.startButtonY,
        //     this.startButtonW, this.startButtonH
        // );

        // this.pencil.fillStyle = "white";
        // this.pencil.font = "50px Impact";
        // this.pencil.fillText("ESCAPE?", this.startButtonX + 70, this.startButtonY + 170);

        // if(this.changeToGame) {
        //     this.exit();
        //     return "game";
        // }

        // return "game"

        return this.command;
    }


}