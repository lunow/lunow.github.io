---

layout: post
title: "Ein sauberes Testsystem mit Git"
abstract: '**Versionisierung** ist in aller Munde. Und am besten schmeckt **Git**. Ich hatte schon mal ein paar Worte über den Einstieg [hier im Blog](http://www.interaktionsdesigner.de/2009/05/25/mein-git-tutorial/ "Pauls Git Tutorial") verloren, allerdings ist diese Softwareversionisierung schwierig in den Arbeitsalltag zu integrieren, wenn man nicht dazu gezwungen wird.
Super wichtig bleibt es natürlich auch, wenn man es nicht benutzt, deshalb möchte ich hier eine Idee einbringen, um**sich selbst zu zwingen** damit zu arbeiten und sogar noch etwas davon zu haben!
Es geht um ein leeres Projekt (HTML, CSS, JavaScript) in dem neue Sachen schnell, lokal getestet werden können. Bisher hatte ich einfach eine _index.html_ die ich alle paar Wochen gelöscht und neugeschrieben habe. **Uncool**!
Es geht viel **besser**, **bequemer** und **zukunftsweisender** mit Hilfe von **Git**! Und dieser Artikel zeigt eine Möglichkeit.'
categories: Git
redirect_from: "2009/08/31/ein-sauberes-testsystem-mit-git/"

---

## Ein leeres Projekt
Jeder Webentwickler wird wahrscheinlich seine eigenen Vorstellungen von einem leeren Projekt haben. Bei mir besteht es aus einer _index.html_, einem Ordner für _Javascript_ und einem für _CSS_. Eine einfache _style.css_ ist eingebunden und gibt dem ganzen ein nettes aussehen, ein paar _Listen_ und _Divcontainer_ und natürlich eine aktuelle _jQuery Version_ sind eingebunden.
Testen, funktioniert, in einem Ordner zur Verfügung stellen (z.B. http://localhost/test/) und los gehts.

## Ein Git Projekt initialisieren
Wie man [Git unter OSX installiert](http://www.interaktionsdesigner.de/2009/05/25/mein-git-tutorial/ "Git installieren unter OSX"), habe ich schon beschrieben. Für Windows gibt es sicher die eine oder andere gute Anleitung im [Netz](http://www.google.de "Git im Netz"). Durchhalten! Nach der Installation ist der Umgang mit Git kinderleicht.
Undzwar über das **Terminal**. Mit dem Befehl _cd_ wechselt man in den Ordner in dem das Testprojekt liegt:

    cd Projekte/test/

Anschließend wird ein **leeres Repositorie** im Ordner erstellt, in dem man sich befindet:

    git init

Wenn das Projekt leer und gut aussieht, dann wird es als **erste Version** ins Repositorie geschrieben. Dazu reicht eine Zeile:

    git commit -a -m "Das leere Testprojekt"

Der Befehlt _commit_ wird mit zwei Parametern aufgerufen: das _-a_ zeigt an, dass alle Dateien und Ordner ins Repositorie aufgenommen werden sollen. Alternativ wäre die komplette Auswahl mit_git add ._ oder statt dem Punkt einzelne Dateinamen.
Das _-m_ und die folgende _"Nachricht"_ wird zu dem Commit gespeichert und ist sehr praktisch.
Angucken, was im Repositorie gespeichert ist kann man sich auch ganz einfach:

    git log

## Sachen testen!
Das war es fürs Erste. Ein guter Zeitpunkt den Feedreader zu starten, den Twitterstream durchzuschauen und eine interessante Technik zu entdecken, welche man gerne ausprobieren möchte. Zum Beispiel die großartigen, [neuen Module der neuen jQuery UI Version 1.8](http://blog.jqueryui.com/2009/08/jquery-ui-18a1/ "jQuery UI 1.8").
Im Testprojekt können jetzt alle Dateien gelöscht, hinzugefügt und verändert werden. **Dein Platz zum austoben!**

## Testergebnisse speichern
Und jetzt wirds spaßig! Nehmen wir an, mitten im Testen der neuen Plugins kommt eine neue Twitternachricht an und verspricht eine noch tollere Technik, die wir auch ausprobieren **müssen**.
Also wird ein neuer **Ast** (_Branch_) in Git angelegt, der die UI Tests beinhaltet:

    git branch "jQueryUI"

Wenn man den Namen weglässt (_git branch_) dann gibt git eine Übersicht über alle Branches aus. Der Branch der mit einem Sternchen gekennzeichnet ist, ist der in dem wir uns gerade befinden. Das sollte der neu angelegte sein.
Anschließend wird der aktuelle Zwischenstand ins Repositorie geschrieben:

    git commit -a -m "jQuery UI 1.8 zickt noch ein bisschen rum"

Gespeichert!

## Zurück zum leeren Testprojekt
Hier wirds jetzt spannend!

    git checkout master

Mit diesem einfachen Befehl haben wir unser **leeres Testprojekt zurück**! Diese Anweisung überschreibt alle Daten in dem entsprechenden Verzeichnis. Möchte man die Ergebnisse behalten, sollte man diese in einem Branch speichern, damit der Master-Branch immer das leere Testprojekt enthält.

## Weiterentwicklen
Das schöne ist, dass der Master sich weiterentwickeln kann. Soll jQuery UI also immer dabei sein (dann aber die stabile Version), dann muss sie nur im Testprojekt hinzugefügt werden und in Git bekannt gemacht werden (sofern wir uns im Master-Branch befinden):

    git commit -a -m "Leeres Projekt mit jQuery UI"

Damit verliert man den alten Stand des Testprojekts nicht! Wenn man die alte Version wieder braucht, holt man sich die mit Hilfe des Dachs **^** aus dem Repositorie zurück:

    git checkout master^

Die vorletzte Version gibts mit _master^^_ usw.

## Fazit
Softwareversionisierung ist eine großartige Sache und sich damit zu beschäftigen erleichtert nicht nur die einsame Arbeit am eigenen Computer, sondern ermöglicht überhaupt erst eine **effektive Zusammenarbeit im Team**.
Ich kann also nur jedem wärmstens empfehlen mit kleinen, lokalen Projekten zu beginnen und **dran zu bleiben**. Demnächst kommen hoffentlich die nächsten Anleitungen. Stoff genug gibts ja.
Bis dahin wünsche ich _frohes versionisieren_!