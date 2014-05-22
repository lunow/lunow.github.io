---

layout: post
title: "Viele Elemente dynamisch aktualisieren"
abstract: 'Ein aktuelles Projekt interagiert auf sehr starke Art und Weise mit dem Benutzer. Das bedeutet neben einer anpassbaren Oberfläche wird der Benutzer **ständig über den Status** diverser Objekte auf dem laufenden gehalten. Dabei können sich verschiedene Objekte untereinander beeinflussen.
jQuery bietet ja ein tolles Ajaxkonstrukt an mit dem es kein Problem ist Daten vom Server zu holen. Aber auf die Dauer wird es doch etwas nervig immer wieder zu tippen.
Und weil **"objektorientiertes Javascript"** und selber entwickeln so viel **Spaß** macht, habe ich mir eine alternative Lösung einfallen lassen: Im Projekt werden an geeigneter Stelle _Elemente_ erzeugt, die alle benötigten Informationen enthalten.
Diese werden in einem _Updater_ registriert, welcher sich um die regelmäßige Abfrage kümmert. Das war die Theorie und jetzt kommt die **Praxis**.'
categories: Entwicklung, jQuery
redirect_from: "2009/07/24/viele-elemente-dynamisch-aktualisieren/"

---

## Das Element
Ein Element besteht aus **einer URL** auf dem Server, **dem Typ** der zurückerwartenden Daten und **einer Funktion** die aufgerufen wird, wenn die Aktion erfolg hatte. Im Quelltext sieht das so aus:

    var Paul = new element('count/paul', 'json', function(j) {
        alert("Paul hat "+j.count+" Einträge.");
    });

Diese Elemente können überall im Projekt erzeugt werden. Alternativen zu _json_ sind alle Formen die jQuerys Ajaxfunktion erkennt: _Html_, _Text_ und _Jsonp_.

## Der Updater
Ganz am Anfang (oder am Ende, je nach Geschmack) wird der Updater initalisiert:

    var Updater = new updater();

Der Updater akzeptiert zwei Einstellungen:

    Updater.intervall = 1000; // Zeit bis zur nächsten Abfrage
    Updater.baseurl = "http://kleiner.test.com/"; // String der vor jede URL geschrieben wird

Und hat eine handvoll Funktionen für den dynamischen Umgang mit dem Objekt:

    Updater.start(); // Startet den Vorgang sofern Elemente vorhanden sind
    Updater.stop(); // Stoppt die Aktualisierungen
    Updater.isRunning(); // Prüft ob sich der Updater in Aktion befindet
    Updater.log(); // Schreibt alle gespeicherten Elementen in die Konsole
    Updater.register(Element); // Fügt ein neues Element hinzu
    Updater.remove(Element); // Entfernt ein Element

## Die Verwendung
Dem Updater werden **beliebig viele Elemente**, auch zur Laufzeit, übergeben:

    Updater.register(Paul);
    Updater.start();

Das wars! Die Funktion im übergebenen Element wird jetzt, im erfolgsfall, alle 1000 Millisekunden aufgerufen.

## Die technische Seite vom Element
So sieht das Element aus:

    function element(url, dataType, successFunction) {
    
      //einstellungen
      this.url = url;
      this.data = {};
      this.type = 'get'
      this.dataType = dataType || 'html';
    
      //callback um die daten zu bekommen
      this.getData = function() {
        return this.data;
      }
    
      //callback um an die URL zu kommen
      //erster parameter ist die im Updater gespeicherte baseurl
      this.getUrl = function(BASEURL) {
        return this.url;
      }
    
      //callback wenn eine antwort vorliegt
      //erster Parameter ist die Antwort vom Server, zweiter der Updater an sich
      this.success = successFunction || function(html, Updater) {
        console.log('Anfrage #'+Updater.counter);
        console.log(html);
      }
    
      //callback wenn ein fehler aufgetreten ist
      //erster parameter ist der Updater an sich um dieses Element daraus zu entfernen
      this.error = function(Updater) {
        //bei einem fehler entfernt sich das objekt selbstständig aus dem updater
        Updater.remove(this);
      }
    
    }

Zwei Funktionen sind wichtig: **getData()** wird aufgerufen, bevor die Anfrage an den Server gesendet wird. Der Rückgabewert der Funktion wird an den Server geschickt.
Damit ist es also möglich, auf **Veränderungen im Frontend** zu reagieren. Zum Beispiel:

    Paul.getData = function() {
        return {relation: $('body').attr('rel'), project: $('#project_selector').val()};
    }

Schön, oder? Natürlich kann man sich noch viel einfallen lassen. Etwa mit der URL, welche mit Hilfe der Funktion **getUrl()** aus dem Element geholt wird. Es soll ja Fälle geben (_CakePHP_), bei denen es leichter ist Daten per URL zu übergeben:

    Paul.getUrl = function(BASEURL) {
        return BASEURL+this.url+'/'+$('#team .paul').attr('rel');
    }

Die Funktionen **success(return, Updater)** und **error(Updater)** erklären sich von selbst und haben als Parameter immer das umfassende Element dabei. Deshalb kann sich das Objekt in einem Fehlerfall auch selbstständig entfernen. Es könnte auch das Intervall verändern, ein neues Objekt hinuzfügen, oder was auch immer!

## Die technische Seite vom Updater
Als erstes der gesamte Block Quelltext:

    function updater() {
    
      //einstellungen
      this.intervall = 1000;
      this.elements = new Array();
      this.active_element = 0;
      this.baseurl = BASEURL;
    
      this.running = false;
      this.counter = 0;
      this.timeout = '';
    
      //alle elemente anzeigen
      this.log = function() {
        console.log(this.elements);
      }
    
      //neues element hinzufügen
      this.register = function(element) {
        this.elements.push(element);
      };
    
      //ein element entfernen
      this.remove = function(element) {
        for(i in this.elements) {
          if(this.elements[i] == element) {
            //delete this.elements[i];
            this.elements.splice(i, 1);
            return true;
          }
        }
        return false;
      }
    
      //elemente durchgehen
      this.process = function(active_element) {
        this.active_element = active_element || 0;
    
        if(this.elements[this.active_element]) {
          _this = this;
          _elem = this.elements[this.active_element];
    
          //ajaxaufruf
          $.ajax({
            //einstellungen
            url: _elem.getUrl(_this.baseurl),
            data: _elem.getData(),
            type: _elem.type,
            dataType: _elem.dataType,
    
            //hat funktioniert!
            success: function(result) {
              _elem.success(result, _this);
            },
    
            //ein fehler
            error: function(error) {
              //das object soll entscheiden wie es weitergeht
              _elem.error(_this);
            },
    
            //wie auch immer soll das nächste element aufgerufen werden
            complete: function() {
              _this.next();
            }
          });     
    
        }
        else {
          this.active_element = 0;
          this.next();
        }
      };
    
      //ruft process erneut auf, verzögert um intervall mit dem activen element
      this.next = function() {
        if(this.isRunning()) {
          //nur so zum spaß
          this.counter++;
    
          //zeit die bis zum nächsten aufruf vergehen soll
          var _intervall = 0;
    
          //nächstes element suchen
          this.active_element++;
    
          //schon am ende angelangt?
          if(this.active_element >= this.elements.length) {
            this.active_element = 0;
    
            //längerer intervall bis es wieder los geht
            _intervall = this.intervall;
          }
    
          //erneut aufrufen
          _this = this;
          _this.timeout = window.setTimeout(function() {
            _this.process(_this.active_element);
          }, _intervall);
          return true;
        }
        else {
          return false;
        }
      }
    
      //startet den vorgang
      this.start = function() {
        this.active_element = -1;
        this.running = true;
        this.counter = 0;
        this.next();
      }
    
      //stoppt das updaten
      this.stop = function() {
        this.running = false;
        window.clearTimeout(this.timeout);
        return this.counter;
      }
    
      //prüfen ob der Updater läuft
      this.isRunning = function() {
        return this.running;
      }
    }

Nett, oder? Was ist passiert? Die Einstellungen sollten klar sein. In der Variable **timeout** wird der aktuelle Timeout gespeichert. Damit kann man beim Abbrechen alle Verbindungen trennen, anstatt noch eine ausführen zu müssen.
**Log()**, **register()** und **remove()** sind an sich uninteressant. Außer eine Erwähnung, dass der Operator _delete_ ein Element zwar entfernt, aber danach nicht das Array neu durchnummeriert. Da liegen dann lauter "_undefinied_" rum. Deshalb habe ich **splice()** benutzt. Funktioniert super.
Spannend wird es in der Funktion **process()**. Diese wird für jedes Element aufgerufen. Als Parameter erwartet sie den **Key** vom aktiven Element. Wenn ein Element vorhanden ist, wird die Ajaxabfrage ausgeführt.
Innerhalb der Funktion Ajax() bekommt das _this_ eine neue Bedeutung. Deshalb musste ich es in _\_this_ zwischenspeichern.
Die Funktion ruft also, je nach umstand, **success()** oder **error()** auf und übergibt die Kontrolle an das Element. In jedemfall wird aber **\_this.next()** durch die Funktion **Ajax.complete()** aufgerufen. Diese wird, unabhängig vom Status, nach jeder Ajaxanfrage ausgeführt.
In der Funktion **next()** wird das nächste Objekt gesucht. Sofern der Updater läuft **isRunning() **wird der Counter erhöht und das Intervall auf Null gesetzt. Das passiert, weil alle registrierten Elemente sofort nacheinander aufgerufen werden sollen und erst anschließend die in _this.intervall_ angegebene Zeit gewartet wird.
Wenn alle Elemente durchgearbeitet wurden, wird der **Index auf Null** und der **Intervall auf die eingestellte Zeit** gesetzt.
Anschließend gibt es ein klassisches **window.setTimeout()** um das ganze Spielchen wieder von vorne anzufangen.
**Start()**, **stop()** und **isRunning()** erklären sich wieder von selbst, und damit ist die Vorstellung beendet!

## Fazit
Der große nächste Erweiterungsschritt ist in dem Updater alle Anfragen zu sammeln und**in einem Packet** an den Server zu schicken. Die Antwort kann dann direkt vom Updater auseinander gefriemelt und an die verschiedenen Elemente verteilt werden.
Dazu muss der Server allerdings noch vorbereitet werden, und bisher sind es noch nicht viele Benutzer. Aber ich denke es ist eine **solide Grundlage** die gut erweitert werden kann.
Das war auch die Intention dieses Postings. Hast du einen **Vorschlag**? **Kritik**? **Hinweis**? Freue mich über Kommentare und Inspiration. Danke für die Aufmerksamkeit.