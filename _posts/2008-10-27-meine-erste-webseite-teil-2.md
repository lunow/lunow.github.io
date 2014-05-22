---

layout: post
title: "Meine erste Webseite, Teil 2"
abstract: 'Der erste Teil ist geschafft. Wir haben die Grundlagen gelernt und haben ein Plätzchen im Netz an dem wir uns austoben können. Jetzt soll das ganze noch schöner werden!
Wir entdecken jetzt die Grundlagen von CSS, binden Bilder in unsere Seite ein und wagen den ersten Schritt mit PHP. Das wird ein Spaß!'
categories: Tutorial
redirect_from: "2008/10/27/meine-erste-webseite-teil-2/"

---

## Dateireferenzierungen
Bei der Webseitenerstellung ist das immer so eine Sache: Jede verwendete Technik (CSS, HTML, PHP) hat ihre eigenen Regeln zur Ansteuerung von weiteren Dateien. Man unterscheidet zwischen **relativen Pfaden** und **absoluten Pfaden**.
**Relative Pfade** sind relativ zur Datei in der sie benutzt werden.
**Absolute Pfade** beginnen immer mit http:// und können auch auf Dateien verweisen die auf anderen Server liegen.

## Eine externe CSS Datei einbinden
Im Kopfbereich der Seite kann man mit dem Link-Tag weitere Dateien mit dem Dokument verknüpfen und den Browser so anweisen diese zu interpretieren. Wir benutzen das für unser externes Stylesheet (die Datei **style.css**).

    <link rel="stylesheet" href="style.css" />

Im Attribut **href** befindet sich der relative Link zur Datei. Um zu testen ob es funktioniert hat, öffnen wir die Datei **style.css** und fügen die erste CSS Regel ein:

    body {
      background-color:black;
      color:white;
    }

Speichern und die index.php im Browser neuladen. Wenn der Hintergrund schwarz und die Schrift weiß ist, hat alles geklappt. Wenn nicht, jagt die Seite durch den [W3C Validator](http://validator.w3.org/) um herauszufinden was nicht stimmt.

## CSS Grundlagen
Es gibt dicke Bücher über CSS. Es ist ein sehr komplexes Thema, deshalb wird dieser Absatz bei weitem nicht reichen, aber er genügt für einen ersten Einblick und die weitere Arbeit damit.
CSS Dateien beinhalten Regeln zur Darstellung von HTML Elementen. Eine Regel besteht immer aus einem dem **Selector**, der das zu stylende Element auswählt. Hier gibt es drei Möglichkeiten:

1. **Ein Tag**, haben wir benutzt im oberen Beispiel: body
2. **Eine Klasse**, werden wir sehr häufig benutzen. Gekennzeichnet durch einen vorgestellten Punkt (z.B. _.item_)
3. **Eine ID**, gekennzeichnet durch eine Raute (z.B. _\#menu_)
Klassen und IDs können jedem HTML Element zugewiesen werden. Dabei dürfen Klassennamen beliebig oft vorkommen, IDs aber nur ein einziges mal!
Nach dem Selector folgt der **Anweisungsblog**. Hier werden in geschweiften Klammern beliebigviele Anweisungen aufgeführt (z.B. _color_ für Schriftfarbe oder _background-color_ für die Hintergrundfarbe). Im Selfhtml werden sie aufgelistet, in diversen Blogs besprochen und im weiteren vereinzelt vorgestellt. Ich schlage vor, wir machen hier learning by doing, weil alle kann man kaum beschreiben.
Festzuhalten bleibt: **HTML wird genutzt zur semantischen Auszeichnung der Inhalte, CSS zur Darstellung**.

## Ein Bild einbinden
Es gibt zwei Möglichkeiten: entweder direkt über HTML mit Hilfe des [Img-Tags](http://de.selfhtml.org/html/grafiken/einbinden.htm#allgemeines) (Img = Image), gut für Bilder die wirkliche Bilder sind, oder über CSS; für Bilder die Informationen beinhalten. Das trifft z.B. auf einen grafischen Header zu. Der soll nicht nur schön aussehen, sondern auch die Besucher informieren auf welcher Seite sie sich befinden. Und als Besucher gelten nicht nur die "normalen" Benutzer, sondern auch Suchmaschinen oder Screenreader.
Um dieser Gruppen genau die gleichen Informationen zu bieten ersetzen wir unsere erste Überschrift (h1) welche den Titel der Seite enthält durch ein Bild. Diese Technik nennt man **Image Replacement**.
Nichts leichter als das: Um die erste Überschrift auszuwählen erweitern wir sie im **HTML Dokument** mit einer eindeutigen ID:

    <h1 id="title">Meine Webseite</h1>

Schöne Grafik erstellt? Dann Größe merken und im Ordner **img/** ablegen. Anschließend die CSS Datei öffnen und folgende Anweisung hinzufügen:

    #title {
      display:block;
      background:url(img/header.jpg) no-repeat left top;
      width:800px;
      height:75px;
      padding:0;
      margin:0;
      text-indent:-9999px;
    }

Was ist hier passiert? Gehen wir die Anweisungen Zeile für Zeile durch:

* **display:block** sagt dem Browser er soll dieses Element als Block darstellen. Die Alternative wäre ein Inline-Element, dem kann man aber (z.B.) keine Abstände zuweisen.
* **background** gibt eine Hintergrunddatei an (url), relativ zur style.css - außerdem geben wir noch ein paar weitere Attribute an die super bei [Selfhtml](http://de.selfhtml.org/css/eigenschaften/hintergrund.htm) erklärt werden.
* **width** und **height** geben die Größe des Blocks an (funktioniert nicht bei Inline-Elementen)
* **padding** und **margin** bezeichnen den Innen- und den Außenabstand vom Block. Wir setzen sie auf Null, wenn man etwas Platz zum Inhalt möchte, ruhig mal ein bisschen rumspielen.
* **text-indent**: Das ist der Trick vom_Image Replacement_. Um den Text für grafische Oberflächen (also den Browser) sichtbar zu machen, wird der Texteinzug auf -9999px gesetzt, was garantiert auserhalb des sichtbaren Bereichs liegt. Damit bleibt für uns nur noch das Bild, für Suchmaschinen oder Screenreader (die diese Angabe ignorieren) bleibt der Text sichtbar.
War gar nicht so schwer und ist brandheiß in der Webseitenerstellung. Auf zum nächsten, heißen Thema.

## PHP: PHP Hypertext Preprocessor
PHP ist mittlerweile eine richtige Programmiersprache geworden, wurde aber ursprünglich als Toolbox entwicklet - also kleine praktische Helfer die einem den Umgang mit der Seite erleichtern. Und genau dafür wollen wir es auch einsetzen.
Das Problem: Wenn wir verschiedene Seiten anlegen müssten wir auf jeder Seite ein komplettes HTML Dokument hinterlegen. Mit Kopf-, Körper- und Fußbereich. Ändert sich aber der Seitentitel oder wollen wir ein weiteres Stylesheet einbinden, müssten wir auf jeder Seite Änderungen durchführen und das wollen wir unbedingt verhindern. **Außerdem haben wir gelernt das wir nichts doppelt schreiben wollen**!
Die Lösung: Wir nutzen die praktischen PHP Tools. PHP Scripte werden in HTML von **<?** und**?\>** eingefasst und damit vor dem Senden an den Browser vom PHP Parser ausgeführt.
In ein paar einfachen Schritten zur interaktiven Webseite:

1. Im Ordner **content/** eine neue Datei anlegen: **start.php**
2. Den dynamischen Teil der Webseite erkennen und in einen Div-Container packen.
In meinem Beispiel wären das dann die Überschrift 2\. Ordnung, der Absatz und die unsortierte Liste.
3. Den dynmaischen Teil ausschneiden und die in die neu angelegte Datei **start.php** schreiben.
Auf der Seite befindet sich jetzt ein Container, der z.B. so aussieht:

    <div class="content"></div>

In diesen kommt jetzt unser PHP Script:

    <?
      $page = "content/start.php";
      if(is_file($page)) {
        include($page);
      }
      else {
        echo "Die Seite konnte leider nicht gefunden werden.";
      }
    ?>

Auch hier, Zeile für Zeile: Als erstes legen wir eine neue Variable, welche den Namen **page** hat. Variablen beginnen in PHP immer mit einem Dollarzeichen.
Als nächstes wird mit der Funktion **is\_file()** überprüft (if) ob die Datei, die in der Variable **$page** angegeben ist, vorhanden ist. Ist dies der Fall wird sie mit dem Befehl **include()** eingebunden.
Ist die Datei nicht vorhanden (else) wird mit der Funktion **echo** ein Hinweis ausgegeben.
Ein wichtiger Punkt fehlt natürlich noch: die Dynamik. Es gibt zwei verschiedene Möglichkeiten Variablen dynamisch an PHP zu übergeben: **GET** und **POST**. Wir benutzen erstere: Eine GET-Variable wird einfach in die Adresse der Webseite geschrieben. Sie ist vom Dateinamen (**index.php**) durch ein Fragezeichen getrennt.
Wir wollen also eine dynamische Variable **page**. Also erweitern wir den Aufruf unserer Seite wie folgt:

    http://www.meine-domain.de/index.php?page=start

Kommt einem bekannt vor, oder? Um auf diese Variable zuzugreifen gibt es das globale Array **$\_GET**. Hier sind alle Variablen gespeichert die in der URL angegeben sind. Die Variable **$page** wird also zu:

    $page = "content/".$_GET["page"].".php";

Den Ordner und die Dateiendung geben wir vor. Nur der Dateiname ist dynamisch was die Sicherheit unserer Webseite erhöht. Außerdem prüfen wir vor dem Einbinden ob die Datei vorhanden ist. Damit schützen wir uns vor diversen, gemeinen Angriffen von Hackern.
Testen ob das ganze funktioniert: Erstelle eine weitere Datei (z.B. **infos.php**) im Ordner **content/**. Schreib irgendwelchen Inhalt rein und rufe die Seite auf, über: _index.php?page=info_. Wenn es klappt kannst du anfangen für jede Seite die du auf deiner Seite haben möchtest eine Datei anzulegen und in der Indexdatei zu verlinken:

    <ul class="menu">
      <li><a href="index.php?page=start">Start</a></li>
      <li><a href="index.php?page=infos">Infos</a></li>
      ....usw.
    </ul>

Fertig! Nein... was fehlt? Es gibt einen entscheidenen Schwachpunkt: Wenn die Seite über**index.php** aufgerufen wird, also keine Variable **page** definiert wird, erhalten wir den Text "_Die Seite konnte nicht gefunden werden_". Das ist natürlich nicht im Sinne des Erfinders, denn ohne eine Angabe sollen die Benutzer auf die Startseite geleitet werden.
Was ist zu tun? Wir überprüfen ob die Variable **$\_GET** gesetzt ist. Wenn dies nicht der Fall ist, belegen wir sie mit einem Standardwert. Es folgt der betreffende Codeschnippsel. Deine Aufgabe ist es, diesen an die richtige Position im PHP Script einzufügen.

    if(empty($_GET["page"])) {
      $_GET["page"] = "start";
    }

## Herzlichen Glückwunsch!
Du hast dein erstes, eigenes **Mini-CMS **programmiert, einen grafischen Header eingebunden und eine Suchmaschinenoptimierte Seite erstellt. Nicht schlecht für den Anfang, oder?
Als nächstes beschäftigen wir uns mit dem Seitenaufbau und noch mehr CSS Techniken. [Viel Spaß beim weiter machen mit Teil 3](http://www.interaktionsdesigner.de/2008/11/07/meine-erste-webseite-teil-3/ "Meine erste Webseite, Teil 3").