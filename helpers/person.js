import { HoppingSprite } from "./hoppingSprite.js";

export class Person extends HoppingSprite {

    isSeated = false;

    idleId;
    sitId;
    surpriseId;
    thinkId;

    setAnimations(baseId) {
        this.idleId = baseId;
        this.sitId = baseId + "_sit";
        this.surpriseId = baseId + "_surprise";
        this.thinkId = baseId + "_think";
    }

    setIdle()     { this.setSprite(this.idleId); }
    setSit()      { this.setSprite(this.sitId); }
    setSurprise() { this.setSprite(this.surpriseId); }
    setThink()    { this.setSprite(this.thinkId); }
}