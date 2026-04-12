// demo1Sprites.js
// DEMO: The Sprite Class
//
// Sprite is the core visual element in stubble. To use it:
//   1. Add an <img id="mySprite" src="..."> tag to index.html (hidden)
//   2. new Sprite(context, "mySprite", scale) — scale multiplies the image's pixel size
//
// Sprite properties shown here:
//   alpha     — opacity from 0 (invisible) to 1 (fully opaque)
//   rotation  — angle in radians
//   showBounds — debug overlay: bounding box (blue) and pivot point (yellow square)
//
// The sprite always draws at (this.x, this.y), which is the top-left corner.
// Use setPosition(x, y) to place the pivot instead (explained in Demo 3).

import { Sprite } from "../../../stubble/sprite.js";
import { DemoBase } from "./demoBase.js";

export class Demo1Sprites extends DemoBase {

    sprites = [];

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo2");
        this.sprites = [];

        let midX = this.context.canvas.width / 2;
        let midY = this.context.canvas.height / 2 + 60;

        // Left: default sprite with showBounds enabled so you can see the box and pivot
        let left = new Sprite(this.context, "fish", 8);
        left.setPosition(midX - 420, midY);
        left.showBounds = true;
        this.sprites.push(left);

        // Middle: alpha set to 0.35 — sprite is partially transparent
        let mid = new Sprite(this.context, "fish", 8);
        mid.setPosition(midX, midY);
        mid.alpha = 0.35;
        this.sprites.push(mid);

        // Right: rotation set to 0.45 radians (~26 degrees)
        let right = new Sprite(this.context, "fish", 8);
        right.setPosition(midX + 420, midY);
        right.rotation = 0.45;
        this.sprites.push(right);
    }

    exit() {
        super.exit();
        this.sprites = [];
    }

    update() {
        this.drawBackground();

        for (let sprite of this.sprites) {
            sprite.draw();
        }

        this.drawTitle("1. Sprites");
        this.drawDescription(
            "Sprites load an image by its HTML id and draw it on the canvas.\n" +
            "Left: showBounds=true  |  Middle: alpha=0.35  |  Right: rotation=0.45"
        );

        let midX = this.context.canvas.width / 2;
        let midY = this.context.canvas.height / 2 + 60;
        let labelY = midY + 150;
        this.drawLabel("showBounds", midX - 420, labelY, "#88aaff");
        this.drawLabel("alpha = 0.35", midX, labelY, "#88aaff");
        this.drawLabel("rotation = 0.45", midX + 420, labelY, "#88aaff");

        return super.update();
    }
}
