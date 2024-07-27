class Resource {
    constructor (src) {
        
        this.image = new Image()
        this.image.onload =  console.log([this])
        this.image.src = src
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
                this.enterBattle()
            }
        })
        
    }

    enterBattle() {
        this.inBattle = true;
        const battle = new Battle();  
        //battle scene trasition    
        battle.transition()
        //end of transition

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

class Battle {
    constructor(){
        this.inBattle = true;
        this.enemy = new Monster({
            mon: pokemon[1],
            enemy: true,
        });
        this.mine = new Monster({
            mon: pokemon[0],
            enemy: false,
        });
        this.background = new Resource('./resources/Images/battleBackground.png');

        //for in battle attacks
        document.querySelectorAll('.attack').forEach((button, index) => {
            button.innerHTML = this.mine.attacks[index].name
            button.addEventListener('click', () => {
                this.mine.attack(index, this.enemy);
            })
        })

        this.lastUpdateTime = 0;
        this.deltaTime = 1000 / 2;
        
    }

    transition() {
        gsap.to(transition, {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete: () => {
                gsap.to(transition, {
                    opacity: 1,
                    duration: 0.4,
                    onComplete: () => {
                        
                        this.draw();
                        gsap.to(transition, {
                            opacity: 0,
                            duration: 0.4,
                        })
                    }
                })
            }       
        })
    }
    
    animate() {

    }

    terminate() {
        this.inBattle = false
    }
    
    draw() {
        //draw background
       c.drawImage(this.background.image, 0, 0);
       //draw enemy monster    
       //this.enemy.draw()
       //this.mine.draw()
       this.enemy.draw()
       this.mine.draw()
       window.requestAnimationFrame(this.draw.bind(this));
    }

    activate() {
       
    }
    
    
}

class Monster extends Resource {
    constructor({enemy=true, mon}){
        super(mon.src)
        this.frameRate=0;
        this.name = mon.name;
        this.attacks = mon.attacks;
        this.totalHealth = mon.totalHealth;
        this.remainingHealth = mon.remainingHealth;
        this.owned = mon.owned;
        this.main = mon.main;
        this.frame = 0;
        if(enemy){
            this.x = 800;
            this.y = 100;
        }
        else{
            this.x = 280;
            this.y = 325;
        }
    }

    attack(index = -1, enemy){
        if (index == -1) {index = Math.floor(Math.random()*4)}
        console.log(this.attacks[index].name + " clicked")
        attackAnimations[this.attacks[index].name](this, enemy)
        
    }

    animate() {
    }

    draw(){
        //280, 325
        //c.drawImage(this.image, 800, 100);
        c.drawImage(
            this.image,
            this.image.width/4 * this.frame,
            0,
            (this.image.width/4),
            this.image.height, 
            this.x, 
            this.y,
            (this.image.width/4),
            this.image.height
        );
        if(this.frameRate > 30) {
            console.log("animare")
            this.frame = (this.frame+1) % 4;
            this.frameRate = 0;
        }
        this.frameRate ++
    }

    
}