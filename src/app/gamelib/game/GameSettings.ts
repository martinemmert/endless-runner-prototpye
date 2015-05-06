module game {

	export class GameSettings {

		/**
		 * The size of a tile in px
		 * @type {number}
		 */
		static TILE_SIZE:number = 20;

		/**
		 * the gravity force value
		 * @type {number}
		 */
		static GRAVITY:number = .8;

		/**
		 * the speed value of the worlds scrolling
		 * @type {number}
		 */
		static RUN_SPEED:number = .32;

		static SLIDE_SPEED:number = .34;

		static JUMP_FORCE:number = 1.4;

		static JUMP_FORCE_REDUCTION:number = .05;

		static SLIDE_JUMP_FORCE:number = .85;

		static STAND_UP_JUMP_FORCE:number = 1.175;

		static SLIDE_FORCE:number = 3;

		static SLIDE_FORCE_REDUCTION:number = .05;

		static SLIDE_SHRINK_FORCE:number = .2;

		static SLIDE_SHRINK_FORCE_REDUCTION:number = .005;

		static STAND_UP_FORCE:number = .2;

		static STAND_UP_FORCE_REDUCTION:number = .005;

	}

}