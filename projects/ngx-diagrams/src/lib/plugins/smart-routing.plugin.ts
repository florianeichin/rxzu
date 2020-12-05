import { DiagramEngine } from '../services/engine.service';
import * as Easystar from 'easystarjs';

export const ROUTING_SCALING_FACTOR = 10;

export class PathFinding {
	private pathFinderInstance: Easystar.js;

	constructor(private diagramEngine: DiagramEngine) {
		this.pathFinderInstance = new Easystar.js();
		this.pathFinderInstance.setIterationsPerCalculation(1000);
		this.pathFinderInstance.setAcceptableTiles(0);
		this.pathFinderInstance.enableDiagonals();
		this.pathFinderInstance.enableCornerCutting();
		this.pathFinderInstance.enableSync();
	}

	/**
	 * Taking as argument a fully unblocked walking matrix, this method
	 * finds a direct path from point A to B.
	 */
	calculatePath(
		from: {
			x: number;
			y: number;
		},
		to: {
			x: number;
			y: number;
		}
	): Promise<{ x: number; y: number }[]> {
		return new Promise((resolve, reject) => {
			// getting the wrong matrix! need to getRoutingMatrix();
			const matrix = this.diagramEngine.getCanvasMatrix();

			this.pathFinderInstance.setGrid(matrix);

			const fromX = this.diagramEngine.translateRoutingX(Math.floor(from.x / ROUTING_SCALING_FACTOR));
			const toX = this.diagramEngine.translateRoutingX(Math.floor(to.x / ROUTING_SCALING_FACTOR));
			const fromY = this.diagramEngine.translateRoutingX(Math.floor(from.y / ROUTING_SCALING_FACTOR));
			const toY = this.diagramEngine.translateRoutingX(Math.floor(to.y / ROUTING_SCALING_FACTOR));

			this.pathFinderInstance.findPath(fromX, fromY, toX, toY, path => {
				resolve(path);
			});

			this.pathFinderInstance.calculate();
		});
	}
}
