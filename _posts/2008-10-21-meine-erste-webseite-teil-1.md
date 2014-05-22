---

layout: post
title: "Meine erste Webseite, Teil 1"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/10/start.jpg)Jeder braucht heute eine Webseite und viele haben das Gefühl es ist ein unfassbares Teufelszeug was wir (Webworker) so jeden Tag machen. Sieht vielleicht kompliziert aus, ist es aber nicht!
Am Anfang scheint es unendlich viel zu sein, aber ich glaube mit einem guten Einstieg wird es ganz einfach. Und genau diesen möchte ich hier geben.
Dabei erhebe ich keinen Anspruch auf Vollständigkeit oder die Vermittlung von unendlichem Hintergrundwissen. Jemand der noch nie eine Seite gemacht hat soll hier die Möglichkeit bekommen seine erste Seite mit modernen Technologien zu erstellen. Dabei sollte der geneigte Leser den Spaß an den neuen Technologien gewinnen und auf eigene Faust bestimmte Techniken hinterfragen und weiter recherchieren.
Wir werden HTML, CSS, JavaScript und PHP einsetzen und uns so wenig Arbeit wie möglich machen und dabei so viel lernen wie es geht. Viel Spaß!'
categories: Tutorial
redirect_from: "2008/10/21/meine-erste-webseite-teil-1/"

---

## Vorwort
Ich will einen Weg beschreiben der die Aspekte der modernen Webentwicklung umfasst. Deshalb will ich keinen Editor einsetzen in dem man wie in Word eine Seite zusammen kleistern kann ohne zu verstehen was man tut. Der kommende Weg ist länger und hat einige fiese Stellen dabei, aber am Ende steht eine Webseite die allen modernen Anforderungen entspricht, zukunftssicher ist und coole Technologien und Effekte verwendet.
Anschließend kann man Templates für Systeme wie TYPO3 oder Wordpress erstellen und verstehen wie Webseiten funktionieren. Also: nicht verzweifeln, sondern durchbeißen, googlen und lesen und vorallem: ausprobieren!

## Vorbereitungen

### Wichtige Seiten
Die erste und wichtigeste Quelle ist [Selfhtml](http://de.selfhtml.org). Einfach mal reinschauen und bei unklaren Tags und gesuchten Funktionen nachschlagen (jetzt Bookmark setzen).
Danach kommt der [Validator vom W3C](http://validator.w3.org/). Der zeigt einem an wenn man Fehler in seiner HTML Struktur hat. Funktioniert aber nur mit Seiten die im Internet zugänglich sind, alle Macuser können auf [Validator S.A.C.](http://www.interaktionsdesigner.de/2008/09/30/offline-validieren-mit-validator-sac/) zurückgreifen der auch lokale Webseiten überprüfen kann.

### Programme
Zum schreiben der Seite benutzen wir einen HTML Editor. Unter Mac empfehle ich das Programm [Smultron](http://tuppis.com/smultron/), für Windows habe ich die besten Erfahrungen mit [Weaverslave](http://www.weaverslave.ws/weaverslave.5.html) gemacht (beide kostenfrei).
Dann brauchen wir einen FTP Programm um unsere Daten ins Internet zu stellen. Für Macuser empfielt sich [Cyberduck](http://cyberduck.ch/), oder wer ein bisschen Geld investieren möchte der Platzhirsch [Transmit](http://www.panic.com/transmit/), unter Windows ist [FileZilla](http://www.filezilla.de/) zur Stelle.
Logischerweise zum betrachten der Seiten noch einen Browser, am besten [Firefox](http://www.mozilla-europe.org/de/firefox/).

### Webspace
Wer sich im Internet präsentieren möchte braucht Webspace. Speicherplatz im Internet auf denen die Dateien und Bilder geladen werden.
Wer sich noch nicht der Weltöffentlichkeit zeigen möchte, installiert einen lokalen Webserver auf seinem Computer. Dieser ermöglicht das betrachten von Internetseiten auf dem eigenen Rechner. Es gibt Programme die das für einen erledigen und die schnell installiert sind. Macuser nehmen [MAMP](http://www.mamp.info/de/index.php), für Windows alternativ [XAMPP](http://www.apachefriends.org/de/xampp-windows.html) (steht für Windows=Betriebssystem, Apache=Webserver, M=Mysql=Datenbank und P=PHP=Programmiersprache).
Ist der Webspace im Internet verfügbar oder der lokale Webserver installiert, dann kann die eigene Seite erreicht werden über die Domain im Internet oder lokal über http://localhost/. Wenn das geschafft ist, ist das schlimmste überstanden.

## Grundlagen
Eine Webseite besteht immer aus den gleichen Teilen. Für die erste Seite legen wir folgende Dateien und Ordner an:

* _index.php_ - Beinhaltet unsere Startseite und ein paar PHP Scripte zum laden von weiteren Seiten.
* _style.css_ - Speichert die Regeln zur Gestalltung des Inhalts
* _img_ - Ein Ordner für Bilder
* _content_ - Ein Ordner für weitere Inhalte

### index.php
Das ist unsere Startseite. **Jede Webapplikation** braucht diese Datei damit der Besucher etwas geliefert kriegt. Der erste Schritt ist, diese Datei zu öffnen und das HTML Grundgerüst einzufügen:

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    
    <html>
    	<head>
    		<title></title>
    		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    	</head>
    	<body>
    	</body>
    </html>

Sieht komplizierter aus als es ist und ist immer das gleiche. Es beginnt mit dem DOCTYPE, welcher dem Browser sagt wie er die Seite darzustellen hat.
Danach kommt das erste Tag einer jeden Seite: **<html\>**. Tags werden immer von spitzen Klammern eingeschlossen und sagen dem Browser was er als nächstes zu erwarten hat.
Sie enden mit einen schließenden Tag: **</html\>** oder sind einzeilige Tags, dann haben sie den Slash vor der schließenden Klammer, z.B. das Meta-Tag: <meta /\>.
Weiter im Quelltext: Nach dem der Browser weiß das es sich um eine HTML Seite handelt (<html\>) folgt der Kopfbereich der Seite mit weiteren Anweisungen für den Browser (eingeschlossen von <head\>...</head\>). Darin findet sich das **Title-Tag**. Der Inhalt dieses Tags wird als Fensternamen angezeigt.
Nach dem Kopfbereich beginnt der Körper der Seite. Hier finden sich alle Inhalte die später auf der Seite angezeigt werden (<body\>...</body\>).
**1\. Aufgabe: **Gib deiner Seite einen aussagekräftigen Titel und schreibe in den Körperbereich: **Hallo Welt**. In Programmiersprachen beginnt man stets damit "Hallo Welt" auszugeben. Öffne deine erste eigene Seite im Browser und freu dich über die nette Begrüßung!

## Theoriekram
Leider müssen wir noch zwei theoretische, aber äußerst wichtige Punkte besprechen. Ich versuche es kurz zu halten.

### 1\. Semantik
Eine Webseite ist inzwischen weit mehr als nur grafisch aufbereiteter Inhalt. Screenreader und Suchmaschinen wollen die Seite verstehen, sie soll auf der Playstation dargestellt werden, sowie im iPhone und im Internet Explorer. Deshalb ist es unglaublich wichtig den Programmen mitzuteilen, was für Daten dargestellt werden.
Für diesen Zweck gibt es eine ganze Reihe von HTML Tags die uns dabei unterstützen und den interpretierenden Programmen "sagen" was sie gerade darstellen. Wenn man etwas auf seine Seite schreibt, dann muss man immer darauf achten es richtig und sematisch korrekt zu verpacken.

### 2\. Redundanz
Wikipedia sagt: _Redundanz bezeichnet grundsätzlich einen Zustand von Überschneidung oder Überfluss_. Bei der Webseitenerstellung bezieht sich das auf die doppelten Angabe von Werten und Funktionen. Wir sind grundsätzliche faul und wollen nicht zu viel schreiben. Deshalb gilt (fast) immer:
Sobald wir einmal etwas geschrieben haben, müssen wir es immer wieder verwenden und nicht doppelt und dreifach neu schreiben!
Das ist eine unglaublich wichtige Sache und erfordert manchmal eine ganze Menge Denkarbeit, aber es lohnt sich um eine übersichtliche, kleine und leicht zu erweiternde und wartbare Seite zu erhalten (was wir unbedingt wollen!).
Also nochmal: Hütet euch davor Sachen doppelt aufzuschreiben! Wenn man merkt man schreibt immer wieder das selbe, dann muss unbedingt darüber nachgedacht werden wie das zu vermeiden ist.
Um für die nächste Aufgabe gerüstet zu sein, will ich kurz die wichtigsten Tags für den Inhalt vorstellen:

## HTML Tags
Wie oben erwähnt sagen die Tags dem Browser was er gerade darstellt (Semantik). Hier mal eine knappe Liste von ein paar Tags:

* _a_ - Beschreibt einen Link
* _i_ - Stellt Text kursiv da
* _b_ - Für hervorgehobenen (fetten) Text
* _h1_ - Überschriften erster Ordnung, das geht bis _h6_
* _p_ - Beschreibt einen Absatz
* _ul_ - Ungeordnete Liste (beeinhaltete mehrere Listenelemente)
* _li_ - Ein Listenelement
* _div_ - Fasst mehrere Elemente zusammen
Tags werden immer von spitzen Klammern umschlossen und bestehen aus einem öffnenden Tag und einem schließenden. Dazwischen ist der Text den sie auszeichnen. Es gibt noch eine ganze Reihe [weiterer Tags](http://de.selfhtml.org/html/referenz/elemente.htm) die wir im Laufe des Tutorials kennen lernen werden.
Es folgt ein kleines Beispiel zur Verwendung der oben genannten:

    <h1>Paul Lunow</h1>
    <p>Hallo, das ist meine <b>erste</b> Webseite!</p>
    <h2>Einleitung</h2>
    <p>Ich freue mich das ihr auf meiner Seite gelandet seit. Ich hoffe es macht Spaß. Folgende Dinge kann ich schon:</p>
    <ul>
      <li>Einen Webserver installieren</li>
      <li>Ein FTP Programm bedienen</li>
      <li>HTML Seiten erstellen</li>
    </ul>
    
    <div class="menu">
      <ul>
        <li><a href="index.php">Startseite</a></li>
        <li><a href="index.php">Fotos</a></li>
        <li><a href="index.php">Kontakt</a></li>
      </ul>
    </div>

Dieses Beispiel gehört in den Körperbereich der Seite und erstellt eine erste grobe Struktur. Gut zu sehen und immer zu beachten ist die Einrückung der Elemente, anhand derer man schnell erkennen kann, welches Element wohin gehört.
Außerdem noch ein wichtiger Punkt (dann wars das auch erstmal): **Attribute**. Attribute beschreiben HTML Tags genauer. Sie bestehen aus ihrem Namen, einem Ist-gleich Zeichen und einem Wert in Anführungszeichen (immer!).
Für einen Link gibt man mit einem Attribut das Zeil des Verweises an: <a href="ZIEL DES VERWEISES"\> und dem Div-Container weisen wir eine Klasse zu um ihn später ansprechen zu können: <div class="KLASSENNAME"\>. Aber keine Sorge, auch das ist einfacher als es zunächst aussieht.
Also, auf zur **2\. Aufgabe**: Ersetze das _Hallo Welt_ in dem Körper deiner Seite durch die Inhalte die du darstellen willst (erstmal nur die Startseite und auch nur die Texte). Achte dabei auf die semantische Korrektheit und eine gute Übersicht im Texteditor. Hier gehört noch keine Gestalltung rein, nur das aufschreiben und auszeichnen der Inhalte.

## Fazit und Ausblick
Das wars fürs erste. Ich weiß es war eine ganze Menge, aber es dauert nicht lange bis einem das in Fleisch und Blut übergeht. Also nicht entmutigen lassen!
Als nächstes beschäftigen wir uns dann mit CSS und der Gestalltung der Seite außerdem wollen wir ein paar Bilder und es gibt die ersten Schritte mit PHP! [Weiter mit Teil 2](http://www.interaktionsdesigner.de/2008/10/27/meine-erste-seite-teil-2/ "Meine erste Webseite, Teil 2").
_PS: Begriffe nicht verstanden? Google und Wikipedia helfen da gerne weiter ;)_