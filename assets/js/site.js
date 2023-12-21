// function setup() {
//     // Canvas size
//     let canvas = createCanvas(900, 600);
//     canvas.parent("canvasContainer");
// }

// function draw() {
//     // Set the background color of the canvas
//     background(200);

//     // Set up initial square properties
//     let square = {
//         x: 400,
//         y: 340,
//         size: 130, // size of the square
//         color: color(230, 40, 40),
//         rotationAngle: 0.02 // Adjust the rotation angle
//     };

//     // Set up initial Horse properties
//     let horseBody = {
//         x: 500,
//         y: 260,
//         radius: 50,
//         color: color(230, 98, 30)
//     };

//     let horseBack = {
//         x: 300,
//         y: 400,
//         radius: 50,
//         color: color(230, 98, 30)
//     };

//     // Set up the horseNeck square properties
//     // let horseNeck = {
//     //     x: 600,
//     //     y: 310,
//     //     size: 60, // size of the square
//     //     color: color(52, 152, 219),
//     //     rotationAngle: -100.32 // Adjust the rotation angle
//     // };

//     // Set up the triangle (horse face) properties
//     let horseFace = {
//         x1: 600, y1: 300,
//         x2: 670, y2: 290,
//         x3: 660, y3: 410,
//         color: color(34, 177, 76), // Green color
//         rotationAngle: -1 // Adjust the rotation angle
//     };

//     // Rotate the square slightly
//     square.rotationAngle += 2.5;

//     // Draw the square on the canvas with rotation
//     push();
//     translate(square.x, square.y);
//     rotate(square.rotationAngle);
//     fill(square.color);
//     rect(-square.size, -square.size / 2, square.size * 2, square.size); // Center the square
//     pop();

//     // Draw the horseNeck square with rotation
//     // push();
//     // translate(horseNeck.x, horseNeck.y);
//     // rotate(radians(horseNeck.rotationAngle)); // Convert the rotation angle to radians
//     // fill(horseNeck.color);
//     // rect(-horseNeck.size, -horseNeck.size / 2, horseNeck.size * 2, horseNeck.size); // Center the square
//     // pop();

//     // Draw the green triangle (horse face) with rotation
//     push();
//     translate(horseFace.x1, horseFace.y1);
//     rotate(radians(horseFace.rotationAngle)); // Convert the rotation angle to radians
//     fill(horseFace.color);
//     triangle(0, 0, horseFace.x2 - horseFace.x1, horseFace.y2 - horseFace.y1, horseFace.x3 - horseFace.x1, horseFace.y3 - horseFace.y1);
//     pop();

//     noStroke();

//     // Draw the horseBody circle
//     fill(horseBody.color);
//     ellipse(horseBody.x, horseBody.y, horseBody.radius * 3);

//     // Draw the horseBack circle
//     fill(horseBack.color);
//     ellipse(horseBack.x, horseBack.y, horseBack.radius * 3);

//     // Draw a half-circle
//     fill(52, 152, 219); // Adjust the color as needed
//     arc(530, 270, 200, 180, PI, 0, CHORD); // Adjust the position and size as needed
// }


//NEW ---------------

let img;
let particles = [];
let flowField = [];

function preload() {
    // Load your image here
    img = loadImage('assets/img/dragon.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    img.resize(width, height);

    // Generate flow field
    flowField = generateFlowField();

    // Create particles
    for (let i = 0; i < 500; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(255);

    // Display the image
    image(img, 0, 0, width, height);

    // Move and display particles based on the flow field
    for (let particle of particles) {
        particle.follow(flowField);
        particle.update();
        particle.display();
    }
}

class Particle {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxSpeed = 4;
        this.prevPos = this.position.copy();
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    follow(flow) {
        const x = floor(this.position.x / flow.fieldScale);
        const y = floor(this.position.y / flow.fieldScale);
        const index = constrain(x + y * flow.cols, 0, flow.field.length - 1);
        const force = flow.field[index].copy();
        this.applyForce(force);
    }

    display() {
        stroke(0, 5);
        strokeWeight(2);
        point(this.position.x, this.position.y);
        this.updatePrev();
    }

    updatePrev() {
        this.prevPos.x = this.position.x;
        this.prevPos.y = this.position.y;
    }
}

function generateFlowField() {
    const cols = floor(width / 20);
    const rows = floor(height / 20);
    const fieldScale = 20;
    const noiseScale = 0.1;
    const field = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const angle = noise(x * noiseScale, y * noiseScale) * TWO_PI * 4;
            const v = p5.Vector.fromAngle(angle);
            v.setMag(5);
            const index = x + y * cols;
            field[index] = v;
        }
    }

    return { cols, rows, fieldScale, field };
}
