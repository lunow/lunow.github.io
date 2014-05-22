---

layout: post
title: "CakePHP und die Pfade in CSS Dateien"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/08/cake-logo.png)Ich musste lange über den Titel nachdenken, ungefähr genau so lange wie ich vorher in meiner Cake Applikation rumprobiert habe bis ich endlich rausgefunden habe wie die korrekten Pfadangaben in einer CSS Datei zu Grafiken lauten!'
categories: CakePHP
redirect_from: "2008/08/08/cakephp-und-die-pfade-in-css-dateien/"

---

So siehts aus: Meine CSS Datei liegt im Ordner **vendors/css/**
Die Bilder für die Webausgabe liegen dagegen in **app/webroot/img/**
Fragt mich bitte nicht warum; in einem Tutorial oder beim ersten Versuch hat es damit geklappt und so hab ichs erstmal gelassen. Jetzt stellt sich allerdings die Frage wie man das beides miteinander verknüpft.
Zum Glück ist die Lösung mal wieder einfach. Die CSS aus dem Vendor wird für die Webausgabe in den **webroot** Ordner kopiert, oder per URL Rewriting dort hin geschrieben, jedenfalls kann man von diesem Ordner aus die Bilder relativ zur CSS Datei verknüpfen:

    background-image:url("../img/edit.png");

Leider fehlt mir die Zeit ausführlich über Cake zu schreiben, aber ich habe große Lust drauf und werde es irgendwann schaffen!