---

layout: post
title: "Meine erste Webseite, Teil 4"
abstract: 'Jetzt steht schon eine richtige Seite im Netz, es gibt ein Hauptmenü und man kann der ganzen Welt seine Meinung mitteilen. Herzlichen Glückwunsch! Du gehörst zu den ca. 3% "Creators", d.h. Personen die im Internet Inhalt bereitstellen.
Aber purer Inhalt ist noch nicht alles. Die Seite soll besser werden und die Besucher sollen etwas geboten kriegen. Deshalb dreht sich dieser Artikel darum wie man eine Seite besser machen kann. Es gibt ein paar **Tipps und Tricks** und Anleitungen die sich im täglichen "Netzleben" bewährt haben.'
categories: Tutorial
redirect_from: "2008/11/20/meine-erste-webseite-teil-4/"

---

## Mein neuer Freund Firebug
Firebug ist eine Extension für unseren Lieblingsbrowser: den Firefox. Sie erlaubt es eine Seite zu untersuchen, den Quelltext zu entdecken und verknüpfte CSS Regeln anzuzeigen. Es ist auch möglich Regeln zu deaktivieren, zu verändern oder neue hinzuzufügen (und noch viel mehr, das kann ich hier aber nicht alles beschreiben).
Also: [Firebug installieren](https://addons.mozilla.org/de/firefox/addon/1843)! Danach gibt es ein kleines Symbol rechts unten in der Statuszeile des Browsers. Ein Klick darauf öffnet das Fenster.
Hier ist das nützlichste Tool das sog. **Untersuchen**. Ein Klick darauf und anschließend auf ein Element in der Webseite zeigt es an, den Pfad und auf der rechten Seite die verknüpften CSS Regeln. Ein sehr praktisches Tool um zu sehen wie andere Leute etwas hinbekommen haben.
Es lohnt sich aufjedenfall mit diesem Ding rumzuspielen, ein optimales Tool um jede Menge zu lernen und auszuprobieren.

## Statische Seiten imitieren
Ein tolles Programm bei der Webseitenerstellung ist **mod\_rewrite**. Das ist ein Modul für den Apache Webserver. Mit dessen Hilfe ist es möglich die Adressen einer Seite zu verändern. Zur Zeit ist z.B. die Kontaktseite über folgende Adresse aufrufbar:

    http://www.domain.de/index.php?page=kontakt

Aber es wäre viel schöner wenn es so aussieht:

    http://www.domain.de/kontakt/

oder? Und genau dafür ist **mod\_rewrite** gedacht. Wir machen aus dynamischen URLs statische. Dazu müssen wir eine neue Datei im _Rootverzeichnis_ anlegen (dort wo die index.php liegt). Die neue Datei heißt **.htaccess**. Man beachte den führenden Punkt, das bedeutet die Datei ist versteckt. Im verwendeten FTP Programm muss man vielleicht noch angeben das versteckte Dateien angezeigt werden sollen.
Ist das geschafft, die neue Datei öffnen und folgende Zeilen hinein kopieren.

    RewriteEngine on
    RewriteRule ^([a-z0-9_-]*)/?$ index.php?page=$1

Folgendes passiert: in der ersten Zeile wird das Modul angeschaltet. Anschließend können soviele Regeln wie benötigt hinzugeschrieben werden.
Regeln beginnen immer mit **RewriteRule**, einem regulären Ausdruck der auf die aufgerufene Adresse angewendet wird und einem Ergebnis welches angezeigt wird. Möchte man also _hallo_ zu _hello_ umwandeln genügt **RewriteRule hallo hello**.
Aber so einfach machen wir es uns natürlich nicht! Mit der oben aufgeschriebenen Regel werden alle Aufrufe an die _index.php_ weitergeleitet. Man kann auch Unterseiten unterstützen:

    RewriteRule ^([a-z0-9_-]*)/([a-z0-9_-]*)/?$ index.php?page=$1&subpage=$2

Damit wird der erste Teil in die Variable **page** geschrieben, der zweite in **subpage**. Wer bei Google nach Anleitungen und Informationen sucht wird jede Menge finden.
Um zu überprüfen was an PHP übergeben wird, kann man sich das _globale Array GET_ ausgeben lassen:

    <?
      echo "<pre>", print_r($_GET), "</pre>";
    ?>

Dabei sollte dann etwas in diese Richtung bei rauskommen:

    Array
    (
        [page] => fotos2
        [subpage] => bla
    )
    1

Je nach dem was man aufgerufen hat.

## Einen absoluten Pfad definieren
Wenn man eine externe CSS Datei eingebunden hat oder Bilder, wird man feststellen das diese mit aktiviertem URL Rewriting nicht mehr funktionieren. Das liegt daran, dass die HTML Seite jetzt "denkt" wir befänden uns in einem Ordner auf dem Webserver (http://www.domain.de/fotos/ sieht aus als wäre "fotos" ein Ordner).
Um das zu verhindern müssen wir bei sämtlichen Resourcen die von externen Quellen eingebunden werden einen **absoluten Pfad** vergeben. Der beginnt immer mit **http://** und sollte nur einmal definiert werden, und das ganz am Anfang der _index.php_:

    <?
      define("PFAD", "http://www.domain.de/");
    ?>

Mit diesem PHP Befehl definieren wir eine **Konstante PFAD** die jetzt überall zur Verfügung steht. Es ist wichtig sich zu merken ob man einen Slash am Ende schreibt oder nicht ;)
Jetzt muss die Seite durchsucht werden und Links und externe Resourcen herausgefunden werden. Hier zwei Beispiele:

    <link rel="stylesheet" href="style.css">
    <a href="index.php?page=kontakt">Kontakt</a>

Beide Elemente sind **relativ** eingebunden (sie fangen nicht mit http:// an). Um die **Konstante PFAD** auszugeben bedienen wir uns der **PHP Kurzschreibweise**. Diese beginnt mit dem gewohnten PHP Tag <?, gefogt vom einem Ist-Gleich-Zeichen =, dem Konstantennamen und einem schließenden Tag.

    <link rel="stylesheet" href="<?=PFAD?>style.css">
    <a href="<?=PFAD?>kontakt">Kontakt</a>

Damit wird die oben eingegebene Adresse einfach an der entsprechenden Stelle ausgegeben und schon sind alle Verknüpfungen **absolut**. Um zu testen ob es funktioniert, ändern und den Quelltext der Seite anschauen. Man beachte auch die geänderte Adresse vom Link (nur noch _kontakt_ - cool, oder?).
_Warum wird nicht überall einfach die Domain eingetragen?_ In den ersten Teilen haben wir gelernt **nichts doppelt zu schreiben**. Und wenn jetzt überall http://www.domain.de steht, man dann aber feststellt, dass man domain.de ja mit der eigenen Adresse austauschen sollte, dann ärgert man sich über hunderte Stellen an der Änderungen vorgenommen werden müssen. Genauso wenn man eine neue Domain hat.
Sehr viel besser also wenn man in der ersten Zeile seiner _index.php_ einmal die Änderung vornimmt und schon ist es für den gesamten Webauftritt erledigt.
Also nicht vergessen: Bei allen Verknüpfungen diese Kurzschreibweise voranstellen!

## Hervorheben der aktuellen Seite
Wir haben ja unser Mini CMS, d.h. es wird eigentlich immer die gleiche Seite aufgerufen und nur dynamisch neuer Inhalt eingebunden. Trotzdem müssen wir den geneigten Besucher darüber informieren auf welcher Seite er sich gerade befindet.
Dafür bedienen wir uns wieder der Kurzschreibweise von PHP und fragen für jeden Link ab, ob er augerufen wurde. Ist dies der Fall fügen wir eine Klasse "**aktiv**" zum Link hinzu, über welche per CSS der Link entsprechend formatiert werden kann.

    <a href="<?=PFAD?>kontakt" class="<?=$_GET["page"]=="kontakt" ? "aktiv" : ""?>">Kontakt</a>

So, das sieht jetzt schon relativ kompliziert aus, aber man gewöhnt sich daran. Von Anfang an:
**<?=** ist die einleitende Kurzschreibweise für einen PHP Befehl.
**$\_GET\["page"\]** ist die Variable die wir im URL Rewriting angegeben haben und welche den Namen der aktuellen Seite beinhaltet.
**==** ist ein Vergleichsoperator. Der verknüpft zwei Werte miteinander und gibt true (=wahr) zurück, wenn beide Werte gleich sind (das ist eine Wissenschaft für sich).
**"kontakt"** ist der aktuelle Link und der Wert mit dem die Variable verglichen wird.
**?** "fragt" ob der vorangegangene Ausdruck wahr ist. Ist dies der Fall wird der nächste Ausdruck zurück gegeben:
**"aktiv"** ist der zurückgegebene Wert wenn die Variable den Inhalt kontakt hat.
**:** kennzeichnet den alternativen Teil, d.h. wenn der Ausdruck nicht wahr ist.
**""** ist einfach nur ein leerer Ausdruck, weil wenn die Seite nicht gerade aufgerufen wird, dann kriegt der Link auch keine Klasse zugewiesen.
**?\>** beendet den PHP Befehl wieder.
In der CSS Datei wird dann in einer weiteren Regel das Aussehen des aktiven Links definiert.

    a.aktiv {
      font-weight:bold;
      font-size:20px;
    }

In diesem Beispiel also fett und riesen groß.

## Besucher zählen
Als Webmaster möchte man ja wissen wie viele Menschen sich auf der eigenen Seite herumtreiben. Dafür empfehle ich [Google Analytics](http://www.google.com/analytics/de-DE/). Es wird gemunkelt das das Ranking einer Seite verbessert wird wenn man Google Analytics einsetzt, aber wie dem auch sei, es ist ein wirklich gutes Programm mit vielen interessanten Möglichkeiten.
**Der erste Schritt** ist ein Google Account anzulegen und diesen für Google Analytics zu aktivieren (bei der Datenkracke ist das alles leichter als es sich anhört).
**Wenn das geschafft ist**, muss man ein neues Webseitenprofil anlegen mit der eigenen Domain (einfach den Anleitungen folgen).
**Abschließend** gibt es einen JavaScript Code den man auf die eigene Seite, unmittelbar vor dem schließenden Body-Tag einfügt.
**Geschafft!** Google braucht ein paar Stunden um die Seiten zu indizieren, aber dann wird gezählt.
Die Hilfe von GA ist gut gemacht und bietet viele, viele Informationen. Wer ein paar Minuten Zeit hat sollte da unbedingt einmal reingucken.
_Das wars für heute._ Viel Spaß beim probieren und Webseite optimieren! Wenn noch etwas fehlt, dann hinterlass einen Kommentar, und vielleicht wird es in der nächsten Folge besprochen :)