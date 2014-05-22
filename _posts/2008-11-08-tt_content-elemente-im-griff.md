---

layout: post
title: "tt_content Elemente im Griff"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/11/bild-21.png)TYPO3 speichert alle Inhalte in der Datenbank **tt\_content**. Diese werden ausgelesen und ein Output erzeugt. Und den müssen wir gestallten und in die richtige Form bringen.
Die besten Erfahrungen habe ich gemacht mit einem Wrap um jedes Element, welche eine Klasse und eine spezifische ID besitzt. Natürlich bietet uns Typoscript auch alle Mittel die wir dafür benötigen.'
categories: TYPO3
redirect_from: "2008/11/08/tt_content-elemente-im-griff/"

---

Wie im (leicht gekürzten) Screenshot zu erkennen ist, geben wir die ID aus der Datenbank der ID vom DIV Container mit. Ausgelesen wird es auf dem gewohnten weg:

    page.10.subparts.CONTENT {
            20 = CONTENT
            20 {
              table = tt_content
              select.orderBy = sorting
              select.where = colPos = 0
              select.languageField = sys_language_uid
            }
          }

Und jetzt kommt der Trick dank stdWrap:

    tt_content.stdWrap {
      insertData = 1
      wrap = <div class="inhalt" id="box-{field:uid}">|</div>
    }

Mit der Angabe **insertData = 1** wird der Wrap geparst und Angaben in spitzen Klammern mit den aktuellen Daten ersetzt.
Anschließend bekommt der Bodytag noch eine Klasse zugewiesen:

    page.bodyTag = <body class="shop">

Und schon haben wir mit CSS die Möglichkeit **jedes einzelne Element anzusprechen**. Sicher ist es nicht ganz so universell sich auf die IDs festzulegen, aber da der größte Teil der Redakteure unserer Projekte keine neuen Inhalte anlegt sondern nur vorhandene aktualisiert, funktioniert diese vorgehensweise hervorragend. Insbesondere bei Anfragen der Art: Können Sie nicht mal schnell einen Rahmen um diesen Text legen...
Alle Typoscriptangaben sind auf Rootebene angegeben, d.h. tt\_content wird direkt angesprochen.
Mit einem Container um den entsprechenden Marker sind die Inhalt auch schön gebündelt ansprechbar:

    #left .inhalt {
      width:100px;
      font-size:10px;
    }
    
    #content .inhalt {
      width:80%;
      font-size:12px;
    }
    /* usw. usf. */