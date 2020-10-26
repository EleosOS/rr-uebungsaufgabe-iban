import { länder, prüfzifferAusrechnen, ibanKorrekt } from './index.js';

export function ibanErmitteln(ISOLandCode: string, blz: string, kontoNr: string) {
	let IBAN: string;
	let prüfziffer: string;
	let land;
	
	// Eingaben prüfen
	if (ISOLandCode.length !== 2) {
		throw new Error('Ländercode muss 2 Zeichen lang sein!');
	} else if (blz.length === 0) {
		throw new Error('Die Bankleitzahl fehlt!');
	} else if (kontoNr.length === 0) {
		throw new Error('Die Kontonummer fehlt!');
	} else {
		// Land von IBAN_Länder holen
		land = länder.get(ISOLandCode);

		if (!land) {
			throw new Error('Dieses Land wird für die Ermittlung der IBAN derzeit nicht unterstützt.');
		}
	}

	// blz und kontoNr zusammen dürfen nicht die max. Läge überschreiten
	if (land.länge < (blz.length + kontoNr.length)) {
		throw new Error('Die Eingaben sind zu groß!');
	}

	// Kontonummer mit Nullen füllen bis die BBAN die korrekte länge hat
	// Korrekte Länge = max. Länge - Bankleitzahl
	while (kontoNr.length < (land.länge - blz.length)) {
		kontoNr = '0' + kontoNr;
	}

	prüfziffer = prüfzifferAusrechnen(ISOLandCode, blz + kontoNr);

	IBAN = ISOLandCode + prüfziffer + blz + kontoNr;

	return IBAN;
}