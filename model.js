import { Deck } from "./helpers/deck.js";

export class Model {

    spotsOnCouch = 4;
    empty = "empty";
    couchState;
    spriteScale = 10;


    sittables = new Deck([
        // "sittable_balloon",
        "sittable_cake",
        "sittable_car",
        "sittable_earth",
        "sittable_hamburger",
        "sittable_turtle",
    ])

    people = new Deck([
        "people_fish",
        "people_green",
        "people_pink",
        "people_robot"
    ]);

    couches = new Deck([
        "couch_orange"
    ]);

    titleAnim = [
        "title1",
        "title2",
        "title3",
        "title4",
    ];

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