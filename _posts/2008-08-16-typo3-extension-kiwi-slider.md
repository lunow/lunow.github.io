---

layout: post
title: "TYPO3 Extension: Kiwi Slider!"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/08/tx_hivars_-slider-2-300x148.png)
[**Jippi Yeah: Es gibt eine neue Version!**](http://www.interaktionsdesigner.de/2008/09/09/typo3-extension-kiwi-slider-2/)
Es ist geschafft! Zusammen mit Matthias Haack habe ich die erste Extension im [Repository](http://typo3.org/extensions/repository/view/kiwi_slider/1.0.1/) von TYPO3 veröffentlicht. Mit Hilfe der neuen Erweiterung kiwi\_slider ist es sehr einfach möglich einen Slider im Stil von [Coda](http://www.panic.com/coda/) auf die eigene Seite einzubinden. [Sogar einen besseren](http://jqueryfordesigners.com/coda-slider-effect/)! Ohne JavaScript bleibt der Slider auf angenehme Weise nutzbar!
Getestet im Firefox 3, Internet Explorer 6 und 7, Safari und Opera.
Es folgen Erklärungen und Erläuterungen oder **[direkt herunterladen](http://www.interaktionsdesigner.de/stuff/T3X_kiwi_slider-0_0_2.zip).**'
categories: Kiwi Slider, TYPO3
redirect_from: "2008/08/16/typo3-extension-kiwi-slider/"

---

## 1\. Installation
Sehr einfach. Extension herunter laden und über den Extensionmanager installieren. Ein Feld muss der Tabelle "tt\_content" hinzugefügt werden.

## 2\. Einbindung auf der Seite
Ein neues Inhaltselement vom Typ "Plugin" erstellen und darin den Kiwi Slider auswählen. Anschließend steht ein Feld zur Verfügung um die Seiten auszuwählen welche im Slider angezeigt werden sollen. Die Titel der Seiten erscheinen in der Liste oberhalb des Sliders, ihr gesamter Inhalt in seinem Inhaltsbereich. Das wars!

## 3\. Konfiguration und Anpassung
Ein einfaches Standardaussehen ist in plugin.tx\_kiwislider\_pi1.\_CSS\_DEFAULT\_STYLE gespeichert und kann bearbeitet, bzw. ersetzt werden.
Ist jQuery im eigenen Projekt bereits vorhanden, muss die erneute Einbindung über das Plugin verhindert werden:

    plugin.tx_kiwislider_pi1.insert.jQuery >

Ein einfaches Anpassen der Größe ist über Typoscript möglich. Diese Werte überschreiben die Angaben in der CSS Datei.

    plugin.tx_kiwislider_pi1 {
      width = 800
      height = 300
    }

Alternativ dazu könnten die entsprechenden CSS Regeln angepasst werden. Um das komplette Layout anzupassen sollten die CSS Angaben in eine externe Datei ausgelagert werden.

## 4\. Ausblick
Wir freuen uns über Kommentare und Erfahrungsberichte und haben jede Menge Ideen für weitere Anpassungen. Ein Abo des RSS Feeds wird empfohlen.