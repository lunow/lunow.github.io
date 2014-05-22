---

layout: post
title: "Mehrere Domains in einem TYPO3 Projekt verwalten"
abstract: 'Viele kleinen Projekte brauchen keine eigene TYPO3 Installation. Eine einfache Seite, zum Beispiel mit News, ein paar persönlichen Seiten und einem Kontaktformular legt man nach diesem Tutorial an -**ohne Installtion**, neue Datenbank und noch einem Eintrag in der Liste für die Bugfix Updates. Aber **inklusive RealURL**!
Dieses Tutorial bezieht sich auf TYPO3 **Version 4.3**, aber ich vermute es funktioniert in allen neueren Versionen. Los gehts!'
categories: TYPO3
redirect_from: "2009/12/08/mehrere-domains-in-einem-typo3-projekt-verwalten/"

---

## Vorbereitungen
Eine aktuelle TYPO3 Installation mit benötigten Extensions (RealURL vorallem) und ein paar Domains die alle in das gleiche Verzeichnis zeigen. Das reicht.

## Die Seitenstruktur
Direkt unter die Weltkugel kommt die **Root Seite**. Diese beinhaltet ein grundlegendes **Typoscript**, dass sich alle Domains teilen. Es lohnt sich ein einfaches Layout aufzubauen und alle benötigten Marker anzulegen, dann kann man später schnell etwas zeigen. Auch tt\_news, mailformplus, kiwi\_slider oder was auch immer kann man hier schonmal gut **Vorkonfigurieren**.
Unter Root kriegt **jede Domain eine eigene Seite**. Die besitzen folgende Eigenschaften:

* Typ: Verweis - auf erste Unterseite
* Im Menü verbergen
* Seitentitel wie die Domain
* Nicht in sprechende URL aufnehmen
Jeder Seite müssen über **Liste** \> **Neuer Datensatz** \> **System Records** \> **Domäne** die entsprechenden Domains zugewiesen werden. Am besten man legt als erstes die Hauptdomain an, zum Beispiel www.kiwi-service.de - **ohne Umleitung**.
Ein zweiter Datensatz kriegt dann die Domäne kiwi-service.de **mit Umleitung** auf www.kiwi-service.de. Die Checkbox Parameter zur Umleitungs-URL übertragen sollte man anschalten und speichern.

## Typoscript
Auf der Root Seite lohnt es sich ein fertiges Template aufzubauen. Die wichtigesten Marker, wie Menü, Inhalt und Sidebar empfehle ich als **COA Elemente** anzulegen, wobei der Hauptinhalt immer auf Ebene 50 eingebunden wird. Damit kann man auf den Unterseiten einfach die Marker erweitern.
Über Konstanten lässt sich sehr viel steuern. Zum Beispiel die **Start ID für das Menü**. Dazu legt man in den Konstanten einen beliebigen Namen fest:

    menu.special.value = 123

Im Typoscript kann man auf diese Eigenschaften dann über die Syntax **{$NAME}** zugreifen. Vereinfacht könnte das dann so aussehen:

    MENU = COA
    MENU.50 = TMENU
    MENU.50.special.value = {$menu.special.value}

Mit diesem Vorgehen kann dann jede Seite grundlegend über Konstanten steuern. Man sollte es aber nicht übertreiben. Ideal sind die Grundeinstellungen damit man etwas sieht und klicken kann, alle Strukur- und Layoutanpassungen passieren dann gezielt im Extensiontemplate der Seite.
Am wichtigesten ist die Bekanntmachung der **BaseURL**. Entweder über Konstanten oder direkt im Template:

    config.baseURL = http://www.kiwi-service.de

## RealURL
Jetzt zum schönsten Teil (_leichte Ironie_), damit man sich über die netten Domains freuen kann: **RealURL**. Installiert, ohne automatische Konfiguration ist die wichtigste Aufgabe, für jede Domain die richtige **rootpage\_id** zu setzen.
Um sowenig wie möglich doppelt zu schreiben, legt man dafür als erstes eine Standardkonfiguration an:

    $tx_realurl_config = array(
    'init' => array(
    'enableCHashCache' => true,
    'appendMissingSlash' => 'ifNotFile',
    'enableUrlDecodeCache' => true,
    'enableUrlEncodeCache' => true,
    'emptyUrlReturnValue' => '/',
    ),
    'preVars' => array(),
    'postVarSets' => array(
    '_DEFAULT' => array(),
    ),
    'pagePath' => array(
    'type' => 'user',
    'userFunc' => 'EXT:realurl/class.tx_realurl_advanced.php:&tx_realurl_advanced->main',
    'spaceCharacter' => '_',
    'languageGetVar' => 'L',
    'expireDays' => 3,
    ),
    );

Die ist für alle gleich und sollte auch Konfigurationen für tt\_news und andere Extensions beinhalten. Diese wird jetzt jeder **Hauptdomain** zugewiesen.

    $TYPO3_CONF_VARS['EXTCONF']['realurl'] = array(
        'www.alexandrepeschel.de' => $tx_realurl_config,
        'www.kiwi-service.de' => $tx_realurl_config,
    );

Die Aufrufe ohne www kann man vernachlässigen, weil TYPO3 sie weiterleitet. Als nächstes wird für jede Domain die **UID** der entsprechenden TYPO3 Einstiegsseite angegeben. Damit versteht RealURL dann, welcher Teil des Seitenbaums zu welcher Domain gehört.

    $TYPO3_CONF_VARS['EXTCONF']['realurl']['www.kiwi-service.de']['pagePath']['rootpage_id'] = 12;
    $TYPO3_CONF_VARS['EXTCONF']['realurl']['www.alexandrepeschel.de']['pagePath']['rootpage_id'] = 34;

Beim rumprobieren sollte man daran denken, dass man mit dem Leeren vom Frontend-Cache **nicht** den RealURL-Cache löscht! Das passiert über **Info** \> **Root Seite** \> **RealURL-Verwaltung**. Da sind sehr interessante Informationen drin versteckt!

## Fazit
Das war schnell und effektiv! Wer sich das in Aktion ansehen will, geht auf unsere neue Firmenseite [www.kiwi-service.de](http://www.kiwi-service.de "Die neue Agentur aus Berlin") und auf [www.alexandrepeschel.de](http://www.alexandrepeschel.de "Alexandre Peschel"), die Seite meines lieben Kollegen. Im Moment ist das zum Teil im Aufbau und demnächst wird meine persönliche Seite auch dahin umziehen. Aber erst wenn die Seite auf dem neuen Server liegt!
Wenn du Spaß an diesem Tutorial hattest, und Lust hast mit uns noch **viel mehr geilen Scheiß** zu entwickeln, dann bewirb dich bei uns! [Wir suchen Webentwickler mit Ideen und Tatendrang!](http://www.kiwi-service.de/jobs/ "Agentur aus Berlin sucht coole Leute!")