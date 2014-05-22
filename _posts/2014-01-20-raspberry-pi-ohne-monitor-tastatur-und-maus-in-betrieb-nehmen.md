---

layout: post
title: "Raspberry Pi ohne Monitor, Tastatur und Maus in Betrieb nehmen"
abstract: 'Der großartige Minicomputer ist jetzt endlich auch in meinem Arbeitszimmer angekommen. Zwischen iMac und MacBookPro stellte sich aber schnell die Frage: wie installiere ich das Teil ohne einen HDMI fähigen Monitor oder USB Tastatur. Zum Glück ist die Lösung kostenlos und ganz einfach!
'
categories: RaspberryPi
redirect_from: "2014/01/20/raspberry-pi-ohne-monitor-tastatur-und-maus-in-betrieb-nehmen/"
background: feuer

---



## Vorwort

Vorweg sei gesagt das der kleine Computer wirklich einen tollen Einstieg bietet in die wunderbare Welt der Minicomputer mit den unbegrenzten Möglichkeiten. Auch als an grafische Benutzeroberflächen gewöhnter Benutzer kommt man schnell hinter die Mechanismen und Tricks der Konsole. Damit man überhaupt dort ankommt muss allerdings ein Betriebssystem auf einer SD Karte platziert und installiert werden.


## Ausrüstung

Zum Starten benötigt man einen Raspberry Pi und eine mind. 4GB große SD Karte. Ein Mini USB Kabel zur Stromversorgung und ein Netzwerkkabel liegen bestimmt in der Kabelkiste rum. Von der [offiziellen Raspberry Pi Seite](http://www.raspberrypi.org/downloads) lädt man sich die neuste Version des **NOOBS** Betriebssystems herunter.


## Vorbereitung

Die SD Karte sollte man als FAT32 Partition formatieren. Das Festplattendienstprogramm tut das ausgezeichnet. Ist die Karte leer kopiert man den Inhalt des Noobs Archivs darauf. Dieses bringt eine ganze Reihe von verschiedenen Linux Distributionen mit. Startet man den Pi kann man eine Auswahl treffen. Ohne Bildschirm, Tastatur und Maus allerdings sehr schwierig.


## Durchführung

Deshalb soll Noobs das passende System **automatisch** und **headless** installieren! Auf der SD Karte müssen die folgenden Vorbereitungen getroffen werden:

1. Im Verzeichnis `os/` liegen alle verfügbaren Distributionen. Hier löscht man alle mit Ausnahme der zu verwendenden. Wenn man keine Ahnung hat, dann am besten **Raspbian** behalten.
2. Jetzt in das übrig gebliebene Verzeichnis wechseln (z.B. `os/Raspbian`) und die Datei `flavours.json` öffnen. Auch hier darf nur ein Eintrag übrig bleiben.
3. Im Rootverzeichnis der SD Karte liegt die Datei `recovery.cmdline` - diese enthält eine Zeile an dessen Ende, mit Leerzeichen getrennt, das Wort `silentinstall` angefügt wird.

Fertig!


## Ergebnis

Die so präparierte SD Karte in den Pi stecken, Strom anschließen und warten. Die Installation dauert 30 bis 40 Minuten. 

Jetzt fehlt nur noch die IP Adresse. Der einfachste Weg ist sich in den eigenen Router einzuloggen und dort eine **DHCP Tabelle** zu suchen. Wenn alles geklappt hat findet sich hier ein Eintrag mit der IP Adresse, gefolgt vom Namen des neuen Computers: `raspberrypi`.

Hat man die IP Adresse öffnet man ein Terminal und gibt den Befehl `ssh pi@IP_ADRESSE` ein. Die folgende Warnung bestätigt man durch eintippen von `yes`. Das Passwort lautet `raspberry`. 

Fertig! Jetzt übernehmen andere Tutorials.