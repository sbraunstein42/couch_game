import { Toolbox } from "./toolbox.js";

export class Deck {

    items = [];
    toolbox = new Toolbox();
    nextIndex = 0;

    constructor(items) {
        this.items = items;
        if(this.items.length == 0) {
            throw new Error("Must have more than zero items in a deck...");
        }
        this.shuffle = this.shuffle.bind(this);
        this.take = this.take.bind(this);
        this.takeMultiple = this.takeMultiple.bind(this);

        this.shuffle();
    }

    shuffle() {
        this.items = this.toolbox.shuffleArray(this.items);
        this.nextIndex = 0;
    }

    take() {
        let returned = this.items[this.nextIndex];
        this.nextIndex++;
        if(this.nextIndex >= this.items.length) {
            this.shuffle();
        }
        return returned;
    }

    takeMultiple(howMany) {
        let returned = [];
        for(let i = 0; i < howMany; i++) {
            returned.push(this.take());
        }
        return returned;
    }


}