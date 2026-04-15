import { Game } from "./states/game.js";
import { Title } from "./states/title.js";
import { Splash } from "./states/splash.js";
import { Toolbox } from "../stubble/toolbox.js";
import { Model } from "./model.js";
import { CouchSounds } from "./game/couchSounds.js";

let canvas = document.getElementById("myCanvas");
let lastTime = performance.now();
let gameLoopId;
let toolbox = new Toolbox();

//context is a set of things that every class needs.
let model = new Model(toolbox);
let context = {
    canvas : canvas,
    pencil : canvas.getContext("2d"),
    toolbox : toolbox,
    model : model,
    sounds : new CouchSounds(toolbox, model),
    deltaTimeMS : 0,
    tweens : []
}

//pixel art please
context.pencil.imageSmoothingEnabled = false;

//make states
let states = {
    game : new Game(context),
    title : new Title(context),
    splash : new Splash(context),
}

//enter splash on first load
let currentState = states.splash;

/* this game loop is running in a requestAnimationFrame loop
and timestamp is important because it allows us to know deltaTimeMS,
which is crucial for even-looking animation. */
function gameLoop(timeStamp) {
    context.deltaTimeMS = timeStamp - lastTime;
    lastTime = timeStamp;
    context.pencil.clearRect(0,0, canvas.width, canvas.height);
    
    let command = currentState.update();

    context.tweens = context.tweens.filter(x => x._isPlaying);
    context.tweens.forEach(x => x.update());

    if(command) {
        currentState.exit();
        currentState.command = undefined; //reset for next time
        currentState =  states[command];
        if(!currentState) throw new Error("No state named: " + command);
        currentState.enter();
    }
    gameLoopId = requestAnimationFrame(gameLoop);


}

//start the game only when everything is loaded
let startLoad = Date.now();

/* we only start doing stuff after onload, otherwise we end up
with a lot of half-loaded classes. */
window.onload = function() {
    console.log("Loaded in " + (Date.now() - startLoad) + "ms.");
    currentState.enter();
    gameLoopId = requestAnimationFrame(gameLoop);
};

let paused = false;

function blockInputWhilePaused(e) {
    if (paused) e.stopImmediatePropagation();
}
document.addEventListener("click",   blockInputWhilePaused, true);
document.addEventListener("keydown", blockInputWhilePaused, true);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        paused = true;
        cancelAnimationFrame(gameLoopId);
        if (context.sounds.music) context.sounds.music.pause();
    } else {
        paused = false;
        lastTime = performance.now();
        gameLoopId = requestAnimationFrame(gameLoop);
        if (context.sounds.music) context.sounds.music.play(context.sounds.musicId);
    }
});
