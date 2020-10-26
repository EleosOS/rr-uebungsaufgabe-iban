import { ibanKorrekt, länder } from './index.js';

export function relevanteFelderErmitteln(iban: string) {
	// Die Funktion soll nur korrekte IBAN akzeptieren
	if (!ibanKorrekt(iban)) {
		throw new Error('Die angegebene IBAN ist falsch!');
	}

	// Land von der Map holen
	let land = länder.get(iban.slice(0, 2));

	if (!land) {
		// return false
		throw new Error('Dieses Land wird für die Ermittlung der Kontonummer und Bankleitzahl derzeit nicht unterstützt.');
	}

	// Da die Funktion nach der IBAN Prüfung gerufen wird kann man davon ausgehen das sie korrekt ist.
	// Deswegen wird hier sorglos die IBAN nach dem Format aufgeteilt.
	let matches = iban.match(land.regExp);

	if (!matches) {
		throw new Error('Das Format der IBAN ist falsch!');
	} else {
		return matches;
	}
}