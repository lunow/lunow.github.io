---

layout: post
title: "Mobile Webseiten mit jQuery Mobile und CakePHP"
abstract: 'Zwei großartige Frameworks, vereint um die mobile Welt zu verbessern, bereichern und verändern. Mit **CakePHP** baut man in wenigen Schritten eine mobile Applikation die auf allen Smartphones gut aussieht mit Hilfe von **jQuery Mobile**.'
categories: CakePHP, jQuery Mobile
redirect_from: "2011/01/27/mobile-webseiten-mit-jquery-mobile-und-cakephp/"

---

## CakePHP vorbereiten
Um in allen Teilen der Applikation zu erkennen, ob ein mobiles Endgerät auf die Seite zugreift, definiert man im AppController eine Variable \[pre\]$isMobile\[/pre\].

    class AppController extends Controller {
        var $isMobile = false;
    }

In der Funktion \[pre\]beforeFilter()\[/pre\] wird mit Hilfe des RequestHandlers das mobile Endgerät erkannt:

    function beforeFilter() {
        if($this->RequestHandler->isMobile() || isset($this->params['url']['mobile'])) {
            $this->layout = 'mobile';
            $this->isMobile = true;
        }
        $this->set('is_mobile', $this->isMobile);
    }

Die Variable \[pre\]isMobile\[/pre\] wird auf \[pre\]true\[/pre\] gesetzt und das Layout \[pre\]mobile\[/pre\] genutzt. Um es in der gewohnten Umgebung zu testen, erlaube ich auch den URL Parameter \[pre\]mobile\[/pre\], mit dem jeder View per \[pre\]?mobile=1\[/pre\] im mobilen Layout angezeigt werden kann.
Bei einer richtig guten Applikation ist die Arbeit damit getan und alle Views funktionieren auch in der mobilen Version. Realistischer ist aber das man in der mobilen Version anderen HTML Code braucht und nur einen Teil der Funktionalität zur Verfügung stellt. Das erreicht man über angepasste Views.
In der Funktion \[pre\]beforeRender()\[/pre\] kann der View verändert werden. Meine Lieblingsfunktion sieht so aus:

    function beforeRender() {
        if($this->isMobile) {
            $this->action = 'mobile/'.$this->action;
        }
    }

Entweder man fügt diese Funktion im \[pre\]AppController\[/pre\] ein und leitet für die gesamte Applikation alle Views in den mobile Ordner weiter, oder nur in den betreffenden Controllern.
Nach dem abarbeiten der Funktion im Controller wird der View in den mobile Ordner weiter geleitet. Cake sucht jetzt für den Aufruf von \[pre\]/users/login\[/pre\] den View in \[pre\]app/views/users/mobile/login.ctp\[/pre\].

## jQuery Mobile im CakePHP Layout
Jetzt kommt der schöne Teil! Eine mobile Applikation mit jQuery mobile bauen. Grundlage ist ein HTML5 Grundgerüst:

    <!DOCTYPE html>
    <html>
        <head>
            <title>HTML5 Gerüst</title>
            <meta charset="utf8">
        </head>
        <body>
            <h1>Hallo Welt</h1>
        </body>
    </html>

Die üblichen Variablen aus dem CakePHP View können natürlich nach belieben eingesetzt werden, ich denke da an \[pre\]$title\_for\_layout\[/pre\] und \[pre\]$content\_for\_layout\[/pre\]. Wirklich entscheidend ist aber jQuery mobile.
Auf der Downloadseite gibt es ein praktisches Copy Paste Snippet um jQuery und jQuery Mobile aus dem CDN einzubinden:

    <!DOCTYPE html>
    <html>
        <head>
            <title>HTML5 Gerüst</title>
            <meta charset="utf8">
            **<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.css" />
            <script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
            <script src="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.js"></script>**
        </head>
        <body>
            <div data-role="page">
                <div data-role="header">
                    <h1>Hallo Welt!</h1>
                </div>
                <div data-role="content">
                    <p>Meine erste mobile Seite</p>
                </div>
            </div>
        </body>
    </html>

Bei jQuery Mobile läuft sehr viel über das \[pre\]data\[/pre\] Attribut eines Elements. Seite, Kopf und Inhalt werden darüber deklariert. In jQuery ließt man diese Eigenschaften übrigens sehr einfach über die \[pre\]data()\[/pre\] Funktion aus.

    $('div').data('role'); // returns string
    $('div').data(); // returns object

## Konfiguration
Es gibt Standardeinstellungen, Callbacks und Events auf die man in Javascript reagieren kann. Allerdings muss man den eigenen Code vor dem Einbinden von jQuery Mobile anlegen! So siehts aus:

    <script src="jquery.min.js"></script>
    <script>
        $(document).bind("mobileinit", function(){
            //apply overrides here
        });
    </script>
    <script src="jquery.mobile.min.js"></script>

## Formulare
jQuery Mobile erwartet einen Container der das Label und das Inputfeld umschließt. Kein Problem sagt der Cake Entwickler erst, dann bemerkt er aber das der Container das Data Attribut \[pre\]fieldcontainer\[/pre\] braucht. Zum Glück auch kein Problem, da man dem FormHelper beim erstellen des Formulars Standardeigenschaften mitgeben kann:

    echo $this->Form->create('User', array(
        'action' => 'login',
        'inputDefaults' => array(
            'div' => array('data-role' => 'fieldcontain')
        ),
    ));

jQuery Mobile kümmert sich jetzt von selbst um die korrekte Darstellung. Bei viel Platz werden Label und Inputelement nebeneinander, bei weniger Platz untereinander dargestellt. Submitbuttons werden automatisch schick dargestellt.

## Fazit
Es gibt eine Menge Dinge man beim Arbeit mit jQuery Mobile entdecken kann. Es macht großen Spaß und funktioniert gut über die meisten mobilen Endgeräte hinweg. Die Dokumentation von jQuery Mobile ist mit jQuery Mobile erstellt. Dazu ein Trick: Wenn man die Seite gefunden hat, die genau das darstellt was man sucht, dann entfernt man die Raute aus der URL und öffnet anschließend den Quelltext der Seite um zu verstehen wie das Feature aufgebaut ist.
Da alles dynamisch geladen wird, vom Framework angepasst und erweitert wird, wird man im Firebug durch jede Menge Kram abgelenkt. Will man also herausfinden wie durchsuchbare Listen aufgebaut sind, navigiert man auf die entsprechende Seite in der Doku:

    http://jquerymobile.com/demos/1.0a2/#docs/lists/lists-search.html

Und entfernt die Raute:

    http://jquerymobile.com/demos/1.0a2/docs/lists/lists-search.html

Und erkennt das es äußerst einfach, genial und zukunftsfähig aufgebaut ist:

    <div data-role="page">
    
        <div data-role="header">
            <h1>Search filter bar</h1>
        </div><!-- /header -->
    
        <div data-role="content">
                <ul data-role="listview" data-filter="true">
                    <li><a href="index.html">Acura</a></li>
    
                    <li><a href="index.html">Audi</a></li>
                    <li><a href="index.html">BMW</a></li>
                    <li><a href="index.html">Cadillac</a></li>
                    <li><a href="index.html">Chrysler</a></li>
                    <li><a href="index.html">Dodge</a></li>
                    <li><a href="index.html">Ferrari</a></li>
    
                    <li><a href="index.html">Ford</a></li>
                    <li><a href="index.html">GMC</a></li>
                    <li><a href="index.html">Honda</a></li>
                    <li><a href="index.html">Hyundai</a></li>
                    <li><a href="index.html">Infiniti</a></li>
                    <li><a href="index.html">Jeep</a></li>
    
                    <li><a href="index.html">Kia</a></li>
                    <li><a href="index.html">Lexus</a></li>
                    <li><a href="index.html">Mini</a></li>
                    <li><a href="index.html">Nissan</a></li>
                    <li><a href="index.html">Porsche</a></li>
                    <li><a href="index.html">Subaru</a></li>
    
                    <li><a href="index.html">Toyota</a></li>
                    <li><a href="index.html">Volkswagon</a></li>
                    <li><a href="index.html">Volvo</a></li>
                </ul>
        </div><!-- /content -->
    </div><!-- /page -->

Ist das nicht schön?
Beim schreiben sind mir eine ganze Menge Themen aufgefallen die unbedingt noch behandelt werden müssen: **Links**, **Ajax** und **Maps**.
Wie sind deine Erfahrungen mit jQuery Mobile?