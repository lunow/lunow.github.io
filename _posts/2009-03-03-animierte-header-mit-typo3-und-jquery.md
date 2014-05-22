---

layout: post
title: "Animierte Header mit TYPO3 und jQuery"
abstract: 'Viele schöne Seiten präsentieren großflächige und hochauflösende Bilder. Natürlich wollen unsere Designer das auch und damit der geneigte Besucher Abwechslung bekommt und die Bilder mit dem Inhalt der Seite harmonieren können, wird die **Seite mit TYPO3 aufgebaut** und die Kopfbilder über die **Seiteneigenschaften** (Ressourcen / Dateien) selbst gepflegt.
Soweit kein Problem und schon tausendmal implementiert. Aber wie sieht es aus, wenn der Redakteur **mehrere Bilder** auswählt? Na logisch: auf der Seite werden sie sehr sanft übergelendet (fadeIn, fadeOut). Und klar, das passiert natürlich mit **jQuery** und dem genialen **Plugin [innerfade](http://medienfreunde.com/deutsch/weblog/aus_der_praxis.html?nid=162 "Innerfade Plugin für jQuery") **von den [medienfreunden](http://medienfreunde.com/ "Die Medienfreunde").
Diese Technik eingesetzt findet sich zum Beispiel auf der Seite zur Ausstellung über [Audrey Hepburn](http://www.timeless-audrey.de "Audrey Hepburn Ausstellung in Berlin").'
categories: jQuery, TYPO3
redirect_from: "2009/03/03/animierte-header-mit-typo3-und-jquery/"

---

## TYPO3 Template
Nachdem eine Seite mit mehreren Dateien über _Seiteneigenschaften_ / _Ressourcen_ / _Dateien_ ausgestattet wurde, wird ins **HTML Template** gewechselt und **ein neuer Marker** eingebunden. Ich nenne ihn mal **rubrikBild** mit der ID _head_.
    
    <div id="head">###rubrikBild###</div>

Als nächstes wird der Marker per Typoscript definiert. Er ist vom **Typ COA** und soll aus einer Liste von Bildern bestehen.
    
    rubrikBild = COA
    rubrikBild {
        10 = IMAGE
        10.file {
            import = uploads/media/
            import.data = levelmedia : -1, slide
            import.listNum = 0
        }
        10.wrap = <li>|</li>
        
        wrap = <ul>|</ul>
    }

Das erste Objekt **10** wird definiert als Bild **= IMAGE**. Über die Angabe **10.file** wird eine Datei angesprochen. **import** gibt den Ursprungsort an, **import.data** bestimmt die _Vererbung auf Unterseiten_. Damit wird das Bild der übergeordneten Seite angezeigt, sollte kein eigenes bestehen. **import.listNum** wählt aus der Liste das erste Bild aus. Abschließend wird das generierte Img-Tag in einem Listenelement verpackt **10.wrap = <li\>|</li\>** und das komplette Objekt als Liste **wrap = <ul\>|</ul\>**.
Hm. Mit diesem Code wird jetzt nur ein einziges Bild in einer Liste dargestellt. Eindeutig zuwenig zum Überblenden. Deshalb muss dieser Code **mit einer Schleife ersetzt werden**. Dazu werden die ausgewählten Dateien in einen Text geschrieben und mit der Funktion [split](http://www.typo3.net/tsref/functions/split/ "Split in der Typoscript Referenz") auseinander genommen. Anschließend kann jedes Element einzeln behandelt werden. 
    
    rubrikBild = COA
    rubrikBild {
        10 = TEXT
        10.data = levelmedia:-1, slide
        10.split {
            token = ,
            cObjNum = 1
            1 {
                10 = IMAGE
                10.file.import.current = 1
                10.file.import = uploads/media/
                10.wrap = <li>|</li>
            }
        }
        
        wrap = <ul>|</ul>
    }

Das Auslesen der Datei und die Wraps sind wie im oberen Beispiel, aber hier werden jetzt **alle angegebenen Dateien **ausgelesen!

## CSS
Die Darstellung der Liste richtet sich natürlich nach dem Seitenlayout. Auf jeden Fall sollte man es mit _position:absolute_ so einrichten, das alle Bilder übereinander liegen damit _Benutzer ohne JavaScript_ nicht von einem Haufen sinnloser Bilder erschlagen werden.

## JavaScript
Jetzt fehlen noch **ein paar Zeilen jQuery** und fertig ist die Funktion! Als erstes muss das **Plugin innerfade eingebunden** werden. Natürlich über **Typoscript** im **Roottemplate** und dort entweder per _page.10.headerData_ oder _page.includeJS_, je nach Geschmack würde ich mal behaupten.
Dann wird eine Datei für eigene Scripte benötigt, ich nenne sie gerne _action.js_ (eingebunden NACH dem jQuery Core und allen benötigten Plugins), die eine Funktion beinhaltet, welche aufgerufen wird sobald alles fertig geladen wurde:
    
    jQuery(function($) {
        // ... hier gehts los ...
    });

Als erstes muss geprüft werden, **ob überhaupt mehr als ein Bild vorhanden** ist:
    
    if($("#head ul li").length > 1) {
        // ...hier gehts weiter ...
    }

Wenn das der Fall ist, dann muss nur noch das **innerfade Plugin aktiviert** werden:
    
    $("#head ul").innerfade({
        speed: 2000,
        timeout: 4000,
        containerheight: '250px'
    });

Zu beachten ist, dass die Funktion _innerfade_ auf den **umfassenden Container**, also auf das _<ul\>_, angewendet wird und nicht auf die einzelnen Elemente. Wenn man die Angabe **containerheight** vergisst weglässt, dann funktioniert es nicht im Internet Explorer. **Daran denken! **Noch mehr mögliche Einstellungen sind im Quelltext von _jquery.innerfade.js_ dokumentiert.

## Fertig
Jetzt in der Schulung die **Freude der Auftraggeber** genießen und viele schöne Überblendungen auf den eigenen Seiten beobachten. Sobald unsere neue Seite veröffentlich wurde, wird sie hier als Beispiel dienen. Bitte noch ein bisschen Geduld. Die Ausstellungsseite [timeless-audrey](http://www.timeless-audrey.de "Audrey Hepburn Ausstellung in Berlin") benutzt diese Technik.
PS: _Ein Linktipp; _die Firefox Erweiterung [Wappalyzer](https://addons.mozilla.org/de/firefox/addon/10229 "Wappalyer für Firefox") verrät auf einen Blick welche Systeme eine Internetseite einsetzt. Sehr praktisch! Danke [t3n](http://t3n.yeebase.com/ "t3n").