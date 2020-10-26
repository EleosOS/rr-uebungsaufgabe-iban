import chai from 'chai';
import { ibanKorrekt, ibanErmitteln, länder, zufälligeIBAN, relevanteFelderErmitteln } from '../build/index.js';

const { expect } = chai;

describe('IBAN Methoden:', function () {
	
	describe('IBAN Überprüfung der Korrektheit:', function () {
		
		it('Korrekte IBANs werden als korrekt angezeigt', function () {
			const ergebniss = ibanKorrekt('DE83700901000532013000');

			expect(ergebniss).to.be.true;
		});

		it('Falsche IBANs werden als falsch angezeigt', function () {
			const ergebniss = ibanKorrekt('DE50000000000000000000');

			expect(ergebniss).to.be.false;
		});
	});

	describe('IBAN aus BLZ und KontoNr ermitteln:', function () {
		
		it('Korrekt ermitteln', function () {
			const ergebniss = ibanErmitteln('DE', '70090100', '0532013000');
			const ergebnissKorrekt = ibanKorrekt(ergebniss);

			expect(ergebniss).to.be.a('string');
			expect(ergebnissKorrekt).to.be.true;
		});

		it('Error wenn ISOLandCode zu groß/klein', function () {
			expect(() => ibanErmitteln('D', '70090100', '0532013000')).to.throw('Ländercode');
			expect(() => ibanErmitteln('DEEEE', '70090100', '0532013000')).to.throw('Ländercode');
		});

		it('Error wenn BLZ/KontoNr fehlt', function () {
			expect(() => ibanErmitteln('DE', '', '0532013000')).to.throw('Bankleitzahl');
			expect(() => ibanErmitteln('DE', '70090100', '')).to.throw('Kontonummer');
		});

		it('Error wenn Land nicht gefunden', function () {
			expect(() => ibanErmitteln('QÖ', '28373429', '3249803q89r')).to.throw('Ermittlung');
		});

		it('Error wenn Eingaben zu groß', function () {
			expect(() => ibanErmitteln('DE', '70090100', '053201300000000000000000000')).to.throw('groß');
		});
	});

	describe('Korrekte IBAN zufällig generieren:', function () {
		
		it('Mit selbstgewählten Land (class Land.getRandom())', function () {
			const land = länder.get('HU');

			expect(() => land.random).to.not.throw();
			expect(ibanKorrekt(land.random)).to.be.true;
		});

		it('Mit zufälligem Land (zufälligeIBAN())', function () {
			expect(() => zufälligeIBAN()).to.not.throw();
			expect(ibanKorrekt(zufälligeIBAN())).to.be.true;
		});
	});

	describe('Relevante Felder einer IBAN ermitteln:', function () {
		it('relevanteFelderErmitteln() gibt richtige Felder wieder', function () {
			const felder = relevanteFelderErmitteln('DE83700901000532013000');

			expect(felder).to.include.members(['DE', '83', '70090100', '0532013000']);
		})
	});

});