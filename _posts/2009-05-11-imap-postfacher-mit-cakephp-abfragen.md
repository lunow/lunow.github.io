---

layout: post
title: "IMAP Postfächer mit CakePHP abfragen"
abstract: 'Für ein aktuelles Projekt musste die Anwendung pe**r IMAP auf ein Postfach** zugreifen und die **Mails auslesen**. Das einzige Plugin welches ich gefunden habe war für CodeIgniter, benutzte aber glücklicherweise wenig Corefunktionen was es ermöglicht hat es für **CakePHP** zu portieren.
Es ist jetzt also sehr leicht möglich die Mails aus einem Postfach auszulesen. Im folgenden Beitrag wird gezeigt wie.'
categories: CakePHP
redirect_from: "2009/05/11/imap-postfacher-mit-cakephp-abfragen/"

---

## Grundlagen
Das installierte [PHP muss IMAP unterstützten](http://www.php.net/manual/en/imap.setup.php "IMAP und PHP"). Das lässt sich herausfinden in dem die Funktion_imap\_start() _aufgerufen wird. Wenn die Funktion exsistiert ist alles okay.
Die [IMAP Componente](http://www.interaktionsdesigner.de/stuff/imap-component.php "IMAP Component für PHP") muss in dem Ordner_app/controllers/components/_ mit dem Dateinamen _Imap.php _gespeichert werden.

## Benutzen
In einem beliebigen **Controller** wird die Componente wie gewohnt geladen.

    $components = array('Imap');

In einem **Shellprogramm** (abgelegt in _app/vendors/shells/_) muss die Componente über Import reingeholt werden:

    App::import('Component', 'Imap');
    $this->Imap = new ImapComponent();

## Verbinden
Die Componente erwartet ein Array mit den Zugangsdaten zum Postfach.

    private $imap_config = array(
        'imap_user' => 'test@kiwi-service.de',
        'imap_pass' => 'total-geheimes-supersicheres-passwort',
        'imap_flags' => '',
        'imap_mailbox' => 'test@kiwi-service.de',
        'imap_server' => 'kiwi-service.de',
        'imap_port' => '143'
    );

Die einzelnen Keys sind ja selbsterklärend. Nur die Componente muss sie noch wissen. Das geschieht per Übergabe eines Arrays:

    $this->Imap->items($this->imap_config);

Oder einzelnd mit

    $this->Imap->item('imap_user', 'test@kiwi-service.de');

Wenn alle Daten gesetzt sind, wird zum Postfach verbunden.

    $this->Imap->connect();

Der Rückgabewert dieser Funktion ist negativ wenn es nicht funktioniert hat.

## Emails bekommen
Die Anzahl der neuen Nachrichten liefert die Funktion **msg\_count()**.
Eine Liste aller Nachrichten liefert die Funktion **msg\_list()**. Das Ergebnis ist ein **mehrdimensionales Array** und kann in einer Schleife durchgegangen werden.

    $messages = $this->Imap->msg_list();
    foreach($messages as $message) {
        debug('Titel: '.$message['title']);
    }

Eine gute Hilfe gegen verrückte Sonderzeichen und Kodierungen ist die Kombination von _utf8\_encode_ und _quoted\_printable\_decode_. Damit werden die meisten Umlaute richtig dargestellt.
Für den Text der Mail wäre das dann innerhalb der foreach-Schleife

    debug(utf8_encode(quoted_printable_decode($message['body'])));

## Ende
Zu guter letzt sollte dann auch noch die Verbindung wieder getrennt werden.

    $this->Imap->close();

Auch hier ein negativer Rückgabewert wenn es nicht funktioniert hat.
Die Klasse bietet noch einige Funktionen, wer auf der suche ist sollte da mal einen Blick rein werfen.
Ansonsten, frohes Backen!