// demo9Audio.js
// DEMO: SoundPlayer
//
// SoundPlayer (stubble/soundPlayer.js) wraps Howler.js for game audio:
//
//   playSound(src, volume, loop)
//     Creates a Howl and plays it immediately. Applies a small random pitch
//     shift (±5%) so repeated sounds don't feel mechanical.
//     Returns the Howl so you can stop/reference it later.
//
//   playTitleMusic() / stopTitleMusic()
//     Starts/stops the looping background track. Uses a single pre-created
//     Howl instance so calling play() twice doesn't stack concurrent copies.
//
//   makeMusicQuiet()
//     Drops music volume to 0.3 (e.g. while gameplay is happening).
//
//   pitchMusic(newPitch, durationMS)
//     Smoothly ramps the music playback rate to newPitch over durationMS.
//     1.0 = normal speed. 0 = stopped. Values above 1 speed it up.
//
// Click the buttons to try each feature.

import { SoundPlayer } from "../../../stubble/soundPlayer.js";
import { DemoBase } from "./demoBase.js";

// Buttons are defined as { label, x, y, w, h, color, action }
// x/y are canvas coordinates for the button center
const BTN_H = 64;
const BTN_W = 280;

export class Demo9Audio extends DemoBase {

    sounds = null;
    musicPlaying = false;
    lastPitch = null;
    buttons = [];

    constructor(context) {
        super(context);
    }

    enter() {
        super.enter("demo1");
        this.sounds = new SoundPlayer(this.context.toolbox);
        this.musicPlaying = false;
        this.lastPitch = null;

        let cx = this.context.canvas.width / 2;
        let rowY = (i) => 300 + i * (BTN_H + 20);

        this.buttons = [
            {
                label: "Play Hop",
                color: "#2a5a2a",
                hover: "#3a8a3a",
                y: rowY(0),
                action: () => {
                    this.sounds.playSound(["audio/hop.wav"], 1, false);
                    this.lastPitch = "hop.wav  (random pitch each time)";
                }
            },
            {
                label: "Play Fart",
                color: "#5a3a1a",
                hover: "#8a5a2a",
                y: rowY(1),
                action: () => {
                    let src = ["audio/fart1.wav", "audio/fart2.wav", "audio/fart3.wav"];
                    let pick = src[Math.floor(Math.random() * src.length)];
                    this.sounds.playSound([pick], 1, false);
                    this.lastPitch = pick + "  (random variant + pitch)";
                }
            },
            {
                label: "Play Explode",
                color: "#5a1a1a",
                hover: "#9a2a2a",
                y: rowY(2),
                action: () => {
                    this.sounds.playSound(["audio/bigExplode.wav"], 0.8, false);
                    this.lastPitch = "bigExplode.wav";
                }
            },
            {
                label: "Music: OFF",
                color: "#1a2a5a",
                hover: "#2a3a9a",
                y: rowY(3),
                isMusic: true,
                action: () => {
                    if (this.musicPlaying) {
                        this.sounds.stopTitleMusic();
                        this.musicPlaying = false;
                        this.lastPitch = "music stopped";
                    } else {
                        this.sounds.playTitleMusic();
                        this.musicPlaying = true;
                        this.lastPitch = "music playing at pitch 1.0";
                    }
                }
            },
            {
                label: "Pitch Down  (0.6)",
                color: "#3a1a5a",
                hover: "#5a2a9a",
                y: rowY(4),
                action: () => {
                    this.sounds.pitchMusic(0.6, 800);
                    this.lastPitch = "pitchMusic(0.6, 800ms)";
                }
            },
            {
                label: "Pitch Normal  (1.0)",
                color: "#3a1a5a",
                hover: "#5a2a9a",
                y: rowY(5),
                action: () => {
                    this.sounds.pitchMusic(1.0, 800);
                    this.lastPitch = "pitchMusic(1.0, 800ms)";
                }
            },
        ];

        // Attach canvas x/w to each button
        for (let btn of this.buttons) {
            btn.x = cx - BTN_W / 2;
            btn.w = BTN_W;
            btn.h = BTN_H;
        }
    }

    onCanvasClick(pt) {
        for (let btn of this.buttons) {
            if (pt.x >= btn.x && pt.x <= btn.x + btn.w &&
                pt.y >= btn.y && pt.y <= btn.y + btn.h) {
                btn.action();
                return;
            }
        }
    }

    exit() {
        super.exit();
        if (this.sounds) this.sounds.stopTitleMusic();
        this.sounds = null;
        this.buttons = [];
    }

    update() {
        this.drawBackground();

        let pencil = this.context.pencil;

        for (let btn of this.buttons) {
            // Update music button label based on state
            if (btn.isMusic) {
                btn.label = "Music:  " + (this.musicPlaying ? "ON  (click to stop)" : "OFF  (click to play)");
            }

            pencil.save();
            pencil.fillStyle = btn.color;
            pencil.strokeStyle = "#888888";
            pencil.lineWidth = 2;
            pencil.fillRect(btn.x, btn.y, btn.w, btn.h);
            pencil.strokeRect(btn.x, btn.y, btn.w, btn.h);
            pencil.font = "13px 'Press Start 2P'";
            pencil.textAlign = "center";
            pencil.textBaseline = "middle";
            pencil.fillStyle = "#ffffff";
            pencil.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
            pencil.restore();
        }

        if (this.lastPitch) {
            this.drawLabel("last action: " + this.lastPitch, this.context.canvas.width / 2, 840, "#ffdd55");
        }

        this.drawTitle("9. SoundPlayer");
        this.drawDescription(
            "SoundPlayer wraps Howler.js. playSound() applies random pitch per play.\n" +
            "Music uses one Howl instance to prevent concurrent copies.\n" +
            "pitchMusic() smoothly ramps playback rate over time."
        );

        return super.update();
    }
}
