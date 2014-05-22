---

layout: post
title: "SEO und TYPO3"
abstract: 'Da wir ein paar sehr schöne TYPO3 Seiten realisiert haben die jetzt im Internet auch gut gefunden werden sollen, geht es in dieser Ausgabe um das **Optimieren einer TYPO3 Internetseite** mit möglichst wenig Aufwand und schnellen Erfolgen.
Vorweg bleibt zu sagen das neben der **On-Site-Optimierung** die Off-Site-Optimierung eine bedeutende Rolle spielt. Aber die ist wie Rudern gegen den Strom. Wenn man nachlässt wird man zurück getrieben. Irgendwer hat das gesagt, ich weiß leider nicht mehr wer, aber es stimmt.
Für dauerhafte, erfolgreiche Suchmaschinenoptimierung muss man also wohl oder übel in die Taschen greifen und [eine gute Agentur](http://www.apeunit.com "Ich würde sogar sagen die beste Agentur") damit beauftragen. Für das kleine Budget gibt es aber auch schon einige Tricks.'
categories: TYPO3
redirect_from: "2011/10/10/seo-und-typo3/"

---

## RealURL oder CoolURI
Sprechende Urls sind natürlich wahnsinnig wichtig und die Grundlage für jede Optimierung. Anleitungen und Tutorials bieten die Extension Manuals oder Google mehr als genug.
Da mich RealURL in der Vergangenheit schon öfters zur Weißglut gebracht hat bevorzuge ich für überschaubare Internetauftritte im Moment [CoolURI](http://typo3.org/extensions/repository/view/cooluri/current/).
CoolURI hat seine komplette Konfiguration in einer XML Datei. Die Grundlage dafür befindet sich in \[pre\]typo3conf/ext/cooluri/test/CoolUriConf.xml\[/pre\] und muss von dort in den \[pre\]typo3conf/\[/pre\] Ordner geschoben werden. Die Konfiguration ist recht überschaubar, mit Kommentaren versehen und ordentlich voreingestellt.
Auf Root Ebene muss die von TYPO3 mitgelieferte \[pre\]\_.htacces\[/pre\] Datei in \[pre\].htaccess\[/pre\] umbenannt werden. Anschließend im Typoscript die Extension aktivieren:

    config.baseURL = http://www.deineseite.de/
    config.tx_cooluri_enable = 1
    config.redirectOldLinksToNew = 1

Anschließend Cache leeren und das Frontend neuladen - fertig. Wunderschöne Urls.

## Google Sitemap
Extension [mc\_googlesitemap](http://typo3.org/extensions/repository/view/mc_googlesitemap/current/) installieren. Nach dem Import und dem Update der Datenbank muss eine neue Seite angelegt werden und darauf ein Inhaltselement "Menü / Sitemap".
Ist dieses ausgewählt wählt man den Typ \[pre\]Google Sitemap für Seiten\[/pre\] und die Root Seite als Ausgangspunkt. So einfach! Über Google Webmaster Tools kann man die Sitemap überprüfen lassen und direkt in das hungrige Spidermaul vom Suchmaschinenriesen werfen.

## Google Webmaster Tools
Um sich vom allmächtigen Internetriesen helfen zu lassen, sollte man sich bei den Google Webmaster Tools anmelden und die eigene Seite hinzufügen. Hier findet man nützliche Informationen über Fehler, Suchanfragen und Spiderresultate.
[https://www.google.com/webmasters/tools/](https://www.google.com/webmasters/tools/)

## Metatags
Diverse Quellen behaupten zwar, dass Google die Daten nicht mehr zum Indexieren benutzt, trotzdem erscheinen sie als Beschreibungstext in den Suchergebnissen oder wenn die Seite bei Facebook geteilt wird. Um dem Redakteur ein bearbeiten zu ermöglichen stehen schon Felder in den Seiteneigenschaften bereit. Man muss diese nur mit ein paar Zeilen Typoscript in die HTML Ausgabe bringen:

    page.meta.keywords.field = keywords
    page.meta.description.field = description

## Seitentitel
Je weiter vorne ein Begriff steht umso höher wird die Wichtigkeit von jenem eingeschätzt. In TYPO3 gibt es zwei Wege das Standardverhalten im Seitentitel "Projektname: Seitenname" zu ändern.
Entweder über eine Typoscript Eigenschaft:

    config.pageTitleFirst = 1

Oder in dem man die Standardausgabe unterdrückt und das Title-Tag selbst generiert:

    config.noPageTitle = 2
    page.headerData.10 = TEXT
    page.headerData.10.field = subtitle // title
    page.headerData.10.wrap = <title>| &nbsp; - deinedomain.com</title>

Um den Seitentitel mit Keywords zu füllen und das Menü trotzdem nicht explodieren zu lassen findet man im Backend die Felder "Page Title" und "Alternative Navigation Title". Ersteres wird im Title Tag ausgegeben, letzteres im Menü benutzt.
RealURL bietet darüber hinaus noch das Feld "Speaking URL path Segment" an über den die URL beeinflusst wurden kann.

## Fazit
**Suchmaschinenoptimierung** ist ein langes und aufwendiges Thema. [Wir](http://www.apeunit.com "Die Internetagentur aus Berlin") verkaufen immer "suchmaschinenfreundliche" Webseiten. Neben der Umsetzung der oben genannten Tipps ist eine saubere HTML Struktur und eine bestätigte Fehlerfreiheit durch den W3C Validator unverzichtbar.
Neben dem Sammeln von Links von Außen, welche Maßnahmen ergreift ihr um eure TYPO3 Projekte weiter nach vorne zu bringen?