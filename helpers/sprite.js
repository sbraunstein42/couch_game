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

    showBounds;



    //alternatively, can animate
    idsForAnimationFrames;
    loopsRemaining;
    loopLengthMS;
    animationId;
    playStartTimeMS;
    previousIndex = 0; //detects loops
    onComplete

    constructor(context, path, scale) {

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

        this.currentImage = new Image();
        this.setSprite(path);
        this.context = context;
        this.scale = scale;

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

    setX(x) {
        this.x = x - (this.width * this.xPivotPhase);
    }

    setY(y) {
        this.y = y - (this.height * this.yPivotPhase);
    }

    draw() {
        this.context.pencil.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
    
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
            this.context.pencil.fillRect(this.x - markerSize, this.y - markerSize, markerSize * 2, markerSize * 2); // Draw a filled rectangle at (10, 10) with 100px width and 50px height
            
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
        this.idsForAnimationFrames = idsForAnimationFrame;
        this.loopLengthMS = (1/fps) * idsForAnimationFrame.length * 1000;
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
        let index = this.context.toolbox.lerp(0, this.idsForAnimationFrames.length - .001, phase);
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

        this.setSprite(this.idsForAnimationFrames[index])
        this.previousIndex = index;
        this.animationId = requestAnimationFrame(this.onAnimationFrame)
    }

}