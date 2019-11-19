let cellSize = 32;
let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
let width;
let height;
let cellWidth;
let cellHeight;
let food;
let glupsFood;
let rate;
let paper;

let state;

let palette = [
	{r:  26, g:  19, b: 52},
	{r:  38, g:  41, b: 74},
	{r:   1, g:  84, b: 90},
	{r:   1, g: 115, b: 81},
	{r:   3, g: 195, b: 131},
	{r: 170, g: 217, b: 98},
	{r: 251, g: 191, b: 69},
	{r: 239, g: 106, b: 50},
	{r: 237, g:   3, b: 69},
	{r: 161, g:  42, b: 94},
	{r: 113, g:   1, b: 98},
	{r:  17, g:   1, b: 65}];



function setup() {
	cellWidth = floor(screenWidth / cellSize);
	cellHeight = floor(screenHeight / cellSize);
  	height = cellSize * cellHeight;
	width = cellSize *  cellWidth;
	
	canv = createCanvas(width, height);
	canv.parent("snake");

	paper = createGraphics(width, height);
        for (let i = 0; i < width; i+=2) {
            for (let j = 0; j < height; j+=2) {
                paper.fill(random(205-40, 205+30), 50);
                paper.noStroke()
                paper.rect(i, j, 2, 2);
            }
        }

	init();
	
}

function init() {	
	rate = 5;
	frameRate(rate);
	player = new Snake(cellWidth / 2, cellHeight / 2, cellSize);
	food = new Food(cellSize, player.snake);
	state = 0;
}

function title() {
	
	let offsetX = 0.5 * cellWidth - 11;
	let offsetY = 0.5 * cellHeight - 3;


	let t = [
		"######",  
		"#     #   ##   # #    # #####   ####  #    #", 
		"#     #  #  #  # ##   # #    # #    # #    #",
		"######  #    # # # #  # #####  #    # #    #",
		"#   #   ###### # #  # # #    # #    # # ## #",
		"#    #  #    # # #   ## #    # #    # ##  ##",
		"#     # #    # # #    # #####   ####  #    #",
		" ",
		"      #####",                              
		"     #     # #    #   ##   #    # ######", 
		"     #       ##   #  #  #  #   #  #",      
		"      #####  # #  # #    # ####   ##### ", 
		"           # #  # # ###### #  #   # ",     
		"     #     # #   ## #    # #   #  #",      
		"      #####  #    # #    # #    # ###### "
	];

	for (let l = 0; l < 15; l++) {
		for(let c = 0; c < t[l].length; c++) {
			if(t[l][c] === '#') {
				let color = palette[round(random(0, palette.length - 1))];
				noStroke();
				fill(color.r, color.g, color.b);
				rect(c * 0.5 * cellSize + offsetX * cellSize, l * 0.5 * cellSize + offsetY * cellSize, 0.5 * cellSize,0.5 * cellSize);
			}
		}
	} 
}

function game() {
	food.show();
	player.update();
	player.show();
	
	if (player.eat(food)) {
		if (player.snake.length > 1) {
			food.x = player.snake[1].x;
			food.y = player.snake[1].y;	
		}
		
		player.glupsFood  = food;
		food = new Food(cellSize, player.snake);
		rate += 0.3;
		rate = constrain(rate, 5, 60);
		frameRate(rate);
	} else if (player.selfEating() || player.snake[0].x < 0 || player.snake[0].x >= cellWidth || player.snake[0].y < 0 || player.snake[0].y >= cellHeight) {
		init();
	}
}

function draw() {
	background(238, 198, 198);
	switch(state) {
		case 0:
			title();
			image(paper, 0, 0);
			break;
		case 1:
			image(paper, 0, 0);
			game();
			break;
	}

	
}

class Food {
	constructor(size, snake) {
		let x,y;
		let goodFood = true;
		do {
			x =  round(random(cellWidth - 1));
			y = round(random(cellHeight - 1));
			for(let ring of snake) {
				if(ring.x == x && ring.y == y) {
					goodFood = false;
					break;
				}
			}
		} while (!goodFood);
		this.x = x;
		this.y = y;
		this.color = palette[round(random(0, palette.length - 1))];
		this.w = size;

		this.paper = createGraphics(this.w, this.w);
        for (let i = 0; i < this.w; i+=2) {
            for (let j = 0; j < this.w; j+=2) {
                this.paper.fill(random(205-40, 205+30), 50);
                this.paper.noStroke()
                this.paper.rect(i, j, 2, 2);
            }
            
        }
	}
	show() {
		fill(this.color.r, this.color.g, this.color.b);
		rect(this.x * this.w, this.y * this.w, this.w, this.w);
		image(this.paper, this.x * this.w, this.y * this.w, this.w, this.w);
	}
}

class Snake {
	constructor(xo, yo, size) {
		this.snake = [];
		this.w = size;
		this.dir = {x: 0, y: 0};
		this.glupsFood;

		this.paper = createGraphics(this.w, this.w);
        for (let i = 0; i < this.w; i+=2) {
            for (let j = 0; j < this.w; j+=2) {
                this.paper.fill(random(205-40, 205+30), 50);
                this.paper.noStroke()
                this.paper.rect(i, j, 2, 2);
            }
            
		}
		this.snake[0] = {x: round(xo), y: round(yo), color: {r: 255, g: 0, b: 0}, paper: this.paper};

	}

	show() {
		fill(255,0,0);
		for (let ring of this.snake) {
			noStroke();
			fill(ring.color.r, ring.color.g, ring.color.b);
			rect(ring.x * this.w, ring.y * this.w, this.w, this.w);
			image(ring.paper, ring.x * this.w, ring.y * this.w, this.w, this.w);
		}
	}

	update() {
		if(this.glupsFood && this.glupsFood.x == this.snake[this.snake.length - 1].x && this.glupsFood.y == this.snake[this.snake.length - 1].y) {
			this.snake.push(this.glupsFood);
			this.glupsFood.x = -10;
			this.glupsFood.y = -10;
		}

		if (this.snake.length > 1) {
			for (let i = this.snake.length - 1; i> 0; i--) {
				this.snake[i].x = this.snake[i-1].x;
				this.snake[i].y = this.snake[i-1].y;
			}
		}
		
		this.snake[0].x += this.dir.x;
		this.snake[0].y += this.dir.y;		
	}

	eat(food) {
		if (food.x == this.snake[0].x && food.y == this.snake[0].y) {
			return true;
		} else {
			return false;
		}
	}
	selfEating() {
		for (let i = 1; i < this.snake.length; i++) {
			if (this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y && this.snake.length > 2) {
				return true;
			}
		}
		return false;
	}
}

function keyPressed() {

	switch(keyCode) {
		case LEFT_ARROW : if (player.dir.x == 0) {player.dir = {x: -1, y: 0}}; break;
		case UP_ARROW : if (player.dir.y == 0) {player.dir = {x: 0, y: -1};} break;
		case RIGHT_ARROW : if (player.dir.x == 0) {player.dir = {x: 1, y: 0};} break;
		case DOWN_ARROW : if (player.dir.y == 0) {player.dir = {x: 0, y: 1};} break;
		case 32 : state = 1; break;
	}
}

function mousePressed() {
	switch(state) {
		case 0:
			state = 1;
			break;
		case 1:
			let touchVector = createVector(mouseX - screenWidth / 2, mouseY - screenHeight / 2);
			let angle = touchVector.heading();
			if(angle > - 0.25 * PI && angle < 0.25 * PI && player.dir.x == 0) {
				player.dir = {x: 1, y: 0};
			} else if (angle > 0.25 * PI && angle < 0.75 * PI && player.dir.y == 0) {
				player.dir = {x: 0, y: 1};
			} else if ((angle > 0.75 * PI  || angle < -0.75 * PI) && player.dir.x == 0) {
				player.dir = {x: -1, y: 0};
			} else if (angle > -0.75 * PI && angle < -0.25 * PI && player.dir.y == 0) {
				player.dir = {x: 0, y: -1};
			}
			break;
	}
}