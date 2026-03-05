export class Sprite {

    context;
    currentImage;
    scale;
    width;
    height;

    //alternatively, can animate
    pathsForAnimationFrames;
    loopsRemaining;
    loopLengthMS;
    animationId;
    playStartTimeMS;
    previousIndex = 0; //detects loops
    onComplete

    constructor(context, path, scale) {

        this.draw = this.draw.bind(this);
        this.setPath = this.setPath.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        this.currentImage = new Image();
        this.setPath(path);
        this.context = context;
        this.scale = scale;

        this.width = this.currentImage.naturalWidth * this.scale;
        this.height = this.currentImage.naturalHeight * this.scale;
    }

    setPath(path) {
        this.currentImage.src = path;
    }

    draw(x, y) {
        this.context.pencil.drawImage(this.currentImage, x, y, this.width, this.height);
    }

    play(pathsForAnimationFrames, fps, loops, onComplete) {
        this.pathsForAnimationFrames = pathsForAnimationFrames;
        this.loopLengthMS = (1/fps) * pathsForAnimationFrames.length * 1000;
        this.loops = loops ?? 0;
        this.playStartTimeMS = performance.now();
        this.onComplete = onComplete;

        this.animationId = requestAnimationFrame(this.onAnimationFrame)
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }


    /// PRIVATE DONT CALL FROM OUTSIDE
    onAnimationFrame(timeStamp) {

        let elapsedMS = (timeStamp - this.playStartTimeMS) % this.loopLengthMS;
        let phase = elapsedMS/this.loopLengthMS;
        let index = this.context.toolbox.lerp(0, this.pathsForAnimationFrames.length - .001, phase);
        index = Math.floor(index);
        let isNewFrame = this.previousIndex !== index;
        let isNewLoop = isNewFrame && index == 0;
        if(isNewLoop) {
            this.loops--;
            if(this.loops == 0) {
                if(this.onComplete) {
                    this.onComplete();
                    this.onComplete = undefined;
                }
                this.stop();
                return;
            }
        }
        this.setPath(this.pathsForAnimationFrames[index])

        this.animationId = requestAnimationFrame(this.onAnimationFrame)
    }

}