---

layout: post
title: "Kleine Helfer mit NodeJS"
abstract: "Alle reden davon Aufgaben zu automatisieren. Aber welche? Und vor allem wie? Als JavaScript Entwickler hat man mit NodeJS ein mächtiges Werkzeug an der Hand mit dem fast alles realisierbar wird."
categories: AngularJS
background: spanien

---
{% raw %}


## Was soll ich automatisieren?

Das ist die größte und zentralste Frage dieses Artikels, und auf die gebe ich noch nicht einmal eine zufriedenstellende Antwort. Aber ein paar Annährungen, denn beantworten musst Du sie natürlich selbst.

Die vordergründige Antwort im Kopf muss lauten: **Alles**! Alles was einen festen Ablauf hat und mehr als einmal in der Woche vorkommt.

Als nächstes: **Stück für Stück**. Es macht überhaupt keinen Sinn alle Schritte jetzt zu identifizieren und sich hundert Automatismen zurecht zu legen, nur um 90% davon direkt wieder zu vergessen und mit dem Rest nicht fertig zu werden. Der Schlüssel ist, eine Aufgabe zu erkennen, sie zu automatisieren und in den normalen Arbeitsrythmus einfließen zu lassen.

Und schließlich: **Einfach**! Mach das Script so einfach und klein wie möglich, hässlich hingeklatscht, hauptsache es funktioniert. Wenn es sich als nützlich erweist und Du es in Deinen Arbeitsalltag integrieren kannst, dann kann es im nächsten Schritt erweitert werden.


## Wie soll ich automatisieren?

Dieses Blog richtet sich an Programmierer, deshalb natürlich mit NodeJS. Diese JavaScript Umgebung ermöglicht es einfache Anwendungen zu schreiben, die über das Terminal bedienbar sind.

Mit npm, dem Node Package Manager, hat man ein tolles Werkzeug um die eigenen Scripte verfügbar zu machen. Im ersten Schritt sich selbst, im zweiten der ganzen Welt.


## Ein Beispiel

Es kostet nicht viel Zeit, aber es hält immer wieder auf. Die Antwort auf die Frage: Wie ist noch gleich die Postleitzahl zu dieser Adresse. Browser öffnen, zu Google Maps wechseln, eine riesige WebApp sich intitialisieren lassen, Adresse eintippen, Karte laden lassen, da steht sie.

Mit dem kleinen Helfer `plz` mache ich das in Zukunft so:

<img src="/img/plz.gif">

Über die Konsole bietet NodeJS ein tolles Interface auf das man schnell zugreifen kann. Ohne Ablenkung, ohne Ladezeiten, direkt da.


### Das Node Script

Das Script ist wirklich sehr klein. Man legt sich einen zentralen Ordner an in dem eine `index.js` liegt. Hier passiert alles.

Ziel ist es ein globales Programm zur Verfügung zu stellen `plz`, das sämtliche Eingaben zur Google Maps API durchschleust und die Ergebnisse anzeigt.


#### Per Terminal aufrufbar machen

Zum komfortablen Auslesen von Parametern empfehle ich das npm Modul [commander](https://www.npmjs.com/package/commander). Es gibt noch eine ganze Reihe weiterer Möglichkeiten, aber den Commander empfinde ich als am eingängisten.

	var app = require('commander');
	app.version('1.0.0').parse(process.argv);

Das wars! Mit dem Aufruf `node index.js -V` bekommt man die Versionsnummer und mit `node index.js -h` eine automatisch generierte Hilfe. Cool!

Der Commander hat noch ganz viele tolle Funktionen, die Doku hilft weiter. Es bleibt aber einfach und klein. Es soll mit allen Parametern immer die gleiche Funktion aufgerufen werden.

	app
		.version('1.0.0')
		.action(function() {
			console.log('hello world!');
			console.log(app.args);
		})
		.parse(process.argv);

Mit dieser Ergänzung wird beim Aufruf des Scripts **mit Parametern** der Callback in der Funktion `action()` ausgeführt. In der Variable `app.args` stehen alle Argumente zur Verfügung. Der letzte Eintrag ist ein `Commander Objekt`. Das muss raus.

	var input = [];
	app.args.forEach(function(arg) {
		if(typeof arg == 'string') {
			input.push(arg);
		}
	});
	console.log('searching', input.join(' '), '...');

Für den Zweck ausreichend! Damit bekommt man als kompletten String alle Parameter. Der Einsatz vom `Commander` macht hier nur bedingt Sinn, aber für eine spätere Erweiterung bietet er eine gute Grundlage.


#### Kommunikation mit Google Maps

Es gibt nichts, das es nicht gibt und fast alles findet seinen Liebhaber. Also auch die Ansprache der Google Maps APIs über NodeJS. Zum Beispiel mit dem [geocoder](https://www.npmjs.com/package/geocoder).

	var geocoder = require('node-geocoder')('google', 'http', {});

	geocoder.geocode('Friedrichstr. 12, Berlin', function(err, res) {
		console.log(res);
	});

Damit bekommt man ein Array aus Objekten mit den gefundenen Adressen. Inklusive Ländernamen, Koordinaten, ausformulierter Adressen. Wunderbar!

Der Rest ist einfach nur etwas Kombination von Strings. Und Farben!


#### Farbige Terminalausgaben

Natürlich gibt es auch dafür ein npm Modul: [colors](https://www.npmjs.com/package/colors). Dieses eingebunden, erweitert es das `String Object` und ermöglicht es formatierte Ausgaben im Terminal zu erzeugen.

	var colors = require('colors');

	console.log('Hello World'.red.bold);

Äußerst elegant. Diese drei Bausteine müssen jetzt nur noch kombiniert werden.


### Eigene Scripte global verfügbar machen

Stellt sich noch die Frage wie man einen eigenen, coolen Befehl bekommt. Das Script soll von überall im Terminal mit dem Aufruf `plz <input>` erreichbar sein.

npm und seine globalen Module helfen weiter. Dafür muss das Script ausführbar gemacht werden. In der ersten Zeile muss der folgende Kommentar eingefügt werden:

	#!/usr/bin/env node

Mit `npm init` erzeugt man eine `package.json` Datei und ergänzt sie um zwei Einträge:
	
	"preferGlobal": true,
	"bin": {
		"plz": "index.js"
	}

Anschließend, immer noch im gleichen Ordner, installiert man das eigene Script global im System:

	npm install -g .

Fertig! So einfach.


## Fazit

Es macht wirklich großen Spaß diese kleinen Helfer zu schreiben. Viel Arbeit ist es nicht, aber die Zeitersparnis wächst mit jedem guten Helfer.

Das komplette Script befindet sich auf [hier auf GitHub](https://github.com/lunow/plz).

Ich wünsche frohes ausdenken und Optimierung des täglichen Wahnsinns!

{% endraw %}