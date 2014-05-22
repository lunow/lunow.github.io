---

layout: post
title: "Verkettete Funktionen und Checkboxen mit jQuery"
abstract: 'Endlich konnte ich mich mal wieder lange und intensiv mit jQuery auseinander setzen. Es ging um ein Formular welches auf verschiedene Angaben verschieden reagieren sollte. D.h. wenn man auswählt das man Nr 1 ist, gibt es im folgenden andere Pflichtfelder als wenn man Nr 2 wäre, usw.
Dabei konnte ich die ganze Zeit lächeln weil es mit jQuery **so viel Spaß** macht zu arbeiten. Und das will ich natürlich niemandem vorenthalten. Eine einzige Zeile reicht aus um eine ganze Reihe Aktionen für alle Browser (_auch den IE6_) auszuführen. Man kann sehr einfach abfragen ob Checkboxen angeklickt sind oder nicht.
Außerdem habe ich eine tolle Funktion entdeckt um zu verhindern das auffahrende Elemente außerhalb des sichtbaren Bereichs liegen. Viel Spaß damit!'
categories: jQuery, Tutorial
redirect_from: "2008/11/28/verkettete-funktionen-und-checkboxen-mit-jquery/"

---

## Verkette Funktionen nutzen
Um unaufdringliches JavaScript zu schreiben ist es wichtig die Eventhandler erst mit der Laufzeit des Scripts den Elemente zuzuweisen damit nicht JavaScript-fähige Betrachter dadurch nicht verwirrt werden.
Es gibt also ein Formular welches ohne JavaScript funktioniert und mit JavaScript noch besser wird. Hier ein vereinfachter HTML Aufbau:

    <form>
    	<fieldset>
    		<label for="auswahl">Auswahl</label>
    		<select name="auswahl" id="auswahl">
    			<option>Bitte auswählen...</option>
    			<option value=1>Nr 1</option>
    			<option value=2>Nr 2</option>
    		</select>
    	</fieldset>
    
    	<fieldset class="step2">
    		<label for="name">Name</label>
    		<input type="text" name="name" id="name">
    
    		<label for="stadt">Stadt</label>
    		<input type="text" name="stadt" id="stadt">
    
    		<label for="cool">
    			<input type="checkbox" name="cool" id="cool" value="true"> Ich kann jQuery
    		</label>
    	</fieldset>
    	<input type="submit" value="Eintragen" class="submit">
    </form>

Die Anforderung ist, nur wenn der Benutzer _Nr 2_ auswählt soll er seinen Namen und die Stadt angeben. Nutzer ohne JavaScript können alles ausfüllen.
Und jetzt kommt das magische jQuery ins Spiel:

    $(document).ready(function() {
    	$("form").
    		.find(".step2").hide().end()
    		.find("#auswahl").change(function() { step2($(this).val(); ) }).end()
    		.find(":input:first").focus().end()
    		.submit(function() { step3(); return false; });
    });

Ist das nicht schön? Was ist hier passiert? Grundlegend selektieren wir mit **$("form")** das komplette Formular und alle enthaltenen Elemente. Die Funktion**find()** sucht aus diesem Stapel die gewünschten Elemente heraus auf welche die folgenden Funktionen angewendet werden.
Mit **end()** am Ende jeder Zeile wird diese Auswahl wieder aufgehoben, im Stapel befinden sich jetzt wieder alle Elemente.
In der **ersten Zeile** wird das zweite Fieldset ausgeblendet, bzw. alles was sich im Formular befindet und die Klasse _.step2_ hat.
**Zeile Zwei** legt einen Eventhandler auf die Selectbox mit der ID _auswahl_. Was passiert habe ich der besseren Übersicht in eine andere Funktion ausgelagert.
**Zeile drei** ist richtig cool. Mit dem Doppelpunkt werden Psydoklassen eingeleitet. _:input_ steht für sämtliche Eingabefelder und _:first_ für das erste Element. Wir selektieren also das erste Eingabefeld im Formular und geben diesem den Fokus. Aber vorsicht, auch Eingabefelder von Typ _hidden_ fallen hier runter. Daran muss man denken.
**Anschließend** wird dem Formular noch ein Eventhandler zugewiesen der das Abschicken auffängt. Hier ist das _return false;_ wichtig damit das Formular nicht wirklich abgeschickt wird.
Herrlich, oder?

## Der richtige Umgang mit Checkboxen
Wenn man auf die Checkbox klickt soll was passieren. Mein erster Gedanke war einen Eventhandler auf die Checkbox zu legen: _change()_. Verändert sie sich, soll eine Aktion ausgeführt werden. Funktioniert so aber nur halb im Internet Explorer, weil der Event erst ausgelöst wird wenn sich der Fokus nicht mehr im Element befindet.
**Lösung**: nicht change() benutzen sondern **click()**. Das war einfach.
Eine Funktion wird aufgerufen, allerdings weiß man nicht ob die Box nun angehakt ist oder nicht. Also frage ich einfach mit _$(this).val() _den Inhalt ab, aber denkste: der ist immer gleich!
**Lösung**: Wir bedienen uns der Psydoklassen. Das geniale jQuery bringt zum einen die Psydoklasse _:checked_ mit, zum anderen die Funktion_is()_. Das könnte man doch super kombinieren, oder?

    $("#cool").click(function() {
    	if($(this).is(":checked"))
    		//Ist angehakt - mach was
    	else
    		//Ist nicht angehakt - machs wieder rückgängig (bitte)
    });

Firefox machts, aber der Internet Explorer hält den abgefragen Ausdruck immer für wahr (leichtgläubig). Glücklicherweise ist der _Workaround_ einfach:

    if($(this).is(":checked") == "true")

Und schon macht der IE auch mit. Danke sehr!

## Abfragen in den Selektoren
Eine Kleinigkeit war noch: Der Kunde wollte je nach Auswahl eine andere Beschreibung für eins der Felder. Kein Problem, da mit jQuery jedes Attribut in den Selektoren abgefragt werden kann:

    if($("#einfeld").val() == "bla")) {
    	$("label[for=anderesfeld]").text("Andere Bezeichnung");
    }
    else {
    	$("label[for=anderesfeld]").text("Diese Bezeichnung");
    }

## Automatisch scrollen
Okay, _fieldset.step2_ soll sich ausrollen, wenn die richtige Option gewählt ist. Das Problem: auf kleinen Monitoren ist, dass es sich zwar schön ausrollt, aber der Benutzer kriegt davon nichts mit, weil es außerhalb des sichtbaren Bereichs liegt.
Aber es gibt nichts was mit jQuery nicht funktionieren würde. **Die Lösung:** Jedes Objekt besitzt eine Funktion**scrollIntoView()**. Die rufen wir einfach auf wenns fertig ist.

    function step2() {
    	$(".step2").slideDown(function() {
    		$(this)[0].scrollIntoView();
    	});
    }

Zu beachten ist das _\[0\]_, denn die Funktion steht nur einem einzelnen Objekt zur Verfügung, nicht einem ganzen Stapel von Objekten. Wenn man sich unsicher ist, einfach _console.log($(this));_ und solange rumklicken bis man die Funktion gefunden hat (im Firebug).
Da im Fieldset lauter Eingabefelder vorhanden sind, können wir die Zeile sogar noch ein bisschen schöner machen:

    $(this).find(":input:first").focus()[0].scrollIntoView();

Geht es noch effektiver?!?!?! Ich glaube kaum. Und jetzt lächelnd wieder an die Arbeit.