---

layout: post
title: "Layout mit 100 Prozent Höhe"
abstract: 'Diesmal geht es die **Höhe von Div-Containern**. Findige Designer haben sich ausgedacht ein Layout zu basteln, welches eine Fußzeile besitzt die **immer am unteren Bildschirmrand** klebt. Es sei denn der Inhalt ist größer, dann muss die Fußzeile mit runterrutschen.
Soweit kein Problem; vor einiger Zeit habe ich ein [schönes Beispiel](http://www.xs4all.nl/~peterned/examples/csslayout1.html "100% Höhe mit CSS") gefunden welches genau diese Problem löst, in allen Browsern und nur mit CSS. Was aber, wenn die Seite mit dem [**960 Grid System** CSS Framework](http://www.960.gs "960.gs CSS Framework") aufgebaut wurde und nicht nur ein Footer hat sondern **zwei**?
Um genau zu sein, ist die Breite vom CSS Framework auf 960 Pixel beschränkt, der Footer mit Inhalten befindet sich innerhalb des umfassenden Containers, aber die Hintergrundgrafik soll **über die gesamte Breite gehen**.
Unmöglich? Niemals! Es folgt eine **Skizze**, der **Lösungsansatz** und ein paar Worte über das **960.gs**.'
categories: CSS, jQuery
redirect_from: "2009/03/31/layout-mit-100-prozent-hohe/"

---

## Die Anforderung
Diese Skizze soll das Problem verdeutlichen. Der weiße Bereich ist der Inhalt welcher sich in der Höhe ausdehnt und den gesamten Platz ein nimmt.
Header und Footer sollen aber über die gesamte Breite gehen, wobei die Inhalte sich aber am Content orientieren müssen da die gesamte Seite zentriert ist.
"_Viel Spaß_" hat der Designer gesagt, hatte ich auch!

## Das 960.gs
**CSS Frameworks** sind in aller Munde und es lassen sich damit wirklich schnell und einfach Layouts aufbauen. Ich habe mich in diesem Projekt gegen das kompliziertere, aber dafür flexiblere [YAML](http://www.yaml.de "YAML ist auch ein CSS Framework") entschieden weil es mir überdimensioniert erschien.
Im 960.gs entscheidet man sich für ein **12-** oder **16-spaltiges** Layout und benennt, je nach dem, den umfassenden Container:

    <div class="container_16"></div>

Anschließend hat man innerhalb mit den Klassen **grid\_1** bis **grid\_16** (bzw. grid\_12) beliebige Möglichkeiten zur Steuerung der Inhalte. Auch die **Integration in TYPO3** ist natürlich überhaupt kein Problem, mein Template sieht für das oben beschriebene Projekt so aus:

    <div class="outerwrap">
        <div class="container_16 wrap png_fix">
            
            <!-- KOPF -->
            <div class="grid_11 top">
                <ul class="menu sf-menu">
                    ###MAIN_MENU###
                </ul>
            </div>
            
            <div class="grid_4 top logo">
                ###LOGO###
            </div>
            
            <!-- TEASER (Bild) -->
            <div class="grid_11 teaser left">
                ###TEASER###
            </div>
            
            <div class="grid_4 teaser right png_fix">
                ###LOGIN###
            </div>
    
            
            <!-- CONTENT -->
            <div class="content_wrap">
                
                <!-- ganze spalte -->
                <div class="grid_11 left">
                    <div class="content">
                        ###CONTENT_LEFT###
                    </div>
                </div>
                
                <!-- Rechts vom Inhalt -->
                <div class="grid_4 right png_fix">
                    ###CONTENT_RIGHT###
                </div>
                
                <div class="clear"></div>
            </div>
            
            
            <!-- FOOTER -->
            <div class="footer_wrap">
                <div class="grid_11 footer">
                    ###COPYRIGHT###
                </div>
                
                <div class="grid_4 footer">
                    <ul>
                        ###FOOTER_MENU###
                    </ul>
                </div>
                
                <div class="clear"></div>
            </div>
        </div>
    </div>

Ein allgemeines Problem von CSS Frameworks wird in diesem Template auch gleich sichtbar: **CSS Frameworks neigen zur Divirites**. Dafür wird einem aber eine große Menge CSS-Nerv abgenommen. Hier bleibt kritisch zu betrachten wie viel Traffic die Seite zu erwarten hat und wie viel Zeit für die Realisierung veranschlagt wurde.

## 100% Höhe Nr. 1
Die kleinere Aufgabe besteht darin den **Footer an das untere Ende der Seite** zu kleben. Das geht mit dem Tutorial von [xs4all](http://www.xs4all.nl/~peterned/examples/csslayout1.html "100% Höhe mit CSS") ganz leicht: Der Container _wrap_ bekommt eine relative Position zugewiesen und eine**Mindesthöhe von 100%**_._
Der _footer\_wrap_ wird **absolut positioniert** und mit _bottom:0_ an den unteren Rand vom _wrap_ gelegt. Damit bei längerem Inhalt oder kleinem Browserfenster, der Inhalt nicht über den Footer reicht kriegt der Container _content\_wrap_ einen Innenabstand (_padding_) nach unten, welcher der Höhe vom **Footer plus Abstand** enthält. Das ist der Trick!

## 100% Höhe Nr. 2
Jetzt hat der Footer noch kein Hintergrundbild. Damit es über die gesamte Breite geht kriegt es der Container _outerwrap_. Der hat allerdings ein Problem: Bei 100% Höhe hängt der Balken immer am **unteren Browserrand**. Wenn die Inhalte länger sind, bleibt der Balken einfach stehen. Im Bild repräsentiert der schwarze Rahmen das Browserfenster.
Da im guten **Standard Typoscript** sowieso **jQuery** eingebunden ist und für diverse Zwecke genutzt wird, kann das Lieblingsframework hier treue Dienste leisten:
Die **Besucher ohne JavaScript** kriegen einfach keinen Balken zu sehen. Dem Container _outerwrap_ wird das Hintergrundbild wieder genommen und statt dessen der Klasse _balken_ zugewiesen. Im jQueryscript wird eine Funktion hinzugefügt: _fix\_outerwrap\_bug()_. 
    
    function fix_outerwrap_bug() {
        $(".outerwrap")
            .addClass("balken")
            .css("height", $(document).height());
    }

Damit erhält der Container _outerwrap_ die Klasse _balken_ (sofern noch nicht vorhanden; das checkt jQuery von alleine) und die **Höhe des Dokuments** zugewiesen. Die Funktion muss beim laden der Seite aufgerufen werden:

    jQuery(function($) {
        fix_outerwrap_bug();
    });

Funktioniert einwandfrei, allerdings nur beim ersten laden der Seite. Der findige Internetbenutzer der die **Größe des Browserfensters** verändert kriegt Blödsinn zu sehen. Deshalb noch eine Zeile hinzufügen:

    $(window).resize(function() { fix_outerwrap_bug(); });

Eigentlich selbsterklärend: Bei Größenänderung (_resize()_) vom Fenster (_$(window)_) wird die Funktion _fix\_outerwrap\_bug()_ aufgerufen. Das wars!

## Fazit
Das es ohne JavaScript nicht funktioniert ist natürlich nicht ganz so schön, aber für eine Kleinigkeit im Design zu verkraften. Selber Schuld wer JavaScript deaktivert. **Dank jQuery** ist es ganz einfach und validieren tut es auch, warum also nicht?
Wer die vorgestellte **Lösung in Aktion** sehen will, dem sei ein Besuch auf der Seite [http://www.arminiusfunds.com](http://www.arminiusfunds.com "ArminiusFunds") ans Herz gelegt. **Viel Spaß **und frohes investieren!