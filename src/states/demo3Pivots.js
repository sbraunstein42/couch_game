// demo3Pivots.js
// DEMO: Pivots
//
// Every Sprite has a pivot point defined by (xPivotPhase, yPivotPhase),
// both in the range 0-1. The default is (0.5, 0.5) — the center.
//
// The pivot affects how setPosition(x, y) works:
//   setPosition places the pivot at the given canvas coordinates.
//   A pivot of (0, 0) means setPosition places the top-left corner.
//   A pivot of (0.5, 0.5) means setPosition places the center.
//   A pivot of (1, 1) means setPosition places the bottom-right corner.
//
// showBounds = true reveals:
//   - The bounding box (blue outline + corner squares)
//   - The pivot point (yellow filled square)
//
// When you call hopTo() or animate position, all movement is in pivot space.
//
// Click anywhere to cycle through pivot presets.

import { Sprite } from "../../../stubble/sprite.js";
import { DemoBase } from "./demoBase.js";

const PIVOTS = [
    { x: 0.5, y: 0.5, label: "setPivot(0.5, 0.5)  center (default)" },
    { x: 0.0, y: 0.0, label: "setPivot(0, 0)  top-left" },
    { x: 1.0, y: 0.0, label: "setPivot(1, 0)  top-right" },
    { x: 0.5, y: 0.0, label: "setPivot(0.5, 0)  top-center" },
    { x: 0.5, y: 1.0, label: "setPivot(0.5, 1)  bottom-center" },
    { x: 1.0, y: 1.0, label: "setPivot(1, 1)  bottom-right" },
];

export class Demo3Pivots extends DemoBase {

    sprite = null;
    pivotIndex = 0;

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo4");
        this.pivotIndex = 0;

        this.sprite = new Sprite(this.context, "fish", 10);
        this.sprite.showBounds = true;
        this.applyPivot();
    }

    applyPivot() {
        let p = PIVOTS[this.pivotIndex];
        this.sprite.setPivot(p.x, p.y);
        // Always place the pivot at the same screen point so you can see it move
        this.sprite.setPosition(
            this.context.canvas.width / 2,
            this.context.canvas.height / 2 + 60
        );
    }

    onCanvasClick(pt) {
        this.pivotIndex = (this.pivotIndex + 1) % PIVOTS.length;
        this.applyPivot();
    }

    exit() {
        super.exit();
        this.sprite = null;
    }

    update() {
        this.drawBackground();

        // Draw a crosshair at the anchor point so you can see where setPosition aimed
        let anchorX = this.context.canvas.width / 2;
        let anchorY = this.context.canvas.height / 2 + 60;
        let pencil = this.context.pencil;
        pencil.save();
        pencil.strokeStyle = "#ff4444";
        pencil.lineWidth = 2;
        pencil.beginPath();
        pencil.moveTo(anchorX - 20, anchorY);
        pencil.lineTo(anchorX + 20, anchorY);
        pencil.moveTo(anchorX, anchorY - 20);
        pencil.lineTo(anchorX, anchorY + 20);
        pencil.stroke();
        pencil.restore();

        this.sprite.draw();

        this.drawTitle("3. Pivots");
        this.drawDescription(
            "setPivot(xPhase, yPhase) sets the anchor point (0-1 range).\n" +
            "setPosition() places that anchor at the target coords (red cross).\n" +
            "Yellow square = pivot.  Click to cycle pivot presets."
        );

        let p = PIVOTS[this.pivotIndex];
        this.drawLabel(p.label, this.context.canvas.width / 2, this.context.canvas.height - 120, "#ffdd55");

        return super.update();
    }
}
