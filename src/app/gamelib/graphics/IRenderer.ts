module graphics {

	export interface IRenderer {
		setCamera(camera:Camera):void;
		renderWorld(world:game.World) : void;
		clear() : void;
	}

}