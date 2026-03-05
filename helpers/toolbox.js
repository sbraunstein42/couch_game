export class Toolbox {

    //gets a random number 0 -> array.length, given an array.
    getRandomIndex(array) {
        return Math.floor(
            Math.random() * array.length
        );
    }

    //gets a random item from an array
    getRandomItem(array) {
        let randomIndex = this.getRandomIndex(array);
        return array[randomIndex];
    }

    lerp(a, b, t) {
        if(a > b) {
            let temp = a;
            a = b;
            b = temp;
        }

        return a + ((b-a) * t)
    }

    clamp(n) {
        if(n > 1) return 1;
        else if(n < 0) return 0;
        else return n;
    }

    shuffleArray(array) {
        let shuffled = [];

        let howManyTimesToPush = array.length;

        for(let i = 0; i < howManyTimesToPush; i++) {
            let randomIndex = this.getRandomIndex(array);
            let removed = array.splice(randomIndex , 1 ) //start position, lenth.
            
            shuffled.push(removed[0]);
        }
        return shuffled;
    }

    getRandomColor() {
        let color = "#";
        let chars = [
            "0", "1", "2", "3",
            "4", "5", "6", "7",
            "8", "9", "a", "b",
            "c", "d", "e", "f",
        ];

        for(let i = 0; i < 6; i++) {
            //i'll be in here six times.
            color += this.getRandomItem(chars);
        }

        //like #1afe24
        return color;
    }

    // -----------------------------------------------
    // Utility function to check distance between two points, a and b
    getDistance(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    isWithinCircle(circleX, circleY, circleRadius, myX, myY) {
        let distance = this.getDistance(
            {x : circleX, y : circleY},
            {x : myX, y : myY},
        )
        let isWithin = distance < circleRadius;
        return isWithin;
    }

    isWithinRect(pointX, pointY, rectX, rectY, rectW, rectH) {
        if(pointX > rectX + rectW) {
            return false; //too far right
        } else if(pointX < rectX) {
            return false; //too far left
        } else if(pointY < rectY) {
            return false; //too far up
        } else if(pointY > rectY + rectH) {
            return false;
        } 
        else return true;
    }

}
