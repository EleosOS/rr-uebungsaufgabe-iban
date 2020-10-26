export * from './IBAN_Überprüfung.js';
export * from './IBAN_Länder.js';
export * from './IBAN_Ermitteln.js';
export * from './Relevante_Felder_Ermitteln.js';
export * from './IBAN_Zufällig_Generieren.js';

// Sieht ob alle Zeichen in z Buchstaben sind
export function istBuchstabe(z: string) {
	return z.toLowerCase() != z.toUpperCase();
}

// Konvertiert alle Buchstaben in str in Nummern und gibt eine neue konvertierte String ab
export function buchstabenInNummernUmwandeln(str: string) {
	let newStr = '';

	// Durch alle Zeichen in str durchgehen
	// (str as any) da TypeScript meint, man kann nicht durch einen String loopen, geht allerdings seit ES5/ES6
	for (let z in (str as any)) {
		// z ist der Index, also wo in str wir uns gerade befinden
		z = str[(z as any)]; // Also einfach z mit dem Buchstaben an der momentanen Position ersetzen

		if (istBuchstabe(z)) {
			newStr += (z.toLowerCase().charCodeAt(0) - 96 + 9);
		}
		else {
			newStr += z;
		}
	}
	return newStr;
}

// Rechnet die Prüfziffer aus ISOLandCode und BBAN aus
export function prüfzifferAusrechnen(ISOLandCode: string, BBAN: string) {
	const prüfsumme = buchstabenInNummernUmwandeln(BBAN + ISOLandCode + '00');

	// Die Datentypen hier sind etwas blöd
	let prüfziffer = String(BigInt(98) - (BigInt(prüfsumme) % BigInt(97)));

	// Eine Null hinzufügen fall das Ergebniss nur z.B. '8' ist
	if (prüfziffer.length === 1) {
		prüfziffer = '0' + prüfziffer;
	}

	return prüfziffer;
}

// Generiert zufällige Strings aus 4 verschiedenen Sets
export function randomString(länge:number, alphabet: string) {
	const alphabetN = '0123456789';
	const alphabetA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const alphabetC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxz0123456789';
	let ausgewähltesAlphabet: string;
	let string: string = '';

	// Das Set auswählen
	switch (alphabet) {
		case 'n': ausgewähltesAlphabet = alphabetN; break;
		case 'a': ausgewähltesAlphabet = alphabetA; break;
		case 'c': ausgewähltesAlphabet = alphabetC; break;
		// e bedeutet leere Stellen, also wird eine String mit 'länge' leeren Stellen ausgegeben
		case 'e': 
			while (länge > string.length) {
				string += ' ';
			}
			return string;
	}

	// Zufällige Positionen 'länge'-mal generieren, und das Zeichen bei dieser Position zu 'string' hinzufügen
	for (let i = 0; i < länge; i++) {
		const zufälligePosition = Math.floor(Math.random() * ausgewähltesAlphabet!.length);
		string += ausgewähltesAlphabet!.substr(zufälligePosition, 1);
	}

	return string;
}