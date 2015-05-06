module tiles {

	export enum TILE_GRID_CELL_ACCESSOR {
		MIN_X, MIN_Y, MAX_X, MAX_Y
	}

	export class Tile implements utils.IPositionedObject {

		constructor(p_width:number, p_height:number) {
			this._width = p_width;
			this._height = p_height;
		}

		/*
		 * public properties
		 */
		public id:string;

		private _width:number = 0;

		get width():number { return this._width; }

		set width(value:number) {
			this._width = value;
		}

		private _height:number = 0;

		get height():number { return this._height; }

		set height(value:number) {
			this._height = value;
		}

		private _x:number = 0;

		get x():number { return this._x; }

		set x(value:number) {
			this._x = value;
		}

		private _y:number = 0;

		get y():number { return this._y; }

		set y(value:number) {
			this._y = value;
		}

		private _layer:number = 0;

		get layer():number { return this._layer; }

		set layer(value:number) {
			this._layer = value;
		}

		/*
		 * read-only properties
		 */

		protected _type:number = TILE_TYPE.GHOST;

		get type():number { return this._type; }

		protected _attachment:utils.PositionAttachment;

		get attachment():utils.PositionAttachment { return this._attachment; }

		get gridCells():Array<number> {
			return [
				Math.floor(this.x),
				Math.floor(this.y),
				Math.ceil(this.x + this.width - 1),
				Math.ceil(this.y + this.height - 1)
			]
		}

		/*
		 * public methods
		 */

		serialize():any {

			return {
				type: this._type,
				width: this._width,
				height: this._height,
				x: this._x,
				y: this._y
			};

		}

		translate(p_dx:number, p_dy:number = null):void {
			if (p_dx != null) this.x += p_dx;
			if (p_dy != null) this.y += p_dy;
		}

		moveTo(p_x:number, p_y:number):void {
			if (p_x != null) this.x = p_x;
			if (p_y != null) this.y = p_y;
		}

		withinBounds(p_x:number, p_y:number) : boolean {

			return (p_x >= this._x && p_x < (this._x + this._width)) && (p_y >= this._y && (p_y < this._y + this._height));

		}

		attachTo(p_target:utils.IPositionedObject) {
			if (this._attachment == null) {
				this._attachment = new utils.PositionAttachment(p_target, this);
			} else {
				this._attachment.attachTo(p_target);
			}
		}

		update(time:number = 0) {
			if (this._attachment) {
				this._attachment.update();
			}

		}

	}

}