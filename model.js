import { Deck } from "./helpers/deck.js";

export class Model {

    //debug options
    mute = true;

    empty = "empty";
    peopleOnCouch = [];
    spriteScale = 10;
    itemMoveDelayMult = 3;


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

    getRandomCouch() {
        return this.couches.take();
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