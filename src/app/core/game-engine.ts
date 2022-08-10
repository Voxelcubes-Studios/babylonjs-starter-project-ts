import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math';

import { GameEnum } from '../enum/game.enum';
import { Level1 } from '../levels/level1/level1';

export class GameEngine {
	public engine: any;
	public canvas: any;
	public scene: any;
	public rollingAverage: any;
	public camera: any;

	private level1: Level1 = new Level1();

	protected resizeCanvas(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	protected resizeEngine(): void {
		this.resizeCanvas();
		this.engine.resize();
	}

	protected createScene(): void {
		this.canvas = document.getElementById(GameEnum.GAME_CANVAS_NAME) as HTMLCanvasElement;
		this.resizeCanvas();

		this.engine = new Engine(this.canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true,
		});

		this.engine.hideLoadingUI();

		this.scene = new Scene(this.engine);
		this.scene.clearColor = Color4.FromHexString('#e2e2e2');

		// Load Level
		this.level1.start(this.scene);

		this.scene.registerBeforeRender(() => {
			// Alternatively, you can use this to animate you models
		});
	}

	protected renderLoop(): void {
		if (this.scene) {
			this.level1.update(this.engine.getDeltaTime());
			this.scene.render();
		}
	}

	protected startRenderLoop(): void {
		this.engine.runRenderLoop(this.renderLoop.bind(this));
	}

	protected stopRenderLoop(): void {
		this.engine.stopRenderLoop();
	}

	protected update(): void {
		this.startRenderLoop();
		window.addEventListener('resize', this.resizeEngine.bind(this));
	}

	public start(): void {
		this.createScene();
		this.update();
	}

	public destroy(): void {
		window.removeEventListener('resize', this.resizeEngine.bind(this));
		if (this.engine) {
			this.engine.dispose();
		}
	}
}
