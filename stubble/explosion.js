import { Sprite } from "./sprite.js";
import * as TWEEN from "./tween.esm.js";

export class Explosion {

    constructor(context, sittable, pieceIds, renderOrder, { onAdd, onRemove }) {
        this.context = context;
        this.sittable = sittable;
        this.pieceIds = pieceIds;
        this.renderOrder = renderOrder;
        this.onAdd = onAdd;
        this.onRemove = onRemove;
    }

    launch() {
        this.sittable.alpha = 0;

        const cx = this.sittable.x + this.sittable.width / 2;
        const cy = this.sittable.y + this.sittable.height / 2;
        const durationMS = 1400;
        const gravityPxPerSec2 = 600;
        const fadeStartPhase = 0.5;

        this.pieceIds.forEach((id, i) => {
            const piece = new Sprite(this.context, id, this.context.model.spriteScale);
            piece.setPivot(0.5, 0.5);
            piece.setPosition(cx, cy);
            piece.renderOrder = this.renderOrder;
            this.onAdd(piece);

            const angle = (Math.PI * 2 / this.pieceIds.length) * i + (Math.random() - 0.5) * 0.6;
            const speed = this.context.toolbox.getRandomInRange(100, 300);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 250; // bias upward
            const targetRotation = (Math.random() - 0.5) * Math.PI * 0.6;
            const startX = piece.x;
            const startY = piece.y;

            const state = { phase: 0 };
            this.context.tweens.push(new TWEEN.Tween(state)
                .to({ phase: 1 }, durationMS)
                .onUpdate(() => {
                    const t = state.phase * (durationMS / 1000);
                    piece.x = startX + vx * t;
                    piece.y = startY + vy * t + 0.5 * gravityPxPerSec2 * t * t;
                    piece.rotation = targetRotation * state.phase;
                    piece.alpha = state.phase < fadeStartPhase ? 1 : 1 - ((state.phase - fadeStartPhase) / (1 - fadeStartPhase));
                })
                .onComplete(() => {
                    this.onRemove(piece);
                })
                .start()
            );
        });
    }
}
