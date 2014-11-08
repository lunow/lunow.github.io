---

layout: post
title: "Die Killerapplikation mit Node.js, Socket.io und AngularJS"
abstract: 'Wenn das kein Development Stack ist! Javascript vom Server bis zur Webapp. Wie der Einstieg funktioniert beschreibt dieser Artikel.

'
categories: Javascript, AngularJS, Node.js
redirect_from: "2013/04/28/die-killerapplikation-mit-node-js-socket-io-und-angularjs/"
background: beethoven
---

{% raw %}

## Node.js

Die nächste Generation von Servern basieren nicht mehr auf ein Frage-Antwort-Spielchen wie beim guten, alten Apache sondern sind ein ständiger Gesprächspartner der immer bereit ist.

[Node](http://nodejs.org) läuft auf dem Server und zur Entwicklung auf dem eigenen Computer. Die Installation ist schnell erledigt mit Hilfe der offiziellen Installationsprogramme: http://nodejs.org/download/

Unter OSX öffnet man Terminal Fenster und tippt den folgenden Befehl ein:

	node --version
	
Die Applikation meldet ihre Versionsnummer die irgendwo um 0.10 liegen sollte.


### NPM

Gemeinsam mit Node wurde NPM, der Node Package Manager, installiert. Ein großartiges Stück Software das einem Downloads und Updates erleichtert. Im Laufe des Tutorials werden wir noch häufiger damit arbeiten.

Auch NPM meldet sich mit der aktuellen Versionnummer wenn alles funktioniert hat:

	npm --version
	
Google Hilft bei kryptischen Fehlermeldungen gerne weiter!


### Das erste Node Programm

Node Programme sind in Javascript geschriebene Anwendungen die mit diversen System kommunizieren können. Dabei muss es sich nicht um einen Webserver handeln, es kann auch ein Programm sein um die eigene Haustechnik zu steuern oder lästige Aufgaben im Terminal abzunehmen.

Ich würde vorschlagen ein neues Verzeichnis anzulegen mit folgender Struktur:

	killerapp
		client
		server
			server.js
			
Für den Anfang! Das wird später erweitert. Im bevorzugten Editor fügt man die erste Node Zeile in die `server.js` Datei ein:

	console.log("Hallo Node!");
	
Im Terminal wechselt man zum entsprechenden Verzeichnis und startet Node:

	cd killerapp/server
	node server.js
	
Im Terminal erscheint die fröhliche, erste Reaktion von Node: **Hallo Welt!**.


### Der erste Node Server

Wie zu beobachten war, hat sich Node direkt wieder geschlossen. Arbeit getan, Programm beendet. Für den eingangs erwähnten Gesprächspartner ist das natürlich nicht gerade ein höfliches Verhalten.

Ziel ist es einen Node Server zu schreiben. Er soll gestartet werden, auf eingehende Verbindungen über den Browser hören, und diese mit einem `Hallo Browser` beantworten.

Natürlich könnte man das alles von Hand reinhacken. Aber der gute Programmierer evaluiert erstmal(!) vorhandene Tools und Module die die Aufgabe schon perfekt übernehmen. Mein momentaner Favorit nennt sich `connect` und ist von den gleichen Entwickler die auch `express` in die Welt gesetzt haben. Der Quasi Standard in Node. `connect` ist aber natürlich viel neuer, schneller und besser.

Dank NPM kommt man mit einer Zeile an die notwendigen Dateien:

	npm install connect
	
NPM lädt alle Module herunter die `connect` benötigt und legt sie, sofern wie oben aufgerufen, in das `server` Verzeichnis. Anschließend kann das Modul in der `server.js` eingebunden werden:

	var connect = require('connect');
	
	var server = connect().
		use(function(req, res) {
			res.end('Hallo Browser!');
		}).
		listen(8080);
		
	console.log("Server started and listen to http://127.0.0.1:8080");
	
Anschließend über `node server.js` den Server starten - die Konsole informiert über die URL auf die der Browser hört. Diese entsprechend aufrufen und siehe da: **Hallo Browser!**.

Das war einfach! Ein paar Punkte dazu (vorallem den letzten beachten!!):

* Ich würde empfehlen die Zeilen abzuschreiben anstatt sie zu kopieren. Genau wie bei allen kürzeren Beispielen im Netz, dadurch lernt man es besser. Und die Fehlersuche trainiert und sensibilisiert.
* Im Umgang mit Javascript sollte man sich einen JSLinter installieren um sofort über Syntaxfehler oder Bad Practices informiert zu werden.
* Es ist sehr nett in der Konsole eine Nachricht zu hinterlassen wo es weiter geht.
* **ACHTUNG**: Node startet den Server nicht neu wenn man die Datei geändert hat!!

Der letzte Punkt hat mich schon das eine oder andere Mal ein paar verwirrte Minuten gekostet. Zum Glück gibt es eine Lösung namens `forever`. Diese startet den Server automatisch neu sobald sich eine der Dateien verändert hat. Installation über NPM:

	sudo npm install forever -g
	
Dieses mal erfolgt die Installation als globales Modul, das bedeutet es ist auf der gesamten Maschine verfügbar, nicht nur im aktuellen Projekt. Damit NPM die notwendigen Schreibrechte bekommt, führt man die Installation mit `sudo` als Administrator aus.

Anschließend startet man den Server mithilfe von `forever`:
	
	forever --watch server.js
	
Damit wird der Server bei jeder Änderung automatisch neugestartet. Mit `[CTRL] + [C]` lässt sich der Prozess abbrechen.


### Statische Dateien ausliefern

Auch mit Node möchte niemand auf HTML, CSS und Javascript Dateien verzichten. `connect` bietet eine sehr praktische Funktion an um die statischen Dateien auszuliefern:

	var server = connect().
		use(connect.static(__dirname+'/../client')).
		listen(8080);
		
Wenn man jetzt unter `client/index.html` ein schönes HTML5 Grundgerüst hinterlegt, `forever` automatisch den Server neu gestartet hat und man dann die Seite im Browser aktualisiert, wird man von der angelegten `index.html` Seite begrüßt. So einfach ist das!

Die Serverimplementierung ist abgeschlossen, auf zum Frontend.


## AngularJS

Ein großartiges Framework das einem bei der Erstellung einer Webapplikation eine ganze Menge nerviger Arbeit abnimmt. Das erklärte Ziel ist es, eine neue Entwicklungsmethode zu schaffen die weniger, besseren und vorallem testbaren Code erzeugt. Und das kriegt sie bestens hin.

Einen ersten Einstieg habe ich bereits in einem [Artikel](http://www.interaktionsdesigner.de/2013/ein-einstieg-in-angularjs/) beschrieben, auf der offiziellen Seite findet man jede Menge Tutorials - es lohnt sich das offizielle [Tutorial](http://docs.angularjs.org/tutorial) mit dem begleitenden Git Repository durchzuarbeiten. Das geht schnell und deckt alle wichtigen Themengebiete ab.

Leider verschmutzt das Einsteigertutorial den globalen Namensraum mit den Controllern, die wie folgt definiert werden:

	var HelloCtrl = function($scope) {
		//content...
	}

Als Javascript Entwickler ist es aber die Pflicht den Namensraum sauber zu halten um Konflikten aus dem Weg zu gehen. Natürlich bietet Angular hier eine Lösung die ich im folgenden auch benutzen will:

	angular.module('App', []);

	angular.module('App').controller('HelloCtrl', function($scope) {
		//content goes here
	});
	
Die Definition eines Angular Modules erfolgt über die Funktion `module()` mit zwei Parametern: Dem Namen des Modules und ein Array mit den Abhängigkeiten. Lässt man den zweiten Parameter weg dient die Funktion als Getter, gibt also das angegebene Modul zurück.


### Hallo Angular

Nach dem einbinden der Javascript Datei, sofern man stets online arbeitet auch gerne vom [Google CDN](https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js),  legt man die Datei `client/js/app.js` an. Unter `client/index.html` legt man folgende HTML Struktur ab:

	<!DOCTYPE HTML>
	<html ng-app="App">
	<head>
		<meta charset="UTF-8">
		<title>KillerApp</title>
	</head>
	<body>
		
		<div ng-view></div>
		
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js"></script>
		<script src="js/app.js"></script>
	</body>
	</html>

Über das Attribut `ng-app` im HTML Tag informieren wir Angular das es sich bei der gesamten Seite um eine Applikation namens `App` handelt. Der `DIV` Container mit dem Attribut `ng-view` wird von Angular automatisch benutzt um eine Ansicht (View) der Applikation darzustellen.

Die App muss es natürlich geben. Als erstes soll sie den Nutzer persönlich begrüßen. Das nenne ich die `frontpage`. Dazu wird eine neue Datei angelegt: `client/partials/frontpage.html` mit einem einfachen Inhalt:

	<h1>Hallo {{name}}</h1>

Diese soll bei dem Aufruf von `http://127.0.0.1:8080/#/frontpage` automatisch nachgeladen und angezeigt werden. Dazu soll ein Controller aufgerufen werden, der den Platzhalter `name` mit dem Namen des Programmierers austauscht. Ist kein Hash angegeben soll zur Startseite weitergeleitet werden.

Das klingt nicht nach einer unlösbaren Aufgabe, aber schon nach einem Stückchen Arbeit, einigen Tests und einer Template Engine. Glücklicher Weise haben wir AngularJS zur Verfügung.

So sieht die ganze Applikation aus die alle oben genannten Aufgaben löst:

	//define a global application
	angular.module('App', []);

	//create an app router for url management and redirect
	angular.module('App').config(function($routeProvider) {
		$routeProvider.when('/frontpage', {
			templateUrl: 'partials/frontpage.html',
			controller: 'frontpage',
		});
		$routeProvider.otherwise({redirectTo: '/frontpage'});
	});

	//frontpage controller
	angular.module('App').controller('frontpage', function($scope) {
		console.log('Hello from the Frontpage Controller');
		$scope.name = 'Paul';
	});

Schön, oder? Angular bringt die Magie mit, den Funktionsaufruf zu analysieren und die angegebene Abhängigkeit, z.B. `$routeProvider`, automatisch in den Callback einzufügen. So lässt sich mit der `config()` Funktion eine beliebige Anzahl von Routen definieren, die bei Aufruf automatisch nachgeladen werden, den angegeben Controller aufrufen, welcher wiederum über die Abhängigkeit `$scope` mit dem Template kommunizieren kann.

Angular Funktionen beginnen stets mit einem Dollarzeichen welches sie von eigenen Funktionen unterscheidbar macht. Und was man als Entwickler auch respektiert und einge Module **nicht** mit einem Dollarzeichen beginnen lässt.

Mit diesem Aufbau lässt sich schon einiges anstellen. Zum Beispiel in dem man eine Route `view` inklusive Controller und HTML Template (View) hinzufügt und darauf in der `frontpage.html` verlinkt:

	<a href="#/view">view something</a>
	
Viel Spaß beim experimentieren! Sobald das steht gehts zur nächsten grundlegenden Funktion von heutigen Killerapplikationen: Der Kommunikation mit dem Server.


## Socket.io

Angular bringt einen `$http` Service mit, mit dessen Hilfe leicht Ajax Anfragen an den Server oder eine API geschickt werden können. Aber das klingt nicht besonders cool. Viel besser ist es wenn eine Verbindung zum Server aufgebaut wird über die sich Frontend und Backend unterhalten können.

Das grandiose bei dieser Unterhaltung und der große Unterschied zur "klassischen" Ajax Anfrage besteht darin, dass über Socket.io der Server selbstständig dem Client bescheid geben kann sobald sich etwas geändert hat! Es ist also nicht notwendig jede Sekunde den Server anzufragen, sondern man wartet einfach auf ein ankommendes Signal.


### Der Server

Das notwendige Modul installiert man mit NPM:

	npm install socket.io
	
Nach ein paar Sekunden steht es zur Verfügung und kann im Server, also in der `server.js`, eingebunden werden. Das Modul muss mit dem oben erstellen `connect` Server verbunden werden damit Anfragen über den definierten Port beantwortet werden können. Klingt kompliziert? Ist es nicht.

	var socket = require('socket.io');
	var io = socket.listen(server);
	
Startet man jetzt den Node Server hinterlässt `socket.io` eine Log Nachricht die über den Start informiert.

Verbindet sich ein Client, wird das Event `connection` ausgelöst. Nach diesem Event steht ein `socket` zur Verfügung über den mit dem Client kommuniziert werden kann. In Javascript sieht das so aus:

	io.sockets.on('connection', function(socket) {
		console.log('client connected!');
	});

Das steht auch ganz hervorrangend neben den durch Express definierten Routen.
	

### Der Client

Im Frontend muss ebenfalls die Socket.io Library eingebunden werden. Diese wird vom Node Server geliefert wenn die entsprechende URL aufgerufen wird. Ganz einfach lässt sich das mit den folgenden Zeilen testen:

	<script src="/socket.io/socket.io.js"></script>
	<script>
		var socket = io.connect();
	</script>
	
Nach dem Neuladen im Browser wird die oben eingegebene Zeile im Terminal ausgegeben: **client connected!**


#### Auf Events reagieren

Die Variable `socket` steht jetzt sowohl im Frontend als auch im Backend zur Verfügung. Auf beiden Seiten lassen sich mit der Funktion `on()` Eventhandler registrieren.

	socket.on('hello', function() {
		console.log('Ohh, hello!');
	});

Als Parameter werden dem Callback sämtliche Daten übergeben, die beim auslösen des Events angegeben wurden.


#### Events auslösen

Der Schlüssel dazu ist die Funktion `emit()` - diese schickt ein Event auf die Reise.

	io.sockets.on('connection', function(socket) {
		socket.emit('hello', 'Paul');
	});

Auf der Serverseite gibt es noch eine Besonderheit. Das Objekt `socket` ist nach dem Verbindungsaufbau genau mit einem Client verbunden. Um die **anderen** Clients zu erreichen muss das Flag `broadcast` benutzt werden.

	socket.broadcast.emit('hello', '@all');

Damit schickt man ein Event an alle verbundenen Clients, mit Ausnahme des Senders. Also eine großartige Funktion wenn einer alle anderen informiert.

Sollen alle, also auch der Sender, mit informiert werden nutzt man das `io` Objekt:

	io.sockets.emit('processing', { remaining: 342342 });


Die `emit()` Funktion verfügt ebenfalls über eine Callbackfunktion. Man sendet ein Event ab und hinterlegt als dritten Parameter eine Funktion:

	socket.emit('event', {some: 'data'}, function(err, response) {
		//do something when the callback is called
	});
	
Der darauf reagierende Eventhandler muss die Funktion aufrufen:

	socket.on('event', function(data, callback) {
		//do something with the data
		//call the callback
		callback(false, {response: 'something'});
	});

Alles was eine direkte Rückmeldung erfordert lässt sich damit schnell und elegant abhandeln.



## Socket.io und AngluarJS

Im Moment gibt es wieder eine neue, globale Variable Namens `socket`. Alle Angular Controller könnten mit dieser Arbeiten, aber der schöne Weg ist das nicht. 
	
In Angular gibt es die Möglichkeit `Services` zu definieren. Das sind einzelne Module die von den Controllern genau so wie `$scope` als Abhängigkeit angefordert und benutzt werden können.

Der Service, um per Websocket mit dem Server zu kommunzieren, sieht so aus:

	angular.module('Services', []).
		factory('Socket', function($rootScope) {
			var socket = io.connect();
			return {
				on: function(eventName, callback) {
					socket.on(eventName, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							callback.apply(socket, args);
						});
					});
				},
				emit: function(eventName, data, callback) {
					if(typeof data == 'function') {
						callback = data;
						data = {};
					}
					socket.emit(eventName, data, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							if(callback) {
								callback.apply(socket, args);
							}
						});
					});
				},
				emitAndListen: function(eventName, data, callback) {
					this.emit(eventName, data, callback);
					this.on(eventName, callback);
				}
			};
		});
		
Der Einfachheit kopiere ich den Service in die `app.js` - alternativ könnte man sich eine Datei `services.js` anlegen und diese ebenfalls einbinden.

Was passiert hier?

1. Es wird ein neues Modul mit dem Namen `Services` definiert.
2. Über die Methode `factory` wird ein Modul erstellt mit dem Namen `Socket`.
3. Es gibt etwas Initialisierung, hier die Verbindungsherstellung über `io.connect()`.
4. Es wird ein Objekt zurück gegeben mit drei Funktionen: `on`, `emit` und `emitAndListen`. Diese drei Funktionen stehen zur Verfügung wenn der Service eingebunden wird.

Die Funktion `emit()` untersucht die übergebenen Parameter. Das bedeutet man kann Daten und einen Callback übergeben oder nur einen Callback. Beides wird ordentlich an den Server weitergeleitet.

`emitAndListen()` ist ein kleines Experiment von mir. Es sendet ein Event zum Server und registriert gleichzeitig einen Handler auf das gleiche Event. Damit fordert man aktiv an einer Stelle bestimmte Daten an, zum Beispiel das Zählen aller Nachrichten, und bekommt gleichzeitig bescheid wenn sich serverseitig an der Zahl etwas ändert.



### Den Socket Service benutzen

Als erstes muss der Applikation mitgeteilt werden, dass das Modul `Services` benutzt werden soll. Also eine Abhängigkeit der ganzen Applikation ist. Das praktische daran ist, dass sich in dem Service natürlich auch alle anderen nützlichen Helferein definieren lassen.

	angular.module('App', ['Services']);
	
Anschließend soll im `Frontend Controller` der `Socket` Service benutzt werden. Dieser wird als zweiter Parameter dem Callback übergeben:

	angular.module('App').controller('frontpage', function($scope, Socket) {
		//Socket is usable!
	});
	
Das wars! Die Verbindung steht und kann benutzt werden.


## Ein kleines Beispiel

Jetzt ist die richtige Zeit um die eigene Killerapp umzusetzen. Oder eine Todo Listen App. Wenn die Zusammenhänge noch nicht ganz klar sind, dann hilft vielleicht dieses Beispiel weiter. Es ist wirklich rudimentär und soll nur einen Einstiegspunkt geben und die Funktionsweise verdeutlichen.


### Der Server

Zwei einfache Funktionen werden im `connection` Callback definiert:

	io.sockets.on('connection', function(socket) {
		
		setTimeout(function() {
			socket.emit('hello', 'paul');
		}, 1000);

		socket.on('ready', function() {
			socket.broadcast.emit('ready');
		});

	});
	
Mit dem `setTimeout()` simuliere ich hier mal eine wahnsinnig komplizierte API Anfrage die den Namen `paul` zurück gibt.

Wenn ein Client das Event `ready` schickt wird es an alle anderen Clients weitergleitet.


### Der Controller

Der `Frontend Controller` wird ebenfalls erweitert:

	angular.module('App').controller('frontpage', function($scope, Socket) {
		$scope.loading = true;
		$scope.readys = [];

		Socket.on('hello', function(name) {
			$scope.name = name;
			$scope.loading = false;
		});

		Socket.on('ready', function() {
			$scope.readys.push('Ready Event!');
		});

		$scope.setReady = function() {
			Socket.emit('ready');
			$scope.readys.push('I AM READY!');
		};

	});

Im `Scope` wird die Variable `loading` definiert. Wenn das Event `hello` ankommt, wird sie auf `false` gesetzt. Außerdem wird der vom Server übergebene Name im `Scope` definiert.

Wird das Event `ready` empfangen, bekommt das Array `readys` einen neuen Eintrag hinzugefügt.

Zuletzt wird im `Scope` eine Funktion definiert, `setReady()`, sie sendet das `ready` Event an den Server und erweitert das `readys` Array ebenfalls.

Fehlt nur noch ein HTML View der die Daten anzeigt.


### Der HTML View

Alles was im `Scope` definiert wird, steht in der HTML Datei `frontend.html` zur Verfügung und kann mit den magischen Funktionen von AngluarJS genutzt werden. So sieht die HTML Struktur aus:

	<div ng-show="loading">
		<i>loading...</i>
	</div>

	<div ng-show="!loading">
		<h1>Hallo {{name}}</h1>
		<p>
			Are you ready?
			<button ng-click="setReady()">YES!</button>
		</p>
		<ul>
			<li ng-repeat="ready in readys">{{ready}}</li>
		</ul>
	</div>
	
Mit der Directive `ng-show` lässt sich ein Ausdruck validieren. Ist dieser wahr, wird das HTML Element angezeigt. So definiert man mit wirklich wenig Aufwand einen Preloader. Ist das nicht schön?

Wenn `loading` gleich `false` ist, wird der zweite DIV Container angezeigt. Hier wird der Nutzer begrüßt. Der Button erhält mit `ng-click` einen Klickhandler mit der eben definierten Funktion `setReady()`.

Und schließlich wird in einer Liste mit Hilfe von `ng-repeat` über das Array itteriert und alle Einträge ausgegeben.

Wenn das alles eingebaut ist, der Server und das Frontend keine Fehler liefern, dann die Seite `127.0.0.1:8080` in zwei Browser Fenstern öffnen und bewundern wie in nahzu Echtzeit die Liste erweitert wird.


### Der nächste Schritt

Wenn Du jetzt immer noch ließt anstatt deine Killerapp zu entwickeln, dann folgender Vorschlag:

Füge in der `frontend.html` ein Textfeld hinzu und gib ihm per `ng-model` einen Namen:

	<input type="text" ng-model="msg">
	<button ng-click="submit()">submit</button>

Definiere im Controller die Funktion `submit()`:

	$scope.submit = function() {
		$scope.readys.push($scope.msg);
	};	
	
Damit landet die Eingabe aus dem Textfeld im Array `readys` und wird sofort im eigenen Browserfenster ausgegeben. Jetzt fehlen nur noch zwei Events auf Serverseite:

	Socket.emit('send', $scope.msg);
	
und

	Socket.on('reveive', function(msg) {});
	
und fertig ist der eigene Chat. Viel Spaß beim umsetzen!



## Fazit

Node.js, Socket.io und AngularJS sind großartige Frameworks mit denen komplexe Applikationen in windeseile erstellt werden können.

Diese Anleitung kratzt natürlich wie immer nur an der Oberfläche, es lohnt sich die brandneue Directive `ng-animate` anzuschauen mit deren Hilfe die Webapplikation zum Leben erwacht.

Außerdem sollten Unit Tests genau so wie End to End Tests geschrieben werden um die Fehlerfreiheit und Erweiterbarkeit des eigenen Produkts zu erhalten.

Wer es noch nicht getan hat sollte unbedingt im Zuge der ganze Neuerungen auch gleich `SASS` benutzen. [CSS auf dem nächsten Level](http://www.interaktionsdesigner.de/2013/css-level-zwei/).

Die schöne, neue Webentwicklungswelt hat eine ganze Menge tolle Entwicklung erfahren. Es lohnt sich einzusteigen und am Ball zu bleiben.

Wenn der eigene Ordnungssinn überwiegt und man anfängt die Applikation auf Dateien aufzuteilen, sollte man sich von einem [automatisierten Gulp Prozess](http://www.interaktionsdesigner.de/2013/css-level-zwei/) unter die Arme greifen lassen.

Und alles Rund um das hier nicht man angekratzte Thema Directives gibt es zum Glück auch schon im Blog. [AngularJS Directives richtig nutzen](http://www.interaktionsdesigner.de/2014/angularjs-directives-richtig-nutzen/).

Bleibt nur noch zu sagen: **Less Code, more Fun!**