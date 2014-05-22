---

layout: post
title: "Riesige Datenbanken rumschieben"
abstract: ''
categories: MySQL
redirect_from: "2008/04/10/riesige-datenbanken-rumschieben/"

---

Mein Serveradmin quatscht mich immer voll mit SSH, Komandozeile und solchem Zeug, aber wer will sich damit schon auseinander setzen wenn es auch anders geht?  
Zu diesem Zweck habe ich heute den netten MySQLDumper wieder entdeckt. In dem er seine Anfragen aufteilt umgeht er jede Timeoutgrenze der Server und erstellt zuverlässig Dumps der Daten. Und zwar so:

1. [Runterladen](http://www.mysqldumper.de/), entpacken und auf den Server laden.
2. Begrüßt wird man nach dem Aufruf mit einem fixen Installer, der auch auf fehlende Zugriffsrechte hinweist. **Danach einen Verzeichnisschutz einrichten!**
3. Links unter dem Hauptmenü kann die richtige Datenbank ausgewählt werden um über den Menüpunkt "Backup" angesteuert zu werden. Die Ausgaben während er arbeitet gehen gegen Null, aber das kriegt man hin.
4. Auf dem Zielserver wieder hochladen und das Dump von eben in den Ordner _/work/backup/_ kopieren.
5. Über den Menüpunkt "Wiederherstellen" kann die Datei angewählt und geladen werden. Funktioniert auch wenn die Zieldatenbank noch leer ist.
Fertig! Funktioniert zuverlässig und gibt, nach der Einrichtung des CronScripts mit täglichem Backup, ein gutes Gefühl.