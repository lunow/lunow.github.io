---

layout: post
title: "Angular UI Router zum laufen kriegen"
abstract: "Es geht darum Single Page Applikationen zu bauen, die ihren Zustand über die Browser URL aufrufbar machen. Unverzichtbar wenn man die Vor- und Zurücktasten des Nutzers unterstützten will. Der UI Router machts Möglich. Ein kleiner Einstieg in die Thematik."
categories: AngularJS
background: ol-boot

---
{% raw %}


## UI Router

Angular bringt einen einfachen Router mit, der stößt aber schnell an seine Grenzen und für die nächsten Versionen sind schon [umfangreiche Verbesserungen](https://github.com/angular/router) geplant. Bis dahin nutze ich den [UI Router](https://github.com/angular-ui/ui-router). Er definiert nicht einzelne Adressen, die im Browser aufgerufen einen Controller mit einem Template verknüpfen, sondern arbeitet mit einem Applikation Status.

Man definiert einen Zustand nach dem anderen und kann dabei festlegen ob dieser in der URL reflektiert wird. Dabei können verschiedene Zustände der Applikation aufeinander aufbauen. Dazu später mehr, als erstes muss der neue Router installiert werden.

	bower install --save angular-ui-router

Man bindet die Datei `bower_components/angular-ui-router/release/angular-ui-router.js` in seine `index.html` ein und definiert die Abhängigkeit in der globalen App.

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

Im HTML Template müssen zwei Dinge verbunden werden: Zum einen die Verbindung zu unserer Applikation

	<html ng-app="App">

Zum anderen ein Container in den der UI Router das zum View gehörende Template laden kann.

	<body ui-view>

Anschließend einen kleinen Testserver starten, die `index.html` aufrufen - es passiert nichts - dann `#hello` an die URL Anhängen - Enter drücken und schon werden wir von den zwei Lieblingsworten eines jeden Entwicklers begrüßt:

	Hello World.


## Weg mit der Raute

Wer von einer "Ajax Anwendung" hin zu einer extrem coolen SPA kommen will muss die Raute aus der URL entfernen. Zum Glück geht das leicht. Angular muss angewiesen werden die Adressen ohne die Raute zu generieren:

	angular.module('App').config(function($stateProvider, $locationProvider) {
		//weg mit der raute
		$locationProvider.html5Mode(true);

		//...

Der Server, und hier liegt der Knackpunkt, muss alle Anfragen, bzw. alle Anfragen die URLs unserer SPA sind, an die `index.html` Datei senden.

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


## Zwischen den Zuständen navigieren

Der UI Router bringt ein paar Hilfsmittel mit um den User zwischen den verschiedenen Zuständen der App hin und her zu schicken.

Am einfachsten ist ein direkter Link mit der Direktive `ui-sref` im HTML. Dazu gibt man den Namen eines Zustandes an.

	<a ui-sref="user.index">Show all users</a>

Den Rest erledigt der Router.

Um im Controller den Nutzer weiter zu leiten, oder in einer eigenen Direktive einen Link zu erzeugen, nutzt man den Service `$state`.

	angular.module('App').controller('redirect', function($state) {
		if(everything_ok) {
			$state.go('user.index');
		}
	});

Das wars. Damit lässt sich schon ein Menü aufbauen.


## Parameter in der URL übertragen

Nun gibt es nicht nur die Nutzerübersicht sondern auch einzelne Nutzerprofile. Der Nutzername soll dabei in der URL zur eindeutigen Identifikation des entsprechenden Datensatzes dienen.

	$stateProvider.state('user.view', {
		url: '/view/:name',
		controller: 'UserViewCtrl'
	});

Der Controller ist namentlich genannt, also muss er definiert werden. Über den Service `$stateParams` bekommt man Zugriff auf die Daten as der URL.

	angular.module('App').controller('UserViewCtrl', function($scope, $stateParams, API) {
		API.User.byName($stateParams.name).then(function(user) {
			$scope.user = user;
		});
	});

Wenn das kein schlanker Controller ist!

Im HTML muss man eventuell auch das eine oder andere Mal auf das Profil eines Nutzers verweisen. 

	<a ui-sref="user.view('paul')">View Pauls Profile</a>

Das wäre statisch gesetzt, der Wert von `ui-sref` wird mit dem aktuellen Scope evaluiert, es lässt sich also dynamisch aufbauen.

	<ul>
		<li ng-repeat="user in users">
			<a ui-sref="user.view(user)">{{user}}</a>
		</li>
	</ul>	


## Fazit

Das war ein kleiner Kratzer an der Oberfläche vom UI Router. Die Dokumentation und das restliche Internet zeigen all die anderen Dinge die noch mit diesem mächtigen Tool möglich sind.

Ich empfehle von Anfang an über die verschiedenen Zustände der neuen SPA nachzudenken. Selbst wenn sie nicht in der URL reflektiert werden ist es ein sinnvoller Weg die verschiedenen Einzelteile der App zu verbinden.

Und immer dran denken, wenn Doku, Stackoverflow und Google nicht weiterhelfen: [RTFC](https://code.google.com/p/rtfc/). 


### Weitere Themen

Ich habe mir viel mehr vorgenommen für diesen Artikel, aber er wurde einfach nicht fertig. Wenn Du Interesse an einem der folgenden Themen hast, oder noch ganz andere Fragen auftauchen, hinterlasse bitte einen kurzen Hinweis in den Kommentaren.

- Mehrsprachigkeit mit dem UI Router realiseren
- Mit einer eigenen Direktive `ui-sref` automatisieren
- Weiterleitungen aus allen Lebensbereichen
- Asynchrone Daten laden während ein neuer Zustand aufgerufen wird
- Zustände mit einer Backendnutzerverwaltung schützen

{% endraw %}