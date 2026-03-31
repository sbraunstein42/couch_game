import { Game } from "./states/game.js";
import { GameOver } from "./states/gameOver.js";
import { Title } from "./states/title.js";
import { Toolbox } from "./helpers/toolbox.js";
import { Model } from "./model.js";

let canvas = document.getElementById("myCanvas");
let lastTime = performance.now();
let gameLoopId;

let context = {
    canvas : canvas,
    pencil : canvas.getContext("2d"), 
    toolbox : new Toolbox(),
    model : new Model(),
    deltaTimeMS : 0,
    tweens : []
}

//pixel art please
context.pencil.imageSmoothingEnabled = false;

//make states
let states = {
    game : new Game(context),
    gameOver : new GameOver(context),
    title : new Title(context)
}

//enter title
let currentState = states.title;

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

window.onload = function() {
    console.log("Loaded in " + (Date.now() - startLoad) + "ms.");
    currentState.enter();
    gameLoopId = requestAnimationFrame(gameLoop);
};
