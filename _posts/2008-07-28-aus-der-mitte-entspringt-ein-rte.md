---

layout: post
title: "Aus der Mitte entspringt ein RTE"
abstract: 'Zur Zeit entwickle ich meine erste große TYPO3 Extension die das Aktualisieren der Inhalte für Redakteure und Administratoren vereinfachen soll. Dazu demnächst mehr - erstmal geht es um die **Konfiguration des RTE**. Es ist unglaublich wie viele verschiedene Ansätze es dazu gibt, wie weit sich die Konfiguration verschachteln lässt und wie unglaublich nervig das werden kann.
Aber ich habe einige Ansätze gefunden die funktionieren.'
categories: Entwicklung, TYPO3
redirect_from: "2008/07/28/aus-der-mitte-entspringt-ein-rte/"

---

## TSConfig erweitern
Normalerweise definieren wir den **RTE** über das TSConfig Feld der Root Seite. Da der Benutzer der Extension dies aber nicht tun soll, erledigen wir das über die **ext\_localconf.php** unserer Extension.
Hier ist es Möglich eine Variable, z.B. $rte\_config, dem TSConfig hinzufügen:

    t3lib_extMgm::addPageTSConfig($rte_config);

In meinem konkreten Fall habe ich ein weiteres Tag definiert, _hivar_, welches ich gesondert formatieren möchte. Zur Lösung führte dann endlich folgendes:

    RTE.default {
      ignoreMainStyleOverride = 0
      mainStyleOverride = hivar { color:darkred; usw. usf. }
    }

Hinter **mainStyleOverride** kann man natürlich alles mögliche packen, besonders wichtig ist die zweite Zeile. Ansonsten zeigt es keine Wirkung, egal was man tut!

## Grafiken über CSS im RTE
Möchte man **per CSS Grafiken einbinden**, muss man zwei Ebenen nach oben wechseln um im Rootverzeichnis des Projektes zu landen. Von hieraus am besten straight zur eigenen Extension:

    background-image:url(../../typo3conf/ext/hivars/ext_icon.gif)

## Eigene Tags hinzufügen
Besonders angenehm ist auch die relativ neue Funktion **addToList**, womit ein komplettes überschreiben der vorhandenen Einstellung vermieden wird:

    allowTags:=addToList(hivar)

## Ausblick
Demnächst, oder in dringenden Fällen auf Anfrage, gibt es die gesamte RTE Konfiguration. Davor muss ich noch einige Dinge erweitern, vervollständigen und die Wechselwirkungen mit vorhanden Einstellungen untersuchen. Zum Glück haben wir einige Projekte in denen ich testen kann und die verwirrten Redakteure beobachten wenn irgendwas nicht mehr funktioniert.
Hoffentlich bleibt es nicht für immer so warm...