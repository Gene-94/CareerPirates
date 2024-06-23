class Resource {
    constructor (src) {
        
        this.image = new Image()
        this.image.src = src
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

class Player extends Resource {
    constructor ({velocity, src}) {
        super(src)
        this.velocity = velocity;
        this.x = (canva.width/2 - (this.image.width/4)/2)
        this.y = (canva.height/2 - this.image.height/2)

        this.aux = 0
    }

    move(direction) {
        //y + -> up ; y -  -> down; x + -> left  ; x -  -> rigth
        var allow = 1
        const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
        const sign = direction === 'up' || direction === 'left' ? 1 : -1;
        /*
        try
        {map.colisions.forEach((boundry) => {
            
            boundry.allow({
                bottomBorder: (this.y+this.image.height),
                topBorder: (this.y+ 2*this.image.height/3),
                rightBorder: (this.x + this.image.width/4), 
                leftBorder: this.x,
                axis: axis,
                speed: this.velocity,
                mod: sign,
            });

            boundry[axis] += this.velocity * sign

        });
        map[axis] += this.velocity * sign
        }
        catch
        {
        }
        */
        boundries.forEach((boundry) => {
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
            map[axis] += this.velocity * sign
            foreground[axis] += this.velocity * sign

        }

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

    constructor ({x, y, side, color="red"}) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.color = color;

    }
    /*
    allow({
        bottomBorder,
        topBorder,
        leftBorder,
        rightBorder,
        axis ,
        speed ,
        mod ,
    }){
        var allow = -1
        this[axis] + this.velocity * sign
        if( 
            bottomBorder >= (this.y) &&
            topBorder <= (this.y+this.side) &&
            rightBorder >= (this.x) &&
            leftBorder <= (this.x + this.side)
        ){
            
            console.log("touching")
            
        }
        else{
            allow = 1
        }
        this[axis] - this.velocity * sign
        return allow
    }
    */
    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y , this.side, this.side)

    }
}