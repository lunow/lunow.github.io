---

layout: post
title: "jQuery UI Progressbar und PHP verbinden"
abstract: 'Der neuste [Release Candidate vom jQuery Userinterface 1.6](http://jqueryui.com/download "jQuery UI 1.6") ist genial! Vor allem das neue Element, [die Progressbar](http://docs.jquery.com/UI/Progressbar "jQuery UI Progressbar"), hat es mir angetan. Die Bedienung ist sehr einfach, einem Element wird die Progressbar zugewiesen und die Bar dehnt sich in den gegebenen Proportionen automatisch aus.
**Herrlich** und sehr einfach mit einer Schleife in JavaScript zu verändern. Aber wie um alles in der Welt kriegt man die Bar dazu den aktuellen Status einer langwierigen **PHP Operation** wider zu spiegeln?
Ich habe eine ganze Weile herumprobiert und das folgende ist dabei heraus gekommen. Hier ist [die Demo](http://www.interaktionsdesigner.de/stuff/progressbar/ "PHP und jQuery UI Progressbar vereint!") und im Beitrag folgt die Beschreibung.'
categories: jQuery, PHP
redirect_from: "2009/02/20/jquery-ui-progressbar-und-php-verbinden/"

---

## Vorüberlegungen
Was man in dieser Situation braucht ist eine **Push-Funktion**. Die Webseite soll eine Verbindung zu einem serverseitigen Script aufbauen und halten. Wenn sich bei dem Script etwas tut, dann kriegt die Seite bescheid und kann darauf reagieren. Opera unterstützt diese Funktion bereits, und sagt dazu [Event Streaming to Web Browsers](http://my.opera.com/WebApplications/blog/show.dml/438711 "Event Streaming von Opera"), aber leider zum Glück entwickeln wir**Applikationen für alle Browser**.
Es gibt eine PHP Klasse, die [Progressbar von David Bongard](http://www.bongard.net/blog/2007/08/14/php-progressbar-update-auf-version-12/ "Progressbar von David Bongard"), welche eine eigene Progressbar auf die Seite bringt. Die ist wirklich gut und funktioniert zuverlässig, aber hat zwei entscheidene Nachteile: Erstens sitzt der User immer vor einer unfertigen Seite (bis die Progressbar fertig geladen ist) und zweitens kann man damit nicht ohne weiteres die Progressbar des UI benutzen.

## Erster Gedanke
Ich gucke mir die Funktionen von Davids Progressbar ab und greife per Ajax auf die dynamisch generierte Datei zu. In der steht dann, je nach Fortschritt, immer etwas anderes drin.
Nun wird die Ausgabe aber über _flush()_ erzwungen, welches zwar eine Ausgabe erzeugt aber nicht dem Browser sagt, dass die Seite fertig geladen wurde.  Diese fehlende Information bringt jQuery dazu solange zu warten, bis alle Schritte ausgeführt wurden, also die Datei vollständig geladen ist und dann erst den Callback auszuführen. Funktioniert nicht, bzw. springt **von Null auf Hundert**.

## Zweiter Gedanke
Im PHP Script muss eine neue Datei erzeugt werden, welche nur den aktuellen Fortschritt als Inhalt hat. Diese kann per jQuery abgefragt werden und das Ergebnis auf der Progressbar dargestellt werden.
**Los gehts!**

## Das PHP Script
Das PHP Script sieht natürlich bei jedem anders aus. In der [Demo](http://www.interaktionsdesigner.de/stuff/progressbar/ "Progressbar und PHP") ist es einfach nur eine Schleife mit einer Sleep-Anweisung.
    
        ob_start();
        $filename = 'remote-bar-'.$_GET['fn'].'.temp';
        for($i = 1; $i <= 10; $i++) {
            echo $i.'0<br>';
            ob_flush(); flush();
            $fh = fopen($filename, 'w');
            fwrite($fh, $i."0");
            fclose($fh);
            sleep(1);
        }
        
        unlink('remote-bar-'.$_GET['fn'].'.temp');

Ich habe den Ausgabechache benutzt und eine Ausgabe erzeugt, was eigentlich sinnlos ist, aber zum Testen ist es praktisch. Die wesentlichen Funktionen sind die Filehandler: es wird_eine Datei geöffnet_, der Inhalt mit dem aktuellen Schritt _überschrieben_ und wieder _geschlossen_. Anschließend wartet das Script für eine Sekunde und führt das Ganze dann wieder von vorne aus.
Der Parameter **fn** wird gleich per JavaScript gesetzt, damit nicht alle Benutzer in die gleiche Datei schreiben.

## jQuery
Kurz angemerkt sei, dass im HTML ein Container mit der ID _bar_ vorhanden sein muss, logisch oder? Der Rest ist mehr oder weniger dem aktuellen Layout geschuldet.
    
    var res = 0;
    var fn = Math.random(0, 999)+"";
    fn = fn.substr(5, 10);

Es geht los mit der Generierung einer zufälligen Zahl für den Dateinamen. Weiter gehts mit dem Script für das Laden der Seite.
    
    jQuery(function($) {
        $("#bar").progressbar({value: 0});
        $.ajax({
            url: "remote.php",
            type: "get",
            data: {fn: fn},
            success: function() {
                $("#watcher").html("Fertig!");
            }
        });
        get_remote();
    });

Wenn das DOM geladen und der Browser bereit ist _jQuery(function($) {_ dann wird die Progressbar mit einem Startwert von 0 initalisiert _$("\#bar").progressbar({value: 0});_. Anschließend (oder in einer "richtigen" Anwendung erst nach einem ausgelösten Eventhandler) wird das PHP Script aufgerufen. Das startet die Schleife, erstellt eine neue Datei und ist erst fertig,wenn der komplette Vorgang ausgeführt wurde.
Anschließend wird die Funktion _get\_remote()_ aufgerufen, welche den aktuellen Status prüft.
    
    function get_remote() {
        $.ajax({
            url: "remote-bar-"+fn+".temp",
            dataType: "text",
            ifModified: true,
            success: function(response) {
                $("#bar").progressbar('option', 'value', response);
                $("#watcher").html(response);
                if(response < 100)
                    setTimeout("get_remote()", 100);
            }
        });
    }

Diese Funktion besteht aus einer einzigen **Ajaxabfrage**. Die Datei _remote-bar-"+fn+".temp_ wird aufgerufen, erwartet wird ein Text als antwort _dataType: "text"_, aber nur wenn sich der Inhalt verändert hat _ifModified: true_.
Wenn ein Rückgabewert besteht _success: function(response)_ wird die folgende Funktion ausgeführt (in der Variable _response_ steht der aktuelle Fortschritt): Der Progressbar wird der ausgelesene Wert zugewiesen, in das Element mit der ID _watcher_ wird der Wert eingefügt und wenn es noch keine 100 (Prozent) erreicht hat, dann wird in 100 Millisekunden erneut die Funktion aufgerufen.
**Das wars.**

## Fazit
In der [Demo](http://www.interaktionsdesigner.de/stuff/progressbar/ "Progressbar und ein PHP Script") kann man sich das Resultat ansehen und ich bin gespannt ob der Server sofort zusammen bricht unter der Last eurer fleißigen und interessierten Tests. Außerdem bin ich mir unsicher, ob das ein sinnvolles Vorgehen war, denn wirklich effektiv scheint es mir nicht zu sein.
Aber **es funktioniert** und ist bestimmt für eine Applikation die nicht von mehreren Benutzern gleichzeitig aufgerufen werden kann (dazu demnächst mehr!). Wenn jemand einen Verbesserungsvorschlag hat, dann bin ich offen und dankbar dafür!
Bis dahin frohes **ausprobieren** und **voranschreiten**!