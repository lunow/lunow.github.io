---

layout: post
title: "TYPO3 mit geschütztem Bereich - aber ohne Login"
abstract: 'Für einen unserer Kunden brauchten wir eine einfache Seite, plus ein paar Unterseiten, um den Projektvorgang zu dokumentieren. Nichts Kompliziertes und nichts super Geheimes, aber doch soweit versteckt, dass die Besucher und die Suchmaschinen die Inhalte nicht finden.
Deshalb haben wir folgenden Vorgang ermöglicht: Wird die spezielle Unterseite mit dem zusätzlichen Parameter "login=passwort" aufgerufen, wird der Inhalt angezeigt, wenn nicht wird sich freundlich beim Benutzer entschuldigt.
Das ganze funktioniert mit einem einzigen Extensiontemplate. Ohne Extensions und jQuery. Viel Spaß beim Lesen!'
categories: TYPO3
redirect_from: "2009/02/04/typo3-mit-geschutztem-bereich-aber-ohne-login/"

---

Der erste Schritt ist die entsprechende Seite anzulegen, ein bisschen Inhalt und ein Extensiontemplate. Hier wird die Abfrage nach dem Passwort realisiert. 
    
    [globalVar = GP:login = passwort]
    [else]
    page.10.marks.INHALT >
    page.10.marks.INHALT = TEXT
    page.10.marks.INHALT.value = Sorry, aber das ist nur für interne Zwecke geeignet.
    [end]

Fertig ist der einfachste Passwortschutz der Welt!
Aber noch nicht perfekt. Wenn die geschützte Seite Unterseiten hat, dann werden diese immer angezeigt (egal welches Passwort) und bei einem Klick wird der Zugang verweigert.
Der zusätzliche Parameter muss automatisch an die Links angehängt werden. Das passiert über die Konfiguration im ersten Teil der oben ausgeführten Bedingung.
    
    [globalVar = GP:login = einherzfuerkunden]
    config.linkVars = login

Darunter kann man, wie vom Typoscript gewöhnt, Bereiche ein- oder ausblenden. Genau so im Else-Zweig der Bedingung.
    
    page.10.marks.SUBNAV >
    page.10.marks.SUBNAV = TEXT

Alternative wäre den Einstiegspunkt zu ändern und für unangemeldete Besucher das Submenü einer anderen Seite anzuzeigen.
Das wars. Wir freuen uns über den geringen Aufwand und der Kunde freut sich über die "super geheimen Informationen" die er, ohne sich ein weiteres Passwort merken zu müssen, schnell und komfortabel findet.