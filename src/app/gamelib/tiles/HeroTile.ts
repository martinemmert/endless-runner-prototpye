///<reference path="DisplayTile.ts" />

module tiles {

	export class HeroTile extends DisplayTile {

		constructor(p_width:number, p_height:number) {
			super(p_width, p_height);

			this._type = TILE_TYPE.HERO;
		}

	}

}
