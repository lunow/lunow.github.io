---

layout: post
title: "Modulo verstehen und benutzen!"
abstract: '_Diesen Beitrag widme ich meinem Informatiklehrer Herrn Westphal, der es so sehr versucht hat, aber es hat einfach noch vier Jahre gebraucht._
Zugegeben, ich bin nicht der größte Mathefan und bin heilfroh, dass soviel im Internet ohne funktioniert. Aber man darf sich bekanntlich nicht vor Wissen verschließen und wenn man dahinter gekommen ist, macht es ja auch Spaß!
So kürzlich geschehen mit der Funktion **Modulo**! Ich erinnere mich an all die dunklen Stunden, in denen ich halbherzig versucht habe das zu verstehen, aber es wollte einfach nicht so wie ich. **Aber jetzt habe ich es raus** und kann nur empfehlen: lest den Beitrag wenn ihr diese Operation noch nicht kennt oder versteht.'
categories: Tutorial
redirect_from: "2009/01/27/modulo-verstehen-und-benutzen/"

---

Einfach gesagt ist Modulo**teilen durch ganze Zahlen und den Rest zurück kriegen**. Der Operator ist in PHP und JavaScript das Prozentzeichen (**%**). So kann das Ergebnis aussehen:
0 modulo 5 = 0
1 modulo 5= 1
2 modulo 5= 2
3 modulo 5 = 3
4 modulo 5 = 4
5 modulo 5 = 0
6 modulo 5 = 1
7 modulo 5 = 2
8 modulo 5 = 3
9 modulo 5 = 4
Der PHP Code der das erzeugt hat ist der hier: 
    
    <?
        for($i = 0; $i < 10; $i++) {
            echo "$i modulo 5 = ". ($i%5). "<br>";
        }
    ?>

Wenn einem jetzt nicht auf Anhieb ein Anwendungsfall einfällt, dann sollte man sich überlegen was dieser Code tut:
    
    <?
        $a = 0;
        $class = "";
        for($i = 0; $i < 10; $i++) {
            $a++;
            if($a > 1)
                $a = 0;
            $class = $a == 1 ? "even" : "odd";
            echo "$i modulo 5 = ". ($i%5). " ($class)<br>";
        }
    ?>

Richtig,**jede zweite Zeile** wird anders behandelt. Dazu wird _$a_ erhöht und wenn es 2 ist wieder auf _Null_ gesetzt um anschließend je nach Wert ein Namen auszugeben (z.B. für Zebrastreifen). Funktioniert, hat aber gedauert zu tippen und geht viel einfacher: Das ist die Ausgabe bei Modulo 2:
0 modulo 2 = 0
1 modulo 2 = 1
2 modulo 2 = 0
3 modulo 2 = 1
4 modulo 2 = 0
5 modulo 2 = 1
6 modulo 2 = 0
7 modulo 2 = 1
8 modulo 2 = 0
9 modulo 2 = 1
Dämmerts? _$i_ wird durch 2 geteilt. Dabei bleibt immer 1 oder 0 übrig. Egal um welche Zahl es geht. Na dann:
    
    <?
        $class = "";
        for($i = 0; $i < 10; $i++) {
            $class = $i%2 ? "even" : "odd";
            echo "$i modulo 2 = ". ($i%2). " ($class)<br>";
        }
    ?>

Herrlich, oder? Schnell, effektiv, zuverlässig und in allen Sprachen einsetzbar. Mehr braucht man darüber gar nicht zu wissen :)
Aber **lovely jQuery** erpart uns natürlich das Rechnen. Hier gibt es die Psydoklassen (beginnen mit einem Doppelpunkt) **:even** und **:odd**. Damit wird jedes zweite, bzw. erste Element ausgewählt.
    
    $("ul li:even").addClass("even");

Fügt **jeder zweiten Zeile** eine Klasse hinzu.
Und wenn dieses Funktion bei mehreren Listen die verändert werden sollen anfängt rumzuspinnen, dann muss man sich klar machen, dass der Selektor _$("ul li:even")_ **alle** zweiten Listenelemente auf der Seite trifft. Unabhängig davon in welcher Liste sie sich befinden.
Die Lösung ist mal wieder einfach: _$("ul")_ selektiert alle Listen **und dann** behandeln wir jedes Listenelement einzelnd:
    
    $("ul").find("li:even").addClass("zebra");

Viel Spaß und mit Mathe jQuery!