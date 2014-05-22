---

layout: post
title: "Auf Inhalte aufmerksam machen: Kiwi Teaser"
abstract: 'Darf ich vorstellen? Meine neuste Extension, der **Kiwi Teaser**. Mit dessen Hilfe präsentiert man ganz einfach vorhandene Inhalte auf der einen Seite. Dazu legt man eine Teaseranzeige an und bestimmt wieviele Teaser sie anzeigen soll.
Die Teaser sind entweder **Teaserdatensätze** (mit Titel, Inhalt, Bild und Link), **ganze Seiten** oder einzelne **Inhaltselemente**. Fertig! Auf der Startseite kann der Redakteur jetzt ganz genau bestimmen, auf welche Inhalte die Benutzer aufmerksam gemacht werden sollen und in welcher Reihenfolge.
Die Extension gibts im [TYPO3 Repository](http://typo3.org/extensions/repository/view/kiwi_teaser/current/ "Kiwi Teaser im TYPO3 Repositorie") oder auf [GitHub](http://github.com/kiwi-service/Kiwi-Teasers "Kiwi Teaser auf GitHub") - live im Einsatz bisher auf unserer [Firmenpräsenz](http://www.kiwi-service.de "Kiwi Service").'
categories: Kiwi Teaser, TYPO3
redirect_from: "2009/12/17/auf-inhalte-aufmerksam-machen-kiwi-teaser/"

---

## Berechtigung
Es liegt natürlich nahe tt\_news einzusetzen. Aber erst sagt der Redakteur mir, ich soll das Datum ausblenden, denn regelmäßige News gibt es  gar nicht. Als nächstes will er die Reihenfolge ändern und ich sage, pass doch einfach das Datum entsprechend der Reihenfolge an. Klar, das geht aber so richtig genial ist das nicht.
Zumal die meisten Hinweise sich auf entsprechende Seiten in der Präsenz beziehen, auf externe Links oder einfach nur einen kurzen Hinweis darstellen. Das geht jetzt eleganter.

## Inhalte
Es können verschiedene Inhalte vorgestellt werden. Die Extension bringt eigene Datensätze mit welche Titel, Inhalt, Bild und einen Link aufnehmen. Es können aber auch Seiten oder Seiteninhalte angeteast werden.

## Installation
Entweder man holt sich die stabile Version aus dem Repository oder die aktuellste, brandheiße aus meinem ersten Projekt auf [GitHub](http://github.com/kiwi-service/Kiwi-Teasers "Kiwi Teaser auf GitHub"). Ein großartiges Portal!
Die restliche Installation ist alt bekannt und ganz normal. Der Kiwi Teaser **bindet standardmäßig jQuery ins Projekt ein** um ein paar coole Extras zu ermöglichen.

## Konfiguration
Über Typoscript hat man viele Einstellungsmöglichkeiten. Alles natürlich unter **plugin.tx\_kiwiteaser\_pi1** im Template - das schreibe ich jetzt nicht jedesmal mit auf. Die angegebenen Typoscriptschnipsel stellen jeweils die Standardeinstellung dar.

    include.css.standard = 1

Mit dieser Anweisung wird ein minimales Stylesheet geladen welches dafür sorgt das die Boxen nebeneinander stehen und einen Abstand zueinander haben.

    include.javascript.jquery = 1

Bindet die aktuelle jQuery Version ein. Hat man diese schon im Projekt sollte man diese Eigenschaft unbedingt mit **include.javascript.jquery \>** löschen (auf diese Art kann man jeden include verhindern).

    include.javascript.clickbox = 1

Holt mein Plugin Clickbox ins Projekt, welches **die komplette Teaserbox klickbar** macht und nicht nur den kleinen Link. [Mehr zur Clickbox gibts hier](http://www.interaktionsdesigner.de/2008/04/22/mein-jquery-plugin-clickbox/ "Clickbox").

    include.javascript.height = 1

Bindet ein Script ein, welches dafür sorgt das **alle Teaserboxen die gleiche Höhe** haben. Besonders praktisch wenn man einen Rahmen oder eine Hintergrundfarbe gesetzt hat.

    template.file = EXT:kiwi_teaser/res/html/template.html

Der Pfad zum HTML Template. Das Standardtemplate sollte man sich unbedingt angucken und die Klassennamen beibehalten, denn sonst kriegen die oben erwähnten Scripte Schwierigkeiten.

    stdWrap

Der StandardWrap ist eine richtig schöne Sache! Damit kann man **jeden Inhalt mit Typoscript bearbeiten** bevor er ausgegeben wird. Dieser kann auf alle Felder angewendet werden: **title, image, link** und **content**. Zum Beispiel:

    stdWrap.title.wrap = <b>|</b>

Außerdem kann man für verschiedene Quellen verschiedene Optionen angeben. Seiten kommen aus der Tabelle **pages**, Seiteninhalte aus **tt\_content** und die Standardinhalte aus **tx\_kiwiteaser\_content**. Mit diesem Wissen kann man die Ausgabe je nach Datenbank bestimmen. Möchte man also die Überschriften von Seiten nicht fett sondern kursiv darstellen, reicht folgende Anweisung:

    stdWrap.title.pages.wrap = <i>|</i>

Besonders wichtig ist diese Möglichkeit für **den Linktext**. Dieser wird über die Eigenschaft **link.value** gesetzt.

    stdWrap.link.value = Mehr...

Die Extension setzt den generierten oder angegebenen Wert vor der Verarbeitung in das Feld **stdWrap.link.typolink.parameter**. Das typolink Objekt lässt sich natürlich trotzdem noch erweitern. Will man alle Teaserlinks in einem neuen Fenster öffnen geht das ganz einfach:

    stdWrap.link.typolink.target = _blank

## Mapping der Inhalte
Um zu entscheiden, welche Daten aus einem Datensatz den Titel und welche z.B. den Inhalt darstellen, gibt es eine **Mappingtabelle im Typoscript**. In der Standardkonfiguration wird der Untertitel einer Seite als Inhalt benutzt. Das passiert über folgende Angabe:

    tables.pages.content = subtitle

Dabei bezeichnet der Schlüssel das Feld im Teaser und der Wert das Feld in der Zieltabelle. Das lässt sich je nach Anforderung beliebig anpassen. Wenn die Eigenschaft link leer ist, erzeugt die Extension den Link je nach Tabelle automatisch.

## Template
Im Template stehen verschiedene Marker zur Verfügung:

* **\#\#\#TITLE\#\#\# **Ein Beispieltitel
* **\#\#\#IMAGE\#\#\# **uplodas/media/picture.jpg
* **\#\#\#CONTENT\#\#\# **Das ist je nach eingabe verschieden.
* **\#\#\#LINK\#\#\# **<a href="index.php?id=123"\>Mehr...</a\>
* **\#\#\#CLASS\#\#\# **teaser-first port1
**Image** beinhaltet den originalen Inhalt aus der Datenbank, also im Idealfall den Pfad zum Bild, sollte also noch mit einem <img\> Tag gewrappt oder per Javascript weiter verarbeitet werden.
**Link** ist ein kompletter <a\> Tag - generiert über Typoscript.
**Class** wird automatisch gesetzt, je nach Position des Teasers steht da **first-teaser** oder **last-teaser** drin. Außerdem kriegt jeder Teaser die Klasse **portX** wobei das X für die aktuelle Position steht. So kann man also den zweiten Teaser gezielt ansprechen:

    .tx-kiwiteaser-pi1 .port2 {
        font-size:200%;
    }

## Alpha
Heute, am 17.12.2009 habe ich die erste Version fertig gestellt und in meinem Projekt eingesetzt. Als nächstes wird sie in Kundenprojekt eingesetzt und die Redakteure darauf losgelassen. Dabei werde ich sicher noch die eine oder andere Erweiterung entwickeln, **mit mehreren Updates ist also zu rechnen**. [Auf dem neusten Stand ist man natürlich bei Twitter](http://twitter.com/paul_lunow/ "Der Interaktionsdesigner auf Twitter").

## Ausblick
Der wichtigeste Punkt auf meiner Liste ist die **Unterstützung von tt\_news**. Damit ist es dann auch möglich eine schön ausgearbeitete Nachricht zu teasern. Natürlich muss sich das nicht auf tt\_news beschränken, **sondern kann im Prinzip jeden beliebigen Datensatz beinhalten**!
Darüber hinaus sind die Pläne natürlich groß und die Möglichkeiten auch. Ich denke an jQuery Effekte wie das faden von Inhalten, die Integration vom [Kiwi Slider](http://www.interaktionsdesigner.de/category/kiwi-slider/ "Der Kiwi Slider") oder das dynamische Anpassen der Inhalte.
**Da wird noch einiges passieren!**

## Fazit
Ich möchte kein zweites tt\_news programmieren, hier geht es wirklich nur um das Teasern von eigenen und fremden Inhalten. So bequem und einfach für die Redakteure wie möglich.
Ich hoffe ihr könnt die Extension gut einsetzen - über Ideen, Fragen und Anregungen in den Kommentaren freue ich mich natürlich. Und wenn jemand per GitHub mitarbeiten möchte, ist er hiermit herzlich eingeladen.
Ganz unauffällig sei auch noch auf meine Firma hingewiesen - wenn du die Extension oder ähnliches für dein Projekt brauchst, aber nicht selbst programmieren möchtest oder kannst, dann ist der [Kiwi Service](http://www.kiwi-service.de "Kiwi Service") ein verantwortungsbewusster und kompetenter Partner!
Wenn dir der Artikel gefällt und du mit uns zusammen mehr solche Lösungen entwickeln möchtest, an das Internet und OpenSource glaubst und einen Job in Berlin suchst, dann **bewirb dich bei uns**. [Wir suchen neue Freunde!](http://www.kiwi-service.de/jobs/ "Webentwickler gesucht in Berlin")
_Danke fürs lesen, und fröhliches teasen!_