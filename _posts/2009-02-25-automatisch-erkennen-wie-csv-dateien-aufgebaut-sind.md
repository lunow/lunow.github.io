---

layout: post
title: "Automatisch erkennen wie CSV Dateien aufgebaut sind"
abstract: 'CSV Dateien sind z.B. **Exports aus Datenbanken oder Excel**. Der Name steht für _Comma-Separated Values _und bedeutet, dass die Werte von einem Komma getrennt sind. Damit kann man **einfach** eine CSV importieren und zum Beispiel in PHP weiter verarbeiten.
Tja, einfach ist das natürlich nicht und jedes Programm erstellt **andere CSV Dateien**. Ich habe eine Funktion geschrieben die versucht **automatisch** zu erkennen wie eine CSV Datei aufgebaut ist. [Hier ist eine Demo](http://interaktionsdesigner.de/stuff/csv.php "Automatische CSV Erkennung") und im folgenden Artikel kommt die Funktionsweise.'
categories: Entwicklung, PHP
redirect_from: "2009/02/25/automatisch-erkennen-wie-csv-dateien-aufgebaut-sind/"

---

Die Funktion erwartet einen String, z.B. 
    
    "spalte1", "spalte2", "spalte3"

und gibt dann ein Array zurück mit den Keys _delimiter_ und _enclosure_. Aus dem obrigen Beispiel wäre das dann 
    
    Array(    [delimiter] => ;     [enclosure] => ")

Hier kommt die **komplette Funktion** und anschließend ein paar erklärende Worte.
    
    function csv_autodetect($string) {
        $str = trim($string);
        $char = '';
        $e = '';
        $d = array();
        $open = false;
        $strip = false;
        for($i = 0; $i < strlen($str); $i++) {
            $char = $str[$i];
            if(preg_match('=[W]=', $char) && ord($char) != 32) {            
                if($i == 0)
                    $e = $char;
                
                if($char == '\')
                    $strip = true;
                else
                    $strip = false;
                
                if($char == $e && !$strip) {
                    $open = $open ? false : true;
                }
                else {
                    if(!$open && !$strip)
                        $d[$char]++;
                }
            }
        }
        
        asort($d);
        $dd = array_keys($d, array_pop($d));
        $return['delimiter'] = $dd[0];
        $return['enclosure'] = $e;
        return $return;    
    }

Nachdem einige Variablen vorbelegt wurden, erfolgt die **zeichenweise Untersuchung des Strings**. Wenn es sich um ein Sonderzeichen handelt, dann beginnt die Untersuchung.

    if($i == 0)
        $e = $char;

Wenn das erste Zeichen des Strings ein **Sonderzeichen** ist und kein Leerzeichen, dann ist es mit Sicherheit jenes, welches die Werte umfasst (_e = Enclosure_).

    if($char == '\')
        $strip = true;
    else
        $strip = false;

Wenn es sich um ein **Backslash** handelt, dann wird das nächste Zeichen ignoriert. Damit sind dann Fälle wie _"eine "Spalte"";_ auch möglich.

    if($char == $e && !$strip)
    $open = $open ? false : true;

Wenn es also das umschließende Zeichen ist, und nicht durch ein Backslash auskommentiert wurde (_$strip_), dann wird der Status von _$open_ geändert. Durch diese Beachtung ist es dann möglich den Delimeter innerhalb einer Spaltenbezeichnung zu benutzen (z.B. _"spalte1", "spalte1,5", "spalte2"_). Wenn es sich nicht um das umschließende Zeichen handelt, dann muss weiter überlegt werden:

    if(!$open && !$strip)
        $d[$char]++;

Wenn sich das Zeichen nicht innerhalb einer Spaltenbezeichnung befindet und auch nicht auskommentiert wurde, dann wird das Arrayelement _$d_ (_d = Delimiter_) mit dem Zeichen als Schlüssel um eins erhöht.
Der Grund dafür ist das eventuelle Auftreten von Sonderzeichen in einer Spaltenbezeichnung ohne Enclosure (z.B. spalte1, spalte2&3, spalte4). Am Ende wird das Zeichen als Delimeter erwartet welches **am häufigsten gefunden** wurde. Das gibt zwar ein Problem bei einem String wie _c&a, p&c, m&m_ - aber dann muss man seine Felder halt mit einem Zeichen umschließen.
**Ende!** Wer jetzt in seinem Kopf die Idee spinnt daraus ein Tool zu bauen welches **CSV Dateien in eine Datenbank importiert**, dem sei geraten noch ein paar Tage zu warten oder mir eine Mail zu schicken. Hab da was tolles in der mache was demnächst veröffentlicht wird :).
Wer _Ideen_, _Probleme_ und _Verbesserungsvorschläge_ hat kann diese gerne in den Kommentaren los werden.