import { Deck } from "./helpers/deck.js";

export class Model {

    spotsOnCouch = 4;
    empty = "empty";
    couchState;

    sittables = new Deck([
        "sprites/sittables/balloon.png",
        "sprites/sittables/cake.png",
        "sprites/sittables/car.png",
        "sprites/sittables/earth.png",
        "sprites/sittables/hamburger.png",
        "sprites/sittables/turtle.png",
    ])

    people = new Deck([
        "sprites/people/fish.png",
        "sprites/people/green.png",
        "sprites/people/pink.png",
        "sprites/people/robot.png"
    ]);

    couches = new Deck([
        "sprites/couches/orange.png"
    ]);

    constructor() {
        this.couchState = [];
        for(let i = 0; i < this.spotsOnCouch; i++) {
            this.couchState.push(this.empty);
        }
    }

    getRandomSittables(howMany) {
        return this.sittables.takeMultiple(howMany);
    }

    getRandomPeople(howMany) {
        return this.people.takeMultiple(howMany);
    }

    getRandomCouch() {
        return this.couches.take();
    }


}