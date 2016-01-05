module game {

	export class World {

		/**
		 * creates a new instance of the class
		 */
		constructor() {
			this._tiles = new Array<tiles.Tile>();
			this._nonLevelTiles = new Array<tiles.Tile>();
			this._tilesRegister = {};
			this._collisions = new Array<tiles.Tile>();

			this._spawnPoint = new tiles.Tile(1, 1);

			this._heroTile = new tiles.HeroTile(1, 2);
			this._heroTile.id = "HERO";

			this._followingAbyss = new tiles.ObstacleTile(1, 1, tiles.TRIGGER_MESSAGES.DEATH_THROUGH_ABYSS, tiles.OBSTACLE_TILE_TYPE.ABYSS);
			this._followingAbyss.id = "FOLLOWING_ABYSS";
			this._followingAbyss.x = 12;
		}


		/*
		 * read-only properties
		 */
		protected _nonLevelTiles:Array<tiles.Tile>;
		get nonLevelTiles():Array<tiles.Tile> { return this._nonLevelTiles; }

		protected _tiles:Array<tiles.Tile>;
		get tiles():Array<tiles.Tile> { return this._tiles; }

		private _collisions:Array<tiles.Tile>;
		get collisions():Array<tiles.Tile> { return this._collisions; }

		private _spawnPoint:tiles.Tile = null;
		get spawnPoint():tiles.Tile { return this._spawnPoint; }

		private _heroTile:tiles.HeroTile;
		get heroTile():tiles.HeroTile { return this._heroTile; }

		/*
		 * private properties
		 */

		private _hero:Hero;

		private _followingAbyss:tiles.ObstacleTile;

		protected _tilesRegister:any;

		protected _debug:boolean = false;

		/*
		 * public methods
		 */
		getTileById(id:string):tiles.Tile {
			if (this._tilesRegister[id] != null) {

				var tile:tiles.Tile = this._tiles[this._tilesRegister[id]];

				if (tile.id != id) {
					this._nonLevelTiles[this._tilesRegister[id]];
				}

				return this._tiles[this._tilesRegister[id]];
			}

			return null;
		}

		setHero(p_hero:Hero) {
			this._hero = p_hero;
			this._tilesRegister["HERO"] = this._nonLevelTiles.push(this._heroTile) - 1;

			this._followingAbyss.attachTo(this._heroTile);
			this._followingAbyss.attachment.constrainY = 12;
			this._followingAbyss.triggered.add(this._onTriggerTriggered, this);

			this._tilesRegister["FOLLOWING_ABYSS"] = this._nonLevelTiles.push(this._followingAbyss) - 1;
		}

		setSpawnPoint(p_x:number, p_y:number):void {
			this._spawnPoint.x = p_x;
			this._spawnPoint.y = p_y;
		}


		setLevel(level:any) {

			var tileAttachments:Array<any> = [];

			this._clearMap();

			for (var i:number = 0, n:number = level.tiles.length; i < n; i++) {
				var tileObj = level.tiles[i];
				if (this._debug == false && (tileObj.triggerType && tileObj.triggerType == tiles.TRIGGER_TILE_TYPE.AUTO_JUMP || tileObj.type == tiles.TRIGGER_TILE_TYPE.AUTO_SLIDE)) continue;
				var tile = tiles.fromObject(tileObj);

				if (tile instanceof tiles.TriggerTile) {
					tile.triggered.add(this._onTriggerTriggered, this);
				}

				if (tileObj.attachment != null) {
					tileAttachments.push({tile: tile.id, attachment: tileObj.attachment});
				}

				this._tilesRegister[tile.id] = this._tiles.push(tile) - 1;

			}

			while (tileAttachments.length > 0) {
				var attachment:any = tileAttachments.splice(0, 1)[0];
				var tile:tiles.Tile = this.getTileById(attachment.tile);
				var target:tiles.Tile = this.getTileById(attachment.attachment.target);

				if (target) {

					tile.attachTo(target);

					if (attachment.attachment.offsetX) tile.attachment.offsetX = attachment.attachment.offsetX;
					if (attachment.attachment.offsetY) tile.attachment.offsetY = attachment.attachment.offsetY;
					if (attachment.attachment.constrainX) tile.attachment.constrainX = attachment.attachment.constrainX;
					if (attachment.attachment.constrainY) tile.attachment.constrainY = attachment.attachment.constrainY;

				}

			}

		}

		respawnHero() {
			this._hero.resurrect();
			this._hero.moveTo(this._spawnPoint.x, this._spawnPoint.y);
		}

		update(time:number):void {

			this._hero.update(time);

			this._syncHeroWithHeroTile();

			this._checkCollisions();

			this._resolveCollisions();

			this._syncHeroWithHeroTile();

			this._updateTiles(time);

		}

		/*
		 * private methods
		 */
		private _syncHeroWithHeroTile():void {
			this._heroTile.x = this._hero.x;
			this._heroTile.y = this._hero.y;
			this._heroTile.width = this._hero.width;
			this._heroTile.height = this._hero.height;
		}

		private _checkCollisions():void {

			// get the hero grid cells
			var heroGridCells:Array<number> = this._heroTile.gridCells;

			// always set the hero of ground
			this._hero.isOnFloor = false;

			// iterate over the tiles and check if they are colliding with the hero
			for (var i:number = 0, n:number = this.tiles.length; i < n; i++) {

				var tile:tiles.Tile = this.tiles[i];

				// skip if tile is null
				if (tile == null) continue;

				var tileGridCells:Array<number> = tile.gridCells;

				// continue loop if tile is a ghost or a block
				if (tile.type == tiles.TILE_TYPE.GHOST || tile.type == tiles.TILE_TYPE.BLOCK) continue;

				if (tile.type == tiles.TILE_TYPE.FLOOR) {
					if (this._checkCollissionBetweenTiles(heroGridCells, tileGridCells, true)) this._collisions.push(tile);
				} else {
					if (this._checkCollissionBetweenTiles(heroGridCells, tileGridCells, false)) this._collisions.push(tile);
				}
			}

			if (this._checkCollissionBetweenTiles(heroGridCells, this._followingAbyss.gridCells, false)) this._collisions.push(this._followingAbyss);
		}

		private _checkCollissionBetweenTiles(heroGridCells:Array<number>, tileGridCells:Array<number>, isFloor:boolean = false):boolean {
			var isCollidingX:boolean = false;
			var isCollidingY:boolean = false;

			if (isFloor) {

				if ((heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_X] < tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_X]) == false &&
					(heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_X] > tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_X]) == false &&
					(heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_Y] >= tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y]) == true &&
					(heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y] < tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y]) == true) {

					this._hero.isOnFloor = true;
					return true;
				}

			} else {
				if (heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_X] < tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_X] == false &&
					heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_X] > tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_X] == false) {
					isCollidingX = true;
				}

				if (heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_Y] < tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y] == false &&
					heroGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y] > tileGridCells[tiles.TILE_GRID_CELL_ACCESSOR.MAX_Y] == false) {
					isCollidingY = true;
				}

				if (isCollidingX && isCollidingY) {
					return true;
				}
			}
		}

		private _resolveCollisions():void {

			while (this.collisions.length > 0) {
				var tile:tiles.Tile = this._collisions.splice(0, 1)[0];

				if (tile.type == tiles.TILE_TYPE.FLOOR) {
					this._hero.moveTo(null, tile.gridCells[tiles.TILE_GRID_CELL_ACCESSOR.MIN_Y] - this._hero.height);
				}

				if (tile instanceof tiles.TriggerTile) {
					tile.trigger();
				}
			}

		}

		private _updateTiles(time:number):void {

			for (var i:number = 0, n:number = this.nonLevelTiles.length; i < n; i++) {
				if (!this.nonLevelTiles[i]) continue;
				this.nonLevelTiles[i].update(time);
			}

			// iterate over the tiles and update them
			for (var i:number = 0, n:number = this.tiles.length; i < n; i++) {
				if (!this.tiles[i]) continue;
				this.tiles[i].update(time);
			}

		}

		protected _onTriggerTriggered(triggerType:number, triggerMessage:number, x:number, y:number) {

			switch (triggerType) {
				case tiles.TRIGGER_TILE_TYPE.DEATH:
					switch (triggerMessage) {
						case tiles.TRIGGER_MESSAGES.DEATH_THROUGH_ABYSS:
							console.log("death through abyss");
							this._hero.die();
							break;

						case tiles.TRIGGER_MESSAGES.DEATH_THROUGH_OBSTACLE:
							console.log("death through obstacle");
							this._hero.die();
							break;
					}

					break;

				case tiles.TRIGGER_TILE_TYPE.AUTO_JUMP:
					this._hero.jump();
					break;

				case tiles.TRIGGER_TILE_TYPE.AUTO_SLIDE:
					this._hero.slide();
					break;

				case tiles.TRIGGER_TILE_TYPE.CHECKPOINT:
					this.setSpawnPoint(x, y);
					break;

				case tiles.TRIGGER_TILE_TYPE.COIN:
					break;
			}
		}

		private _clearMap():void {

			this._tiles.forEach(function (tile, index) {

				if (tile instanceof tiles.TriggerTile) {
					tile.triggered.removeAll();
				}

				delete this._tilesRegister[tile.id];
				this._tiles[index] = null;

			}, this);

			this._tiles = [];
		}
	}

}