---

layout: post
title: "Coda syntax highlighting für Typoscript"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/09/typoscript.png)Dank des unermüdlichen Einsatzes von Patrick Lischka gibt es die sehr angenehme Erweiterung für Coda [ts4c](http://t3dev.graustich.com/) in einer neuen Version.
Die Version 1.1.12 behebt einige Fehler und bietet eine ganze Liste Neuerungen. Da macht das Arbeiten mit Typoscript doch gleich wieder mehr Spaß.
Und einen wertvollen Tipp konnte er mir auch geben: Mit ein paar Zeilen Typoscript lässt sich das lästige Cache leeren nach jeder kleinen Änderung per FTP verhindern.'
categories: Allgemein
redirect_from: "2008/09/05/coda-syntax-highlighting-fur-typoscript/"

---

## Typoscript auslagern
Mit der bekannten Zeile

    <INCLUDE_TYPOSCRIPT: source="FILE: fileadmin/#YourPath/#YourFile.ts">

lagern wir die Konfiguration aus. Soweit so gut.

## Cache leeren verhindern
_Davor_ fügen wir eine Bedingung ein, welche prüft ob ein Backend Benutzer angemeldet ist:

    [globalVar = TSFE : beUserLogin> 0]
    config.no_cache = 1
    [global]

Dazu gehört in das TSConfig Feld des Benutzers noch die folgende Zeile:

    admPanel.override.tsdebug.forceTemplateParsing = 1

So einfach! Bleibt mir noch zu sagen: Vielen Dank für die netten Mails, die guten Tipps und diese herrliche Erweiterungen für das liebliche Coda. Ich bin gespannt auf die nächsten Versionen!
Mehr Informationen: [Typoscript syntax highlighting für Coda](http://t3dev.graustich.com/).