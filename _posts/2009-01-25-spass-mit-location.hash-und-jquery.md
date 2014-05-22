---

layout: post
title: "Spaß mit location.hash und jQuery"
abstract: 'Weiter gehts mit **Tutorials für jQuery**! Nach dem sich [der erste Teil mit Navigation](http://www.interaktionsdesigner.de/2009/01/24/menu-tutorial-fur-jquery/ "Ein einfaches jQuery Tutorial") beschäftigen sollte, habe ich gemerkt, dass es keinen Sinn macht nur _ein_ Tutorial darüber zu schreiben. Denn so einfach eine simple Liste mit Links auch aussieht; -  umso mehr gibt es darüber zu sagen.  Also wird es eine ganze Reihe Tutorials dazu geben!
Diesmal gehts um den **Location Hash**. Das ist der Teil der URL der mit einer Raute (\#) von der restlichen Adresse getrennt ist. Bekannt von Sprungmakern (interne Seitenverweise) gewinnt er im Zusammenspiel mit neusten JavaScripttechnologien immer mehr an Bedeutung.'
categories: jQuery, Tutorial
redirect_from: "2009/01/25/spass-mit-location.hash-und-jquery/"

---

## HTML Grundlagen
Erstmal eine kurze Betrachtung _ohne_ JavaScript. Der einfache Hash einer URL wird vom Browser interpretiert und der sichtbare Bereich der Seite springt zu dem Element dessen ID angegeben ist. Zum Beispiel für Überschriften praktisch.
    
    <h1 id="wichtig">Es ist wichtig</h1>
    <p>bla bla bla ...</p>
    <h1 id="unten">Weiter unten</h1>
    <p>noch mehr bla bla ...</p>

Wenn man das_bla bla_ mit mehr Text auffüllt oder das Browserfenster entsprechend klein macht, dann kann man mit einem HTML Menü zwischen den Überschriften hin und her springen: 
    
    <a href="#wichtig">Zur wichtigen Überschrift</a>
    <a href="#unten">Zur unteren Überschrift</a>

Wichtig und praktisch ist das im Zusammenhang mit einer weiteren Seite.
    
    <a href="zweite-seite.html#irgendwo">Gehe nach irgendwo</a>

## Zusammenspiel mit jQuery
Jetzt kommt das **Lieblingsframework** ins Spiel! Hier steht der Wert aus dem Hash als Attribut zur Verfügung! Ich benutze die gleiche HTML Grundlage wie im [ersten Tutorial](http://www.interaktionsdesigner.de/2009/01/24/menu-tutorial-fur-jquery/#htmlgrundgeruest "HTML Grundgerüst aus dem ersten Tutorial") (man beachte den Sprungmarker ;)).
    
    jQuery(function($) {
        $(".menu a").click(function() {
            alert($(this).attr("hash"));
            return false;
        });
    });

Mit diesem Code gibts von jedem Link den Hashwert angezeigt. Das _return false;_ verhindert das Laden einer neuen Seite, sollte die im Link angegeben sein.
Und was soll man damit machen? **Ajaxanwendungen bauen!!** Wenn für jeden Link ein aussagekräftiger Hashwert zur Verfügung steht, dann wird der einfach an ein serverseitiges Script weitergeleitet und das kann damit tun was immer notwendig ist. Ich bevorzuge das Folgende: Es gibt einfach alle übergebenen Variablen aus.
    
    <?
        echo "<pre>", print_r($_REQUEST), "</pre>";
    ?>

Jetzt ohne viel Gerede **die komplette Klickfunktion**.
    
    $(".menu a").click(function() {
        $(".menu a.active").removeClass("active");
        $(this).addClass("active").blur();
        
        $.ajax({
            url: "remote.php",
            data: {gib_mir: $(this).attr("hash").substr(1)},
            type: "POST",
            dataType: "HTML",
            
            success: function(remote_html) {
                $("#response").hide().html(remote_html).fadeIn();
            },
            error: function() {
                alert("Mist verdammter, etwas hat nicht geklappt :(");
            }
        });
    });

Sieht kompliziert aus? Ist es aber gar nicht! Was ist passiert?
Die ersten zwei Zeilen stammen aus dem ersten Tutorial und dienen nur der besseren Darstellung.
Dann kommt die **Ajaxanfrage**. Das ist ein Objekt mit einer ganzen Reihe Eigenschaften, die da wären:

* **url** gibt die aufzurufende Datei an.
* **data** ist ein neues Objekt mit allen Daten die übergeben werden sollen. jQuery kümmert sich, je nach Typ der Anfrage, um das korrekte verpacken und verschicken.
Das Objekt hat eine Eigenschaft: _gib\_mir_ steht dann als Name im PHP Script zur Verfügung ($\_POST\["_gib\_mir_"\]). Der Wert ist das Attribut hash aus dem angeklickten Link. _Substr(1) _schneidet das erste Zeichen ab - das ist immer die Raute und die brauchen wir nicht mehr.
* **type** gibt den Datenübertragungsform an. Man könnte sagen _GET_ bei kurzen Inhalten, _POST_ bei langen. Mehr Informationen darüber bringt [Google](http://www.google.de/search?q=unterschied+GET+POST "Google kennt auch den Unterschied zwischen GET und POST").
* **dataType** sagt jQuery welche Daten erwartet werden. Das sollte man nie vergessen, denn nach dieser Angabe wird die Variable für die Funktion hinter _success_ formatiert.
* **success** ist die Funktion die ausgeführt wird wenn alles geklappt hat. In den Parametern ist die Antwort vom Script, hier also in _remote\_html_.
In dieser Funktion steht nur eine Zeile, die mal wieder die ganze Schönheit und Macht von jQuery demonstriert. Stück für Stück:
**$("\#response")** wählt das Element mit der ID response aus (z.B. ein DIV Container)
**hide()** blendet ihn aus
**html()** schreibt neuen HTML Code hinein
und mit **fadeIn()** wird er sanft dem Benutzer wieder eingeblendet.
* **error** ist schließlich noch eine Funktion die ausgelöst wird wenn etwas nicht geklappt hat.
Das war **Ajax**! Ganz einfach. Die Ausgabe sieht z.B. so aus: 
    
    Array
    (
        [gib_mir] => punkt4
    )
    1

Was sofort auffällt ist das fehlende _remote false;_ in der Klickfunktion. Damit schreibt der Browser den Hashwert in die URL. Aber wenn eine andere Datei in der URL angegeben ist, führt es zu einem Seitenwechsel. Zum Glück macht uns jQuery auch hier die Arbeit leichter und die Funktion wird um zwei Zeilen erweitert.
    
    $(location).attr("hash", $(this).attr("hash"));
    return false;

## Das Tolle an der Sache
Indem der Hash verändert wird, ist es möglich die URL zu verschicken, zu speichern und im Blog zu verlinken. Blöd allerdings, dass dabei nichts passiert.
**Doch keine Panik**, zwei Zeilen helfen weiter!
    
    if($(location).attr("hash"))
        $("a[hash="+$(location).attr("hash")+"]").click();

Übersetzt bedeutet das: Wenn ein Hashwert gefunden wird _if(...)_, dann suche den Link mit diesem Wert und führe die Aktion aus, wie als wäre draufgeklickt. Herrlich oder?
Die (ich nenne sie mal) **Event-Funktionen**, z.B. _click_, _mouseover_, _mouseup_, _dblclick_ usw., funktionieren auf zwei Arten: wird eine Funktion als Parameter übergeben, wird diese ausgeführt wenn das Event vom Benutzer ausgelöst wird (siehe oben _$("a").click(function() { alert("Hallo A!"); });_). Wird kein Parameter übergeben, löst jQuery die Funktion aus - **wie als hätte der Benutzer darauf geklickt**.
Und das hat zur Folge: **Alle Links funktionieren!** Die Seite reagiert auf den Hash und einem Verschicken steht nichts mehr im Wege!

## Fazit
Mit Hilfe des Location Hash kann man Ajaxanwendungen bauen, die wissen an welcher Position der Benutzer einsteigen will. War das Tutorial verständlich?