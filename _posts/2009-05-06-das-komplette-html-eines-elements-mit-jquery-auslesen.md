---

layout: post
title: "Das komplette HTML eines Elements mit jQuery auslesen"
abstract: 'Klingt komisch, ist aber ab und zu ganz nützlich. Worum geht es? Im **Elementstack von jQuery** liegt ein Element welches an einem **anderen Ort** wieder eingefügt werden soll. So sieht das _HTML Element_ aus:
\[code lang="html"\]<a href="\#" id="ein-interner-link"\>Ein <span\>wichtiger</span\> Link</a\>
Natürlich wird das Element ausgewählt und das HTML mit der Funktion [html](http://docs.jquery.com/Html "jQuery Dokumentation zu html()") ausgelesen.
\[code lang="javascript"\]$("\#ein-interner-link").html();
Diese Abfrage liefert allerdings das hier:
\[code lang="html"\]Ein <span\>wichtiger</span\> Link
Das ist nicht das gesamte HTML, sondern nur das **innerHTML**. Im folgenden Artikel gibt es**die Lösung**. Oder direkt zur [verbesserten Lösung](http://www.interaktionsdesigner.de/2009/09/23/entirehtml-2-0/ "entireHtml 2.0").'
categories: jQuery
redirect_from: "2009/05/06/das-komplette-html-eines-elements-mit-jquery-auslesen/"

---

## Der komplette HTML Code
Das zu selektierende Element wird **mit einem Container umschlossen**, dieser wird ausgewählt und dann befindet sich in der _innerHTML_ _Eigenschaft_ der komplette HTML Code des Elements.
So sieht es dann mit jQuery aus:

    $("#ein-interner-link").wrap("<div></div>").parent().html();

Das liefert zwar den korrekten HTML Code, hat allerdings zwei Probleme:
**1\. Der Ursprungslink befindet sich jetzt in einem DIV Container**. Wenn diese Funktion mehrfach angewendet wird, hat man eine ganze Reihe DIVs um den Link.
**Die Lösung** ist wieder einfach: Vor dem umschließen wird das Element kopiert:

    $("#ein-interner-link").clone().wrap("<div></div>").parent().html();

**2\. Die Lösung ist so unelegant.** Und wenig jQuery-like. Wenn jemand einen besseren Weg kennt, dann her damit. Bis dahin habe ich die Funktionalität in das Plugin **entireHtml** ausgelagert:

    (function($) {
        jQuery.fn.entireHtml = function() {
            return this.clone().wrap('<div></div>').parent().html();
        }
    })(jQuery);

Damit sieht es netter aus und wenn der rettende, alles erklärende Kommentar auftaucht, ist eine Veränderung nur noch an einer Stelle notwendig. So sieht die Anwendung dann aus:

    $("#ein-interner-link").entireHtml();

Das ist doch wieder ganz nett. **Was meinst du?**
**[Inzwischen gibt es eine verbesserte Lösung in Pauls Blog.](http://www.interaktionsdesigner.de/2009/09/23/entirehtml-2-0/ "entireHtml 2.0")
**