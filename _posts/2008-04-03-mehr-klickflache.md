---

layout: post
title: "Mehr Klickfläche"
abstract: 'In den jQuery Tips für Designer habe ich das wirklich sinnvolle Script gefunden Mit dem wird ein Div-Container komplett klickbar, wobei die Adresse vom ersten gefunden Link genommen wird'
categories: jQuery
redirect_from: 2008/04/03/mehr-klickflache/

---

In den jQuery Tips für Designer habe ich das wirklich sinnvolle Script gefunden. Mit dem wird ein Div-Container komplett klickbar, wobei die Adresse vom ersten gefunden Link genommen wird. Was aber wenn mehrere Links im Container vorhanden sind?
Dann hilft diese kleine Erweiterung:

    $("div.entry").click(function(event){
    	tar = $(event.target);
    	$link = tar.is('a') ? $(tar).attr("href") : $(this).find("a").attr("href");		
    	window.location=$link; return false;
    });

**Erklärung**

    tar = $(event.target);

Speichert das angeklickt Element in der Variable _tar_

    $link = tar.is('a') ? $(tar).attr("href") : $(this).find("a").attr("href");	

Mit tar.is('a') prüfen wir ob ein Link angeklickt wurde. Ist dies der Fall wird die Variable _$link_ mit der Adresse gefüllt - ansonsten beschehrt uns der Befehl _$(this).find("a")_ den ersten Link aus dem Container.
Wenn das kein unaufdringliches, usability verbessernder Codeschnippsel ist. Viel Spaß!