// demo5Hopping.js
// DEMO: HoppingSprite
//
// HoppingSprite extends Sprite with one key method:
//
//   hopTo(x, y, durationMS, hops)
//     Moves the sprite from its current position to (x, y) over durationMS
//     milliseconds, broken into `hops` parabolic arcs.
//     x, y are in pivot-space (same coordinate system as setPosition).
//
// Properties:
//   hopHeight — how high each arc peaks (negative = up). Default -30.
//   onHop     — callback fired at the end of each individual hop.
//
// Under the hood, hopTo creates TWEEN animations: one for x (linear), and
// two per hop for y (ease-out up, ease-in down), all stored in context.tweens.
//
// Click anywhere to send the fish hopping there.

import { HoppingSprite } from "../../../stubble/hoppingSprite.js";
import { DemoBase } from "./demoBase.js";

export class Demo5Hopping extends DemoBase {

    fish = null;

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo6");

        this.fish = new HoppingSprite(this.context, "fish", 8);
        this.fish.setPosition(
            this.context.canvas.width / 2,
            this.context.canvas.height / 2 + 80
        );
        this.fish.hopHeight = -60;
    }

    onCanvasClick(pt) {
        // pt is already in canvas space; hopTo expects pivot-space coords
        this.fish.hopTo(pt.x, pt.y, 600, 3);
    }

    exit() {
        super.exit();
        this.fish = null;
    }

    update() {
        this.drawBackground();

        if (this.fish) this.fish.draw();

        this.drawTitle("5. HoppingSprite");
        this.drawDescription(
            "HoppingSprite extends Sprite with hopTo(x, y, durationMS, hops).\n" +
            "Each hop is a smooth parabolic arc driven by TWEEN animations.\n" +
            "Click anywhere to send the fish there."
        );

        return super.update();
    }
}
