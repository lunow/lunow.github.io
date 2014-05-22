---

layout: post
title: "Prototypen mit AngularJS erstellen"
abstract: 'Als geneigter Webentwickler redet man mit vielen Leuten über viele Projekte. Und jeder bringt unterschiedliches Vorwissen mit und jeder schaltet bei einem anderen Level an Fachbegriffen ab.
Deshalb ist es bei umfangreichen Projekten ratsam einen Prototypen zu erstellen an dem man konkrete Probleme zeigen kann und gemeinsam die nächsten Aufgaben festlegt.

Mit AngularJS bekommt man ein mächtiges Werkzeug an die Hand, mit dessen Hilfe Prototypen innerhalb von ein paar Stunden funktionsfähig sind.

'
categories: AngularJS
redirect_from: "2013/09/12/prototypen-mit-angularjs-erstellen/"

---



## Konzeptionelle Vorbereitungen

Auch bei einem Prototyp kann die bei Entwicklern oft vorkommende Featuritis schnell zuschlagen. Bedeutet: man verzettelt sich in Details und Funktionen anstatt die drei wirklich wichtigen Aufgaben sauber darzustellen. Deshalb ist es unverzichtbar auch hier vor der Arbeit zu notieren welche Punkte gezeigt werden soll. Es bietet sich an eine Liste mit User Stories anzulegen:

1. Benutzer legt einen neuen Kontakt an
2. Benutzer erstellt eine neue Nachricht
3. Benutzer ändert seine Datenschutzeinstellungen

Diese drei Punkte soll der Prototyp sauber zeigen. Mehr nicht. Ebenfalls wichtig ist es, obwohl dem technisch nichts im Wege steht, keine persistente Speicherung zu implementieren. Alle Änderungen und Benutzerinteraktionen sollen bei einem Reload wieder verschwunden sein.

Denn das größte Problem ist, wenn der unwissende Auftraggeber am Ende der Prototyp Demonstration aus allen Wolken fällt weil die Implementierung noch mehrere Wochen in Anspruch nehmen wird. Am liebsten mit dem Satz: "Aber wieso? Es ist doch fertig. Ich will es genau so!"


## Technische Vorbereitungen

Genug gelabert. Als erstes sollte man sich [Bower](http://bower.io) installieren. Damit zieht man sich mit einem Terminal Befehl die wichtigsten Resourcen aus dem Netz. An dieser Stelle sollte auch noch [Yeoman](http://yeoman.io/) erwähnt sein, damit bin ich allerdings bisher noch nicht warm geworden.

Der Workflow für einen neuen Prototypen sieht aktuell so aus (im Terminal):

	> cd ~/Projekte/Prototypen
	> mkdir KillerApp2000
	> cd KillerApp2000
	> bower install angular#1.2.0-rc2
	> bower install angular-route#1.2.0-rc2
	> bower install jquery
	> subl .
	
Mit dem letzten Befehl öffnet sich [Sublime Text 2](http://www.interaktionsdesigner.de/2012/12/11/der-beste-editor-aller-zeiten-sublime-text-2/) mit dem angegeben Ordner. Hier erstellt man eine `index.html` Datei und eine `app.js` und verknüpft die entsprechenden Resourcen.

Außerdem bietet es sich an ein CSS Layout Framework zu benutzen. Gerade habe ich [UI Kit](http://getuikit.com/) benutzt, [Bootstrap](http://getbootstrap.com) und tausende weitere bieten sich aber genau so an.


## Das Hauptmenü

Es gibt meistens eine Reihe von Menüpunkten und entsprechende Unterseiten. Hier sollte man etwas rumklicken können. Kein Problem dank AngularJS.

Als erstes muss der HTML Baum mit AngularJS verknüpft werden.

	<html ng-app="App">
	
Erledigt! Als nächstes braucht man ein Hauptmenü.

	<nav>
		<ul>
			<li><a href="#/main">Start</a></li>
			<li><a href="#/settings">Einstellungen</a></li>
		</ul>
	</nav>

Ebenfalls einfach. Jetzt muss man Angular mitteilen, an welcher Stelle die nachzuladenen Inhalte angezeigt werden sollen. Das passiet über das `ng-view` Attribut.

	<div id="content" ng-view></div>

Das wars mit der Vorbereitung im HTML. Als nächstes wechselt man in die `app.js` und erstellt die oben referenzierte Angular Applikation:

	var App = angular.module('App', ['ngRoute']);

Als nächstes wird ein Router konfiguriert der die Adresse mit einer HTML Datei verknüpft.

	App.config(function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/index.html'
		});
		$routeProvider.when('/main', {
			templateUrl: 'views/main.html'
		});
		$routeProvider.when('/settings', {
			templateUrl: 'views/settings.html'
		});
	});

Natürlich müssen die entsprechenden Dateien noch angelegt werden, aber dann lässt sich schon durch den Prototyp navigieren! Der Ajax Request, das URL Handling, das ersetzen des HTML usw. usf. übernimmt alles Angular für uns!


## Interaktive Elemente

Alles mit einzelnen Seiten aufzubauen ist langweilig. Schließlich bieten Bootstrap und Konsorten tolle Widgets an. Zum Beispiel Tabs. Diese basieren meistens auf einer Liste mit Links, einer davon bekommt die Klasse `active` und zeigt sich damit anders an als die anderen. Passend zum Menüpunkt soll jeweils anderer Inhalt angezeigt werden.

Es gibt diverse Implementierungen, diverser Plugins in die man sich immer wieder reinarbeiten muss. Eine kleine Funktion mit jQuery zu schreiben wäre auch kein Problem.

Aber alles unsinnig wenn man das großartige AngularJS zur Verfügung hat. Denn dieses kommt mit einer ganzen Reihe `Directives` daher, die einem genau diese Funktionalität bieten. Der Schlüssel, und für mich der unschlagbare Vorteil, ist die Definition von JavaScript Variablen im HTML. Hört sich gruselig an, aber es geht ja hier um einen Prototypen.

Um das Tab Widget liegt ein Container der den initialen Zustand setzt.

	<div class="tabs" ng-init="tab = 0">

Als nächstes gibt es das Menü mit den Links

	<ul class="uk-tab uk-tab-left">
		<li ng-class="{'uk-active': tab == 0}"><a href="#" ng-click="tab = 0">Tab 1</a></li>
		<li ng-class="{'uk-active': tab == 1}"><a href="#" ng-click="tab = 1">Tab 2</a></li>
		<li ng-class="{'uk-active': tab == 2}"><a href="#" ng-click="tab = 2">Tab 3</a></li>
	</ul>

Das wars! Die Tab Navigation funktioniert. Durch `ng-class` wird die Klasse `uk-active` dem Element zugewiesen wenn die angegebene Bedingung erfüllt ist.

Mit der `ng-click` Directive setzt man bei Klick auf ein Element die Variable `tab` entsprechend.

Um die richtigen Inhalte je nach Menüpunkt anzuzeigen, nutzt man `ng-switch`. Damit lässt sich eine einfache, sogut wie selbsterklärende Struktur realisieren:

	<div ng-switch on="tab">
		<div ng-switch-when="0">Tab 1 angeklickt</div>
		<div ng-switch-when="1">Hallo Tab 2</div>
		<div ng-switch-when="2">Ich bin der Dritte im Bunde</div>
	</div>

Fertig! Ein kleines Problem gibt es allerdings noch. Klickt man auf einen der Links, springt der Browser entsprechend der `href="#"` Anweisung zurück auf die Startseite.

Deshalb definiere ich immer eine `prevent-default` Directive die genau dieses Verhalten unterdrückt in dem es das Event Bubbling deaktiviert. Im Link sieht der Aufruf so aus:

	<a href="#" prevent-default ng-click="alert('hello')">Say hello</a>
	
In der `app.js` definiert man entsprechend die Directive:

	App.directive('preventDefault', function() {
		return function($scope, elem) {
			$(elem).on('click', function(event) {
				event.preventDefault();
			});
		};
	});

Diese lässt sich universell einsetzen, immer wenn man das Standardverhalten des Browsers unterdrücken möchte.



## Erweiterte Funktionalität

Jetzt kommt nicht jeder Prototyp mit diesen einfachen Möglichkeiten aus. Hier und da muss vielleicht eine API angefragt werden oder auf ein bestehendes Interface zugegriffen werden.

Aus obigem Beispiel könnte das die Einstellungsseite sein. Damit man eine JavaScript Funktion erhält, die beim Aufruf der Seite ausgeführt wird, erweitert man den Router um die Eigenschaft `controller`.

	$routeProvider.when('/settings', {
		controller: 'settings',
		templateUrl: 'views/settings.html'
	});

In der `app.js` definiert man den entsprechenden Controller:

	App.controller('settings', function($scope) {
		//some magic
	});

Damit ist die Brücke geschlagen zum guten alten Model-View-Controller Pattern. Naja, fast. Das Model wird dann besprochen wenn es wieder um "richtige" WebApps geht.


## Fazit

Mit einem CSS Framework und AngularJS erstellt man innerhalb von wenigen Stunden voll funktionsfähige Prototypen die eine grandiose Grundlage für Diskussionen und Konzeptionen darstellen.

In meinen Augen wesentlich effektiver als mit Zeichnungen oder Photoshop Layouts herum zu hantieren.