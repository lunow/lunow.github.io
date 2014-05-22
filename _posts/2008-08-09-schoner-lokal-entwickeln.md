---

layout: post
title: "Schöner Lokal entwickeln"
abstract: 'Mit [einfachen Mitteln](http://www.mamp.info/de/index.php) ist auf dem eigenen Rechner ein Webserver installiert und die Entwicklung von spannenden Projekten kann beginnen. Für die lokale Entwicklung ist das Directorylistning vom Apache Webserver schon sehr praktisch.
![](http://blog.paul-lunow.de/wp-content/uploads/2008/08/vorher.png)
Nur leider sieht es nicht besonders schön aus. Mit einfachen Mitteln lässt sich das aber sehr schnell ändern, und schon surft man voller Freude durch die eigene Ordnerstruktur.'
categories: Entwicklung
redirect_from: "2008/08/09/schoner-lokal-entwickeln/"

---

So könnte man es machen:
**Standardschriftart im Browser ändern.** Mit zweieinhalb Klicks ist Verdana oder Arial eingestellt was einen wesentlich angenehmeren Eindruck auf ungestylten Seiten hinterlässt. Im Firefox gehts über _Einstellungen_ \> _Inhalte_ \> _Schriftarten und Farben_.
**Die htaccess im Heimatverzeichnis anpassen.** Der Apache Webserver bietet umfangreiche Möglichkeiten um das Listning anzupassen. Besonders interessant wird es mit eigenen Header- und Footer-Dateien. So sieht es bei mir aus:

    # Serversignatur ausschalten. Ich weiß ja schon was ich für einen Server installiert habe.
    ServerSignature Off
    
    # Anzeigen vom Verzeichnisinhalt, sofern keine index.html/index.php vorhanden ist.
    Options +Indexes
    
    # Jetzt wirds verschönert!
    IndexOptions HTMLTable FancyIndexing
    
    # Einen eigenen Header einbinden. In dem ist Platz für CSS und JavaScript
    HeaderName /server/header.html
    
    # Wir brauchen überhaupt keinen Footer.
    IndexIgnore footer.html
    
    # Verhindern das die Tabelle in eigene Bodytags verschachtelt wird
    IndexOptions SuppressHTMLPreamble
    
    # Manchmal will man auch die kleinen Icons anklicken.
    IndexOptions IconsAreLinks
    
    # Zeigt die HTML Titel in den Beschreibungen an.
    # Kommt aber selten zum Einsatz, da meistens eine index Datei vorhanden ist
    IndexOptions ScanHTMLTitles
    
    # Die Spalte Beschreibung soll lang genug sein
    IndexOptions DescriptionWidth=*
    
    # Und eine Standardsortierung. Die zickt aber manchmal rum...
    IndexOrderDefault Ascending Name

Das wars! Und schon sieht das ganze wesentlich angenehmer aus.
[](http://blog.paul-lunow.de/wp-content/uploads/2008/08/nachher-1.png)
Tiefschürfende Informationen über alle Möglichen htaccess Einstellungen gibt es bei [trash.net](http://www.trash.net/faq/htaccess.shtml) (de) oder direkt von den [Machern](http://httpd.apache.org/docs/2.0/howto/htaccess.html) (en).
Wer keine Lust hat selber Dateien anzulegen, lädt sich [dieses Archiv](http://www.interaktionsdesigner.de/stuff/htaccess.zip) runter und entpackt es in das Heimatverzeichnis des Webservers. In der _header.html_ befindet sich das Styling welches die Ausgabe einfärbt.