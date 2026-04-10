import { Deck } from "./helpers/deck.js";

export class Model {

    //debug options
    // mute = true;

    empty = "empty";
    peopleOnCouch = [];
    spriteScale = 10;
    itemMoveDelayMult = 3;
    actionKey = "b";


    //fast game
    // howManyContestants = 1;
    // howManyThingsOnCouch = 1;
    // howManySpotsOnCouch = 1;

    //real game
    howManyContestants = 4;
    howManyThingsOnCouch = 1;
    howManySpotsOnCouch = 4;

    toolbox;
    music;


    sittables = new Deck([
        // "sittable_balloon",
        "sittable_cake",
        "sittable_car",
        "sittable_earth",
        "sittable_hamburger",
        "sittable_turtle",
        "sittable_pasta",

    ])

    people = new Deck([
        "fish",
        "green",
        "pink",
        "robot",
        "blue"
    ]);

    couches = ["couch_orange", "couch_pink", "couch_red"];
    couchIndex = 0;

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

    sittableNames = {
        "sittable_cake":      "Cake",
        "sittable_car":       "Car",
        "sittable_earth":     "Earth",
        "sittable_hamburger": "Hamburger",
        "sittable_turtle":    "Turtle",
        "sittable_pasta":     "Pasta",
    }

    sittableSounds = {
        "sittable_cake":      ["audio/fart1.wav", "audio/fart2.wav", "audio/fart3.wav"],
        "sittable_pasta":     ["audio/fart1.wav", "audio/fart2.wav", "audio/fart3.wav"],
        "sittable_hamburger": ["audio/fart1.wav", "audio/fart2.wav", "audio/fart3.wav"],
        "sittable_car":       ["audio/bigExplode.wav"],
        "sittable_earth":     ["audio/bigExplode.wav"],
        "sittable_turtle":    ["audio/cuteExplode.wav"],
    }

    sittablePieces = {
        "sittable_cake":      ["sittable_cake_1", "sittable_cake_2", "sittable_cake_3", "sittable_cake_4", "sittable_cake_5", "sittable_cake_6"],
        "sittable_car":       ["sittable_car_1", "sittable_car_2", "sittable_car_3", "sittable_car_4", "sittable_car_5"],
        "sittable_earth":     ["sittable_earth_1", "sittable_earth_2", "sittable_earth_3", "sittable_earth_4", "sittable_earth_5", "sittable_earth_6"],
        "sittable_hamburger": ["sittable_hamburger_1", "sittable_hamburger_2", "sittable_hamburger_3", "sittable_hamburger_4"],
        "sittable_pasta":     ["sittable_pasta_1", "sittable_pasta_2", "sittable_pasta_3", "sittable_pasta_4", "sittable_pasta_5", "sittable_pasta_6"],
        "sittable_turtle":    ["sittable_turtle_1", "sittable_turtle_2", "sittable_turtle_3", "sittable_turtle_4"],
    }

    staticAnim = [
        "static1",
        "static2",
        "static3"
    ]

    constructor(toolbox) {

        this.toolbox = toolbox;
        
        this.setPersonInCouchIndex = this.setPersonInCouchIndex.bind(this);
        this.isCouchSpotEmpty = this.isCouchSpotEmpty.bind(this);
        this.playRandomSound = this.playRandomSound.bind(this);
        this.playSound = this.playSound.bind(this);
        this.playTitleMusic = this.playTitleMusic.bind(this);
        this.restartMusic = this.restartMusic.bind(this);
        this.makeMusicQuiet = this.makeMusicQuiet.bind(this);
        this.getEmptyIndexes = this.getEmptyIndexes.bind(this);
        this.playStaticSound = this.playStaticSound.bind(this);

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

    getPiecesFor(sittableId) {
        return this.sittablePieces[sittableId];
    }

    getNextCouch() {
        const id = this.couches[this.couchIndex % this.couches.length];
        this.couchIndex++;
        return id;
    }

    playRandomSound(name, variantCount) {
        let variant = this.toolbox.getRandomInt(1, variantCount);
        let src = ['audio/' + name + variant + '.wav'];
        return this.playSound(src);
    }

    playHopSound() {
        this.playSound(['audio/hop.wav'], .25);
    }

    playSound(src, volume, loop) {
        if(this.mute) return null;

        const sound = new Howl({
            src: src,
            preload: true,
            loop : loop
        })
        let pitch = Math.random() * .1 + .95;
        sound.volume(volume ?? 1);

        let id = sound.play(); 
        sound.rate(pitch, id);

        return sound;
    }

    playTitleMusic() {
        this.music = new Howl({
            src: ['audio/music/spanish_flea.mp3'],
            preload: true,
            loop: true
        });
        this.music.volume(this.mute ? 0 : 1);
        this.musicId = this.music.play();
    }

    stopTitleMusic() {
        this.music.stop();
        this.music = undefined;
    }

    makeMusicQuiet() {
        if(!this.music) this.playTitleMusic();

        if(this.mute) return;
        this.music.volume(0.3);
    }

    restartMusic() {
        if (!this.music) return;
        this.music.rate(1.0, this.musicId);
        this.music.play(this.musicId);
    }

    //need an array of the indexes that are empty on the couch.
    getEmptyIndexes() {
        let emptyIndexes = [];
        for(let i = 0; i < this.howManySpotsOnCouch; i++) {
            if(this.isCouchSpotEmpty(i)) {
                emptyIndexes.push(i);
            }
        }
        return emptyIndexes;
    }

    playSittableSound(sittableId) {
        const sounds = this.sittableSounds[sittableId];
        if (!sounds) return;
        const src = sounds[Math.floor(Math.random() * sounds.length)];
        return this.playSound([src]);
    }

    async playStaticSound(duration) {
        this.playSound(['audio/click.wav']);
        let staticSound = this.playSound(['audio/static.mp3'], .5, true);
        let delayBeforeClickOff = duration * .95;
        let delayBeforeStaticOff = duration * .05;
        await this.toolbox.waitForMS(delayBeforeClickOff);
        this.playSound(['audio/click.wav']);
        await this.toolbox.waitForMS(delayBeforeStaticOff);
        staticSound?.stop();
    }




    
    


}