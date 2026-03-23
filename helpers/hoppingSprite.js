import { Sprite } from "./sprite.js";
import { Toolbox } from "./toolbox.js";
import * as TWEEN from "./tween.esm.js";

export class HoppingSprite extends Sprite {

    hopHeight = -30;

    constructor(context, path, scale) {

        super(context, path, scale);
                this.hopTo = this.hopTo.bind(this)

    }

    hopTo(x, y, duration, hops) {

        //it's assumed that x and y are in pivoted space, so we have to depivot these
        //positions so that when we set the positions they're re-pivoted

        let hopDurationMS = duration/hops;
        let currentHopStart = {x : this.x , y : this.y};
        let hopMovement = {
            x : (x - this.x - this.getPivotXOffset())/hops,
            y : (y - this.y - this.getPivotYOffset())/hops
        }

        for(let j = 0; j < hops; j++) {
            let hopXStart = { x : currentHopStart.x };
            let hopXFinish = { x : currentHopStart.x + hopMovement.x };
            let hopYStart = { y : currentHopStart.y };
            let hopYFinish = {y : currentHopStart.y + hopMovement.y};
            let hopYMiddle = { y : ((currentHopStart.y + hopYFinish.y)/2) + this.hopHeight };

            // console.log(j + " start " + hopYStart.y + ", mid: " + hopYMiddle.y + ", " + hopYFinish.y);

            let baseDelay = j * hopDurationMS;

            //tween x
            this.context.tweens.push(new TWEEN.Tween(hopXStart)
                .to(hopXFinish, hopDurationMS)
                .delay(baseDelay)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(() => {
                    this.x = hopXStart.x;
                })
                .start());
            
            //then up and down
            this.context.tweens.push(new TWEEN.Tween(hopYStart)
                .to(hopYMiddle, hopDurationMS/2)
                .delay(baseDelay)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(() => {
                    this.y = hopYStart.y;
                })
                .start());
            this.context.tweens.push(new TWEEN.Tween(hopYMiddle)
                .to(hopYFinish, hopDurationMS/2)
                .easing(TWEEN.Easing.Cubic.In)
                .delay(baseDelay + (hopDurationMS/2))
                .onUpdate(() => {
                    this.y = hopYMiddle.y;
                })
                .start());

            currentHopStart = {
                x : currentHopStart.x + hopMovement.x,
                y : currentHopStart.y + hopMovement.y
            }
        }
    }

}
