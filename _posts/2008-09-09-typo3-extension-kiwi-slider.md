---

layout: post
title: "TYPO3 Extension Kiwi Slider "
abstract: 'Meine TYPO3 Extension **Kiwi Slider** ist in der ersten Betaversion erschienen und trägt jetzt die stolze Versionsnummer 1.1.0\.
Zur Erinnerung: Mit dieser Erweiterung ist es sehr einfach und schnell möglich einen Content Slider zu erstellen, im Stil der [Coda Webseite](http://www.panic.com/coda/). Es basiert auf [jQuery](http://www.jquery.com) und der Anleitung von [jQuery for Designers](http://jqueryfordesigners.com/coda-slider-effect/).
Hier [herunterladen](http://typo3.org/extensions/repository/view/kiwi_slider/1.1.0/).'
categories: Kiwi Slider, TYPO3
redirect_from: "2008/09/09/typo3-extension-kiwi-slider/"

---

Mit der neuen Version gibt es mehr Einstellungsmöglichkeiten und eine bessere Integration der JavaScript Dateien. Über das Typoscript lässt sich jedes einzelne, benötigte Plugin expliziet einbinden oder ausblenden.

    plugin.tx_kiwislider_pi1 {
      include.jQuery >
    }

In diesem Beispiel wird das JavaScript Framework jQuery nicht mit eingebunden. Genau so kann die Einbindung von _localScroll_, _serialScroll_ und _scrollTo_ gesteuert werden.
Über die Angabe **arrows** können die Pfeile gesteuert werden.

    plugin.tx_kiwislider_pi1 {
      arrows.hide = 1
    }

Mit dieser Einstellung werden die Pfeile komplett ausgeblendet, in **arrow.left** und **arrow.right** können neue Bilddateien angegeben werden.
Eine weitere neue Eigenschaft ist **showRecords**, wird diese gesetzt, wird nur die angegebene Anzahl von Seitenelementen in den Slider geladen. Um also nur das erste Inhaltselement darzustellen reicht die folgende Angabe:

    plugin.tx_kiwislider_pi1 {
      showRecords = 1
    }

Einfach, oder?
Den Download gibts im [Extension Repository von TYPO3](http://typo3.org/extensions/repository/view/kiwi_slider/1.1.0/). Mehr Informationen in der Doku. Viel Spaß!