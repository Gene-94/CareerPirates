

const canva = document.querySelector('canvas');
canva.width = 1024;
canva.height = 576;

const c = canva.getContext('2d');

class Resource {
    constructor (src) {
        
        this.image = new Image()
        this.image.src = src
    }
}

class Map extends Resource {
    constructor ({x, y, src}){
        super(src)
        this.x = x 
        this.y = y

        this.squareSize = 66
        this.colisions = []
        this.loadColisions()
    }

    loadColisions() {
        var i = -1;
        while((i = colisions.indexOf(1025, i+1)) != -1){

            var boundry = new Boundry({
                y: ((i/70)>>0)*this.squareSize + this.y,
                x: (i%70)* this.squareSize + this.x,
                side: this.squareSize
            });
            this.colisions.push(boundry);
        }
    }

    draw() {
        c.drawImage(this.image, this.x, this.y);
        this.colisions.forEach((boundry) => boundry.draw());
    }
}

class Player extends Resource {
    constructor ({velocity, src}) {
        super(src)
        this.velocity = velocity;
        this.x = (canva.width/2 - (this.image.width/4)/2)
        this.y = (canva.height/2 - this.image.height/2)

        this.boundryLeft = this.x
        this.boundryRight = this.x + this.image.width/4
        this.boundryTop = this.y - 2*this.image.height/3
        this.boundryBottom = this.y - this.image.height
    }

    move(direction) {
        //y + -> up ; y -  -> down; x + -> left  ; x -  -> rigth

        const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
        const sign = direction === 'up' || direction === 'left' ? 1 : -1;
        
        map.colisions.forEach((boundry) => {
            if( this.boundryRight >= boundry.x &&
                this.boundryLeft <= (boundry.x + boundry.side) &&
                this.boundryTop >= (boundry.y - boundry.side) && 
                this.boundryBottom <= boundry.y
            ){
                alert("boundry")
            }
     
            boundry[axis] += this.velocity * sign
        });
        map[axis] += this.velocity * sign
 
        animate();
    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            (this.image.width/4),
            this.image.height, 
            this.x, 
            this.y,
            (this.image.width/4),
            this.image.height
        );
        player.boundryBox();
    }

    boundryBox() {
        c.strokeRect(this.x, this.y+ 2*this.image.height/3, this.image.width/4, this.image.height/3);

        c.fillStyle = "white"
        c.fillRect(this.x, this.y+ 2*this.image.height/3, 5, 5);
        c.fillStyle = "green"
        c.fillRect(this.x, this.y+this.image.height, 5, -5);
        c.fillStyle = "black"
        c.fillRect(this.x + this.image.width/4, this.y+ 2*this.image.height/3, -5, 5);
        c.fillStyle = "pink"
        c.fillRect(this.x + this.image.width/4, this.y+this.image.height, -5, -5);
    }
}

class Boundry {

    constructor ({x, y, side}) {
        this.x = x;
        this.y = y;
        this.side = side;

    }

    draw(){
        c.fillStyle = 'red';

        if(this.x < 0){
            c.fillStyle = 'blue';
            c.fillRect(this.x, this.y , 66, 66);
        }
       
        c.fillRect(this.x, this.y , this.side, this.side)

    }
}



const map = new Map({
    x: -1865,
    y: -680,
    src: './resources/Map.png'
});

const player = new Player({
    velocity: 4,
    src: './resources/Images/playerDown.png'
})


function animate() {
        map.draw();
        player.draw();

}

map.image.onload = () => {
    player.image.onload = () => {
        animate()
        
    }
}



window.addEventListener('keydown',  (e) => {
    console.log(e.key)
    switch (e.key){
        case 'w':
            //up
            player.move('up')
            break;
        case 'a':
            //left
            player.move('left')
            break;
        case 'd':
            //rigth
            player.move('right')
            break;
        case 's':
            //down
            player.move('down')
            break;
    }
});









console.log('end');