

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
    }

    loadColisions() {
        var i = -1;
        while((i = colisions.indexOf(1025, i+1)) != -1){

            var boundry = new Boundry({
                x: ((i+1)/70)>>0 * Boundry.side,
                y: (i+1)%70 * Boundry.side
            });
            boundry.draw();
            console.log(Boundry.side);
        }
    }

    draw() {
        c.drawImage(this.image, this.x, this.y);
    }
}

class Player extends Resource {
    constructor ({velocity, src}) {
        super(src)
        this.velocity = velocity;
    }

    move(way) {
        //y + -> up ; y -  -> down; x + -> left  ; x -  -> rigth
        
        eval(`map.${way}= player.velocity`)
        animate();
    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            (this.image.width/4),
            this.image.height, 
            (canva.width/2 - (this.image.width/4)/2), 
            (canva.height/2 - this.image.height/2),
            (this.image.width/4),
            this.image.height
        )
    }
}

class Boundry {

    constructor ({x,y}) {
        this.x = x
        this.y = y
        
        this.side = 66;
    }

    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, this.side, this.side)
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
        map.loadColisions();
        player.draw();

}

map.image.onload = () => {
    player.image.onload = () => {
        animate()
        
    }
}



window.addEventListener('keydown',  (e) => {
    switch (e.key){
        case 'w':
            //up
            player.move('y +')
            break;
        case 'a':
            //left
            player.move('x +')
            break;
        case 'd':
            //rigth
            player.move('x -')
            break;
        case 's':
            //down
            player.move('y -')
            break;
    }
});









console.log('end');