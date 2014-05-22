---

layout: post
title: "Cooles Templatesystem für PHP"
abstract: 'Ich habe ein paar Stunden in ein **Templatesystem für PHP** investiert. Vorher habe ich mir natürlich Smarty und viele weitere Lösungen angesehen, aber keiner der Ansätze hat mich so richtig glücklich gestimmt.
Marker, wie in TYPO3 mit "ausgedachten" Zeichen zu umgeben, um anschließend eine neue Syntax für Schleifen und Bedingungen zu lernen, finde ich zu kompliziert. Außerdem habe ich mich hier im Blog schon einmal positiv über die [Kurzschreibweisen von PHP](http://www.interaktionsdesigner.de/2009/01/31/php-kurzschreibweisen/ "Kurzschreibweisen in PHP") geäußert. Da ist es natürlich nur noch ein kleiner Schritt zu einer funktionalen Klasse, welche ein PHP Template mit Inhalt befüllt.
Im folgenden Beitrag stelle ich meine **einfach** zu nutzende Möglichkeit vor. Es ist mein erster Ansatz Richtung Template und ich freue mich sehr über Kommentare und Verbesserungsvorschläge!'
categories: Allgemein
redirect_from: "2009/03/17/cooles-templatesystem-fur-php/"

---

## Vorüberlegungen
Viele Projekte münden in eine **variable HTML Ansicht**. Dabei muss der Kunde keine Templates erstellen, er hat nur viele verschiedene Anforderungen an ein und die selben Daten. Der Entwickler ist fähig, PHP Scripte zu schreiben und hat **Spaß** daran. Warum also keine PHP Templates?
Es ist natürlich gefährlich, was die **Trennung von Layout und Logik** angeht und erfordert an dieser Stelle besondere Vorsicht, aber belohnt wird man durch eine sehr schnelle Umsetzung und sehr variable Einsatzmöglichkeiten.

## Das Template
Das PHP Template greift auf die Variablen des Objektes zu, über die Variable **$this**. Ein Beispiel:
    
    <h1><?=$this->title?></h1>
    <? if(isset($this->subtitle)): ?><h2><?=$this->subtitle?></h2><? endif; ?>
    <p><?=$this->text?></p>
    <small><?=$this->footer?></small>

Das ist ein sehr einfaches Template, gespeichert in der Datei _einfaches-template.php_.

## Der Aufruf
Um im PHP Script dieses Template zu benutzen muss**nur ein neues Template Objekt** erzeugt werden:
    
    $content = array(
        "title" => "Hallo Welt",
        "subtitle" => "Die Welt zu Gast im Template",
        "text" => "Lorem Ipsum usw."
    );
    include("class.template.0.2.php");
    $output = new template("einfaches-template.php", $content);
    echo $output;

Wie unschwer zu erkennen ist, macht sich die Template Klasse eine Menge der objektorientierten Programmierweisen zu nutze, wie z.B. die Funktion _\_\_toString()_, um das geparste Template ausgeben zu können.

## Alternativen
Ich habe versucht die Klasse so einfach und logisch wie möglich aufzubauen. So können Daten auch einzeln während der Laufzeit des Programms übergeben werden: 
    
    $output = new template("einfaches-template.php");
    $output->title = "Hallo Welt 2";
    $output->text = "Ich bin auch möglich.";
    echo $output;

## Automatische Verarbeitung
Um eine automatische Vearbeitung der Marker zu ermöglichen merkt sich die Klasse die angeforderten Schlüssel! Nach dem Parsen kann mit der Funktion _$output-\>keys()_ ein Array der verwendeten Schlüssel zurückgegeben werden. Dabei akzeptiert die Funktion zwei Parameter: **'set'** oder **'unset'**. Erweitert man also das zweite Beispiel um eine Zeile: 
    
    echo "<hr><pre>".print_r($output->keys(), 1)."</pre>";

erhält man folgende Ausgabe:

    Array
    (
        [0] => title
        [1] => text
    )

Und mit dem Parameter**'unset'** dann:

    Array
    (
        [0] => footer
    )

Sehr praktisch für die automatische Information bei der Verwendung von neuen Templates.

## Dynamische Erweiterung
Aktuell hatten wir in der Agentur ein Projekt, in dem die Anforderung darin bestand, ein bestimmtes Wort immer kursiv darzustellen. Mit meiner Template Klasse habe ich, wie ich finde, einen sehr eleganten Weg gefunden dies zu realisieren ohne die Aktualisierbarkeit der Klasse zu verlieren. Zum Beispiel das Wort _Welt_. Der Trick liegt in einer neuen Klasse, welche die Funktion _$this-\>afterParse()_ überschreibt: 
    
    class custom_template extends template {
        function afterParse() {
            $this->_output = str_replace("Welt", "<i>Welt</i>", $this->_output);
        }    
    }

Die einzige Herausforderung besteht darin, die Variable _$this-\>\_output_ zu erkennen und zu bearbeiten. Für das Beispiel oben muss dann nur noch der Aufruf des Templates angepasst werden: 
    
    $output = new custom_template("einfaches-template.php");

Und schon ist jedes Auftreten von Welt kursiv!
Funktionen, die überschrieben werden wollen sind:
**function afterParse()** - aufgerufen nach dem Parsen. Der geparste Inhalt steht in _$this-\>\_output_.
**function beforeParse() **- wird aufgerufen bevor das Parsen beginnt. Alle verfügbaren Variablen stehen in _$this-\>\_data_.
**function out($value, $set)** - wird aufgerufen wenn ein Platzhalter im Template ersetzt werden soll. In dieser Funktion definiert man, was bei nicht vorhandenen Inhalten ausgegeben werden soll (dann steht _$set_ auf _false_). Die Standardfunktion sieht so aus: 
    
    function out($value, $set) {
        if(!$set)
            return '{'.$value.'?}';
        
        return $value;
    }

## Einschränkungen
Interne Variablen beginnen in der Klasse **immer mit einem Unterstrich**. Deshalb dürfen diese weder gesetzt, noch im Template abgefragt werden. Beides führt zu einer Fehlermeldung.
Ansonsten habe ich noch keine Einschränkungen entdeckt. Es sind viele interessante Dinge möglich, wie **Schleifen**, **Abfragen**, **dynamische Reaktion** auf Inhalte usw. Das verleitet natürlich zur Vermischung von Logik und Layout. **Bitte immer doppelt nachdenken,** wo eine Funktion hin gehört.

## Fazit
Ich bin von meiner Lösung recht begeistert und empfinde die Arbeit mit dieser Klasse als **sehr angenehm**. Über Hinweise und Kommentare freue ich mich sehr! Die komplette Klasse kann man sich [hier ansehen](http://www.interaktionsdesigner.de/stuff/class.template.0.2.php.html "Pauls PHP Template") oder [als Zip Datei herunterladen](http://www.interaktionsdesigner.de/stuff/class.template.0.2.php.zip "Pauls PHP Template herunterladen"). Natürlich gebe ich keine Garantie für die korrekte Funktionsweise, wünsche aber viel Spaß beim Ausprobieren und Erweitern!
Wenn jemand Einsatzmöglichkeiten in seinem eigenen Projekt dafür sieht, dann ist die Vorraussetzung eine kurze Meldung bei [mir](mailto:info@interaktionsdesigner.de "Mail an Pauls Blog"), vielen Dank!