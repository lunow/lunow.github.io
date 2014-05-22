---

layout: post
title: "Shortcode API von WordPress benutzen"
abstract: '![wp-header](http://blog.paul-lunow.de/wp-content/uploads/2009/01/wp-header.png)
Gerade war ich auf der Suche nach einer Möglichkeit diese verdammten "Anführungszeichen" aus meinem Quelltext zu verbannen. Nebenbei habe ich mich auch geärgert, ständig in den Quelltext wechseln zu müssen um die endlosen **<pre\><code class="bla"\>** Tags für das Syntaxhighlighting zu schreiben.
Nervt, muss aber nicht sein! Die_functions.php_ ist mit ein paar einfachen Funktionen in der Lage, dem fleißigen Blogger einige Arbeit abzunehmen. **Ich bin begeistert!** Und so funktionierts:'
categories: WordPress
redirect_from: "2009/01/03/shortcode-api-von-wordpress-benutzen/"

---

Die **Shortcode API** bietet die Möglichkeit eigene Kurzbefehle zu erstellen. Die werden vom Autor in eckige Klammern geschrieben und können allein stehen (z.B. _\[datum\]_) oder Text umfassen (z.B. _\[wichtig\]_das ist es!_\[/wichtig\]_). Außerdem kann der Shortcode mit Attributen erweitert werden, also \[datum _undzwar="gestern"_\].
Also verpacken wir das <pre\><code...\> gequatsche in einen praktischen Shortcode: **\[ code lang="php" \]**. Der PHP Code dafür, gespeichert in der_functions.php_ sieht wie folgt aus.

    function code_func($atts, $content = null) {
        extract(shortcode_atts(array(
            'lang' => '',
        ), $atts));    
        return "<pre><code class='{$atts["lang"]}'>".do_shortcode($content)."</code></pre>";
    }
    add_shortcode('code', 'code_func');

Die Funktion wird mit einem Array aufgerufen (**$atts**) welches die Attribute beinhaltet. Die Variable **$content** wird mit dem umschlossenden Inhalt gefüllt. Der Rest ist dem Entwickler überlassen!
Der **Rückgabewert** wird im Blogpost gezeigt. Um weitere Shortcodes innerhalb zu erlauben, wird der Inhalt nochmal durch die Funktion _do\_shortcode() _gejagt.
Nur ein Problem: mehrere Leerzeichen oder Tabs werden vom Editor aussortiert. Also nochmal in die Datei und ein weiterer Shortcode hinzugefügt: **\[ tab \]**.

    function tab_func($atts) {
        return str_repeat("&nbsp;", 2);
    }
    add_shortcode('tab', 'tab_func');

Herrlich! Vor dem Kopieren aus dem Editor ein kurzes Suchen und Ersetzen und fertig! Jetzt wird auch die Funktion _do\_shortcode() _gleich noch viel sinnvoller ;)
Bleibt noch das Problem mit den nervigen Anführungszeichen. Aber vermutlich bietet Wordpress da auch die eine oder andere Lösung. Eine [offizielle Beschreibung](http://codex.wordpress.org/Shortcode_API "Shortcode API") gibt es natürlich auch.
PS: Kaum bloggt man über WordPress wird der Feedreader mit nützlichen Einträgen überfallen, zum Beispiel dem hier: [40+ Most Wanted Wordpress Tricks and Hacks ](http://www.hongkiat.com/blog/40-most-wanted-wordpress-tricks-and-hacks/).