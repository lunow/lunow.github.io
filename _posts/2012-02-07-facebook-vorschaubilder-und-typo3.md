---

layout: post
title: "Facebook Vorschaubilder und TYPO3"
abstract: 'Wenn man bei Facebook eine Seite teilt, dann sucht Facebook nach einem **passenden Thumbnail**. Der geneigte Entwickler gibt dem Spider einen Hinweis über das `<link rel="image_src">` Tag.
Soweit so einfach. Das kann man natürlich im Template verankern und das Logo hinterlegen, aber was passiert wenn **tt_news Beiträge** geteilt werden? Die besitzen meistens auch ein Bild was wesentlich aussagekräftiger ist als das normale Seitenlogo.

Dieser Artikel erklärt wie ein dynamisches `link`-Tag gebaut wird um in allen Lebenslagen gut zu arbeiten.

'
categories: TYPO3
redirect_from: "2012/02/07/facebook-vorschaubilder-und-typo3/"

---



## Standardbild

Wenn man eine beliebige Seite teilt, dann wird das Logo der Seite angeboten. Nichts leichter als das mit ein paar Zeilen Typoscript. Damit es später einfach ersetzt werden kann, sollte man folgende Struktur übernehmen.

	page.headerData.20 = TEXT
	page.headerData.20.value = http://meine-domain.de/fileadmin/template/img/logo.png
	page.headerData.20.wrap = <img rel="image_src" href="|" />

Damit wird das Logo aus dem Fileadmin Ordner hinterlegt, Facebook nimmt es sich automatisch raus. Zur Sicherheit gebe ich die absolute URL an. Variabler bleibt es natürlich wenn man die Baseurl in eine Konstante verlagert und einbindet, aber zum angucken reichts.


## Mit tt_news überschreiben

Teilt man die Single Ansicht eines tt_news Eintrags soll das ausgewählte Newsbild angezeigt werden. Dazu legt man ein `Extensiontemplate` auf der entsprechenden Seite an und überschreibt die Eigenschaft in `page.headerData.20.value` mit dem Wert aus dem Eintrag.

Das Problem ist, der Redakteur kann beliebig viele Bilder mit dem tt_news Eintrag verknüpfen. Für Facebook soll nur das erste angegeben werden. Was muss getan werden?

1. Aktuellen tt_news Eintrag auslesen
1. Das Feld `image` abfragen
1. Inhalte anhand vom Komma `,` auseinander schneiden
1. Ersten Wert auswählen
1. Absolute URL zum Upload erzeugen

Und Typoscript wäre nicht Typoscript wenn das nicht "ohne Problem" möglich wäre. Wenn man weiß wie:

	page.headerData.20 = RECORDS
	page.headerData.20 {
		source = {GPvar:tx_ttnews|tt_news}
		source.insertData = 1
		tables = tt_news
		conf.tt_news >
		conf.tt_news = TEXT
		conf.tt_news.field = image
		conf.tt_news.split {
			token = ,
			cObjNum = 1
			returnKey = 0
		}
		conf.tt_news.wrap = http://meine-domain.de/uploads/pics/|
	}

Über das Element `RECORDS` wird eine Datenbankabfrage gestartet. Als Quelle wird die übergebene News ID benutzt. Anschließend wird mit Hilfe vom `split` Befehl das Ergebnis auseinander geschnitten und das erste Ergebnis zurück gegeben (`returnKey`).


## Fazit

Wenn man weiß wie, ist Typoscript eine sehr mächtige und umfassende Sprache um alle möglichen und unmöglichen Aufgaben zu lösen.

Nach vielen Stunden der Übung kommt man auch irgendwann dahinter. Nur nicht aufgeben!
	