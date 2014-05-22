---

layout: post
title: "Ein TYPO3 Menü mit PHP erweitern"
abstract: 'Wie wahrscheinlich [alle schon gelesen haben](http://twitter.com/paul_lunow/status/2497087195 "Paul Lunow twittert"), kann meine neuste Extension das**TYPO3 Hauptmenü** um beliebige Punkte **erweitern**.
Nötig wurde das, weil Datensätze der neuen Extension über das Hauptmenü erreichbar sein sollen. Das ist doch mal wieder eine richtig schöne Aufgabe die Dank der Genialität von **Typoscript** auch einfach erledigt werden kann.
_Und so funktionierts._'
categories: TYPO3
redirect_from: "2009/07/06/ein-typo3-menu-mit-php-erweitern/"

---

Es fängt mit einem ganz **normalen Menü** an.

    MENU = HMENU
    MENU {
        special = directory
        special.value = 1
        noBlur = 1
    
        1 = TMENU
        1.NO = 1
        1.NO.wrapItemAndSub = <li>|</li>
        1.NO.ATagParams = class="first" |*| class="" |*| class="last"
    
        1.ACT = 1
        1.ACT < .1.NO
        1.ACT.wrapItemAndSub = <li class="activ">|</li>
        1.ACT.ATagParams = class="first activ" |*| class="activ" |*| class="activ last"
    
        1.wrap = <ul>|</ul>
    
        2 < .1
    }

Dieses Typoscript erzeugt ein verschachteltes Menü, wobei den Links und den umschließenden Li-Tags noch einige Klassen mitgegeben werden, damit sie besser stylebar sind.
Wenn das funktioniert kommen wir zum spannenden Teil. Über die **StdWrap** Eigenschaft wird ein **PHP Script** geladen, das an beliebiger Stelle im Projekt liegen kann. Zum Beispiel im Ordner _fileadmin_.

    page.10.marks.MENU.1.NO.stdWrap.outerWrap
    page.10.marks.MENU.1.NO.stdWrap.outerWrap {
        cObject = PHP_SCRIPT
        cObject.file = fileadmin/script_mainmenu.php
    }

In dem Script wird ein Submenü eingefügt, deshalb benutze ich **outerWrap**, wenn man nur den Linktext bearbeiten möchte, dann langt auch der **innerWrap**. Aus dem PHP Script muss jetzt**ein gültiger Wert** kommen, der den aktuellen Eintrag umschließt.

    $content = "Hallo Menüpunkt: |";

Damit die Rückgabe aus dem Script weiter verarbeitet werden kann, muss sie in der Variable _$content_ stehen. Das Script wird mit _include_ direkt eingebunden, deshalb stehen eine Reihe Daten zur Verfügung. Eine kleine, praktische Auswahl:

* **t3lib\_div::\_GP($key)** um auf Parameter zu reagieren.
* **$this-\>data** beinhaltet die komplette Zeile aus der Datenbank, welche die Seite repräsentiert, deren Menüpunkt gerade gerendert wird.
* **$GLOBALS** mit allen üblichen Werten, z.B. **$GLOBALS\['TYPO3\_DB'\]** um auf die Datenbank zuzugreifen.
In meinem Fall soll also nur bei**einer bestimmten Seiten ID** etwas passieren, nehmen wir an das ist die **ID 123**. Dann sieht das Script ungefähr so aus:

    if($this->data['uid'] == 123) {
        $content = '|<ul><li>Weiter...</li></ul>';
    }
    else {
        $content = '|';
    }

**Tipp 1**
So ist es möglichdem mit einem PHP Script das Menü nach belieben zu erweitern. Man kann auch direkt Variablen an sein Script übergeben, in dem man dem **cObject** einfach weitere Parameter anhängt:

    page.10.marks.MENU.1.NO.stdWrap.outerWrap.cObject.hallo = Welt

Diese stehen dann im Script in der Variable _$conf_ zur Verfügung.
**Tipp 2**
Wenn man verhindern möchte, dass das Script im Cache landet (was es standardmäßig tut), dann muss man das ansagen:

    $GLOBALS['TSFE']->set_no_cache();

Vergisst man diese Zeile dann kann das zu einigen Verwirrungen führen, wenn man auf Benutzereingaben reagiert.
Das wars! Hoffe es hilft jemandem weiter.