

const canva = document.querySelector('canvas');

canva.width = 1024;
canva.height = 576;

const transition = document.querySelector('#battleTransition');
transition.width = 1024;
transition.height = 576;

const c = canva.getContext('2d');


const map = new Map({
    src: {
        map: './resources/Map.png',
        foreground: './resources/Foreground.png'
    }
    
    
});

const player = new Player({
    velocity: 7,
    src: {
        down: './resources/Images/playerDown.png',
        up: './resources/Images/playerUp.png',
        left: './resources/Images/playerLeft.png',
        right: './resources/Images/playerRight.png'
    }
})


function animate() {
        map.drawBackground();
        map.drawBoundries();
        player.draw();
        map.drawForeground();
}

map.background.image.onload = () => {
    map.foreground.image.onload = () => {
        player.direction.down.image.onload = () => {
            animate();
            player.enterBattle()
        }
    }
}



window.addEventListener('keydown',  (e) => {
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