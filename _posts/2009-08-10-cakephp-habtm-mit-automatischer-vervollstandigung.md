---

layout: post
title: "CakePHP HABTM mit automatischer Vervollständigung"
abstract: 'Wenn man für ein beliebiges Model Posts speichern und eingeben kann, vielleicht weil man [dieser Anleitung](http://www.interaktionsdesigner.de/2009/04/17/mit-cakephp-in-30-minuten-tags-zu-einer-tabelle-hinzufugen/#comment-375 "Pauls Blog erklärt HABTM") gefolgt ist, dann ist das schon ein schöner Fortschritt. Allerdings passieren immer wieder Tippfehler, und ähnlich klingende Begriffe finden sich in der Tagcloud.
Da hilft nur eins: während der Eingabe dem Benutzer **direkt passende Tags vorschlagen**. Eine automatische Vervollständigung wie beim Mailen in den großen sozialen Netzwerken oder beim suchen bei Google.
Zum Glück haben sehr schlaue Leute schon diverse Plugins erstellt, welche einen JSON String oder eine simple Textliste verarbeiten können. Zum Beispiel [Autobox2](http://www.bigredswitch.com/blog/2008/12/autobox2/ "jQuery Autobox2"). Gleich mal die [Demo](http://www.bigredswitch.com/blog/wp-content/uploads/2008/12/autobox.html "jQuery Autobox2 Demo") angucken, runterladen und dann ins eigene Projekt integrieren.
**So funktionierts...**'
categories: CakePHP, jQuery
redirect_from: "2009/08/10/cakephp-habtm-mit-automatischer-vervollstandigung/"

---

## Vorbereitung
Bestimmt ist **jQuery** schon im gesamten Projekt verfügbar, wenn nicht, muss es unter _views/layouts/default.ctp_ mit Hilfe des [Javascript Helpers](http://book.cakephp.org/view/207/Javascript "Der Javascript Helper von CakePHP") eingebunden werden:

    echo $javascript->link('jquery.min');
    echo $javascript->link('jquery.action');
    echo $scripts_for_layout;

Der Javascript Helper sucht die Dateien **automatisch** im Ordner _webroot/js/_ und bindet sie ein, sofern sie vorhanden sind. In der Datei _jquery.action.js_ befindet sich mein eigenes Script in dem das Verhalten der Seite gesteuert wird.
Sehr wichtig für den nächsten Schritt ist die Ausgabe der Variable _$scripts\_for\_layout_. Diese kann von jedem View aus befüllt werden. Das brauchen wir im View der**Edit/Add Methode** vom Model:

    $javascript->link(array(
        'jquery.templating',
        'jquery.ui.autobox.ext.js',
        'jquery.ui.autobox.js'
    ), false);

Damit werden die Javascript Dateien **nicht überall** eingebunden, sondern nur auf den Seiten auf denen sie auch benötigt werden.
Nach dem gleichen Prinzip, aber mit dem [HTML Helper](http://book.cakephp.org/view/205/HTML "HTML Helper von CakePHP") wird die Autobox CSS Datei eingebunden.

    $html->css('jquery.ui.autobox.css', null, array(), false);

Und da wir gerade dabei sind, bietet es sich an diese Datei zu öffnen und in der **Zeile 66** den Pfad zum _close.gif_ anzugeben. Wenn sich alles in den korrekten Ordnern befindet ist es einfach:

    background: url('../img/close.gif');

Aussehen wird es gut, aber im Moment weiß das Script nicht wo es sich befindet. Damit die **Baseurl** auch in Javascript zur Verfügung steht, habe ich mir angewöhnt im HTML Gerüst das Basetag zu erweitern:

    <base href="http://<?=$_SERVER['HTTP_HOST']?><?=$this->base?>/" host="http://<?=$_SERVER['HTTP_HOST']?>" />

Mit dieser Zeile im Layout wird später vieles einfacher. Leider validiert es mit dem Attribut host nicht mehr, wer darauf Wert legt, muss sich also eine andere Lösung überlegen.

## jQuery Action
Jetzt gehts los und das Plugin wird initalisiert. Ich mache das gerne in der Datei _jquery.action.js_. Um es auf die schnelle zu testen, kopiere ich einfach das Beispiel aus der Demo. Gemäß des letzten Posts zu HABTM heißt mein Feld **temp\_tags**. Das resultiert in der ID **ModelTempTags**:

    jQuery(function($) {
        
        var list1 = [{text: 'Curious George'}, {text: 'George of the Jungle'}, {text: 'Felix the Cat'}];
        
        $('#ModelTempTags').autobox({
            list: list1,
            match: function(typed) { return this.text.match(new RegExp(typed, "i")); },
            insertText: function(obj) { return obj.text },
            templateText: "<li>Hey: <%= text %></li>"
        });
    });

Seite neuladen, und... herrlich! **Funktioniert**. Nur eine Kleinigkeit: Die vorhandenen Tags werden nicht übernommen. Zum Glück hilft eine einzige Zeile um das Problem zubeheben. Innerhalb der Autobox Konfiguration wird die Vorbelegung (**prevals**) angegeben:

    prevals: $('#LinkTempTags').val().split(', ')

Mit dieser Zeile wird der Inhalt ausgelesen, beim Komma geteilt und der Autobox als Vorbelegung übergeben. Dann kanns jetzt losgehen mit der **asynchronen Datenübertragung**. Das Attribut **list** in der Autobox Konfiguration wird ausgetauscht mit einer URL:

    ajax: $('base').attr('href')+'tags/index',

Damit wird im Parameter **val** die Benutzereingabe an den _Tags Controller_ geschickt. Und der muss jetzt noch reagieren.

## Antworten mit CakePHP
Der **Controller Tags** ist dafür zuständig eine Liste zu genierieren. In der Variable **$this-\>params\['url'\]\['val'\]** steht die Benutzereingabe zur Verfügung. Mit der wird eine Datenbankabfrage gestartet:

    $tags = $this->Tag->find('all', array('conditions' => array('title LIKE' => $this->params['url']['val'].'%'), 'order' => 'Tag.title ASC'));

Mit Hilfe der **RequestHandler Componente** wird ein Ajaxaufruf erkannt. Dafür muss die Componente im **Controller** eingebunden werden.

    class TagsController extends AppController {
        var $components = array('RequestHandler');

In der**Index Funktion** wird bei einem Ajaxaufruf der Renderingprozess gestoppt und purer Text zurück gegeben.

    if($this->RequestHandler->isAjax()) {
        Configure::write('debug', 0);
        $this->autoRender = false;
        return '['.implode(',', Set::format($tags, '{text: "{0}"}', array('{n}.Tag.title'))).']';
    }

Besondere Aufmerksamkeit verdient die letzte Zeile. _Implode_ bekommt ein _Array_, das aus dem Core Utility **Set** stammt: [Format](http://book.cakephp.org/view/672/format "CakePHP Set::format()"). Eine großartige Funktion die ein **verschachteltes Array umformatiert**. In diesem Fall zu JSON Objekten, welche dann mit einem Komma verbunden werden.
Das wars! Kaum zu glauben, aber ein Neuladen macht die Einbindung komplett. Und den Webentwickler fröhlich!

## Speichern im Model
Das Plugin erstellt für jeden Tag ein verstecktes Formularfeld, welches den gleichen Namen hat wie das Ursprungsfeld. Damit die eingegebenen Daten übertragen werden, muss der Name auf ein Array hinweise:

    echo $form->input('temp_tags', array('name' => 'data[Model][temp_tags][]');

Der Trick sind die **beiden eckigen Klammern am Ende**. Damit steht die Eingabe im Model als Array zur Verfügung:

    debug($this->data['temp_tags']);