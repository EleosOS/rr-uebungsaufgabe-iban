import { buchstabenInNummernUmwandeln } from './index.js';

export function ibanKorrekt(iban: string) {
	let ländererkennung: string;
	let prüfziffer: string;
	let bban: string;
	let prüfsumme: string;
	let zusammenrechnung: number;

	// Ländererkennung (ISOLandCode) rausschneiden
	ländererkennung = iban.slice(0, 2);

	// Prüfziffer rausschneiden
	prüfziffer = iban.slice(2, 4);

	// BBAN rausschneiden
	bban = iban.slice(4);

	// Prüfsumme zusammensetzen, alle Buchstaben mit Position im Alphabet ersetzen
	prüfsumme = buchstabenInNummernUmwandeln(bban + ländererkennung + prüfziffer);

	// Prüfsumme in BigInt umwandeln (ist immmer noch ein String) und mit Modulo 97 verrechnen
	zusammenrechnung = Number(BigInt(prüfsumme) % BigInt(97));
	
	// Kommt am Ende 1 raus, ist die IBAN korrekt
	return zusammenrechnung == 1;
}
