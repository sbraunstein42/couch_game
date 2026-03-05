export class Sprite {

    context;
    image;
    scale;
    width;
    height;

    constructor(context, path, scale) {
        this.image = new Image();
        this.image.src = path;
        this.context = context;
        this.scale = scale;

        this.width = this.image.naturalWidth * this.scale;
        this.height = this.image.naturalHeight * this.scale;
        this.draw = this.draw.bind(this);
    }

    draw(x, y) {
        this.context.pencil.drawImage(this.image, x, y, this.width, this.height);
    }
}