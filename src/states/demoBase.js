// demoBase.js
// Base class for all demo states. Provides:
//   - A "NEXT" button in the bottom-right corner that transitions to the next state
//   - drawTitle(text)       — large header at the top
//   - drawDescription(text) — smaller multi-line text below the title (split on \n)
//   - drawLabel(text, x, y) — small centered label at an arbitrary canvas position
//   - onCanvasClick(pt)     — override in subclasses to handle non-button clicks
//                             pt = { x, y } in canvas space
//
// Subclass enter() must call super.enter(nextStateName).
// Subclass exit() must call super.exit() — this removes the click listener and clears tweens.
// Subclass update() must call super.update() and return its result.

export class DemoBase {

    context;
    nextStateName;
    command;

    btnW = 200;
    btnH = 52;
    btnMarginX = 30;
    btnMarginY = 30;

    constructor(context) {
        this.context = context;
        this.onClick = this.onClick.bind(this);
        this.getCanvasPoint = this.getCanvasPoint.bind(this);
        this.onCanvasClick = this.onCanvasClick.bind(this);
    }

    // Maps a DOM event's client coordinates to canvas pixel coordinates,
    // accounting for any CSS scaling of the canvas element.
    getCanvasPoint(clientX, clientY) {
        let rect = this.context.canvas.getBoundingClientRect();
        let scaleX = this.context.canvas.width / rect.width;
        let scaleY = this.context.canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    enter(nextStateName) {
        this.nextStateName = nextStateName;
        this.command = undefined;
        document.addEventListener("click", this.onClick);
    }

    exit() {
        document.removeEventListener("click", this.onClick);
        this.context.tweens = [];
    }

    onClick(e) {
        let pt = this.getCanvasPoint(e.clientX, e.clientY);
        let btnX = this.context.canvas.width - this.btnW - this.btnMarginX;
        let btnY = this.context.canvas.height - this.btnH - this.btnMarginY;

        if (pt.x >= btnX && pt.x <= btnX + this.btnW &&
            pt.y >= btnY && pt.y <= btnY + this.btnH) {
            this.command = this.nextStateName;
            return;
        }

        this.onCanvasClick(pt);
    }

    // Hook: override in subclasses to respond to clicks outside the Next button.
    onCanvasClick(pt) {}

    drawBackground() {
        let pencil = this.context.pencil;
        pencil.fillStyle = "#1a1a2e";
        pencil.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    drawTitle(text) {
        let pencil = this.context.pencil;
        pencil.save();
        pencil.font = "32px 'Press Start 2P'";
        pencil.textAlign = "center";
        pencil.textBaseline = "top";
        pencil.lineWidth = 6;
        pencil.strokeStyle = "#000000";
        pencil.fillStyle = "#ffffff";
        pencil.strokeText(text, this.context.canvas.width / 2, 28);
        pencil.fillText(text, this.context.canvas.width / 2, 28);
        pencil.restore();
    }

    drawDescription(text) {
        let pencil = this.context.pencil;
        let lines = text.split("\n");
        pencil.save();
        pencil.font = "13px 'Press Start 2P'";
        pencil.textAlign = "center";
        pencil.textBaseline = "top";
        pencil.fillStyle = "#aabbdd";
        for (let i = 0; i < lines.length; i++) {
            pencil.fillText(lines[i], this.context.canvas.width / 2, 88 + i * 26);
        }
        pencil.restore();
    }

    drawLabel(text, x, y, color) {
        let pencil = this.context.pencil;
        pencil.save();
        pencil.font = "11px 'Press Start 2P'";
        pencil.textAlign = "center";
        pencil.textBaseline = "top";
        pencil.fillStyle = color ?? "#cccccc";
        pencil.fillText(text, x, y);
        pencil.restore();
    }

    drawNextButton() {
        let pencil = this.context.pencil;
        let btnX = this.context.canvas.width - this.btnW - this.btnMarginX;
        let btnY = this.context.canvas.height - this.btnH - this.btnMarginY;

        pencil.save();
        pencil.fillStyle = "#2a2a6a";
        pencil.strokeStyle = "#6666cc";
        pencil.lineWidth = 3;
        pencil.fillRect(btnX, btnY, this.btnW, this.btnH);
        pencil.strokeRect(btnX, btnY, this.btnW, this.btnH);
        pencil.font = "16px 'Press Start 2P'";
        pencil.textAlign = "center";
        pencil.textBaseline = "middle";
        pencil.fillStyle = "#ffffff";
        pencil.fillText("NEXT  →", btnX + this.btnW / 2, btnY + this.btnH / 2);
        pencil.restore();
    }

    update() {
        this.drawNextButton();
        return this.command;
    }
}
