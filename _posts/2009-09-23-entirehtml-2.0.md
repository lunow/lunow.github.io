---

layout: post
title: "entireHtml 2.0"
abstract: 'Ich habe schon mal darüber bereichtet. Die Funktion **$(".test").html()** liefert nicht das komplette HTML, sondern nur das **innerHTML**. Mit meinem [vorhergehenden Post](http://www.interaktionsdesigner.de/2009/05/06/das-komplette-html-eines-elements-mit-jquery-auslesen/ "entireHtml in Pauls Blog") kriegt man schon sehr einfach das komplette HTML eines Elements, und genau das ist das Problem: **eines Elements**.
Mit ein paar Zeilen mehr im Plugin läufts auch mit beliebig vielen Objekten. So funktionierts:'
categories: Allgemein
redirect_from: "2009/09/23/entirehtml-2-0/"

---

## Die Anforderung
...ist alt bekannt. Folgendes HTML liegt vor:

    <div class="test">
        Wir sind <strong>wichtig</strong>
    </div>

Wenn man dieses HTML auslesen will und nur weiß, dass das Zielelement die Klasse _test_ hat, schlägt folgender Versuch fehl:

    $('.test').html(); //funktioniert nicht

Funktioniert nicht, weil das Ergebnis nicht komplett ist.

    Wir sind <strong>wichtig</strong>

Mein kleines [Plugin entireHtml](http://www.interaktionsdesigner.de/2009/05/06/das-komplette-html-eines-elements-mit-jquery-auslesen/ "entireHtml in Pauls Blog") hilft weiter, und liefert wie erwartet das komplette HTML. So wirds allerdings nervig:

    <div class="test">
        Wir sind <strong>wichtig</strong>
    </div>
    <div class="test">
        und das ist <strong>schön</strong>.
    </div>

Die Funktion _entireHtml_ liefert nur das HTML des **ersten** divs zurück.

## Die Lösung
Im Plugin stehen alle Objekte in der Variable _this_ zur Verfügung. Das Plugin muss, wenn mehr als ein Element im Stack liegt, **jedes** Element durchgehen und das komplette HTML zurückgeben.
Und ohne große Worte folgt jetzt das **komplette Plugin**:

    /*
     *  entireHtml
     *  Ein kleines, nettes Plugin um das komplette HTML eines Selectors zu bekommen.
     *
     *  Mehr Infos unter http://www.interaktionsdesigner.de
     */
    
    (function($) {
      jQuery.fn.entireHtml = function() {
        if(this.length == 1) {
          return this.clone().wrap('<div></div>').parent().html();
        }
        else {
          var html = '';
          $(this).each(function() {
            html+= $(this).entireHtml();
          });
          return html;
        }
      }
    })(jQuery);

## Fazit
Schön, oder? Funktioniert wie erwartet. Noch eine Antwort: **Wozu braucht man das?** Im Moment arbeiten wir an einem interaktiven Tool um PDFs zu erstellen. Das Formular kommt aus der Extension Powermail für TYPO3 und wird von einem Redakteursteam gepflegt. Im Frontend sollen aber bestimmte Optionen erst auf Nachfrage sichtbar sein.
Redakteur fügt also Dateiuploadfelder hinzu und speichert. jQuery "merkt" das, nimmt das komplette HTML raus, packt es in eine Box, versteckt die Felder und legt einen Link ala "Klicken Sie hier, wenn Sie eine Datei hochladen möchten".
Ich sach nur: Kundenprojekte...