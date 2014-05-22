---

layout: post
title: "Gleichhohe Div Container mit CSS"
abstract: 'Wir brauchen mehrere Div-Container welche dynamisch per Typo3 gefüllt werden Der Designer hat sich gemeinerweise ausgedacht, dass die Spalten stets die gleiche Höhe einnehmen und mit einer schönen Hintergrundfarbe versehen sein sollen'
categories: CSS
redirect_from: "2008/04/09/gleichhohe-div-container-mit-css/"

---

Wir brauchen mehrere Div-Container welche dynamisch per Typo3 gefüllt werden. Der Designer hat sich gemeinerweise ausgedacht, dass die Spalten stets die gleiche Höhe einnehmen und mit einer schönen Hintergrundfarbe versehen sein sollen.  
Der Redakteur kann dabei bestimmen ob ein Inhaltselement ein Viertel oder zwei Viertel einnehmen soll. Dieser HTML Code wird erzeugt:

    <div class="wrap">
    	<div class="box">Bla bla bla</div>
    	<div class="box">Blu blu blu</div>
    	<div class="box">Bingo Bongo</div>
    </div>

**Lösung:** Bei [Ejeliot](http://www.ejeliot.com/blog/61) habe ich eine spannende Möglichkeit entdeckt. Die Spalten erhalten einen großen Abstand per Padding mit gleichzeitigem negativen Margin! Der Trick liegt im umfassenden Container. Per _overflow:hidden;_ werden die überflüssigen Abstände entfernt! Das CSS ist in etwa dieses hier:

    .wrap {
      overflow:hidden;
    }
    .box {
      float:left;
      padding:5px 5px 2005px 5px;
      margin-bottom:-2000px;
    }

Über die 5 Pixel unterschied im Padding bekommen die Boxen den gleichen Abstand nach unten wie zu den anderen Seiten. So schön und effektiv das vorgehen auch ist, es gibt leider ein paar [Probleme](http://www.positioniseverything.net/articles/onetruelayout/appendix/equalheightproblems) (Position is everything). Bin gespannt wann sie mich eine ganze Nacht lang aufhalten...  
  
Davor lohnt sich aber ein Blick auf das komplett in JavaScript geschrieben SuperMario Spielchen von [nihilogic](http://blog.nihilogic.dk/2008/04/super-mario-in-14kb-javascript.html). Ohne externe Grafiken! Herrlich.