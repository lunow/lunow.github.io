---

layout: post
title: "Mein Git Tutorial"
abstract: 'Der letzte Schrei bei der Versionskontrolle ist **Git**. Entwickelt von Linus Torvalds, dem Erfinder von Linux, ermöglicht es das Arbeiten auf eine viel flexiblere Art und Weise als SVN. Die Punkte die mich überzeugt haben sind:

* es muss **sehr schnell** sein, um mit der großen Code-Masse klarzukommen
* nicht jeder darf Patches integrieren, sie müssen vorher **durch einen Maintainer kontrolliert** werden
* das System muss **dezentral** arbeiten, um einerseits Bandbreite und Performance zu sparen und damit andererseits nicht bei einem Ausfall die ganze Entwicklung still steht
(Quelle: [Online-Tutorials.de](http://www.online-tutorials.net/programmierung/git/tutorials-t-3-263.html "Git bei Online Tutorial"))
Nun stellt sich natürlich die Frage wie **Git** mit **Mac OS X** zusammenarbeitet, wie man es installiert und seine Projekte in ein Repository packt. Dieser Artikel will das verständlich, kurz und auf deutsch erklären.
_Letzte Kontrolle der Aktualität: **08 / 2011**_'
categories: Git
redirect_from: "2009/05/25/mein-git-tutorial/"

---

## Mein Anforderungen
Ich habe einen riesigen Haufen Projekte in einem riesigen Haufen Ordner. Jetzt liegt in einem Projektordner die Korrespondenz, angelieferte Daten und Informationen, sowie ein Ordner mit allen FTP Dateien die ich bearbeite, auf dem lokalen Server betrachte und bei bedarf komplett hochschiebe.
Auf meinem Rechner soll jetzt ein **Git Repository** entstehen um Änderungen nachvollziehen zu können, die Daten zu sichern und im Notfall alte Versionen wiederherstellen zu können.

## Git unter Mac OS X Leopard installieren
Ehrlich gesagt bin ich kein Freund des Terminals, es macht zwar Spaß wenn man es kann, aber bis dahin ist es mühsam. Ich habe auch keine große Lust _XCode_ zu installieren um _MacPorts_ nutzen zu können um alles zu installieren, deshalb bin ich sehr froh einen **automatischen Installer** für OS X 10.5 gefunden zu haben. Also: [Git installieren wie ein ganz normales Programm](http://code.google.com/p/git-osx-installer/ "Git Installieren ohne Terminal")!
Funktioniert wunderbar. Um es zu testen muss man dann doch ins Terminal wechseln und den Befehl "**git**" eingeben. Darauf erhält man eine Liste der wichtigsten Befehle:

    The most commonly used git commands are:
    add        Add file contents to the index
    bisect     Find by binary search the change that introduced a bug
    branch     List, create, or delete branches
    checkout   Checkout a branch or paths to the working tree
    clone      Clone a repository into a new directory
    commit     Record changes to the repository
    diff       Show changes between commits, commit and working tree, etc
    fetch      Download objects and refs from another repository
    grep       Print lines matching a pattern
    init       Create an empty git repository or reinitialize an existing one
    log        Show commit logs
    merge      Join two or more development histories together
    mv         Move or rename a file, a directory, or a symlink
    pull       Fetch from and merge with another repository or a local branch
    push       Update remote refs along with associated objects
    rebase     Forward-port local commits to the updated upstream head
    reset      Reset current HEAD to the specified state
    rm         Remove files from the working tree and from the index
    show       Show various types of objects
    status     Show the working tree status
    tag        Create, list, delete or verify a tag object signed with GPG
    
    See 'git help COMMAND' for more information on a specific command.

Dieser Befehl **git help COMMAND** ist ganz praktisch. Navigieren lässt sich mit den Pfeiltasten, zurück zur Eingabe gelangt man mit \[q\].

## Mein erstes Git Repository
Damit Git einen Namen und Benutzer hat, macht es Sinn sich dem System zu erkennen zu geben. Das passiert im Terminal mit Hilfe von

    git config --global user.name "Mein Name"
    git config --global user.email email@adresse.hier

Für ein Projekt erstellt man jetzt ein Repository. Um nichts kaputt zu machen erstmal mit einem Testprojekt. Meins liegt in _/Projekte/Server/Git_. In diesen Ordner muss mit dem Befehl **cd** im Terminal gewechselt werden:

    cd /Projekte/Server/Git

Wenn das geklappt hat (überprüfen mit dem Befehl **ls** - der zeigt alle Dateien die der Ordner beinhaltet), kommt der große Moment: Git wird initialisiert!

    git init

Wie Sie sehen, sehen Sie nichts. Aber das trügt! Es wurde ein versteckter Ordner angelegt. Um die Inhalte anzusehen wird wieder in den Finder gewechselt, der entsprechende (leere) Ordner ausgewählt und mit der Tastenkombination \[cmd\] + \[umschalt\] + \[g\] der Dialog zum Ordner öffnen ausgewählt. Hier wird "**.git**" eingetragen, mit \[enter\] bestätigt und schon kann man sich die verteckten Inhalte ansehen.

## Dateien hinzufügen
Um Dateien von Git verwalten zu lassen müssen sie als erstes in Git bekannt gemacht werden. Das ist der sogenannte "Index". Dateien fügt man diesem Index mit dem Befehl **git add .** hinzu. Der Punkt gibt an das alle Dateien in dem betreffenden Ordner hinzugefügt werden sollen.
Man befindet sich also im Terminal, immer noch im Projektordner, und fügt alle Dateien dem Index hinzu:

    git add .

Als nächstes wird der Index ins Repository geladen. Das passiert über den Befehl **commit**.

    git commit

Dieser Befehl öffnet einen Texteditor in dem man seinen Commit kurz beschreiben sollte (was ist passiert, was wurde geändert, usw.). Das geschieht über den Texteditor Vi. Für ungeübte "etwas" gewöhnungsbedürftig, aber so funktionierts:

1. Über die Taste \[i\] den **"Insert"-Modus** starten und die Nachricht eingeben.
2. Mit \[esc\] den Modus wieder verlassen.
3. Den **Befehlsmodus** mit \[:\] (Doppelpunkt) starten, \[wq\] eingeben und mit \[enter\] bestätigen - das schreibt die Datei und beendet den Editor (w = write, q = quit).
Das war ein bisschen anstrengend, aber man gewöhnt sich dran. Git müsste jetzt eine Meldung anzeigen das alles geklappt hat, wieviele Dateien aufgenommen wurden usw.

## Weitere Dateien hinzufügen
Im Repository ist jetzt also eine Kopie vom gesamten Projekt gespeichert. Jetzt beginnt der Arbeitstag und man macht großartige Dinge. Wenn man das Gefühl hat den aktuellen Zwischenstand speichern zu wollen, wechselt man wieder ins Terminal, in den entsprechenden Ordner und "commited" die gemachten Änderungen.

    git commit -a

Das**-a** am Ende fügt alle Dateien automatisch dem Index hinzu und publiziert die Änderungen.
Noch schneller geht es mit der Kombination aus **-a** und **-m**. Dem Parameter -m folgt eine in Anführungszeichen gesetzte Nachricht für den Commit.

    git commit -a -m "Nachricht über die Änderungen"

**Aber Vorsicht**: Mit diesem Befehl werden nur die Änderungen hinzugefügt, nicht aber neu angelegte Dateien!

## Änderungen betrachten und wiederherstellen
Zu jedem Zeitpunkt kann man sich über **git log** den Status des Repositorys ansehen. Das listet alle Commits auf. Um genau zu sehen was sich geändert hat, wird der Befehl mit dem Parameter **-p** erweitert:

    git log -p

An den Plus- und Minuszeichen kann man jetzt erkennen welche Zeilen geändert und welche hinzugefügt wurden. Über \[q\] verlässt man den Quelltextmodus.
Und jetzt wird es richtig spannend. Wenn eine Änderung nicht gelappt hat und die letzte Version wiederhergestellt werden soll, dann passiert das mit **checkout**.

    git checkout master^

**master** gibt den sog. "Branch" / Ast an aus dem exportiert werden soll, "master" ist der Standardast der automatisch angelegt wird. Das Dach **^** gibt an das die letzte Version wiederhergestellt wird. Zwei Dächer (^^) zeigen dann auf die vorletzte usw.
Wird dieser Befehl ausgeführt werden alle Dateien im Ordner durch jene aus dem Repository ersetzt. Um wieder die aktuellste Version zu erhalten führt man den gleichen Befehl aus, allerdings ohne das Dach.

## Fazit und Ausblick
Vielleicht klingt es für dein einen oder anderen nicht besonders Revolutionär und ehr unpraktisch mit dem Terminal usw., ich empfehle aber **dringend** sich damit auseinander zu setzen!
Die hier vorgestellten Grundlagen sind nur die **Spitze des Eisbergs**, Git bietet unglaublich viele Möglichkeiten, insbesondere bei der Zusammenarbeit mit anderen Programmierern. Es lassen sich verschiedene Versionen und Zweige definieren und richtig mächtig wird es wenn auf dem Server ein eigenes Repository läuft, als Backup und zur direkten Veröffentlichung.
Es lassen sich auch verschiedene Hooks einbauen, kleine Scripte die z.B. ein Copyright in die Datei einfügen oder Bedingungen prüfen, beim einchecken und auschecken uvm.

## Tools
GitHub hat ein großartiges Programm veröffentlicht um die Repositories auf dem eigenen Computer und jene bei GitHub zu verwalten: [GitHub for Mac](http://mac.github.com/ "GitHub for Mac"). Aufjedenfall einen Blick wert.

## Weiterlesen

* Ein guter Einstieg auf Deutsch bei den [Online-Tutorials](http://www.online-tutorials.net/programmierung/git/tutorials-t-3-263.html "Online Tutorial Git").
* Das "offizielle" [Getting Started Tutorial](http://www.kernel.org/pub/software/scm/git/docs/gittutorial.html "Getting Started with Git") von den Machern (en).
* "[A web-focused Git Workflow](http://joemaller.com/2008/11/25/a-web-focused-git-workflow/ "A web-focused Git Workflow")" von Joe Maller (en).
* Sehr [ausführliche Anleitung](http://www-cs-students.stanford.edu/~blynn/gitmagic/index.html "Alles über Git") inkl. Tipps und Tricks (en und [de](http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/de/ "Git Tips und Tricks")).
* [Every Day Git](http://www.kernel.org/pub/software/scm/git/docs/everyday.html "Every Day Git") beschreibt wichtige Arbeitsabläufe (en).
* Und natürlich die [offizielle Git Homepage](http://git-scm.com/ "Offizielle Git Homepage") (en).
* Zweiter Arikel über Git in Pauls Blog: [Ein sauberes Testprojekt mit Git](http://www.interaktionsdesigner.de/2009/08/31/ein-sauberes-testsystem-mit-git/ "Pauls Blog mag Git").
Über **Hinweise** und **Korrekturen** freue ich mich natürlich sehr, dass war mein erstes mal mit **Git**. Aber ich denke wir werden eine tolle Zeit miteinander haben und irgendwann mehr als Freunde sein!