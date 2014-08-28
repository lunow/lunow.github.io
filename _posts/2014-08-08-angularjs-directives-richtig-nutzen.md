---

layout: post
title: "AngularJS Directives richtig nutzen"
abstract: "Das großartige Framework AngularJS beschäftigt mich jetzt schon über eine ganze Reihe von WebApps hinweg. Und ich bin immer noch begeistert. Wenn man die Aufteilung verinnerlicht hat und den Angular Konventionen folgt, wird man belohnt mit einer sauberen, logischen und erweiterbaren Applikation.

Eine zentrale Rolle spielen dabei die Directives. Welche und wie man am besten mit ihnen umgeht, erklärt dieser Artikel."
categories: AngularJS
background: marktplatz

---


## Der Einstiegsfehler

Zugegeben, ich stand vor genau der gleichen Situation. Das erste Angular Projekt wächst und gedeiht, und plötzlich stößt man auf folgendes Problem: Wie kriege ich im Controller Zugriff auf meine HTML Elemente? Die Antwort: gar nicht. Denn genau zu diesem Zweck gibt es die Directives.

In den Controllern kümmert man sich um die Logik und die Verknüpfung von Template (HTML) und Logik (Services). Alles was mit der Darstellung zu tun hat gehört ins Template, und wird erweitert durch Directives.


## Die Grundlage

Es gibt in meiner App ein Element das auf nette Weise den aktuellen Status darstellen soll. Der Status wird gesetzt über den Controller.

	App.controller('something', function($rootScope) {
		$rootScope.status = 12;
	});
	
Es fällt auf das ich hier auf den `$rootScope` zugreife, im gegensatz zum `$scope` den man normaler Weise benutzt. Hintergrund ist der folgende HTML Baum:

	<div ng-app="App">
		<div id="head">
			<span>Status: {{status}}</span>
		</div>
		<div id="content" ng-controller="something">
			<!-- stuff for changing status -->
		</div>
	</div>
	
Der `$scope` bezieht sich also auf den Div Container `#content`. Meine Statusanzeige liegt aber außerhalb, denn alle Controller sollen auf diesen zugreifen können.

So funktioniert das Beispiel schon. Aber anstatt den Status einfach nur auszugeben, soll er aufwändig animiert werden. Dafür definiert man eine `Directive`.

	App.directive('uiStatus', function($rootScope) {
		return function($scope, elem, attrs) {
			var $elem = $(elem); // <--- yeah, access to the dom element!
		};
	});

Am Rande: Damit das funktioniert muss jQuery **vor** AngularJS eingebunden werden.
	
Über den in CamelCased definierten Namen `uiStatus` kann die Directive im HTML angesprochen werden. Der Callback, also die übergebene Funktion akzeptiert Abhängigkeiten, es können also alle `Services` verwendet werden.

Dieser Callback wird initial und einmalig aufgerufen, sobald Angular die Directive im HTML Baum findet. Die Rückggabe-Funktion wird jedesmal ausgeführt wenn sich im Scope des Elements etwas ändert. Es ist also darauf zu achten, hier keine auffwändigen Prozesse zu starten.

	App.directive('name', function() {
		console.log('just running for one time!');
		var x = 0;

		return function() {
			x++;
			console.log('running for each element', x);
		};
	});

Die Logausgabe wird, je nach Anzahl der Verwendungen, dann wie erwartet ausgeben:

	just running for one time!
	running for each element 1
	running for each element 2
	running for each element 3

Damit die Directive greift, wird sie als Attribut im HTML notiert.

	<div id="#head">
		<span ui-status></span>
	</div>

Damit erhält man eine äußerst saubere Trennung zwischen Logik und Darstellung. Beide Funktionen, Controller und Directive, lassen sich einzeln testen, verwenden und teilen. Die Verbindung von beiden erfolgt über das HTML Template.

In meinen Augen eine sehr saubere Angelegenheit. Und das war erst der Anfang. Jetzt kommen die Sachen die richtig Spaß machen!


## Konfiguration von Directives

In einer WebApp habe ich eine `Button Directive` entwickelt. Damit kann jedes HTML Element anklickbar gemacht werden. Der einfachste Anwendungsfall ist die Weiterleitung auf eine bestimmte URL.

	<a href="#" ui-button="{url: '/home'}">Home</a>
	
Das sieht schon ganz nett aus. Und an die Daten kommt man äußerst elegant. Die Kurzform der Directive sieht so aus:

	App.directive('uiButton', function($parse, $location) {
		return function($scope, elem, attrs) {
			var defaults = {
				url: undefined,
				callback: undefined
			};
			var opts = angular.extend(defaults, $parse(attrs.uiButton)($scope));
			var $elem = $(elem);
						
			$elem.on('click', function(event) {
				event.preventDefault();
				if(opts.url) {
					$location.path(opts.url);
					$scope.$apply();
				}
			});
		};
	});
	
Hier passiert eine ganze Menge. Als erstes werden im Objekt `defaults` die Standardeinstellungen hinterlegt, damit in jedem Fall die Attribute im `opts` Objekt vorhanden sind, auf die sich die restliche Anwendung verlässt.

Mit Hilfe des `$parse` Service, lässt sich ein beliebiger String in ein Objekt umwandeln. Dabei liefert die Funktion `$parse("{hello: 'world'}")` wiederum eine Funktion zurück, die als Parameter ein Scope Objekt erwartet. Etwas übersichtlicher aufgeschrieben sieht das so aus:

	var template = '{hello: "world"}';
	var parsed = $parse(template);
	var result = parsed($scope);

In der Variable `result` befindet sich jetzt ein Objekt mit dem Attribut `hello` und der Eigenschaft `world`. Das klingt nicht so besonders, ist es aber, weil Angular einen eigenen Parser mitbringt und damit auf die böse `eval()` Funktion verzichtet werden kann. Außerdem stehen sämtliche Filter und die gewohnten Angluar Goodies zur Verfügung.

Und der Scope berücksichtigt. Also funktioniert auch folgendes:

	$scope.hello_value = 'world';
	var template = '{hello: hello_value}';
	var parsed = $parse(template);
	var result = parsed($scope);
	
Das Ergebnis ist das gleiche wie oben. Immer noch nicht begeistert? Dann vielleicht nach folgender Erweiterung.

Über den `$parse` Service lässt sich die eigene Directive komplett in die gewohnten Angular Strukturen einbinden. Der aufmerksame Leser hat mit Sicherheit schon das `callback` Attribut gesehen. Anstatt simpel auf eine URL weiterzuleiten, soll der Button auch eine eigene Funktion ausführen können.

	App.controller('index', function($scope) {
		$scope.greet = function() {
			alert("Hello!");
		};
	});

Soweit so normal. Im HTML Template wird die Directive initialisiert.

	<button ui-button="{callback: 'greet()'}">Say hello</button>

Die Directive muss jetzt nur noch um die Reaktion auf den Callback erweitert werden.

	if(opts.callback) {
		$parse(opts.callback)($scope);
	}

Fertig. Der Callback muss als String übergeben werden, andererseits würde er beim ersten parsen schon ausgeführt werden. Nicht erst wenn das Element angeklickt wird.


## Eigene HTML Elemente

Directives können nicht nur als Attribut angegeben werden, sondern auch als eigenständiges HTML Tag. Für die modernen Browser natürlich nur. Ein Beispiel könnte so aussehen:

	<gallery>
		<img src="img1.jpg">
		<img src="img2.jpg">
		<img src="img3.jpg">
	</gallery>

In der Directive kann man dann entweder selbst ein Gallerie Script schreiben oder ein vorhandenes jQuery Plugin initialisieren.

Damit das Tag von Angular erkannt wird, muss man die umfangreichere Notation für eine Directive nutzen. Diese unterscheidet sich im Rückgabewert. Statt einer Funktion gibt man ein Objekt zurück. Das ermöglicht diverse Einstellungsmöglichkeiten. 

	App.directive('gallery', function() {
		return {
			restrict: 'E',
			link: function($scope, elem, attr) {
				var $gallery = $(elem);
			}
		};
	});

Spannend ist an der Stelle die Eigenschaft `restrict`. Damit teilt man Angular mit auf welche Art die Directive eingebunden werden kann. Es gibt noch eine ganze Reihe weiterer Möglichkeiten, aber ich finde die beiden vorgestellten Möglichkeiten am sinnvollsten.

Es gibt auch noch viel mehr Einstellungsmöglichkeiten. Die ganze Liste findet man im [Directive Guide](http://docs.angularjs.org/guide/directive).



## Auf Veränderungen reagieren

Hier kommt der Abschnitt der mich am meisten Verzweifelung gekostet hat. Natürlich will, obigem Beispiel folgend, niemand die Bilder-Elemente von Hand in einem Template definieren. Das sieht in der Realität ehr so aus:

	App.controller('gallery', function($scope) {
		$scope.images = [
			'img1.jpg',
			'img2.jpg',
			'img3.jpg
		];
	});

Im HTML Template dann entsprechend

	<gallery>
		<img ng-repeat="image in images" ng-src="{{image}}">
	</gallery>

Ein Reload im Browser und alle Bilder werden korrekt angezeigt. Allerdings greift die definierte Directive nicht mehr.

	App.directive('gallery', function() {
		return {
			restrict: 'E',
			link: function($scope, elem, attr) {
				var $gallery = $(elem);
				console.log('images: ', $gallery.find('img').length);
			}
		};
	});

Damit bekommen wir in der Console ein fettes `images: 0` ausgegeben. Ein gesetzter Breakpoint in der `Link` Funktion zeigt dann auch warum: Unsere Directive wird ausgeführt bevor das `ng-repeat` durch ist. Unsere `<gallery>` ist also zurecht leer.

Die Lösung ist zum Glück einfach. Genau wie Angular selbst muss unsere Directive die Veränderungen in dem Element überwachen.

	App.directive('gallery', function() {
	
		return {
			restrict: 'E',
			link: function($scope, elem, attr) {
				//make $(elem) available in name space
				var $gallery = $(elem);
					
				//create reusable functions
				var create = function() {
					console.log('images: ', $gallery.find('img').length);
				};
				
				//watch for changes
				$scope.$watch(elem.children(), create);
			}
		};
	});

Die letzte Zeile ist die entscheidende. `$scope.$watch(elem.children(), create);` - hier wird ein Callback abgegeben, sobald sich an den Kindelementen irgendwas ändert. Und schon wird bei der Ausführung die korrekte Anzahl Bilder ausgegeben.

Viel Aufwand für relativ wenig? Könnte man meinen. Aber wenn sich irgendwas ändert, zum Beispiel der Controller die Bilder in `$scope.images` verändert, werden alle Systeme sofort darüber informiert und können reagieren. Automatisch!

Für dieses Geschenk kann man sich ruhig in die neue Logik einfinden. Es lohnt sich.

Genau so lassen sich auch Variablen im Scope überwachen. Aus dem obigen Beispiel zum Beispiel der Status. Dann übergibt man der `$watch()` Funktion einen String.

	$scope.$watch('status', function(new_status, old_status) {
	
	});

Der Callback bekommt als Parameter sowohl den neuen Status `new_status` als auch den vorherigen Status `old_status` übergeben. Mach was draus!


## Eine Kette von Directives

Manchmal, zum Beispiel weil einem die eine Directive nicht gefällt oder wenn man zwei kombinieren möchte, aber nur einmal im HTML Code aufschreiben möchte, will man aus einer Directive andere Directiven ansprechen.

Zum Glück steht mit dem Angular Service `$compile` genau diese Funktion zur Verfügung.

Bei einem großen Projekt mit spezieller Linkstruktur hat der Einsatz vom `uiRouter` mit seiner Directive `ui-sref` zu einem sehr redundanten Code geführt.

Also eröffne ich eine eigene Directive `my-ref()` mit der die immer gleichen Eingaben automatisiert hinzufügen lassen.

	App.directive('myRef', function($compile, mySpecialService) {
		return function($scope, elem, attrs) {
			var ref = mySpecialService.parse(attrs.myRef);
			elem.attr('ui-sref', ref);
			elem.removeAttr('my-ref');
			$compile(elem)($scope);
		}
	});

Grandios! Meine Angaben werden ausgelesen, durch meinen Service erweitert und in das Element geschrieben. Nicht vergessen darf man die Entfernung des eigenen Attributes `elem.removeAttr()` da man alternativ eine Endlosschleife lostritt.

Durch `$compile()` kümmert sich das großartige Angular um den Rest.


## Fazit

Ausgelassen habe ich den Abschnitt zum testen von Directiven. Wenn Du Dich in der Lage siehst diesen zu schreiben bist Du herzlich eingeladen einen Pull Request per GitHub zu senden, ich werde es dann umgehend veröffentlichen.

Ansonsten viel Spaß beim Kapseln von Logik und Darstellungscode. Es lohnt sich!