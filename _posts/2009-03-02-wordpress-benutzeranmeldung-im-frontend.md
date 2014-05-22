---

layout: post
title: "WordPress Benutzeranmeldung im Frontend"
abstract: 'Neue Benutzer können sich bei WordPress bequem anmelden, wenn bei den Einstellungen die entsprechende Checkbox angeklickt wurde. Allerdings können sich die Benutzer nur im Backend anmelden, und das ist doch alles andere als elegant. Außerdem kann der Benutzer nur seinen Namen und eine E-Mailadresse angeben. Weitere Daten werden nicht abgefragt und das Passwort automatisch generiert. **Suboptimal**.
Es gibt das Plugin [Register Plus](http://skullbit.com/wordpress-plugin/register-plus/ "WordPress Plugin Register Plus") welches auf vielfältige Art erlaubt das Registrierungsformular zu erweitern (auch mit eigenen Feldern). Aber trotzdem befindet sich das Teil noch im Backend. **Aber das muss nicht so bleiben**.'
categories: WordPress
redirect_from: "2009/03/02/wordpress-benutzeranmeldung-im-frontend/"

---

Als erstes braucht das verwendete Theme eine **neue Seitenvorlage**. Dazu dupliziert man die Datei _page.php_ und fügt als erstes den folgenden PHP Kommentar ein: 
    
    <?php
    /*
    Template Name: Frontend Registrierung
    */
    ?>

Anschließend kann man eine **neue Seite** anlegen und in der rechten Spalte die Seitenvorlage_Frontend Registrierung_ (bzw. was man eingetragen hat) auswählen.
Jetzt muss nur noch die Datei **die Funktionalität** kriegen. Dazu öffnet man in seinem bevorzugten Editor die duplizierte Datei und fügt, wo auch immer das Formular erscheinen soll, den folgenden Inhalt ein. 
    
    <form name="registerform" id="registerform" action="<?=site_url('wp-login.php?action=register', 'login_post')?>" method="post">
        <p>
            <label><?php _e('Username') ?><br />
            <input type="text" name="user_login" id="user_login" class="input" value="<?php echo attribute_escape(stripslashes($user_login)); ?>" size="20" tabindex="10" /></label>
        </p>
        <p>
            <label><?php _e('E-mail') ?><br />
            <input type="text" name="user_email" id="user_email" class="input" value="<?php echo attribute_escape(stripslashes($user_email)); ?>" size="25" tabindex="20" /></label>
        </p>
        <?php $register_plus->RegForm(); ?>
        <input type="submit" value="Registrieren!">
    </form>

Was ist passiert? Es wird ein ganz normales **HTML Formular** erstellt mit der gleichen Zielseite wie das Backendregistrierungsformular. Mit**site\_url()** wird das Formular unabhängig von der verwendeten Baseurl gemacht.
Die beiden Felder _Username_ und_E-mail_ müssen per Hand angelegt werden, der Rest wird vom Plugin **register plus** übernommen. Im Plugin wird die Variable _$register\_plus_ mit der Klasse initalisiert und steht deshalb im Template zur Verfügung. Die Funktion _RegForm() _gibt das Formular je nach den getroffenen Einstellungen im Backend zurück.
Noch ein**Abschicken-Knopf **drunter und fertig! _Es gibt nur eine unschöne Sache_: die Antwort vom Script wird auf der normalen Registrierungsseite ausgegeben. Das ist noch nicht ganz perfekt, aber vielleicht hat jemand einen Tipp(?) oder in der nächsten Zeit kommt Teil 2 von diesem Tutorial.
Frohes bloggen!