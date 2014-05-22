---

layout: post
title: "Der beste Editor aller Zeiten: Sublime Text 2"
abstract: 'Als Entwickler ist man ja oft und gerne auf der Suche nach Programmen die einem das Leben erleichtern. Im Mittelpunkt steht dabei der Editor vor dem man täglich Stunden über Stunden Code in den Rechner hackt.
Nach Eclipse, Coda, Smultron und Aptana habe ich endlich den Editor gefunden der mir das Leben so leicht macht wie ich das haben möchte: Sublime Text 2. Er ist schnell, wunderschön, schlicht, elegant und auf grandiose Art und Weise erweiterbar.

Und obwohl er kein OpenSource Projekt ist und stolze 60 Dollar kostet, habe ich nach ein paar Wochen der Benutzung lächelnd den Betrag bezahlt. Warum das so ist und welche tollen Möglichkeiten das überaus schlichte Interface bietet wird in diesem Eintrag beleuchtet.

Sublime läuft auf Mac, Windows und Linux. Es gibt also keinen Grund nicht weiter zu lesen.

'
categories: Sublime
redirect_from: "2012/12/11/der-beste-editor-aller-zeiten-sublime-text-2/"

---



## Einleitung

Sublime Text 2 beeindruckt mich immer wieder durch seine Eleganz, die Geschwindigkeit, die durchdachten Funktionen und die Möglichkeit den gesamten Editor problemlos über die Tastatur zu bedienen.

Auf den letzten Punkt möchte ich hier besonders eingehen. Im folgenden sind alle Tastenkombinationen für die Mac Benutzer mit `[cmd]` gekennzeichnet, Windows und Linux User müssen dafür `[ctrl]` benutzen.


## Kein OpenSource

Die 60 Dollar für den Editor gingen mir sehr leicht von der Hand. Das hat mehrere Gründe:

* Die Testversion lässt sich unbegrenzt lange und in vollem Funktionsumfang nutzen. Einzige Einschränkung ist ein Hinweis beim Speichern in gewissen Abständen das man doch das Programm kaufen könnte wenn man es doch so lange benutzt. Hat er nicht ganz unrecht!
* Die Lizenz erlaubt eine Installation auf allen Rechnern an denen man arbeitet. Der Mac Mini zuhause, der iMac auf Arbeit und der Laptop für Untweges sind also abgedeckt.
* Der Editor wurde bis zur Version 2 sehr intensiv entwickelt und es gab fast täglich neue Funktionen. Das hat etwas nachgelassen, aber gute Arbeit sollte honoriert werden.

Deshalb kann man durchaus überlegen ob man die paar Dollar investiert, schließlich arbeitet man jeden Tag damit.


## Der Einstieg

Die Oberfläche ist wunderbar schlicht gehalten und verbirgt doch soviele Funktionen. Die erste Aufgabe bei der Benutzung ist die Installation des [Package Managers](http://wbond.net/sublime_packages/package_control). Dank der eingebauten Konsole ist das nichts weiters als das Kopieren einer Zeile und ein Neustart von Sublime.

Der Package Manager gibt einfachen Zugriff auf großartige Erweiterungen, aber dazu später mehr.

Erstmal zum wichtigsten Shortcut: `[cmd] + [shift] + [p]` öffnet einen Dialog über den alle Punkte aus dem Menü anwählbar sind. Immer wenn man in Sublime Text 2 die Möglichkeit hat eine Liste von Strings zu durchsuchen wird die "Fuzzy Search" angewendet. Das bedeutet es müssen nicht alle Zeichen des zu suchenden Strings eingegeben werden.

Um z.B. das Syntax Highlighting der aktuellen Datei auf HTML zu stellen reicht eine Eingabe von `syhtm` die sofort den Menüpunkt: `Set Syntax: HTML` vorschlägt. Sehr angenehm.


## Einstellungen

Sublime Text 2 verzichtet auf unübersichtliche Dialoge um die vielen Einstellungen zu tätigen. Statt dessen benutzt es JSON Dateien. Im Menüpunkt `Sublime Text 2 > Preferences` befinden sich immer zwei Dateien: `Default Settings` und `User Settings`. Die ersten öffnet man um zu sehen welche Einstellungsmöglichkeiten es gibt. Hat man einige zum ändern gefunden, öffnet man die `User Settings` und trägt sie hier ein. Damit werden sie beim nächsten Update nicht überschrieben.

Außerdem kann man auf diese Art sehr einfach seine persönlichen Einstellungen von einem Rechner zum anderen mitnehmen!

Unter `Key Bindings` findet man alle Tastaturbefehle und deren verknüpfte Funktionen. Eine tolle Referenz, direkt als JSON Datei verfügbar. Ich habe ein paar Anpassungen gemacht:

	[
		{ "keys": ["ctrl+#"], "command": "show_panel", "args": {"panel": "console", "toggle": true} },
		{ "keys": ["ctrl+shift+c"], "command": "shell_prompt" },
		{ "keys": ["super+shift+c"], "command": "color_pick" },
		{ "keys": ["super+l"], "command": "show_overlay", "args": {"overlay": "goto", "text": ":"} },
		{ "keys": ["super+shift+w"], "command": "close_other_tabs" },
		{ "keys": ["super+alt+s"], "command": "side_bar_move" }
	]

Auf diese Art kann man sich alle Möglichen und Unmöglichen Tastaturkombinationen zusammen bauen und den Editor zu einem wirklich nützlichen Werkzeug machen. Neben einem Studium der `Key Bindings - Default` empfehle ich wärmstens jede Woche ein Klebezettel mit zwei bis drei Kombinationen an den Monitor zu hängen. Sobald man einen Zettel verinnerlicht hat, kommt er weg und ein neuer ran.

Es lohnt sich! Nicht nur die Chefs und Kollegen sind beeindruckt wenn man blitzschnell per Tastatur das Layout ändert, Dateien hin und her schiebt sondern auch das Handgelenk ist dankbar nicht immer wieder zur Maus wechseln zu müssen.


## Multiple Selections

Sublime wirbt schon selbst auf der Internetseite mit diesem Feature, deshalb will ich gar nicht groß darüber sprechen, sondern nur ein paar Beispiel geben. Nehmen wir an wir haben eine Liste auf der Webseite mit wichtigen Keywords:

	<ul>
		<li>Sonne</li>
		<li>Urlaub</li>
		<li>Spaß</li>
		<li>junge Menschen</li>
		<li>Freizeit</li>
	</ul>
	
Jedes Listenelement soll die Klasse `great` erhalten. Das könnte man regeln in dem man es in das erste Listenelement reinschreibt, markiert, kopiert und in jedes weitere einfügt. Aber warum? Wir arbeiten mit dem großartigen Editor aller Zeiten. Deshalb gehen wir wie folgt vor:
	
1. Das erste `<li>` markieren
2. Vier mal `[cmd] + [d]` drücken - alle weiteren `<li>`s werden markiert
3. Einmal den Pfeil nach rechts drücken - die Markierung verschwindet und wir haben vier Cursor zur Vefügung
4. Einmal Pfeil nach links - wir befinden uns innerhalb des li Tags
5. Tippen: ` class="great"` - wie von Zauberhand erscheint die Klassenangabe in jeder Zeile

Ist das nicht großartig? Nächste Aufgabe: Jede zweite Zeile soll die Klasse `odd` erhalten. 

	<ul>
		<li class="great">Sonne</li>
		<li class="great">Urlaub</li>
		<li class="great">Spaß</li>
		<li class="great">junge Menschen</li>
		<li class="great">Freizeit</li>
	</ul>
	
Sublime, Vollgas!

1. Das zweite `great` markieren.
2. `[cmd] + [d]` drücken - das nächste auftreten von `great` wird markiert
3. `[cmd] + [k]` drücken - das zuletzt markierte Element wird **übersprungen**
4. `[cmd] + [d]` drücken - das nächste auftreten ist markiert
5. Pfeil nach rechts, Leerzeichen und `odd` tippen.

Fertig! Wichtig ist, sich jedes mal zu zwingen dieses geniale Feature zu benutzen. Nach ein paar Tagen Arbeit damit kann man nicht mehr ohne. Und der Grafiker wird stauen und sagen: "An mehreren Stellen gleichzeitig zu schreiben ist echt krass!"

Man kann seinen Cursor auch multiplizieren in dem man mit gedrückter `[cmd]` Taste in den Text klickt. Ich würde aber empfehlen die Maus Maus sein zu lassen und es elegant mit der Tastatur zu erledigen.


## Die Arbeit mit Dateien ##

Sublime bietet die Möglichkeit Ordner zu öffnen. Die Inhalte werden dann in einer Seitenleiste angezeigt. Es gibt auch die Möglichkeit Projekte zu speichern - das ist meiner Meinung nach aber selbsterklärend, einfach ausprobieren.

Schön wird der folgende Shortcut: `[cmd] + [p]` öffnet eine Befehlszeile in der alle Dateien des Projekts oder des Ordners angezeigt werden und wieder über "Fuzzy Search" ausgewählt werden können.

Die Eingabe von `awesome` kann also die Datei `a_very_weak_filename_somewhere.php` ohne Probleme finden und öffnen.


### Zu einer Zeile springen ###

`[cmd] + [p]` kann aber noch mehr! Gibt man einen Doppelpunkt `:` an, verleitet das Sublime dazu, zur angegebene Zeile zu springen.


### Zu einem Knoten springen ###

Mit der Eingabe des `@` Zeichens springt man zu einem Knoten. In einer Javascript oder PHP Datei ist das eine Funktion, in CSS ein Selektor und in HTML ein Tag. Einfach ausprobieren, man ist wirklich schnell damit.


### Alles zusammen ###

Der Titel sagt es schon. Da wir schon dank dem Webinspector wissen, dass die zu ändernde CSS Klasse sich in Zeile 2142 in der Datei `layout.css` befindet und diese im geöffnet Ordner oder Projekt existiert, sind wir sofort dort:

1. `[cmd] + [p]` das Kommandofenster öffnen
2. Dank "Fuzzy Search" Teile des Dateinames eingeben: `ayuss`
3. Anschließend den `:` Doppelpunkt eingeben und zur entsprechenden Zeile springen `ayuss:2142`
4. Enter!

Das gleiche funktioniert auch mit dem `@` Zeichen und einem Knoten im Dokument.

Und beim ausprobieren stellt man fest das Sublime sofort während der Eingabe die entsprechende Datei schon anzeigt. Ein tolles Programm!


## Editor Layouts ##

Nicht selten arbeitet man an einem größeren Bildschirm. Sublime trennt den Eingabebereich vertikal in zwei gleich große Hälften, wenn man `[cmd] + [alt] + [2]` drückt. In drei Hälften mit `[3]` am Ende usw. Zurück zur ursprünglichen Ansicht kommt man mit `[cmd] + [alt] + [1]`.

Das ist gut. Noch besser ist allerdings das der Fokus mit `[ctrl] + [1]` (oder [2], [3]) in die entsprechende Hälfte des Editors gesetzt werden kann. Den Bildschirm teilen und in der zweiten Hälfte eine weitere Datei laden ist also ohne ein Mausklick in wenigen Sekunden erledigt:

1. `[ctrl] + [alt] + [2]` teilt den Bildschirm
2. `[ctrl] + [2]` setzt den Fokus in den zweiten Teil
3. `[cmd] + [p]` öffnet die Dateiauswahl im zweiten Teil

Das wars! Eine Datei auswählen und fertig.

Nimmt man noch `[shift]` in die Tastenkombination auf, trennt man den Eingabebereich nicht vertikal sondern horizontal.



## Tolle Packages: Fetch ##

Da wir im ersten Schritt schon den Package Manager installiert haben, ist das einbinden von weiteren Packages ein Kinderspiel. Über `[cmd] + [shift] + [p]` wird die Kommandozeile aufgerufen und etwas eingegeben wie `pctrlin` um zum Befehl `Package Control: Install Package` zu gelangen.

Nach der Betätigung von `[Enter]` lädt Sublime eine Liste mit allen verfügbaren Packages herunter und zeigt sie an. Hier will ich das grandiose Package **Fetch** vorstellen. (Eintippen und Enter zum installieren).

Wie oft kommt es vor das man die aktuelle jQuery Version benötigt? Oder mit einem leeren Bootstrap starten möchte? **Fetch** nimmt dir genau dieses Problem ab. Nach der Installation kannst du in den Einstellungen Pfade zu einzelnen Dateien oder zu Zip Archiven angeben, die du öfters benutzt.

Nach dem Aufruf der Befehle (zum letzten Mal: `[cmd] + [shift] + [p]` - ab jetzt merken!) und der Eingabe von `fetch` hat man die Auswahl zwischen Manage (Pakete und Dateien einrichten), File (einzelne Dateien laden) und Package (Zip Archiv laden).

Nachdem man einige Dinge eingetragen hat, installiert man Bootstrap und die neuste jQuery Version in weniger als 15 Sekunden.


## Tolle Packages: AdvancedNewFile ##

Nach dem man in 5 Sekunden die neuste jQuery Version geladen hat, stellt sich die Frage wo speichern. Hier kommt dieses Package zum Einsatz: Es fügt einen Shortcut hinzu: `[cmd] + [alt] + [n]` mit dessen Hilfe am unteren Rand eine Eingabezeile eingeblendet wird.

Hier kann man nicht nur den Dateinamen eingeben, sondern auch einen Pfad zur Datei. Für obiges Beispiel also etwas wie `js/lib/jquery.min.js` - das Plugin prüft dann automatisch ob die Ordner schon existieren und legt sie ggf. neu an und erstellt die angegebene Datei.

Das spart vielleicht nur 30 Sekunden, aber es verhindert das wechseln vom Programm und aufs Jahr gerechnet kommt da schon einiges zusammen. Abgesehen davon ist es einfach unglaublich elegant.


## Fazit

Ich hoffe der kleine Einblick hat schon ein paar tolle Funktionen offenbart und neugierg gemacht. Das der Editor auch so ziemlich alles kann was man sich sonst noch vorstellen kann ist klar. Und alles was er noch nicht kann lässt sich einfach nachrüsten. Vorallem wenn man `Python` beherrscht, denn darin wurde Sublime entwickelt.

Jeden Tag kann man hier etwas neues entdecken und seine Arbeit noch effektiver und angenehmer gestalten. Ich habe das Gefühl mit Sublime Text 2 endlich bei einem Editor angekommen zu sein, der so einfach und schlicht und dabei trotzdem so mächtig und effektiv ist, das ich mit ihm lange glücklich bleiben kann.

Und sollte das Glück getrübt werden, frische ich meine Python Kenntnisse auf und schaffe die Ursachen aus der Welt. Das sollte jedem die 60 Dollar Lizenzgebühr wert sein. Denn vergleichbares habe ich bisher noch nicht gefunden.

Frohes entdecken!