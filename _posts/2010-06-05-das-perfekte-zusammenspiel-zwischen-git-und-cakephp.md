---

layout: post
title: "Das perfekte Zusammenspiel zwischen Git und CakePHP"
abstract: 'Die großen Projekte entwickeln wir bei der [Ape Unit GmbH](http://www.apeunit.com "Webentwicklung und Medien aus Berlin") im Moment mit Teams zwischen 3 und 5 Kollegen. Um sich nicht gegenseitig das Leben schwer zu machen, nutzen wir **Git** zur Codeverwaltung und **CakePHP** für anspruchsvolle Webapplikationen.
Mit ein paar **Tricks** und einer handvoll Wissen wir dieses Zusammenspiel ein Hort der Freude! Dieser Artikel beschreibt das **Zusammenspiel zwischen Versionsverwaltung und Framework**.'
categories: CakePHP, Git
redirect_from: "2010/06/05/das-perfekte-zusammenspiel-zwischen-git-und-cakephp/"

---

## Das Repository
Auf unserem Entwicklungsserver liegt das **zentrale Coderepository**. Hier wird es zum Projektstart angelegt und jeder beteiligte Entwickler kriegt bei bedarf Zugriff darauf. Zum starten wird nur eine leere Datei versionisiert, der Projektleiter legt dann alle benötigten Grundlagen von seinem Rechner aus an.

    # Auf dem Server
    $ mkdir PROJEKT.git
    $ cd PROJEKT.git
    $ touch init.txt
    $ git init
    $ git add .
    $ git commit -m "Init"

Auf dem eigenen Rechner wird vom Projekt (eventuell per VPN von zuhause) eine Arbeitskopie erstellt.

    # Zuhause
    $ cd Ordner_fuer_alle_Projekte
    $ git clone gitosis@SERVER:git/PROJEKT.git

Beim clonen legt git einen neuen Ordner mit dem Namen des Projektes an.

## CakePHP
Im ersten Schritt werden alle Cake Dateien in den Ordner kopiert. Anschließend werden die benötigten Tabellen in der Datenbank angelegt. Über die**Cake Console** werden dann alle benötigten Dateien gebacken.

    $ cd cake/console/
    $ ./cake bake

Jetzt kommt der Trick! Um in Zukunft jeden Stress mit der Datenbank zu vermeiden,**backt man das Datenbankschema mit in die Cake Applikation**.

    $ ./cake schema generate

Mit diesem Befehl liest Cake die Datenbank aus und legt die Struktur in der PHP Datei unter _/config/schema/schema.php_ ab. Ändert ein Entwickler eine Tabelle auf seinem Rechner, muss er das Schema neu erstellen und in Git bekannt machen.

    $ ./cake schema generate
    $ cd ../..
    $ git add .
    $ git commit -m "Einiges ist passiert, inkl. neuer Datenbank"

Der Kollege oder alternativ der gleiche Entwickler zuhause holt sich die neuste Version vom Server und aktualisert mit Cake Magie seine Datenbank.

    $ git pull
    $ cd cake/console
    $ ./cake schema update

Fertig ist die Datenbank!

## Dateien ignorieren
Beim initialen anlegen macht es Sinn, **Git einige Dateien und Ordner zu entziehen**, die nicht versioniert werden müssen, da sie bei jedem Entwickler individuell vorhanden sind. Dafür legt man im Root Verzeichnis vom Projekt eine Datei Names**.gitignore** an.
Hier werden Dateien und Ordner festgehalten, die nicht eingebunden werden:

    app/tmp/
    config/database.php

## Cache Dateien anlegen
Das Problem ist bei der oben verwendeten **.gitignore **Datei, dass die **Caches leer sind und keine Zugriffsrechte** darauf bestehen. Deshalb muss man beim erstellen des Projekts die nötigen Ordner anlegen und die entprechenden Zugriffsrechte vergeben.

    # cd app/
    # mkdir tmp
    # mkdir tmp/cache/
    # mkdir tmp/cache/models/
    # mkdir tmp/cache/persistent/
    # sudo chmod -R 777 tmp/

Nach dem das Administratorpasswort eingegeben wurde, wird eine sehr freundliche Berechtigung gesetzt (die zum testen okay ist, auf dem Liveserver aber tabu!) und Cake kann in die Order schreibenn. Da der Ordner aus der Versionisierung ausgeschlossen wurde, muss man diesen Schritt zum Glück nur ein einziges mal durchführen.

## Die Datenbank
Weil ein frisch geclontes Cake Projekt noch keine Datenbankverbindung besitzt, muss man als erstes eine neue Datenbank über phpMyAdmin o.ä. erstellen. Anschließend wechselt man in die Konsole und erstellt**anhand des Schemas alle benötigten Tabellen**.

    $ cd cake/console
    $ ./cake bake

Da keine Datenbankverbindung besteht, werden die Zugangsdaten abgefragt. Anschließend

    $ ./cake schema create

Jetzt noch die zwei Fragen mit **y** bestätigen und schon liegen alle Tabellen ordentlich in der frisch angelegten Datenbank.

## Fazit
Was benutzt ihr um Demoinhalte zu übertragen? Im Schema gibt es zwei Callbacks: **before() **und **after()**; ich fürchte die werden beim neugenerieren überschrieben.
Ansonsten bleibt nur noch frohes Entwickeln zu wünschen übrig. **Frohes entwickeln!**