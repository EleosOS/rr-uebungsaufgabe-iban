# Übungsaufgabe IBAN

## Installation
Dieses Projekt benötigt **node.js**. Es wurde mit Version 14.5.0 entwickelt, Kompatibilität ist ab der Version 13.2.0 gegeben. 

Mit git kopieren:

`git clone https://github.com/Toval-GmbH/rr-uebungsaufgabe-iban.git`

Alle benötigten Packete holen:

`npm install`

Die TypeScript Dateien in JavaScript kompilieren:

`npm run compile`

Es sollte ein **build** Ordner entstehen. Drinnen findet man **beispiel.js**. Dort kann man die Funktionen des Projekts importieren und ausprobieren, z.B:
```javascript
"use strict";
import { ibanKorrekt } from './index.js';
console.log(ibanKorrekt('DE83700901000532013000'));
```
