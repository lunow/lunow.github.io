---

layout: post
title: "Interessante jQuery Erkenntnisse"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/08/jquerylogo.png)Dieser Eintrag ist kein Tutorial oder Anleitung zu jQuery. Wenn man sich eine neue Technik aneignet dann geht das ja meistens recht einfach, und wenn es eine so geniale Technik ist wie jQuery dann macht es auch noch richtig Spaß!
Aber irgendwann möchte man mehr Wissen und vertieft sich in Bücher und tiefschürfende (ewig lange) Blogbeiträge und kann dabei noch einiges zutage fördern was die Arbeit wesentlich erleichtert.
Als öffentliche Merkhilfe schreibe ich hier meine Erkenntnisse aus dem empfehlenswerten Buch [jQuery in Action](http://www.manning.com/bibeault/) nieder.'
categories: jQuery
redirect_from: "2008/08/19/interessante-jquery-erkenntnisse/"

---

Wie gesagt, ich erhebe weder den Anspruch hier etwas erklären zu wollen, noch auf Vollständigkeit und Sinn zu pochen. Es hat mich einfach gefreut was alles geht und Notizzettel sind schnell im Notizzettelmonster (Schreibtisch) verloren.

    $("element").filter(function() { ... })

Die Funktion **Filter** benutzte ich immer mit einer Expression, z.B. _:empty_. Es ist aber auch Möglich eine Funktion zu übergeben, welche _true_ zurück geben muss damit das Element im Stack bleibt.

    $("iframe").contents()

Liefert alle Elemente eines iFrames. DER Weg um auf jene zuzugreifen. Herrlich!

    parent() vs parents()

Die erste Funktion ist hinlänglich bekannt. Die Zweite liefert nicht nur das Elternelement, sondern alle darüber liegenden Knoten.

    $("div").css("width", function({ return $(this).width() + 200 + "px"; }));

Die Funktion **css()** ist bekannt und oft genug eingesetzt. Aber als zweiten Wert kann man auch eine Funktion übergeben deren Rückgabewert als neue Eigenschaft gesetzt wird! Im obigen Beispiel wird also jeder Div Container um 200 Pixel verbreitert, abhängig von der vorherigen Breite.
Das funktioniert auch mit der Funktion **attr()**.

    $("p:first").is(".abstract") = $("p:first").hasClass("abstract")

Beide Funktionen haben den selben Nutzen und liefern **true** zurück, sofern der erste Absatz mit der Klasse "abstract" versehen ist. Intern wird der Zweite zum ersten umgeformt, es ist also geschmackssache welcher eingesetzt wird.

    $("div").after("<p>Neuer Div als Absatz</p>").remove();

Diese schöne Zeile ersetzt jeden DIV-Container auf der Seite durch den übergebenen Absatz. Da die Funktion **after()** den Elementstack nicht verändert kann er anschließend mit **remove()** einfach entfernt werden.

    $("[name=radioGroup]:checked]").val();

Liefert den Inhalt der angeklickten Radiobox einer Gruppe von Radioboxen. Funktioniert so allerdings nur mit Radioboxen.
Das waren die ersten zwei Kapitel - Grundlagen - ich bin voller Zuversicht noch viele weitere interessante Dinge zu lernen. Wer weitere tolle Tipps hat ist in den Kommentaren herzlich Willkommen!