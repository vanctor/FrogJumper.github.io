
let padPosY1_3 = []
let padPosY2 = []
let pY1_3 = 600;
let pY2 = 475;
let fX = -25;
let fY = 575;
let startfX = 0
let startfY = 0
let isJump = false

let lane = 2;
let step = 0;
let angle = 0;
let test = 0;

let calcY = 0;
let postJX = 0;
let postJY = 0;

let scroll = 0;
let offset = 0;
let jumpScroll = 0;

let reset = 0;
let tick = 0;
let values = []
function preload() {
	lilypad = loadImage('lilypad.png');
	water = loadImage('truewater.png');
	frog = loadImage('frog.png');
	jump = loadImage("frog_jump.png");
	bottle = loadImage('bottle.png');
}

function setup() {
	createCanvas(450, 700);
}

function draw() {
	
	padPosY1_3 = []
	padPosY2 = []
	values = []
	image(water, 0, 0, 450, 700);

	pY1_3 = 600 + scroll
	pY2 = 475 + scroll 
	
	while (pY1_3 >= -250){
		padPosY1_3.push(pY1_3)
		pY1_3 -= 250
	}
	while (pY2 >= -250){
		padPosY2.push(pY2)
		pY2 -= 250
	}


	
	for (let i = 0; i < padPosY1_3.length; i += 1) {
		if (step != i || reset > 1) {
			image(lilypad, 0, padPosY1_3[i], 100, 100);
			image(lilypad, 350, padPosY1_3[i], 100, 100);
		}
		if (lane != 1 || isJump == true) {
			image(lilypad, 0, padPosY1_3[i], 100, 100);
		}
		if (lane != 3 || isJump == true) {
			image(lilypad, 350, padPosY1_3[i], 100, 100);
		}
	}
	
	for (let i = 0; i < padPosY2.length; i += 1) {
		if (step != i || reset > 1) {
			image(lilypad, 175, padPosY2[i], 100, 100);
		}
		if (lane != 2 || isJump == true) {
			image(lilypad, 175, padPosY2[i], 100, 100);
		}
	}


	if (reset == 0) { 
	scroll += 0.5 + step	* 0.12
	if((keyIsPressed === true && keyCode === 32)){
		if (test == 0) {
			startfX = fX
			startfY = fY
			fX = -75 
			fY = -75
			jumpScroll = scroll
			test += 1
		}
		
		if (lane == 1) {
			translate(startfX + 75, startfY + 75);
		} else if (lane == 2) {
			translate(startfX + 250, startfY + 75);
		} else if (lane == 3) {
			translate(startfX + 425, startfY + 75);
		}
		rotate(angle)
		
		image(jump, fX, fY, 150, 150);
		fY -= 3
		isJump = true;
		
	} else{
		if (test == 1) {
			JumpC(((600 + jumpScroll)- (step * 250) - 25) + 75, angle, fY + 75, offset);
			if (lane == 2) {
				JumpC(((475 + jumpScroll)- (step * 250) - 25) + 75, angle, fY +75, offset);
			}
			if (postJY  > padPosY1_3[step + 1] && postJY < padPosY1_3[step + 1] + 100 && postJX > 0 && postJX < 100){
				step += 1;
				lane = 1;

			} else if (postJY > padPosY1_3[step + 1] && postJY < padPosY1_3[step + 1] + 100 && postJX > 350 && postJX < 450) {
				step += 1;
				lane = 3;
				
			} else if (postJY > padPosY2[step]  && postJY < padPosY2[step] + 100 && postJX > 175 && postJX < 275 ) {
				lane = 2;
				
			} else if (lane == 2 && postJY > padPosY2[step + 1] && postJY < padPosY2[step + 1] + 100 && postJX > 175 && postJX < 275 ) {
				step += 1;
			}
			test = 0;
		}
		
		frogSpin()
	} 

	if (lane == 2) {
		if (padPosY2[step] > 800) {
			reset = 1;
		}
	} else {
		if (padPosY1_3[step] > 800) {
			reset = 1;
		}			  
	}

		
	tick = -100;
	} else {

		if (tick < 200 && reset == 1) {
			if (lane == 2) {
				returnSpeed(475 - step*250 + scroll - 275);
			} else {
				returnSpeed(600 - step*250 + scroll - 475);
			}
			frogSpin();
			if (tick >= 0 && tick < values.length) {
				scroll -= values[tick]
			}
			tick += 1
			
		} else if (reset == 1){
			reset = 2
			tick = -100
			returnMove(jump)
		} else if (reset == 2 && tick < 200) {
			returnMove(jump)
			returnSpeed(step*250);
			if (tick >= 0 && tick < values.length) {
				scroll -= values[tick]	
			}

			tick += 1
		} else if (tick < 300) {
			returnMove(frog)
			tick += 1
		} else {
			reset = 0;
			scroll = 0;
			step = 0;
			angle = 0;
		}

	}	
}


function JumpC(starty, angle, distance, offset) {
	if (distance < 0) {
		calcY = distance * -1
	} else {    
		calcY = distance
	}
	postJY = cos(angle) * calcY;
	postJX = tan(angle) * postJY + offset;
	postJY = starty - postJY  
}


function frogSpin() {
	if (lane == 1) {
			translate(50, padPosY1_3[step] + 50);
		} else if (lane == 2) {
			translate(225, padPosY2[step] + 50);
		} else if (lane == 3) {
			translate(400, padPosY1_3[step] + 50);
		}
		
		angle += 0.05;
		rotate(angle);
		
		image(lilypad, -50, -50, 100, 100);
		push()	
		if (lane == 2) {
			translate(-50, -(padPosY2[step] + 50));	
		} else {
			translate(-50, -(padPosY1_3[step] + 50));
		}
		translate(fX + 75, fY + 75);
		image(frog, -75, -75, 150, 150);
		pop()

		fX = -25  
		if (lane == 2) {
		   fY = ((475 + scroll)- (step * 250)) - 25
		} else {
			fY = ((600 + scroll)- (step * 250)) - 25
		}
		isJump = false;

		
		if (lane == 1) {
			offset = 50;
		} else if (lane == 2) {
			offset = 225;
		} else {
			offset = 400
		}
}


function returnSpeed(sum) {
	let n = 151; // must be odd for symmetry
	let mid = (n - 1) / 2;

	let base = [];
	let total = 0;

	for (let i = 0; i < n; i++) {
		let t = i / (n - 1);        // 0 → 1
		let d = abs(t - 0.5) * 2;   // 0 at center, 1 at edges

		// GAME-LIKE SHAPE:
		// sharp peak using exponential falloff
		let v = pow(1 - d, 4); // <- increase exponent for more drama

		base.push(v);
		total += v;
	}

	values = [];

	for (let i = 0; i < n; i++) {
		values[i] = (base[i] / total) * sum;
	}

}

function returnMove(type) {

	
	if (lane == 1) {
		image(type, -25, 575, 150, 150);
	} else if (lane == 2) {
		image(type, 150, 450, 150, 150);
	} else {
		image(type, 325, 575, 150, 150);
	}


}