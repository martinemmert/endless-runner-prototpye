module graphics {

	export class DebugRenderer implements IRenderer {

		public tracePlayer:boolean = true;


		protected _canvas:HTMLCanvasElement;
		protected _ctx:CanvasRenderingContext2D;
		protected _camera:Camera;

		private _playerTraces:Array<any>;

		constructor(canvas:HTMLCanvasElement) {
			this._canvas = canvas;
			this._ctx = canvas.getContext("2d");
		}

		setCamera(camera:Camera):void {
			this._camera = camera;
		}

		renderWorld(world:game.World):void {

			this._ctx.clearRect(0, 0, this._camera.viewPortWidth, this._camera.viewPortHeight);

			this._drawTileGrid();
			this._drawTiles(world.tiles);
			this._drawTiles(world.nonLevelTiles);

			if (this.tracePlayer) {
				if (!this._playerTraces) this._playerTraces = [];
				this._playerTraces.push({x: world.heroTile.x, y: world.heroTile.y, width: world.heroTile.width, height: world.heroTile.height});
				this._drawPlayerTrace();
			}
		}

		clear() : void {
			this._playerTraces = [];
			this._ctx.clearRect(0, 0, this._camera.viewPortWidth, this._camera.viewPortHeight);
		}

		_drawTileGrid():void {
			var rows = Math.ceil(this._camera.viewPortWidth / game.GameSettings.TILE_SIZE);
			var cols = Math.ceil(this._camera.viewPortHeight / game.GameSettings.TILE_SIZE);

			this._ctx.save();

			this._ctx.lineWidth = 0.5;
			this._ctx.strokeStyle = "rgba(150, 150, 150, .5)";
			this._ctx.setLineDash([1, 2]);
			this._ctx.beginPath();

			var offsetX = this._camera.x * game.GameSettings.TILE_SIZE % game.GameSettings.TILE_SIZE;

			for (var r = 0; r < rows; r++) {
				this._ctx.moveTo(r * game.GameSettings.TILE_SIZE - offsetX, 0);
				this._ctx.lineTo(r * game.GameSettings.TILE_SIZE - offsetX, this._camera.viewPortHeight);
			}


			for (var c = 0; c < cols; c++) {
				this._ctx.moveTo(0, c * game.GameSettings.TILE_SIZE);
				this._ctx.lineTo(this._camera.viewPortWidth, c * game.GameSettings.TILE_SIZE);
			}


			this._ctx.stroke();
			this._ctx.restore();
		}

		_drawTiles(tiles:Array<tiles.Tile>) {
			for (var i = 0, n = tiles.length; i < n; i++) {
				var tile = tiles[i];
				this._drawTile(tile);
			}
		}

		_drawTile(tile:tiles.Tile) : void {

			if (tile == null || (tile.x + tile.width - this._camera.x) * game.GameSettings.TILE_SIZE < 0 || (tile.x - this._camera.x) * game.GameSettings.TILE_SIZE > this._camera.viewPortWidth) return;

			this._ctx.save();
			this._ctx.lineWidth = 0.5;
			this._ctx.miterLimit = 0;
			this._ctx.lineCap = "butt";
			this._ctx.lineJoin = "miter";

			switch (tile.type) {
				case tiles.TILE_TYPE.OBSTACLE:

					if ((<tiles.ObstacleTile>tile).obstacleType == tiles.OBSTACLE_TILE_TYPE.ABYSS) {
						this._ctx.fillStyle = "rgba(190,190,0,0.5)";
						this._ctx.strokeStyle = "rgba(190,190,0,0.75)";
					} else {
						this._ctx.fillStyle = "rgba(190,0,0,0.5)";
						this._ctx.strokeStyle = "rgba(190,0,0,0.75)";
					}
					break;

				case tiles.TILE_TYPE.GHOST:
					this._ctx.fillStyle = "rgba(0,0,0,0.1)";
					this._ctx.strokeStyle = "rgba(0,0,0,0.3)";
					break;

				case tiles.TILE_TYPE.BLOCK:
					this._ctx.fillStyle = "rgba(0,0,0,0.5)";
					this._ctx.strokeStyle = "rgba(0,0,0,0.75)";
					break;

				case tiles.TILE_TYPE.TRIGGER:
					this._ctx.fillStyle = "rgba(1,190,190,0.5)";
					this._ctx.strokeStyle = "rgba(1,190,190,0.75)";
					break;

				case tiles.TILE_TYPE.FLOOR:
					this._ctx.fillStyle = "rgba(190, 0, 190, .5)";
					this._ctx.strokeStyle = "rgba(190, 0, 190, .75)";
					break;

				case tiles.TILE_TYPE.HERO:
					this._ctx.fillStyle = "rgba(0,190,0,0.5)";
					this._ctx.strokeStyle = "rgba(0,190,0,0.75)";
					break;
			}

			this._ctx.fillRect((tile.x - this._camera.x) * game.GameSettings.TILE_SIZE, (tile.y - this._camera.y) * game.GameSettings.TILE_SIZE, tile.width * game.GameSettings.TILE_SIZE, tile.height * game.GameSettings.TILE_SIZE);
			//this._ctx.strokeRect((tile.x - this._camera.x) * Game.GameSettings.TILE_SIZE, (tile.y - this._camera.y) * Game.GameSettings.TILE_SIZE, tile.width * Game.GameSettings.TILE_SIZE, tile.height * Game.GameSettings.TILE_SIZE);
			this._ctx.restore();
		}

		_drawPlayerTrace() : void {
			this._ctx.fillStyle = "rgba(0,190,0,0.5)";
			this._ctx.strokeStyle = "rgba(0,190,0,0.75)";

			this._ctx.save();
			this._ctx.lineWidth = 0.5;
			this._ctx.miterLimit = 0;
			this._ctx.lineCap = "butt";
			this._ctx.lineJoin = "miter";

			this._ctx.beginPath();

			for (var i:number = 0, l:number = this._playerTraces.length; i < l; i++) {
				var obj = this._playerTraces[i];
				this._drawRect(obj.x, obj.y, obj.width, obj.height);
			}

			this._ctx.stroke();
			this._ctx.restore();
		}

		_drawRect(x, y, width, height) {

			x = (x - this._camera.x)  * game.GameSettings.TILE_SIZE;
			y = (y - this._camera.y)  * game.GameSettings.TILE_SIZE;

			width  *= game.GameSettings.TILE_SIZE;
			height  *= game.GameSettings.TILE_SIZE;

			this._ctx.rect(x, y, width, height);
		}

	}

}