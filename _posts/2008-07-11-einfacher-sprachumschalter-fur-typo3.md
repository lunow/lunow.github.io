---

layout: post
title: "Einfacher Sprachumschalter für TYPO3"
abstract: 'Wie schon bei der [einfachen Druckfunktion](http://www.interaktionsdesigner.de/2008/07/04/einfache-druckfunktion-fur-typo3/ "Einfache Druckfunktion mit Typoscript") angesprochen, möchte ich einfache Aufgaben mit den TYPO3 Standardmitteln lösen. Damit sparen wir uns jede Menge Extensions und Update-Nerv.
Diesmal sollen die Besucher die Möglichkeit erhalten die Sprache der Webseite umzuschalten. Dabei sollen sie natürlich auf der gleichen Seite bleiben. Üblicherweise geschieht dies über zwei kleinen Flaggen.
Im Netz gibt es einen unendlichen Haufen Lösungen und hier kommt noch eine mehr.'
categories: TYPO3
redirect_from: "2008/07/11/einfacher-sprachumschalter-fur-typo3/"

---

## Vorgehensweise
1\. **Zwei Marker** werden im Template an geeigneter Stelle definiert. In meinem Beispiel DEUTSCH und ENGLISCH.
2\. Über Typoscript werden die Marker mit einem Bild gefüllt, um dieses wird ein Link geschlossen und über einen weiteren Parameter (**additionalParams**) wird die Sprache geändert. So sieht es aus:

    page.10.marks.DEUTSCH = IMAGE
    page.10.marks.DEUTSCH {
      file = fileadmin/template/img/lang-deAktiv.jpg
      stdWrap.typolink {
        additionalParams = &L=0
        parameter.field = uid
      }
    }
    page.10.marks.ENGLISCH = IMAGE
    page.10.marks.ENGLISCH {
      file = fileadmin/template/img/lang-enInaktiv.jpg
      stdWrap.typolink {
        additionalParams = &L=1
        parameter.field = uid
      }
    }

3\. Um die **gewählte Sprache** hervorzuheben, fragen wir die Sprache ab und ändern je nach dem die URL des Bildes.

    [globalVar = GP:L=1]
    page.10.marks.DEUTSCH.file = fileadmin/template/img/lang-deInaktiv.jpg
    page.10.marks.ENGLISCH.file = fileadmin/template/img/lang-enAktiv.jpg
    [global]

## Fazit
Typoscript bietet so viele Möglichkeiten und ich halte es für sehr sinnvoll diese auszuschöpfen bevor wild alle möglichen Extensions installiert werden.
Die Druckfunktion arbeitet jedenfalls stabil und zuverlässig und ich habe noch keinen Grund gefunden der den Einsatz einer Extension rechtfertigen würde.