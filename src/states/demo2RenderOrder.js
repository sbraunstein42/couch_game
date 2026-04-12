// demo2RenderOrder.js
// DEMO: Render Order
//
// The main game loop draws sprites in a sorted list. Each sprite has a renderOrder
// number — lower numbers are drawn first (appear behind), higher numbers are drawn
// last (appear in front).
//
// To change layering at runtime, set sprite.renderOrder and re-sort the list.
// The sprites array here is sorted every time you click, cycling the top sprite.
//
// Click anywhere (except NEXT) to cycle which sprite is on top.

import { Sprite } from "../../../stubble/sprite.js";
import { DemoBase } from "./demoBase.js";

export class Demo2RenderOrder extends DemoBase {

    sprites = [];
    // Cycle index: which sprite is currently on top
    topIndex = 0;

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo3");
        this.sprites = [];
        this.topIndex = 0;

        let midX = this.context.canvas.width / 2;
        let midY = this.context.canvas.height / 2 + 60;

        let couch = new Sprite(this.context, "couch_orange", 8);
        couch.setPosition(midX, midY + 30);
        couch.label = "couch_orange";
        this.sprites.push(couch);

        let cake = new Sprite(this.context, "sittable_cake", 8);
        cake.setPosition(midX - 60, midY - 40);
        cake.label = "sittable_cake";
        this.sprites.push(cake);

        let fish = new Sprite(this.context, "fish", 8);
        fish.setPosition(midX + 50, midY - 80);
        fish.label = "fish";
        this.sprites.push(fish);

        this.assignRenderOrders();
    }

    assignRenderOrders() {
        // topIndex sprite gets the highest renderOrder; others stay in sequence
        for (let i = 0; i < this.sprites.length; i++) {
            let offset = (i - this.topIndex + this.sprites.length) % this.sprites.length;
            this.sprites[i].renderOrder = offset;
        }
        this.sprites.sort((a, b) => a.renderOrder - b.renderOrder);
    }

    onCanvasClick(pt) {
        this.topIndex = (this.topIndex + 1) % this.sprites.length;
        this.assignRenderOrders();
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

        // Draw renderOrder labels next to each sprite (using their stored position)
        for (let sprite of this.sprites) {
            this.drawLabel(
                sprite.label + "  (order " + sprite.renderOrder + ")",
                sprite.x + sprite.width / 2,
                sprite.y - 20,
                sprite.renderOrder === this.sprites.length - 1 ? "#ffdd55" : "#aabbdd"
            );
        }

        this.drawTitle("2. Render Order");
        this.drawDescription(
            "Sprites are drawn in renderOrder sequence — lower = behind, higher = in front.\n" +
            "Click anywhere to cycle which sprite is drawn on top."
        );

        return super.update();
    }
}
