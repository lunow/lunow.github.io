---

layout: post
title: "CSS: Level Zwei"
abstract: 'Alle kennen das gute, alte CSS. Endlose Zeilen voller Styles die in allen Browsern zu unterschiedlichen Resultaten führen. Dieser Artikel beschreibt nicht wie man dieses Problem in den Griff bekommt, sondern wie man heute mit CSS arbeitet.

Das Emmet Plugin zusammen mit dem Sass Compiler hebt die Arbeit mit CSS auf ein neues Level: Level Zwei!

'
categories: CSS, Sublime
redirect_from: "2013/05/13/css-level-zwei/"
background: wolken

---




## Sass

Sass und LESS sind zwei CSS Compiler. Das bedeutet man schreibt sein CSS wie gewohnt, aber gewürzt mit diversen Extras wie Variablen, Berechnungen und Funktionen. Bevor die Datei an den Browser ausgeliefert wird, wird der Dialekt in normales CSS umgewandelt.

Bei der Frage SASS oder LESS gehen die Meinungen wie immer auseinander. Da der große [Chris Coyier in seinem Artikel](http://css-tricks.com/sass-vs-less/) gut gerankt wird uns sich für Sass entschieden hat, folge ich seinem Vorschlag.


### Installation

Die Installation erfolgt über Ruby und ist auf der [offiziellen Seite](http://sass-lang.com/tutorial.html) ausführlich beschrieben.

Anschließend legt man eine `sass/style.scss` Datei an und startet den Sass Compiler über das Terminal:

	cd /path/to/css
	sass --watch sass:compiled
	
Ruby meldet daraufhin das es jetzt den kompletten Ordner `sass` überwacht und bei jeder Änderung eine kompilierte Datei im Ordner `compiled` ablegt.

Die bindet man wie gewohnt per HTML Tag ein.

	<link rel="stylesheet" href="css/compiled/style.css">
	
Damit öffnet sich das Tor zur wunderbaren Welt der **syntactically awesome style sheets**. Yeah!


### Die neuen Möglichkeiten

Ich will nicht die ganzen Beispiel der Sass Seite wiederholen. Nur ein paar Highlights und Tipps.

**1.** Füge immer einen Kommentar in deine `*.scss` Datei ein, die daran erinnert den Sass Compiler zu starten! Nichts ist frustrierender als wenn das Projekt plötzlich nicht mehr auf Änderungen am CSS reagiert.

Alternativ kann man natürlich auch ein grafisches Programm verwenden, aber ich bevorzuge das Terminal.


**2.** Sass erlaubt die Verschachtelung von Anweisungen. Damit gehören unendlich lange Selektoren der Vergangenheit an. Ich würde empfehlen streng darauf zu achten die Reihenfolge der SASS Styles genau dem HTML anzupassen um die Übersicht zu behalten.

	<div id="head">
		<a href="#">Home</a>
	</div>
	<div id="body">
		<a href="#">Welcome</a>
	</div>

Aus dieser HTML Struktur ergibt sich folgendes Stylesheet

	#head {
		a {
			color: blue;
		}
	}
	
	#body {
		a {
			color: red;
		}
	}
	
Damit sind alle Links im Kopfbereich blau und im Körper der Seite rot. Schön, oder?


**3.** Der gute, alte Vorsatz **DONT REPEAT YOURSELF** gilt selbstverständlich auch bei Sass. Und Sass bietet dafür eine tolle Funktion namens `Mixin`.

Mit deren Hilfe definiert man Anweisungsblöcke die wiederverwendet werden können. Zum Beispiel um alle Links mit einer anderen Schrift und einer Hintergrundfarbe zu versehen.

	@mixin link {
		background: silver;
		font-family: Verdana;
		font-size: 12px;
		color: white;
	}
	
	#head {
		a {
			@include link;
			color: blue;
		}
	}

Anweisungen im konkreten Selektor überschreiben dabei die Anweisungen aus dem Mixin, sofern sie danach definiert werden. Genau wie in CSS auch.


**4.** Sass erlaubt die Definition von Variablen. Das heißt nie wieder nachschauen wie ein verdammter Farbcode noch genau geschrieben wird. Oder ihn an 100 Orten ersetzen sobald dem Designer das Blau nicht blau genug ist.

	$blue: #34527e;
	
	#head {
		a {
			color: $blue;
			
			&:hover {
				color: lighten($blue, 20);
			}
		}
	}
	
In diesem Beispiel sind neben den Variablen noch zwei Dinge zu beachten: Mit dem `&` Zeichen legt man Subsets vom aktuellen Selektor an. In diesem Fall definiert man also den Mouseover Status.

	div {
		&.blue {
			color: $blue;
		}
	}

Mit diesem Selektor trifft man alle `Div` Container mit der Klasse `.blue`.

Die Funktionen `lighten()` und `darken()` verändern den übergebenen Farbwert prozentual. Sehr praktisch!

(Außerdem ist es wirklich lustig kurz vor der Deadline die Farbwerte zu ändern und hochzuladen - Designer und PMs werden ausrasten! Haha.)


Sass bietet natürlich noch einiges mehr. Ein Blick in den Blog lohnt sich auf alle Fälle. Mit den einfachen Funktionen kommt man aber schon sehr weit. Und mit dem folgenden Tool.


### Responsive Layouts mit Sass

Neben `lighten()` und `darken()` kann man natürlich auch eigene Funktionen definieren. Zum Beispiel um Elemente entsprechend der verfügbaren Bildschirmbreite zu stylen.

Dafür legt man die folgende Funktion in der `*.scss` Datei ab:

	@mixin respond-to($media) {
		@if $media == phone {
			@media only screen and (max-width: 480px) { @content; }
		}
		@else if $media == tablet {
			@media only screen and (max-width: 979px) { @content; }
		}
		@else if $media == desktop {
			@media only screen and (min-width: 980px) { @content; }
		}
		@else if $media == widescreen {
			@media only screen and (min-width: 1200px) { @content; }
		}
	}

Dieses grandiose Mixin erzeugt einen Mediaquery anhand des übergebenen Keywords. Die größen sind von Bootstrap entliehen.

	div.hide-on-phone {
		display: block;
		
		@include respond-to(phone) {
			display: none;
		}
	}
	
Ist das nicht herrlich? In meinen Augen wesentlich lesbarer und einfacher zu Merken als die elendigen Mediaqueries. Und wenn sich mit dem Nokia Lumina 928 mal wieder die Auflösung ändert, dann reagiert der geneigte Entwickler darauf mit der Anpassung eines einzigen zentralen Wertes.

Das Schlüsselwort `desktop` sollte nur in Ausnahmefällen definiert werden. Im letzten Projekt habe ich das als Standard Wert benutzt und mit den Mediaqueries entsprechend reagiert.

	h1 {
		font-size: 40px;
		
		@include respond-to(widescreen) {
			font-size: 60px;
		}
		
		@include respond-to(tablet) {
			font-size: 30px;
			text-align: center;
		}
		
		@include respond-to(phone) {
			display:none;
		}
	}
	
Damit spart man sich eine ganze Menge scrollen in Stylesheets bei umfangreichen Responsive Layouts.


### Aufruf

Fang jetzt damit an Sass oder LESS zu verwenden! Die Installation dauert nur ein paar Minuten und die Ergebnisse sind großartig!!

Anschließend diesen Artikel weiter lesen.


## Emmet

Über den besten Editor aller Zeiten habe ich schon geschrieben: [Sublime Text 2](http://www.interaktionsdesigner.de/2012/12/11/der-beste-editor-aller-zeiten-sublime-text-2/). **Emmet** ist eine Erweiterung dafür, die es in sich hat.

Die [offizielle Seite](http://emmet.io/) erläutert Installation und alle Möglichkeiten. Die Highlights beschreibe ich im folgenden.


### HTML

Es erleichtert die Arbeit mit HTML ungemein, in dem es die Eingabe von CSS Selektoren ermöglicht und mit einem Tastendruck die entsprechende HTML Struktur generiert.

	.blue>h1+p
	
wird nach dem Druck auf `Tab` zu

	<div class="blue">
		<h1></h1>
		<p></p>
	</div>

Es ist auch möglich direkt den Textinhalt zu hinterlegen:

	h1{Hello World}
	
wird zu

	<h1>Hello World</h1>
	
Außerdem unterstützt es Attribute:

	a[ng-click=hello()]
	--> 
	<a href="#" ng-click="hello()"></a>
	
Und Gruppierungen:

	(.head>h1)+(.body>h2)
	--> 
	<div class="head">
		<h1></h1>
	</div>
	<div class="body">
		<h2></h2>
	</div>

Wirklich ein grandioses Tool! Aber damit nicht genug.


### CSS

Emmet unterstützt auch beim Schreiben von CSS Anweisungen. Dabei nutzt man die Anfangsbuchstaben der Selektoren und Werte, drückt Tab und Emmet breitet die Anweisung aus.

Der Pfeil `->` steht im folgenden, wie oben, für Tab:

	ttc -> text-transform: uppercase
	dib -> display: block
	posa -> position: absolute
	l0 -> left: 0
	l30 -> left: 30px
	l25% -> left: 25%
	tac -> text-align: center

Sublime unterstützt ebenfalls mit Autovervollständigung und einem Popup das anzeigt welcher Selektor mit den Buchstaben gerade getroffen wird.

Hier verstecken sich noch wesentlich mehr Möglichkeiten die in erster Linie einfach zu merken sind.


## Fazit

Um die Erstellung von CSS Dateien auf das nächste Level zu heben ist nur die Installation von zwei Tools notwendig. Natürlich unterstützen Sass und Emmet noch viel mehr Funktionen als hier beschrieben, aber ich finde ein paar Highlights für den Einstieg genug.

Sobald man diese intuitiv und sicher beherrscht, sollte man ein Blick in die Doku, auf Twitter oder die Blogszene werfen um aus den Tools noch mehr Effektivität rauszuholen.

Also, bitte installieren und ein wunderschönes Frontend für die [nächste Killerapplikation](http://www.interaktionsdesigner.de/2013/04/28/die-killerapplikation-mit-node-js-socket-io-und-angularjs/) bauen.