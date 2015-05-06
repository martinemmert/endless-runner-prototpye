module game {

	export class Hero {

		constructor(p_width:number, p_height:number) {
			this._width = p_width;
			this._height = p_height;
			this._walkHeight = p_height;
			this._slideHeight = p_height * .5;

			this._died = new Signal();
			this._resurrected = new Signal();
		}

		/*
		 * private properties
		 */

		private _currentJumpForce:number = 0;

		private _currentSlideForce:number = 0;

		private _currentSlideShrinkForce:number = 0;

		private _currentStandUpForce:number = 0;

		private _walkHeight:number = 0;

		private _slideHeight:number = 0;

		/*
		 * read-only properties
		 */

		private _height:number = 0;

		get height():number { return this._height; }

		private _width:number = 0;

		get width():number { return this._width; }

		private _x:number = 0;

		get x():number { return this._x; }

		private _y:number = 0;

		get y():number {return this._y; }

		private _isDead:boolean = false;

		get isDead():boolean { return this._isDead; }

		private _isSliding:boolean = false;

		get isSliding():boolean { return this._isSliding; }

		private _died:Signal;

		get died():Signal { return this._died; }

		private _resurrected:Signal;

		get resurrected():Signal { return this._resurrected; }

		/*
		 * public properties
		 */
		public isOnFloor:boolean = false;

		/*
		 * public methods
		 */

		jump():void {

			if (this.isSliding) {
				this.standUp();
			} else if (!this.isDead && this.isOnFloor) {
				this._currentJumpForce = GameSettings.JUMP_FORCE;
				this.isOnFloor = false;
			}
		}

		slide():void {
			if (!this.isDead && this.isOnFloor && !this.isSliding) {
				this._currentJumpForce = GameSettings.SLIDE_JUMP_FORCE;
				this._currentSlideShrinkForce = GameSettings.SLIDE_SHRINK_FORCE;
				this._currentSlideForce = GameSettings.SLIDE_FORCE;
				this.isOnFloor = false;
				this._isSliding = true;
			}
		}

		standUp():void {
			if (!this.isDead && this.isOnFloor && this.isSliding) {
				this._currentJumpForce = GameSettings.STAND_UP_JUMP_FORCE;
				this._currentStandUpForce = GameSettings.STAND_UP_FORCE;
				this._isSliding = false;
				this.isOnFloor = false;
			}
		}

		moveTo(p_x:number, p_y:number = null):void {
			if (p_x != null) this._x = p_x;
			if (p_y != null) this._y = p_y;
		}

		translate(p_x:number, p_y:number = null):void {
			if (p_x != null) this._x += p_x;
			if (p_y != null) this._y += p_y;
		}

		die():void {
			this._isDead = true;
			this._died.dispatch();
		}

		resurrect():void {
			this._isDead = false;
			this._isSliding = false;
			this.isOnFloor = true;
			this._currentJumpForce = 0;
			this._currentSlideForce = 0;
			this._currentSlideShrinkForce = 0;
			this._currentStandUpForce = 0;
			this._setHeight(this._walkHeight);

			this._resurrected.dispatch();
		}

		update(time:number):void {

			// update the x & y properties
			this._y += (GameSettings.GRAVITY / time) - this._currentJumpForce;

			if (!this._isDead) {
				if (!this.isSliding) {
					this._x += (GameSettings.RUN_SPEED / time);
				} else {
					this._x += (GameSettings.SLIDE_SPEED / time);
				}
			}

			// update the height
			this._setHeight(this._height + this._currentStandUpForce - this._currentSlideShrinkForce);

			// constrain the forces
			this._currentJumpForce = Math.max(this._currentJumpForce - (GameSettings.JUMP_FORCE_REDUCTION / time), 0);
			this._currentSlideForce = Math.max(this._currentSlideForce - (GameSettings.SLIDE_FORCE_REDUCTION / time), 0);
			this._currentSlideShrinkForce = Math.max(this._currentSlideShrinkForce - (GameSettings.SLIDE_SHRINK_FORCE_REDUCTION / time), 0);
			this._currentStandUpForce = Math.max(this._currentStandUpForce - (GameSettings.STAND_UP_FORCE_REDUCTION / time), 0);
		}


		/*
		 * private methods
		 */

		private _setHeight(value:number):void {
			this._height = Math.min(this._walkHeight, Math.max(value, this._slideHeight));
		}

	}


}