---

layout: post
title: "Nette Erweiterung für jedes Menü mit jQuery"
abstract: 'Es gibt kaum noch ein Menü, welches den Nutzer nicht mit einem **Mouseover-Status** über seine aktuelle Position informiert. Soweit so gut. Meistens sieht es so aus: Der Nutzer klickt auf den Menüpunkt, der Mouseover-Status verschwindet, die Seite verschwindet, die Seite baut sich wieder auf und der eben geklickte Menüpunkt ist dauerhaft hervorgehoben.
Ganz normal. Aber: Mit ein bisschen jQuery lässt sich der Mouseover-Status schon **bei einem Klick festsetzen**. Das sieht gut aus und wirkt fast wie ein dynamisches nachladen der Seite.
Ansehen kann man sich diesen Effekt zum Beispiel hier im Hauptmenü oder auf der Seite von [Isabel von Roon](http://www.freies-herz.de "Isabel von Roon"). Wie der Effekt eingebaut wird, was **find()**, **filter()** und **siblings()** bedeutet und wie man den aktiven Menüpunkt hervorhebt wird in diesem Artikel besprochen.'
categories: jQuery
redirect_from: "2009/07/27/nette-erweiterung-fur-jedes-menu-mit-jquery/"

---

## Die HTML Grundage
Das oben genannte Beispiel ist zu simpel, deshalb machen wir es etwas komplizierter undzwar mit einem verschachtelten Menü.

    <div id="menu">
    <ul>
    <li><a href="#">Punkt 1</a></li>
    <li>
    <a href="#">Punkt 2</a>
    <ul>
    <li><a href="#">Punkt 2.1</a></li>
    <li><a href="#">Punkt 2.2</a></li>
    <li><a href="#">Punkt 2.3</a></li>
    </ul>
    </li>
    <li>
    <a href="#">Punkt 3</a>
    <ul>
    <li><a href="#">Punkt 3.1</a></li>
    <li><a href="#">Punkt 3.2</a></li>
    <li><a href="#">Punkt 3.3</a></li>
    <li><a href="#">Punkt 3.4</a></li>
    </ul>
    </li>
    <li><a href="#">Punkt 4</a></li>
    </ul>
    </div>

Die Funktionsweise ist klar: Bei einem Klick ins Menü darf sich nur das jeweilige Menü verändern (die Nachbarn). Einfach die Aktiv-Klasse generell zu entfernen und dem angeklickten Menüpunkt zuweisen hätte zur Folge, dass beim Klick ins Submenü der darüber liegende Punkt seine Aktiv-Klasse verlieren würde.
[Demo: Hier ansehen was ich meine](http://interaktionsdesigner.de/stuff/mainmenu.php "Pauls Blog jQuery Demo Menü").

## Lovley jQuery
Wer jetzt an ein kompliziertes und umfangreiches Script denkt, der hat noch nicht genug mit jQuery gearbeitet. Denn die Anforderungen benötigen nur **eine einzige Zeile**:

    jQuery(function($) {
        $('#menu a').click(function() {
          $(this).blur().parents('li').siblings('li:has(.active)').find('a').removeClass('active').end().end().end().addClass('active');
          return false;
        });
    });

Was hier passiert ist wird jetzt Stück für Stück durchleuchtet:
**jQuery(function($) {})**
Diese Funktion wird aufgerufen, sobald das DOM fertig geladen wurde. Als Parameter wird das jQuery-Framework übergeben und in der Variable **$** gespeichert. Mit dieser Schreibweise hat man weniger Stress, wenn ein Kollege auf die Idee kommt ein zweites Javascript Framework einzubinden (_Grrr..._)
**$('\#menu a').click(function() {})**
Mit dieser Anweisung werden alle Links im Element mit der ID _Menü_ selektiert und jeder einzelne bekommt einen Eventhandler zugewiesen: _click_.
In der Funktion ist der angeklickte Link in der Variable _this_ gespeichert.
**$(this)**
Mit diesem Konstrukt wird der angeklickte Menüpunkt in ein jQuery-Objekt verwandelt, und liegt als einziges auf dem Elementstack.
**.blur()**
entfernt den gepunkteten Rahmen um den Link. Eine alternative Möglichkeit wäre **outline:none** im CSS anzugeben. Je nach belieben.
**.parents('li')**
Jetzt wird es spannend! Diese Funktion wählt alle Elternelemente aus. Mit der Einschränkung, dass sie vom Typ _li_ sind.
**.siblings('li:has(.active)')**
Siblings steht für Nachbarn. Diese Funktion findet nur die benachbarten Elemente. Klickt man also auf ein Untermenü, befinden sich nach **siblings()** alle LI Elemente _dieser_ Liste im Stack.
Mit der Übergabe eines Selectors kann man die Nachbarn auch gleich einschränken. **li:has('.active')** steht für alle LI Elemente welche ein Objekt der Klasse_.active_ beinhalten.
Alternativ könnte man auch die Funktion **filter()** benutzen. Mit **siblings('li')** werden alle benachbarten LI Elemente ausgewählt. Anschließend mit **filter(':has('.active')')** auf das enthalten sein eines aktiven Links geprüft. Und genau hier liegt der Unterschied zwischen filter() und find():
**Filter()** _filtert_ die Elemente im Stack. **Find()** _sucht_ innerhalb der Elemente im Stack. Logisch, oder?
Mit **siblings('li:has(.active)') **sparen wir uns eine Anweisung und im Stack befinden sich alle benachbarten Elemente, die einen aktiven Link beinhalten. Weiter gehts.
**.find('a')**
Innerhalb des LI Elements wird jetzt nach dem aktiven Link gesucht und dieser ausgewählt.
**.removeClass('active')**
Entfernt die Klasse von dem Link. (Bitte daran denken keinen Punkt vor der Klasse anzugeben!)
**.end()**
Mit der Funktion **end()** wird eine Veränderung im Elementstack rückgängig gemacht. Dabei bezieht sich das **end()** immer auf die als _letztes getätigten Veränderungen_.
Das erste **end()** macht also das **find('a')** rückgängig, im Stack befinden sich jetzt wieder die LI Elemente mit einem (ehemals) aktiven Link.
**.end()**
Als nächstes werden die Nachbarn aus dem Stack geworfen. (_siblings_)
**.end()**
Und jetzt noch die Elternelemente raus und wieder zurück zum Kind: **$(this)**. Wir befinden uns jetzt wieder ganz am Anfang der Auswahl und es bleibt nur noch eine Funktion:
**.addClass('active')**
Diese Funktion weißt dem angeklickten Link die passende Klasse zu, damit beim nächsten Klick das ganze Spiel wieder von vorne beginnen kann.

## Das wars!
Im Beispiel habe ich noch ein **return false;** hinzugefügt. Diese Anweisung verhindert, dass der Browser sein Standardverhalten abspielt (bei Links die angeklickte Seite aufrufen). In einer wirklichen Umgebung darf das natürlich nicht vorkommen.
Ich hoffe ihr konntet etwas aus diesem Artikel mitnehmen. Weitere jQuery **Fragen** und **Beispiellösungen** stelle ich gerne auf Anfrage vor. Nur rein in die Kommentare.
Frohes verketten!