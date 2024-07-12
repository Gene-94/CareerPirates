class Resource {
    constructor (src) {
        
        this.image = new Image()
        this.image.src = src
        this.confirmLoad()
    }
    async confirmLoad (){
        await this.image.decode()
    }
}

class Map {
    constructor ({x=-1865, y=-695, src}){
        this.background = new Resource (src.map)
        this.foreground = new Resource (src.foreground)
        this.x = x 
        this.y = y
        this.boundries = []
        this.battleZones = []
        this.squareSize = 66
        this.loadZones(this.boundries, colisions)
        this.loadZones(this.battleZones, battleZones)
    }

    loadZones(localArray, zonesData) {
        var i = -1;
        while((i = zonesData.indexOf(1025, i+1)) != -1){
            var boundry = new Boundry({
                y: ((i/70)>>0)*this.squareSize + this.y,
                x: (i%70)* this.squareSize + this.x,
                side: this.squareSize
            });
            localArray.push(boundry);
        }
    }

    
    drawBoundries() {
        this.boundries.forEach((boundry) => boundry.draw());
        this.battleZones.forEach((boundry) => boundry.draw()); 
    }
    drawBackground(){
        c.drawImage(this.background.image, this.x, this.y);
    }
    drawForeground(){
        c.drawImage(this.foreground.image, this.x, this.y);
    }
}

class Player {
    constructor ({velocity, src}) {
        this.direction = {
            down: new Resource (src.down),
            up: new Resource (src.up),
            left: new Resource (src.left),
            right: new Resource (src.right)
        };
        this.image = this.direction.down.image;
        this.velocity = velocity;
        this.x = (canva.width/2 - (this.image.width/4)/2);
        this.y = (canva.height/2 - this.image.height/2);
        this.pMov = 0;
        this.inBattle = false;

    }

    move(dir) {
        if(this.inBattle){return}
        //y + -> up ; y -  -> down; x + -> left  ; x -  -> rigth
        var allow = 1
        const axis = dir === 'up' || dir === 'down' ? 'y' : 'x';
        const sign = dir === 'up' || dir === 'left' ? 1 : -1;
        this.image = this.direction[dir].image
 
        map.boundries.forEach((boundry) => {
            boundry[axis] += this.velocity * sign
            if( 
                (this.y+this.image.height) >= (boundry.y) &&
                (this.y+ 2*this.image.height/3) <= (boundry.y+boundry.side) &&
                (this.x + this.image.width/4) >= (boundry.x) &&
                this.x <= (boundry.x + boundry.side)
            ){
                boundry[axis] -= this.velocity * sign
                allow = -1
                return
            }
            boundry[axis] -= this.velocity * sign
        });

        if (allow==1){
            map.boundries.forEach((boundry) => {
                boundry[axis] += this.velocity * sign
            });
            map.battleZones.forEach((boundry) => {
                boundry[axis] += this.velocity * sign
            });
            map[axis] += this.velocity * sign
        }

        this.pMov = (this.pMov+1) % 20
        animate();


        map.battleZones.forEach((boundry) => {
            if( 
                //calculates if player boundrybox and player 
                (this.y+this.image.height) >= (boundry.y) &&
                (this.y+ 2*this.image.height/3) <= (boundry.y+boundry.side) &&
                (this.x + this.image.width/4) >= (boundry.x) &&
                this.x <= (boundry.x + boundry.side) &&
                //only activate battle chanse if the majoraty of player boundry box is overlapping with battle area boundry box
                //overlaping area calc
                (Math.min(this.x+this.image.width/4, boundry.x + boundry.side) - Math.max(this.x, boundry.x)) *
                (Math.min(this.y + this.image.height, boundry.y + boundry.side) - Math.max(this.y+ 2*this.image.height/3, boundry.y))
                //player boundry box area calc and halved
                >= (this.image.width/4 * this.image.height/3) / 2
                // Ajust multiplier to adjust batle activation frequency
                && (Math.floor(Math.random()*30) == 7)
                

            ){
                this.activateBattle()
            }
        })
        
    }

    activateBattle() {
        this.inBattle = true;
        gsap.to(transition, {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
                gsap.to(transition, {
                    opacity: 1,
                    duration: 0.4,
                })
            }
        })
        
        
    }

    draw() {
        c.drawImage(
            this.image,
            this.image.width/4 * (this.pMov/5>>0),
            0,
            (this.image.width/4),
            this.image.height, 
            this.x, 
            this.y,
            (this.image.width/4),
            this.image.height
        );
        //makes player boundry box and visible
        //player.boundryBox();
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

    constructor ({x, y, side, color="red"}) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.color = color;

    }
 
    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y , this.side, this.side)

    }
}