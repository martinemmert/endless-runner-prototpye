module graphics {

	export class Camera implements utils.IPositionedObject {

		constructor(viewPortWidth:number, viewPortHeight:number, offsetX:number = 0, offsetY:number = 0, zoom:number = 1, constrainedX:boolean = false, constrainedY:boolean = false) {
			this._viewPortWidth = viewPortWidth;
			this._viewPortHeight = viewPortHeight;
			this._offsetX = offsetX;
			this._offsetY = offsetY;
			this._zoom = zoom;
			this._constrainedX = constrainedX;
			this._constrainedY = constrainedY;
		}

		private _x:number = 0;

		get x():number { return this._constrainedX ? 0 : this._x + this._offsetX; }

		set x(value:number) { this._x = value; }

		private _y:number = 0;

		get y():number { return this._constrainedY ? 0 : this._y + this._offsetY; }

		private _offsetX:number;

		private _offsetY:number;

		private _constrainedX:boolean = false;

		private _constrainedY:boolean = false;

		private _viewPortWidth:number;

		get viewPortWidth():number { return this._viewPortWidth; }

		private _viewPortHeight:number;

		get viewPortHeight():number { return this._viewPortHeight; }

		private _zoom:number = 1;

		get zoom():number { return this._zoom }

		protected _attachment:utils.PositionAttachment;

		get attachment() : utils.PositionAttachment { return this._attachment; }

		attachTo(p_target:utils.IPositionedObject) {
			if (this._attachment == null) {
				this._attachment = new utils.PositionAttachment(p_target, this);
			} else {
				this._attachment.attachTo(p_target);
			}
		}

		moveTo(x:number, y:number):void {
			this._x = x;
			this._y = y;
		}

		zoomTo(value:number) {
			this._zoom = value;
		}

		update() : void {
			if (this._attachment) {
				this._attachment.update();
			}
		}
	}

}