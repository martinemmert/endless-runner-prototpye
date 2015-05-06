var TILE_ID_COUNT:number = 0;

module tiles {

	export function fromObject(object:any) : Tile {

		var tile:Tile;

		switch(object.type) {

			case TILE_TYPE.GHOST:
				tile = new Tile(object.width, object.height);
				break;

			case TILE_TYPE.BLOCK:
				tile = new BlockTile(object.width, object.height);
				break;

			case TILE_TYPE.TRIGGER:
				tile = new TriggerTile(object.width, object.height, object.triggerType, object.triggerMessage);
				break;

			case TILE_TYPE.OBSTACLE:
				tile = new ObstacleTile(object.width, object.height, object.triggerMessage, object.obstacleType);
				break;

			case TILE_TYPE.FLOOR:
				tile = new FloorTile(object.width, object.height);
				break;

			case TILE_TYPE.HERO:
				tile = new HeroTile(object.width, object.height);
				break;

		}

		if (object.id == null) {
			tile.id = "TILE_ID_" + TILE_ID_COUNT;
			TILE_ID_COUNT ++;
		} else {
			tile.id = object.id;
		}

		tile.x = object.x;
		tile.y = object.y;

		return tile;
	}

}