---

layout: post
title: "Meine erste Webseite, Teil 3"
abstract: 'Du hast deinen eigenen Webserver oder ein Plätzchen im Internet gefunden und die ersten Grundlagen für deine Seite gelegt. Die wichtigsten Dateien sind erstellt und das Mini-CMS funktioniert wie erwartet. Du hast ein paar Inhalte im Ordner content/ liegen und kannst sie aufrufen.
Dann kann es ja losgehen mit der Aufteilung der Elemente und einen tieferen Einblick in CSS.'
categories: Tutorial
redirect_from: "2008/11/07/meine-erste-webseite-teil-3/"

---

**Vorweg ein paar Links:** Der wichtigste von allen ist nach wie vor [Selfhtml](http://de.selfhtml.org "SelfHTML"). Auch in Fragen CSS findet man hier umfangreiche Anleitungen, Templates und eine Referenz. Außerdem empfehlenswert ist die Seite [CSS4you](http://www.css4you.de/index.html "css4YOU") auf der man jede Menge Hilfe findet.

## HTML
Wir begnügen uns aber erstmal mit einem ganz einfachen Seitenaufbau. Dem Klassiker:
Das ist der klassische Aufbau einer Seite. Wir fangen an mit einer festen Breite und einem umschließenden Container um die Elemente aufzuteilen.
Bevor es richtig losgeht noch ein Hinweis: Wir wollen nichts doppelt schreiben und so wenig wie möglich! Daran muss man immer denken damit man sich nicht zu viel Arbeit macht und die eigene Seite so effektiv wie möglich bleibt. Warum? Je effektiver wir anfangen um so weniger Stress haben wir wenn später Änderungen vorgenommen werden sollen.
So sehen die Div-Container aus (blaue Linien und deren Ids):
**Die erste Aufgabe** besteht darin diese Container auf die eigene Webseite anzuwenden. Denke also darüber nach, welche Bereiche wohin gehören und los gehts!
Fertig? Sehr gut. Dann solltest du etwas in dieser Richtung haben:

    <div id="wrap">
    
    <!-- Kopfbereich -->
    <div id="head">
      <h1>Paul Lunow</h1>
    </div>
    
    <!-- Inhaltsbereich -->
    <div id="content">
      <p>Hallo, das ist meine <b>erste</b> Webseite!</p>
      <?
      $page = "content/start.php";
      if(is_file($page)) {
        include($page);
      }
      else {
        echo "Die Seite konnte leider nicht gefunden werden.";
      }
      ?>
    </div>
    
    <!-- Mein Hauptmenü -->
    <div id="menu">
      <ul>
        <li><a href="index.php">Startseite</a></li>
        <li><a href="index.php">Fotos</a></li>
        <li><a href="index.php">Texte</a></li>
      </ul>
    </div>
    
    <!-- Fusszeile -->
    <div id="footer">
      <a href="#">Kontakt</a> |
      <a href="#">Impressum</a>
    </div>
    
    </div>
    

Was sofort auffällt ist die Reihenfolge: sie spielt in unserem Beispiel keine Rolle. Im Idealfall jedenfalls. Und in der "echten Welt" vorallem für die Suchmaschinen. Je weiter oben ein Keyword im HTML Dokument steht, umso besser wird es von den Spidern gewertet. Aber dazu später mehr, wir kümmern uns jetzt um das CSS, Container für Container.

## CSS
Am besten ist es jede Anweisung einzeln hinzuzufügen und zu untersuchen was passiert. Es bietet sich an den Editor und den Browser nebeneinander zu positionieren. Mit \[CMD\] + \[TAB\] (auf dem Mac) kann man schnell zwischen den Fenstern hin und her schalten ohne die Maus zu benutzen. \[F5\] lädt das Browserfenster neu. Los gehts!
_Als erstes der umschließende Container (Wrap)_. Er hält alle Elemente zusammen und gibt dem ganzen eine Breite. Sagen wir mal 960 Pixel. Wir positionieren den Container relativ zur Seite. Das hat den Sinn das sich absolut positionierte Elemente an diesem orientieren.
Um zu prüfen ob es funktioniert geben wir dem Wrap einen Rahmen von einem Pixel um sofort zu sehen ob es geklappt hat:

    #wrap {
      position:relative;
      width:960px;
      border:1px solid black;
    }

_Als nächstes der Kopf der Seite (Head)._ Er wird absolut positioniert und soll über die gesamte Breite gehen und 120 Pixel hoch sein. Mit **left** und **right** werden die Abstände zum umfassenden Container angegeben. Graue Hintergrundfarbe um etwas zu sehen. Daraus resultiert folgendes CSS:

    #head {
      position:absolute;
      left:0;
      right:0;
      width:100%;
      height:120px;
      background:silver;
    }

_Jetzt der Inhalt._ Im Moment wird er noch verdeckt vom Kopf der darüber legt. Also braucht er Abstand nach oben und Abstand nach links, um Platz für das Hauptmenü zu schaffen. Damit der Footer auch noch Platz hat kriegt der Inhalt einen Abstand nach unten.

    #content {
      margin-top:130px;
      margin-left:200px;
      margin-bottom:25px;
    }

_Jetzt hängt das Hauptmenü noch ganz traurig unter dem Inhalt._ Das müssen wir unbedingt ändern. Das Menü wird absolut positioniert, an die linke Kante geheftet und von oben weg gerückt damit es nicht unter dem Kopfbereich verschwindet. Außerdem braucht es noch eine bestimmte Breite um nicht in den Inhalt hinein zu ragen.

    #menu {
      position:absolute;
      top:130px;
      left:0;
      width:180px;
    }

_Und zu guter Letzt noch der Fußbereich der Seite._ Er soll immer am unteren Rand kleben und bündig zum Inhalt sein. Also los:

    #footer {
      position:absolute;
      bottom:0;
      left:200px;
      height:20px;
    }

**Fertig!** Das wars schon mit der Verteilung der Elemente. Einfach oder?

## Ein paar Tipps
Sollte es auf anhieb nicht so gut klappen:

* Mach dir das Element sichtbar! Hintergrundfarben und Rahmen geben dir einen Eindruck wie sich das Element verhält:

    border: 1px solid red;
    background:silver;

* Guck dir im Firefox den Quelltext an (\[CMD\] + \[U\]). Wenn du fette, rote Schrift findest, dann ist das ein Zeichen dafür das hier etwas nicht stimmt. Überprüfe die hervorgehobenen Passagen auf korrekte Anführungszeichen, Attribute und öffnende und schließende Klammern.
* Jage deine Seite durch den Validator vom W3C. Der sagt bescheid wenn etwas nicht stimmt und versucht auch zu erklären was schief gelaufen ist.

## Effektive Ansprache der Elemente
Wir versuchen alles so knapp und effektiv wie möglich zu halten. Vorallem im CSS müssen wir daran denken. Es empfielt sich die Datei in zwei Bereiche zu gliedern.
1\. Struktur
Das war der ganze obere Teil welcher die einzelnen Elemente auf der Seite positioniert.
2\. Gestalltung
In diesem Bereich wird das aussehen der Elemente gesteuert. Zum Beispiel Schriftart, Größe, Abstand, Farben usw.
Um die unterschiedlichen Bereiche deutlich zu machen und später noch zu wissen was mit welcher Anweisung gemeint war, müssen wir alles fleißig und ausführlich kommentieren. In CSS schließen wir die Kommentare mit /\* und \*/ ein:

    /* Struktur */
    #head { ... }
    #content { ... }

CSS ermöglicht es mehrere Selektoren hintereinander zu schreiben. Wenn wir z.B. alle Links im Hauptmenü eine schwarze Farbe zuweisen wollen, dann könnte man auf die Idee kommen jedem Link im Menü eine Klasse zuzuweisen (z.B. <a href="\#" class="schwarz"\>) und diese per CSS zu stylen.
Aber halt! Wir wollte nichts doppelt schreiben, und dieses class="schwarz" müssten wir allerdings öfters schreiben. Einfacher, und ohne irgendeine Änderung am HTML Quelltext, haben wir es, in dem wir einfach alle Links im Container Menü ansprechen.

    /* Links im Container Menü schöner machen */
    #menu a {
      color:black;
      text-decoration:none;
    }

Und so soll es weiter gehen! Wenn jetzt ein neuer Menüpunkt hinzukommt müssen wir nicht darüber nachdenken welche Klasse er braucht um genau so auszusehen wie alle anderen. Einfach nur dadurch das er im Menü ist, bekommt er schon die richtige Formatierung.
Darüber lohnt es sich nachzudenken.

## Fazit
Das wars mit dem dritten Teil! Du kannst deiner Homepage jetzt schon ein schönes Äußeres verpassen, Bilder einbauen, Farben vergeben usw. Wenn du bestimmte Ideen zur Formatierung hast, dann durchsuche Google und Selfhtml nach den passenden Anweisungen. Es gibt sie bestimmt.
Im nächsten Kapitel kommen dann diverse Kniffe und Tricks um die Seite (noch) besser zu machen. [Viel Spaß mit dem nächsten Kapitel](http://www.interaktionsdesigner.de/2008/11/20/meine-erste-webseite-teil-4/ "Meine erste Webseite, Teil 4").