import { Deck } from "./helpers/deck.js";

export class Model {

    //debug options
    // mute = true;


    empty = "empty";
    peopleOnCouch = [];
    spriteScale = 10;

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

    constructor(toolbox) {

        this.toolbox = toolbox;
        
        this.setPersonInCouchIndex = this.setPersonInCouchIndex.bind(this);
        this.isCouchSpotEmpty = this.isCouchSpotEmpty.bind(this);
        this.getRandomSound = this.getRandomSound.bind(this);
        this.playSound = this.playSound.bind(this);
        this.playTitleMusic = this.playTitleMusic.bind(this);
        this.pitchDownMusicThenFart = this.pitchDownMusicThenFart.bind(this);

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

    getRandomSound(name, variantCount) {
        let variant = this.toolbox.getRandomInt(1, variantCount);
        return ['../audio/' + name + variant + '.wav']
    }

    playSound(name, variantCount) {
        if(this.mute) return null;

        const sound = new Howl({
            src: this.getRandomSound(name, variantCount),
            preload: true
        })
        sound.play();
        return sound;
    }

    playTitleMusic() {
        this.music = new Howl({
            src: ['../audio/music/spanish_flea.mp3'],
            preload: true
        });
        this.music.play();
    }

    async pitchDownMusicThenFart() {
        if (!this.music || !this.music.playing()) return;

        const duration = 1000;
        const interval = 30;
        const targetRate = 0.05;
        const steps = duration / interval;
        const rateStep = (1.0 - targetRate) / steps;
        let currentRate = 1.0;

        await new Promise(resolve => {
            const iv = setInterval(() => {
                currentRate -= rateStep;
                if (currentRate <= targetRate) {
                    this.music.stop();
                    clearInterval(iv);
                    resolve();
                } else {
                    this.music.rate(currentRate);
                }
            }, interval);
        });

        await this.toolbox.waitForMS(800);
        this.playSound("fart", 1);
    }
    


}