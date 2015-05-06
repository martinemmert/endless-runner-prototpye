///<reference path="gamelib/graphics.ts" />
///<reference path="gamelib/game.ts" />
///<reference path="gamelib/input.ts" />

var doc:HTMLDocument = document;
var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
var scoreField:HTMLDivElement = <HTMLDivElement>document.getElementById("score");
var startGame:HTMLDivElement = <HTMLDivElement>document.getElementById("start-game");

var gameInstance:game.Game = new game.Game();
var renderer:graphics.DebugRenderer = new graphics.DebugRenderer(canvas);
var camera:graphics.Camera = new graphics.Camera(canvas.width, canvas.height, -3, 0, 1, false, true);
var inputInstance:input.DesktopInput = new input.DesktopInput(doc);
var timer:number;

renderer.setCamera(camera);
camera.attachTo(gameInstance.hero);

gameInstance.setInput(inputInstance);

gameInstance.onGameOver.add(function (score) {
	startGame.style.display = "block";
	scoreField.innerHTML = gameInstance.playerScore.toString();
	cancelAnimationFrame(timer);
});

gameInstance.prepareRound();

startGame.addEventListener("mousedown", function () {
	cancelAnimationFrame(timer);
	renderer.clear();
	gameInstance.startRound();
	timer = window.requestAnimationFrame(render);
	this.style.display = "none";
});

doc.addEventListener("keyup", function (event:KeyboardEvent) {

	if (event.keyCode != 32) return;
	if (!gameInstance.isGameOver) return false;

	cancelAnimationFrame(timer);
	renderer.clear();
	gameInstance.startRound();
	timer = window.requestAnimationFrame(render);
	startGame.style.display = "none";
	event.stopImmediatePropagation();
	event.preventDefault();

});


function render() {
	gameInstance.tick(1000 / 60);
	camera.update();
	renderer.renderWorld(gameInstance.world);
	scoreField.innerHTML = gameInstance.playerScore.toString();
	if (!gameInstance.isGameOver) timer = window.requestAnimationFrame(render);
}


gameInstance.tick(1000 / 60);
camera.update();
renderer.renderWorld(gameInstance.world);


scoreField.innerHTML = gameInstance.playerScore.toString();
