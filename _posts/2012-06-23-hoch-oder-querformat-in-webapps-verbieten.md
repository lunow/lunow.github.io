---

layout: post
title: "Hoch- oder Querformat in WebApps verbieten"
abstract: 'In einer perfekten Welt würde sich jedes Interface an den verfügbaren Platz perfekt anpassen. Es würde auch niemand mit `$.browser` rausfinden welcher Browser benutzt wird, sondern mit Feature Detection die benötigte Funktion überprüfen. jQuery wird uns da in eine Richtung zwingen und den Support für die Funktion in jQuery 1.9 entfernen. Aber es gibt ja Plugins.
Und es gibt Entscheidungen die den geneigten Webentwickler zwingen seine WebApp nur für den Landscape Modus oder den Portrait Modus freizugeben. Zum Beispiel wegen knapper Zeitpläne oder unbedachten Designern, egal! Es gibt eine Lösung.

'
categories: jQuery, Javascript
redirect_from: "2012/06/23/hoch-oder-querformat-in-webapps-verbieten/"

---



## Das Problem

Ein Interface für eine neue Webapplikation soll nur im Querformat (Landscape Modus) benutzt werden. Im Gegensatz zu nativen Applikationen steht mit Javascript keine Möglichkeit zur Verfügung die geänderte Darstellung zu verhindern. Aber es gibt die globale Eigenschaft `window.orientation` mit der abgefragt werden kann wie das mobile Gerät gehalten wird.


## Das Event

Die Eigenschaft `window.orientation` steht nur in Umgebungen zur Verfügung die eine unterschiedliche Darstellung ermöglichen (also iPad, iPhone usw.). Wenn sich der Wert ändert, der Benutzer das Gerät dreht, wird das Event `orientationchange` gefeuert. Damit haben wir alle Informationen für den ersten Ansatz:

	$('body').bind('orientationchange', function(e) {
		alert("Ui, ich wurde gedreht!");
	});

Mit diesem Konstrukt wird mit Hilfe von jQuery ein Eventhandler an das Event `orientationchange` gebunden, welcher bei jeder Änderung eine Alert Box anzeigt. Einfach mal probieren.


## Die Lösung

Mit diesem Wissen ist die letztendliche Lösung kein Problem mehr. Wenn das Gerät in einer Lage gehalten wird, die nicht unterstützt wird, wird das Interface gesperrt.

	jQuery(function($) {
		$('body').bind('orientationchange', function(e) {
			check_orientation();
		});
		check_orientation();
	});
	
Ist das DOM bereit `jQuery(function($) { /* bereit */ })`, wird der Event gebunden und an die Funktion `check_orientation()` weitergeleitet. Damit auch beim ersten Aufruf der Seite (hier ändert sich nichts) die Ansicht geprüft wird, wird anschließend die Funktion einmal aufgerufen.

Die Funktion `check_orientation()` prüft also ob sie arbeiten muss, falls ja ob das Gerät "falsch" gehalten wird und ggf. gesperrt wird.

	var check_orientation = function() {
		if(typeof window.orientation == 'undefined') {
			//not a mobile 
			return true;
		}
		if(Math.abs(window.orientation) != 90) {
			//portrait mode
			$('#orr').fadeIn().bind('touchstart', function(e) {
				e.preventDefault();
			});
			return false;
		}
		else {
			//landscape mode
			$('#orr').fadeOut();
			return true;
		}
	};

Was passiert hier?

1. Wenn die Eigenschaft `window.orientation` nicht existiert, braucht die Funktion nicht zu arbeiten.
2. Mit `Math.abs(window.orientation)` wird 0 = Landscape Mode oder 90 = Portrait Mode zurück gegeben.
3. Wurde der Portrait Modus erkannt, wird der Container `div#orr` eingeblendet und das Event `touchstart` verhindert. Damit ist ein Zoomen oder Scrollen nicht mehr möglich.
4. Andernfalls im Querformat ist alles in Ordnung und der `div#orr` wird nicht mehr benötigt.

Sehr schön! Jetzt braucht man noch ein Container im HTML:

	<div id="orr">Bitte drehen Sie Ihr Gerät!</div>

Und ein paar Zeilen CSS:

	#orr {	
		display:none;
		position:fixed;
		width:100%;
		height:100%;
		left:0;
		top:0;
		background:rgba(0,0,0,0.75);
		z-index:1999;
	}
	
Mit der Hintergrundfarbe `rgba(0,0,0,0.75)` wird ein halbtransparenter Hintergrund dargestellt, der über dem kompletten Interface liegt.

## Fazit

Als verantwortungsvoller Entwickler plant man sein Projekte so, dass sie unabhängig von Auflösung und Verhältnis funktionieren. Zur Not bedient man sich diesen Tricks und verschiebt die Lösung in die 2.0 Version.

Viel Spaß!