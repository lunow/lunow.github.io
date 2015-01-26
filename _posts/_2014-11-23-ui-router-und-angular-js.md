---

layout: post
title: "Single Page Apps mit Deeplinking"
abstract: "Auch wenn man es bei diesem Titel vielleicht nicht glauben mag, mir gehen diese ganzen Anglizismen auf die Nerven. Aber für diesen Titel ist mir nichts besseres eingefallen. Es geht darum Single Page Applikationen zu bauen, die ihren Zustand über die Browser URL aufrufbar machen. Unverzichtbar wenn man die Vor- und Zurücktasten des Nutzers unterstützten will. Die Marketingabteilung freut sich und die Redakteure kriegen ihre Links mit Sprachkürzel. Friede, Freude, Eierkuchen - nach der Lektüre diesen Artikels."
categories: AngularJS
background: maul

---
{% raw %}


## UI Router

Angular bringt einen einfachen Router mit, der stößt aber schnell an seine Grenzen und für die nächsten Versionen sind schon umfangreiche Verbesserungen geplant. Bis dahin nutze ich den UI Router. Er definiert nicht einzelne Adressen, die im Browser aufgerufen einen Controller mit Template verknüpfen, sondern arbeitet mit einem Applikation Status.

Man definiert einen Zustand nach dem anderen und kann dabei festlegen ob dieser in der URL reflektiert wird. Dabei können verschiedene Zustände der Applikation aufeinander aufbauen. Dazu später mehr, als erstes muss der neue Router installiert werden.

	bower install --save angular-ui-router

Man bindet dann die Datei `bower_components/angular-ui-router/release/angular-ui-router.js` in seine `index.html` ein und definiert die Abhängigkeit in der globalen App.

	angular.module('App', [
		'ui.router'
	]);


## Mein erster Status

Der UI Router bringt eine Directive, einen Service und seinen Provider mit. Mit letzterem definiert man in der `config()` Phase der Applikationen einen ersten Zustand der App.

	angular.module('App').config(function($stateProvider) {
		$stateProvider.state('hello', {
			url: '/hello',
			template: '<div>Hello {{name}}.</div>',
			controller: function($scope) {
				$scope.name = 'World';
			}
		});
	});

Im HTML Template müssen zwei Dinge vernetzt werden, zum einen die Verbindung zu unserer Applikation

	<html ng-app="App">

Zum anderen ein Container in den der UI Router das zum View gehörende Template laden kann.

	<body ui-view>

Anschließend einen kleinen Testserver starten, die `index.html` aufrufen - es passiert nichts - dann `#hello` an die URL Anhängen - Enter drücken und schon werden wir von den zwei Lieblingsworten eines jeden Entwicklers begrüßt:

	Hello World.


## Weg mit der Raute

Wer von einer "Ajax Anwendung" hin zu einer extrem coolen SPA kommen will muss die Raute aus der URL entfernen. Zum Glück geht das easy. Angular muss angewiesen werden die Adressen ohne die Raute zu generieren:

	angular.module('App').config(function($stateProvider, $locationProvider) {
		//weg mit der raute
		$locationProvider.html5Mode(true);

		//...

Der Server, und hier liegt der Knackpunkt, muss angewiesen werden alle Anfragen, bzw. alle Anfragen die URLs unserer SPA sind, an die `index.html` Datei zu senden.

Zu Demozwecken nutze ich ein einfaches Node Script. Im Agentur oder Startup Kontext wäre jetzt der richtige Moment um mit dem Serveradministrator oder den Backendentwicklern einen Plan zu schmieden wie das am besten umgesetzt werden kann.

Optimal ist eine Lösung in der alle Routen an die `index.html` Datei gesendet werden, alle anderen Dateien, wie statische Ressourcen, nicht! Das ist goldwert bei der Entwicklung um Tippfehler und rekursive Aufrufe zu verhindern.

Ganz billig für dieses Tutorial ist ein simpler Node Server mit Express:

	var express = require('express');
	var fs = require('fs');

	var app = express();
	var dir = __dirname;
	var port = 8044;

	app.use('/', express.static(dir+'/'));

	//redirect index.html on every request
	app.all('/*', function(req, res) {
		fs.readFile(dir+'/index.html', { encoding: 'utf8' }, function(err, file) {
			res.send(file);
		});
	});

	console.log('server started on port', port);
	app.listen(port);

Es geht hier leider nicht um Node, deshalb nur in aller Knappheit: Das Script setzt den Ordner in dem es aufgerufen wird als statische Ressource für den Server, liefert also alles aus was aufgerufen wird (z.B. die Bower Components). Alles was nicht gefunden wird landet im `app.all()` Callback der die `index.html` liest und zurück gibt.

Script starten mit `node index.js`, Browser öffnen und die Seite http://localhost:8044/hello aufrufen - dort liegt unsere wunderbare SPA und wartet auf den nächsten Zustand.


## Zustände verschachteln

Der UI Router ist in der Lage mehrere `ui-view`s zu verarbeiten. Um die Übersichtlichkeit und Nachvollziehbarkeit zu gewährleisten, schlage ich vor die Zustände zu verschachteln.

Eine gute Möglichkeit um große Anwendungen in handhabbare Teile zu zerschneiden ist die Gruppierung nach Funktion.
Dabei legt man für jeden alleinstehenden Teilbereich der Anwendung ein eigenes Modul an. Zum Beispiel die Nutzerverwaltung `User`.

	angular.module('User', []);

	angular.module('User').config(function($stateProvider) {

		$stateProvider.state('user', {
			abstract: 'true',
			url: '/user',
			template: '<div class="user" ui-view></div>'
		});

		$stateProvider.state('user.index', {
			url: '/index',
			template: '<ul><li ng-repeat="user in users">{{user}}</li></ul>',
			controller: function($scope) {
				$scope.users = ['Peter', 'Paul', 'Mary']
			}
		});

	});

Die Anwendung muss neben dem `ui.router` jetzt auch das neue User Modul verlangen.

	angular.module('App', ['ui.router', 'User']);

Der erste State setzt den Schlüssel `abstract` auf `true`. Damit definiert man einen Zustand der nicht direkt aufgerufen werden kann. Statt dessen können andere Zustände darauf aufbauen.

`user.index` definiert den Einstiegspunkt zum User Modul. Die Adresse baut sich aus beiden Zustandsdefinitionen aus und lautet http://localhost:8044/user/index und zeigt eine Liste aller Nutzer.

Damit bekommt man eine einfache Möglichkeit einen Namespace für die verschiedenen Module zu erstellen damit sich die Adressen nicht vermischen.





	



- $state.go(), $state.href()
- Mehrsprachigkeit
- uref Directive
- Weiterleitungen
- Resolves
- Berechtigungen