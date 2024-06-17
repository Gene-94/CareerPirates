

const canva = document.querySelector('canvas');
canva.width = 1024;
canva.height = 576;

const c = canva.getContext('2d');

class Sprite {
    constructor ({position, velocity, src}) {
        this.position = position
        this.velocity = velocity

        this.image = new Image()
        this.image.src = src
    }
    get x() {return this.position.x}
    get y() {return this.position.y}
    set x(val) {
        this.position.x = val
        animate()
    }
    set y(val) {
        this.position.y = val
        animate()
    }
}

class Colision {

    constructor ({position}) {
        this.position = position

        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 66, 66)
        console.log(this.position.x)
    }
}



const map = new Sprite({
    position: {
        x: -1865,
        y: -680
    },
    src: './resources/Map.png'
});
const player = new Sprite({
    velocity: 4,
    src: './resources/Images/playerDown.png '
})



map.image.onload = () => {
    player.image.onload = () => {
        animate()
        
    }
}
colision = new Colision({
    position: {
        x: 0,
        y: 0
    }
})


function animate() {
        c.drawImage(map.image, map.x, map.y);
        c.drawImage(
            player.image,
            0,
            0,
            (player.image.width/4),
            player.image.height, 
            (canva.width/2 - (player.image.width/4)/2), 
            (canva.height/2 - player.image.height/2),
            (player.image.width/4),
            player.image.height
        )

}


function moove() {
    map.x += player.velocity
}

window.addEventListener('keydown',  (e) => {
    switch (e.key){
        case 'w':
            map.y += player.velocity
            console.log(map.y)
            break;
        case 'a':
            map.x += player.velocity
            break;
        case 'd':
            map.x -= player.velocity
            break;
        case 's':
            map.y -= player.velocity
            break;
    }
});









console.log('end');