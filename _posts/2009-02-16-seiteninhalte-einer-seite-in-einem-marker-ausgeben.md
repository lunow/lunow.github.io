---

layout: post
title: "Seiteninhalte einer Seite in einem Marker ausgeben"
abstract: 'Der Titel klingt etwas komisch, aber die Funktion an sich ist **super praktisch**. Worum geht es? Es gibt verschiedene Situationen in denen Inhalte vom Redakteur gepflegt werden sollen, die z.B. auf jeder Seite auftauchen sollen. Aktuell hatten wir das mit einem Copyright Hinweis der auf jeder Seite erscheinen "musste".
Die erste Idee war, es einfach fest ins Template zu schreiben, aber das ist natürlich super unpraktisch bei Mehrsprachigkeit und der "Workflow" des Redakteurs ist alles andere als optimal.
Also wird der Inhalt**einer versteckten Seite in ein Marker transportiert **und im Template ausgegeben. Ganz einfach!'
categories: TYPO3
redirect_from: "2009/02/16/seiteninhalte-einer-seite-in-einem-marker-ausgeben/"

---

Als erstes muss eine, im Menü versteckte, **Seite angelegt** werden. Deren ID sollte muss man sich merken (z.B. 36).
Anschließend ins Template wechseln und den **Marker einfügen** (z.B. \#\#\#COPYRIGHT\#\#\#).
Jetzt fehlen nur noch ein paar **Zeilen Typoscript **im Root-Template.
    
    COPYRIGHT = CONTENT
    COPYRIGHT {
        table = tt_content
        select.pidInList = 36
        select.orderBy = sorting
        select.languageField = sys_language_uid
    }

Der ist natürlich an der entsprechenden Stelle eingefügt, z.B. unter _page.10.marks_. Mit der Anweisung _select.pidInList _wird die Seite ausgewählt. _orderBy_ behält die Sortierung aus dem Backend und mit _languageField_ bleibt der Inhalt auch in der richtigen Sprache.
Fehlt nur noch ein Satz bei der Schulung und **fertig ist der Lack**!