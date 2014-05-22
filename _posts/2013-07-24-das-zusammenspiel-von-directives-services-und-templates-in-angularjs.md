---

layout: post
title: "Das Zusammenspiel von Directives, Services und Templates in AngularJS"
abstract: 'Das großartige Framework AngularJS beschäftigt mich, und damit diesen Blog, schon eine ganze Weile. Es macht Spaß mit dieser Technologie WebApps in einer Geschwindigkeit zu entwickeln die jQuery und Co niemals zulassen.

Damit es wirklich so schnell geht muss man die AngularJS Konzepte verstehen. Dieser Artikel gibt einen kleinen Einblick in den Aufbau von Directives und Services.

'
categories: Javascript, AngularJS
redirect_from: "2013/07/24/das-zusammenspiel-von-directives-services-und-templates-in-angularjs/"
background: venus

---



## Directives

Wenn man sich dabei ertappt in einem AngularJS Controller auf den DOM Tree zugreifen zu wollen hat man etwas falsch gemacht. Sofortiger Abbruch und nochmal nachdenken. Die Controller sind nur dazu da um Teile des DOM Trees mit Daten zu versorgen.

Nun muss man aber für ein tolles Interface den einen oder anderen Eventhandler binden. Dafür gibt es die `Directives`. AngularJS bringt schon einige mit, dass sind die Dinger die den HTML Code erweitern, z.B. mit `ng-repeat`.

	<ul>
		<li ng-repeat="item in items">{{ item.title }}</li>
	</ul>
	
Immer wenn irgendwas direkt mit dem DOM Tree arbeitet, muss es in eine `Directive` verpackt werden. Das könnte der Aufruf eines jQuery Plugins sein, z.B. für die Anzeige von Charts, oder eine wiederverwendbare Komponente, z.B. für einen Zurück Knopf innerhalb der Applikation.

Im HTML Code kann man sich einen beliebigen Namen überlegen.

	<button ui-back>Zurück</button>

Fügt man das in sein Template ein, passiert erstmal gar nix, denn alles was im Template von AngularJS nicht gefunden wird, wird ignoriert.

Damit man auf diesen Button Zugriff bekommt, definiert man eine Funktion.

	var App = angular.module('HelloWorld');
	
	App.directive('uiBack', function() {
		return function($scope, elem, attrs) {
			$(elem).on('click', function() {
				alert("Going Back!");
			});
		};
	});
	
Im Gegensatz zum HTML Code wird der Name der `Directive` in CamelCased Schreibweise angegeben. Im einfachsten Fall definiert man eine Funktion, welche wiederum eine Funktion zurückgibt, die ihrerseits aufgerufen wird, sobald Angular im HTML Template auf den entsprechenden Namen gestoßen ist.

Alternativ akzeptiert die Funktion auch ein Objekt mit vielen Einstellungsmöglihckeiten. In der Doku finden sich alle Angaben dazu.

Mit Hilfe eines `debugger` Statements im Callback der Directive kann man sich einen Eindruck verschaffen auf welche Teile der Applikation man Zugriff hat.

Für diesen Artikel ist nur das `elem` wichtig. Es ist die Referenz zum DOM Tree Element in dem die Directive eingesetzt wurde. Der Rest ist ganz normales jQuery. 

Tipp am Rande: AngularJS bringt jQLite mit, will man das komplette jQuery zur Verfügung haben, muss man die Library **vor** Angular einbinden!

Ebenfalls spannend ist, um obiges Beispiel aufzugreifen, die native Implementierung der `ng-repeat Directive` zu studieren: [https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js](https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js)


## Services

Im Gegensatz zur Kommunikation mit dem DOM Tree dienen Services dazu, Funktionalität zu kapseln die an mehreren Stellen der Applikation benötigt werden. Ertappt man sich dabei Code aus einem Controller zu kopieren, z.B. um eine API anzufragen - STOPP!

Genau der gleiche Stopp Ruf muss imaginär durch den Entwicklerkopf hallen wenn man beginnt globale Variablen zu definieren. "Hör auf den globalen Namensraum zu verschmutzen", schreit es einen da von der Seite an. Denn grundsätzlich verfolgt man wie immer die beiden Grundsätze: KISS (Keep it Simple and Stupid) und DRY (Dont repeat yourself).

Genau dafür gibt es das Konzept der `Services`. Definiert werden diese über die `factory()` Funktion, innerhalb des `App` Namensraum.

	App.factory('HelloService', function() {
		return function() {
			alert("Hello");
		};
	});

Von einer `Factory` wird erwartet, dass sie eine Funktion zurückliefert die als Initialisierung dient, und ihrerseits ein Objekt oder eine Funktion zurück liefert. Dieser Rückggabewert kann jetzt von Controllern und Directives als Abhängigkeit definiert und benutzt werden.

Im Controller sieht das so aus:

	<!-- index.html -->
	<div ng-controller="example">
		<button ng-click="hello()">use the hello service</button>
	</div>
	
	// app.js
	App.controller('example', function($scope, HelloService) {
		$scope.hello = HelloService;
	});
	
Über die Analyse der Funktionssignatur weiß Angular welche Abhängigkeiten geladen werden müssen. Das heißt die Reihenfolge der Parameter spielt keine Rolle. `function(HelloService, $scope)` funktioniert genauso.

Die nativen AngularJS Services beginnen stets mit einem Dollar Zeichen. Damit kommen sie nicht in die Quere der selbstdefinierten.

Eine einzelne Funktion zurück zu geben, wie im obigen Beispiel, macht in der Realität wenig Sinn. Im Eintrag über [modulares Javascript](http://www.interaktionsdesigner.de/2012/11/07/ein-einfacher-einstieg-in-modulares-javascript-mit-requirejs/) habe ich im Abschnitt "Ordentliche Module" eine Struktur vorgestellt, die man hier wieder aufgreifen kann.

	App.factory('Clean', function() {
		var my = {}, that = {},
			construct;
		
		//constructor
		construct = function() {
			return that;
		};
		
		//public function
		that.doIt = function() {
		};
		
		//private function
		my.secret = function() {
		};
		
		return construct();
	});

Je nach Größe und Umfang des Service muss man sich für eine nachvollziehbare und praktikable Struktur entscheiden.


## Das Zusammenspiel

Nachdem die Grundlagen beider Konzepte bekannt sind, möchte ich mein Beispiel zur Verwendung vorstellen. Der schon angesprochene Zurück Button in meiner WebApp arbeitet etwas anders als jener des Browsers. Jeder Controller entscheidet selbstständig ob man zu ihm zurückspringt oder zu einer anderen Seite.

	Core.controller('Example', function($scope, UI) {
		UI.history.start('example');
	});
	
	Core.controller('Example.create', function($scope, UI) {
		UI.history.start('example').push('create');
	});

Damit definiert jeder Controller den Pfad auf dem der User zu ihm gelangt ist. Der Service UI bietet ein Objekt `history` in dem alle Funktionen gespeichert sind. Die vereinfachte Implementierung sieht so aus:

	Core.factory('UI', function() {
		var my = {}, that = {};
		
		that.history = {};
		my.history = {
			stack: []
		};
		
		that.history.push = function(url) {
			my.history.stack.push(url);
			return that.history;
		};
		
		that.history.start = function(url) {
			my.history.stack = [url];
			return that.history;
		};
		
		that.history.back = function() {
			//imagine a nice history back function
		};
		
		return that;
	});
	
Im Template befindet sich der schon oben vorgestellte Zurück Button.

	<button ui-back>Zurück</button>

Die Directive benutzt ebenfalls den UI Service um bei Klick die entsprechende Aktion auszulösen.

	Core.directive('uiBack', function(UI) {
		return function($scope, elem, attrs) {
			$(elem).click(function(event) {
				event.preventDefault();
				UI.history.back();
			});
		};
	});
	
Mit diesen Mittelen baut man äußerst saubere Interfaces auf. Die Struktur ist leicht nachzuvollziehen und jedes einzelne Teil lässt sich hervorragend mit Unit Tests belegen und im Team aufteilen.


## Fazit

Dieser Einstieg soll die Grundkonzepte verdeutlichen. Nachdem man ein bisschen damit rumgespielt hat, lohnt es sich die entsprechende Dokumentation durchzulesen. Vorallem wenn man auf Situationen stößt in denen dieser einfache Aufbau nicht ausreicht. Bevor man Angular anfängt zu hacken, erstmal die Doku und Stackoverflow durchsuchen! Viel Spaß.