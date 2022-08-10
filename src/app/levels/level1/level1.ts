import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Color3, Axis, Space } from '@babylonjs/core/Maths/math';
import { CubeTexture } from '@babylonjs/core/Materials';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { SceneLoader } from '@babylonjs/core';

import '@babylonjs/loaders/glTF'; // Side Effect Only
import '../../../assets/glb/toxic_box1.glb'; // Side Effect Only
import pbrenv from '../../../assets/env/northshore.env';
import { GameEnum } from '../../enum/game.enum';

export class Level1 {
	public canvas: any;
	public scene: any;
	public mesh: any;

	constructor() {
		this.canvas = document.getElementById(GameEnum.GAME_CANVAS_NAME);
	}

	private addCamera(scene: any): void {
		const camera = new ArcRotateCamera(
			'FreeCamera',
			-Math.PI / 2,
			1.4,
			2.8,
			new Vector3(0, 0, 0),
			scene
		);

		camera.wheelPrecision = 120;
		camera.minZ = 0.1;
		camera.panningSensibility = 0;

		scene.activeCamera = camera;
		scene.activeCamera.attachControl(this.canvas, true);
	}

	private addLight(scene: any): void {
		// Hemispheric Light
		const light = new HemisphericLight('hemiLight', new Vector3(-1, 1, 0), scene);
		light.diffuse = Color3.FromHexString('#cccccc');
		light.specular = Color3.FromHexString('#000000');
		light.groundColor = Color3.FromHexString('#cccccc');
		light.intensity = 0.5;

		// Directional Light
		const dlight = new DirectionalLight(GameEnum.MAIN_LIGHT, new Vector3(-1, -2, -1), scene);
		dlight.position = new Vector3(20, 40, 20);
		dlight.diffuse = Color3.FromHexString('#ffffff');
		dlight.intensity = 1.2;
	}

	private addPbrEnvironment(scene: any): void {
		const hdrTexture = CubeTexture.CreateFromPrefilteredData(pbrenv, scene);
		scene.environmentTexture = hdrTexture;
	}

	public start(scene: any): void {
		this.scene = scene;

		this.addCamera(scene);
		this.addLight(scene);
		this.addPbrEnvironment(scene);

		SceneLoader.ImportMesh(
			'',
			'assets/glb/',
			'toxic_box1.glb',
			this.scene,
			(meshes: any, particleSystems: any, skeletons: any) => {
				this.mesh = meshes[0];
			}
		);
	}

	public update(dt: number): void {
		if (this.mesh) {
			this.mesh.rotate(Axis.Y, (Math.PI / 2) * GameEnum.ROTATE_SPEED, Space.WORLD);
		}
	}
}
