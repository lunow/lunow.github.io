---

layout: post
title: "TYPO3 Extension Kiwi Accordion Version 1.6"
abstract: 'Nach einigen Mails und Forenbeiträgen hatte ich schon Bauchschmerzen und fühlte mich ungut, denn meine kleine, feine Extension [**Kiwi Accordion**](http://typo3.org/extensions/repository/view/kiwi_accordion/current/ "Kiwi Accordion im Repository") setzte die "Rahmen"-Eigenschaft von Inhaltselementen außer kraft.
Aber damit ist jetzt Schluss! **Die neue Version** legt ihre Container unabhängig von den Rahmen um den Inhalt. Zeitnah im Repository verfügbar. Auf meiner [privaten Seite](http://www.paul-lunow.de/kiwi-accordion "Webentwickler aus Berlin") gibt es eine Demonstration und im folgenden Eintrag ein paar technische Erklärungen.'
categories: Kiwi Accordion, TYPO3
redirect_from: "2010/02/11/typo3-extension-kiwi-accordion-version-1-6/"

---

## Für Redakteure
Die Funktionsweise für Redakteure ist **sehr einfach**. Über die Seiteneigenschaften lässt sich bestimmen, ob mehrere Panels gleichzeitig offen sein dürfen.
[](http://blog.paul-lunow.de/wp-content/uploads/2010/02/HiVars-Demoprojekt-TYPO3-4.3.1.jpg)
Jedes Inhaltselement wiederum hat zwei Eigenschaften, **Aufklappbar** und **Offen**.
[](http://blog.paul-lunow.de/wp-content/uploads/2010/02/HiVars-Demoprojekt-TYPO3-4.3.1-1.jpg)Die erste Option initalisiert den Effekt, die zweite öffnet das Inhaltselement beim laden der Seite. Das wars! Eine Beispiel gibt es auf meiner [privaten Seite](http://www.paul-lunow.de "Webentwickler aus Berlin").

## Für Techniker
Der kleinere Teil der Arbeit wird vom mitgelieferten Typoscript übernommen. Über die Eigenschaft **tt\_content.stdWrap.innerWrap.prepend** und **append** wird ein DIV Container um den Inhalt gelegt (**div.ka-panel**) und je nach gewählten Eigenschaften die Klasse **open** oder **close** hinzugefügt.
In Version 4.3 hat sich dieser Teil grundlegend geändert. Inhaltselemente werden jetzt immer innerhalb eines DIV Containers ausgegeben was ich wesentlich besser finde als die nervigen Links ala **<a href="\#c123"\></a\>**. Das hat leider zur Folge, dass in älteren Versionen der **tt\_content.stdWrap.innerWrap** nur ausgeführt wird, wenn ein Rahmen ausgewählt wurde. Um das zu verhindern fügt die Extension einen Standardwert hinzu, damit die Eigenschaft aufjedenfall greift. Möglich wird das über die Abfrage der eingestellten TYPO3 Version.

    [compatVersion < 4.3]
    tt_content.stdWrap.innerWrap.cObject.default = TEXT
    tt_content.stdWrap.innerWrap.cObject.default.value = |
    [end]

Der größere Teil der Arbeit erfolgt als jQuery Script. Das Kiwi Accordion arbeitet mit jQuery, **bringt das Framework aber selbst nicht mit**. Ich bin bei der Entwicklung davon ausgegangen, dass es in jedem Projekt integriert ist.
Im Script wird jeder Container mit der Klasse **ka-panel** untersucht und für die weitere Verwendung angepasst. Dabei wird mit **$(':header:first', '.ka-panel')** die erste Überschrift gesucht und als Handler benutzt. Alle Elemente nach der Überschrift werden mit einem Container umschlossen (**div.ka-content**) und bei Klick ein- oder ausgeblendet.
Bei Mauskontakt erhält das Panel zusätzlich die Klasse **hover**, damit lassen sich dann Pfeile anzeigen oder Farben ändern, je nach Vorgabe.
Wenn bei der Initialisierung etwas nicht funktioniert, gibt die Extension ein paar Hinweise in der Firebug Konsole aus. Ich hoffe das hilft weiter. Ansonsten sei auf die [Demo auf meiner Seite](http://www.paul-lunow.de/kiwi-accordion "TYPO3, Extensions, Webstandards") verwiesen.
Getestet hab ich die Extension mit TYPO3 Version **4.3**, **4.3.1** und **4.2.6**. Über weitere Kompatibilitätshinweise, Fragen und Anregungen freue ich mich natürlich sehr.

* [Kiwi Accordion im TYPO3 Repository](http://typo3.org/extensions/repository/view/kiwi_accordion/current/)
* [Kiwi Accordion 1.6.0](http://www.interaktionsdesigner.de/wp-content/uploads/2010/02/T3X_kiwi_accordion-1_6_0.t3x)
* [Demonstration auf paul-lunow.de](http://www.paul-lunow.de/kiwi-accordion "Pauls Seite")
Danke für die ganzen Mails und die netten Worte! Frohes rumklappen.