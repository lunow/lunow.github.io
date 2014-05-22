---

layout: post
title: "Wie ein Entwickler einen WordPress Blog aufsetzt"
abstract: '[![WordPress für Entwickler](http://blog.paul-lunow.de/wp-content/uploads/2010/10/Bildschirmfoto-2010-08-31-um-17.41.29.png)](http://blog.paul-lunow.de/wp-content/uploads/2010/10/Bildschirmfoto-2010-08-31-um-17.41.29.png)Wenn der Kunde einen Blog möchte, denkt der Entwickler nach: "ich schreibe das coolste Blogsystem allerzeiten", in der Regel sofort an **WordPress**. Der Platzhirsch unter den Blogsystemen.
Leider habe ich im Moment auch nicht genügend Zeit das coolste Blogsystem allerzeiten selbst zu programmieren, deshalb greife ich auf WordPress zurück. Wie man von einem leeren Ordner zu einem funktionierenden System mit **eigenem Theme** kommt ist der Inhalt dieses Eintrags.'
categories: WordPress
redirect_from: "2010/10/02/wie-ein-entwickler-einen-wordpress-blog-aufsetzt/"

---

## Dateien beschaffen
Los gehts mit einer ganzen Reihe downloads. Entweder man hat einen Ressourcenordner auf dem Rechner in dem das drin liegt oder man holt es sich aus dem Netz. Als erstes natürlich [WordPress](http://wordpress.org/ "WordPress") und um im eigenen Theme eine vernünftige Aufteilung zu ermöglichen das [960 GridSystem](http://www.960.gs "960gs").
Da man schon das ganze System nicht selbst schreibt, kann man sich auch bei den Grundlagen des Themes die Arbeit abnehmen lassen und ein [Naked Theme](http://speckyboy.com/2010/03/22/10-blanknaked-wordpress-themes-perfect-for-development/) benutzen. Ich nehme [Simons Blank Theme](http://simonwebdesign.com/simon-wordpress-framework-blank-theme/), da es schon **960.gs** und **Featured Posts** implementiert hat.

## Installation
WordPress ist ein bisschen zickig wenn sich die **Baseurl** ändert. Deshalb macht es Sinn schon unter der finalen Domain zu entwickeln. In den meisten Fällen gehts aber lokal los, also Ordner anlegen, Datenbank erstellen und das WordPress Archiv in den Ordner entpacken.
Der Ordner **wp-content/uploads/** muss, sofern nicht vorhanden, angelegt werden und für den Webserver beschreibbar sein.
Das ausgewählte Theme kommt in den Ordner **wp-content/themes/**. Anschließend die WordPress **index.php** aufrufen und der Installation folgen.

## Einrichten
Die Datenbanken und notwendigen Ordner hat sich WordPress schon selbst zurecht gelegt. Als erstes sollte man prüfen ob schon Updates verfügbar sind (in meinem Fall Akismet). Entweder über WordPress automatisch installieren lassen (dem vertraue ich nicht so recht), oder von der Downloadseite ziehen, entpacken und in den Ordner **wp-content/plugins/** legen.
Im Frontend sieht man jetzt das nette Standardtheme, das auch schon eine Menge kann. Aber wir haben ja ein eigenes Layout das es umzusetzen gilt. Also im Backend unter **Design / Themes** aktivieren.

## Mein Theme
Alle Daten die man als Themeentwickler verändern darf liegen im Ordner **wp-content/themes/themename**. Den Ordnernamen sollte man nach eigenen Wünschen benennen und anschließend die Datei **style.css** öffnen. Im Kommentar am Seitenanfang kann man den Themenamen, Version, URL und Autor festlegen.

    /*
    Theme Name: Apeversity
    Theme URI: http://www.apeunit.com
    Description: Ape Unit Videotheme
    Author: Paul Lunow
    Author URI: http://www.paul-lunow.de
    Version: 1.0
    */

Jetzt fängt das schöne entwickeln an. Die **header.php** ist ein guter Einstiegspunkt. Eine Wordpressseite wird immer aus verschiedenen Teilen zusammengebaut. Es geht los mit dem Header, dann kommt der eigentliche Inhalt, die Sidebar und dann der Footer.
Die Startseite wird in der **index.php** generiert. Hier gibt es ein WordPress Tag um den Header einzubinden:

    <?php get_header(); ?>

Eine großartige Funktion ist **bloginfo()**. Damit erfährt man jede Menge über die Installation und die Pfade. Will man die Werte im Script weiter verarbeiten, holt man sich die Infos mit **get\_bloginfo()**.
Um zum Beispiel eine JavaScript Datei aus dem Themeordner einzubinden nutzt man folgendes Tag:

    <script type="text/javascript" src="<? bloginfo('template_directory'); ?>/action.js"></script>

Aber Halt: nicht auf die Idee kommen eine Kopie von jQuery herunterzuladen und wie oben beschrieben einzubinden. jQuery kommt schon als Standard Framework mit und muss über die **functions.php** nur freigeschaltet werden:

    wp_enqueue_script("jquery");

Die **functions.php** wird bei jedem Seitenaufruf eingebunden und ist ein idealer Platz für eigene Funktionen, Abkürzungen und Konfiguration.
Im Idealfall hat das leere Theme schon ein paar praktische CSS Regeln dabei. Damit man nicht anfängt etwas doppelt zu schreiben, klickt man mit **Firebug** das zu stylende Element an und schaut ob es schon eine Regel dafür in den CSS Dateien gibt.
An dieser Stelle sollte man nicht davor zurück schrecken **tiefgreifende Veränderungen und Restrukturierungen** durchzuführen um das CSS den eigenen Bedürfnissen anzupassen. Alles löschen was einem nicht gefällt und bloß nicht anfangen mit **important!** oder anderen Mitteln eine zweite CSS Struktur zu erstellen.
Falls noch nicht geschehen sollte man sich jetzt die Tastenkombination in der bevorzugten Entwicklungsumgebung einprägen, um zu einer bestimmten Zeile zu springen. Für Coda ist es \[CMD\]+\[UMSCHALT\]+\[L\] in Eclipse \[CMD\]+\[L\].

## Custom Menu
Mit **WordPress 3** gibt es ein paar coole Neuerungen die man im eigenen Theme aufjedenfall benutzen möchte. Eins davon sind die eigenen Menüs. Das funktioniert so:
Im Theme (in der **functions.php**) sagt man WordPress, dass man Menüs unterstützt. Man kann verschiedene Menüs definieren (z.B. Header, Footer und Sidebar). Der Benutzer kann diese Platzhalter im Backend mit Seiten, Posts, Kategorien und Links bestücken.
Dem Theme teilt man das wiefolgt mit:

    function register_my_menus() {
        register_nav_menus(array(
        'header-menu' => __( 'Header Menu' )
        ));
    }
    add_action('init', 'register_my_menus');

Im Backend unter **Design / Menüs** kann man jetzt ein eigenes Menü erstellen, bestücken und dem Marker **header-menu** zuweisen.
Ausgegeben wird das Menü über die Funktion [wp\_nav\_menu](http://codex.wordpress.org/Function_Reference/wp_nav_menu). So sieht es aus:

    <?php wp_nav_menu( array('menu' => 'header-menu' ) ); ?>

Um die **Startseite** im Menü ebenfalls erreichbar zu machen, muss man meiner Meinung nach den Link zur Baseurl als Link Element hinzufügen. Das ist allerdings nicht besonders prickelnd, vorallem nicht wenn sich die Baseurl ändert.

## Post Thumbnails
Post Thumbnails erlauben es dem Redakteur für ein Post ein Bild zu definieren, welches dann bei der Ausgabe beliebig verwendet werden kann.
Das gute an denen, im Gegensatz zu einem "Benutzerdefinierten Feld", ist die Möglichkeit zur **Bildbearbeitung**. Außerdem kümmert sich WordPress um die Bereitstellung und **Validierung**.
Um Post Thumbnails zu benutzen, muss man sie über die **functions.php** aktivieren:

    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(215, 150, true);

Anschließend steht in der rechten Seitenleiste beim **Artikel schreiben** ein entsprechendes Feld zur Verfügung.
Für die Ausgabe gibt es zwei Methoden. Die erste überprüft ob ein Post Thumbnail vorhanden ist:

    has_post_thumbnail();

Mit der zweiten Funktion wird das Thumbnail direkt ausgegeben:

    the_post_thumbnail();

Mit einem vorrausgestellten **get\_** kriegt man den HTML Code zur weiteren Verarbeitung zurück. In einem strangen Fall brauchte ich allerdings nur die **URL des Post Thumbnails**. Gelöst habe ich es über XML:

    $s = simplexml_load_string(get_the_post_thumbnail());
    echo $s->attributes()->src;

## Benutzerdefinierte Felder
Das Post Thumbnail ist schon ausgegliedert. Trotzdem ist es sehr praktisch wenn man zu jedem Post individuell verschiedene Eigenschaften angeben kann.
Im Backend passiert das über die "Benutzerdefinierten Felder". Im Theme werden die Inhalte über die Funktion **get\_post\_custom\_values() **ausgelesen. Die Funktion gibt die Daten allerdings in einem etwas unübersichtlichen Array zurück.
Deshalb ab in die **functions.php** und dort eine neue Funktion **custom\_field()** erstellen:

    function custom_field($name) {
        $value = @array_pop(get_post_custom_values($name));
        if(empty($value)) {
        return false;
        }
        return $value;
    }

Im Theme, innerhalb der Artikelausgeben (**The Loop**), kann man jetzt einfach den Namen des Feldes eingeben und erhält den Inhalt:

    <h3><? echo custom_field('subheader'); ?></h3>

## Custom Queries
Bei umfangreichen Projekten kommt man schnell in die Situation nur Posts, die bestimmten Kriterien erfüllen auszugeben. Kein Problem!
Dafür steht in WordPress die Klasse **WP\_Query** zur Verfügung. Von dieser erzeugt man ein neues Objekt und übergibt ein Array mit [Einstellungen](http://codex.wordpress.org/Function_Reference/query_posts).

    $my_query = new WP_Query(array('category_name' => 'featured', 'posts_per_page' => 1));

Im Objekt **$my\_query** ist jetzt der letzte Post mit der Kategorie **featured** gespeichert. An die Posts kommt man, in dem man die berühmte Loop erstellt:

    while($my_query->have_posts()):
        $my_query->the_post();
        <div class="post"><? the_title(); ?></div>
    endwhile;

Innerhalb der While Schleife stehen einem jetzt alle [gewohnten Funktionen](http://codex.wordpress.org/Template_Tags) zur Verfügung. Auf die Daten zugreifen können sie aufgrund von dem Aufruf **the\_post()**.
Besonders habe ich mich gerade über die Möglichkeit gefreut die Posts nach einem bestimmten **benutzerdefinierten Feld** zu sortieren:

    $my_query = new WP_Query(array(
        'orderby' => 'meta_value',
        'meta_key' => 'episode',
        'order' => 'ASC'
    ));

## Social Media und Plugins
Wer will schon alleine auf seinem Blog sein? Damit man selbst und alle Besucher sehen wieviele **Fans und Freunde** man hat, braucht man je nach Anforderung verschiedene Buttons und Funktionen.
Das meiste gibt es schon als fertiges Plugin. Eine gute Übersicht gibt es zum Beispiel bei [Ellen](http://www.elmastudio.de/wordpress/18-der-angesagtesten-social-media-plugins-fur-deinen-wordpress-blog/). Für mich ist bei der Auswahl immer wichtig, dass es eine Funktion gibt, mit deren Hilfe man die Funktionalität an beliebiger stelle im eigenen Theme einbauen kann.
Man lädt eine **ZIP Datei** herunter, entpackt sie auf dem eigenen Rechner und schiebt den kompletten Ordner in das Verzeichnis **wp-content/plugins/**. Anschließend im Backend unter Plugins den neuen Eintrag in der Liste aktivieren.
Der [Facebook Share Button](http://wordpress.org/extend/plugins/facebook-share-new/screenshots/) ist sehr komfortabel. Nach Installation des Plugins findet man im linken Menü ganz unten eine Optionsseite mit Einstellungsmöglichkeiten. Im Theme bindet man an geeigneter Stelle innerhalb des Loops das entsprechende Tag ein:

    <?php echo fb_generate_button(); ?>

Welches Tag das ist findet man heraus in dem man die **PHP Dateien im Plugin Ordner** ansieht. Meistens gibt es nur eine in der alles mögliche zusammen gefasst ist. Je nach Entwickler besser oder schlechter gemacht und dokumentiert.
Facebook steht, als nächstes kommt **Twitter**. Diesmal kommt das Plugin [Topsy](http://wordpress.org/extend/plugins/topsy/) zum Einsatz. Die Einstellungen verstecken sich nach der Installation unter **Einstellungen / Topsy**. Für das Theme stehen zwei Tags zur Verfügung:

    <?php echo topsy_retweet_small(); ?>
    <?php echo topsy_retweet_big(); ?>

Viel Spaß beim einbinden!

## Fazit
WordPress ist ein tolles System um die unterschiedlichsten Anforderungen zu erfüllen. Allerdings sieht man auch das sich nach einiger Zeit ein ziemliches Chaos entwickelt. Vorallem wenn mehrere Leute ohne genau definierte Regeln an einem Projekt arbeiten.
Aber es geht schnell und macht Spaß. Unsere [Firmenseite](http://www.apeunit.com) ist ebenfalls in WordPress realisiert. Ich bin gespannt auf eure Verbesserungsvorschläge.