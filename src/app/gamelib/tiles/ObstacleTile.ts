///<reference path="TriggerTile.ts" />

module tiles {

	export enum OBSTACLE_TILE_TYPE {
		DEFAULT,
		ABYSS
	}

	export class ObstacleTile extends TriggerTile {

		constructor(p_width:number, p_height:number, p_triggerMessage:number, p_obstacleType:number = OBSTACLE_TILE_TYPE.DEFAULT) {
			super(p_width, p_height, TRIGGER_TILE_TYPE.DEATH, p_triggerMessage);

			// set the type of the tile
			this._type = TILE_TYPE.OBSTACLE;

			// set the type of the obstacle
			this._obstacleType = p_obstacleType;
		}

		protected _obstacleType:number;

		get obstacleType():number { return this._obstacleType; }

		serialize() : any {
			var obj = super.serialize();

			obj.obstacleType = this._obstacleType;

			return obj;
		}

	}

}