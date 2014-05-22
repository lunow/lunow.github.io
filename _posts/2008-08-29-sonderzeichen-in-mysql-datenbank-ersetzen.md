---

layout: post
title: "Sonderzeichen in MySQL Datenbank ersetzen"
abstract: 'Manchmal ist es notwendig in einer Datenbank schnell und unkompliziert die Sonderzeichen rauskriegen. Die Gründe sind vielfältigt und bevor ein furchtbares durcheinander besteht, packe ich lieber ein [htmlspecialchars](http://www.php.net/htmlspecialchars) vor dem Speichern rein und jage folgende Anweisungen über die Datenbank.'
categories: Allgemein
redirect_from: "2008/08/29/sonderzeichen-in-mysql-datenbank-ersetzen/"

---

UPDATE tabellenname SET spaltenname = REPLACE (spaltenname, 'ß', '&szlig;');
    UPDATE tabellenname SET spaltenname = REPLACE (spaltenname, 'ä', '&auml;');
    UPDATE tabellenname SET spaltenname = REPLACE (spaltenname, 'ü', '&uuml;');
    UPDATE tabellenname SET spaltenname = REPLACE (spaltenname, 'ö', '&ouml;');

Gefunden bei [Sven Wappler](http://www.wappler.eu/zeichen-in-mysql-datenbank-ersetzen/). Danke schön.