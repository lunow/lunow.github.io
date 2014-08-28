---

layout: post
title: "AngularJS und RequireJS"
abstract: "Die neuen Aufträge sind groß, Webseiten sind inzwischen WebApps, Angular ermöglicht eine extrem saubere Trennung zwischen den Verantwortlichkeiten und RequireJS verwaltet für uns die Abhängigkeiten. Wirklich? Nein."
categories: AngularJS, RequireJS
background: steineklopfer

---

## Einleitung

Wie kann ich am besten AngularJS und RequireJS verbinden? Die Antwortet lautet: **gar nicht**! AngularJS bringt schon ein Modulsystem mit, das bestens geeignet ist für Angular. Mit RequireJS lädt man sich einen ganzen Haufen zusätzliches Javascript in den Entwicklungsprozess und muss Angular dahin verbiegen das es damit zusammen arbeitet.

Klar funktioniert es, macht es aber schwieriger.


## Zielsetzung

Warum will man überhaupt RequireJS einbinden? Die Antwortet lautet das man nicht jede einzelne Javascript Datei von Hand in der `index.html` Datei einbinden möchte. Wenn die Antwort lautet: Damit der Nutzer nicht einen ganzen Haufen Javascript Dateien laden muss, dann hat man da etwas falsch verstanden: Der Deploy Schritt von RequireJS beschreibt genau das: Aus allen einzelnen Modulen eine Datei machen, komprimieren und an den Nutzer senden.

Wenn man mit AngularJS arbeitet, hat man genau diese Funktionalität schon integriert.


## Der Build Prozess mit Gulp

[GulpJS](http://gulpjs.com/) ist ein großartiges Build Tool, das per 

	npm install -g gulp

installiert wird. Anschließend legt man im Projekt Ordner die Datei `gulpfile.js` an und startet mit `gulp build` die entsprechende Aufgabe. Das führt natürlich zu einem Fehler, denn der `build` Task wurde noch nicht definiert.


## Javascript Dateien im Browser bereitstellen

In der großartigen AngularJS WebApp liegen viele Dateien mit einzelnen Aufgaben. Diese sollen alle zusammengefügt werden und in einer `app.js` Datei dem Browser bereit gestellt werden.

	var concat = require('gulp-concat');

	gulp.task('build', function() {
		gulp.src(['src/**/*.js']).
			pipe(concat('app.js')).
			pipe(gulp.dest('dist/'));
	});

Vorher noch schnell `npm install --save-dev gulp-concat` ausgeführt, und schon ist die Aufgabe erledigt!

Gulp sucht alle `*.js` Dateien im Ordner `src`, fügt sie zusammen und speichert sie unter `dist/app.js`. Perfekt!

Ein Scripttag im HTML und alles ist da.

	<script src="dist/app.js"></script>


## Prozess automatisieren

Selbstverständlich möchte man nicht nach jeder Änderung Gulp aufrufen. Deshalb definieren wir einen `watch` Task. Per NPM wird die Funktionalität installiert.

	npm install --save-dev gulp-watch

Und im Gulpfile benutzt.

	var watch = require('gulp-watch');

	gulp.task('watch', function() {
		watch({ glob: 'src/**/*.js' }, function() {
			gulp.start('js');
		});
	});

Jetzt wird nur noch einmal am Morgen der Prozess angeworfen

	gulp watch

Und die Arbeit kann laufen!


## Verbindung zu den Quelldateien

Einen entscheidenden Nachteil gibt es (noch): Alle Fehler die in der Javascript Konsole des Browsers auftauchen verweisen auf die `app.js` Datei. Natürlich kann man nachschauen und rekonstruieren woher der Fehler kommt, einfacher ist es aber das Plugin `gulp-concat` durch das Plugin `gulp-concat-sourcemap` auszutauschen.

	npm uninstall gulp-concat
	npm install --save-dev gulp-concat-sourcemap

	//gulpfile.js
	var concat = require('gulp-concat-sourcemap');

Fertig! Einfach mal ausprobieren - jetzt zeigen die Dateireferenzen auf die ursprünglichen Dateien.


## Fazit

Mit diesem einfachen Gulp Task hat man sich nicht nur ein unglaublich mächtiges Werkzeug erschlossen, sondern sich selbst und den Nutzern auch eine ganze Menge Javascript Code gespart.

Gulp kann auch Javascript komprimieren, SASS kompilieren, Bilder komprimieren, Tests ausführen und im Erfolgsfall denn ganzen Kram in die Cloud laden. Dazu dann im nächsten Artikel.









