---

layout: post
title: "Solide Grundlagen für den CakePHP View"
abstract: 'Nach dem wir in der [Ape Unit GmbH](http://www.apeunit.com "Webentwicklung und Medienproduktion") zwei große Projekte mit **CakePHP** aufgebaut haben und ich größtenteils für die Views zuständig war, gibt es **eine Reihe von Grundlagen** auf die ich in einem Cake Projekt nicht mehr verzichten möchte.
Welche das sind, wie sie eingebaut und verwendet werden, ist das Thema dieses Artikels.'
categories: CakePHP
redirect_from: "2010/05/17/solide-grundlagen-fur-den-cakephp-view/"

---

## Im App Controller
Alles fängt im Controller an. Meine erste Tat ist jetzt stets einen **App Controller** anzulegen. Der liegt im Verzeichnis _/app/_ und definiert eine Reihe von Grundlagen.

    class AppController extends Controller {
        var $components = array('Auth', 'Session', 'RequestHandler');
        var $helpers = array('Form', 'Html', 'Javascript', 'Time', 'Text', 'Layout');
    }

Die Components **Auth** und **Session** sind wahrscheinlich schon hinreichend bekannt. Der **RequestHandler** ist mein bester Freund, denn er beinhaltet alle Informationen über den aktuellen Aufruf. Mit seiner Hilfe ist es zum Beispiel möglich zu erkennen ob es sich um **einen asynchronen Aufruf** handelt oder um ein **mobiles Endgerät**.
Die Helper sollten auch soweit klar sein, bis auf **Layout**. Der ist nicht im Core enthalten sondern in der Bakery [verfügbar](http://bakery.cakephp.org/articles/view/anything_for_layout-making-html-from-the-view-available-to-the-layout "Template Inheritance in CakePHP"). Mit diesem Helper im Projekt ist  **Template Inheritance** möglich. Das heißt man definiert im Layout (_/app/views/layouts/default.ctp_) einen Block, zum Beispiel den **Footer**.

    <div id="footer">
        <? $this->Layout->output($footer_for_layout, $this->element('default_footer')); ?>
    </div>

Im Element **default\_footer** (_/app/views/elements/default\_footer.ctp_) befindet sich der Standardfooter. Und den überschreibt man im Bedarf einfach in einem View:

    <?=$layout->blockStart('footer');?>
    Ein <strong>neuer</strong> Footer!
    <?=$layout->blockEnd();?>

Grandios oder? Der im View definierte Inhalt wird dann im entsprechenden Block im Layout ausgegeben. Das Prinzip habe ich bei **Django** gesehen und jetzt zum Glück auch in Cake zur Verfügung.
Noch ein Wort zum **RequestHandler**. In der Funktion **AppController::beforeFilter()** benutze ich folgende Abfrage um auf einen asynchronen Aufruf zu reagieren:

    if($this->RequestHandler->isAjax()) {
        Configure::write('debug', 0);
        if($this->RequestHandler->prefers() == 'json') {
           die(json_encode($this->viewVars));
        }
        else {
           $this->layout = 'ajax';
        }
    }

Wenn es sich um einen Ajaxaufruf handelt**$this-\>RequestHandler-\>isAjax()** dann wird als erstes eine Debugausgabe verhindert **Configure::write('debug', 0);** (das sollte man sich merken!!) und dann überprüft, was für ein Datentyp zurück erwartet wird.
Wenn **JSON Code** angefordert wird, werden alle Variablen für den View in einem JSON Objekt zurück gegeben, andernfalls wird das **Ajax Layout** verwendet, welches einfach den View zurück gibt ohne das ganze HTML Gerüst.
Wichtig ist bei der Verwendung dieser Abfrage daran zu denken **keine sensiblen Daten an den View zu übergeben** und dort zu prüfen ob der Nutzer die Daten sehen darf oder nicht. Aber da wir ja alle strikt dem MVC Pattern folgen, ist das ja auch gar nicht möglich.

## Das Layout
Okay, **jQuery** keine Frage:

    echo $this->Javascript->link(array(
        'jquery.min'
    ));

Die Endung .js kann man sich sparen, Cake sucht die angegebenen Dateien automatisch im Ordner _/app/webroot/js/_.
Zur angenehmen Verteilung des Inhalts benutze ich jetzt immer das [960.gs CSS Framework](http://www.960.gs "Ein grandioses CSS Framework"). Es gibt einen grandiosen [Konfigurator](http://www.spry-soft.com/grids/ "960.gs Konfigurator") mit dessen Hilfe man sich sehr schnell ein passendes Grid zusammenstellt. Die erzeugte CSS Datei legt man im Ordner _/app/webroot/css/_ ab und bindet sie mit Hilfe des **HTML Helpers** ein.
Außerdem benutze ich den [CSS Reset von Eric Meyer](http://meyerweb.com/eric/tools/css/reset/) um eine einheitliche Ausgangslage in allen Browsern zu erreichen. In der Datei **layout.css** binde ich dann je nach Komplexibilität weitere CSS Dateien über **import url()** ein.

    echo $this->Html->link(array(
        '960',
        'reset',
        'layout'
    ));

Um in jQuery immer die richtige Baseurl für Ajaxanfragen zur Verfügung zu haben, nutze ich das Base Tag:

    <base href="http://<?=env('HTTP_HOST').$this->base?>/" />

## HTML Gerüst
Das**960.gs** verlangt einen umfassenden Container mit der Klasse **container\_XX**, wobei das XX für die Anzahl der Spalten steht. Was sich außerdem bewäht hat ist, **Controller** und **Action** als Klasse auszugeben um per CSS einzelne Ansichten individuell gestallten zu können. In meinem Layout führt das zur folgenden Monsterzeile:

    <div id="wrap" class="container_16 <?=$this->params['controller']?> <?=$this->params['action']?> <?=$this->params['controller']?><?=ucfirst($this->params['action'])?>">

Alle Views des Controllers **Blogs** haben jetzt die Klasse **\#wrap.blogs**. Und jede einzelne View lässt sich mit **\#wrap.blogsAdd** gezielt ansprechen. Außerdem können auch alle Formular zum hinzufügen von neuen Einträgen angesprochen werden: **\#wrap.add form**.
Damit ist man schon sehr flexibel.
Noch ein Satz zu **960.gs**: die Aufteilung des Inhalts in Spalten erfolgt über das verteilen von Klassen. Diese haben immer das Format **grid\_XX**, darauf folgt immer ein Container mit der Klasse **clear**.

    <div class="grid_8">Linke Hälfte</div>
    <div class="grid_8">Rechte Hälfte</div>
    <div class="clear"></div>

Das teilt den Inhalt in zwei gleiche Teile. Es ist über die Klassen **pull\_XX** und **push\_XX** auch möglich Abstände einzufügen. Einfach ein bisschen rumspielen.

## Hilfe und Informationen
Alle **Core Components** und **Helper** liegen bestens dokumentiert in eurem Projekt! Um schnell zu erfahren wie die verdammte Funktion im **RequestHandler** heißt, öffnet man einfach die entsprechende Datei in _/cake/libs/controller/components/_.
Im Verzeichnis _/cake/libs/_ ist Cake genau so aufgebaut wie im eigenen Ordner _/app/_. Daran muss man unbedingt denken und diese **wertvolle Quelle **nutzen. Aber: **niemals Änderungen vornehmen!!!** **NIEMALS**. Absolut verboten, denn damit verliert man die Updatefähigkeit. Alle Dateien die man anpacken darf liegen im _/app/ _Ordner. Wenn man jetzt wirklich nicht drum rum kommt und zum Beispiel im **Time Helper** etwas ändern muss, dann kopiert man die komplette Datei und legt sie in den Ordner _/app/views/helpers/_. Jetzt darf man sie verändern **wenn es unbedingt sein muss**.
Unter [http://www.cakephp.org](http://www.cakephp.org) findet man eine ganze Reihe nützlicher Links und Ressourcen, dass ist ja klar. Für deutschsprachige Cake Entwickler bietet sich außerdem noch das [CakeForum](http://www.cakeforum.de "CakePHP Forum für deutschsprachige Entwickler") an, da bin [ich](http://www.cakephp-forum.com/member/paul/ "Icke im Cake Forum") auch ab und zu unterwegs.

## Fazit
**CakePHP ist ein grandioses Framework**, die aktuelle Version 1.3 macht großen Spaß und ich kann es kaum erwarten das unsere Projekte endlich das digitale Licht des Internets erblicken.
Infohäppchen gibt es in meinem [Twitter Account](http://www.twitter.com/paul_lunow "Paul Lunow auf Twitter"), richtig gute Hilfe und Unterstüztung leistet die [Ape Unit GmbH](http://www.apeunit.com "Webentwicklung aus Berlin") gegen Bares oder Mitarbeit und wenn du einen Job suchst, dann freue ich mich auf einen Besuch auf unserer Seite der [offenen Stellen](http://www.apeunit.com/jobs "Webentwickler gesucht in Berlin")!
Frohes backen!