//reference:https://codepen.io/jeffibacache/pen/bzBsp ----------------------------

//vars in the coding
let canvas;
let ctx;
let canvasHeight = window.innerHeight - 40;
let canvasWidth = window.innerWidth - 40;
let keys = [];
let ship;
let asteroids = [];
let bullets = [];
let score = 0;
let lives = 3;//collision 3 times_end game
// let localStorageName = "HighScore";
let help = true;
document.addEventListener("DOMContentLoaded", loadCanvas);



function loadCanvas() {
    console.log("canvas loaded");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    for (let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid());
    }//how many asteroid is in the canvas,8-10 is a good range

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.body.addEventListener("keydown", (e) => {
        keys[e.keyCode] = true;
        help = false;
    });
    document.body.addEventListener("keyup", (e) => {
        keys[e.keyCode] = false;
        if (e.keyCode === 32) {
            bullets.push(new Bullet(ship.angle));
        }//32=space
    });

    // if want to add highest score, the code is list below:
    // if (isNaN(localStorage.getItem(localStorageName)) || localStorage.getItem(localStorageName) == null) {
    //     highScore = 0;
    // } else {
    //     highScore = localStorage.getItem(localStorageName);
    // }

    ship = new Ship();
    Render();
}



//the triangle
class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;//locate at the center at the beginning
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;//control like the bouncing ball
        this.rotateSpeed = 0.001;
        this.radius = 20;
        this.angle = 20;
        this.strokeColor = '#C39BD3 ';//triangle stroke color
        // Used to know where to fire the bullet from
       
    }

    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }

    Update() {
        let radian = this.angle / Math.PI * 180;//move forword,not back, back is 0
        if (this.movingForward) {
            this.velX += Math.cos(radian) * this.speed;
            this.velY += Math.sin(radian) * this.speed;
        }

        if (this.x < this.radius) {
            this.x = canvas.width;
        }

        if (this.x > canvas.width) {
            this.x = this.radius;
        }

        if (this.y < this.radius) {
            this.y = canvas.height;
        }

        if (this.y > canvas.height) {
            this.y = this.radius;
        }

        this.velX *= 0.99;
        this.velY *= 0.99;//ship moving when press key

        this.x -= this.velX;
        this.y -= this.velY;


    }

    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        // Angle between vertices of the ship
        let vertAngle = ((Math.PI*2) / 3);//(Math.PIZ•3)/3=LINE

        let radians = this.angle / Math.PI * 180;// Where to fire bullet from
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);

        for (let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#C39BD3 ";//triangle shape color
        ctx.fill();
    }
}

class Bullet {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 5;
        this.width = 5;
        this.speed = 5;
        this.velX = 0 ;
        this.velY = 0;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;// Where to fire bullet from
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    Draw() {
        ctx.fillStyle = '#F1948A';//bullet's color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    constructor(x, y, radius, level, collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 2; 
        this.radius = radius || 50;//it will be gigger if ++ the number;
        this.angle = Math.floor(Math.random() * 100);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // Used to decide if this asteroid can be broken into smaller pieces
        this.level = level || 1;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw() {
        ctx.beginPath();
        let vertAngle = ((Math.PI * 5) / 7);//asteroid shape; same number = line
        var radians = this.angle / Math.PI * 180;
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}


function CircleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    let radiusSum;
    let xDiff;
    let yDiff;

    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;

    if (radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))) {
        return true;
    } else {
        return false;
    }
}

// Handles drawing life ships on screen
function DrawLifeShips() {
    let startX = canvasWidth-80;
    let startY = 10;
    let points = [
        [9, 9],
        [-9, 9]
    ];
    ctx.strokeStyle = 'white'; // Stroke color of ships
    // Cycle through all live ships remaining
    for (let i = 0; i < lives; i++) {
        // // Start drawing ship
        // ctx.beginPath();
        // // Move to origin point
        // ctx.moveTo(startX, startY);
        // // Cycle through all other points
        // for (let j = 0; j < points.length; j++) {
        //     ctx.lineTo(startX + points[j][0],
        //         startY + points[j][1]);
        // }
        // // Draw from last point to 1st origin point
        // ctx.closePath();
        // // Stroke the ship shape white
        // ctx.stroke();
        // // Move next shape 30 pixels to the left
        // ctx.drawImage(image, startX, startY, 40, 40);
        // startX -= 30;
    }
}

//key control;38^,39>,37<;
function Render() {
    ship.movingForward = (keys[38]);
    if (keys[39]) {
        ship.Rotate(1);
    }
    if (keys[37]) {
        ship.Rotate(-1);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE : " + score.toString(), 20, 35);
    // If no lives signal game over
    if (lives <= 0) {
        // If Game over remove event listeners to stop getting keyboard input
        // document.body.removeEventListener("keydown", HandleKeyDown);
        // document.body.removeEventListener("keyup", HandleKeyUp);

        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Impact';
        ctx.fillText("GAME OVER", canvasWidth / 2 - 100, canvasHeight / 2);
        ship.visible = false;
    }

    //  Creates a new level and increases asteroid speed
    if (asteroids.length === 0) {
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        for (let i = 0; i < 8; i++) {
            let asteroid = new Asteroid();
            asteroid.speed += .5;
            asteroids.push(asteroid);
        }
    }

    // Draw life ships
    DrawLifeShips();

    if(help){
        ctx.font = '30px Impact';
        ctx.fillStyle = "#F4D03F";
        ctx.fillText("Press Space To Start", canvasWidth/2-100, canvasHeight/2+100);
        ctx.font = '14px Arial';
        ctx.fillStyle = "white";
        ctx.fillText("Press ^ to move forward, < & > to change direction. Space to shoot.", canvasWidth/2-180, canvasHeight/2 +140);
    }

    if (ship.x !== canvasWidth / 2 && ship.y !== canvasWidth / 2) {
        // Check for collision of ship with asteroid
        if (asteroids.length !== 0) {
            for (let k = 0; k < asteroids.length; k++) {
                if (CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)) {
                    ship.x = canvasWidth / 2;
                    ship.y = canvasHeight / 2;
                    ship.velX = 0;
                    ship.velY = 0;
                    lives -= 1;
                }
            }
        }
        // Check for collision with bullet and asteroid
        if (asteroids.length !== 0 && bullets.length != 0) {
            loop1: for (let l = 0; l < asteroids.length; l++) {
                for (let m = 0; m < bullets.length; m++) {
                    if (CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
                        // Check if asteroid can be broken into smaller pieces
                        if (asteroids[l].level === 1) {
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
                        } else if (asteroids[l].level === 2) {
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
                        }
                        asteroids.splice(l, 1);
                        bullets.splice(m, 1);
                        score += 20;//one shoot for 20 pts;

                        // Used to break out of loops because splicing arrays
                        // looping through will break otherwise
                        break loop1;
                    }
                }
            }
        }
    }


    if (ship.visible) {
        ship.Update();
        ship.Draw();
    }
    
    if (bullets.length !== 0) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].Update();
            bullets[i].Draw();
        }
    }
    if (asteroids.length !== 0) {
        for (let j = 0; j < asteroids.length; j++) {
            asteroids[j].Update();
            // Pass j so I can track which asteroid points
            // to store
            asteroids[j].Draw(j);
        }
    }
    //if visible high score
    // highScore = Math.max(score, highScore);
    // localStorage.setItem(localStorageName, highScore);
    // // ctx.font = '21px Arial';
    // ctx.fillText("HIGH SCORE : " + highScore.toString(), 20, 70);
    requestAnimationFrame(Render);
}