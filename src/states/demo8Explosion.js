// demo8Explosion.js
// DEMO: Explosion
//
// The Explosion class launches a set of piece sprites outward from a central
// sprite using physics-based TWEEN animations:
//
//   new Explosion(context, sourceSprite, pieceIds, renderOrder, { onAdd, onRemove })
//     sourceSprite — the sprite that "explodes" (its alpha is set to 0)
//     pieceIds     — array of sprite IDs for the flying pieces
//     renderOrder  — pieces are drawn at this renderOrder
//     onAdd(piece) — called when a piece sprite is created (add it to your list)
//     onRemove(p)  — called when a piece finishes animating (remove from list)
//
// Each piece fans out at a random angle and speed, arcs upward, then falls
// with gravity. Pieces fade out in the second half of their flight.
//
// The source sprite uses context.model.spriteScale for piece size.
//
// Click the cake to explode it. It will respawn after 2 seconds.

import { Sprite } from "../../../stubble/sprite.js";
import { Explosion } from "../../../stubble/explosion.js";
import { DemoBase } from "./demoBase.js";

const CAKE_PIECES = [
    "sittable_cake_1",
    "sittable_cake_2",
    "sittable_cake_3",
    "sittable_cake_4",
    "sittable_cake_5",
    "sittable_cake_6",
];

export class Demo8Explosion extends DemoBase {

    sprites = [];
    cake = null;
    canExplode = true;

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo9");
        this.sprites = [];
        this.canExplode = true;

        this.cake = new Sprite(this.context, "sittable_cake", 10);
        this.cake.setPosition(
            this.context.canvas.width / 2,
            this.context.canvas.height / 2 + 50
        );
        this.cake.renderOrder = 10;
        this.sprites.push(this.cake);
    }

    onCanvasClick(pt) {
        if (!this.canExplode) return;
        if (!this.cake || this.cake.alpha === 0) return;

        this.canExplode = false;

        new Explosion(
            this.context,
            this.cake,
            CAKE_PIECES,
            20,
            {
                onAdd:    (piece) => { this.sprites.push(piece); this.sortSprites(); },
                onRemove: (piece) => { this.sprites = this.sprites.filter(s => s !== piece); },
            }
        ).launch();

        // Respawn the cake after a delay
        this.context.toolbox.waitForMS(2000).then(() => {
            if (!this.cake) return;
            this.cake.alpha = 1;
            this.canExplode = true;
        });
    }

    sortSprites() {
        this.sprites.sort((a, b) => a.renderOrder - b.renderOrder);
    }

    exit() {
        super.exit();
        this.sprites = [];
        this.cake = null;
    }

    update() {
        this.drawBackground();

        for (let sprite of this.sprites) {
            sprite.draw();
        }

        this.drawTitle("8. Explosion");
        this.drawDescription(
            "Explosion launches piece sprites outward with physics tweens.\n" +
            "Pieces arc upward, fall with gravity, and fade out.\n" +
            "Click the cake to explode it!"
        );

        if (this.canExplode && this.cake && this.cake.alpha > 0) {
            this.drawLabel("click to explode", this.context.canvas.width / 2, this.context.canvas.height / 2 + 230, "#ffdd55");
        } else if (!this.canExplode) {
            this.drawLabel("respawning...", this.context.canvas.width / 2, this.context.canvas.height / 2 + 230, "#888888");
        }

        return super.update();
    }
}
