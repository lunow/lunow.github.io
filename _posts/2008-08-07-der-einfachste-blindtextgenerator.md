---

layout: post
title: "Der einfachste Blindtextgenerator"
abstract: '[![](http://blog.paul-lunow.de/wp-content/uploads/2008/08/blindtext.png)](http://blog.paul-lunow.de/wp-content/uploads/2008/08/blindtext.png)Der Trend geht dahin Webseiten nicht mehr mit ausschließlich mit Photoshop zu gestallten, sondern die Entwicklung direkt im Browser voran zu treiben. Das hat den Vorteil das interaktive Möglichkeiten schneller umgesetzt und besser kommuniziert werden können.
Und was fehlt? **Mengen an Blindtext!** Da wir gerade ein neues Projekt auf diese Art und Weise begonnen haben, standen wir vor genau diesem Problem. Es folgt ein einfacher Lösungsansatz mit PHP.'
categories: Entwicklung
redirect_from: "2008/08/07/der-einfachste-blindtextgenerator/"

---

Wer jetzt Mengen an Text erwartet hat, den muss ich leider entäuschen. Ich habe eine Mini-PHP Klasse geschrieben: _Blindtext_.
Diese besitzt genau eine Funktion: _get()_. Die Funktion kann aufgerufen werden ohne ein neues Objekt der Klasse zu erzeugen und kann mit zwei Parametern gesteuert werden. Die in Klammern gesetzten Werte sind die Standardwerte.
**$length** (= 100) - Anzahl von Zeichen die der Blindtext enthalten soll
**$dot** (= true) - Setzt einen Punkt an das Ende des Blindtexts, wenn true
So einfach! Das Besondere an der Klasse ist die dynamische Ausgabe. Es ist ein String (Lorem ipsum...) gespeichert von dem zufällig die ersten Zeichen abgeschnitten werden. Damit erhält man nicht immer den gleichen Blindtext.
So gehts:

    <?
      include("blindtext.php");
      echo blindtext::get(200);
    ?>

Ich spare mir jetzt mal die Ausgabe als Beispiel dazu zu schreiben.
Hier ist der [download](http://www.interaktionsdesigner.de/stuff/blindtext.zip).