import { Deck } from "../stubble/deck.js";

export class Model {

    //----------DEBUG_OPTIONS--------
    // mute = true;
    itemMoveDelayMult = 3;
    actionKey = "b";    
    
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
    music;
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
        },
        {
            id:     "sittable_pasta",
            name:   "Pasta",
            sounds: this.fartNoises,
            pieces: 6,
        },
    ])

    //ids of people
    people = new Deck([
        "fish",
        "green",
        "pink",
        "robot",
        "blue"
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
        this.playRandomSound = this.playRandomSound.bind(this);
        this.playSound = this.playSound.bind(this);
        this.playTitleMusic = this.playTitleMusic.bind(this);
        this.restartMusic = this.restartMusic.bind(this);
        this.makeMusicQuiet = this.makeMusicQuiet.bind(this);
        this.getEmptyIndexes = this.getEmptyIndexes.bind(this);
        this.playStaticSound = this.playStaticSound.bind(this);
        this.onEnteredGame = this.onEnteredGame.bind(this);
        this.pitchMusic = this.pitchMusic.bind(this);

        
    }

    onEnteredGame() {
        //populate couch array with "empty"
        this.peopleOnCouch = [];
        for(let i = 0; i < this.howManySpotsOnCouch; i++) {
            this.peopleOnCouch.push(this.empty);
        }
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
        const sittable = this.getSittableById(sittableId);
        if (!sittable) return undefined;
        return Array.from({ length: sittable.pieces }, (_, i) => `${sittableId}_${i + 1}`);
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

    playSittableSound(sittableId) {
        const sittable = this.getSittableById(sittableId);
        if (!sittable) return;
        const src = sittable.sounds[Math.floor(Math.random() * sittable.sounds.length)];
        return this.playSound([src]);
    }

    //don't like these async functions in the model, because it's async, but it's cleaner to have here
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

      async pitchMusic(newPitch, duration) {
      
        if (!this.music || !this.music.playing(this.musicId)) return;

        let currentPitch = this.music.rate(this.musicId);
        const intervalMS = 50;
        const steps = duration / intervalMS;
        const rateStep = (newPitch - currentPitch) / steps;

        for(let i = 0; i < steps; i++) {
            await this.toolbox.waitForMS(intervalMS);
            currentPitch += rateStep;
            this.music.rate(currentPitch, this.musicId);
        }

        this.music.rate(currentPitch, this.musicId);
    }

}