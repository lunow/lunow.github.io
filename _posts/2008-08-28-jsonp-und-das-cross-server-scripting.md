---

layout: post
title: "JSONP und das Cross Server Scripting"
abstract: '![jQuery Logo](http://blog.paul-lunow.de/wp-content/uploads/2008/08/jquery-logo.gif)Da wir uns immer weiter vernetzen und unsere verschiedenen Services beginnen sich auf diversen Servern im Internet zu tummeln, stolpern wir aufeinmal ständig über folgende Fehlermeldung:
    
    Access to restricted URI denied"  code: "1012

Hier kommt die Anleitung um jQuery dazu zu bewegen, nicht mehr diesen nervigen Fehler zu produzieren: Das Geheimnis ist **JSONP und die Parameterübergabe per GET**.'
categories: jQuery
redirect_from: "2008/08/28/jsonp-und-das-cross-server-scripting/"

---

Die Ursache dieses Fehlers liegt in der Tatsache, dass Scripte nur vom gleichen Server geladen werden dürfen. Vom gleichen Server, mit der gleichen URL und dem gleichen Port. Das ist Sicherheit.
Allerdings ist es möglich JavaScripte von jedem beliebigen Server zu inkludieren. Und hier kommt JSONP ins Spiel. jQuery erzeugt ein Script und erwartet eine angegebene Funktion, um anschließend das enthaltene JSON Objekt zurück zu geben. Genial! (Das P steht übrigens für Padding)
So sieht die Ajaxabfrage aus:

    $.ajax({
      dataType: 'jsonp',
      jsonp: 'jsonp_callback',
      url: 'http://www.interaktionsdesigner.de/stuff/json.php',
      success: function (j) {
        alert(j.response);
    },
    });

Wichtig ist neben _dataType: 'jsonp'_ vorallem die Angabe _jsonp: 'FUNKTIONS\_NAME'_.
Serverseitig braucht es auch noch eine kleine Veränderung, damit der JSON Code in eine Funktion gepackt wird:

    <?
      $data = json_encode(Array("response" => "Thanks for the Fish!"));
      echo $_GET['jsonp_callback'] ."(". $data .");";
    ?>

Hier ist die zweite Zeile von besonderer Bedeutung und ermöglicht erst die ganze weltweite Abfragemöglichkeit.
**Aber:** Die Abfrage funktioniert **nur mit** der Datenübertragungsmethode **GET**! Es wird ja ein Script eingebunden und an dieses kann keine POST Daten übersendet werden.
Kurz und knapp hat es [Remy Sharp beschrieben](http://remysharp.com/2007/10/08/what-is-jsonp/), den ich seit einiger Zeit mit seiner [aktuellen Version von Visualjquery](http://remysharp.com/visual-jquery/) ständig in meiner Tableiste habe.