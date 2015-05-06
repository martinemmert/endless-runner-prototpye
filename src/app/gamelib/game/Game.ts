module game {

	export class Game {

		constructor() {

			this._hero = new Hero(1, 2);
			this._hero.died.add(this._onHeroDied, this);

			this._world = new World();

			this._ticked = new Signal();
			this._onGameOver = new Signal();

			this._initWorld();
		}

		private _input:input.IInput;

		private _tickTime:number;
		get tickTime():number { return this._tickTime; }

		private _hero:Hero;
		get hero():Hero { return this._hero; }

		protected _world:World;
		get world():World { return this._world; }

		private _ticked:Signal;
		get ticked():Signal { return this._ticked; }

		private _isStarted:boolean = false;

		get isStarted():boolean { return this._isStarted; }

		private _isPrepared:boolean = false;

		get isPrepared():boolean { return this._isPrepared; }

		private _isGameOver:boolean = true;

		get isGameOver():boolean { return this._isGameOver; }

		private _playerScore:number = 0;

		get playerScore():number { return this._playerScore; }

		private _onGameOver:Signal;

		get onGameOver():Signal { return this._onGameOver; }

		setInput(input:input.IInput):void {
			this._input = input;
		}

		prepareRound():void {

			var level = this._loadLevel();

			this._world.setHero(this._hero);
			this._world.setLevel(level);
			this._world.setSpawnPoint(2, 6);

			this._isPrepared = true;
		}

		startRound():void {
			console.log("start round");

			if (this.isPrepared) {
				this._isGameOver = false;
				this._playerScore = 0;
				this._world.respawnHero();
				this._isStarted = true;
				this._tick(1);
			}
		}

		tick(time:number):void {
			this._tick(time);
		}

		private _tick(time:number):void {

			while (this._input.currentCommands.length > 0) {
				var cmd:string = this._input.currentCommands.splice(0, 1)[0];

				switch (cmd) {
					case "COMMAND_JUMP":
						this._hero.jump();
						break;

					case "COMMAND_SLIDE":
						this._hero.slide();
						break;
				}
			}

			this._world.update(1);
			this._tickTime ++;
			this._playerScore = Math.ceil(this._hero.x);
			this._ticked.dispatch();
		}

		protected _initWorld() : void {
			this._world = new World();
		}

		private _loadLevel():any {

			return {"tiles":[{"type":4,"width":6,"height":1,"x":0,"y":9},{"type":4,"width":6,"height":1,"x":6,"y":9},{"type":4,"width":6,"height":1,"x":12,"y":9},{"type":4,"width":6,"height":1,"x":18,"y":9},{"type":4,"width":6,"height":1,"x":24,"y":9},{"type":4,"width":6,"height":1,"x":30,"y":9},{"type":4,"width":6,"height":1,"x":36,"y":9},{"type":4,"width":6,"height":1,"x":42,"y":9},{"type":4,"width":6,"height":1,"x":48,"y":9},{"type":4,"width":6,"height":1,"x":54,"y":9},{"type":2,"width":1,"height":2,"x":15,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":2,"x":13,"y":7,"triggerType":2},{"type":3,"width":1,"height":1,"x":24,"y":8,"triggerType":3},{"type":3,"width":1,"height":1,"x":34,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":39,"y":8,"triggerType":2},{"type":2,"width":3,"height":2,"x":41,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":6,"height":3,"x":27,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":12,"height":1,"x":53,"y":7},{"type":2,"width":1,"height":2,"x":52,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":50,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":60,"y":6,"triggerType":2},{"type":4,"width":10,"height":1,"x":65,"y":5},{"type":2,"width":1,"height":2,"x":64,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":14,"height":1,"x":75,"y":9},{"type":2,"width":1,"height":3,"x":75,"y":6,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":2,"x":76,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":77,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":69,"y":4,"triggerType":3},{"type":3,"width":1,"height":1,"x":74,"y":4,"triggerType":2},{"type":3,"width":1,"height":2,"x":3,"y":7,"triggerType":4},{"type":4,"width":7,"height":1,"x":92,"y":9},{"type":3,"width":1,"height":1,"x":87,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":96,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":104,"y":8,"triggerType":2},{"type":4,"width":3,"height":1,"x":103,"y":9},{"type":4,"width":3,"height":1,"x":110,"y":9},{"type":3,"width":1,"height":1,"x":111,"y":8,"triggerType":2},{"type":2,"width":1,"height":2,"x":98,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":105,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":10,"height":1,"x":119,"y":9},{"type":3,"width":1,"height":1,"x":129,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":124,"y":8,"triggerType":3},{"type":4,"width":10,"height":1,"x":133,"y":9},{"type":2,"width":6,"height":1,"x":128,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":12,"height":1,"x":143,"y":9},{"type":4,"width":12,"height":1,"x":155,"y":9},{"type":4,"width":12,"height":1,"x":167,"y":9},{"type":2,"width":4,"height":1,"x":150,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":4,"height":1,"x":163,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":148,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":161,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":178,"y":8,"triggerType":3},{"type":4,"width":15,"height":1,"x":179,"y":10},{"type":2,"width":8,"height":6,"x":183,"y":3,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":14,"height":1,"x":194,"y":10},{"type":4,"width":14,"height":1,"x":208,"y":10},{"type":4,"width":14,"height":1,"x":222,"y":10},{"type":4,"width":14,"height":1,"x":236,"y":10},{"type":4,"width":14,"height":1,"x":250,"y":10},{"type":3,"width":1,"height":1,"x":194,"y":9,"triggerType":2},{"type":3,"width":1,"height":1,"x":199,"y":9,"triggerType":2},{"type":2,"width":1,"height":2,"x":202,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":201,"y":9,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":203,"y":9,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":5,"height":2,"x":200,"y":2,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":7,"height":1,"x":208,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":7,"height":3,"x":223,"y":6,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":219,"y":9,"triggerType":3},{"type":3,"width":1,"height":1,"x":232,"y":9,"triggerType":2},{"type":4,"width":9,"height":1,"x":241,"y":6},{"type":2,"width":9,"height":1,"x":241,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":241,"y":4,"triggerType":1},{"type":3,"width":1,"height":1,"x":243,"y":4,"triggerType":1},{"type":3,"width":1,"height":1,"x":245,"y":4,"triggerType":1},{"type":3,"width":1,"height":1,"x":247,"y":4,"triggerType":1},{"type":3,"width":1,"height":1,"x":249,"y":4,"triggerType":1},{"type":2,"width":1,"height":2,"x":261,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":260,"y":9,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":3,"x":262,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":258,"y":9,"triggerType":2},{"type":4,"width":8,"height":1,"x":265,"y":10},{"type":4,"width":8,"height":1,"x":273,"y":8},{"type":2,"width":1,"height":2,"x":272,"y":8,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":269,"y":9,"triggerType":2},{"type":3,"width":1,"height":1,"x":279,"y":7,"triggerType":2},{"type":4,"width":13,"height":1,"x":283,"y":5},{"type":3,"width":1,"height":1,"x":294,"y":4,"triggerType":3},{"type":2,"width":11,"height":3,"x":296,"y":0,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":4,"height":1,"x":297,"y":7},{"type":4,"width":4,"height":1,"x":304,"y":9},{"type":3,"width":1,"height":1,"x":300,"y":6,"triggerType":2},{"type":3,"width":1,"height":1,"x":307,"y":8,"triggerType":2},{"type":2,"width":3,"height":3,"x":309,"y":7,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":12,"height":1,"x":312,"y":10},{"type":4,"width":12,"height":1,"x":327,"y":10},{"type":2,"width":3,"height":1,"x":324,"y":9,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":3,"width":1,"height":1,"x":321,"y":9,"triggerType":2},{"type":3,"width":1,"height":1,"x":338,"y":9,"triggerType":2},{"type":4,"width":9,"height":1,"x":342,"y":6},{"type":4,"width":3,"height":1,"x":354,"y":6},{"type":4,"width":3,"height":1,"x":362,"y":6},{"type":3,"width":1,"height":1,"x":350,"y":5,"triggerType":2},{"type":3,"width":1,"height":1,"x":356,"y":5,"triggerType":2},{"type":3,"width":1,"height":1,"x":346,"y":5,"triggerType":3},{"type":3,"width":1,"height":1,"x":364,"y":5,"triggerType":2},{"type":4,"width":11,"height":1,"x":373,"y":11},{"type":3,"width":1,"height":1,"x":383,"y":10,"triggerType":2},{"type":3,"width":1,"height":1,"x":390,"y":10,"triggerType":2},{"type":4,"width":3,"height":1,"x":389,"y":11},{"type":4,"width":3,"height":1,"x":397,"y":11},{"type":4,"width":3,"height":1,"x":405,"y":11},{"type":3,"width":1,"height":1,"x":398,"y":10,"triggerType":2},{"type":3,"width":1,"height":1,"x":406,"y":10,"triggerType":2},{"type":4,"width":8,"height":1,"x":410,"y":9},{"type":4,"width":11,"height":1,"x":425,"y":9},{"type":3,"width":1,"height":1,"x":417,"y":8,"triggerType":2},{"type":4,"width":4,"height":1,"x":421,"y":6},{"type":3,"width":1,"height":1,"x":424,"y":5,"triggerType":3},{"type":2,"width":6,"height":3,"x":430,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":6,"height":3,"x":330,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":5,"height":2,"x":350,"y":1,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":3,"height":2,"x":358,"y":4,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":11,"height":1,"x":436,"y":9},{"type":3,"width":1,"height":1,"x":438,"y":8,"triggerType":2},{"type":3,"width":1,"height":1,"x":442,"y":8,"triggerType":2},{"type":4,"width":10,"height":1,"x":447,"y":7},{"type":4,"width":10,"height":1,"x":457,"y":11},{"type":4,"width":10,"height":1,"x":468,"y":7},{"type":4,"width":10,"height":1,"x":479,"y":3},{"type":3,"width":1,"height":1,"x":464,"y":10,"triggerType":2},{"type":3,"width":1,"height":1,"x":475,"y":6,"triggerType":2},{"type":2,"width":5,"height":3,"x":469,"y":2,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":7,"height":1,"x":481,"y":0,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":1,"height":1,"x":489,"y":3},{"type":3,"width":1,"height":1,"x":489,"y":2,"triggerType":3},{"type":2,"width":6,"height":1,"x":491,"y":0,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":4,"height":1,"x":493,"y":1,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":3,"height":1,"x":494,"y":2,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":2,"height":1,"x":495,"y":3,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":496,"y":4,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":492,"y":1,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":493,"y":2,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":494,"y":3,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":495,"y":4,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":2,"width":1,"height":1,"x":496,"y":5,"triggerType":0,"triggerMessage":1,"obstacleType":79},{"type":4,"width":7,"height":1,"x":493,"y":11},{"type":3,"width":1,"height":1,"x":498,"y":10,"triggerType":2},{"type":4,"width":4,"height":1,"x":502,"y":11},{"type":3,"width":1,"height":1,"x":504,"y":10,"triggerType":2},{"type":4,"width":9,"height":1,"x":508,"y":8},{"type":3,"width":1,"height":1,"x":516,"y":7,"triggerType":2}]};
		}

		private _onHeroDied() {
			this._isGameOver = true;
			this._onGameOver.dispatch(this._playerScore);
		}

	}

}