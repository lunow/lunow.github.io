---

layout: post
title: "Asynchrone Datenübertragung zwischen TYPO3 und jQuery"
abstract: '![TYPO3 Entwicklung und Liebe](http://blog.paul-lunow.de/wp-content/uploads/2008/09/logo_save-area_01.jpg)
Nach dem ich mal wieder über den [Appell an Webentwickler](http://coderesponsibly.org/de/ "Appell an Webentwickler") gestolpert bin, beginne ich meinen ersten zweiten Eintrag dieses Jahres mit einem tollen Thema welches ich zwischen den Jahren entdeckt habe: Die **effektive Kommunikation zwischen TYPO3 und jQuery** dank **Ajax**.
Möglich macht das die Funktionalität der **eID** seit **TYPO3 Version 4** und die geniale Handhabung vom Lieblingsframework mit **JSON**. Eingesetzt hab ich es in einer tollen, neuen Extension die [wir](http://www.5andfriends.com "Wir sind 5andfriends.com") entwickelt haben und die hoffentlich bald das Licht der Welt erblicken wird. Das wird dann gesondert gefeiert.'
categories: jQuery, Tutorial, TYPO3
redirect_from: "2009/01/04/asynchrone-datenubertragung-zwischen-typo3-und-jquery/"

---

## Um was geht es?
Die Eingaben eines Benutzers werden asynchron, d.h. ohne die Seite neuzuladen, an den Server übergeben. Der verarbeitet sie und liefert ein Ergebnis zurück, welches von **jQuery** verarbeitet und dargestellt wird.
Gebraucht wird diese Technik um zum Beispiel registrierte Benutzer anzuzeigen. Ähnliches habe ich schon beschrieben im Beitrag über das [nachladen kompletter Seiteninhalte](http://www.interaktionsdesigner.de/2008/12/12/typo3-seiten-dynamisch-nachladen-mit-jquery/ "Vorheriger Post: Seiten nachladen"). Dort wurde ein neuer _Seitentyp_ angelegt. Das hat allerdings den Nachteil das die ganze Seite gerendert werden muss. Wir können schon wesentlich früher den Renderingprozess abbrechen und zügig ein Ergebnis bekommen.

## Vorbereitungen mit TYPO3
Als erstes bereiten wir TYPO3 darauf vor und erstellen eine **neue Extension** mit dem Kickstarter. Ich habe ein **Frontend Plugin** erstellt und die üblichen Spracheinstellungen gewählt. Was man will ist also schnell zusammen geklickt.
Und jetzt wirds spannend: In der _ext\_localconf.php_ registrieren wir die _eID_ (das e steht für Extension):

    $TYPO3_CONF_VARS['FE']['eID_include']['MEINE_eID'] = 'EXT:kiwi_database/pi1/MEINE_eId.php';

Es geht um das Frontend, eine neue_eID_ wird eingebunden, für die eben erstellte Erweiterung. MEINE\_eID ist durch einen guten Namen zu ersetzen (Extensionkey vielleicht).
Im Wert der Variable ist der Pfad zum Script angegeben welches benutzt wird. EXT: zeigt auf den Ordner in dem die Extensions gespeichert sind, dann weiter zu unserer Erweiterung und zur speziellen Datei.
Ist _diese Datei_ angelegt, einfach mal ein **<? echo "Hallo Welt"; ?\>** darin speichern und zum Testen aufrufen, über den neuen Parameter eID: www.mein-typo3-projekt.de/index.php?**eID=MEINE\_eID**. Wenn das auf eine weiße (super schnelle) Seite weiterleitet auf dem die Welt begrüßt wird, hat alles geklappt.
Wenn nicht, dann lohnt sich ein Blick ins**Error Log** von PHP und einfach weiter probieren (viel Glück).
Drei Dinge sind für die Datei _MEINE\_eId.php_ wichtig:

### 1\. Sicherheit

    if (!defined ('PATH_typo3conf')) die ('Could not access this script directly!');

Mit dieser Zeile wird der direkte Aufruf der Datei verhindert. Sicher ist sicher.

### 2\. Datenbankzugriff

    $feUserObj = tslib_eidtools::initFeUser(); // Initialize FE user object
    tslib_eidtools::connectDB(); //Connect to database

Mit diesen zwei Befehlen steht die **Datenbankverbindung** wir gewohnt im globalen Array **$GLOBALS\["TYPO3\_DB"\];** zur Verfügung. Es ist sehr einfach zu testen ob es funktioniert hat:

    echo "<pre>", print_r($GLOBALS["TYPO3_DB"]), "</pre>";

Diese Zeile gibt nicht nur aus, ob eine Verbindung besteht, sondern auch den zuletzt ausgeführten MySQL Query. Sehr praktisch ;)

### 3\. Die eigene Extension
Und damit kommen wir zu einer Einschränkungen. Es gibt **kein cObj**, da keine Seite aufgebaut wurde. Man kann zwar, ähnlich der Datenbank eins erstellen, aber das ist nicht nur kompliziert sondern hebt den Grund der Extension auf, da dann wieder eine komplette Seite gerendert wird. Das zur Folge das es nicht möglich ist die Benutzereinstellungen im Typoscript abzufragen. Ich empfehle die Auslagerung in die _localconf.php_.

    require_once('typo3conf/ext/meine_ext/pi1/class.tx_meineext_pi1.php');
    $obj = t3lib_div::makeInstance("tx_meineext_pi1");

Die erste Zeile bindet die passende Datei ein, die zweite erschafft eine **neue Instanz der eigenen Extension**.

## Langsam Richtung JSON
In der Extension wird jetzt abgefragt, was abgefragt werden muss. Zugriff auf in der URL übergebenen Parameter erhählt man z.B. über **$GLOBALS\["\_GET"\]\["PARAMETER\_NAME"\]**.
Am Ende sollte ein **Array** zur Verfügung stehen, welches alle Daten beinhaltet. Das wird in JSON umgewandelt:

    $response = $obj->getAnswer($GLOBALS["_GET"]);
    echo json_encode($response);

## Fertig, auf zum Frontend

    page.includeJS.file1 = fileadmin/template/js/jQuery.js
    page.includeJS.file2 = fileadmin/template/js/jquery.meineext.js

Interessant ist die **zweite Datei**. Wie gewohnt wird alles in den jQuery-Aufruf verpackt, der wartet bis das DOM geladen ist. Wie ein HTML Formular aussieht weiß vermutlich jeder. Nehmen wir an das Form-Tag trägt die **ID** **assi** (für asynchron) und beinhaltet genau **ein Textfeld** für die Eingabe. Das Javascript muss das Abschicken des Formulars _abfangen_, _versenden_, die Antwort als JSON Objekt _verarbeiten_ und _anzeigen_. Klingt kompliziert? Aber nicht mit **jQuery**:

    $(document).ready(function() {
    	// Das Abschicken des Formulars verhindern
    	$("#assi").submit(function() {
    
    		//Ajaxabfrage stellen
    		$.ajax({
    			url: "index.php",		// Achtung mit RealURL!
    			type: "GET",			// Daten per GET verschicken
    			data: {
    				eID: "MEINE_eID",	// die erstellte eID
    				input: $("#assi input[type=text]")	// Benutzereingabe
    			},
    			dataType: "json",		// das gibts zurück
    
    			// Es hat funktioniert?
    			success: function(response) {
    				// Code der ausgeführt wenns geklappt hat
    				// !! Wesentliches Ding !!
    			},
    
    			// Schade, es war ein Fehler
    			error: function(error) {
    				alert("Sorry, hat nicht funktioniert");
    			}
    		});
    
    		//Damit das Formular nicht doch noch abgeschickt wird
    		return false;
    	});
    });

Ich mag jQuery Code! Nach einiger Zeit hat man sich an die wilden Klammern gewöhnt und kann nicht mehr damit aufhören. Die Kommentare erläutern die einzelnen Dinge, oder [die offizielle Doku](http://docs.jquery.com/Ajax/jQuery.ajax#options "Offizielle jQuery Dokumentation zu $.ajax"), wir wenden uns lieber dem **wesentlichen Ding** zu!

## Verarbeitung von JSON Objekten zu HTML mit jQuery
Damit die Funktionen besser nachvollzogen werden können, ein Beispiel: So sieht die Funktion _getAnswer()_ vereinfacht aus:

    function getAnswer() {
    	$a = Array(
    		0 => Array("name" => "paul", "like" => "Webstandards"),
    		1 => Array("name" => "ramon", "like" => "Bier"),
    		2 => Array("name" => "max", "like" => "Sport")
    	);
    	return $a;
    }

Das wird als JSON Objekt sowas:

    [{"name":"paul","like":"Webstandards"},{"name":"ramon","like":"Bier"},{"name":"max","like":"Sport"}]

Im wesentlichen Teil der jQuery Ajaxabfrage steht dieser String jetzt als Objekt zur Verfügung. Testen lässt sich das über die **Firebug Konsole** mit _console.log(response)_. Das und alles folgende spielt sich in der Funktion **success(response)** ab!
Jedes Array verfügt über die Eigenschaft **length**, es lässt sich also herausfinden wieviele Elemente vorhanden sind.

    if(response.length > 0) {
    }

Das _else_ überlasse ich mal jedem selbst, kommen wir zur Superfunktion **$.each()**. Diese erwartet zwei _Parameter_: Das zu untersuchende Objekt (**response**) und eine **Funktion** die auf jede Zeile angewendet werden soll.
Angenommen es gibt auf der Seite eine Liste (<ul\>) mit der **ID answer,** dann wird diese mit neuen Listenelementen versorgt:

    var new_content = "";
    $.each(response, function(i, row) {
    	new_content+= "<li><strong>"+row.name+"</strong> mag "+row.like+"!</li>";
    });
    $("#answer").html(new_content);

Die Funktion, welche auf jede Zeile angewendet wird, erwartet zwei _Parameter_: **i** ist der Indikator welcher die **aktuelle Position** beinhaltet, **row** ist das **aktuelle Objekt**. Die Schlüssel aus dem PHP Array sind hier die Namen der Eigenschaften, herrlich oder?

## Fertig!
Um die _Besucher ohne JavaScript_ nicht außen vor zu lassen muss noch sichergestellt werden, dass die Extension bei "normal" erhalten der Daten die gleiche Ausgabe erzeugt. Das dürfte bekannt sein?!
Um sich den Stress mit **einem Template** zu sparen gibt es dann in ein paar Tagen irgendwann meine **neue Extension**! Bis dahin wünsche ich **erfolgreiches Programmieren in 09**!