---

layout: post
title: "Pixelgenaue Design Umsetzung von AngularJS Apps"
abstract: "Diese Webseite muss genau so aussehen wie in meiner Photoshop Vorlage. Die Antwort von jedem Entwickler auf diese Frage sollte ein klares: Geht nicht sein. Das Internet ist nicht dafür gemacht Layouts genau so anzuzeigen. Es sei denn... Dieser Artikel bietet einen Ansatz zur Realisierung."
categories: AngularJs
background: coming-and-going

---


## Pixelgenaue Umsetzung

Eine Pixelgenaue Umsetzung ist unmöglich! Das Internet besteht aus einer sich rasant entwickelnden Landschaft aus Endgeräten und Browsern. Es wäre ökonimischer Wahnsinn und für die Benutzbarkeit ein riesiger Nachteil auf allen Endgeräten auf das identische Layout zu bestehen.

Es gibt aus meiner Sicht zwei Ausnahmen: Es handelt sich um eine Anwendung die, z.B. im Intranet, auf genau einem wohldefinierten Zielsystem läuft oder ein großes Team arbeitet an verschiedenen Teilen des Frontends und ein schneller Überblick über die Änderungen muss gewährleistet werden.

In diesem Fall muss sich der Entwickler etwas ausdenken.


## Der klassische Weg

Oft in meiner Karriere gesehen, einige Male selbst benutzt, Plugins und Extensions die ein Layout halb transparent über die Webseite legen und der geneigte Entwickler schiebt Pixel für Pixel die Elemente zurecht.

Die Verteilung der aktuellsten Entwürfe ist schwierig, und der gute Entwickler wird stets in der Umsetzung geeignete Vorschläge machen um das Layout zu verbessern. Und kein Designer wird Lust haben diese Verbesserungen im Grafikprogramm nachzubauen.

Zum Glück geht es besser.


## Der bessere Weg: PIPTER!

Darf ich vorstellen: Den **Pi**xel**p**erfekt Frontend **Te**ste**r**! Die Idee ist folgende: Ein automatisches Script liest alle AngularJS States aus, öffnet jeden und macht einen Screenshot. Dieser wird mit einem Referenzbild verglichen. Bei Ungleichheit muss entweder der Entwickler ran, oder das neue Bild wird als Referenzbild gespeichert.

Das hat jede Menge Vorteile: Die Screenshots werden automatisch erstellt. Das Tool kann in eine Continues Integration Umgebung eingebunden werden und dient als oberster Einblick ob die Anwendung so funktioniert wie erwartet. Außerdem lässt es sich auch ohne Programmierkenntnisse von allen Teammitgliedern benutzen.

Mit Selenium, Webdriver und NodeJS ist ein erster Prototyp schnell zusammen gepackt.


## PIPTER Realisierung

Zur Realisierung bedienen wir uns der Tools mit denen normalerweise E2E Tests realisiert werden. Fangen wir mit der spannendsten Aufgabe an. Ein Angular Anwendung öfnen und die verfügbaren States auslesen. Vorrausseztung dafür ist in diesem Beispiel die Anwendung des UI Routers.


### Webdriverjs-angular

Zum Glück gibt es eine für Angular vorbereitete Version vom [Webdriver](https://github.com/webdriverio/webdriverjs-angular) die mit `npm install --save webdriverjs-angular` installiert wird.

In einem Node Script, ich nenne es `runner.js` wird der Webdriver konfiguriert.

	var webdriverjs = require('webdriverjs-angular'),
	client = webdriverjs.remote({
		desiredCapabilities: {
			browserName: 'chrome'
		},
		ngRoot: 'body'
	});

Anschließend wird ein Client erzeugt.

	client
		.init()
		.setViewportSize({ width: 1280, height: 800 })
		.url('http://localhost:8100')
		.execute(function() {
			//this runs in the browser!!!
		});

Der Code erinnert auf angenehme Art an das gute, alte jQuery und ist selbsterklärend. Die `execute()` Funktion wird im Browser aufgerufen, das heißt keine der NodeJS Variablen stehen hier zur Verfügung, dafür aber die der Angular Anwendung.

Die Konfiguration der Ziel-URL `http://localhost:8100` und die Fenstergröße sind hier hart kodiert. Das ist nicht besonders schön, aber funktioniert natürlich.

Aus dieser werden alle UI Router States ausgelesen und zu jedem, nicht abstrakten State die absolute URL generiert.

	//inside the execute() function:
	function() {
		var urls = [];
		var $state = angular.element('body').injector().get('$state');
		_.each($state.get(), function(state) {
			if(!state.abstract) {
				urls.push({
					url: $state.href(state.name, {}, { absolute: true }),
					name: state.name,
					state: state
				});
			}
		});
		return urls;
	}

Die Zeile `angular.element('body').injector().get(Service)` mächte ich noch einmal hervorheben. Damit lässt sich auch auf der Konsole jeder Service einfach holen, ansprechen und debuggen.

Der Rückggabewert wird vom Webdriver an die folgende Funktion übergeben. Der Parameter ist ein Objekt mit der Eigenschaft `value` in dem die URL Liste von oben steht.

	.execute(function() { /* see above */ })
	.then(function(response) {
		async.forEachOfSeries(response.value, function(state, key, callback) {
			//save screenshot...
			client
				.url(state.url)
				.saveScreenshot(__dirname + '/screenshots/current/'+state.name+'.png')
				.then(function() {
					//screenshot saved, goto next one
					callback();
				});
		}, function() {
			//all screenshots saved!
			client.end();
		});
	});

Dieser Callback ist interessant. Mit der großartigen Library [async](https://github.com/caolan/async) ist es Möglich über eine Liste zu itterieren, jeder einzelne Eintrag wartet bis sein Vorgänger ausgeführt wurde und läuft dann selbst. Am Ende wird der Callback im zweiten Parameter aufgerufen.

	async.forEachOfSeries(array, callback_for_each_item, callback_when_done);

Async bietet darüber hinaus noch viele weitere Funktionen um einen Ablauf zu kontrolieren und so der Callback Hölle zu entkommen. Ein genauerer Blick lohnt sich sehr!

Über `client().url().saveScreenshot()` wird von jedem State ein Screenshot aufgenommen und im Ordner `screenshots/current/` mit dem State Namen gespeichert.

Fertig!


### Selenium Server

Der Webdriver kommuniziert mit einem Selenium Server. Der muss über NPM installiert werden.

	$ npm install selenium-standalone@latest -g
	$ selenium-standalone install

Und nach erfolgreicher Installation auch gestartet.

	$ selenium-standalone start

Anschließend sicher stellen, das ein Webserver läuft und die App auch zur Verfügung stellt (unter http://localhost:8100, sofern oben nicht geändert).



### Express Server

Der Rest der Anwendung ist schnell zusammengebaut. Mit `express` wird ein Server aufgesetzt. Der Einfachheit mache ich den gesamten `node_modules` Ordner zugänglich, genauso wie die Screenshots und einen Ordner `client` in dem das Frontend gespeichert wird.

	var express = require('express');
	var app = express();

	app.use(express.static('client'));
	app.use(express.static('node_modules'));
	app.use(express.static('screenshots'));

Anschließend noch den Server starten und im Browser die Seite besuchen.
	
	app.listen(4040);
	console.log('Pipter Server is running on Port 4040');
	console.log('http://localhost:4040');

Als erstes muss eine Liste mit allen Screenshots ausgegeben werden. Der Nutzer bekommt die Möglichkeit ein Bild als neu zu akzeptieren oder einen Test noch einmal laufen zu lassen. Dafür stellt Express drei API Calls zur Verfügung:

	app.get('/api/index', function(req, res) {
		//send all screenshots to browser
	});

	app.get('/api/refresh', function(req, res) {
		//rerun the given state
	});

	app.get('/api/accept', function(req, res) {
		//copy the current screenshot to reference folder
	});

Es ist eine gute Übung diese Funktionen zu implementieren, ansonsten gibt es am Ende des Artikels den Link zu meiner Implementierung.


### Pipter Frontend

Natürlich benutze ich auch für diese Anwendung Angular um eine Anwendung zu bauen. Hier die stark gekürzte HTML Struktur.

	<html ng-app="Pipter">
		<body ng-controller="main">
			<diff-view ng-repeat="image in references" image="image"></diff-view>
		</body>
	</html>

Um dem gerecht zu werden muss das Angular App zur Verfügung stehen.

	angular.module('Pipter', []);

Für eine effektive Kommunikation mit der API empfehle ich immer die Zugriff in einem Service zu kapseln.

	angular.module('Pipter').service('Pipter', function ($http, $q) {
		var my = {};
		var that = {};

		that.list = function () {
			var dfd = $q.defer();
			$http.get('api/index').then(function (response) {
				my.references = response.data;
				dfd.resolve(my.references);
			});
			return dfd.promise;
		};

		that.refresh = function(image) {
			var dfd = $q.defer();
			$http.get('api/refresh', { params: {image: image} }).then(function(response) {
				dfd.resolve(response.data);
			});
			return dfd.promise;
		};

		that.accept = function(image) {
			var dfd = $q.defer();
			$http.get('api/accept', { params: {image: image} }).then(function(response) {
				dfd.resolve(response.data);
			});
			return dfd.promise;
		};

		return that;
	});

Sehr simpel, über die Struktur mit `my` und `that` habe ich [hier](http://www.interaktionsdesigner.de/2012/ein-einfacher-einstieg-in-modulares-javascript-mit-requirejs/#ordentliche-module) schon einmal gesprochen - kann ich immer noch empfehlen.

Der `MainController` erfragt die komplette Liste vom Server.

	angular.module('Pipter').controller('main', function ($scope, Pipter) {
		Pipter.list().then(function (images) {
			$scope.references = images;
		});
	});

Ich weiß, inzwischen ist der `controller as` Syntax zu bevorzugen, aber für den ersten Aufschlag soll das genügen.

Die Liste von Bildern wird also vom Server abgerufen, an den Main Controller übergeben und der View itteriert über die Einträge.

Die Directive `diffView` stellt für jeden Eintrag das passende HTML zur Verfügung, lädt die Bilder und vergleicht sie miteinander. Dafür habe ich das [JS-ImageDiff](https://github.com/HumbleSoftware/js-imagediff) von HumbleSoftware benutzt. Funktioniert ausreichend.

Die Directive ist der umfangreichste Teil des Clients. Hier in stark gekürztem Umfang.

	angular.module('Pipter').directive('diffView', function ($q, $parse, $rootScope, Pipter) {

		var difference = function(a, b, c) {
			//compare two images and return true / false for qualitity
		};

		var loadImg = function($img) {
			//return a promise object and resolve it, if image is loaded
		};

		var compare = function($scope, $elem) {
			//compare two images inside the scope
			var imgs = [];
			imgs.push(loadImg($elem.find('.reference img')));
			imgs.push(loadImg($elem.find('.current img')));
			
			//wait until both images are laoded
			$q.all(imgs).then(function(images) {
				//check the difference and send to the scope
			});
		};


		return {
			restrict: 'E',
			templateUrl: 'diffview.html',
			link: function ($scope, elem, attrs) {
				//compare the two images
				
				//on refresh, use pitper service to take a new screenshot
				$scope.refresh = function() {
					Pipter.refresh(this.image).then(function(image) {
						//add timestamp to trick the browser cache
						$scope.image = image + '?'+ new Date().valueOf();
					});
				};

				//accept the current screenshot as new reference image
				$scope.accept = function() {
					Pipter.accept(this.image).then(function(image) {
						//inform the scope about the changes
					});
				};
			}
		};
	});


## Fertig!

Jetzt noch ein paar Zeilen HTML und etwas CSS drüber und fertig ist die Alpha 0.01 Version vom Pipter!

Meine komplette Implementierung ohne Kürzungen findet sich auf Github [lunow/pipter](https://github.com/lunow/pipter).


## Nächste Schritte

Dieser erste Aufschlag ist interessant um die Struktur der verschiedenen Tools zu verstehen, zu sehen wie schnell ein erster Prototyp gebaut werden kann und vorallem um zu sehen ob es irgendjemanden im Team oder in der restlichen Welt interessiert.

Sollte das der Fall sein muss natürlich einiges erweitert werden. Die Einstellungen sollten konfigurierbar sein, die Kernfunktionen müssen mit Tests abgedeckt werden, die Dokumentation muss verbessert werden, die Geschwindigkeit optimiert und der Client weiter ausgebaut werden.

Aber dafür muss es sich erstmal in diesem Stadium beweisen. Viel Spaß beim rumprobieren.


## Itterativ arbeiten

Gefällt Dir diese Technologie und der Ansatz? Dann lass uns [zusammen arbeiten](http://nepos.io/jobs/).














