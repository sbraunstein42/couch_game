import { Deck } from "./helpers/deck.js";

export class Model {

    empty = "empty";
    peopleOnCouch = [];
    spriteScale = 10;

    howManyContestants = 4;
    howManyThingsOnCouch = 1;
    howManySpotsOnCouch = 4;

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

        this.setPersonInCouchIndex = this.setPersonInCouchIndex.bind(this);
        this.isCouchSpotEmpty = this.isCouchSpotEmpty.bind(this);

        this.peopleOnCouch = [];
        for(let i = 0; i < this.howManySpotsOnCouch; i++) {
            this.peopleOnCouch.push(this.empty);
        }
    }

    setPersonInCouchIndex(index, personId) {
        this.peopleOnCouch[index] = personId;
    }

    isCouchSpotEmpty(index) {
        return this.peopleOnCouch[index] == this.empty;
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