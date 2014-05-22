---

layout: post
title: "jQuery Plugin: Avoid Widows"
abstract: 'Bei der Arbeit mit Content Managment Systemen stößt man immer wieder auf die gleichen Probleme: Die meisten Lösungen sind zwar für uns Programmierer einfach, aber aus irgendeinem Grund merken sich die Redakteure das nicht.
Ein glänzendes Beispiel dafür sind die [Hurenkinder](http://de.wikipedia.org/wiki/Hurenkind_und_Schusterjunge) der Überschriften. Bedeutet: das letzte Wort einer Überschrift wird umgebrochen und steht ganz allein in der nächsten Zeile.
[![](http://blog.paul-lunow.de/wp-content/uploads/2008/07/hurenkind-1.png)](http://blog.paul-lunow.de/wp-content/uploads/2008/07/hurenkind-1.png)
Doch damit ist jetzt Schluss!'
categories: jQuery
redirect_from: "2008/07/18/jquery-plugin-avoid-widows/"

---

Um dieses Verhalten zu unterbinden, und zwar ohne Hilfe der Redakteure, gibt es im [Learning jQuery Blog](http://www.learningjquery.com/2008/07/three-quick-ways-to-avoid-widows) einen sehr schönen Ansatz. Mit unserem geliebten jQuery werden die Überschriften durchgegangen und das letzte Leerzeichen durch ein geschütztes ( ) ausgetauscht.
**So einfach!** Und damit es noch einfacher wird habe ich es in ein kleines jQuery Plugin zusammen gepackt. Die Anwendung ist denkbar simpel. Nach dem Einbinden des [Frameworks](http://jquery.com/) und des [Plugins](http://www.interaktionsdesigner.de/stuff/jquery.avoidwidows.js) reicht eine einzige Zeile aus:

    $(document).ready(function() {
      $("h1, h2, h3").avoidWidows();
    });

Keine Einstellungen, keine Anpassungen, **kein Ärger**. Und schon klappt es auch mit dem Weblayout.
[Hier herunterladen](http://www.interaktionsdesigner.de/stuff/jquery.avoidwidows.js) und über schönere Umbrüche freuen.
[](http://blog.paul-lunow.de/wp-content/uploads/2008/07/keine-hurenkinder.png)