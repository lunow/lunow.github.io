---

layout: post
title: "Schönes Javascript mit Callbacks"
abstract: 'Callbacks sind jedem jQuery Anweder bekannt. Von \[pre\]onClick\[/pre\] bis zu \[pre\]onResize\[/pre\] bindet der Webentwickler jede Menge Logik an festgelegte Events. Meiner Meinung nach eine angenehme Art zu programmieren und gut nachvollziehbar, da der Code gut lesbar bleibt, sofern man nicht übertreibt.
Wenn man selbst Applikationen programmiert die auf Javascript basieren und später noch diverse Erweiterungen ermöglichen sollen, dann macht es durchaus Sinn eigene Callbacks anzubieten. Sei es in einer jQuery Extension oder einer eigenen Applikation.'
categories: Entwicklung, jQuery, Tutorial
redirect_from: "2011/12/07/schones-javascript-mit-callbacks/"

---

## Die Anforderung
Zur Erfüllung meiner aktuellen Anforderung habe ich eine Javascript Klasse erstellt die mit dem Operator \[pre\]new\[/pre\] erstellt werden kann:

    var myObject = new FunkyObject();

Perfekt für die erste Anforderung, aber sobald weitere Entwickler involviert werden oder man Teile der Applikation sogar als OpenSource Software veröffentlicht, wäre es ja schön wenn nicht jeder im eigenen Code rum macht sondern ordentlich in seinem Script bleibt:

    var myObject = new FunkyObject({
        onLoad: function() {
            //do crazy custom things
        }
    });

Sieht ordentlich aus und ist ohne Kommentare selbsterklärend: Beim laden werden verrückte Sachen getan. Aber was tut das FunkyObject um die Callbacks aufzurufen?

## Eine Javascript Klasse
Genau genommen ist eine Javascript Klasse nichts weiter als eine Funktion die sich selbst zurück gibt und über den \[pre\]new\[/pre\] Operator erstellt wird. Meine Grundlage sieht so aus:

    var FunkyObject = function(args) {
        var defaults = {};
        this.args = $.extend(defaults, args);
        this.goCrazy();
        return this;
    };

Dieser Code setzt jQuery voraus, das die Funktion \[pre\]$.extend\[/pre\] mitbringt. Damit wird das übergebene \[pre\]args\[/pre\] Objekt durch die in \[pre\]defaults\[/pre\] angegebenen Werte aufgefüllt, sofern sie nicht vorhanden sind. Man kann also für das \[pre\]onClick\[/pre\] Event ein Standardverhalten hinterlegen:

    var FunkyObject = function(args) {
        var defaults = {
        onLoad: function() {
            //default behavior
        };
        this.args = $.extend(defaults, args);
        this.goCrazy();
        return this;
    };

Die Funktion \[pre\]goCrazy()\[/pre\] wird ausgeführt sobald die Klasse initialisiert wird. Um dem nächsten Entwickler die Möglichkeit zu geben auch diese Funktion zu überschreiben, werden alle Grundlagen in der \[pre\]prototype\[/pre\] Eigenschaft der Klasse definiert:

    var FunkyObject = function(args) { /* ... */ };
    FunkyObject.prototype.goCrazy = function() {
        // do the init stuff
    };

Mit diesem Konstrukt könnte ein Entwickler im eigenen Script jene Klasse überschreiben ohne in den eigentlichen Quelltext eingreifen zu müssen.

    myObject.goCrazy = function() {
        // custom constructor
    }

Das als kleine Anmerkung am Rande, das erklärte Ziel ist der komfortable Aufruf des \[pre\]onLoad\[/pre\] Events. Natürlich könnte man über \[pre\]this.args.onClick()\[/pre\] einfach die entsprechende Funktion aufrufen, aber sieht das schön aus? Ist das variabel?
Die Antwort lautet nein. 

## Schön und variabel
Viel cooler ist eine total schöne und variable \[pre\]trigger()\[/pre\] Funktion zu schreiben, die in den Parametern nach einem Callback sucht und diesen ggf. ausführt.

    FunkyObject.prototype.trigger = function(action) {
        var callback = 'on'+this.ucfirst(action);
        if(typeof this.args[callback] == 'function') {
            this.args[callback]();
        };
    }

In der \[pre\]goCrazy\[/pre\] Funktion sieht der Aufruf dann so aus:

    var FunkyObject = function(args) { /* ... */ };
    FunkyObject.prototype.goCrazy = function() {
        this.trigger('load');
    };

Die \[pre\]trigger\[/pre\] Funktion baut sich den Eventnamen aus einem \[pre\]on\[/pre\] und dem Parameter \[pre\]action\[/pre\] zusammen und prüft anschließend ob eine Funktion mit diesem Namen vorhanden ist. Ist dies der Fall wird sie ausgeführt.
Leider gibt es keine Javascript Funktion mit dem Namen \[pre\]ucfirst\[/pre\], aber über die Prototype Eigenschaft kann man das String Objekt entsprechend aufrüsten:

    String.prototype.ucfirst = function() {
        return this.substr(0,1).toUpperCase() + this.substr(1,this.length);
    };

Mit diesen zwei Funktionen baut man sich sehr schnell eine Grundlage um variable Scripte zu schreiben die komplett erweitert werden können.

## Parameter für den Callback
Oft muss der Callback über einen gewissen Zustand informiert werden. Für das benutzte Beispiel könnte es die Information sein ob das Laden erfolgreich war. Bei der Definition des Callbacks muss ein Parameter akzeptiert werden:

    var myObject = new FunkyObject({
        onClick: function(success) {
            alert(success ? 'hat geklappt!' : 'fehler');
        }
    });

Die \[pre\]goCrazy\[/pre\] Funktion muss den Status an die \[pre\]trigger\[/pre\] Funktion weitergeben:

    FunkyObject.prototype.goCrazy = function() {
        success = true;
        this.trigger('load', success);
    };

Wir gehen mal von einem grundlegenden Erfolg aus. Das wird es auch sofern die \[pre\]trigger\[/pre\] Funktion beigebracht bekommt was sie mit zusätzlichen Parametern anfangen soll:

    FunkyObject.prototype.trigger = function(action) {
        var callback = 'on'+this.ucfirst(action);
        if(typeof this.args[callback] == 'function') {
            this.args[callback](arguments.shift());
        };
    }

Viele Änderungen sind es nicht. In der vordefinierten Variable \[pre\]arguments\[/pre\] sind sämtliche Parameter vom Aufruf der Funktion gespeichert. Die Array Funktion \[pre\]shift\[/pre\] entfernt das erste Element aus dem Array und gibt den Rest zurück. So wird nicht der Callbackname sinnloser Weise an den Callback gegeben sondern alle andere Parameter. So kann man auch mehr als ein Wert an den Callback schicken:

    FunkyObject.prototype.goCrazy = function() {
        success = true;
        this.trigger('load', success, 'ready', {hello: 'world'});
    };

## Fazit
Ich mag Callbacks. Wenn man ein gutes Grundgerüst hat kann man auf alle Events individuell reagieren. Sollte es ein Callback nicht geben den man wirklich dringend und sofort benötigt kann man mit dem Überschreiben der \[pre\]prototype\[/pre\] Funktion kurzfristig neue Callbacks hinzufügen und später in die Core Anwendung übernehmen.
Wichtig ist aber darauf zu achten keine unendlichen Scripte in den Callbacks unterzubringen. Spätestens nach 20 Zeilen sollte man sich überlegen den Code in einzelne Häppchen aufzuteilen.
Und in eigener Sache noch die Warnung vor gedankenlosem Copy and Paste: Durch Unterschrift auf dem NDA musste ich alle Funktionen umbenennen. Also nachdenken und gute Funktionsnamen benutzen.