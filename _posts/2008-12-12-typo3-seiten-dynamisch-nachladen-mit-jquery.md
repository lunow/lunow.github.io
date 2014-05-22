---

layout: post
title: "TYPO3 Seiten dynamisch nachladen mit jQuery"
abstract: 'Jetzt kommt ein herrlicher Ajaxeffekt: Beim Klick auf einen Menüpunkt wird der Inhalt sanft ausgeblendet, die aufzurufende Seite wird asynchron vom Server geladen und dem User sanft wieder eingeblendet.
Herrlich, oder? Das ist alles kein Problem mit **TYPO3** und **jQuery**. Undzwar mit Hausmitteln, ohne ein einziges Plugin. Eine Demo gibt es auf meiner privaten Seite unter [Paul-Lunow.de](http://www.paul-lunow.de "Lunow"), die ausführliche Anleitung hier im Blog.'
categories: jQuery, Tutorial, TYPO3
redirect_from: "2008/12/12/typo3-seiten-dynamisch-nachladen-mit-jquery/"

---

## TYPO3 vorbereiten
In dem Beitrag zum [automatischen Infofenster für TYPO3](http://www.interaktionsdesigner.de/2008/10/30/ein-automatisches-infofenster-mit-typo3-und-jquery/) bin ich schon auf die Technik eingegangen: Wir erstellen einen neuen Seitentyp mit Typoscript um nur die Inhalte bei einem Aufruf zu bekommen.

    nurinhalt = PAGE
    nurinhalt {
      typeNum = 101
    }

Die neue Seite heißt **nurinhalt** und bekommt die Nummer **101** zugewiesen. Man achte allerdings darauf keine doppelten Nummern zu vergeben!

    nurinhalt.10 < page.10

Mit dieser Anweisung wird der Inhalt von der normalen Seite in das neue Objekt kopiert.

    nurinhalt.10.template.file = fileadmin/template/index-nurinhalt.html

Jetzt weisen wir der Seite ein neues Template zu. Hier kann man noch ein bisschen rumspielen und einige Extrasachen machen wenn man möchte, ist ein ganz normales Template.
In meiner Version besteht es nur aus einer Zeile:

    ###INHALT###

Mehr als den Inhalt will ich nicht haben.
Nach dem das Typoscript gespeichert, das neue Template erstellt und der Cache gelöscht ist, sollte man die Ausgabe einmal testen: _www.meine-typo3.de/praesenz/index.php?type=101_. Funktioniert? Gut.
Allerdings gibts noch eine Kleinigkeit: Die Seite kommt im kompletten HTML Gerüst daher. Zum Glück können wir das unterbinden:

    nurinhalt.config {
       #entfernt diverse header angaben
       disableAllHeaderCode = 1 
    
       #standard doctype deaktivieren
       disableCharsetHeader = 1
    
       #entfern die HTML Kommentare
       disablePrefixComment = 1
    }

## JavaScript vorbereiten
Zurück zum "richtigen" Frontend. jQuery muss eingebunden werden und ich empfehle eine Datei Namens **actions.js**, für unser zu erstellendes Script. Das geschieht wieder im Standardseitentyp (bei mir stets _page_).

    $(document).ready(function() {
    	alert("Hallo!");
    });

Seite neuladen und wenn wir mit einem (fröhlichen) _Hallo!_ begrüßt werden, hats funktioniert und wir ersetzen das **Alert** durch unser Script.
Im ersten Schritt muss der Klick auf ein Menüpunkt abgefangen werden und verhindert das die neue Seite geladen wird:

    $("#menu a").click(function() {
      url = $(this).attr("href");
      alert("Geklickt auf "+url);
      return false;
    });

Drei Dinge passieren bei einem Klick auf einen Link im Objekt, welches die ID _menu_ hat:
Der Variable **url** wird das Attribut **href** aus dem Link zugewiesen, zur späteren Verwendung (z.B. _index.php?id=123_).
Mit **alert** wird überprüft ob es funktioniert hat.
**return false;** verhindert das der Browser die Seite lädt. Funktionierts?
Gut! Dann laden wir den Inhalt vom Server. Dafür wird eine neue Funktion erstellt, welche eine URL erwartet und diese lädt.

    $(document).ready(function() {
    	//Zeug von oben...
    });
    
    function getContent(url) {
    	//Hier kommt der Ajaxaufruf
    }

Die neue Funktion _getContent()_ ersetzt die Alertanweisung aus dem vorherigen Schritt. Der vollständige Aufruf sieht dann so aus:

    $(document).ready(function() {
      $("#menu a").click(function() {
        url = $(this).attr("href");
        getContent(url);
        return false;
      });
    });

Dann mal **Ajax**. Ist genauso einfach:

    $.ajax({
    	//erweitere aufzurufenden Link
    	url: url+"&type=101",
    	dataType: "html",
    	//wenn es geklappt hat
    	success: function(html) {
    		//Inhalt reinschreiben und anzeigen
    		$("#content")
    			.css("display", "none")
    			.html(html)
    			.fadeIn();
    	}
    });

Das sieht doch schon wieder etwas professioneller aus. Der übergebenen **url** wird ein _&type=101_ angehängt um aus TYPO3 nur den Inhalt herauszuholen. Mit der Eigenschaft **dataType** zeigen wir an, dass eine HTML Seite als Rückgabewert erwartet wird.
Wenn das geklappt hat wird das Element mit der ID _content_ ausgewählt. Dann folgt die geniale Verkettung von Funktionen:
- Das Element wird **versteckt** (würde auch mit hide() funktionieren)
- Das Element kriegt einen **neuen Inhalt** (den gerade geladenen)
- Und wird **eingeblendet**!
**Fertig!** Was für ein Erlebnis für den Benutzer. Und ohne JavaScript bleibt die Seite wie gewohnt nutzbar.
_Ähmmm... nicht so ganz?_ Dann auf zur Fehlersuche: Der wichtigste Ansatzpunkt ist natürlich [Firebug](http://www.interaktionsdesigner.de/2008/09/08/nichts-geht-mehr-ohne-firebug/). Man aktiviert die Konsole und kann sich alle asynchronen Datenbewegungen ansehen. Vielleicht wird eine nicht vorhandene URL aufgerufen, oder der Server versteht die Anfrage nicht. Dann muss man seine Ajaxabfrage verbessern. Mehr Informationen dazu liefert die [offizielle jQuery Seite](http://docs.jquery.com/Ajax) (und noch dutzend [andere](http://www.google.de/search?hl=de&q=jquery+ajax)).

## Verbesserung 1: Sanftes Ausblenden
Damit der alte Inhalt nicht einfach verschwindet, benutzen wir eine Callback Funktion von jQuery: _ajaxStart_.

    $("#content").ajaxStart(function() {
    	$(this).fadeOut(function() {
    		$(this).addClass("loading");
    	});
    });

Diese Funktion wird aufgerufen wenn eine Ajaxabfrage gestartet wird, blendet den Inhalt aus und fügt die Klasse **loading** hinzu was aber eigentlich nichts bringt, denn das Element ist ja ausgeblendet (aber für Vollständigkeit).

## Verbesserung 2: Bookmarks und Vor- und Zurückknöpfe
Beim dynamischen nachladen hat man das Problem das sich die Adresszeile nicht ändert, der Browser also nicht mitkriegt das eine neue Seite geladen wurde. Außerdem kann man keinen Link auf eine bestimmte Seite setzen.
Das müssen wir ändern! Dafür benutzen wir **Anker**, die sind von der URL durch eine Raute getrennt. Mit dem JavaScript Objekt **location.hash** können wir die schreiben und lesen.
Als erstes schreiben: In der **Success Funktion** vom Ajaxaufruf fügen wir eine Zeile hinzu.

    location.hash = url;

Damit kriegen wir dann folgende Adresse, nach dem ein neuer Inhalt geladen wurde:
_www.meine-typo3.de/praesenz/index.php?id=123\#index.php?id=321_
Und diese Angabe müssen wir beim laden der Seite auch wieder abfragen:

    if(location.hash) {
    	x = location.hash;
    	getContent(x.slice(1));
    }

Ist ein Anker vorhanden, wird er der Variable **x** zugewiesen. Danach rufen wir unsere schon vorbereitete Funktion _getContent_ auf und der Inhalt wird geladen!
Mit der Funktion_slice(1)_ wird das erste Zeichen herausgeschnitten (bzw. alles andere), denn die Raute würde unser Script verwirren.

## Verbesserung 3: Verwendung von RealURL
Ja, auch das ist möglich und macht die Seite noch viel schöner. Der erste Schritt dafür ist den neuen PageType über **RealURL** ansprechbar zu machen. Ich denke da an
_www.meine-typo3.de/praesenz/start/ajax.html_
Mit der **Version 2.5** ist es (endlich) ein Kinderspiel: Die Datei**localconf.php** wird um ein paar Zeilen erweitert.

    $TYPO3_CONF_VARS['EXTCONF']['realurl']['_DEFAULT'] = array(
    	'pagePath' => array (
    		'type' => 'user',
    		'userFunc' => 'EXT:realurl/class.tx_realurl_advanced.php:&tx_realurl_advanced->main',
    		'spaceCharacter' => '-',
    		'expireDays' => 3,
    		'rootpage_id' => '1',
    	),
    	'fileName' => array (
    		'defaultToHTMLsuffixOnPrev' => 1,
    		'index' => array(
    			'ajax.html' => array(
    				'keyValues' => array ('type' => 101)
    			),
    		),
    	),
    );

Anschließend sind noch ein paar Dinge im JavaScript zu verändern. Weil ich langsam genug vom Schreiben habe, kommt jetzt das **komplette Script** mit einigen erklärenden Kommentaren.

    $(document).ready(function() {
    	//Auf den ggf. übermittelten Anker reagieren
    	if(location.hash) {
    		x = location.hash;
    		getContent(x.slice(1)+".html");
    	}
    
    	//Links per Ajax nachladen
    	//$("a:not([href^='http://'])").click(function() {
    	$("#menu a").click(function() {
    		url = $(this).attr("href");
    		getContent(url);
    		$(this).blur();
    		return false;
    	});
    
    	//Informieren das etwas passiert
    	$("#content").ajaxStart(function() {
    		$(this).fadeOut(function() {
    			$(this)
    				.text("")
    				.addClass("loading")
    				.fadeIn();
    		});
    	});
    
    });
    
    /*
     *	Holt den Inhalt vom Server
     */
    function getContent(url) {
    	$.ajax({
    	//erweitere aufzurufenden Link
    	url: url.replace(/.html/, "/ajax.html"),
    	//wenn es geklappt hat
    	success: function(html) {
    		//Inhalt reinschreiben und anzeigen
    		$("#content")
    			.removeClass("loading")
    			.css("display", "none")
    			.html(html)
    			.fadeIn();
    		//Adresszeile aktualisieren
    		location.hash = url.replace(/.html/, "");
    	}
    	});
    }

## Fazit
**jQuery** und **TYPO3** bieten mal wieder alles an was man sich wünschen kann. Eine [funktionierende Demo](http://www.paul-lunow.de "Lunow") befindet sich auf meiner Seite.
Über Kommentare und Verbesserungsvorschläge würde ich mich sehr freuen.
Bis dahin frohes Programmieren!