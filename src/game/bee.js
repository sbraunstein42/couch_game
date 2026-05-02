import { Sprite } from "../../stubble/sprite.js";
import * as TWEEN from "../../stubble/tween.esm.js";

export class Bee extends Sprite {

    onDone; // set by caller — fired when the bee leaves the screen

    constructor(context, id, scale) {
        super(context, id, scale);
    }

    launch(cx, cy) {
        this.setPivot(0.5, 0.5);
        this.setPosition(cx, cy);

        const horizontalDrift = (Math.random() - 0.5) * 350;
        const upwardSpeed = 180 + Math.random() * 120;
        const circleRadius = 14;
        const circleFreq = 5;
        const startX = this.x;
        const startY = this.y;
        const flyDurationMS = 5000;
        const state = { phase: 0 };
        let done = false;

        const finish = () => {
            if (done) return;
            done = true;
            this.onDone?.(this);
        };

        this.context.tweens.push(new TWEEN.Tween(state)
            .to({ phase: 1 }, flyDurationMS)
            .onUpdate(() => {
                if (done) return;
                const t = state.phase * (flyDurationMS / 1000);
                const circleAngle = circleFreq * Math.PI * 2 * t;
                this.x = startX + horizontalDrift * t + circleRadius * Math.sin(circleAngle);
                this.y = startY - upwardSpeed * t + circleRadius * Math.cos(circleAngle) - circleRadius;
                if (this.y + this.height < 0) finish();
            })
            .onComplete(finish)
            .start()
        );
    }
}
