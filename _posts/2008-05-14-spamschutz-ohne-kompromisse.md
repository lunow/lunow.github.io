---

layout: post
title: "Spamschutz ohne Kompromisse!"
abstract: 'Am meisten nerven überflutete Datenbanken voller Spam. Und auf dem zweiten Platz landen die Techniken das zu verhindern!Nervige Captchas, Rechenaufgaben, Fragen; größtenteils leicht zu beantworten und trotzdem hinderlich. Hier kommt ein Weg um Spam in Gästebüchern zu verhindern und dabei volle Nutzerfreundlichkeit zu erhalten.
Möglich wird das komplett auf Seite des Servers damit der arme User nicht verwirrt wird.'
categories: Entwicklung, Papyros
redirect_from: "2008/05/14/spamschutz-ohne-kompromisse/"

---

**Jetzt auch als [WordPress Plugin](http://www.interaktionsdesigner.de/2008/07/09/wordpress-plugin-spamkill/ "ID SpamKill Spam Kommentare verhindern") verfügbar!**

## Ein Gästebuch voller Spam
Das Gästebuch von [Papyros](http://www.papyros.org) eignet sich zu testzwecken sehr gut. Selten schreiben echte Menschen, Bots werden aber magisch angezogen. Vor der Abschaltung waren es 30 bis 40 Einträge pro Tag die veröffentlich wurden. Dagegen wurden etwa 7000 aussortiert.

## Fünf einfache Regeln
Nachfolgende Regeln wende ich auf jeden neuen Eintrag an. Die technische Umsetzung folgt.

1. **Zeit**
Ein Spamroboter will sehr viele Nachrichten verbreiten und das in möglichst kurzer Zeit. Das kann natürlich kein Mensch.
Schon an einer Zeitspanne von mind. 5ms scheitern die meisten Bots.
2. **Vertauschte Bezeichnungen**
Offensichtlich werden die Formulare auf simpelste Art und Weise gescannt, ohne Berücksichtigung der Labels. Wir vertauschen
Name und Mailfeld. Sobald eine E-Mailadresse im "Mail"-Feld eingetragen wird, haben wir Spam! (ja, das ist verwirrend)
3. **Hiddenfield**
Ein verstecktes Feld (input type="hidden") muss leer bleiben damit die Nachricht akzeptiert wird.
4. **Anzahl Links im Text**
Links werden natürlich immer verbreitet. Den Benutzern ist ein Link pro Nachricht erlaubt.
5. **Korrekte E-Mailadresse**
Mit einem ganz langem regulären Ausdruck überprüfen wir die E-Mailadresse. Das führt überwiegend zu Erfolg.

## Funktionierts?
Ja! Seit guten 24 Stunden ist der Filter jetzt im [Einsatz](http://www.papyros.org/gaestebuch.html) und hat
schon 44 Nachrichten abgewiesen. Alle Nachrichten laden im Spamlog und sehen typischer Weise so aus:

    E-Mailadresse im Namenfeld
    Zu viele Links im Text
    Die E-Mailadresse ist nicht korrekt
    ---------------
    Hi, The new changes to the site look great. <a href= <a href="http://www.flingblogger.com/hotfling6/senior-relationships-the-best-dating-site.html">senior relationships-the best dating [...]

Für Informationszwecke logge ich die Nachrichten und Gründe der Ablehnung mit.

## Technische Umsetzung
**HTML**
Ein wirksamer Schutz lässt sich sehr schnell und einfach implementieren. Im Formular brauchen wir nur geringe Änderungen:

    <form method="post" action="gaestebuch.html**?s=<?=time()?>**">
    	<input type="hidden" name="nachname" value="">
    
    		<label for="mail">Name:</label>
    			<input type="text" name="**mail**" value=""><br>
    
    		<label for="name">E-Mail:</label>
    			<input type="text" name="**name**" value=""><br>
    
    		<label for="text">Eintrag:</label>
    				<textarea name="text"></textarea><br>
    
    		<label></label>
    			<input type="submit" value="Eintragen!" style="width:auto">
    </form>
    	

Name und E-Mailfeld sind intern bezeichnet. Werden "for" Attribute vom Labelelement eventuell vorgelesen?
Zur Messung der Zeit wird die aktuelle Zeit als GET-Parameter mitübergeben.
**PHP**
Die oben angesprochenen Regeln sind nichts weiter als einfache if-Statements. Fehlermeldungen werden in ein Array geschrieben,
wenn dieses nicht leer ist, kein Eintrag im Gästebuch gemacht. So sieht das bei mir aus:

    // === spam robot filter ===
    $spam = Array();
    
    // Wurde das Formular zu schnell ausgefüllt?
    $pt = time() - $_GET["s"];
    if($pt < 5)
    	$spam[] = "Zu schnell ausgefüllt ($pt ms)";
    
    // Vertauschte Bezeichnungen Name und Mail
    if(ereg('^[-!#$%&'*+\./0-9=?A-Z^_`a-z{|}~]+'.'@'.'[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+.'.'[-!#$%&'*+\./0-9=?A-Z^_`a-z{|}~]+$', $_POST["mail"]))
    	$spam[] = "E-Mailadresse im Namenfeld";
    
    // Leeres Feld Nachname
    if(!empty($_POST["nachname"]))
    	$spam[] = "Eingabewerte im Hiddenfeld 'Nachname'";
    
    // Anzahl Links im Text
    if(substr_count($text, "http://") > 1)
    	$spam[] = "Zu viele Links im Text";
    
    // E-Mailadresse korrekt?
    if(!ereg('^[-!#$%&'*+\./0-9=?A-Z^_`a-z{|}~]+'.'@'.'[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+.'.'[-!#$%&'*+\./0-9=?A-Z^_`a-z{|}~]+$', $_POST["name"]))
    	$spam[] = "Die E-Mailadresse ist nicht korrekt";
    
    	

Fertig!

## Probleme
Mal abgesehen davon das niemand mehr Gästebucheinträge schreibt, ist mir noch nichts kritisches aufgefallen. Vielleicht könnte durch das verschicken, ausdrucken, einscannen und hochladen des Formulars der Timestamp durcheinander kommen.

## Erweiterungen
Sollten die Bots es irgendwann geschafft haben und Einträge verfassen, dann habe ich noch ein paar Dinge, die ich gerne ausprobieren würde. Dazu dann bei Gelegenheit. Bisher läuft es wunderbar.

## Fazit
Genau heute kam der erste Spamkommentar über diesen Blog rein. Wie schreibt man WordPress Plugins?! [Hier ist ein Vorschlag!](http://www.interaktionsdesigner.de/2008/07/09/wordpress-plugin-spamkill/)