---

layout: post
title: "jQuery Plugins und AngularJs"
abstract: 'Auch wenn man eine smarte WebApp mit AngularJS aufbaut, möchte man nicht auf den reichen Funktionsumfang und die tollen Plugins von jQuery verzichten. Muss man zum Glück auch nicht, da die beiden Frameworks großartig zusammenarbeiten.

Gewusst wie.
'
categories: jQuery, AngularJS
background: venus

---




## jQuery

AngluarJS bringt [jQLite](https://code.google.com/p/jqlite/) mit, eine abgespeckte Version von jQuery. Um den vollen Funktionsumfang zu nutzen macht es Sinn diese mit der aktuellen jQuery Version zu ersetzen. Das geht einfach in dem man **jQuery vor AngularJS** einbindet!

	<script src="components/jquery/jquery.min.js"></script>
	<script src="components/angular/angular.min.js"></script>

AngularJS prüft bei der Initialisierung ob ein jQuery Objekt vorhanden ist. Ist dies der Fall wird jenes genutzt anstatt der internen jQLite Version.


## Die Applikation

Da kein Javascript Entwickler den globalen Namensraum des Browsers verschmutzen will, lebt jedes Angular Projekt in einer eigenen Variable. Am liebsten im guten, alten `App`.

	var App = angular.module('helloworld', []);

Man achte auf das leere Array als zweiten Parameter! Hier werden Abhängigkeiten definiert, das Array muss allerdings vorhanden sein, auch wenn noch keine Abhängigkeiten bestehen.

Und natürlich nicht vergessen das angelegte App im HTML Dom Tree anzugeben, damit AngularJS weiß, um welchen Bereich der Seite es sich kümmern soll.

	<html ng-app="helloworld">


## View und Controller

Man kann jedes beliebige jQuery Plugin nutzen. Der häufigste Fehler besteht darin in einem AngularJS Controller auf die Idee zu kommen auf den DOM Tree zuzugreifen.

Verboten! Total verboten, denn Controller sind nur dazu gedacht den initialen Zustand des `$scope` zu setzen und diesem Funktionalität hinzuzufügen.

Nehmen wir ein kleines Beispiel zur Eingabe des Geburtstdatums.

	<div ng-controller="date">
		<label for="input">Bitte geben Sie Ihr Geburtsdatum ein</label>
		<input id="input" type="text" ng-model="date">

		<input type="button" value="OK" ng-click="save()">
	</div>

Im Controller wird der initiale Zustand definiert und die Funktionalität verknüpft.

	App.controller('date', function($scope, API, moment) {
		$scope.date = moment().subtract(20, 'years').format('DD.MM.YYYY');
		$scope.save = function() {
			API.set('user.birthdate', $scope.date);
		};
	});

Soweit so gut, aber welcher Usabilityexperte setzt seinen Nutzer schon vor ein normales Eingabefeld um ein Datum einzugeben? 


## Das Plugin

Genau, ein Datepicker muss her. Derzeit am schönsten ist [pickadate](http://amsul.ca/pickadate.js/). Es lässt sich direkt auf ein HTML Input Feld anwenden und fertig.

	$('#input').pickadate();

Die Versuchung ist groß, diese Zeile im Controller zu platzieren und den Punkt von der Todo Liste zu streichen.

Aber dadurch verliert man die Unabhängigkeit zwischen View und Controller. Denn aufeinmal muss das Feld immer `#input` heißen, sonst bricht der ganze Code zusammen. 

Außerdem wiederholt man sich, sobald ein zweiter Datepicker im Projekt eingebunden werden soll.

Und der Controller lässt sich nicht mehr testen, ohne das man auch jQuery und pickadate einbindet. Keine schöne Grundlage für ein erfolgreiches WebApp.

Zum Glück ist die Lösung einfach.


## Die Directive

[Das Konzept Directive](http://www.interaktionsdesigner.de/2013/07/24/das-zusammenspiel-von-directives-services-und-templates-in-angularjs/) habe ich im Blog schon erläutert, deshalb sei hier das Ergebnis präsentiert:

	App.directive('uiDatepicker', function() {
		return function($scope, elem, attrs) {
			$(elem).pickadate();
		};
	});

Im HTML wird die Directive dem Eingabefeld zugewiesen.

	<input id="input" type="text" ui-datepicker>

Per `debugger` kann man über den `$scope` und die `attrs` noch diverse Informationen heraus finden und die Initalisierung dementsprechend verfeinern.

Was aber damit deutlich werden soll ist die schöne Trennung zwischen dem Verhalten (Controller), der Darstellung (View) und den verwendeten Plugins (Directive).

Soll pickadate ausgetauscht oder deaktiviert werden muss das nur in der einen zentralen Directive geschehen. Und wenn ein weiteres Eingabefeld ebenfalls einen Datepicker darstellen soll, dann muss nichts weiter passieren als das entsprechende Attribut zu setzen.

Besser noch: Das Frontend muss noch nicht einmal wissen welcher konkrete Datepicker genutzt werden soll.

Aber was wenn ein Datepicker Feld als zentrales Eingabefeld in der WebApp dient und der Datepicker von unterschiedlichen Controllern geöffnet werden muss?


## Die Kommunikation über Services

Hier kommt das nächste Grundkonzept von AngularJS zum tragen: **Services**. Damit lässt sich Logik über mehrere Bereiche der Applikation teilen.

Zum Beispiel ein Datepicker: `pickadate` stellt eine API bereit über die der Picker gesteuert werden kann. Diese soll in einem Service gespeichert werden.

	App.directive('uiDatepicker', function(DatePicker) {
		return function($scope, elem, attrs) {
			$(elem).pickadate();
			DatePicker.use($(elem).pickadate('picker'));
		};
	});

In der Definition wird der Service `DatePicker` als Abhängigkeit definiert. Beim Initialisieren wird die API dem Service zur Verfügung gestellt.

Im HTML könnte dann ein Aufruf so aussehen

	<div ng-controller="irgendwas">
		<input type="button" ng-click="changeDate()">
	</div>

Der entsprechende Controller muss die Funktion im `$scope` definieren.

	App.controller('irgendwas', function($scope, DatePicker) {
		$scope.changeDate = function() {
			DatePicker.request().then(function(date) {
				$scope.date = moment(date).format('DD.MM.YYYY');
				$scope.$apply();
			});
		};
	});

Das sieht schon sehr elegant aus. Der `DatePicker` Service kapselt die Funktion um mit dem konkreten Datepicker zu kommunizieren.

Hier ist ein Vorschlag wie der Service implementiert werden könnte.

	App.service('DatePicker', function(Deferred) {
		var picker = false;
		return {
			use: function(p) {
				picker = p;
			},
			request: function() {
				var dfd = Deferred();
				picker.clear().open().on('set', function(date) {
					dfd.resolve(date.select);
				});
				return dfd.promise();
			}
		};
	});

Der `Deferred` Service ist nichts weiter als die jQuery Deferred Funktion. Wiederum in einem Service gekapselt um auch diesen einfach austauschen zu können.

	App.service('Deferred', function() {
		return $.Deferred;
	});

Das wars. Niemand ist für immer mit irgendwem verbunden, alle sind frei, können einzelnd getestet und wieder verwendet werden.


## Fazit

Sicher gibt es noch eine ganze Reihe Verbesserungsvorschläge. Zum Beispiel sollte man einzelne Module für Directives und Services anlegen um diese einfacher wieder verwenden zu können. Außerdem müssen natürlich eine Reihe von Unit Tests her damit man sich auf die Funktionalität verlassen kann.

Aber ich denke es bietet einen schönen Einstieg und zeigt wie sauber AngularJS Applikationen aufgebaut werden können. Immer im Kampf gegen den Spaghetticode aus der Callback-Hölle!