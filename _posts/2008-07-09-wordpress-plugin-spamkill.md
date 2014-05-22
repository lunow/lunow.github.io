---

layout: post
title: "WordPress Plugin SpamKill!"
abstract: 'Na, genervt vom Spam in den Kommentaren? Meine Erfahrungen mit den fiesen Spamrobotern habe ich jetzt in ein WordPress Plugin gepackt und biete es zum freien Einsatz an.Hier auf dem Blog ist es schon im Einsatz, hat aber bisher noch nichts abwehren müssen. [Direkt zum Download](http://www.interaktionsdesigner.de/2008/07/09/wordpress-plugin-spamkill/#download).'
categories: Entwicklung, WordPress
redirect_from: "2008/07/09/wordpress-plugin-spamkill/"

---

## Funktionsweise
[Die ausführliche Beschreibung finden Sie hier.](http://www.interaktionsdesigner.de/2008/05/14/spamschutz-ohne-kompromisse/) Die Regeln habe ich weiter vereinfacht. Mein PlugIn prüft aktuell nur 3 von 5:

1. **Zeit**
Ein Kommentator muss mind. 5s benötigen um einen Kommentar zu schreiben. Ansonsten ist er eine Machine.
2. **Vertauschte Bezeichnungen**
Im HTML Formular sind Name und Emailfeld von den Bezeichnungen her vertauscht. Ist eine E-Mailadresse im Namenfeld eingetragen, handelt es sich mit ziemlicher Sicherheit um unerwünschte Werbung.
3. **Hiddenfield**
Ein verstecktes Formularfeld (<input type="hidden") muss leer bleiben. Spamroboter füllen meistens sinnlos alles aus.
Schon wenn eine der Regeln zutritt wird der Kommentar abgewiesen.
Zum verfolgen der Tätigkeiten wird eine simple Logdatei beschrieben. Dieses Verhalten sollte man bei vielen Spamnachrichten abschalten.

## Installation
Nach dem Download in den Ordner _wp-content/plugins/_ verschieben und im WordPress Backend aktivieren.
Anschließend müssen noch ein paar Dinge im Formular der Kommentareingabe angepasst werden. Je nach Theme unterschiedlich, meistens findet sich dies aber in der Datei _wp-content/themes/THEME-NAME/comments.php_.

1. **Attribut Action vom Form-Tag**
Ich habe keinen anderen Weg gefunden in die Abarbeitung einzugreifen. Deshalb habe ich sie ersetzt. Das Attribut Action muss auf folgende Datei zeigen:

    <?php echo get_option('siteurl'); ?>/wp-content/plugins/id-spamkill/id-comments-without-spam.php

2. **Bezeichnungen vertauschen**
Name und ID vom Namen und E-Mailfeld vertauschen. Nicht vergessen auch das for-Attribut vom Label anzupassen. Bei mir sieht es jetzt so aus:

    <p class="first">
    	<label for="email">Name <?php if ($req) echo "(erforderlich)"; ?></label>
    	<input class="styling" type="text" name="email" id="email" value="<?php echo $comment_author; ?>" size="22" tabindex="1" />
    </p>
    
    <p>
    	<label for="author">eMail <?php if ($req) echo "(erforderlich)"; ?></label>
    	<input class="styling" type="text" name="author" id="author" value="<?php echo $comment_author_email; ?>" size="22" tabindex="2" />
    	<span>(wird nicht veröffentlicht)</span>
    </p>

3. Innerhalb der beiden Form-Tags müssen die Hooks abgearbeitet werden. Auch das sollte bei den meisten Themes schon vorhanden sein:

    <?php do_action('comment_form', $post->ID); ?>

Zu guter letzt muss die Datei _wp-content/plugins/id-spamkill/id-spamlog.txt_ für das Script noch beschreibbar gemacht werden (z.B. mit chmod(0777)). Das wars! Einträge werden gefiltert.

## Konfiguration
Viel muss beim Plugin nicht konfiguriert werden. Da es so wenige Sachen sind sie noch nicht als "normale" Einstellungen über das Backend erreichbar sondern in der Datei _id-spamkill.php_ zu finden. Ab Zeile 13 geht es los:

    protected $logSpam = true;   // Spamlog speichern?
    protected $logFile = "id-spamlog.txt";    // Datei in der das Spamlog gespeichert wird
    protected $logSep = "n-----------------------------------------------n";    // Trennezeichen zwischen dein einzelnen Einträgen der Logdatei.

## Download
Das Plugin kann als [Archiv herunter geladen werden](http://blog.paul-lunow.de/wp-content/uploads/2008/07/id-spamkill-01.zip). Bei der Verwendung wäre eine kurze Nachricht nett.

## Fazit
Das Plugin ist in einer sehr frühen Version und bietet noch viel Raum nach oben. Gerade die aufwendige Installation stört mich gewaltig, aber ich habe bisher keinen anderen Weg gefunden um so tiefgreifend das System zu verändern.
Ich habe ein gutes Gefühl und lade alle Besucher herzlich ein, mit mir zu beoachten welcher Spamkommentator es als erstes schafft durch zu kommen.
Bei Fragen, Problemen und Anregungen stehe ich gern zur Verfügung.