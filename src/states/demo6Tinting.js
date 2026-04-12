// demo6Tinting.js
// DEMO: Tinting
//
// Set sprite.tint to any CSS color string to colorize the sprite.
// The tint is applied by drawing the image onto an offscreen canvas and
// painting the tint color over it using globalCompositeOperation = 'source-atop',
// which preserves the original alpha (transparency) while replacing the color.
//
// The tinted version is cached in sprite._tintCanvas and rebuilt only when
// the sprite image changes (setSprite resets it to null).
//
// Set sprite.tint = null to restore the original uncolored image.
//
// Here six balloons share the same sprite but each has a different tint.

import { Sprite } from "../../../stubble/sprite.js";
import { DemoBase } from "./demoBase.js";

const TINTS = [
    { color: "rgba(255, 80,  80,  0.75)", label: "red" },
    { color: "rgba(80,  140, 255, 0.75)", label: "blue" },
    { color: "rgba(255, 230, 50,  0.75)", label: "yellow" },
    { color: "rgba(80,  220, 100, 0.75)", label: "green" },
    { color: "rgba(200, 80,  255, 0.75)", label: "purple" },
    { color: "rgba(255, 150, 40,  0.75)", label: "orange" },
];

export class Demo6Tinting extends DemoBase {

    balloons = [];

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo7");
        this.balloons = [];

        let count = TINTS.length;
        let spacing = this.context.canvas.width / (count + 1);
        let midY = this.context.canvas.height / 2 + 50;

        for (let i = 0; i < count; i++) {
            let balloon = new Sprite(this.context, "balloon", 10);
            balloon.tint = TINTS[i].color;
            balloon.setPosition(spacing * (i + 1), midY);
            this.balloons.push(balloon);
        }
    }

    exit() {
        super.exit();
        this.balloons = [];
    }

    update() {
        this.drawBackground();

        for (let i = 0; i < this.balloons.length; i++) {
            this.balloons[i].draw();
            let b = this.balloons[i];
            this.drawLabel(
                TINTS[i].label,
                b.x + b.width / 2,
                b.y + b.height + 15,
                TINTS[i].color
            );
        }

        this.drawTitle("6. Tinting");
        this.drawDescription(
            "Set sprite.tint to a CSS color to colorize the sprite.\n" +
            "The tint is composited using 'source-atop' on an offscreen canvas,\n" +
            "preserving the original transparency. Set tint=null to restore."
        );

        return super.update();
    }
}
