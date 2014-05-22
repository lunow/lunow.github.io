---

layout: post
title: "TYPO3 Klickvergrößern durch eine jQuery Lightbox ersetzen"
abstract: 'Wenn jQuery auf einer Seite eingebunden ist (z.B. durch die coole Extension [Kiwi Slider](http://www.interaktionsdesigner.de/2008/09/09/typo3-extension-kiwi-slider-2/ "Kiwi Slider")) dann beißt sich das Javascriptframework mit anderen wie MooTools oder Prototype. Insgesamt sollte man bevorzugt ein Framework einsetzen, wenn man unbedingt beide braucht, dann lohnt sich die Suche nach dem [NoConflict Mode](http://docs.jquery.com/Core/jQuery.noConflict "jQuery noConflict") von jQuery.
Wenn aber das _unbedingt_ nur von einer Lightbox kommt, dann sollte man sich kurz hinsetzen, einen geeigneten Klon aussuchen ([hier ist die große Lightbox Matrix](http://planetozh.com/projects/lightbox-clones/ "Lightboxclone Matrix")) und die **Klickvergrößerung von TYPO3** damit ersetzen. Das ist schnell, effektiv und in diesem Beitrag erklärt.'
categories: jQuery, TYPO3
redirect_from: "2009/12/04/typo3-klickvergrossern-durch-eine-jquery-lightbox-ersetzen/"

---

## Vorbereitungen
Für mein aktuelles Projekt habe ich mich für den Lightbox Clone [TopUp](http://gettopup.com/ "TopUp") entschieden. Sieht sehr vielversprechend aus. Also welcher Klone auch immer: **Daten herunterladen** und **ins Projekt einbinden**. Dazu gehören mind. jQuery und das entsprechende Plugin, in vielen Fällen auch noch eine CSS Datei. Firebug verrät im _Script_ Reiter ob es funktioniert hat.
TopUp benötigt keine CSS Datei, dafür aber **einen Bilder- und einen Players-Ordner** in dem SWF Dateien gespeichert sind um verschiedene Medien wiederzugeben. Per JavaScript können die Pfade angepasst werden:

    TopUp.host = 'http://www.kiwi-service.de/';
    TopUp.images_path = 'fileadmin/template/img/topup/';
    TopUp.players_path = 'fileadmin/template/flash/';

## JavaScript einbinden
Eine Besonderheit bringt TopUp mit: Es lädt dynamisch die benötigten JavaScriptdateien nach. Dafür braucht er den **kompletten javascripts/jquery Ordner**. Dieser muss im gleichen Ordner liegen wie **top\_up-min.js**.

    fileadmin/template/js/top_up-min.js
    fileadmin/template/js/jquery/...

## Test
Alle benötigten Dateien sind eingebunden und in Firebug sichtbar. Um zu testen ob es funktioniert, füge ich ein Inhaltselement vom Typ HTML ein und schreibe mein eigenes Bild rein. Testbilder sind im _Images_ Ordner vorhanden.

    <a href="fileadmin/template/img/topup/photos/1.jpg" class="top_up">
        <img src="fileadmin/template/img/topup/thumbnails/1.jpg">
    </a>

Funktioniert, wunderbar! Wenn nicht, dann die eigene Seite mit den [Beispielen](http://gettopup.com/examples "TopUp Beispiele") vergleichen.

## Typoscript
Nun muss man **TYPO3** noch das hässliche JavaScript PopUp austreiben. Hier mein Konfiguration für **Version 4.3**

    temp.imageLinkWrap = 1
    temp.imageLinkWrap {
    enable = 1
    typolink {
    
    parameter.cObject = IMG_RESOURCE
    parameter.cObject.file.import.data = TSFE:lastImageInfo|origFile
    parameter.cObject.file.maxW = {$styles.content.imgtext.maxW}
    parameter.override.listNum.stdWrap.data = register : IMAGE_NUM_CURRENT
    
    title.field = imagecaption // title
    title.split.token.char = 10
    title.if.isTrue.field = imagecaption // header
    title.split.token.char = 10
    title.split.returnKey.data = register : IMAGE_NUM_CURRENT
    parameter.cObject = IMG_RESOURCE
    parameter.cObject.file.import.data = TSFE:lastImageInfo|origFile
    ATagParams = target="_blank"
    }
    }
    
    tt_content.image.20.1.imageLinkWrap >
    tt_content.image.20.1.imageLinkWrap < temp.imageLinkWrap 

Als erstes wird das temporäre Objekt **temp.imageLinkWrap** erzeugt und konfiguriert. Interessant ist die letzte Angabe **ATagParams** - darüber gibt man jedem Link die Klasse _top\_up_ mit, damit das Plugin sich um die Bilder kümmert.
Anschließend wird die Standardvergrößerung in **tt\_content.image.20.1.imageLinkWrap** überschrieben. **Cache leeren** und Seite neuladen, fertig!

## TopUp Spezialitäten
Dieses TopUp ist wirklich ein schönes Teil. Mit der Funktion **addPresets()** lassen sich für Links in DOM Bereichen Voreinstellungen treffen. Zum Beispiel alle Bilder die über **ein Inhaltselement** eingestellt sind, zu einer Gruppe zusammenfassen:

    TopUp.addPresets({
    ".csc-textpic-imagewrap a": {
    group: "images"
    }
    });

Das bedeutet alle TopUp-Links im Div **.csc-textpic-imagewrap** werden der Gruppe _images_ zugewiesen. Im Overlay gibts dann Vor- und Zurückpfeile.

## Fazit
Die Initialisierung und Einstellungen einer Lightbox variieren natürlich. Es gibt aber ein paar schöne und elegante Tools deren Einsatz sich lohnen. Vorallem im Zusammenspiel mit der brand neuen TYPO3 Version 4.3 - ein großartiger Schritt mit schönen Verbesserungen. Unbedingt ansehen. Und TopUp einbinden!