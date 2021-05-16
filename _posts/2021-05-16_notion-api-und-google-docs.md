---

layout: post
title: "Die Notion API mit Google Docs verknüpfen"
abstract: "Endlich ist sie da. Wir haben Jahre darauf gewartet und nun steht die Notion API als Beta Version zur Verfügung. Unsere Inhalte sind frei! Die Möglichkeiten sind unbegrenzt, der Einbindung in alle Tools steht nichts mehr im Wege. Außer der beschränkte Funktionsumfang. Aber für eine Verbindung mit Google Docs reicht es schon."
categories: Notion
background: trioson

---

# Ausgangslage

Notion ist eine Wissensdatenbank, Aufgabenverwaltung, Kalender und alles was man im modernen digitalen Leben noch so braucht. In einem Team haben wir es dafür genutzt, einen langen Text zu schreiben. Wirklich lang. Über 300 Seiten. Aufgeteilt in viele kleine Abschnitte, abgelegt in einer Datenbank, hat es bestens funktioniert für die Erstellung. Aber die Revision und die Weiterverarbeitung soll als Google Drive Dokument geschehen.

Der HTML Export funktioniert, die Daten werden zugänglich, aber mit der API ist es nun wesentlich eleganter und beherschbarer. Also ziehen wir mit einem kleinen Script alle Inhalte raus und schieben sie rüber in ein Google Drive Dokument. Nichts leichter als das!


# Query all entries from a Notion Database

Das Grundprinzip ist in beiden Anwendungen das gleiche: Es wird ein automatisierter User (Notion: Bot, Google: Service Account) erstellt, der, authentifiziert durch einen Token, und eingeladen zu spezifischen Inhalten, Lese- und Schreibrechte erhält.

In Notion wird eine [Integration](https://www.notion.com/my-integrations) angelegt und der Token kopiert. Anschließend eine neue Datenbank anlegen und den eben angelegten Bot über das "Share" Menü der Seite hinzufügen. Für die Ansprache der Datenbank wird die ID benötigt, die steht in der URL:

https://notion.so/[workspace name]/**[DATABASE ID]**

Mit diesen zwei Informationen, lässt sich ein einfaches Script schreiben, welches alle Einträge aus der Datenbank zieht:

	const { Client } = require('@notionhq/client');
	const async = require('async');
	const _ = require('lodash');

	const AUTH_TOKEN = '[YOUR TOKEN HERE]';
	const DATABASE_ID = '[YOUR DATABASE ID HERE]';

	const notion = new Client({ auth: AUTH_TOKEN });

	(async () => {
		let results = [];
		let finished = false;
		
		// QUERY ALL ENTRIES FROM DATABASE
		await async.until(
			//test
			function test(cb) {
				cb(null, finished);
			},

			//iteratee
			async function() {
				const response = await notion.databases.query({ 
					database_id: DATABASE_ID,
					start_cursor: results.length > 0 ? _.last(results).id : undefined,
					sorts: [
						{
							property: 'Sort',
							direction: 'ascending'
						}
					]
				});
				results.push(...response.results);
				finished = !response.has_more;
				
			}
		);
		console.log('all pages have been fetched', results.length);
	})();

Und zack, schon fertig! Nach wenigen Augenblicken befindet sich die gesamte Datenbank für die weitere Verarbeitung in der Variable `results`.

Die Eigenschaft `start_cursor` erlaubt das Abfragen von Datenbanken mit mehr als 100 Einträgen. Entgegen der API Dokumentation habe ich nur über die Angabe einer ID die nächsten Einträge abfragen können.

Die Sortierung verhält sich analog zur Sortierung im UI. Die Eigenschaft `Sort` habe ich manuell angelegt um die Kontrolle über die Reihenfolge zu behalten.

Ich mag lodash und async. Sie machen mir das Leben leichter und den Code lesbarer.


# Get Notion Database Entry Content

Nun liegt eine lange Liste von Einträgen der Datenbank vor. Alle in der Datenbank angelegten Attribute befinden sich darin, es fehlt aber der Seiteninhalt. Dieser besteht aus einer Reihe Blocks und hier ist Vorsicht geboten, denn nicht alle Blocks werden über die API ausgegeben.

	(async () => {

		await async.eachSeries(results, async function(page) {
			const response = await notion.blocks.children.list({ 
				block_id: page.id 
			});
			if(response.has_more) {
				console.log('WARNING!!! Page has more content. Implement the loop you lazy...');
			}

			console.log('page content:', response.results);
		});

	})();

Über die Blocks API werden alle Blöcke der Seite ausgelesen. Hier ist die Abfrage ebenfalls auf 100 Ergebnisse limitiert, bei sehr langen Seiten muss also auch in einer Schleife abgefragt werden.


# Notion Inhalte weiter verarbeiten

Zum Beispiel als Google Drive Dokument. Ich habe also die lange Datenbank mit vielen 100 Textschnippseln. Die werden wie oben ausgelesen und nun zu einem einzigen Google Drive Dokument zusammen gefasst.


## Einen Google Service Account anlegen

Die bequemste Art und Weise ist es einen Service Account anzulegen. Google kann "etwas" mehr als Notion, also nicht ablenken lassen.

1. Ein [neues Projekt](https://console.cloud.google.com/projectcreate) in der Google Cloud Console anlegen.
2. Über den Menüpunkt "APIs und Dienste" > ["Bibliothek"](https://console.cloud.google.com/apis/library) nach Google Docs suchen und die API für das neue Projekt aktivieren.
3. Ebenfalls in "APIs und Dienste" > ["Anmeldedaten"](https://console.cloud.google.com/apis/credentials) oben in der Mitte auf "+ Anmeldedaten erstellen" klicken und "Dienstkonto" auswählen.
4. Dem Wizard folgen, Namen vergeben und am Ende eine JSON Datei mit den Zugangsdaten herunterladen.
5. Diese Datei lege ich als `creds.json` ab (nicht vergessen in der .gitignore hinzuzufügen, wir checken niemals Zugangsdaten in Git ein!)

Nun muss der eben angelegte Account noch einem Dokument zugewiesen werden. Dafür [ein neues Dokument](https://docs.new/) anlegen und über "Share" den eben erstellten Service Account einladen. Dieser muss nicht per E-Mail darüber informiert werden.


## Mit Node.js den Service Account nutzen

Inzwischen ist es endlich super einfach auf die Google API zuzugreifen.

	const docs = require("@googleapis/docs");
	const auth = new docs.auth.GoogleAuth({
		keyFilename: 'creds.json',
		scopes: ['https://www.googleapis.com/auth/documents']
	});
	const authClient = await auth.getClient();

	const client = await docs.docs({
		version: 'v1',
		auth: authClient
	});

	const DOCUMENT_ID = '[INSERT YOUR ID HERE]';

Die `creds.json` Datei liegt im Root Verzeichnis, die Google Docs API muss über die Console freigeschaltet sein und die ID steht wie bei Notion in der URL.


## In ein Google Drive Dokument schreiben

Das hat mich etwas mehr Zeit gekostet. Die Dokumentation ist sehr umfangreich und es ist nicht immer einfach den passenden Teil in der richtigen Programmiersprache zu finden. 

Was hilft ist das Node Modul selbst, niemand hält Dich davon ab im `node_modules` Ordner den Code anzuschauen. In VS Code lässt sich alles mit der rechten Maustatste anklicken um mit "Goto Implementation" an die entsprechende Stelle zu springen. Der Google Code ist einigermaßen selbsterklärend und dokumentiert!

Letztendlich ist das hinzufügen eines Absatzes aber leicht. Über ein `batchUpdate` wird eine Reihe an Befehlen an das Doc gesendet.

	(async => () {

		const updateResponse = await client.documents.batchUpdate({
			documentId: DOCUMENT_ID,
			requestBody: {
				requests: [
					{
						insertText: {
							endOfSegmentLocation: {},
							text: 'Hello World!'
						}
					},
					{
						insertPageBreak: {
							endOfSegmentLocation: {}
						}
					}
				]
			}
		});
		console.log('done!', updateResponse);

	})();

Mit diesem Schnipsel wird bei jedem Aufruf der Absatz "Hello World!" und ein Seitenumbruch hinzugefügt. Nun fehlen nur noch ein paar Schleifen um die beiden Teile miteinander zu verbinden. Viel Spaß!


# Fazit

Die Notion API ist ein lang ersehnter und großartiger Schritt um die so schön generierten Inhalte weiter zu nutzen. Sie befindet sich in der Public Beta und ist noch sehr eingeschränkt. Einige Erweiterungen und Änderungen werden sicher kommen. Legt man also ein Script wie oben beschrieben irgendwo in die Cloud und lässt es dort vor sich hin prozessieren, sollte es eine gute Fehlerrobustheit mitbringen.

Das Format der Inhalte ist etwas gewöhnungsbedürftig und tief verschachtelt, hier bietet sich der Node Debugger an um sich in einer UI durchzuklicken.

Ich freue mich sehr über dieses neue Werkzeug. Unsere Inhalte sind frei und die Automatisierung kann in großen Schritten weiter gehen. Endlich!