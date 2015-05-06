///<reference path="utils/PositionAttachment.ts" />
module utils {

	export interface IPositionedObject {

		x:number;
		y:number;

		moveTo(x:number, y:number):void;

	}

}