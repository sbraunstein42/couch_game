import { SoundPlayer } from "../../stubble/soundPlayer.js";

export class CouchSounds extends SoundPlayer {

    // mute = true;

    constructor(toolbox, model) {
        super(toolbox);
        this.model = model;

        // pre-load so there's no delay when the static effect fires
        this.staticHowl = new Howl({ src: ['audio/static.mp3'], preload: true, loop: true });
        this.clickHowl  = new Howl({ src: ['audio/click.wav'],  preload: true });
    }

    playRandomSound(name, variantCount) {
        if (this.mute) return;
        let variant = this.model.toolbox.getRandomInt(1, variantCount);
        let src = ['audio/' + name + variant + '.wav'];
        return this.playSound(src);
    }

    playHopSound() {
        this.playSound(['audio/hop.wav'], .25);
    }

    playSittableSound(sittableId) {
        let sittable = this.model.getSittableById(sittableId);
        if (!sittable) return;
        let src = sittable.sounds[Math.floor(Math.random() * sittable.sounds.length)];
        return this.playSound([src]);
    }

    async playStaticSound(duration) {
        if (this.mute) return;
        this.clickHowl.play();
        this.staticHowl.volume(0.5);
        this.staticHowl.play();
        let delayBeforeClickOff = duration * .95;
        let delayBeforeStaticOff = duration * .05;
        await this.model.toolbox.waitForMS(delayBeforeClickOff);
        this.clickHowl.play();
        await this.model.toolbox.waitForMS(delayBeforeStaticOff);
        this.staticHowl.stop();
    }
}
