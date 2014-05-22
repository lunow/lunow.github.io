---

layout: post
title: "PHP Kurzschreibweisen"
abstract: 'Mit PHP kann man zwischen **<? und ?\>** nicht nur ganze Programme schreiben sondern auch einfach und schnell Werte ausgeben. Das ist besonders praktisch für **Templates mit Funktionen** wie z.B. in **WordPress** und **TYPOlight** eingesetzt.
Anders als bei **TYPO3** wird der Inhalt nicht über Marker in den HTML Code transportiert, sondern direkt über **dynamischen PHP Code**. Diese Art der Templates finde ich sehr gut, weil man auf verschiedene Bedingungen einfacher reagieren kann als, z.B. mit Typoscript.
Allerdings erfordern solche Templates auch mehr Konsequenz vom Entwickler, denn **Präsentation und Logik gehören nicht vermischt**.
Jetzt kommt eine Übersicht der**praktischen Kurzschreibweisen **zum Verwenden in eigenen Projekten, WordPress oder TYPOlight.'
categories: PHP, Tutorial
redirect_from: "2009/01/31/php-kurzschreibweisen/"

---

## Ausgaben
Um Variablen auszugeben wird das **= Zeichen** benutzt. 
    
    <?=$welcome_msg?>

Diese Zeile, man könnte es schon fast als Tag bezeichnen und ist gleichbedeutend mit 
    
    <? echo $welcome_msg; ?>

## Bedingungen
Die gute alte**If-Abfrage **kann auf zwei Weisen dargestellt werden. **Die erste** ist für Fälle in denen mehr Inhalt ausgegeben werden soll.
    
    <? if($user == "admin"): ?>
        Hallo <b>Admin</b>, hier sind deine <a href="#" class="admin">Optionen</a><br>
        <div id="status"><h1>Projektstatus</h1></div> <!-- usw. usf. -->
    <? endif; ?>

Das wichtige ist der **Doppelpunkt**, welches dem Parser sagt alles was folgt ist gehört zu dieser Bedingung, bis zum **endif;**
Alternativen lassen sich darin natürlich auch einbauen
    
    <? if($user == "admin"): ?>
        ... viele Ausgaben ...
    <? elseif($user == "redakteur"): ?>
        --- andere Ausgaben ----
    <? else: ?>
        ___ alternative Ausgaben ___
    <? endif; ?>

Damit lässt sich HTML Code auf angenehme Art und Weise per PHP steuern. Wichtig und sinnvoll ist auf eine korrekte Einrückung zu achten damit die Übersicht erhalten bleibt.
**Die zweite** ist noch kürzer. Wenn man keine komplexen Ausgaben hat sondern nur, z.B. einzelne Worte ausgeben möchte
    
    <?=$owner == $user ? "meins" : "fremd"?>

gibt, wenn _$owner_ gleich _$user_ ist, das Wort "_meins_" zurück, ansonsten "_fremd_".
Die Syntax ist etwas gewöhnungsbedürftig, aber schnell gelernt: **Der erste Block ist die Abfrage**, sie wird beendet vom **Fragezeichen** welches auch gleichzeitig den Block einleitet der bei erfüllter Bedingung ausgeführt wird. Abgeschlossen und gleichbedeutend mit _else_ folgt dann der **Doppelpunkt und die Else-Anweisung**. Alle Teile müssen vorhanden sein, sonst funktioniert es nicht.
Ausgeschrieben ist die Abfrage gleichbedeutend mit:
    
    <? if($owner == $user) {
        echo "meins";
    }
    else {
        echo "fremd";
    }

Ein praktisches Beispiel wäre z.B. innerhalb einer Schleife: 
    
    <li class="<?=$i%2 == 0 ? "even" : "odd"?>"><=$content?></li>

Alle erinnern sich an die [Modulo-Operation](http://www.interaktionsdesigner.de/2009/01/27/modulo-verstehen-und-benutzen/ "Modulo verstehen auf Pauls Blog")?
Gut, dann weiter mit

## Schleifen
Die Syntax der Schleifen ist im Prinzip genau die selbe. Die **For-Schleife**:
    
    <? for($i = 0; $i < 10; $i++): ?>
        Zeile <?=$i?> von 10
    <? endfor; ?>

hat die gleiche Syntax wie die **Foreach-Schleife**:
    
    <? foreach($array as $key => $value): ?>
        Array: <?=$key?> = <?=$value?><br>
    <? endforeach; ?>

Und die **While-Schleife** darf natürlich auch nicht fehlen:
    
    <? while($row = mysql_fetch_object($hdl)): ?>
        Zeile <?=$row->uid?> gehört <?=$row->name?><br>
    <? endwhile; ?>

## Fazit
Das waren **Kurzschreibweisen in PHP**. Sind schon sehr schmal und können für ein übersichtliches Template sorgen, wenn der fleißige Entwickler sich an die Einrückung hält und Logik mit Präsentation nicht vermischt wird. _Frohes Nachdenken!_
_UPDATE: _Aufgrund von unendlich vielen unverständlichen, russichen Spamkommentaren habe ich die Kommentare geschlossen. Bei Fragen einfach bei der [Ape Unit GmbH](http://www.apeunit.com "Webentwicklung Berlin") melden.