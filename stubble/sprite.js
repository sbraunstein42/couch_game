export class Sprite {

    context;
    currentImage;
    scale;
    
    x; 
    y;
    
    width;
    height;

    xPivotPhase = .5;
    yPivotPhase = .5;

    // showBounds = true;

    renderOrder = 0;
    rotation = 0;
    alpha = 1;



    //alternatively, can animate
    idsForAnimationFrames;
    loopsRemaining;
    loopLengthMS;
    animationId;
    playStartTimeMS;
    previousIndex; //detects loops
    onComplete

    constructor(context, id, scale) {

        this.draw = this.draw.bind(this);
        this.setSprite = this.setSprite.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.setPivot = this.setPivot.bind(this);
        this.getBounds = this.getBounds.bind(this);
        this.setX = this.setX.bind(this);
        this.setY = this.setY.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.getPivotXOffset = this.getPivotXOffset.bind(this);
        this.getPivotYOffset = this.getPivotYOffset.bind(this);

        this.context = context;
        this.scale = scale;

        this.setSprite(id);

        this.width = this.currentImage.naturalWidth * this.scale;
        this.height = this.currentImage.naturalHeight * this.scale;
        this.x = this.context.canvas.width/2;
        this.y = this.context.canvas.height/2
    }

    setSprite(id) {
        this.currentImage = document.getElementById(id);
    }

    setPivot(xPivotPhase, yPivotPhase) {
        this.xPivotPhase = xPivotPhase;
        this.yPivotPhase = yPivotPhase;
    }

    setPosition(x, y) {
        this.setX(x);
        this.setY(y);
    }

    //if a sprite is 50x40 and pivot is in the middle, then the offest is the distance from the top left to the middle.
    //this function will return {x : 25, y : 20}. this is useful for animating when you
    //want to take the pivots out of the position and just adjust the positions raw
    getPivotXOffset() {
        return this.width * this.xPivotPhase;
    }

    getPivotYOffset() {
        return this.height * this.yPivotPhase;
    }

    setX(x) {
        this.x = x - this.getPivotXOffset();
    }

    setY(y) {
        this.y = y - this.getPivotYOffset();
    }

    draw() {
        if (!this.currentImage || !this.currentImage.complete) return;

        const pencil = this.context.pencil;
        pencil.save();
        pencil.globalAlpha = this.alpha;

        if (this.rotation !== 0) {
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            pencil.translate(cx, cy);
            pencil.rotate(this.rotation);
            pencil.drawImage(this.currentImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            pencil.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
        }

        pencil.restore();

        if(this.showBounds) {
            let markerSize = 10;
            let bounds = this.getBounds()
            let oldFillStyle = this.context.pencil.fillStyle;
            let oldStrokeStyle = this.context.pencil.strokeStyle;
            let oldLineWidth = this.context.pencil.lineWidth;
            
            this.context.pencil.strokeStyle = "#6565f34e"
            this.context.pencil.lineWidth = markerSize/4;

            this.context.pencil.beginPath();
            this.context.pencil.moveTo(bounds.x.min, bounds.y.min);
            this.context.pencil.lineTo(bounds.x.max, bounds.y.max);
            this.context.pencil.moveTo(bounds.x.min, bounds.y.max);
            this.context.pencil.lineTo(bounds.x.max, bounds.y.min);
            this.context.pencil.moveTo(bounds.x.min, bounds.y.min);
            this.context.pencil.lineTo(bounds.x.max, bounds.y.min);
            this.context.pencil.lineTo(bounds.x.max, bounds.y.max);
            this.context.pencil.lineTo(bounds.x.min, bounds.y.max);
            this.context.pencil.lineTo(bounds.x.min, bounds.y.min);

            this.context.pencil.stroke(); 
            this.context.pencil.closePath();

            this.context.pencil.fillStyle = "#ffda37a9"; // Set color to blue using hex code
            this.context.pencil.fillRect(
                this.x - markerSize + this.getPivotXOffset(), 
                this.y - markerSize + this.getPivotYOffset(), 
                markerSize * 2, 
                markerSize * 2
            ); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            
            this.context.pencil.fillStyle = "#2c2cffc8"; // Set color to blue using hex code
            
            this.context.pencil.fillRect(bounds.x.min - (markerSize/2), bounds.y.min - (markerSize/2), markerSize, markerSize); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            this.context.pencil.fillRect(bounds.x.min - (markerSize/2), bounds.y.max - (markerSize/2), markerSize, markerSize); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            this.context.pencil.fillRect(bounds.x.max - (markerSize/2), bounds.y.min - (markerSize/2), markerSize, markerSize); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            this.context.pencil.fillRect(bounds.x.max - (markerSize/2), bounds.y.max - (markerSize/2), markerSize, markerSize); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            
            this.context.pencil.fillStyle = oldFillStyle;
            this.context.pencil.strokeStyle = oldStrokeStyle;
            this.context.pencil.lineWidth = oldLineWidth;
        }
    
    }

    getBounds() {
        return {
            x : {min : this.x, max : this.x + this.width},
            y : {min : this.y, max: this.y + this.height}
        }
    }

    play(idsForAnimationFrame, fps, loops, onComplete) {
        this.stop();

        this.idsForAnimationFrames = idsForAnimationFrame;
        this.loopLengthMS = (1/fps) * idsForAnimationFrame.length * 1000;
        this.loops = loops ?? 0;
        this.previousLoopsCompleted = 0;
        this.onComplete = onComplete;

        this.animationId = requestAnimationFrame(this.onAnimationFrame)

        //returns milliseconds it will take for animation, -1 if infinite
        if(loops < 0) return Math.Infinity;

        let msPerFrame = 1000/fps;
        return loops * (msPerFrame * idsForAnimationFrame.length);
    }

    stop() {
        this.playStartTimeMS = undefined; //restart it
        this.previousLoopsCompleted = 0;
        cancelAnimationFrame(this.animationId);
    }

    /// PRIVATE DONT CALL FROM OUTSIDE
    onAnimationFrame(timeStamp) {

        if(this.playStartTimeMS === undefined) this.playStartTimeMS = timeStamp;

        let totalElapsedMS = timeStamp - this.playStartTimeMS;
        let loopsCompleted = Math.floor(totalElapsedMS / this.loopLengthMS);

        if(loopsCompleted > this.previousLoopsCompleted) {
            let delta = loopsCompleted - this.previousLoopsCompleted;
            this.previousLoopsCompleted = loopsCompleted;
            if(this.loops !== 0) {
                this.loops -= delta;
                if(this.loops == 0) {
                    this.stop();
                    if(this.onComplete) {
                        let callback = this.onComplete;
                        this.onComplete = undefined;
                        callback()
                    }
                    return;
                }
            }
        }

        let elapsedMS = totalElapsedMS % this.loopLengthMS;
        let phase = elapsedMS / this.loopLengthMS;
        let index = Math.floor(this.context.toolbox.lerp(0, this.idsForAnimationFrames.length, phase));

        this.setSprite(this.idsForAnimationFrames[index]);
        this.animationId = requestAnimationFrame(this.onAnimationFrame)
    }

}