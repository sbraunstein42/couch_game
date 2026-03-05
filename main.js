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
    deltaTimeMS : 0
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
currentState.enter();

function gameLoop(timeStamp) {

    context.deltaTimeMS = timeStamp - lastTime;
    lastTime = timeStamp;
    context.pencil.clearRect(0,0, canvas.width, canvas.height);
    
    let command = currentState.update();

    if(command) {
        currentState.exit();
        currentState =  states[command];
        if(!currentState) throw new Error("No state named: " + command);
        currentState.enter();
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

gameLoopId = requestAnimationFrame(gameLoop);