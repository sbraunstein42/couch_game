import { Deck } from "../stubble/deck.js";

//the model is the place where data gets stored

export class Model {

    //----------DEBUG_OPTIONS--------
    itemMoveDelayMult = 3;
    actionKey = "r"; //r does nothing in photoshop

    // uncomment for fast game
    // howManyContestants = 1;
    // howManyThingsOnCouch = 1;
    // howManySpotsOnCouch = 1;

    //real game
    howManyContestants = 4;
    howManyThingsOnCouch = 1;
    howManySpotsOnCouch = 4;
    //--------------------------------

    //state
    toolbox;
    peopleOnCouch;
    couchIndex = 0;

    //constants:
    empty = "empty";
    spriteScale = 10;

    //sounds
    fartNoises = ["audio/fart1.wav", "audio/fart2.wav", "audio/fart3.wav"];
    cuteNoises = ["audio/cuteExplode.wav"];
    explodeNoises = ["audio/bigExplode.wav"];

    //items that explode when sat on
    sittables = new Deck([
        {
            id:     "sittable_cake",
            name:   "Cake",
            sounds: this.fartNoises,
            pieces: 6,
        },
        {
            id:     "sittable_car",
            name:   "Car",
            sounds: this.explodeNoises,
            pieces: 5,
        },
        {
            id:     "sittable_earth",
            name:   "Earth",
            sounds: this.explodeNoises,
            pieces: 6,
        },
        {
            id:     "sittable_hamburger",
            name:   "Hamburger",
            sounds: this.fartNoises,
            pieces: 4,
        },
        {
            id:     "sittable_turtle",
            name:   "Turtle",
            sounds: this.cuteNoises,
            pieces: 4,
            pieceTypes: {
                "sittable_turtle_1": "floorWalker",
                "sittable_turtle_2": "floorWalker",
                "sittable_turtle_3": "floorWalker",
            },
        },
        {
            id:     "sittable_pasta",
            name:   "Pasta",
            sounds: this.fartNoises,
            pieces: 6,
        },
        {
            id:     "sittable_banana",
            name:   "Banana",
            sounds: this.fartNoises,
            pieces: 3,
        },
        {
            id:     "sittable_cookie",
            name:   "Cookie",
            sounds: this.fartNoises,
            pieces: 6,
        },
        {
            id:     "sittable_donut",
            name:   "Donut",
            sounds: this.fartNoises,
            pieces: 5,
        },
        {
            id:     "sittable_egg",
            name:   "Egg",
            sounds: this.cuteNoises,
            pieces: 5,
            pieceTypes: {
                "sittable_egg_1": "floorWalker",
            },
        },
        {
            id:     "sittable_flower",
            name:   "Flower",
            sounds: this.cuteNoises,
            pieces: 6,
            pieceTypes: {
                "sittable_flower_1": "bee",
                "sittable_flower_2": "bee",
            },
        },
        {
            id:     "sittable_rainbow",
            name:   "Rainbow",
            sounds: this.cuteNoises,
            pieces: 6,
        },
    ])

    //ids of people
    people = new Deck([
        "fish",
        "green",
        "pink",
        "robot",
        "blue",
        "compost",
    ]);

    //ids of couches, advance through these as you play
    couches = [
        "couch_orange",
        "couch_pink",
        "couch_red"
    ];

    //animations
    titleAnim = [
        "title1",
        "title2",
        "title3",
        "title4",
    ];

    titleDecorateAnim = [
        "title5"
    ]

    titleWiggleAnim = [
        "title6",
        "title7",
    ];

    japaneseStarAnim = [
        "japaneseStar1",
        "japaneseStar2"
    ]

    youWinAnim = [
        "youWin1",
        "youWin2",
        "youWin3",
    ]

    youWinWiggleAnim = [
        "youWin4",
        "youWin5",
    ]

    staticAnim = [
        "static1",
        "static2",
        "static3"
    ]

    constructor(toolbox) {
        this.toolbox = toolbox;
        this.setPersonInCouchIndex = this.setPersonInCouchIndex.bind(this);
        this.isCouchSpotEmpty = this.isCouchSpotEmpty.bind(this);
        this.getEmptyIndexes = this.getEmptyIndexes.bind(this);
        this.onEnteredGame = this.onEnteredGame.bind(this);
    }

    onEnteredGame() {
        //populate couch array with "empty"
        this.peopleOnCouch = [];
        for(let i = 0; i < this.howManySpotsOnCouch; i++) {
            this.peopleOnCouch.push(this.empty);
        }
    }

    getEmptyIndexes() {
        let emptyIndexes = [];
        for(let i = 0; i < this.howManySpotsOnCouch; i++) {
            if(this.isCouchSpotEmpty(i)) {
                emptyIndexes.push(i);
            }
        }
        return emptyIndexes;
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

    getSittableById(id) {
        return this.sittables.items.find(s => s.id === id);
    }

    getPiecesFor(sittableId) {
        let sittable = this.getSittableById(sittableId);
        if (!sittable) return undefined;
        return Array.from({ length: sittable.pieces }, (_, i) => `${sittableId}_${i + 1}`);
    }

    getSpecialPiecesFor(sittableId) {
        let sittable = this.getSittableById(sittableId);
        return sittable?.pieceTypes ?? {};
    }

    getNextCouch() {
        let id = this.couches[this.couchIndex % this.couches.length];
        this.couchIndex++;
        return id;
    }
}
