---

layout: post
title: "Ajax in Webapplikationen mit CakePHP und jQuery"
abstract: 'Jeder Webentwickler weiß, dass kein Benutzer mehr auf das Neuladen einer Seite warten will. Vorallem nicht, wenn es in Webapplikationen darum geht Elemente hinzuzufügen, zu bearbeiten oder zu entfernen.
Zum Beispiel in einem Tool welches umfangreiche Exportmöglichkeiten besitzt und gerade von einer [jungen, dynamischen Agentur](http://www.kiwi-service.de "Meine junge dynamische Agentur!") entwickelt wird. In dem Programm legt man ein Exportscript an und kann diesem verschiedene Exportdateien zuweisen die beim durchlaufen dynamisch erstellt werden.
Diese einfache 1:n Beziehung ist mit Cake schnell gebacken, mit ein paar Zeilen erweitert und läuft. Allerdings verteilt auf mehreren Seiten. Zum Glück gibt uns Cake einfache Möglichkeiten an die Hand um das zu verhindern.
In diesem Artikel will ich aufschreiben wie man praktisch jedes Cake Projekt zusammen mit dem Lieblings-Javascriptframework jQuery in eine coole Web 2.0 Anwendung verwandeln kann.'
categories: CakePHP, jQuery
redirect_from: "2009/11/21/ajax-in-webapplikationen-mit-cakephp-und-jquery/"

---

## Grundlagen
Ich gehe mal von einer laufenden Cakeanwendung aus. Da gibt es die Tabelle Export und die Tabelle Exportfiles. Die beiden sind über eine 1:n Beziehung verknüpft, die Anwendung wurde gebacken und man verfügt über die normalen CRUD Funktionen.
_Wenn Interesse an einem Tutorial dazu besteht, wäre ein kurzer Hinweis in den Kommentaren oder per Mail nett._

## Der AppController
Den schönsten Teil bringt Cake schon mit: den **RequestHandler**. Mit dessen Hilfe kann man auf Ajaxanfragen reagieren. Als erstes muss er in der Datei **app/app\_controller.php** eingebunden werden:

    $components = array('RequestHandler');

Anschließend stehen in jedem Controller über **$this-\>RequestHandler** umfangreiche Möglichkeiten zur Verfügung. Besonders toll wirds im Callback **beforRender()**. Dieser wird im AppController definiert und von Cake automatisch aufgerufen, wenn die Logik im entsprechenden Controller abgearbeitet wurde.
So sieht die Killerfunktion aus:

    function beforeRender() {
        if($this->RequestHandler->isAjax()) {
           Configure::write('debug', 0);
           if($this->RequestHandler->prefers() == 'json') {
              die(json_encode($this->viewVars));
           }
           else {
              $this->layout = 'ajax';
           }
        }
    }

Was hier passiert ist so gut wie selbsterklärend: Wenn es sich um eine asynchrone Anfrage handelt **if($this-\>RequestHandler-\>isAjax())**, dann wird als erstes jegliche Debugausgabe verboten. Das muss man sich unbedingt merken, sonst besteht die Gefahr auszuflippen weil **debug()** "aufeinmal" nichts mehr ausgibt. Auf der anderen Seite kann man aber nicht mit einem JSON String in Javascript weiterarbeiten, wenn dem ein Datenbanklog am Hintern an der schließenden Klammer klebt. _Also nicht vergessen!_
Nach dem Cake weiß, das es eine Ajaxanfrage bearbeitet, wird geprüft, welche Rückantwort erwartet wird **$this-\>RequestHandler-\>prefers()**. Wenn diese JSON ist, werden alle **viewVars**, dass sind alle Variablen die über **$this-\>set() **im Controller gesetzt wurden, als JSON Objekt zurück gegeben. Damit stehen dem Javascript alle Informationen zur Verfügung die sonst im View verarbeitet werden. Toll oder?
Dieses **die(json\_encode()) **finde ich noch nicht ganz so elegant wie der ganze Rest von Cake, tut aber seine Arbeit. Vielleicht hat jemand einen schöneren Ansatz?!
Wenn die Anfrage kein JSON erwartet, wird nicht das Standardlayout genutzt, sondern auf das Ajax umgeschaltet. Das befindet sich in der Datei **app/views/layouts/ajax.ctp** und besteht nur aus einer Zeile:

    <?php echo $content_for_layout; ?>

## Standardlayout
Um Probleme beim ändern der BaseURL zu vermeiden habe ich mir angewöhnt im Standardlayout das Tag **base** zu verwenden um mit jQuery schnell auf die URL zugreifen zu können. In der Datei **app/views/layouts/default.ctp** muss dafür folgende Zeile hinzugefügt werden:

    <base href="http://<?=$_SERVER['HTTP_HOST']?><?=$this->base?>/" host="http://<?=$_SERVER['HTTP_HOST']?>" />

Ich weiß, das Attribut **host** verhindert eine komplette Validierung, allerdings brauche ich in einigen Fällen nur den Host und in anderen die komplette BaseURL, da zum Beispiel die erstellen Formulare mit **$form-\>create(...) **schon die BaseURL enthalten.
Das wird man gleich sehen.

## jQuery Action
Da sind jetzt in wenigen Zeilen mächtige Grundlagen gelegt worden, die man mit jQuery an seiner Seite ausnutzen möchte. Im Formular zur Erstellung eines neuen Exports habe ich ein Button "Neue Exportdatei", die bei Klick in den Container **div\#new** das Formular lädt um eine neue Datei zu speichern. Nichts leichter als das:

    $ajax({
        url: $('base').attr('href')+'exportfiles/add/export:'+$('#ExportEditForm').attr('rel'),
        dataType: 'html',
        success: function(form) {
            $('#new').html(form);
        }
    };

Als benannten Parameter wird die ID des aktuellen Exports übergeben. Im Controller steht diese Information im Array **$this-\>params\['named'\]** zur Verfügung. Von da wird sie an den View übergeben und hier wird, sofern gesetzt ein verstecktes Formularfeld erzeugt, anstatt der gebackenen Liste der vorhandenen Exports.
Mit der Verwendung des Ajax-Layouts und der Angabe **dataType: 'html'** steht in der Variable **form** der Success Funktion genau das Formular zur Verfügung, welches im View definiert wurde.

## JSON benutzen
Wenn das Formular ausgefüllt wurde, muss man das Abschicken abfangen. Leider unterstützt die **Live** Funktion noch nicht den Event **submit**, deshalb muss man sich mit einem Klick auf den Submitbutton helfen.

    $('#new .submit input').live('click', function() { ... });

Das wirklick spannende ist natürlich auch hier die Ajaxanfrage und das Geheimnis liegt im **dataType: 'json'**.

    $.ajax({
        url: $('base').attr('host')+$form.attr('action'),
        data: $form.serialize(),
        type: 'POST',
        dataType: 'json',
        success: function(content) {
          if(content.saved) {
              $form.closest('fieldset').prev().find('ul')
                  .find('li.empty').remove().end()
                  .append('<li>Neuer Eintrag <b>'+$form.find('input[type=text]:first').val()+'</b> angelegt.</li>');
          }
          else {
              alert("Leider ist ein Fehler beim speichern aufgetreten.");
          }
        }
    });

In der Variable **$form** ist das jQuery Objekt gespeichert, welches das Formular widerspiegelt, dass gerade abgeschickt wurde. Da man immer wieder darauf zugreifen muss, macht es Sinn das in eine Variable zu legen um Zeit bei der Abarbeitung zu sparen.
In der Variable **content** stehen jetzt dank _AppController_ und _RequestHandler_ alle View-Variablen zur Verfügung. Über das Auslesen des Attributs **Action** des Formulars muss man sich nicht mal mehr Gedanken machen wo das Formular überhaupt abgearbeitet wird. Wichtig ist nur das in der entsprechenden Funktion ein Status gesetzt wird:

    $this->set('saved', true);

## Fazit
Nach genau dem gleichen Prinzip funktioniert auch das Löschen oder jeder andere Anwendungsfall der einem einfällt. Ich bin im Moment mal wieder begeistert von diesen beiden tollen Frameworks und den schier unerschöpflichen Möglichkeiten.
Demnächst gibt es dann hoffentlich mal die Vorstellung von einem fertigen Tool. Bis dahin freue ich mich auf Fragen und Verbesserungsvorschläge. Vielen Dank fürs lesen!