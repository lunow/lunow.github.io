---

layout: post
title: "Mit CakePHP in 30 Minuten Tags zu einer Tabelle hinzufügen"
abstract: 'Im Web 2.0 geht nichts mehr ohne **Tags**. Und ohne ein [Rapid Development Framework](http://cakephp.org/ "CakePHP") kann das ganz schön haarig werden. Zum Glück springt **CakePHP** mit leuchtenden Augen (oder waren es die Augen des Entwicklers?) in die Bresche und begeistert mit sehr einfachen Umsetzung.
Mit der folgenden Anleitung bekommt ein **beliebiges Model** die Möglichkeit Tags zu speichern, inklusive **Has and belongs to many Beziehung**.'
categories: CakePHP
redirect_from: "2009/04/17/mit-cakephp-in-30-minuten-tags-zu-einer-tabelle-hinzufugen/"

---

## Anforderungen
Alle Einträge der Datenbank **Posts** (z.B.) sollen mit einer beliebigen Anzahl **Tags** beschrieben werden können. Die Tags werden in einer eigenen Datenbank gespeichert. Die Relationen zu den Einträgen wird in einer weiteren Datenbank gespeichert.
Zur komfortablen Eingabe sollen die **Tags mit Komma getrennt** eingegeben und bearbeitet werden. In der Ausgabe sollen alle Tags als Array zur Verfügung stehen.

## Die Datenbanken
Eine Datenbank ist bereits vorhanden welche alle Posts speichert.
Die Tags bekommen eine eigene Datenbank mit den Spalten **id** (_primary, auto\_increment_) und **name**.
Um CakePHP die Magie zu ermöglichen muss die dritte Tabelle, zum speichern der Relationen, **tags\_posts** heißen. Sie beinhaltet die Spalten **tag\_id** und **post\_id**.

## Das Model
Das Model der Tags ist denkbar einfach:

    <?
        class Tag extends AppModel {
            var $name = 'Tag';
            
            $hasAndBelongsToMany = array('Post');
        }
    ?>

Die Schönheit ist in der letzten Zeile: **$hasAndBelongsToMany = array('Post');** hier wird dem Model erklärt das es zum Model Post gehört und dementsprechend wird die Datenbank **tags\_posts** erwartet.
Das Model **Post** kriegt die gleiche Informationen, in umgekehrte Richtung:

    $hasAndBelongsToMany = array('Tag');

## Speichern von Tags
Jetzt wird es spannend! Die Tags sollen kommaspeariert eingegeben werden und beim speichern automatisch auseinander geschnitten werden. Dazu wird im **View** der Funktionen _add_ und _edit_ der Posts ein neues Element angelegt. Ich nenne es **temp\_tags**.

    echo $form->input('temp_tags', array(
        'label' => 'Tags (mit Komma trennen)',
    ));

Die Verarbeitung des Feldes erfolgt im **Model von Post** und zwar in der Funktion **beforeSave()**. Diese wird ausgeführt bevor ein Datensatz gespeichert wird.

    function beforeSave() {
        // hier gehts ab!
    }

Als erstes wird überprüft ob das Feld **temp\_tags** überhaupt existiert. Ist dies der Fall wird in der Variable _$tags_ ein Array gespeichert, aufgeteilt nach Komma. Anschließend wird die Variable**temp\_tags** aus dem Datensatz gelöscht:

    if(isset($this->data[$this->name]['temp_tags'])) {
        $tags = explode(",", $this->data[$this->name]['temp_tags']);
        unset($this->data[$this->name]['temp_tags']);

Ich habe auf die Daten über _$this-\>data\[$this-\>name\]_ zugegriffen. Das ermöglicht die Kopie der gesamten Funktion in das nächste Projekt ohne sich noch einmal Gedanken über die Namen machen zu müssen.
Das Array _$tags_ wird jetzt Element für Element untersucht. Dabei sollen keine Leerzeichen stören ([trim](http://www.php.net/trim "Praktische Funktion")).

    foreach($tags as $tag) {
        $tag = trim($tag);
    }

Der erste Schritt besteht darin herauszufinden ob der Tag schon vorhanden ist und wenn ja, für die neue Relation die ID herauszubekommen.

    $id = $this->Tag->findByName($tag);

Wenn das nicht geklappt hat wird das Model Tag darauf vorbereitet einen neuen Eintrag zu speichern (_create_) und muss es dann auch sofort tun.

    if(!$id['Tag']['id']) {
        $this->Tag->create();
        $this->Tag->save(array('name' => $tag));
        $id['Tag']['id'] = $this->Tag->id;
    }

In Normalfall steht jetzt aufjedenfall in der Variable _$id\['Tag'\]\['id'\]_ die ID des Tags. Entweder weil es ausgelesen wurde, oder weil ein neuer Eintrag erzeugt wurde.
Das wird jetzt dem Model mitgeteilt

    $this->data['Tag']['Tag'][] = $id['Tag']['id'];

Fehlt nur noch die ggf. definierte Elternmethode und eine positive Rückmeldung.

    parent::beforeSave();
    return true;

## Fertig!

    }

Das Auslesen im View geschieht von alleine durch die habtm Beziehung. Eine reine Freude dieser PHP Kuchen. Nicht vergessen die Daten zu überprüfen und zu sichern, wenn dieser Schnippsel auf einer öffentlichen Seite zum Einsatz kommt!
Hier noch mal der gesamte Quelltext der Funktion **beforeSave()**:

      function beforeSave() {
        //Kommaseparierte Liste von Tags als Tags speichern
        if(isset($this->data[$this->name]['temp_tags'])) {
         $tags = explode(",", $this->data[$this->name]['temp_tags']);
         unset($this->data[$this->name]['temp_tags']);
    
         foreach($tags as $tag) {
          $tag = trim($tag);
    
          //ID vorhanden oder nicht?
          $id = $this->Tag->findByName($tag);
          if(!$id['Tag']['id']) {
            //Tag neu anlegen
            $this->Tag->create();
            $this->Tag->save(array('name' => $tag));
            $id['Tag']['id'] = $this->Tag->id;
          }
    
          $this->data['Tag']['Tag'][] = $id['Tag']['id'];
         }
        }
    
        parent::beforeSave();
        return true;
      }