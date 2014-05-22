---

layout: post
title: "Ein Einstieg in AngularJS"
abstract: 'Lange habe ich zugunsten von Backbone das Google Framework Angular nur halbherzig beobachtet und ausprobiert. Das Konzept den HTML Code mit eigenen Tags zu erweitern kam mir nicht besonders sauber vor. HTML dient schließlich zur Auszeichnung der Informationen und nicht zur Hinterlegung von Informationen.
Durch das zwanzigste Backbone Projekt in dem ich nachschauen musste wie der View per Render Methode sein HTML ausspuckt und wie zur Hölle ich beim letzten Projekt noch so grandios die Events verknüoft habe, fasste ich den Entschluss mich doch nocheinmal näher mit Angular auseinander zusetzen.

Und siehe da: Es ist grandios! Wahnsinn! Cool!

'
categories: Javascript, AngularJS
redirect_from: "2013/03/16/ein-einstieg-in-angularjs/"

---



## Einleitung

Eine große Einleitung zu AngularJS will ich hier nicht geben. Die Keyfeatures sind zu genüge im Netz verbreitet.

Der Grund für meine enthusiastische Einleitung liegt in dem `Two Way Data Binding`. Während Backbone per Hand mit dem entsprechenden HTML verbunden werden muss, erledigt das Angular voll automatisch.

Dieser Artikel soll eine erste, sehr kleine Einleitung in den Angular `Scope` geben. Der Namensraum der für die Magie verantwortlich ist.

Da wir alle schon etliche Todolisten mit etlichen Frameworks entwickelt haben, werde ich mir das hier sparen. Arbeiten wir mit einer Liste von Kommentaren.


## Installation

Die Installation ist wirklich sehr einfach. Als erstes stellt man sich ein schönes HTML5 Grundgerüst zusammen und inkludiert die aktuelle Angular Version vom Google CDN:

	<!DOCTYPE html>
	<html lang="de">
		<head>
			<meta charset="utf-8">
			<title>AngularJS</title>
		</head>
		<body>
			
			<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
			<script src="app.js"></script>
		</body>
	</html>
Dazu legt man eine app.js Datei an, in die im ersten Schritt die komplette Angular Applikation definiert wird. Das wars!


## Mein erster $scope

Angular nutzt Controller um ein Script mit einem Teil oder der gesamten HTML Struktur zu verknüpfen. Um die App und die einzelnen Controller im Griff zu behalten erstellt man einen globalen Namespace für die Applikation in der `app.js`:

	var App = {};
	
Jetzt kann der erste Controller definiert werden. Das klingt aufregender als es in Wirklichkeit, oder sagen wir besser im Moment, ist:

	App.comments = function($scope) {
		$scope.comments = [
			{
				name: 'peter',
				text: 'Hallo Leute.',
				approved: 1
			},
			{
				name: 'marie',
				text: 'Hey Peter, wie gehts?',
				approved: 1			
			}
		];
		$scope.count = $scope.comments.length;
	};
	
Der Controller bekommt von Angular einen Parameter `$scope` übergeben über den er mit einem Teil der HTML Struktur kommuniziert. Und genau dieser muss in der HTML Struktur erzeugt werden.

Damit Angular weiß das es loslegen muss, braucht man das `ng-app` Attribut im HTML Tag. 

	<html ng-app>

Hintergrund ist der, dass eine HTML Seite auch aus mehreren Apps bestehen kann. In unserem Fall aber nicht. Wir wollen nur eine Liste mit Kommentaren:

	<div class="comments" ng-controller="App.comments">
		<h1>{{ comments.length }} Kommentare</h1>
	</div>
	
`app.js` und `index.html` speichern, Seite neuladen und schon begrüßt uns der Browser mit "2 Kommentare". Das war einfach.

Durch die Angabe `ng-controller="App.comments"` verknüpft Angular die HTML Struktur mit der entsprechenden Javascript Funktion. Alles was im `$scope` definiert wird, steht in der HTML Struktur zur Verfügung.


## Ausgabe einer Liste

Einen Scope manuell zu erzeugen ist leicht, Angular macht es aber auch automatisch und da wird es spannend. Die Ausgabe der Liste wird realisiert ohne eine einzige Zeile im Javascript zu ändern:

	<div class="comments" ng-controller="App.comments">
		<h1>{{ comments.length }} Kommentare</h1>
		<ul ng-repeat="comment in comments">
			<li class="comment">
				<strong>{{comment.name}}:</strong>
				<span>{{comment.text}}</span>
			</li>
		</ul>
	</div>

Die magische Funktion `ng-repeat` geht jedes Array oder Objekt durch und gibt alle Kindelemente jeweiles einmal aus.

Außerdem hat jeder einzelne Kommentar durch die Verwendung von `ng-repeat` einen eigenen Scope bekommen. Das wird spannend, wenn die Liste für den Administrator interaktiv gestaltet werden soll.

Zum testen gibt es noch einen Kommentar der nicht freigegeben wurde:

	$scope.comments = [
		{
			name: 'peter',
			text: 'Hallo Leute.',
			approved: true
		},
		{
			name: 'marie',
			text: 'Hey Peter, wie gehts?',
			approved: true
		},
		{
			name: 'rüpel',
			text: 'Ihr Schwachköpfe, ihr!',
			approved: false
		}
	];

Natürlich zeigt die Überschrift sofort die richtige Anzahl an Kommentaren an. Damit die Kommentare unterscheidbar werden gibt es noch etwas CSS:

	<style>
		.comment {
			color:silver;
		}
		.comment.approved {
			color:black;
		}
	</style>
	
Damit sind alle Kommentare grau. Angular bietet mit `ng-class` zum Glück eine sehr praktische Funktion um Klassen anhand von Eigenschaften zu vergeben. Dazu wird das `<li>` Tag wie folgt ersetzt:

	<li class="comment" ng-class="{approved: comment.approved}">
	
Sobald `comment.approved` einen positiven Wert zurück gibt, erhält das Element die Klasse. Damit sind alle Grundlagen gelegt.



## Kommunikation mit dem Scope

Folgende Anforderung: Wenn ein Kommentar nicht freigegeben ist (`approved = false`) soll ein Link angezeigt werden. Mit einem Klick auf den Link soll der Kommentar freigeschaltet werden.

Klingt nicht schwer, ein paar Zeilen, ein Klick Event, kriegt man schon alles hin. Mit AngularJS kriegt man es in vier Zeilen hin:

Als erstes wird der Link eingefügt:

	<a href="#" ng-click="approve()" ng-show="!comment.approved">approve</a>

Bei Klick soll die Funktion `approve()` aufgerufen werden. Mit `ng-show` versteckt man das HTML Element, sofern die übergebene Bedingung nicht wahr ist, sprich der Kommentar nicht freigegeben ist.

Im Controller `App.comments()` muss jetzt noch die Funktion definiert werden. Diese wird ebenfalls im `$scope` definiert und steht damit automatisch im Template zur Verfügung:

	$scope.approve = function() {
	};

Das schöne und wirklich grandiose ist, dass durch die automatische Definition eines Scops für jeden Kommentar, dieser in der Funktion zur Verfügung steht.

	$scope.approve = function() {
		console.log(this.comment);
	};

Damit wird mit einem Klick der Kommentar ausgegeben der gerade freigeschaltet werden soll.

Und durch das `Two Way Data Binding` muss nur eine einzige Zeile hinzugefügt werden, und der Kommentar ist freigeschaltet:

	$scope.approve = function() {
		this.comment.approved = true;
	};

Das wars! Ein Klick auf den `approve` Link und der Kommentar ist freigegeben!

Genau so einfach ist auch das löschen eines Kommentars:

	<a href="#" ng-click="drop()">delete</a>

Die `drop()` Funktion muss nichts weiter tun als den angeklickten Kommentar aus dem Array zu entfernen:

	$scope.drop = function() {
		this.comments.splice(this.comments.indexOf(this.comment), 1);
	};

Und logischer Weise ist das hinzufügen eines neuen Kommentars genau so einfach. Zauberwort ist an der Stelle das `ng-model` mit dessen Hilfe ein Eingabefeld innerhalb des Scopes bekannt gemacht wird.

Das Formular sieht so aus:

	<form>
		<label for="name">Name:</label>
		<input type="text" id="name" ng-model="name" />
		<label for="text">Comment:</label>
		<input type="text" id="text" ng-model="text" />
		<input type="submit" value="Submit Comment" ng-click="submit()" />
	</form>

Soweit nichts außergewöhnliches. Besonders schön wird es im Controller. Hier muss die Funktion `submit()` implementiert werden. Sie muss die Werte aus den Formularfeldern auslesen, ein neues Kommentar Objekt damit erzeugen, an die Liste der Kommentare anhängen und die Liste erneut anzeigen. Wobei der neue Kommentar natürlich noch nicht freigegeben sein darf.

Klingt anstrengend? Kaum. Sind doch auch nur drei Zeilen Javascript Code:

	$scope.submit = function() {
		this.comments.push({ name: this.name, text: this.text, approved: false });
	};

Alle oben genannten Anforderungen werden damit erfüllt. Der neue Kommentar kann direkt mit der oben entwickelten Funktion freigeschaltet werden.

Nagut, es wäre nett wenn die Formularfelder nach dem Speichern geleert werden. Da müssen wir wohl noch zwei Zeilen hinzufügen:

	this.name = '';
	this.text = '';
	

## Fazit

Das kratzt minimal an der Oberlfäche von dem was mit AngularJS möglich ist. Aber es zeigt das das Framework auf äußerst elegante Art und Weise einem die lästigen Aufgaben abnimmt.

Genau so leicht lassen sich Templates nachladen, Widgets einbinden und die URL verwalten sowie darauf reagieren.

Ein guter Einstieg ist das AngularJS Tutorial, das alle wichtigen Schritte erklärt: [http://docs.angularjs.org/tutorial](http://docs.angularjs.org/tutorial).

Meine nächsten Projekte werde ich mit diesem Framework angehen und hoffe das damit der eine oder andere Blogeintrag abfällt. Über Fragen und noch mehr über Verbesserungsvorschläge freue ich mich!


## Alles in allem

Die oben entwickelte "Applikation" in ihrer ganzen Schönheit.

`index.html`

	<!DOCTYPE html>
	<html lang="de" ng-app>
		<head>
			<meta charset="utf-8">
			<title>AngularJS</title>
		<style>
			.comment {
				color:silver;
			}
			.comment.approved {
				color:black;
			}
		</style>
		</head>
		<body>

		<div class="comments" ng-controller="App.comments">
			<h1>{{ comments.length }} Kommentare</h1>
			<ul ng-repeat="comment in comments">
				<li class="comment" ng-class="{approved: comment.approved}">
					<strong>{{comment.name}}:</strong>
					<span>{{comment.text}}</span>
					<a href="#" ng-click="approve()" ng-show="!comment.approved">approve</a>
					<a href="#" ng-click="drop()">delete</a>
				</li>
			</ul>
		<form>
			<label for="name">Name:</label>
			<input type="text" id="name" ng-model="name" />
			<label for="text">Comment:</label>
			<input type="text" id="text" ng-model="text" />
			<input type="submit" value="Submit Comment" ng-click="submit()" />
		</form>
		</div>
			
			<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
			<script src="app.js"></script>
		</body>
	</html>
	
`app.js`

	var App = {};

	App.comments = function($scope) {
		$scope.comments = [
			{
				name: 'peter',
				text: 'Hallo Leute.',
				approved: true
			},
			{
				name: 'marie',
				text: 'Hey Peter, wie gehts?',
				approved: true
			},
			{
				name: 'rüpel',
				text: 'Ihr Schwachköpfe, ihr!',
				approved: false
			}
		];

		$scope.approve = function() {
			this.comment.approved = true;
		};

		$scope.drop = function() {
			this.comments.splice(this.comments.indexOf(this.comment), 1);
		};

		$scope.submit = function() {
			this.comments.push({
				name: this.name,
				text: this.text,
				approved: false
			});
			this.name = '';
			this.text = '';
		};
	};