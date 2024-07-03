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

class Map extends Resource {
    constructor ({x=-1865, y=-695, src}){
        super(src)
        this.x = x 
        this.y = y

        this.squareSize = 66
        
    }

    

    draw() {
        c.drawImage(this.image, this.x, this.y);
        //this.colisions.forEach((boundry) => boundry.draw());
    }
}

class Player {
    constructor ({velocity, src}) {
        this.direction = {
            down: new Resource (src.down),
            up: new Resource (src.up),
            left: new Resource (src.left),
            right: new Resource (src.right)
        }
        this.image = this.direction.down.image
        this.velocity = velocity;
        this.x = (canva.width/2 - (this.image.width/4)/2)
        this.y = (canva.height/2 - this.image.height/2)
        this.pMov = 0

        this.aux = 0
    }

    move(dir) {
        //y + -> up ; y -  -> down; x + -> left  ; x -  -> rigth
        var allow = 1
        const axis = dir === 'up' || dir === 'down' ? 'y' : 'x';
        const sign = dir === 'up' || dir === 'left' ? 1 : -1;
 
        boundries.forEach((boundry) => {
            console.log(dir)
            this.image = this.direction[dir].image
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
            boundries.forEach((boundry) => {
                boundry[axis] += this.velocity * sign
            });
            console.log(this.pMov)
            map[axis] += this.velocity * sign
            foreground[axis] += this.velocity * sign
            
        }
        this.pMov = (this.pMov+1) % 20
        animate();
        

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