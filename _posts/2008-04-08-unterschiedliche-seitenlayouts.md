---

layout: post
title: "Unterschiedliche Seitenlayouts"
abstract: ''
categories: TYPO3
redirect_from: "2008/04/08/unterschiedliche-seitenlayouts/"

---

In dem aktuellen Typo3 Projekt gibt es drei verschiedene Seitentypen. Diese Typen unterschieden sich durch die größe des Headerbildes und die Darstellung der Inhaltsboxen. Der Redakteur soll beim anlegen der Seiten ein Layout wählen, der Rest passiert von allein.
(Soweit die Therorie von uns Programmierern, ich bin gespannt ob die Redakteure dieses Minifeld zur Layoutauswahl finden...)
Wie auch immer. **Die technische Umsetzung**: Über die Seiteneigenschaften in Typo3 bekommt der Redaktuer folgende Auswahl. Die Labels werden im TSconfig Feld der Rootseite angepasst und sehen so aus:

    # Layout der Seiteneigenschaften
    TCEFORM.pages {
    layout.altLabels.0 = Standard
    layout.altLabels.1 = Startseite groß
    layout.altLabels.2 = Startseite klein
    layout.altLabels.3 = Extra
    }

Im Template fehlt dann nur noch die Reaktion auf die unterschiedlichen Seitenlayouts. Damit wir mit möglichst wenig HTML Code arbeiten, erweitern wir je nach Layout den Bodytag mit einer spezifischen Klasse. Über diese wird dann per CSS der Rest erledigt.

    # Layout: Startpage klein
    [globalVar=TSFE:page|layout=2]
    page.bodyTag = <body class="small">
    [global]
    
    # Layout: Extraseite - was auch immer das wird...
    [globalVar=TSFE:page|layout=3]
    page.bodyTag = <body class="extra">
    [global]

Zu beachten bleibt die Tatsache das die \[global\] Anweisungen nicht im Fluss auftauchen dürfen, sondern auf der untersten Ebene, aber wem erzähle ich das :)