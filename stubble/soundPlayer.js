export class SoundPlayer {

    music;
    musicId;
    musicHowl;

    constructor(toolbox) {
        this.toolbox = toolbox;
        this.musicHowl = new Howl({
            src: ['audio/music/spanish_flea.mp3'],
            preload: true,
            loop: true
        });
    }

    playSound(src, volume, loop) {
        let sound = new Howl({
            src: src,
            preload: true,
            loop: loop
        });
        let pitch = Math.random() * .1 + .95;
        sound.volume(volume ?? 1);
        let id = sound.play();
        sound.rate(pitch, id);
        return sound;
    }

    playTitleMusic() {
        this.musicHowl.volume(1);
        this.music = this.musicHowl;
        this.musicId = this.musicHowl.play();
    }

    stopTitleMusic() {
        if (!this.music) return;
        this.music.stop();
        this.music = undefined;
    }

    makeMusicQuiet() {
        if (!this.music) this.playTitleMusic();
        this.music.volume(0.3);
    }

    restartMusic() {
        if (!this.music) return;
        this.music.rate(1.0, this.musicId);
        this.music.play(this.musicId);
    }

    async pitchMusic(newPitch, duration) {
        if (!this.music || !this.music.playing(this.musicId)) return;

        let currentPitch = this.music.rate(this.musicId);
        let intervalMS = 50;
        let steps = duration / intervalMS;
        let rateStep = (newPitch - currentPitch) / steps;

        for (let i = 0; i < steps; i++) {
            await this.toolbox.waitForMS(intervalMS);
            if (!this.music) return;
            currentPitch += rateStep;
            this.music.rate(currentPitch, this.musicId);
        }

        if (this.music) this.music.rate(currentPitch, this.musicId);
    }
}
