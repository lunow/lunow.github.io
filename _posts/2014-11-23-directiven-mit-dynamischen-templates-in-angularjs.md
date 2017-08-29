---

layout: post
title: "Directiven mit dynamischen Templates in AngularJS"
abstract: "Wie kann man die Darstellung dynamisch steuern und trotzdem die Magie und Effektivität von AngularJS nutzen? Ganz einfach mit AngularJS Boardmitteln."
categories: AngularJS
background: maul

---
{% raw %}


## Die Aufgabe

In meinem aktuellen Projekt, einer großartigen, riesigen Single Page Application, stellte sich die Frage wie dynamischer Inhalt angezeigt werden könnt. Vom Redakteur mehrsprachig gepflegt, von verschiedenen Systemen erweitert und von einer API entsprechend ausgeliefert.

Einen fertigen HTML String darzustellen kommt nicht in Frage. Backend und Frontend dürfen nur Inhalte austauschen. Keine Informationen zur Darstellung oder Strukturierung von Inhalt. Sämtliches HTML und CSS muss im Frontend generiert und verwaltet werden.


## Die Lösung

Die Lösung ist zum Glück schmal und effektiv. Wir haben eine Datenstruktur festgelegt aus der jedes Element besteht:

	$scope.content = {
		type: 'text',
		data: {
			content: 'Hallo Welt'
		}
	};

Und eine AngularJS Directive zur Darstellung einzelner Elemente:

	<content-element element="content"></content-element>

Die Direktive rendert die übergebenen Daten.


## Ein großes HTML Template

Die nahliegende Lösung ist eine `switch` Anweisung im HTML Template:

	<div ng-switch="type">
		<!-- layout for text display -->
		<div ng-switch-when="text">
			<p>{{content}}</p>
		</div>

		<!-- layout for images -->
		<div ng-switch-when="image">
			<img ng-src="{{src}}">
		</div>
	</div>

Für einen Inhaltstyp kein Problem. Zwei kriegt man auch noch unter, aber irgendwann wird es nervig, besonders wenn einzelne Inhaltstypen anfangen eigene Logik mitzubringen.

Das muss besser gehen. Geht es zum Glück auch.


## Dynamisch geladene Templates

Ziel ist es für jeden Inhaltstyp ein eigenes HTML Template bereit zu stellen und von Angular kompilieren und darstellen zu lassen. Als erstes wird ein minimales HTML Gerüst definiert.

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.27/angular.min.js"></script>
	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>

	<div ng-app="cms" ng-controller="ctrl">
		<content-element element="content"></content-element>
	</div>

Von den großen Content Delivery Netzwerken wird eine aktuelle AngularJS und die neue jQuery Version eingebunden.

Eine Demo Applikation Namens `cms` muss vorhanden sein und den Controller `ctrl` bereitstellen. Nicht vergessen jQuery vor Angular zu laden, damit letzterer schon intern damit arbeitet.	

	angular.module('cms', []);

	angular.module('cms').controller('ctrl', function($scope) {
		$scope.content = {
			type: 'text',
			data: {
				content: 'Hallo Welt'
			}
		};
	});

Hier passiert soweit nichts aufregendes, die Variable `content` wird dem Scope bereit gestellt damit unsere neue Directive das passende Template laden kann.

Die ist schon interessanter.

	angular.module('cms').directive('contentElement', function() {
		return {
			restrict: 'E',
			link: function($scope, elem, attrs) {
				var $elem = $(elem);
				$scope.$watch(attrs.element, function(now) {
					if(now) {
						render($elem, now);
					}
				});
			}
		};
	});

Mit `restrict: 'E'` wird bestimmt das diese Directive nur als HTML Element benutzt werden darf. Die `link()` Funktion wird aufgerufen sobald der Angular Compiler das entsprechende Element im DOM Tree findet. 

Im Attribut `element` wurde im HTML der Variablenname angegeben der das Objekt enthält welches den Inhalt beschreibt. Anstatt es einfach auszulesen, oder noch schlimmer, direkt aus dem Scope zu lesen, wird hier eine `$watch()` Funktion auf den Variablennamen gelegt. Sobald sich der Inhalt ändert wird der Callback aufgerufen.

Man darf nicht vergessen das Angular eine ganze Reihe Watch-Zyklen durchläuft. Wenn sich eine Variable ändert muss Angular versuchen herauszufinden ob sich dadurch etwas anderes geändert hat. Die Details davon bleiben uns zum Glück erspart, wir müssen nur überprüfen ob der Parameter `now` überhaupt irgendetwas enthält, denn im ersten Durchlauf wird der Callback mit dem Wert `undefined` aufgerufen.

Ist `now` gesetzt wird eine `render()` Funktion aufgerufen. Hier fängt jetzt langsam die Magie an!

	angular.module('cms').directive('contentElement', function($http) {

		var render = function($elem, data) {
			$http.get('template-'+data.type+'.html').then(function(response) {
				$elem.html(response.data);
			}, function() {
				console.error('template', data.type, 'not found.');
			});
		};

		//...

Okay, Mittel-Magisch. Über den Angular Ajax Service `$http` wird anhand des übergebenen Types eine HTML Datei geladen. In diesem Beispiel die Datei `template-text.html`.

Alle Netzwerkfunktionen von AngularJS geben ein Promise Objekt zurück - das verspricht irgendwann etwas zu tun, entweder erfolgreich oder fehlerhaft. Wir können darauf reagieren in dem über `then()` entsprechende Callbacks registriert werden.

	PromiseObject.then(successfull, failed);

Im Beispiel wird also der Inhalt der Netzwerkanfrage `response.data` als HTML in das entsprechende Element 
geladen. 

Kleiner Tip am Rande: Benennt die anonymen Callbackfunktionen! Neben der Tatsache das der Code wesentlich lesbarer wird, gibt die Fehlerkonsole den Namen aus, anstatt endlose `error in anonymous function line:2`.

	$http.get('template-'+data.type+'.html').then(
		function templateLoaded(response) {
			$elem.html(response.data);
		}, 
		function templateNotFound() {
			console.error('template', data.type, 'not found.');
		}
	);

Das Template sieht so aus:

	<p>{{content}}</p>

Und nach dem alles ordentlich zusammen gebaut ist, sieht man genau diese Ausgabe im Browserfenster:

	{{content}}

Es hat zwar alles funktioniert, aber der HTML Code wurde nicht compiliert.


## Templates zur Laufzeit compilieren

Als erstes muss ein neuer Scope erschaffen werden. Das kann zum Glück aus jedem vorhandenen Scope geschehen.

	var elementScope = $scope.$new(true);
	angular.forEach(data.data, function(value, key) {
		elementScope[key] = value;
	});

Das `true` erzeugt einen isolierten Scope damit das neu eingebundene Template nicht ausversehen Elternelemente liest oder schreibt.

Mit `angular.forEach` wird durch jede Eigenschaft des Objekts `data` itteriert und dem neuen Scope bekannt gemacht.

Mit dem Service `$compile` wird ein HTML String zu einem Teil der Angular Anwendung. Der Service erwartet HTML Code und gibt eine Template Funktion zurück die mit einem Scope aufgerufen wird.

	$compile($elem.contents())(elementScope);

Der oben erzeugte Scope wird mit dem noch weiter oben geladenen Template verlinkt. Insgesamt sieht die Direktive damit dann so aus:

	angular.module('cms').directive('contentElement', function($http, $compile) {
		var render = function($elem, $scope, data) {
			var elementScope = $scope.$new(true);
			angular.forEach(data.data, function(value, key) {
				elementScope[key] = value;
			});

			$http.get('template-'+data.type+'.html').then(function(response) {
				$elem.html(response.data);
				$compile($elem.contents())(elementScope);
			}, function() {
				console.error('template', data.type, 'not found.');
			});
		};

		return {
			restrict: 'E',
			scope: true,
			link: function($scope, elem, attrs) {
				var $elem = $(elem);
				$scope.$watch(attrs.element, function(now) {
					if(now) {
						render($elem, $scope, now);
					}
				});
			}
		}
	});

Und nach eine Reload begrüßt uns ein wunderbares **Hallo Welt** im Browser. Funktioniert nicht ganz so gut? [Hier als Beispiel anschauen](http://www.interaktionsdesigner.de/demo/angularjs-dynamic-directives.html).

Sieht nach viel Aufwand aus für zwei Sätze, aber etwas weitergedacht eröffnet uns dieser Ansatz eine extrem flexible und einfach zu erweitertende Inhaltsstruktur. Das wunderschöne daran: Die geladenen Templates können ihrerseits wieder Directiven ansprechen.


## Die Verschachtelung

Plötzlich kommt die Anforderung Artikel abzubilden. Woraus besteht ein Artikel? Keine Ahnung, das ist noch nicht definiert, muss aber Morgen fertig sein! 

Panik? Nein. Ein Artikel hat eine Überschrift und beliebige weitere Inhaltselemente. Die Struktur sieht so aus:

	$scope.article = {
		type: 'article',
		data: {
			headline: 'Hallo Welt',
			content: [
				{
					type: 'text',
					data: {
						content: 'Wie geht es Dir?'
					}
				},
				{
					type: 'text',
					data: {
						content: 'Mir geht es gut.'
					}
				}
			]
		}
	};

Wer jetzt fürchtet wieder tief in den Javascript Code eintauchen zu müssen kann sich freuen, oder ärgern, denn in dem ein neues Template angelegt wird ist die ganze Arbeit schon getan. Undzwar für das Inhaltselement Text 
und für alle die da noch kommen mögen.

Und hatte ich erwähnt das wir nur vier Zeilen Code hinzufügen müssen?

	<div class="article">
		<h1>{{headline}}</h1>
		<content-element ng-repeat="element in content" element="element"></content-element>
	</div>

Das großartige `ng-repeat` itteriert über alle Elemente im `Content Array` und erstellt für jedes eine neue Directive `content-element`. Diese lädt das gewünschte Template nach, und so weiter und so fort.


## Fazit

Neue Inhaltselemente hinzuzufügen wird zum Kinderspiel. Und zwar mit beliebiger Komplexität. Slider und Tabs lassen sich so mit reinem HTML Code umsetzen. Erfordert ein Element etwas mehr Logik legt man dafür einfach eine weitere Directive an.

Die lässt sich einzeln testen und verwenden und ist trotzdem perfekt eingebunden.

Das Styling der Elemente lässt sich wunderbar erledigen denn der Entwickler hat den HTML Code unter voller Kontrolle. 

Unter Ausnutzung des [Angular Caches](https://docs.angularjs.org/api/ng/service/$templateCache) entsteht für den Nutzer keine Wartezeit und Google arbeitet auf Hochtouren daran auch mit Javascript erzeugte Inhalte in ihren Suchindex aufzunehmen.

Klingt für mich nach Zukunft. Oder nach einem total coolen AngularJS CMS. Denn wenn man so einfach Inhalte darstellt, lässt sich genau so einfach der Inhalt bearbeiten!

Viel Spaß beim Inhaltsseiten anlegen und weiter denken.

{% endraw %}