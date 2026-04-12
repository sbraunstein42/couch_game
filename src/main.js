import { Toolbox } from "../stubble/toolbox.js";
import { Demo1Sprites } from "./states/demos/demo1Sprites.js";
import { Demo2RenderOrder } from "./states/demos/demo2RenderOrder.js";
import { Demo3Pivots } from "./states/demos/demo3Pivots.js";
import { Demo4Animation } from "./states/demos/demo4Animation.js";
import { Demo5Hopping } from "./states/demos/demo5Hopping.js";
import { Demo6Tinting } from "./states/demos/demo6Tinting.js";
import { Demo7Deck } from "./states/demos/demo7Deck.js";
import { Demo8Explosion } from "./states/demos/demo8Explosion.js";
import { Demo9Audio } from "./states/demos/demo9Audio.js";

let canvas = document.getElementById("myCanvas");
let lastTime = performance.now();
let toolbox = new Toolbox();

// Minimal context for the demo — no full Model or CouchSounds needed.
// spriteScale is included because Explosion uses context.model.spriteScale
// to size piece sprites.
let model = { spriteScale: 8 };

let context = {
    canvas: canvas,
    pencil: canvas.getContext("2d"),
    toolbox: toolbox,
    model: model,
    deltaTimeMS: 0,
    tweens: []
};

// Pixel art rendering — disable smoothing so scaled sprites stay crisp
context.pencil.imageSmoothingEnabled = false;

// Each demo's enter() receives the key name of the next state so it can
// set this.command when the NEXT button is clicked. The states loop back
// to demo1 after the last one.
let states = {
    demo1: new Demo1Sprites(context),
    demo2: new Demo2RenderOrder(context),
    demo3: new Demo3Pivots(context),
    demo4: new Demo4Animation(context),
    demo5: new Demo5Hopping(context),
    demo6: new Demo6Tinting(context),
    demo7: new Demo7Deck(context),
    demo8: new Demo8Explosion(context),
    demo9: new Demo9Audio(context),
};

let currentState = states.demo1;

/* this game loop is running in a requestAnimationFrame loop
and timestamp is important because it allows us to know deltaTimeMS,
which is crucial for even-looking animation. */
function gameLoop(timeStamp) {
    context.deltaTimeMS = timeStamp - lastTime;
    lastTime = timeStamp;
    context.pencil.clearRect(0, 0, canvas.width, canvas.height);

    let command = currentState.update();

    context.tweens = context.tweens.filter(x => x._isPlaying);
    context.tweens.forEach(x => x.update());

    if (command) {
        currentState.exit();
        currentState.command = undefined;
        currentState = states[command];
        if (!currentState) throw new Error("No state named: " + command);
        currentState.enter();
    }

    requestAnimationFrame(gameLoop);
}

/* we only start doing stuff after onload, otherwise we end up
with a lot of half-loaded classes. */
window.onload = function() {
    currentState.enter();
    requestAnimationFrame(gameLoop);
};
