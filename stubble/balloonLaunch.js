import { Sprite } from "./sprite.js";
import * as TWEEN from "./tween.esm.js";

const BALLOON_COLORS = [
    'rgba(255, 50,  50,  0.8)',  // red
    'rgba(50,  120, 255, 0.8)',  // blue
    'rgba(255, 225, 20,  0.8)',  // yellow
    'rgba(40,  210, 80,  0.8)',  // green
    'rgba(190, 60,  255, 0.8)',  // purple
    'rgba(255, 130, 20,  0.8)',  // orange
];

export class BalloonLaunch {

    timeout = null;
    colorIndex = 0;

    constructor(context, startX, renderOrder, { onAdd, onRemove }) {
        this.context = context;
        this.startX = startX;
        this.renderOrder = renderOrder;
        this.onAdd = onAdd;
        this.onRemove = onRemove;
    }

    start() {
        this.spawnBalloon();
        this.scheduleNext();
    }

    stop() {
        clearTimeout(this.timeout);
    }

    scheduleNext() {
        let delay = 400 + Math.random() * 900;
        this.timeout = setTimeout(() => {
            this.spawnBalloon();
            this.scheduleNext();
        }, delay);
    }

    spawnBalloon() {
        let canvas = this.context.canvas;
        let model = this.context.model;
        let tweens = this.context.tweens;

        let balloon = new Sprite(this.context, 'balloon', model.spriteScale);
        balloon.setPivot(0.5, 0);
        balloon.tint = BALLOON_COLORS[this.colorIndex++ % BALLOON_COLORS.length];
        balloon.setPosition(this.startX + (Math.random() - 0.5) * 120, canvas.height);
        balloon.renderOrder = this.renderOrder;
        this.onAdd(balloon);

        let vx = (Math.random() - 0.5) * 60;
        let vy = -(80 + Math.random() * 200);
        let gravity = -30 - Math.random() * 70;
        let startX = balloon.x;
        let startY = balloon.y;
        let durationMS = 12000;

        let state = { phase: 0 };
        let tween = new TWEEN.Tween(state)
            .to({ phase: 1 }, durationMS)
            .onUpdate(() => {
                let t = state.phase * (durationMS / 1000);
                balloon.x = startX + vx * t;
                balloon.y = startY + vy * t + 0.5 * gravity * t * t;
                if (balloon.y + balloon.height < 0) {
                    tween.stop();
                    this.onRemove(balloon);
                }
            })
            .onComplete(() => this.onRemove(balloon))
            .start();
        tweens.push(tween);
    }
}
