var canvas = document.getElementById("myCanvas"),
	ctx = canvas.getContext("2d");

var x = canvas.width/2,
	y = canvas.height - 30,
	dx = 2,
	dy = -2,
	ballRadius = 10;

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#3399ff";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();

	if(y + dy > canvas.height - ballRadius || y + dy < 0 + ballRadius) {
		dy = -dy;
	}
	if(x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius) {
		dx = -dx;
	}

	x += dx;
	y += dy;
}
setInterval(draw, 10);