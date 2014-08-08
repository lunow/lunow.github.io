---

layout: post
title: "Eine Struktur für große AngularJS Projekte"
abstract: "Alle reden über das neue, großartige Framework das sich zur Zeit als Quasi Standard für große Single Page Applications (SPA) etabliert. Es bringt auch alle Features dafür mit, aber Beispiele findet man nur wenige. Hier kommt meins."
categories: AngularJs
background: marktplatz

---

## Einleitung

Jede Struktur hängt ganz extrem von den Erfahrungen und Vorlieben des Entwicklerteams ab. Man sollte sich einigen, Kompromisse eingehen und eine Struktur finden mit der alle zufrieden sind und sich daran halten.

Vorallem muss ein Teammitglied bestimmt werden das bei neuen Dateien und Ordnern prüft ob sich die Kollegen an die Struktur gehalten haben. Im Idealfall bespricht man es gemeinsam im Sprint Review, alternativ muss es der machen der diesen Artikel gefunden hat (bzw. geschrieben).


## Tools

Ja, von wegen AngularJS eignet sich bestens für SPAs. Wer wirklich große, wiederverwendbare und zukunftssichere Anwendungen entwickeln möchte, kann auf einen ganzen Strauß von nützlichen Werkzeugen zurück greifen.


### NodeJS

Selbst wenn der erfahrene Backend Entwickler unbedingt sein hundertstes PHP Projekt umsetzen möchte und alles andere als "Quatsch" abtut, können wir als Frontend Entwickler die Vorzüge der schönen neuen Welt benutzen.

Also bringen wir ihn dazu keine HTML Seiten mehr auszuliefern sondern eine schicke JSON API. Wir machen den Rest.

NodeJS ist die Grundlage aller hier vorgestellten Tools und wird in erster Linie für den Build Prozess benutzt.


### NPM 

Kommt zum Glück mit NodeJS gemeinsam daher und erlaubt uns die Installation von weiteren Packages und Tools. Damit nicht jeder Entwickler herausfinden muss welche Tools benutzt werden legt man als erstes eine `package.json` an. Entweder von Hand oder mit `npm init` im Wurzelverzeichnis.


### Bower

Das Tool um Frontend Abhängigkeiten, z.B. jQuery und AngularJS, zu laden. Welche Pakete notwendig sind speichert Bower in der Datei `bower.json`. Auch diese lässt sich mit `bower init` anlegen.


### Gulp

Gulp gefällt mir besser als Grunt. Beides sind Buildtools und unterstützen dabei aus einer Entwicklungsversion eine Produktivversion zu generieren. 


## Der Verzeichnisbaum

Um zu wissen was auf euch zukommt, hier ein Überblick über alle Ordner und Dateien. Anschließend dann Erläuterungen.

	/components
	/config
	/dist
	/node_modules
	/server
	/src
	/tests
	.bowerrc
	.foreverignore
	.gitignore
	.jshintrc
	bower.json
	gulpfile.js
	package.json
	readme.md


### /components

Hier leben die Frontend Pakete. Installiert werden sie per `bower`. Damit Bower die Dateien auch in diesem Ordner ablegt muss man ihm das in der Datei `.bowerrc` bei bringen.

	{
		"directory": "components"
	}

Auf gar keinen Fall darf in diesen Dateien irgendwas von Hand angepasst werden. Die Dateien werden auch nicht mit Software Repository eingecheckt, nur die Referenz darauf in der `bower.json` Datei.

Man kann mit `bower install` auch aus einem beliebigen GitHub Repository installieren wenn man eigene Projekte integrieren möchte ohne sie zwangsläufig bei Bower zu veröffentlichen.

Ich würde empfehlen ausschließlich per Bower Frontend Pakete zu laden.


### /config

In diesem Ordner liegen spezialisierte Konfigurationsdateien für das Frontend. Eingecheckt wird eine Datei `frontend-example.js` die alle Grundeinstellungen beinhaltet. Jeder Entwickler muss Initial die Datei in `frontend.js` umbenennen und entsprechend seinem System anpassen.

Zum Beispiel die Adresse der API kann hier gespeichert werden. Außerdem kann man hier eine Umgebungsvariable wie `DEV` oder `PROD` setzen um zu wissen wo man sich befindet.


### /dist

Mein Lieblingsordner. Hier landet die automatisch generierte Anwendung. Absolut Tabu für manuelle Änderungen. Und im Repository hat sie auch nichts zu suchen. Dist dient hier als Abkürzung für `Distribution`.


### /node_modules

Wie der Name schon sagt liegen hier die von `NPM` installierten Pakete. Also Finger und Repository weg.


### /server

Diesen Ordner nutze ich um einen kleinen Entwicklungsserver parat zu haben. Nicht sind die Entwicklungsserver vom PHP Gott erreichbar, manchmal sitzt man im Zug ohne Internet, die Möglichkeiten sind vielfältig.

Der Inhalt hängt stark vom Projekt ab. Zum Aufruf später mehr.


### /src

Und jetzt wird es endlich spannend. Hier lebt die eigentliche Applikation an der wir entwickeln. Folgende Unterordner sind vorhanden:

	/app
	/resources
	/styles
	index.html

#### /src/app

Es bleibt spannend! Im Ordner `app` liegt die reine Applikation, also alle selbst erstellten Javascript Dateien. Weiter aufgeteilt:

	/common
	/modules
	app.js

Die Datei `app.js` initialisiert die ganze Applikation. Diese ist aufgeteilt in `modules` und `common`.

##### /src/app/modules

Grundlegend entscheidet man sich zwischen Typen-Aufteilung und Feature-Aufteilung. Ersteres würde einen Ordner `/controllers` einen Ordner `/models` usw. verlangen. Letzteres, und mein bevorzugter Weg, gliedert die App in Funktionen. Jede Schlüsselfunktion bekommt einen eigenen Ordner.

	/modules/dashboard
	/modules/settings
	/modules/forum
	/modules/content

Je nach Zielsetzung. Ein konkretes Modul kann dann, wiederum je nach Umfang, entscheiden ob es Unterordner mit `controller/` benötigt oder eine Datei reicht.

##### /src/app/common

Viele Dinge, allen vorran die API, wird von mehreren Modulen benutzt. Alles was von mehr als einem Modul genutzt wird bekommt seinen Platz in `/common`. Das könnte so aussehen:

	/common/api
	/common/directives
	/common/translation
	/common/user

#### /src/resources

Hier liegen statische Dateien die sich nicht ändern. Vorallem Bilder, Schriften, Downloads. Alles mögliche was man benötigt.

#### /src/styles

Die Styles sortiert man am besten entsprechend der Module.

	/styles/common
	/styles/modules
	styles.scss

Die `styles.scss` inkludiert alle Dateien aus den Ordnern.


### /test

Hier der Inhalt der am liebsten vernachlässigt wird. Aufgeteilt in Unit Tests und End2End tests. Ob der lieben Vernachlässigung dazu in einem nächsten Eintrag mehr.

	/test/e2e
	/test/unit
	/test/test.conf.e2e.js
	/test/test.conf.js
	/test/test.conf.unit.js

### .gitignore

Das ist eine wichtige Schlüsseldatei. Hier wird bestimmt was eingecheckt wird, und was auf dem Entwicklerrechner bleibt. Grundlegende muss hier natürlich vor(!) dem ersten Commit jeder Ordner angegeben werden der nicht im Repository landen soll.

	dist/
	components/
	node_modules/
	.sass-cache
	config/frontend.js

Auch hier bietet es sich an Kommentare zu hinterlegen und Ordnung zu halten.


### .jshintrc

Das ist eine großartige Datei in der konfiguriert wird nach welchen Regeln die Entwicklungsumgebung Javascript Fehler anzeigen soll. Das muss man sich unbedingt anschauen! Im Team ausmachen und sich daran halten. Damit kann man schon eine ganze Reihe Fehler ausmerzen.


### bower.json

Hier wird festgelegt welche Frontend Pakete installiert werden müssen. Mit `bower install` zieht uns Bower alle angegebenen Pakete.


### 

























