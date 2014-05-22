---

layout: post
title: "Voneinander abhängige Selectboxen mit jQuery"
abstract: 'Folgendes Szenario: Für einen Kunden gibt es ein sehr umfangreiches Formular mit einer Menge Eingabemöglichkeiten, die voneinander abhängig sind. Zum Beispiel bedeutet die Auswahl von "monatlich", "vierteljährlich", "halbjährlich" und "jährlich" eine Veränderung der Auswahlbox von Monaten (0-11). Wählt man "halbjährlich" darf nur noch 0 oder 6 ausgewählt werden.
**Nichts leichter als das**, habe ich gesagt, jQuery kann schließlich alles. Töten wir den Internet Explorer? _Nein_, das können wir nicht (bla bla), dann wirds halt etwas komplizierter.'
categories: jQuery
redirect_from: "2009/02/14/voneinander-abhangige-selectboxen-mit-jquery/"

---

## Vorbereitungen
Im Formular befinden sich **zwei Selectboxen**: 
    
    <select name="frequency" id="select-frequency">
        <option value="1">monatlich</option>
        <option value="3">viertelj&auml;hrlich</option>
        <option value="6">halbj&auml;hrlich</option>
        <option value="12">j&auml;hrlich</option>
    </select>
    <!-- und die zu beeinflussende Box-->
    <select name="months" id="select-months">
    <?
        for($i = 0; $i < 12; $i++) {
            echo "<option value='{$i}'>{$i}</option>";
        }
    ?>
    </select>

Der Einfachheit habe ich den ganzen HTML Schnickschnack weg gelassen. Es geht schließlich nur um diese zwei.

## Nachdenken
Mein erster Gedanke war einfach die entsprechenden Option-Tags aus der Selectbox auszublenden (**hide()**). Aber das funktioniert (natürlich) nicht im IE.
Also muss eine Kopie der Box angelegt werden (_class="active"_) und daraus die überflüssigen Auswahlmöglichkeiten entfernt werden. Die alte Box wird versteckt und bei erneutem Aufruf der Funktion wieder als Ausgangsmaterial verwendet.

## jQuery

    $("#select-frequency").change(function() {
        new_frequency = $(this).val();
        form = $(this).parents("form");
    });

Der Eventhandler wird ausgelöst sobald sich der Inhalt der ersten Selectbox ändert. Die Variable _new\_frequency_ speichert den ausgewählten Wert und _form_ kriegt den Kontext.
Kontext? Die Funktion um Elemente auszuwählen erlaubt die Übergabe von zwei Parametern: $(_selctor_, _context_). Selektoren kennt man ja. Der Kontext gibt der Engine einen Tipp, wo wir das Element erwarten. In einer langen Seite geht es dadurch viel schneller.
Es gibt aber noch einen entscheidenen Vorteil: hat man z.B. mehrere Teile eines Formulars, die einen identischen Aufbau haben, wird mit einem Kontext deutlich in welchem Teil gearbeitet wird.

        $("select[name=months]", form)
            .clone().hide().insertAfter("select[name=months]").end().addClass("active")
            .find("option").filter(function(i) { return i%new_frequency == 0 ? false : true; }).remove();

Es wird also die Selectbox mit dem Namen _months_ im gleichen Formular ausgewählt.
Als nächstes wird sie per **clone()** kopiert, mit **hide()** versteckt und anschließend gleich dahinter nochmal eingefügt (der Klon).
Mit **end()** wird der Klon aus dem Elementenstapel entfernt und dann der sichtbaren Selectbox die Klasse _active_ zugewiesen.
_Erster Teil geschafft! _Danach werden alle Option-Tags in den Elementenstapel geladen und mit der Funktion **filter()** aussortiert. Der Funktion **filter()** kann man nicht nur eine Eigenschaft zuweisen, z.B. **filter("span")** oder **filter(".active")** sondern auch eine Funktion! Diese muss _true_ zurückgeben, damit das Element im Stack bleibt. Hier also eine Modulo Operation ([jippi](http://www.interaktionsdesigner.de/2009/01/27/modulo-verstehen-und-benutzen/ "Endlich Modulo verstehen!")) die prüft ob der aktuelle Monat zur gewählten Frequenz passt. Ist dies nicht der Fall, bleibt das Element im Stapel und wird anschließend mit **remove()** entfernt.
Das funktioniert jetzt genau einmal. Nett, aber die Leute sind sich ja nie sicher. Deshalb wird vor der gerade vorgestellen Anweisung noch eine Abfrage eingefügt:
    
        if($("select.active", form).length > 0) {
            $("select[name=months]", form).filter(".active").remove().end().show();
        }

Wenn im aktuellen Formular eine Selectbox enthalten ist, die schon kopiert wurde (also unvollständig ist), dann werden beide ausgewählt (also auf den Elementenstapel gelegt), das aktive ausgewählt und entfernt. Mit **end()** wird die Auswahl wieder zurück gesetzt, es befindet sich also nur noch das versteckte Original im Stapel, das wird angezeigt.
Anschließend kann die Funktion von oben greifen und, je nach Auswahl, die Box verändern.

## Fazit
Das funktioniert im _Internet Explorer 6_ und _7_ und im Firefox hervorragend. Weitere Browser werden dann bei Bedarf getestet.