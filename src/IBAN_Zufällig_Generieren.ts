import { länder } from './index.js';

// Ruft eigentlich nur class land.random, außer das das land zufällig gewählt wird
export function zufälligeIBAN() {
	const land = länder.get([...länder.keys()][Math.floor(Math.random() * länder.size)])

	return land!.random;
}