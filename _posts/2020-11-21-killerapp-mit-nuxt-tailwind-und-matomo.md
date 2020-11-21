---

layout: post
title: "Killerapp mit Nuxt, Tailwind und Matomo"
abstract: "Wir brauchen immer wieder schnelle und innovative Webseiten. Als Landingpage, Kampagnenseite oder Visistenkarte. Die einen wählen einen fertigen Webseiten-Baukasten wie Wix. Die anderen brauchen mehr Kontrolle und bauen sich eine wunderschöne statische Seite, wie in diesem Post beschrieben."
categories: Killerapp
background: beethoven

---

In diesem Post möchte ich drei Punkte betrachten, die in jedem Web Projekt eine zentrale Rolle einnehmen: Das Framework, das Styling und das Tracking. Für ein erfolgreiches Projekt fehlen noch Themen wie die Verwaltung der Inhalte, das Deployment und Marketing. Beginnen wir heute mit dem Anfang.


## Das Framework: NuxtJS

VueJS, React und Angular sind die großen Drei, bei denen man sich stets fragt welchen Javascript Haufen man wählen sollte, um sich die Arbeit zu erleichtern. Grundsätzlich würde ich immer sagen: Wähle jenes, mit dem Du Dich am besten auskennst.

Aber hin und wieder muss auch etwas neues her - um Fit im Kopf zu bleiben und neue Lösungen zu lernen. Bei VueJS und React fehlten mir bisher immer der ganzheitliche Ansatz, nach der Auswahl eines Webframeworks möchte ich gern alle Werkzeuge haben um die erste Version der Anwendung fertig zu stellen.

Deshalb habe ich die letzten Jahre sehr viel mit Angular gearbeitet und nur verhalten auf React und VueJS geschielt. Das ändert sich jetzt mit NuxtJS.

Nuxt reichert Vue um eine komplette Webframework Lösung an, die Out of the Box sogar noch mehr mitbringt als Angular, super eingänig ist und vorallem, für mich das Killer-Argument, genau das tut was ich möchte! Ohne eine einzige Konfiguration.

Nach der erfolgreichen [Installation](https://nuxtjs.org/guide/installation/) wird im Projekte-Ordner per Terminal ein neues Projekt angelegt:

	npx create-nuxt-app killer

Dieser Befehl führt durch einen Konfigurator der die wichtigsten Dinge Abfragt:

- TailwindCSS als UI Framework auswählen
- Rendering Mode: Universal
- Deployment Target: Static

Für mich spannend ist das Deployment target. Mit der Option `static` setzt man Nxut in den Modus ein Set aus HTML, JS und CSS Dateien zu generieren, die anschließend nur noch auf einen beliebigen Webserver gelegt werden müssen und sofort funktionieren. Perfekt für das schnelle ausprobieren unserer Killerapp!

	cd killer
	nuxt

Sind die beiden Befehle um in das neue Verzeichnis zu wechseln, und den Development Server zu starten. Los gehts!


## Das Styling: TailwindCSS

Tailwind verhält sich zu CSS in etwa so wie jQuery zu Javascript. Ohne ein Verständnis von CSS wird es sehr schwierig das meiste aus Tailwind herauszuholen. Hat man dieses Wissen drauf, wird Tailwind zu einem genial mächtigen Werkzeug, welches erlaubt eine komplette Killerapp zu stylen, ohne eine einzige Zeile CSS zu schreiben.

Und mit Version 2.0 und dem [bombastischsten Intro Video](https://blog.tailwindcss.com/tailwindcss-v2) für ein Web Framework, das ich je gesehen habe, kommen fantastische neue Funktionen dazu. Kratzen wir mal ganz sanft an der Oberfläche.

Der Grundgedanke sind "Utility classes". Tailwind bringt Megabyte weise Klassendefinitionen mit, die dann im HTML zur Verfügung stehen. Aber keine Sorge, Tailwind ist schon so eingestellt, dass nicht verwendete Klassen nicht in der produktiven App bleiben.

Anstatt den guten alten `<div class="wrap">` in den Code zu hauen (dicht gefolgt von `inner-wrap` und `outer-wrap` und irgendwann `wrap-products` und vielen, vielen weiteren), und eine schnell wachsende CSS Sammlung zu verwalten wird jetzt wieder im HTML gestyled:

	<div class="display-flex full-width min-h-full">

Man muss die neuen Bezeichnungen lernen. Keine Frage, aber Tailwind hat eine großartige [Dokumentation](https://tailwindcss.com/docs) mit einer noch besseren Suchfunktion die per `CMD + K` (analog zu Slack, btw) auch nach CSS Eigenschaften suchen lässt.

Für [VS Code stehen sehr gute Extensions bereit](https://tailwindcss.com/docs/intellisense), die ebenfalls Zugriff auf die Doku geben und eine automatische Vervollständigung beim Tippen anbieten.

Das Killer-Argument für Tailwind: Das CSS wird keine unübersichtliche Wüste, in der ständig unerwartete Seiteneffekte auftreten, weil die Kollegin die Wrapper-Klassen anders benutzt als man selbst. Generische Hilfskonstrukte sind direkt im HTML Code definiert und wiederkehrende Elemente können weiter in einer zentralen CSS Datei verwaltet werden.

	.button {
		@apply
			block
			bg-orange
			text-white
			cursor-pointer
		;
	}

Aber Moment, ist dies im Sinne des Erfinders? Die Antwort lautet: Nein. Dieses `@apply` ist eine Notlösung, um Menschen die unbedingt Stylesheets schreiben wollen, einen einfacheren Einstieg in Tailwind zu ermöglichen.

Die [Nuxt Components](https://github.com/nuxt/components) ermöglichen es, sauber gekapselte Elemente zu definieren, die an nur einer einzigen Stelle gestaltet werden, im HTML. Ein einfacher Button befindet sich in der Datei `components/superButton.vue` und könnte so aussehen:

	<template>
		<button class="block bg-orange text-white cursor-pointer">
			<slot></slot>
		</button>
	</template>

Das wars schon! Nuxt erkennt die neue Datei, lädt den Dev Server neu und bindet die Componente automatisch in die WebApp ein. Die Vue Component `<slot>` stellt den Inhalt dar, der im HTML angegeben wird.

	<super-button>Klick mich an</super-button>

Wird dann in der App gerendert als

	<button class="block bg-orange text-white cursor-pointer">Klick mich an</button>

Und da es sich um eine statische Seite handelt, die einmal auf unserem Computer zusammen gebaut wird, und dann als ganzes hochgeladen wird, muss sich auch niemand um die Performance sorgen machen. Jedenfalls nicht um die, zu viele Components definiert zu haben.

Tailwind bringt auch alles mit um hervorrangende responsive Anwendungen zu bauen.


## Das Tacking: Matomo

Die Cookie Consent Banner haben überhand genommen. Die erwartete Klagewelle ist zwar ausgeblieben, vielleicht weil jede einzelne Seite im vorauseilenden Gehorsam die Zustimmung zu aller möglichen Erlaubnissen abfragt. Ehr aber, weil nie die Idee der Verordnung war, alle kleinen Seiten kaputt zu machen.

Fun fact am Rande: In meiner Funktion als Berater und Mentor habe ich ettliche Projekte gesehen, in denen mehrere Tracking Tools mit einer langen Consent Liste vorbildlich eingebunden wurden, aber die Daten von niemandem benutzt wurden. "Wir wollen eigentlich nur wissen wie viele Leute auf die Seite gehen, und wie viele sich unser White Paper dann herunter laden". Und dafür gebt ihr Google Zugriff auf unsere persönlichen Daten und erlaubt das Tracking durch das ganze Internet? Das geht besser! 

[Matomo](https://matomo.org/) (ehemals Piwik) ist schon vor vielen Jahren als OpenSource Projekt gestartet um diese Frage zu beantworten. Auf Wunsch ganz ohne das Aufzeichnen von personenbezogenen Daten.

Die Einbindung erfolgt über [nuxt-matomo](https://github.com/pimlie/nuxt-matomo) mit dem Befehl

	npm install --save nuxt-matomo

Anschließend muss das setzen der Cookies in der Konfiguration deaktiviert werden. 

	modules: [
    	['nuxt-matomo', { 
			matomoUrl: '//matomo.example.com/', 
			siteId: 1 
			cookies: false,
			debug: true
		}],
  	]
	
Per default trackt Matomo nichts solang sich die Anwendung im Development Zustand befindet, was gut ist, außer man möchte das Tracking testen. Also setze ich hier `debug: true` um etwas zu sehen.

Die Integration stellt das `$matomo` Objekt automatisch in den Vue Componenten bereit. Damit lassen sich dann alle API Funktionen nutzen. Zum Beispiel wenn ein Button geklickt wurde.

	export default {
		methods: {
			onClick() {
				// do something
				// ...

				// track something
				this.$matomo.trackEvent('Interaction', 'clicked', 'button', 12)
			}
		}
	}

Es gibt eine [Liste der API Methoden](https://github.com/pimlie/nuxt-matomo/blob/c313458a23146bed5670f00ba602abc17787cf0e/lib/api-methods-list.json) - wenn die zusammen mit dem Keyword `matomo` in die Google Suche geworfen werden, kommt man schnell auf die passende Erklärung.

Was ich nicht so schnell gefunden habe, ist der Umgang mit dem Event Value. Im obigen Beispiel die 12. Ich wollte Prozentzahlen tracken (0 - 1), aber anscheinend kann Matomo nur ganze Zahlen verarbeiten.

	this.$matomo.trackEvent('Interaction', 'clicked', 'button', Math.round(0.12*100))

Der Vollständigkeit sei gesagt, dass es noch ein paar mehr Schritte braucht um der Datenschutzgrundverordnung gerecht zu werden, [nachzulesen direkt bei Matomo](https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/). Außerdem bin ich kein Jurist, und dieser Blog selbstverständlich keine rechtsverbindliche Beratung.

Bleiben wir lieber bei der Entwicklung. Sind die Buttons wie oben beschrieben ordentlich gekapselt, lässt sich das Tracking natürlich wunderbar in diese generische Komponente einbauen und automatisch wirft jeder Button bei Klick ein Event in unser schönes Tracking Tool.


## Und online

Alle drei Tools bringen ausführliche Dokumentationen mit, die einen guten Einstieg bieten. Hat man seine erste Killerapp zusammen gestellt, muss sie nur noch online gestellt werden. Das Thema Deploy ist einen eigenen Eintrag wert, deshalb hier die einfachste Variante.

	nuxt generate

Dieser Befehl erzeugt eine statische und gut optimierte Seite. Das neue Verzeichnis `dist` muss dann nur auf einen Server gelegt werden. Dieses "nur" beinhaltet natürlich viel Raum für Schwierigkeiten. Zwei haben mich aufgehalten.


### Nichts wird online angezeigt

Befindet sich die Anwendung in einem Unterordner (z.B. www.lun.io/killerapp), dann muss dies in der `nuxt.config.js` Datei eingetragen werden:

	export default {
		router: {
			base: '/killerapp
		}
	}

Aber vorsicht! Nun ist die Development Version ebenfalls in diesem Ordner erreichbar (also localhost:800/killerapp).


### Angezeigt, aber die Umlaute sind kaputt

Ich dachte wirklich, dieses Problem sehe ich nie wieder. Stellt sich raus, ich muss den eigentlich automatisch gesetzten Standard nochmal manuell, ebenfalls in der `nuxt.config.js` Datei, setzen.

	export default {
		head: {
			htmlAttrs: { 
				lang: 'de' 
			},
			meta: [
				{ charset: 'utf-8' }
			]
		}
	}

Das ist auch der Platz in dem die anderen wichtigen HTML Konfigurationen gesetzt werden.


## Fazit

Drei großartige Werkzeuge um in wenigen Stunden ein zukunftsfähiges MVP zu bauen. Wie wäre es, dieses mit dem brandneuen [Capacitor](https://capacitorjs.com/) von Ionic in eine iOS und Android App zu verpacken. Oder mit [Electron](https://www.electronjs.org/) in eine Desktop Anwendung.

Nuxt bringt auch noch eine Reihe Erweiterungen mit, zum Beispiel um einen Blog wie diesen zu bauen mit [Nuxt Content](https://content.nuxtjs.org/). Oder man schaut sich die anderen [2005 Projekte](https://github.com/search?q=topic%3Anuxtjs+fork%3Atrue) auf Github zum Thema nuxtjs an.

Es gibt noch viel zu tun. Schick Deine Frage oder schreib einen Kommentare für meine Motivation weitere Einträge zum Thema zu verfassen.