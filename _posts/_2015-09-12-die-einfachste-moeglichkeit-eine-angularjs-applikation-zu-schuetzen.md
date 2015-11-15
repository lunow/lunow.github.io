---

layout: post
title: "Die einfachste Möglichkeit eine AngularJS Applikation mit einem Passwort zu schützen"
abstract: "Jetzt hat man seine erste, großartige WebApp mit Angular umgesetzt, es läuft lokal alles großartig und man möchte es mit der Welt teilen. Der ganzen Welt? Nein, eigentlich ist es nur ein kleiner Kreis die darauf zugreifen sollen. Also muss sie geschützt werden. Hier ist ein Beispiel, das ganz nebenbei tiefer einsteigt in Services und ngRoute."
background: spanien

---

{% raw %}

## Passwörter und das Internet

Nach wie vor sind Passwörter das Mittel zur Wahl um seine Inhalte zu schützen. Ich würde sogar behaupten, dass die bloße Aufforderung zur Eingabe eines Passworts den überwiegenden Teil der Nutzer abschreckt. Hängt natürlich enorm von der persönlichen Motivation und dem Inhalt der Daten ab.

Um einer kleinen Gruppe Zugriff auf eine Internetseite zu geben war lange Zeit die `.htaccess` Datei das Mittel der Wahl. Super sicher und leicht kryptisch es einzurichten.

Aber eine coole Webapplikation damit schützen? Niemals. Denn Angular bringt alle Werkzeuge mit, einen einfachen Passwortschutz zu hinterlegen.


## Theoretisch

Deine coole WebApp arbeitet mit einer Datensammlung die nicht jeder zu Gesicht bekommen soll. Das heißt im ersten Schritt: Diese Daten müssen auf den Server verlagert werden. Der Nutzer muss ein Passwort eingeben um anschließend die Daten laden zu können.


## Der Server

Ich rede hier wirklich von der aller einfachsten Lösung. Alle Nutzer haben das gleiche Passwort und anstatt eines coolen Node Servers benutze ich den uralten PHP Webspace den man immer irgendwo rumliegen hat.

Also eine `server.php`:

	<?php

		header('Content-Type: application/json');

		$data = '{ "hello": "world" }';

		if(strtolower($_GET['pw'] == 'secret')) {
			echo json_encode(array('ok' => true), 'data' => $data);
		}
		else {
			echo json_encode(array('ok' => false));
		}

	?>

Als erstes wird sicher gesetellt, dass der Server JSON Daten zurückliefert, damit Angular die Inhalte verarbeiten kann. Im String `$data` sind alle zu sichernden Daten als JSON Objekt abgelegt.

Als nächstes wird geprüft ob der Get Parameter `pw` das Wort `secret` enthält. Das ist wirklich die aller einfachste und billigste Form der Sicherheit.

Aber im Gegensatz zu Javascript lassen sich PHP Scripte (normalerweise) nicht im Quelltext einsehen, sodass euer Passwort gegenüber 99,8% der Internetnutzer absolut sicher gespeichert ist.













