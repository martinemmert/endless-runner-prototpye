module utils {

	export class PositionAttachment {

		constructor(p_target:IPositionedObject, p_attachment:IPositionedObject, p_offsetX:number = 0, p_offsetY:number = 0, p_constrainX:any = false, p_constrainY:any = false) {

			this._target = p_target;
			this._attachment = p_attachment;
			this.offsetX = p_offsetX;
			this.offsetY = p_offsetY;
			this.constrainX = p_constrainX;
			this.constrainY = p_constrainY;

		}

		private _target:IPositionedObject;
		private _attachment:IPositionedObject;



		offsetX:number = 0;
		offsetY:number = 0;
		constrainX:any = false;
		constrainY:any = false;

		attachTo(p_target:IPositionedObject) : void {
			this._target = p_target;
		}

		detach() : void {
			this._target = null;
		}

		update() : void {
			if (this._target) {
				var x:number = this._target.x + this.offsetX;
				var y:number = this._target.y + this.offsetY;

				if (this.constrainX != false) x = this.constrainX;
				if (this.constrainY != false) y = this.constrainY;

				this._attachment.moveTo(x, y);
			}
		}

	}

}