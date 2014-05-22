---

layout: post
title: "phpMyAdmin Quick Access"
abstract: 'Das Problem sind **ca. 120 Datenbanken** auf meiner lokalen Testumgebung und ich will beim arbeiten stets nur schnell in eine einzige. [phpMyAdmin](http://www.phpmyadmin.net/home_page/index.php "phpMyAdmin kennt jeder") lädt aber länger den Frame mit allen Datenbanken. Seit Ewigkeiten stelle ich mir vor einfach anzufangen den Namen zu tippen und _-zack-_ zur Datenbank weiter geleitet zu werden. So siehts aus:![Bildschirmfoto 2010-11-30 um 19.56.53](http://blog.paul-lunow.de/wp-content/uploads/2010/12/Bildschirmfoto-2010-11-30-um-19.56.53.png)'
categories: MySQL, PHP
redirect_from: "2010/12/01/phpmyadmin-quick-access/"

---

## Installation
Wer keine Zeit oder Lust hat etwas über die Technik dahinter zu lesen, lädt sich alle Dateien bei [GitHub](https://github.com/apeunit/pmaqa) herunter und schiebt sie in einen Ordner den er über seinen Webserver erreicht. Anschließend in der **index.php** den Zugang zur Datenbank und den Pfad zur lokalen phpMyAdmin Installation eintragen.
**Fertig!** Aber vorsicht: Es sind absolut keine Sicherheitsmaßnahmen vorhanden, eine Installation auf einem Server würde ich tunlichst **vermeiden**!!

## Die Technik
Die komplette Seite besteht aus der **index.php** Datei. Im oberen Teil sind ein paar Einstellungen zu treffen. Darunter werden mit [mysql\_connect](http://de3.php.net/mysql_connect) und [mysql\_list\_dbs](http://de3.php.net/mysql_list_dbs) alle Datenbanken ausgelesen und in **$db\_list** gespeichert. Die Funktion **mysql\_list\_dbs** gibt ein Objekt zurück das mit einer**while()** Schleife durchlaufen werden kann. In Kurzform:
\[pre\]$connection = mysql\_connect($daten);
$db\_list = mysql\_list\_dbs($connection);
while($row = mysql\_fetch\_object($db\_list)) {
echo $row-\>Database;
}\[/pre\]
Das eigentlich schöne passiert mal wieder mit **jQuery**: das geniale [Plugin Quicksearch](https://github.com/riklomas/quicksearch) erlaubt das blitschnelle durchsuchen während der Eingabe. Das einzige was der Entwickler tun muss ist ein **Formularfeld** mit einer zu durchsuchenden Datenmenge (z.B. einer **Tabelle**) verknüpfen:
\[pre\]$('input\#db').quicksearch('table tr');\[/pre\]
Damit das Formularfeld beim Aufruf der Seite den Fokus erhält erweitert man die Zeile noch um einen einfachen Aufruf:
\[pre\]$('input\#db')
.focus()
.quicksearch('table tr');\[/pre\]

## Fazit
Nach dem der erste Schritt geschafft ist, drängen sich natürlich eine ganze Reihe weiterer Ideen auf:

* Navigation mit Pfeiltasten
* Automatische Vervollständigung
* Anlegen von neuen Datenbanken
Wer Lust hat mitzumachen, ist dazu herzlich auf [GitHub](https://github.com/apeunit/pmaqa) herzlich eingeladen. Neue Ideen und Verbesserungsvorschläge gerne in den Kommentaren.