// demo7Deck.js
// DEMO: Deck
//
// The Deck class wraps an array and deals items one at a time in shuffled order.
//
//   let deck = new Deck([...items]);
//   let item = deck.take();          // gets the next item
//   let items = deck.takeMultiple(n); // gets n items at once
//
// When the deck runs out of items, it automatically reshuffles and starts over.
// This ensures every item appears roughly equally often before any repeats.
//
// Here a Deck of sittable sprite IDs is created. Click to draw the next one.
// Watch the counter — after 6 cards, the deck reshuffles and starts a new round.

import { Sprite } from "../../../stubble/sprite.js";
import { Deck } from "../../../stubble/deck.js";
import { DemoBase } from "./demoBase.js";

const SITTABLE_IDS = [
    "sittable_cake",
    "sittable_car",
    "sittable_earth",
    "sittable_hamburger",
    "sittable_pasta",
    "sittable_turtle",
];

export class Demo7Deck extends DemoBase {

    deck = null;
    drawnSprites = [];
    totalDrawn = 0;
    roundCount = 1;
    drawnThisRound = 0;

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo8");
        this.deck = new Deck([...SITTABLE_IDS]);
        this.drawnSprites = [];
        this.totalDrawn = 0;
        this.roundCount = 1;
        this.drawnThisRound = 0;
    }

    onCanvasClick(pt) {
        let id = this.deck.take();

        // Track deck rounds — the deck reshuffles every SITTABLE_IDS.length draws
        this.totalDrawn++;
        this.drawnThisRound++;
        if (this.drawnThisRound > SITTABLE_IDS.length) {
            this.drawnThisRound = 1;
            this.roundCount++;
        }

        // Keep only the most recent maxVisible sprites on screen
        let maxVisible = 7;
        if (this.drawnSprites.length >= maxVisible) {
            this.drawnSprites.shift();
        }

        let sprite = new Sprite(this.context, id, 6);
        this.drawnSprites.push(sprite);

        // Redistribute all sprites evenly across the center of the canvas
        let slotWidth = 200;
        let count = this.drawnSprites.length;
        let startX = this.context.canvas.width / 2 - (count - 1) * slotWidth / 2;
        for (let i = 0; i < count; i++) {
            this.drawnSprites[i].setPosition(startX + i * slotWidth, this.context.canvas.height / 2 + 70);
        }
    }

    exit() {
        super.exit();
        this.drawnSprites = [];
        this.deck = null;
    }

    update() {
        this.drawBackground();

        for (let sprite of this.drawnSprites) {
            sprite.draw();
        }

        // Highlight the most recent sprite
        if (this.drawnSprites.length > 0) {
            let last = this.drawnSprites[this.drawnSprites.length - 1];
            let pencil = this.context.pencil;
            pencil.save();
            pencil.strokeStyle = "#ffdd55";
            pencil.lineWidth = 3;
            pencil.strokeRect(last.x - 4, last.y - 4, last.width + 8, last.height + 8);
            pencil.restore();
        }

        this.drawTitle("7. Deck");
        this.drawDescription(
            "Deck shuffles an array and deals one item at a time with take().\n" +
            "When exhausted, it reshuffles automatically.\n" +
            "Click to draw the next card. Watch the round counter reset!"
        );

        let statusText = "drawn: " + this.totalDrawn + "  |  round: " + this.roundCount + "  |  this round: " + this.drawnThisRound + " / " + SITTABLE_IDS.length;
        this.drawLabel(statusText, this.context.canvas.width / 2, this.context.canvas.height - 120, "#ffdd55");

        if (this.totalDrawn === 0) {
            this.drawLabel("click anywhere to draw from the deck", this.context.canvas.width / 2, this.context.canvas.height / 2, "#888888");
        }

        return super.update();
    }
}
