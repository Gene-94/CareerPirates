

const canva = document.querySelector('canvas');
canva.width = 1024;
canva.height = 576;

const c = canva.getContext('2d');


const map = new Map({
    src: './resources/Map.png'
});

const foreground = new Map({
    src: './resources/Foreground.png'
})

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
        map.draw();
        player.draw();
        foreground.draw();

}

function loadColisions() {
    var i = -1;
    while((i = colisions.indexOf(1025, i+1)) != -1){

        var boundry = new Boundry({
            y: ((i/70)>>0)*map.squareSize + map.y,
            x: (i%70)* map.squareSize + map.x,
            side: map.squareSize
        });
        boundries.push(boundry);
    }
}

var boundries = []
map.image.onload = () => {
    player.image.onload = () => {
        animate()
        loadColisions()
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