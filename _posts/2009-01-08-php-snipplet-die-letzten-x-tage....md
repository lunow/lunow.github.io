---

layout: post
title: "PHP Snipplet: Die letzten X Tage..."
abstract: 'Dieser **gregorianischer Kalender** hat bekanntlich seine Tücken. Zum Glück gibt es mit PHP eine sehr einfache Möglichkeit **die letzten X Tage **durchzugehen. Ohne sich Gedanken über **Monatswechsel**, **Jahreswechsel** und **Schaltjahre** zu machen.'
categories: PHP
redirect_from: "2009/01/08/php-snipplet-die-letzten-x-tage.../"

---

Das Geheimnis liegt in meiner aktuellen Lieblingsfunktion [strtotime($str)](http://www.php.net/strtotime "Meine Lieblingsfunktion: strtotime"). Diese versucht aus dem übergebenen String einen Timestamp zu machen. Das funktioniert nicht nur mit Daten (10.03.1985 oder 3/10/85) sondern auch mit **relativen Angaben**!!

    for($i = 0; $i <= 10; $i++) {
        $timestamp = strtotime("-{$i} days");
        echo $timestamp." = ".date("d.m.Y", $timestamp). "<br>";
    }

Die **for() Schleife** geht von 0 bis 10 durch und führt den folgenden Code aus. Mit dem Parameter _"-{$i} days"_ wird Tag für Tag zurück gegangen und ein Timestamp generiert. Der kann wie gewohnt, z.B. mit [date()](http://www.php.net/date "Auch ganz nett: date()"), verarbeitet werden. Als Uhrzeit wird die aktuelle Uhrzeit gespeichert.
Das ist leicht zu verhindern! Um den Timestamp von -X Tagen **von 0:00 bis 23:59 Uhr** zu bekommen sind nur kleine Modifikationen nötig. Die Funktion strtotime() bekommt als zweiten Parameter einen Timestamp zugewiesen mit der aktuellen Uhrzeit. Es hilft: [mktime()](http://www.php.net/mktime "Darf nicht fehlen: mktime").

    for($i = 0; $i <= 10; $i++) {
        $start = strtotime("-{$i} days", mktime(0, 0, 01));
        $ende = strtotime("-{$i} days", mktime(23, 59, 59));
        echo "Von ".date("d.m.Y H:i", $start). " bis ".date("d.m.Y H:i", $ende)."<br>";
    }

Die Timestamps kann man jetzt wunderbar benutzen um statistische Datenbankabfragen zu erstellen, E-Mails zu verschicken oder Textdateien zu speichern; der Entwicklung sind keine Grenzen gesetzt. Und um die Tücken vom Kalender kümmern sich andere Leute. Herrlich!
Kennt jemand eine bessere Lösung?