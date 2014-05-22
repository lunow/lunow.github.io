---

layout: post
title: "Typoscript mit Coda schreiben!"
abstract: '![Typo3 Syntaxhighlight in Coda](http://blog.paul-lunow.de/wp-content/uploads/2008/04/bild-6.png) Der beste Editor für Mac, [Panics Coda](http://www.panic.com/coda/), unterstützt dank der Agentur [Graustich](http://graustich.com/) jetzt Syntaxhighlight für TypoScript! Nicht nur, dass all die schönen Funktionen von Coda anwendbar sind, über die Symbole lässt sich sogar auf die Knotenpunkte zugreifen.'
categories: TYPO3
redirect_from: "2008/04/11/typoscript-mit-coda-schreiben/"

---

Folgendes ist zu tun um in diesen Genuss zu kommen:

1. Coda Plugin von [t3dev.graustich.com](http://t3dev.graustich.com/) besorgen und installieren. Das ist ein ganz normaler Mac Installer.
2. Typoscript auslagern. Dafür kommt in das Templatefeld folgende Zeile:

    <INCLUDE_TYPOSCRIPT: source="FILE: fileadmin/template/typoscript/root.ts">

3. Mit Coda öffnen und fertig ist das komfortable Editieren.
Für meinen Geschmack sind die Farben noch nicht ganz perfekt - aber das lässt sich ja anpassen. Was mich mehr stört, ist die Einfärbung nach dem **=**, hier handelt es sich nicht um Schlüsselwörter, sondern um simplen HTML Code (oder was auch immer).
Um das Template vor neugierigen Anfragen zu schützen, habe ich per .htaccess den Zugriff auf die \*.ts Dateien gesperrt. Das ist sehr einfach:

    RewriteEngine On
    RewriteRule .(ts)$ - [F]

Ich wünsche komfortables Editieren!