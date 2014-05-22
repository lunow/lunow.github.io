---

layout: post
title: "Mit jQuery einen Schatten zaubern"
abstract: '![jQuery Logo](http://blog.paul-lunow.de/wp-content/uploads/2008/08/jquery-logo.gif)Um eine Überschrift hervor zu heben, habe ich ein kleines Plugin geschrieben was das automatisiert erledigt. Ach, was heißt klein? Mini könnte man es nennen. Demos + [Download](http://www.interaktionsdesigner.de/stuff/jquery.shadow.zip "Schatten mit jQuery Plugin download") in diesem Artikel.'
categories: Allgemein
redirect_from: "2008/09/19/mit-jquery-einen-schatten-zaubern/"

---

### Einbindung
Um in den Genuss dieses wahnsinnigen Effekts zu kommen, wird die aktuelle jQuery Version benötigt (oder das Dimension Plugin), dann die Datei jquery.shadow.js und jquery.shadow.css. Anschließend den Überschriften zuweisen:

    $(document).ready(function() {
      $("h3.shadow").shadow();
    });

### Optionen
Es gibt zwei mögliche Optionen: Die Farbe des Schatten und die zugewiesene Klasse:

    $(document).ready(function() {
      $("h3.shadow").shadow({
        class: "meinSchatten",
        color: "red"
      });
    });

### Arbeitsweise
Das Plugin umschließt das gewählte Element mit einem Div Container (mit der Klasse _shadowWrap_) und weißt diesem die Höhe des gewählten Elements zu. Anschließend wird das Element kopiert (_clone()_) und per CSS in den Hintergrund gerückt.
Damit der gewünschte Effekt entsteht müssen die Elemente innerhalb des Divs absolut positioniert sein. Das könnte bei verschiedenen Konstrukten zu unerwarteten Ergebnissen führen. Das sollte beachtet werden.

### Download
Das Plugin und die CSS Datei gibt es als praktische [ZIP Datei](http://www.interaktionsdesigner.de/stuff/jquery.shadow.zip "Schatten mit jQuery Plugin download")!