// demo4Animation.js
// DEMO: Animation
//
// Sprite.play(ids, fps, loops) drives a frame-by-frame animation:
//   ids   — array of sprite IDs to cycle through (must all be in index.html)
//   fps   — frames per second
//   loops — how many full cycles to play (pass -1 for infinite)
//
// play() returns the total duration in milliseconds (useful for awaiting).
// Sprite.stop() halts the animation and clears the playhead.
//
// Under the hood, play() uses requestAnimationFrame to advance frames,
// keeping the animation synced to the display refresh rate rather than a
// fixed timer — so it stays smooth at any framerate.
//
// Click to toggle between slow (3 fps) and fast (12 fps) playback.

import { Sprite } from "../../../stubble/sprite.js";
import { DemoBase } from "./demoBase.js";

export class Demo4Animation extends DemoBase {

    titleSprite = null;
    fishSprite = null;
    fps = 3;
    fishFrames = ["fish", "fish_think", "fish_surprise", "fish_sit"];

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo5");

        let midX = this.context.canvas.width / 2;
        let midY = this.context.canvas.height / 2 + 50;

        // The title animation has 7 frames that were drawn for the game's title screen
        this.titleSprite = new Sprite(this.context, "title1", 6);
        this.titleSprite.setPosition(midX - 320, midY);
        this.titleSprite.play(["title1", "title2", "title3", "title4"], 4, -1);

        // Fish cycles through its 4 pose sprites at the current fps
        this.fishSprite = new Sprite(this.context, "fish", 8);
        this.fishSprite.setPosition(midX + 280, midY);
        this.fishSprite.play(this.fishFrames, this.fps, -1);
    }

    onCanvasClick(pt) {
        // Toggle between slow and fast playback on the fish
        this.fps = this.fps === 3 ? 12 : 3;
        this.fishSprite.play(this.fishFrames, this.fps, -1);
    }

    exit() {
        super.exit();
        if (this.titleSprite) this.titleSprite.stop();
        if (this.fishSprite) this.fishSprite.stop();
        this.titleSprite = null;
        this.fishSprite = null;
    }

    update() {
        this.drawBackground();

        if (this.titleSprite) this.titleSprite.draw();
        if (this.fishSprite) this.fishSprite.draw();

        this.drawTitle("4. Animation");
        this.drawDescription(
            "play(ids, fps, loops) cycles through an array of sprite IDs.\n" +
            "Left: 4-frame title anim at 4 fps, loops=-1 (infinite).\n" +
            "Right: fish pose cycle. Click to toggle 3 fps / 12 fps."
        );

        let midX = this.context.canvas.width / 2;
        let midY = this.context.canvas.height / 2 + 50;
        this.drawLabel("play(titleFrames, 4, -1)", midX - 320, midY + 160, "#88aaff");
        this.drawLabel("fps = " + this.fps + "  (click to toggle)", midX + 280, midY + 160, "#ffdd55");

        return super.update();
    }
}
