import { Sprite } from "../../stubble/sprite.js";
import { HoppingSprite } from "../../stubble/hoppingSprite.js";
import { Person } from "./person.js";

export class GameFactory {

    constructor(context, renderOrders) {
        this.context = context;
        this.renderOrders = renderOrders;
    }

    makeSittables() {
        let model = this.context.model;
        let canvas = this.context.canvas;
        let sittableData = model.getRandomSittables(model.howManyThingsOnCouch);
        return sittableData.map(s => {
            let sprite = new HoppingSprite(this.context, s.id, model.spriteScale);
            sprite.setPosition(canvas.width / 2, -100);
            sprite.renderOrder = this.renderOrders.itemOnCouch;
            sprite.mute = true;
            return sprite;
        });
    }

    makeCouch() {
        let model = this.context.model;
        let canvas = this.context.canvas;
        const couch = new Sprite(this.context, model.getNextCouch(), model.spriteScale);
        couch.renderOrder = this.renderOrders.couch;
        couch.setPosition(canvas.width / 2, canvas.height / 2);
        return couch;
    }

    makePeople() {
        let model = this.context.model;
        return model.getRandomPeople(model.howManyContestants).map(id => {
            let sprite = new Person(this.context, id, model.spriteScale);
            sprite.setAnimations(id);
            sprite.setIdle();
            sprite.renderOrder = this.renderOrders.inFrontOfCouch;
            return sprite;
        });
    }

    computeCouchPositions(couch, sittableHeight) {
        let model = this.context.model;
        let couchBounds = couch.getBounds();
        let onCouchY = couchBounds.y.max - (couch.height * .5) - (sittableHeight * .5);
        let sittableGap = model.spriteScale * 12.25;
        let currX = couch.x + (model.spriteScale * 1);

        let positionsOnCouch = [];
        let positionsBelowCouch = [];
        for (let i = 0; i < model.howManySpotsOnCouch; i++) {
            currX += sittableGap;
            positionsOnCouch.push({ x: currX, y: onCouchY });
            positionsBelowCouch.push({ x: currX, y: onCouchY + 100 });
        }
        return { positionsOnCouch, positionsBelowCouch };
    }
}
