---

layout: post
title: "Pauls Blog ist schöner geworden 2"
abstract: '**Herzlich Willkommen** im neuen, schönen Interaktionsdesigner! Das neue Jahr startet mit einem komplett neuen Theme, weg von grün hin zu knalligem rot. Ganz im Stil der [Ape Unit GmbH](http://www.apeunit.com/ "Ape Unit GmbH Berlin").
Das Theme wurde von unserem Grafiker [Tim Herzog](http://www.apeunit.com/tim-herzog "Tim Herzog") entwickelt und von mir umgesetzt. Sehr hilfreich dafür war natürlich mein Eintrag [wie ein Entwickler einen Wordpress Blog aufsetzt](http://www.interaktionsdesigner.de/2010/10/02/wie-ein-entwickler-einen-wordpress-blog-aufsetzt/ "Wordpress Tutorial für Entwickler"). Aber es gibt auch ein paar neue Funktionen. Ein paar Highlights und deren Umsetzung will ich natürlich nicht für mich behalten.'
categories: Ich
redirect_from: "2011/01/12/pauls-blog-ist-schoner-geworden-2/"

---

## Sticky Posts
Über die Visibility lässt sich im Backend ein Post als "sticky" markieren. Die Posts kriegt man über die Funktion \[pre\]get\_option('sticky\_posts')\[/pre\] - den Rückgabewert übergibt man dann dem \[pre\]WP\_Query Object\[/pre\]. Zum Beispiel so:

    $sticky = new WP_Query(array(
        'post__in' => get_option( 'sticky_posts' ),
        'caller_get_posts' => 1,
        'orderby' => 'modified',
        'showposts' => 6
    ));

Fragt man die neusten Einträge ab, werden die Sticky Posts allerdings unabhängig von ihrem Datum ganz oben in der Liste angezeigt. Das kann man verhindern:

    $newest = new WP_Query(array(
        'showposts' => 15,
        'ignore_sticky_posts' => 1,
        'caller_get_posts' => 1
    ));

Eigentlich sollte \[pre\]ignore\_sticky\_posts\[/pre\] reichen, aber bei mir hat es nur mit \[pre\]caller\_get\_posts\[/pre\] die erhofte Wirkung erzielt.

## Code und Quelltext
Der Quelltext wird jetzt schöner dargestellt. Realisiert mit dem [Google Code Prettify](http://code.google.com/p/google-code-prettify/). Zeilennummern und Syntaxhighlighting wird direkt dynamisch erstellt.

    function code_func($atts, $content = null) {
        $content = strip_tags($content, 'a,strong');
        $content = "<pre>".$content."</pre>";
        while(stristr($content, '    ')) {
            $content = do_shortcode($content);
        }
        return $content;
    }
    add_shortcode('code', 'code_func');

Schön, oder? Tabs habe ich mit dem Shortcode \[ tab \] umgesetzt. Ohne Leerzeichen wird es durch zwei geschützte Leerzeichen ersetzt. Damit auch mehrere Tabs hintereinander funktionieren jage ich in der \[pre\]while\[/pre\] Schleife den Inhalt solange durch die \[pre\]do\_shortcode()\[/pre\] Funktion bis kein \[ tab \] mehr gefunden wird.
Mit jQuery wird jedem \[pre\]pre\[/pre\] Element die Klasse **prettify** zugewiesen und anschließend der Syntaxhighlighter gestartet.

    $('article.single pre').addClass('prettyprint linenums');
    prettyPrint();

Ein anderer lang gehegter Traum habe ich mir mit dem Shortcode \[ pre \] erfüllt, mit dem ich endlich Quelltext innerhalb des Fließtextes einbinden kann. Die Umsetzung ist sehr simpel, definiert in der \[pre\]functions.php\[/pre\] Datei.

    function pre_func($atts, $content = null) {
        return '<pre>'.$content.'</pre>';
    }
    add_shortcode('pre', 'pre_func');

## Der Affe
In der Einzelansicht steht unter der Sidebar unser kleines Maskotchen und macht den Besucher auf unsere Firma aufmerksam. Scrollt der Benutzer nach unten, heftet er sich an den unteren Bildschirmrand, bis die Kommentare erreicht sind, auf denen er sich nieder lässt. Ein super Effekt, realisiert mit jQuery.
Der Trick liegt im \[pre\]Scroll Event\[/pre\] und dem Wechsel zwischen \[pre\]position:relative\[/pre\] und \[pre\]fixed\[/pre\]. Ich habe eine Funktion geschrieben die den Affen positioniert:

    function posTheApe() {
        bottom = $(window).scrollTop()+$(window).height();
        if(bottom-336-45 <= aside_y) {
            $nav.css({
                position: 'absolute',
                top: aside_y+350
            });
        }        
        else if(bottom >= footer_y) {
            $nav.css({
                position: 'relative',
                top: ''
            });
        }
        else if($nav.css('position') != 'fixed') {
            $nav.css({
                position: 'fixed',
                bottom: 0,
                top: ''
            });
        }
    }

In Zeile 2 wird der Abstand der unteren Fensterkante zum Seitenanfang gemessen. \[pre\]footer\_y\[/pre\] und \[pre\]aside\_y\[/pre\] wurden vorher gesetzt und beinhalten den Abstand des Footers, bzw. der Seitenleiste, zum Seitenanfang. Alles andere ist dann nur noch ein abgleich der Werte.

## Twitter
In der Seitenleiste werden dynamisch meine neusten Twitter Nachrichten angezeigt. Realisiert mit dem großartigen Plugin [Tweet!](http://tweet.seaofclouds.com/) Interessant finde ich die Implementierung der Callbacks. Gewöhnt ist man an die Übergabe einer Funktion im Konfigurationsobjekt:

    $("body").plugin({
        callback: function() {
            //do something
        }
    });

Bei **Tweet!** gibt es diese Option allerdings nicht. Im Quelltext habe ich aber mehrere Aufrufe von \[pre\]trigger('loaded')\[/pre\] gefunden, so funktionierts:

    $("body")
        .plugin()
        .bind('loaded', function() {
            //do something
        });

Und funktioniert! Mit dem Callback \[pre\]loaded\[/pre\] wird die Höhe der Seitenleiste neu bestimmt um den Affen richtig positionieren zu können. Funktioniert einwandfrei!

## Fazit
Ein paar Kleinigkeiten hatte Tim noch vorgesehen die ich im Laufe der Zeit anpassen werde. Als nächstes will ich endlich wieder ein paar neue und aktualisierte **TYPO3 Extensions** veröffentlichen, darunter auch der lang ersehnte **Kiwi Slider 2.0**!
Man darf also gespannt sein und den [RSS Feed](http://www.interaktionsdesigner.de/feed/) abonnieren. Und nicht vergessen **Feedback** in den Kommentaren zu hinterlassen!