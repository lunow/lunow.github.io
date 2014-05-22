---

layout: post
title: "CakePHP Expandable Behavior"
abstract: 'Darf ich vorstellen: mein **CakePHP Expandable Behavior**. Ein einfaches, kleines Script welches das hinzufügen von neuen Spalten in einem beliebigen CakePHP Model erlaubt, **ohne die Datenbank zu verändern**. Neue Spalten werden in einer Tabelle und die Inhalte in einer anderen Tabelle gespeichert.
Beim Auslesen werden die Ergebnisse so zusammen gefasst, dass es für den normalen Programmierer kein Unterschied gibt. Die neuste Version findet man auf [GitHub](https://github.com/lunow/Expandable "CakePHP Expandable Behavior"), die Erklärung zur Installation und Nutzung in diesem Eintrag.'
categories: CakePHP
redirect_from: "2011/02/11/cakephp-expandable-behavior/"

---

## Voraussetzungen
Das Expandable Behavior erwartet zwei Tabellen \[pre\]Keys\[/pre\] und \[pre\]Values\[/pre\]:


    CREATE TABLE IF NOT EXISTS 'keys' (
        'id' int(3) unsigned NOT NULL AUTO_INCREMENT,
        'model' varchar(25) COLLATE utf8_bin NOT NULL,
        'key' varchar(50) COLLATE utf8_bin NOT NULL,
        PRIMARY KEY ('id')
    ) ENGINE=InnoDB    DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
    
    CREATE TABLE IF NOT EXISTS 'values' (
        'id' int(6) unsigned NOT NULL AUTO_INCREMENT,
        'key_id' int(3) NOT NULL,
        'model_id' int(6) NOT NULL,
        'value' text COLLATE utf8_bin NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB    DEFAULT CHARSET=utf8 COLLATE=utf8_bin;



Außerdem sollte man das **Containable Behavior** für das Model aktiviert haben. Ansonsten fehlt nur noch die Datei aus dem [Repository auf GitHub](https://github.com/apeunit/Expandable "CakePHP Expandable Behavior").

## Installation
Ein schönes Beispiel ist das Model \[pre\]Document\[/pre\]. In meinem Projekt gibt es die Möglichkeit beliebige Dateien hochzuladen, jede Datei hat dabei andere Eigenschaften die dazu mit gespeichert werden sollen. Jetzt könnte man alle Spalten anlegen und nur die benötigten ausfüllen, was aber zu einer äußerst unangenehmen Tabelle führt. Da doch lieber das Expandable Behavior. Die Tabelle \[pre\]documents\[/pre\] besitzt folgende Spalten:


    ID
    created
    modified
    user_id
    title
    file
    extension
    is_hidden



Für ein OpenOffice Dokument soll der Benutzer jetzt die Anzahl Seiten eintragen können. Das macht für ein Video natürlich keinen Sinn. Jetzt kommt das Expandable Behavior ins Spiel.


    class Document extends AppModel {
        var $actsAs = array('Containable', 'Expandable');
    }



Fertig!

## Speichern
Im View kann man jetzt ein Formular mit beliebigen Feldern anlegen, zum Beispiel für ein neues OpenOffice Dokument:


    <?php
    echo $this->Form->create('Document');
    echo $this->Form->input('title');
    echo $this->Form->input('file', array('type' => 'file'));
    echo $this->Form->input('pages');
    echo $this->Form->end('Save');
    ?>



Das Feld \[pre\]pages\[/pre\] wird beim Speichern erkannt, eventuell in der Datenbank \[pre\]keys\[/pre\] ein neuer Eintrag erzeugt und in \[pre\]values\[/pre\] die Inhalte gespeichert. So einfach.

Neue Felder werden nur angelegt, wenn \[pre\]debug\[/pre\] größer als 0 ist.

## Validierung
Es lassen sich wie gewohnt alle Cake Validierungsregeln auf die dynamischen Felder anwenden.


    class Document extends AppModel {
        $validate = array('pages' => array('rule' => 'numeric'));
    }



## Auslesen
Hier muss man auf eine Sache achten. Normalerweise sieht die Abfrage so aus:


    $document = $this->Document->find('first', array(
        'conditions' => array('Document.id' => $document_id),
    ));



Da erhält man jetzt für jeden dynamisch angelegten Key einen leeren Eintrag weil die Inhalte nicht automatisch geladen werden. Das muss beim auslesen noch mit angegeben werden:


    $document = $this->Document->find('first', array(
        'conditions' => array('Document.id' => $document_id),
        'contain' => array('Value')
    ));



Über das Containable Behavior werden alle zugehörigen Inhalte ausgelesen, das Expandable Behavior kümmert sich um den Rest.


    $this->Document->getKeys();



Die Funktion \[pre\]getKeys()\[/pre\] aus dem Behavior liefert ein Array mit allen dynamisch angelegten Schlüsseln. Ganz praktisch um dynamische Formulare aufzubauen.

## ToDo
Ganz fertig ist die Arbeit noch nicht.


* Ich habe im \[pre\]beforeFind()\[/pre\] Callback alles versucht, aber ich kriege Cake einfach nicht dazu die Inhalte automatisch mit auszulesen.
* Es wäre natürlich nett die \[pre\]values\[/pre\] auch im Paginator nutzen zu können. Das muss noch untersucht werden.
* Die Keys sollten verschiedene Typen ermöglichen, z.B. für Zahlen, Text oder Floats. Im Moment wird einfach alles in einem Feld vom Typ \[pre\]Text\[/pre\] gespeichert.


## Fazit
Das Behavior funktioniert bisher super, ist allerdings noch in einer sehr frühen Entwicklungsphase. Wer einen Fehler findet ist herzlich eingeladen einen Patch über [GitHub](https://github.com/lunow/Expandable "CakePHP Expandable Behavior") zu schicken.

Bisher macht es großen Spaß neue Felder anzulegen ohne sich über die Datenbank Gedanken zu machen. Mal sehen was daraus noch wird.