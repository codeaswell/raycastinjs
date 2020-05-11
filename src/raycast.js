const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180); // field of view in radians
const WALL_STRIP_WIDTH = 30;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    render() {
        for (let y = 0; y < MAP_NUM_ROWS; y++) {
            for (let x = 0; x < MAP_NUM_COLS; x++) {
                let posX = TILE_SIZE * x;
                let posY = TILE_SIZE * y;
                let color = this.grid[y][x] === 1 ? "#222" : "#fff";
                stroke("#222");
                fill(color);
                rect(posX, posY, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    hasWallAt(x, y) {
        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }
        let mapGridIndexX = Math.floor(x / TILE_SIZE);
        let mapGridIndexY = Math.floor(y / TILE_SIZE);
        return this.grid[mapGridIndexY][mapGridIndexX] != 0;
    }
}

class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0; // -1 if left, +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2; // in radians, PI = 180 degrees so PI / 2 = 90 degrees
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180); // Convert degree to radians so rotation speed = 3 radians
    }

    update() {
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        let moveStep = this.walkDirection * this.moveSpeed;
        let newPlayerX = this.x + cos(this.rotationAngle) * moveStep;
        let newPlayerY = this.y + sin(this.rotationAngle) * moveStep;

        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }
    }

    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius);
        stroke("red");
        line(
            this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * 30, // On rajoute à la position sur x du joueur la taille du coté adjacent calculée a partir du cosinus de l'angle et de l'hypotenuse (L'hypotenuse étant la taille de ma ligne)
            this.y + Math.sin(this.rotationAngle) * 30 // On rajoute à la position sur y du joueur la taille du coté opposé calculée a partir du sinus de l'angle et de l'hypotenuse (L'hypotenuse étant la taille de ma ligne)
        );
    }
}

class Ray {
    constructor(rayAngle) {
        this.rayAngle = rayAngle;
    }

    render() {
        stroke("rgba(255, 0, 0, 0.3)");
        line(
            player.x,
            player.y,
            player.x + Math.cos(this.rayAngle) * 30, // On rajoute à la position sur x du joueur la taille du coté adjacent calculée a partir du cosinus de l'angle et de l'hypotenuse (L'hypotenuse étant la taille de ma ligne)
            player.y + Math.sin(this.rayAngle) * 30 // On rajoute à la position sur y du joueur la taille du coté opposé calculée a partir du sinus de l'angle et de l'hypotenuse (L'hypotenuse étant la taille de ma ligne)
        );
    }
}

const grid = new Map();
const player = new Player();
let rays = [];

function keyPressed() {
    if (keyCode === 90) {
        player.walkDirection = +1;
    } else if (keyCode === 83) {
        player.walkDirection = -1;
    } else if (keyCode === 68) {
        player.turnDirection = +1;
    } else if (keyCode === 81) {
        player.turnDirection = -1;
    }
}

function keyReleased() {
    if (keyCode === 90) {
        player.walkDirection = 0;
    } else if (keyCode === 83) {
        player.walkDirection = 0;
    } else if (keyCode === 68) {
        player.turnDirection = 0;
    } else if (keyCode === 81) {
        player.turnDirection = 0;
    }
}

function castAllRays() {
    let columnId = 0;
    let rayAngle = player.rotationAngle - FOV_ANGLE / 2;

    rays = [];

    for (let i = 0; i < NUM_RAYS; i++) {
        const ray = new Ray(rayAngle);
        // ray.cast();
        rays.push(ray);
        rayAngle += FOV_ANGLE / NUM_RAYS;
        columnId++;
    }
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    castAllRays();
    player.update();
}

function draw() {
    update();
    grid.render();
    for (ray of rays) {
        ray.render();
    }
    player.render();
}
