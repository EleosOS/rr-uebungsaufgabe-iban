import { istBuchstabe, randomString, prüfzifferAusrechnen } from './index.js';

/*
	Ich benutze Getter, da in den meisten Situationen
	etwas gebraucht wird, das nur einmal zusammengesetzt werden
	muss, und dann immer gleich bleibt. Dazu braucht man meistens 
	ur eine Sache (z.B. die Länge) aber nicht die RegExp, also muss
	man nur das zusammensetzen, was man braucht.
	Das würde in Projekten die die ganze Zeit laufen und die Methoden
	mehrmals rufen Speicherplatz sparen.
*/

class Land {
	ibanFormat: string;
	bbanFormat: string;
	ISOLändercode: string;
	private bbanRegeln?: string[];
	private bbanLänge?: number;
	private intRegExp?: RegExp; 

	constructor(ibanFormat: string) {
		this.ibanFormat = ibanFormat;
		this.bbanFormat = ibanFormat.slice(5);

		// ISOLandCode rausschneiden, in Map eintragen
		this.ISOLändercode = this.ibanFormat.slice(0, 2);
		länder.set(this.ISOLändercode, this);
	}

	// Gesammte Länge der BBAN mit den Zahlen im Format zusammenrechnen
	get länge() {
		// Falls es schonmal generiert wurde, muss man es nicht nochmal generieren (es würde das gleiche rauskommen),
		// also kann man es einfach speichern und wiedergeben
		if (this.bbanLänge) {
			return this.bbanLänge;
		}

		this.bbanLänge = 0;
		// Nach Nummern aufteilen und alles rausfiltern das keine Nummer ist
		const feldLängen = this.bbanFormat.split(/([0-9]{1,2})/).filter(reg => !istBuchstabe(reg) && reg !== '');

		// Alle Nummern auf this.bbanLänge zusammenaddieren
		feldLängen.forEach(n => this.bbanLänge! += Number(n));

		return this.bbanLänge;
	}

	// bbanFormat in Regeln aufteilen die dann die anderen Methoden benutzen
	get regeln() {
		if (this.bbanRegeln) {
			return this.bbanRegeln;
		}

		this.bbanRegeln = this.bbanFormat.split(/(\d{1,2}\!(?:n|a|c|e))/).filter(reg => reg != '');
		return this.bbanRegeln;
	}

	// Generiert ein nutzbares RegExp das alle relevanten Felder aus einer IBAN rausschneiden kann
	// Der einzige Nachteil ist das diese Felder nicht benannt werden können
	get regExp() {
		if (this.intRegExp) {
			return this.intRegExp;
		}

		// Zwei Regeln für ISOLandcode und Prüfziffer sind schon vorhanden, diese ändern sich nie
		const regExpArr: string[] = ['([A-Z]{2})', '([0-9]{2})'];

		// Durch alle Regeln durchgehen und für jede Regel einen funktionierenden RegExp Teil generieren
		this.regeln.forEach((reg) => {
			// Aufteilen in Länge und mögliche Zeichen
			// z.B. r = ['4', 'n']
			const r = reg.split('!');
			let zeichen: string;

			switch (r[1]) {
				case 'n': zeichen = '0-9'; break;
				case 'a': zeichen = 'A-Z'; break;
				case 'c': zeichen = 'A-Za-z0-9'; break;
				case 'e': zeichen = ' '; break;
			}

			regExpArr.push(`([${zeichen!}]{${r[0]}})`);
		});

		// Alle RegExp Teile zusammenfügen
		this.intRegExp = new RegExp(regExpArr.join(''));

		return this.intRegExp;
	}

	// Erzeugt eine korrekte zufällige IBAN die dem Format des Landes entspricht
	random() {
		let BBAN: string[] = [];
		let prüfziffer: string;

		// Jede Regel ist ein Feld das gefüllt werden muss
		this.regeln.forEach((reg) => {
			const r = reg.split('!');
			BBAN.push(randomString(Number(r[0]), r[1]));
		});

		prüfziffer = prüfzifferAusrechnen(this.ISOLändercode, BBAN.join(''));

		return this.ISOLändercode + prüfziffer + BBAN.join('');
	}
}

export const länder = new Map<string, Land>();

const formatArr = [
	'AD2!n4!n4!n12!c',
	'HU2!n3!n4!n1!n15!n1!n',
	'CH2!n5!n12!c',
	'DE2!n8!n10!n'
];

formatArr.forEach(format => new Land(format));