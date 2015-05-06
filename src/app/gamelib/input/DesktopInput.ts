module input {

	export enum KEY_CODES {
		ARROW_UP = 38,
		ARROW_RIGHT = 39,
		ARROW_DOWN = 40,
		ARROW_LEFT = 37,
		SPACE = 32
	}

	export class DesktopInput implements IInput {

		static COMMANDS:any = {
			"SPACE": "COMMAND_JUMP",
			"ARROW_DOWN": "COMMAND_SLIDE"
		};

		constructor(document:HTMLDocument) {
			this._document = document;

			this._currentCommands = new Array<string>();

			this._document.addEventListener("keydown", (event:KeyboardEvent) => this._onKeyDown(event));
			this._document.addEventListener("keyup", (event:KeyboardEvent) => this._onKeyUp(event));

		}

		private _document:HTMLDocument;

		get document():HTMLDocument { return this._document; }

		private _currentCommands:Array<string>;

		get currentCommands():Array<string> { return this._currentCommands; }

		private _onKeyDown(event:KeyboardEvent) {
			if (event.repeat == false) {
				var key = KEY_CODES[event.keyCode];
				if (key != undefined && this._currentCommands.indexOf(DesktopInput.COMMANDS[key]) == -1) {
					this._currentCommands.push(DesktopInput.COMMANDS[key]);
				}
			}
		}

		private _onKeyUp(event:KeyboardEvent) {
			var key = KEY_CODES[event.keyCode];
			if (key != undefined) {
				var index:number = this._currentCommands.indexOf(DesktopInput.COMMANDS[key]);
				if (index > -1) {
					this._currentCommands.splice(index, 1);
				}
			}
		}

	}

}