import { Sprite } from "../../stubble/sprite.js";
import * as TWEEN from "../../stubble/tween.esm.js";

export class FloorWalker extends Sprite {

    onLand; // set by caller — fired the moment the walker touches down

    constructor(context, id, scale) {
        super(context, id, scale);
    }

    launch(cx, cy) {
        this.setPivot(0.5, 0.5);
        this.setPosition(cx, cy);

        // couch seat surface is at canvas.height/2; stand with bottom flush to it
        const floorY = this.context.canvas.height / 2 - this.height;
        const startX = this.x;
        const startY = this.y;

        if (startY >= floorY) {
            this._land(floorY);
            return;
        }

        const vx = (Math.random() - 0.5) * 80;
        const vy = -150;
        const gravity = 600;
        const fallDurationMS = 1500;
        const state = { phase: 0 };
        let landed = false;

        this.context.tweens.push(new TWEEN.Tween(state)
            .to({ phase: 1 }, fallDurationMS)
            .onUpdate(() => {
                if (landed) return;
                const t = state.phase * (fallDurationMS / 1000);
                this.x = startX + vx * t;
                const newY = startY + vy * t + 0.5 * gravity * t * t;
                if (newY >= floorY) {
                    landed = true;
                    this._land(floorY);
                } else {
                    this.y = newY;
                }
            })
            .onComplete(() => {
                if (!landed) this._land(floorY);
            })
            .start()
        );
    }

    _land(floorY) {
        this.y = floorY;
        this.onLand?.(this);
        this._walk();
    }

    _walk() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.flipX = direction < 0;
        const speed = 25 + Math.random() * 20;
        const walkDistance = this.context.canvas.width * 1.5;
        const walkDurationMS = (walkDistance / speed) * 1000;
        const walkState = { x: this.x };
        this.context.tweens.push(new TWEEN.Tween(walkState)
            .to({ x: this.x + direction * walkDistance }, walkDurationMS)
            .onUpdate(() => { this.x = walkState.x; })
            .start()
        );
    }
}
