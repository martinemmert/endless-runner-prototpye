///<reference path="DisplayTile.ts" />

module tiles {

	export enum TRIGGER_TILE_TYPE {
		DEATH,
		COIN,
		AUTO_JUMP,
		AUTO_SLIDE,
		CHECKPOINT,
		FINISH_LINE
	}

	export enum TRIGGER_MESSAGES {
		DEATH_THROUGH_OBSTACLE,
		DEATH_THROUGH_ABYSS,
		HIT_CHECKPOINT,
		HIT_FINISH_LINE,
		COLLECTED_COIN
	}

	export class TriggerTile extends DisplayTile {

		constructor(p_width:number, p_height:number, p_triggerType:number, p_triggerMessage:number) {
			super(p_width, p_height);

			// reset the type of the Tile
			this._type = TILE_TYPE.TRIGGER;

			// set the trigger type
			this._triggerType = p_triggerType;

			// set the trigger message
			this._triggerMessage = p_triggerMessage;

			// create the signal instance
			this._triggered = new Signal();
		}

		private _triggerType:number;

		get triggerType():number { return this._triggerType; }

		private _triggerMessage:number;

		get triggerMessage():number { return this._triggerMessage; }

		private _triggered:Signal;

		get triggered():Signal { return this._triggered; }

		trigger() {
			this._triggered.dispatch(this.triggerType, this.triggerMessage, this.x, this.y);
		}

		serialize():any {
			var obj = super.serialize();

			obj.triggerType = this._triggerType;
			obj.triggerMessage = this._triggerMessage;

			return obj;
		}
	}

}