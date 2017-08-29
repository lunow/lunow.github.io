---

layout: post
title: "So soll ein Logger aussehen"
abstract: "Letztendlich beschäftigt man sich beim Programmieren immer sehr viel mit dem Log Output der eigenen Anwendung. Dieser muss unbedingt elegant und zeitsparend produziert werden. Und nach 10 Jahren Webentwicklung habe ich meine Lösung gefunden. Mit nicht mal 100 Zeilen Code."
background: menschen

---

{% raw %}


## Völker, schaut auf diesen Logger

Es geht immer darum das Verhalten der eigenen Anwendung so nachvollziehbar wie möglich zu gestalten. Und ein übersichtlicher, gut gestalteter Logger ist die Grundlage dafür.

Das heißt für mich, in meiner täglichen Arbeit, muss die Nutzung absolut einfach und schlank sein. Das Ergebnis muss ordentlich aussehen und gut filterbar sein. Im Fehlerfall will ich mit der Lösung schnell dem Problem auf den Grund kommen.


## Die API

So sieht meine Lösung aus.

	//create your own logger, somewhere in a module
	var log = Logger('module');

	//and go, log something!
	log('hello world');

Soweit nichts besonders, schön schlank und elegant. Aber was wenn ein Fehler auftritt? Kein Problem:

	log.error('that failed');

Den Stacktrace zu diesem Fehler ausgeben? Auch kein Problem:

	log.error('that failed, again').trace();


## Styling

Seit einiger Zeit ist es möglich mit CSS die Ausgabe in den Chrome DevTools zu gestalten. Deshalb unterstützt mein Logger das auch.

<pre><code class="js">//module name is blue
var blue = Logger('module', 'blue');

//module name has red background
var red = Logger('danger', 'background:red;color:white');

//this is more important
var bold = Logger('tracker', 'font-weight:bold');</code></pre>

Der Fantasie sind keine Grenzen gesetzt!


## Alles ist ein Objekt

Ehrlich gesagt hat es Jahre gedauert bis ich diese API realisieren konnte, denn mir hat ein entscheidendes Puzzelteil gefehlt: Alles ist ein Objekt.

Wirklich alles in Javascript ist ein Objekt. Das heißt auch eine Funktion ist ein Objekt. Deshalb sind spaßige Sache wie dieser Logger überhaupt nur möglich.

	var fct = function() {
		//a function, do something
		return { config: null };
	};

	fct.greet = function() {
		//wow, another function as attribute for the first function, crazy!
		return 'Hello';
	};

	fct(); //returns { config: null }
	fct.greet(); // returns "Hello"

Wow, ich finde es großartig. Mit diesem Wissen baut man sich den folgenden Logger in nicht mal einer Stunde.


## Quellcode

Grundlegend erinnert es an das gute alte [Modul-Layout](http://www.interaktionsdesigner.de/2012/ein-einfacher-einstieg-in-modulares-javascript-mit-requirejs/), das ich immer noch gern benutze. Mit dem Unterschied das die öffentliche Schnittstelle `that` jetzt eine Funktion ist, die direkt aufgerufen werden kann.

<pre><code class="js">(function() {
	//some default stylings for DRY
	var defaultStylings = {
		COMMUNICATION: 'color:#ED7A14',
		CACHE: 'color:#A6B3B3',
		AUTOUPDATE: 'color:#fff;background:#000',
		FRODO: 'color:#3A7E36;background:#F0FDEF',
		SETTINGS: 'color:#A0BB9D',
		TRACKER: 'color:#E1E1E1',
		USER: 'font-weight:bold'
	};

	var Logger = function() {
		var my = {};
		var that = function() {
			//magicly redirect to the log function as shortcut
			return that.log.apply(null, arguments);
		};

		my.construct = function(name, style) {
			my.name = name.toUpperCase() || 'unnamed';
			my.style = my.parseStyle(style);
			return that;
		};

		my.parseStyle = function(style) {
			//its a string without a doublepoint, so treat it as font color
			if(style && style.indexOf(':') === -1) {
				return 'color:'+style;
			}
			//search in the default stylings for a style
			if(defaultStylings[my.name]) {
				return defaultStylings[my.name];
			}
			//apply an overall default
			if(!style) {
				return 'color:silver';
			}
			return style;
		};

		my.getIdentifier = function() {
			return ['%c['+my.name+']', my.style];
		};

		my.toArray = function() {
			//my project uses lodash _.toArray(), but if you dont want the dependency, use that
			return Array.prototype.slice.call(arguments);
		};

		that.log = function() {
			var args = my.toArray(arguments);
			console.log.apply(console, my.getIdentifier().concat(args));
			return that;
		};

		that.warn = function() {
			var args = my.toArray(arguments);
			console.warn.apply(console, my.getIdentifier().concat(args));
			return that;
		};

		that.error = function() {
			var args = my.toArray(arguments);
			console.error.apply(console, my.getIdentifier().concat(args));
			return that;
		};

		that.trace = function() {
			console.trace(my.name+' trace');
			return that;
		};

		that.info = function() {
			var args = my.toArray(arguments);
			console.info.apply(console, my.getIdentifier().concat(args));
			return that;
		};

		return my.construct.apply(null, arguments);
	};
	
	//yeah, its public, hard, i know, but hey, its a global logger!
	window.Logger = Logger;
}());
</code></pre>

Das wars! So einfach, so schnell, so zielgerichtet. Herrlich. Und mit wenigen Zeilen Code lässt sich dieses Ding auf wirklich wunderbare Art und Weise erweitern.

Zum Beispiel um einen pro Nutzer spezialisierten Logger zu erzeugen.

	that.user = function(user_id) {
		my.user_id = user_id;
		return new Logger(my.name +' #'+user_id, my.color);
	};

Damit lässt sich der Weg eines Nutzers durch den gesamten Logoutput elegant filtern.

	var comLog = Logger('communication');
	comLog('init');

	Communication.on('user_connect', function(user_id) {
		comLog.user(user_id).info('welcome');
	});

Das produziert, eine Anwendung voraussgesetzt, folgende Logausgabe

	[COMMUNICATION] init
	[COMMUNICATION #3] welcome
	[COMMUNICATION #4] welcome


## Fazit und Pro Tip

Alle Logausgaben zeigen in den Chrome DevTools auf die Ursprungsdatei, also dem Aufruf der `console.xxx()` Funktion. Die ist natürlich immer in `logger.js:40`.

Das lässt sich leicht ändern in dem man in den Einstellungen der DevTools das Script `logger.js` als Blackbox hinterlegt! Wirklich einfach und [hier](https://developers.google.com/web/tools/chrome-devtools/debug/breakpoints/step-code) nachzulesen, bitte bis "Blackbox third-party code" springen.

Eine großartige Funktion - alles ist ein Objekt.

{% endraw %}