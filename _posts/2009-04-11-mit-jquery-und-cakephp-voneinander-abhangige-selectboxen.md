---

layout: post
title: "Mit jQuery und CakePHP voneinander abhängige Selectboxen"
abstract: '**CakePHP ist genial**, nicht nur was die Erstellung von Formularen angeht. Aber leider setzt der integrierte AjaxHelper Prototype voraus und als **überzeugter jQuery-Nutzer** kommt das für mich nicht in Frage.
Nun gibt es aber beim aktuellen Projekt folgendes Problem: Einem Projekt wird ein Kunde zugeordnet und jedes Projekt kriegt einen Ansprechpartner. Dieser Ansprechpartner ist in der User-Datenbank gespeichert und besitzt eine ID zu einem Kunden.
Legt man ein neues Projekt an und wählt einen Kunden aus, sollen nur noch die passenden Ansprechpartner angezeigt werden.
**Nichts leichter als das!** Hier stelle ich meine sehr flexible Möglichkeit für die Umsetzung mit **jQuery** und **CakePHP** vor. _Grundwissen allerdings vorrausgesetzt._'
categories: CakePHP, jQuery
redirect_from: "2009/04/11/mit-jquery-und-cakephp-voneinander-abhangige-selectboxen/"

---

## Vorbereitungen
_(Alle CakePHP Pfadangaben beziehen sich auf den __app/ Ordner)_
**jQuery muss eingebunden werden**. Dafür will ich den **Ajaxhelper** benutzen. Da das gesamte Projekt mit jQuery arbeiten soll, habe ich es für alle Controller auf einen Schlag eingebunden, und zwar in der Datei _app\_controller.php_.

    class AppController extends Controller {
        var $helpers = array('Ajax');
    }
    

Die Javascriptdateien kommen in den Ordner _/webroot/js/_ und sind anschließend im**Default Layout** (oder welchem auch immer) in der Datei _views/layouts/default.ctp_ schnell eingebunden:

    echo $javascript->link(
        array(
            'jquery.min.js',
            'jquery.action.js',
        )
    );

Damit der absolute Pfad der Anwendung in der JavaScript Datei zur Verfügung steht, wird im Layout das Tag **<base\>** gesetzt. Das wird dann ausgelesen:

    <base href="http://<?=$_SERVER['HTTP_HOST']?><?=$this->base?>/" />

## Das Formular
Um für das neue Anlegen und das Bearbeiten von Projekten nicht zwei Formulare pflegen zu müssen, habe ich das Formular in ein **Element** ausgelagert, es befindet sich jetzt in der Datei _views/elements/projectform.ctp_ und wird im View _add.ctp_ und _edit.ctp_ mit dem Befehl

    echo $this->element("projectform");

eingebunden. Die Datei selbst besteht, gekürzt, aus folgenden Zeilen:

    $c = array('') + $customers;
    echo $form->input('customer_id', array(
        'class' => 'relation',
        'rel' => 'ProjectContact',
        'data' => 'users|customer_id',
        'options' => $c
    ));
    echo $form->input('contact', array(
        'options' => $contacts
    ));

In der ersten Zeile wird das Array **$customers**, welches im Controller gesetzt wurde, um ein leeres Element am Anfang erweitert. Als nächstes folgen ein paar Erweiterungen für das zu erzeugende HTML Element auf die mit jQuery dynamisch zugegriffen wird.
'class' =\> '**relation**' ist der grundlegende Hinweis für jQuery das hier was passieren soll.
'rel' =\> '**ProjectContact**' bezeichnet die ID des Selectors welches die dynamischen Inhalte darstellt.
'data' =\> '**users|customer\_id**' enthält zwei Teile: **users** steht für das Model aus dem die Daten gezogen werden, **customer\_id** ist die Spalte die mit dem Wert dieser Selectbox verglichen wird.
'options' =\> **$c** weißt dann nur noch das neue Array dem Element hinzu.

## jQuery Action
Weiter gehts in der Datei _webroot/js/jquery.action.js_. Als erstes muss die Baseurl ausgelesen werden.

    if($("base").length == 1)
        BASEURL = $("base").attr("href");
    else {
        alert("Keine BaseUrl gefunden!!!");
    }

Als nächstes kommt die **geballte Action für die Selectbox**. Erstmal der ganze fette Block **jQuery-Schönheit** vorweg, anschließend Zeile für Zeile erklärt. Für weitere dynamische Selectboxen muss man diesen Code dann nicht mehr anpassen:

    $("select.relation").each(function() {
      //Vorhandene Elemente entfernen
      target = "#"+$(this).attr("rel");
      $(target).find("option").remove();
    
      //Eventhandler binden
      $(this).change(function() {
        $(target).find("option").remove();
    
        //Ajaxanfrage abschicken
        data = $(this).attr("data").split("|");
        val = $(this).val();
        if(val > 0) {
          $.ajax({
            url: BASEURL+data[0]+'/get/',
            data: {field: data[1], value: val},
            dataType: 'json',
    
            success: function(j) {
              $.each(j, function(i) {
                $(target).append('<option value="'+i+'">'+this+'</option>');
              });
            },
            error: function(e) {
              alert("Fehler bei der Ajaxanfrage! Siehe Konsole.");
              console.log(e);
            }
          });
        }
      })
    });

**$("select.relation").each(function() {** Jede Selectbox mit der Klasse **relation** dient als Auslöser und braucht spezielle Behandlung.
In der Variable **target** wird die ID der zu ändernde Selectbox, für die spätere Verwendung gespeichert **"\#"+$(this).attr("rel");
$(target).find("option").remove();** entfernt die vorhandenen Einträge.
Jetzt wird der Selectbox ein Eventhandler zugewiesen, der ausgeführt wird, sobald sich der Inhalt der Selectbox ändert: **$(this).change(function() {**.
Falls es die zweite Änderung ist, müssen vorhandene Inhalte entfernt werden **$(target).find("option").remove();** und per Ajax neue Inhalte geladen. Die Variable **val** speichert die aktuelle Auswahl und **data** beinhaltet die Informationen von weiter oben. Wenn eine gültige ID ausgewählt wurde, dann wird die Ajaxanfrage gesendet.
**url: BASEURL+data\[0\]+'/get/'**, gesucht wird die _Funktion get_ im Controller **data\[0\]** (im Beispiel = _users_).
**data: {field: data\[1\], value: val}**, für die Datenabfrage wird **field** und **value** standardmäßig per GET übergeben
und als Rückgabe ein JSON String erwartet **dataType: 'json'**.
Wenn die Anfrage erfolgreich war, wird diese Funktion ausgeführt: **success: function(j) {**
**j** beinhaltet das erhaltene JSON Array und wird Schritt für Schritt durchgegangen **$.each(j, function(i) {** um dem Zielelement **target** eine neue Option hinzuzufügen **$(target).append('<option value="'+i+'"\>'+this+'</option\>')**;
Danach folgt noch ein _Errorhandler_, der je nach belieben gestalltet werden kann, im Großen und Ganzen aber uninteressant ist.
Das wars schon. Jetzt gehts in den Controller User unter_controllers/users\_controller.php_.

## Im Controller
In der URL habe ich die Funktion **get** genannt, also muss sie hier definiert werden:

    class UsersController extends AppController {
        function get() {
        }
    }

Als erstes wird wie gewohnt eine **Liste von Daten** aus dem Model gezogen:

    $list = $this->User->find('list', array(
        'conditions' => array(
            'User.'.$this->params['url']['field'] => $this->params['url']['value']
        )
    ));

Und jetzt wird es spannend, mit Hilfe der **RequestHandler** Komponente, die in der Datei _app\_controller.php_ oder _constrollers/users\_controller.php_ eingebunden wird.

    var $components = array('RequestHandler');

Jetzt steht das Objekt**$this-\>RequestHandler** zur Verfügung, mit dessen Hilfe z.B. abgefragt werden kann ob die ankommende Anfrage per Ajax gesendet wurde. Wenn dies der Fall ist, darf es **keine Debugausgaben** mehr geben und die Liste soll als **JSON String **ausgegeben werden. Und so versteht das auch CakePHP:

    if($this->RequestHandler->isAjax()) {
        Configure::write('debug', 0);
        $this->autoRender = false;
        return json_encode($list);
    }

Fertig! jQuery kriegt jetzt von der Funktion einen JSON String zurück und kann diesen, wie beschrieben, in die Selectbox einfügen.

## Fazit
_Diese Lösung ist nur ein Vorschlag_ und ich bin mir sicher das es viele verschiedene Lösungswege gibt. Wahnsinnig wichtig ist die Tatsache, **dass hier kein bisschen auf die Sicherheit geachtet wurde**. Dieses Beispiel sollte man **nicht unverändert im Livebetrieb einsetzen**!
Ich bin mir auch nicht sicher, ob der gewählte Weg der beste ist. Deshalb freue ich mich diesmal **besonders** über Kommentare mit Anmerkungen und Erweiterungen.
**Frohes backen!**