---

layout: post
title: "Leute, baut APIs"
abstract: 'Der Begriff **API** tobt seit Jahren durch das Internet. Facebook hat eine, Twitter, Youtube und noch viele weitere mehr. Eine Schnittstelle über die auf die Inhalte der jeweiligen Plattform automatisch zugegriffen werden kann.
Zum Beispiel liefert Facebook ein maschinenlesbares Format des eigenen Profil wenn man es über die sogenannte Open Graph API aufruft: [http://graph.facebook.com/paul.lunow](http://graph.facebook.com/paul.lunow).

Schön und gut, möchte der ein oder andere CEO da sagen, aber für meine Firma brauche ich sowas nicht. Falsch! Und dieser Artikel erklärt auch warum.
'
categories: Allgemein
redirect_from: "2012/07/22/leute-baut-apis/"

---


## Was ist eine API

API steht für `Application Programming Interface` und beschreibt eine Technik mit deren Hilfe Computer untereinander kommunizieren können. Das bedeutet ein Programm schickt eine Nachricht: "Hallo, wer bist du?" und der Empfänger antwortet: "Ich bin Facebook und funktioniere einwandfrei".

Eine API besteht dabei immer aus einer eindeutigen Adresse und einer definierten Struktur, wie auch die Anfragen und ihre Antworten. Die Facebook API ist über die Adresse `graph.facebook.com` erreichbar und akzeptiert einen Benutzernamen nach dem Slash.

Für die eigene Firma kann man sich da alles beliebige ausdenken: Die API Adresse lautet `http://api.meine-firma.de` und erlaubt folgende Anfrage:

	{
		action: 'list_trending_topics',
		limit: 2
	}
	
In diesem Beispiel handelt es sich um ein JSON Objekt. JSON beschreibt eine Notation zur Übertragung von Daten. Der Server unter der Adresse verarbeitet die Anfrage und liefert eine Antwort zurück:

	{
		success: true,
		items: [
			{
				title: 'Leute, baut APIs',
				source: 'blog',
				url: 'http://www.interaktionsdesigner.de'
			},
			{
				title: 'Facebook hacking made easy',
				source: 'forum',
				url: 'http://gulli.com'
			}
		]
	}

Der Server antwortet immer in der gleichen Form, sodass mit wenigen Zeilen Code eine Seite gebaut werden kann auf der die Antwort der API dargestellt wird.

Zum Beispiel betreiben Sie eine Firma die ein Portal anbietet um Privatpersonen das ausleihen von technischen Geräten erleichtert. Dafür könnte eine API die Möglichkeit geben den eigenen Standort zu senden:

	{
		location: '13.4352345;61.2342342'
	}

Ihr Server sucht in der Datenbank nach Einträgen in der Nähe und gibt diese aus:

	{
		success: true,
		response: [
			{
				title: 'Bohrmaschine',
				distance: '20 m'
			},
			{
				title: 'Mixer',
				distance: '50 m'
			},
		]
	}

Die Inhalte könnte ein findiger Programmierer mit Twitter Nachrichten kombinieren und eine interaktive Berlinkarte erstellen. Und schon ist Ihre Firma teil einer hippen viral verbreiteten Informationssammlung.

Aber nicht nur das! Durch die genaue Definition der Formate kann man sie beliebig weiter verarbeiteten. Zum Beispiel in einer iPhone App oder in einer Samsung Smart TV Applikation.

Die Schnittstelle bietet dabei den Kommunikationskanal zwischen Ihren Nutzern und Ihrem Service.


## Schön und gut, brauche ich aber nicht

Falsch! Wer jetzt denkt: "Eine API braucht vielleicht Twitter, aber meine Daten sind super geheim und mein USP und ich werde ein Teufel tun die der ganzen Welt zur Verfügung zu stellen" - dem fehlt eine wichtige Information: API heißt nicht zwangsläufig öffentlich. Die Schnittstelle kann ohne Probleme mit einem Passwort gesichert werden, sodass nur autorisierte Benutzer Zugriff haben. Die Sicherung geht sogar so weit, dass nur der eigene Server darauf zugreifen darf. Die Daten bleiben also auf jeden Fall in Ihrer Hand und gelangen nicht ungewollt nach außen.

Zum Beispiel kann ein innovatives Medienbeobachtungsunternehmen Ihre Daten per API zur Verfügung stellen. Es gibt die Möglichkeit das auftreten des eigenen Firmennamen in den Medien zu verfolgen:

	{ name: 'Angela Merkel' }

Die Antwort vom Server sieht vielleicht so aus:

	{ tv: 12131, twitter: 242342, blogs: 93212, date: '2012-07-21' }

Die Zahlen wurden mit geheimer und innovativer Technik erhoben, Zugriff auf die API erhält nur wer auf dem gleichen Server arbeitet. Sprich das Webinterface. Und das erzeugt aus den rohen Zahlen schöne Diagramme. Wenn eine iPhone App realisiert werden soll muss am Server nichts geändert werden. Nur der Teil der die Anfragen an die API schickt.

Wer jetzt immer noch denkt, man könnte sich den API Quatsch damit ja auch sparen, den möchte ich mit den folgenden Punkten vom Gegenteil überzeugen.


## Saubere Trennung zwischen Front- und Backend

Jede Applikation teilt sich in zwei Bereiche auf. Der eine kümmert sich um die Darstellung und die Benutzerinteraktion (das Frontend) und der andere um die Verarbeitung und das Speichern der Daten (das Backend). In den meisten Fällen herrscht zwischen den Teilen aber leider keine saubere Trennung.

Leider? Gute Backend-Programmierer verstehen sich hervorragend darauf mit Daten effektiv und effizient umzugehen. Das sieht man dann am Frontend, das funktioniert und wahnsinnig effektiv ist, aber keine Spur von Usability oder Eleganz zeigt (man Vergleiche das Online Banking Interface, z.B. der Volksbanken - uha).

Auf der anderen Seite steht der Webentwickler als Frontend Programmierer mit einem grandiosen Interface in der Präsentation und jeder Klick dauert spürbare Sekunden, weil das von ihm entwickelte Backendsystem nicht effizient arbeitet. Von Sicherheitslücken und Erweiterbarkeit möchte ich gar nicht erst anfangen (zum Glück habe ich keine Ahnung wie das bei der Volksbank aussieht, aber ich gehe mal davon aus das es toll ist).

Logische Konsequenz: Trennen Sie beide Bereiche! Die Programmierer stellen eine API zur Verfügung die schnell und effektiv ist und die Webentwickler bauen darauf ein Interface auf das sich gewaschen hat!


## Auslagern von Projekten

Nachdem die Trennung erfolgt ist, ist es kein Problem Teile der eigenen Anwendung auszulagern. Wenn man nur einen Profi auf einer Seite im Team hat, lässt man ihn eine API spezifizieren und beauftragt eine Agentur oder einen Subunternehmer im Ausland mit der Entwicklung der anderen Seite.

Besser ist es natürlich sowohl Front- als auch Backendentwickler Vorort zu haben und gemeinsam mit ihnen Pakete zu schnüren, die ausgelagert werden können. Ein perfektes Beispiel ist eine Smartphone App.

Während Ihre Entwickler mit der Implementierung der neusten Features voll ausgelastet sind, Ihre Investoren aber gerne eine App sehen würden, stellen sie einem Dienstleister eine API und einen Wireframe zur Verfügung und beauftragen das App!

Die Auftragnehmer müssen nicht mal auf Ihre Livedaten zugreifen, sofern sie die genaue Spezifikation haben.


## Wettbewerbsvorteil

Planen Sie Ihre API für sich selbst. Lassen Sie niemanden ran. Aber wenn Sie wirklich groß und erfolgreich werden wollen, müssen Sie sich öffnen. Steht eine solide API die Sie seit Jahren im Einsatz haben, ist das auch überhaupt kein Problem.

Es muss ja keine weltweite Veröffentlichung sein, aber lizenzierte Subunternehmer könnten einen Zugang erhalten und Ihr Produkt in eine vollkommen neue Dienstleistung verpacken.

Bleiben wir beim Beispiel meiner lieben Bank, der Berliner Volksbank: Ich habe ein Geschäftskonto - keine Überraschung. Und ich habe ein kleines Buchhaltungsscript geschrieben das auf elegante Art und Weise meine Rechnungen erstellt, verwaltet und verschickt.

Der einzige manuelle Arbeitsschritt ist der Login im Bankinterface, Geldeingänge prüfen, Tabwechsel, und die entsprechende Zeile im Buchhaltungsprogramm suchen und als "bezahlt" markieren.

Auf die Nachfrage bei der Bank machte mein Berater natürlich ein langes Gesicht, aber nur mal angenommen die Antwort wäre gewesen: "Na klar, registrieren Sie sich hier und Sie erhalten einen API Schlüssel", dann könnte ich mein Konto damit verknüpfen und würde vor Begeisterung allen meinen Bekannten davon erzählen.

Der ein oder andere würde die Software ebenfalls einsetzen (okay, es tun auch so schon einige, aber es könnten mehr sein) und wiederum weiter erzählen. Grundvoraussetzung: Ein Konto bei der Berliner Volksbank.

Und schon eröffnet sich ein Marketingkanal mit dem sie überhaupt nicht gerechnet haben!

Durch die Registrierung und der Kontrolle des Zugriffs haben Sie auch die Möglichkeit mitzuverfolgen welcher Benutzer wie intensiv Ihre Schnittstelle nutzt. Damit könnte die Bank dann zu mir kommen und sagen: "Hör mal, da benutzen tausend Leute über dein Programm unsere API, wir wollen jetzt Lizenzgebühren von dir." Neue Einnahmequelle! (Besser wäre natürlich die Antwort: "Wie können wir dir helfen noch besser zu werden?")

Während Sparkasse, Commerzbank usw. sich wundern warum sie keinen Umsatz im Web 2.0 machen.

Konsequent weitergedacht muss mein Buchhaltsscript seinerseits eine Schnittstelle anbieten über die mein Steuerberater sich die Rechnungen des letzten Monats zieht.

Aber was wenn ich nicht mehr mit meiner Bank zufrieden bin?


## Austauschbarkeit der Einzelteile

Durch die Trennung und die genau spezifizierten Kommunikationskanäle kann man jedes Teil der Kette einfach austauschen. Sollte die Bank plötzlich aufgrund der technischen Innovation ungerechtfertigt hohe Gebühren verlangen, sucht man sich die nächste Bank mit einer Schnittstelle und knüpft diese an.

Dabei ist es auch möglich einen Adapter zu schreiben. Gehen wir davon aus es liefe bisher so:

	Anfrage: { action: 'get_last_income' }
	Antwort: { date: '2012-07-18', amount: '100', currency: 'EUR' }

Die nächste Bank hat sich ein anderes System ausgedacht und erwartet eine Anfrage in dieser Form:

	Anfrage: { cmd: 'income', limit: '1' }

Eine Möglichkeit wäre die eigene Logik dementsprechend anzupassen, schöner ist aber einen Adapter dazwischen zu setzen der die Anfragen umformt.

Diese Adapter können dann nach und nach für jede Bank zur Verfügung gestellt werden. Und wenn Ihr Unternehmen groß genug geworden ist, ist die Wahrscheinlichkeit hoch, dass neue Spieler am Markt selbst die benötigten Adapter herstellen.

Aber baut man sich damit nicht ein verwirrendes Netz aus fehleranfälligen Programmen? Nicht unbedingt.


## Automatische Tests

Schon mal nicht eingeschlafen aus Angst am Killerapp könnte etwas nicht funktionieren? Fehler sind unvermeidbar, aber das Aufspüren muss vereinfacht und verbessert werden. Und das erleichtert einem eine API ungemein.

In einem idealen Setup existieren drei Server:

1. Der Entwicklunggsserver. Hier landen alle Arbeiten der beteiligten Entwickler und das Marketing und die Tester können die neuen Funktionen ausprobieren.
2. Der Testserver. Auf diesem werden die Änderungen vom Entwicklungsserver kopiert, sobald eine ausreichende Anzahl an Entscheidungsträgern die Änderungen abgenickt haben.
3. Der Liveserver. Wenn auf dem Testserver keine Fehler mehr auftreten, erreichen die Änderungen den Liveserver, der der Öffentlichkeit zur Verfügung steht.

Punkt 2 ist der API Test Ansatzpunkt: Mit wenigen Zeilen Code können Programme geschrieben werden, die eine Anfrage an die API schicken und eine genaue Antwort zurück erwarten. Nach dem Motto:

	Anfrage: "Erstelle neuen Benutzer 'Uwe'".
	Antwort: "Neuer Benutzer 'Uwe' erfolgreich erstellt".

Mehr ist es gar nicht. Diese Tests können pro Änderung oder pro Stunde durchgeführt werden. Lautet die Antwort "Benutzer 'Uwe' konnte nicht erstellt werden" muss eine Warnleuchte angehen und an alle Entwickler eine Email geschickt werden, damit der Fehler sofort behoben werden kann.

Ganz wichtig in dem Zusammenhang: Sobald ein neuer Fehler auftaucht, muss ein Test geschrieben werden:

	Anfrage: "Gib mir alle Nachrichten von 'Uwe'"
	Antwort: "Benutzer 'Uwe' nicht gefunden"
	
Irgendwas in den Nachrichten stimmt nicht! Nach dem ein Test existiert, der fehlschlägt, können sich die Entwickler daran machen ihn zu lösen.

Größter Vorteil: Sie können beweisen, dass Ihre API funktioniert, wenn ein Lizenznehmer kommt und behauptet es würde etwas nicht klappen.


## Skalierung

Ihr Unternehmen wird mit einer erfolgreichen Schnittstelle schneller wachsen als Sie Ihre Software optimieren können. Die Benutzer wollen schließlich neue Funktionen und keinen ewigen Stillstand.

Zum Glück haben Sie eine API hinter der Sie einen "Load Balancer" stellen können. Das ist praktisch ein Verkehrspolizist der den Verkehr einteilt, einer links, einer rechts, eine Anfrage zum Server A, eine zum Server B usw. Diesen Polizisten kann man soweit verbessern, bis er sogar eigenständig neue Server bucht, sobald Ihre Werbung kurz vor der Tagesschau gelaufen ist. Flaut der Besucheransturm wieder ab, kündigt er sie wieder.

Zugegeben: Hier begebe ich mich auf dünnes Eis und je nach Setup, gewähltem Developmentstack und weiteren Faktoren kann das eine komplizierte Sache werden. Aber trotzdem, mit einer API wird es ein großes Stück einfacher.


## Zugriffssteuerung

Der Punkt wurde weiter oben schon angesprochen. Wenn verschiedene Benutzer Zugriff auf Ihre Daten erhalten, dann möchten Sie genau wissen wer wann welche Daten abfragt und schreibt. Das kann auf verschiedene Arten gelöst werden. Sie könnten ein `App Secret` verteilen. Das heißt eine Anfrage wird nicht einfach so gestellt, sondern erwartet immer einen Schlüssel:

	Anfrage: "Neuen Benutzer anlegen: 'Uwe'"
	Antwort: "Anfrage abgewiesen, nicht autorisiert"
	
Besser Sie schicken eine Authentifizierung mit:

	Anfrage: "Neuen Benutzer anlegen: 'Uwe', Berechtigung: 'oiwef0392u029efj209ef209ejf209ejfofn20f92'"
	Antwort: "Erledigt"
	
Die Berechtigung ist ein eindeutiger Schlüssel anhand dessen Sie den Absender identifizieren, ähnlich einem Passwort.

Alternativ ist es auch möglich gleich Zugriffsdaten zu verlangen:

	Anfrage: "Ich möchte mich anmelden, Name: 'Paul', Passwort: '1234'"
	Antwort: "Hallo Paul"
	Anfrage: "Neuen Benutzer anlegen: 'Uwe'"
	Antwort: "Benutzer existiert bereits"

Darüber hinaus gibt es noch andere Möglichkeiten, aber diese beiden sind leicht zu implementieren und erfüllen ihren Zweck: Sie wissen genau wer mit Ihnen kommuniziert. Und wenn jemand Quatsch macht, dann wird sein Zugang gesperrt.

Alternativ kann man auch einen einfachen Counter mitlaufen lassen und nach tausend Anfragen sagen: "Das reicht, wenn du mehr willst musst du uns bezahlen".


## Coolness Faktor

Eigentlich müssten Sie schon überzeugt sein. Sollte das wider erwartend nicht der Fall sein, denken Sie nur daran wie gelassen Sie auftreten können, wenn der nächste Kunde auf das beste Angebot allerzeiten antwortet: "Ja ich will, aber mein Super-Entwickler-Cogründer hat dieses tolle Buchhaltungssystem programmiert und deshalb können wir Ihre Lösung nicht benutzen. Leider."

Dann antworten Sie mit einem gewinnenden lächeln: "Kein Problem, wir geben Ihnen Zugriff auf unsere API und Ihr Entwickler bindet unser Tool einfach ein."

Poolparty!


## Web 2.0 und ein Fazit

Wir Leben seit langem in einer Welt in der es schon alles gibt. Die große Innovation der nächsten Jahrzehnte wird die Kombination aus vorhandenen Diensten sein.

Die ganze Entwicklung verlagert sich auf das Smartphone, jeder muss ununterbrochen überall alles zur Verfügung haben, da ist es unbedingt notwendig dabei zu sein.

Und schon seit langem werden die wirklich coolen und innovativen Ideen von kleinen Entwicklern und Startups irgendwo auf der Welt entwickelt, die im richtigen Moment erkennen was im Kosmos der unbegrenzten Möglichkeiten noch fehlt.

Wäre es nicht schön, wenn sie das auf Grundlage Ihres Geschäftsmodels machen? Und zwar so, dass Sie davon profitieren - und keine kleine, aufgeweckte Firma Ihr Model kopiert. Ihre Daten können schließlich benutzt und weiter verarbeitet werden.
