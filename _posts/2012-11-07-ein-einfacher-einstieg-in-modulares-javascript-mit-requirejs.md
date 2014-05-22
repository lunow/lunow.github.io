---

layout: post
title: "Ein einfacher Einstieg in modulares Javascript mit RequireJS"
abstract: 'Nach dem Javascript lange belächelt und mit nervigen Popups in Verbindung gebracht wurde, erlebt es heute einen großartigen Aufschwung.
Mit [Node.js](http://nodejs.org/) entwickelt man serverseitige Applikationen, mit [Titanium](http://www.appcelerator.com/) native, plattformunabhängige Smartphone Apps und mit [RequireJS](http://requirejs.org/) modulare Anwendungen. Alles mit ein und derselben Sprache. **Einen Einstieg** sollte man also lieber Heute als Morgen beginnen und sich anschließend mit all den schönen Möglichkeiten beschäftigen.

Um eine davon geht es **in** diesem Artikel: **RequireJS**.

'
categories: Javascript
redirect_from: "2012/11/07/ein-einfacher-einstieg-in-modulares-javascript-mit-requirejs/"

---



## Einleitung

**RequireJS** ist ein Werkzeug um Dateien und Module dynamisch nachzuladen. Module sind Javascript Dateien die im Idealfall eine Funktionalität bereit stellen und im Kontext einer größeren Anwendung benutzt werden. Zum Beispiel eine Klasse um Objekte zu erzeugen die in einer Aufgabenverwaltung eine einzelne Aufgabe repräsentieren.

Komplexe Webapplikationen verfügen oft über große Mengen an Javascript. Da sie von mehreren Entwickler mit unterschiedlichen Kenntnissen und Programmierstilen entwickelt und später weiter entwickelt werden (klar, in der Planung siehts ganz anders aus, aber bleiben wir ehrlich) herrscht schnell Chaos und Verwirrung.

Wie wunderbar das man mit RequireJS ein Werkzeug in die Hand bekommt, mit dem es möglich ist Javascript Programme in einzelne Module zu zerteilen. Jedes Modul kann für sich betrachtet **entwickelt**, **getestet** und **verbessert** werden. Im schlimmsten Fall ausgetauscht werden.

Damit das möglich ist, muss man sich an einige Regeln halten und RequireJS verstehen.


## Die Grundlagen

Die großartige Webapplikation die hier entsteht beginnt mit einem ganz einfachen HTML Grundgerüst welches die letzte Javascript Datei statisch einbindet die wir in Zukunft noch brauchen: RequireJS.

	<!DOCTYPE html>
	<html>
		<head>
			<title>Requirejs Demo</title>
		</head>
		<body>
			<noscript>Ohne Javascript, ohne mich.</noscript>
			<script data-main="init" src="js/require.js"></script>
		</body>
	</html>

Der Aufruf dieser Seite zeigt eine leere Seite. Ich würde immer empfehlen von Anfang an eine `noscript` Zeile einzufügen, nichts ist schlimmer als am Morgen von einer leeren Seite begrüßt zu werden und anschließend eine panische Suche nach diesem misteriösen Fehler zu starten, nur weil man am Abend vorher das andere Projekt mit abgeschaltetem Javascript getestet hat.

Das Script Tag hat ein `data-main` Attribut das auf ein Initialisierungsscript zeigt. Der Pfad ist relativ zur `index.html` und die Endung `.js` wird automatisch angehängt.

Über den Netzwerk Tab im Webinspector oder im Firebug kann man sich sehr genau anschauen wann der Browser wo welche Dateien versucht zu laden. Das sollte ein unverzichtbarer Begleiter sein bei der Arbeit mit RequireJS.

In der `init.js` geht es auch direkt weiter.


## Initialisierung

Die Initialisierung der Webapplikation sollte möglichst schmal und elegant gehalten werden. Was sag ich? Jede Datei soll schmal und elegant sein! Das beurteilt man (auf die schnelle) mit folgenden Kriterien:

* ordentliche Einrückung
* einzelne Dateien haben nur in Ausnahmefällen mehr als 500 Zeilen
* einzelne Funktionen haben nicht mehr als 20 Zeilen
* eine Funktion beinhaltet keine weiteren Funktionen
* eine Datei lässt sich von oben nach unten lesen und verstehen

Darüber könnte man schon ein Buch schreiben (hey, [das gibts schon](http://www.amazon.de/Clean-Code-Refactoring-Patterns-Techniken/dp/3826655486/ref=sr_1_2?ie=UTF8&qid=1352321393&sr=8-2)), aber zurück zur Initialisierung: Typische Aufgaben sind die Überprüfung der verwendeten Software, also dem Browser und seiner Version. Anschließende Überprüfung der Verfügbarkeit der notwendigen Schnittstellen und schließlich das Laden der benötigten Module und der Start von jenen.

Damit das auch innerhalb der oben genannten Regeln zur Eleganz erledigt werden kann benötigt man einzelne Module.


## Ein Modul

In RequireJS definiert man ein Modul mithilfe der `define()` Funktion. Als Paramter übergibt man eine Funktion die wiederrum das Modul zurück gibt. Zum Beispiel ein Modul um den verwendeten Browser des Benutzer zu erkennen:

	define(function() {

		var Browser = {
			okay: true
		};

		return Browser;

	});

Innerhalb der `define` Funktion kann man praktisch machen was man möchte, solang man etas zurück gibt. Dieses "etwas" steht dann den anderen Scripten zur Verfügung.

In diesem Fall also ein Objekt mit der Eigenschaft `okay` und dem Wert `true`. Alles okay!


## Dynamisches nachladen

Genau so einfach wie die Definition ist die Benutzung von den Modulen. Zurück in der `init.js` sieht es so aus:

	require(['js/browser'], function(Browser) {
		if(Browser.okay) {
			alert("Dein Browser ist okay!");
		}
	});

Hier passieren interessante Sachen. Die `require` Funktion erhält als ersten Parameter ein Array mit Strings welche den Pfad zu den Modulen angeben. Als zweiten Parameter übergibt man eine Callback Funktion die ausgeführt wird, sobald die vorher angegebenen Dateien geladen wurden.

Als Parameter erhält der Callback in genau der gleichen Reihenfolge die Rückgabewerte der einzelnen Module. Hier also das oben definierte Browser Objekt mit der großartigen Eigenschaft `okay`.

Das ist alles! Los gehts mit dem schönen Aufteilen des Javascript Codes in einfache, wiederverwendbare Module.

Aber halt. Nach der Entwicklung von zwei sehr großen Webapplikationen hab ich noch ein paar Verbeserungsvorschläge anzubringen.


## Besseres dynamisches nachladen

Der Callback erhält die Modulrückgabe als Parameter. Das ist schön bei einer Abhängigkeit, aber der nächste Entwickler wird weitere Module hinzufügen und dann entstehen schnell vermeidbare Fehler. Zum Beispiel:
	
	require(['js/application', 'js/browser'], function(Browser, App) {
		if(Browser.okay) {
			App.init();
		}
	});

Sieht schön und elegant aus, funktioniert aber leider nicht. Der Entwickler hat an erster Stelle die Applikation geladen, aber im Callback an zweiter Stelle die Variable hinzugefügt. `Browser` beinhaltet also die App und `App` wiederum die Funktionen um den Browser zu erkennen.

Bei zwei Funktionen mag das lächerlich aussehen, bei zwanzig und der Deadline in zwei Tagen ändert sich das aber ganz schnell!

Zum Glück bekommen wir von RequireJS eine Lösung geschenkt. Ruft man `require` innerhalb des Callbacks mit einem String als Parameter auf, kann man ebenfalls auf die geladenen Module zurück greifen. Refaktorisiert sieht unsere Initialisierung jetzt so aus:

	require(['js/application', 'js/browser'], function() {
		var Browser = require('js/browser'),
			App = require(js/application);

		if(Browser.okay) {
			App.init();
		}
	});

Und schon können Abhängigkeiten hinzugefügt, entfernt und verändert werden.


## Abhängigkeiten von Abhängigkeiten

Bevor es gleich noch mal richtig um die Module geht, eine tolle Eigenschaft der `define` Funktion vorweg. Genau wie `require` akzeptiert sie als ersten Parameter ein Array mit Pfaden zu weiteren Modulen.

	define(['settings', 'js/header', 'js/content'], function() {
		// ... beste Implementierung aller Zeiten

		return Module;
	});

Damit kann man also zum Beispiel Einstellungen, die Applikation betreffend, in ein Modul auslagern und alle Module die darauf basieren können die Datei einbinden.


## Ordentliche Module

Das oben beschriebene Browser Modul ist okay und kann mit beliebigen Funktionen erweitert werden. Aber um elegante und wiederverwandbare Module zu erhalten, muss man einige Regeln befolgen:

* Baue alle Module nach dem gleichen Schema auf
* Entwickel eine klare Schnittstelle
* Erzeuge in modulen keine globalen Variablen
* Nutze in Modulen keine globalen Variablen

Auch wenn es am Anfang vom Projekt noch einfach und übersichtlich aussieht, spätestens wenn man einen weiteren Programmierer in die Benutzung einführt, helfen einem diese Regeln für die Einführung nur ein paar Stunden statt ein paar Tagen zu verwenden.

Deshalb ein paar vertiefende Worte zu den Punkten.


### Eine Grundlage für jedes Modul

Den perfekten und immer gültigen Weg gibt es nicht, aber ich habe mit folgendem Aufbau gute Erfahrungen gemacht:

	define(function() {

		var MyClass = function() {
			var constructor,
				that = {},
				my = {};

			constructor = function() {
				return that;
			};

			that.doSomething = function() {

			};

			my.helper = function() {

			};

			return constructor.apply(null, arguments);
		};

		return MyClass;

	});

Stück für Stück: Die `define` Funktion definiert ein Modul. Als erstes werden drei Variablen erzeugt: `constructor`, `that` und `my`.

**Der Konstruktor** initialisiert das Modul und erledigt diverse Aufgaben die grundlegend wichtig sind. Durch die Benutzung einer eigens dafür definierten Variable kann man den Konstruktur am Anfang des Modules definieren was eine wesentlich bessere Lesbarkeit erzeugt.

Denn oben hab ich gefordert das eine Datei von oben nach unten lesbar ist. Der Konstruktor wird als erstes ausgeführt. Deshalb muss er oben stehen.

Der Konstruktur gibt das Objekt `that` zurück, was wiederum vom Modul zurück gegeben wird. Damit handelt es sich hier um **öffentliche Eigenschaften** des Modules. Alles was von außen benutzt werden soll, muss in `that` landen. So wie die Funktion `doSomething`.

Im Gegensatz zum `my` Objekt, welches nur innerhalb des Modules zur Verfügung steht und damit die **privaten Attribute** repräsentiert.

Der Aufruf des Konstruktors am Ende mit Hilfe der `apply` Funktion ermöglicht es, die übergebenen Parameter im Konstruktur zu nutzen.

Man erkennt am ersten Parameter `null` der `apply` Funktion, das ich das Schlüsselwort `this` nicht benutze. Ich würde in Klassendefinitionen auch davon abraten, denn durch den wechselnden Kontext ist nicht immer klar, worauf sich `this` gerade bezieht.


### Eine klare Schnittstelle

Hält man sich an den oben genannten Aufbau, bekommt man schon eine Schnittstelle geschenkt: `that`. Alles in diesem Objekt ist von außen benutzbar.

Deshalb achtet man hier besonders auf sprechende Funktionsnamen die `CamelCased` beschrieben sind. Zu jeder Funktion hinterlässt man im einen sprechenden Kommentar im Quelltext.

Und man benutzt Funktionen. Attribute, die von anderen einfach hin und her geschrieben werden können, sind zu vermeiden:

	that.name = 'Paul';

Damit steht der Name zwar global zur Verfügung, aber jeder kann ihn ändern, erweitern oder "außerversehen" ein Objekt hineinlegen.

	my.name = 'Paul';

	//get the name from current user
	that.getName = function() {
		return my.name;
	}

Ordentlich. Schön. Und sicher geschützt vor jedem Zugriff von außen.


### Globale Variablen

Böses Thema. Globale Variablen sind in Javascript sehr einfach erzeugt. Das blödeste Beispiel ist folgendes:

	for(i = 0; i < 10; i++) {
		console.log(i);
	}

Man ahnt nichts böses, hat aber `i` in den globalen Namespace gelegt und damit jede Kontrolle verloren. Deshalb erzeugt man mit dem Schlüsselwort `var` eine Variable die nur innerhalb des aktuellen Kontexts sichtbar ist.

	for(var i = 0; i < 10; i++) {

Erzeugt ein Modul globale Variablen führt das eventuell zu unberechenbaren Fehlern, es funktioniert aber (eine Weile). Schlimmer ist es, wenn ein Modul sich auf globale Variablen verlässt. 

Ein Modul soll im idealfall einfach eingebunden und genutzt werden. Fertig. Ohne vorher eine Versionsnummer, Einstellungen oder etwas anderes global zur Verfügung gestellt zu bekommen.

Einstellungen beindet man als Modul ein und alles weitere wird dem Konstruktur oder einer speziellen Funktion übergeben.

	var Header = require('js/elements/header')();
	Header.create({
		title: 'Komplexe Webapplikationen',
		version: 1
	});


## Bedingte Abhängigkeiten

Ein Problem entsteht, wenn Module voneinander abhängen. Durch das dynamische nachladen kann **keine Reihenfolge** der Ausführung garantiert werden. Klar wirds am folgenden Beispiel:

	require([
		'jquery.min',
		'jquery.plugin.avoid-widows'
	], function() {

		});

In unregelmäßigen Abständen, total unterschiedlich in verschiedenen Browsern, meldet das jQuery Plugin `avoid widows` das es `jQuery` nicht finden kann.

Denn manchmal ist jQuery rechtzeitig geladen, manchmal ist das Plugin schneller. Fiese Geschichte!

Aber es gibt zum Glück eine Lösung dafür Namens `shim`. Vorallem geeignet für Javascripte die nicht per `define` als Modul vorbereitet sind.

Für die Definition wird die `Require.config` Funktion genutzt:

	require.config({
		paths: {
			'avoid-widows': 'lib/plugins/jquery.plugin.avoid-widows'
		},
		shim: {
			'avoid-widows': {
				deps: [
					'lib/jquery.min'
				]
			}
		}
	});

Perfekt. So wird sichergestellt das jQuery definitiv vor dem Plugin geladen wird. Es sei mal dahin gestellt ob man jQuery nicht sowieso schon eingebunden hat, aber das ist ein anderes Thema.

Auf diese Art lassen sich die bedingten Abhängigkeiten meistern.


## Weitere Punkte

Sobald ein **solider Zwischenstand** der Applikation erreicht ist, sollte man unbedingt einen Tag einplanen, in dem man sich intensiv mit `r.js` auseinander setzt. Dieses grandiose Hilfsmittel analysiert alle Abhängigkeiten und erstellt eine optimierte und komprimierte Javascript Dateien.

Damit kommt man dann in einer großen Webapplikation von 200 nachgeladenen Dateien runter auf 10. Ein deutlicher Geschwindigkeitsvorteil! Besonders in älteren Browsern. War schon die Rede davon das RequireJS auch im IE 6 funktioniert?

Es gibt noch weitere Plugins um Text- oder Sprachdateien zu laden. CSS Dateien machen leider Probleme, aber der `r.js` Optimierer spührt alle `import` Befehle auf und fügt sie zu einer großen CSS Datei zusammen. Jedes Modul kann also auch eine eigene CSS Datei mitbringen.

Die [Webseite](http://requirejs.org/) hilft weiter.


## Fazit

Ich empfehle den Einstieg in **RequireJS für Webapplikationen** unbedingt. Die Übersichtlichkeit, die Code Verbesserung und die Möglichkeit Module zu testen und zu überarbeiten gewinnt ungemein!

Und gewinnen wollen wir ja ständig.