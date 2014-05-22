---

layout: post
title: "Überall auf die Benutzerdaten zugreifen"
abstract: 'Es geht um unser Lieblingsframework:**CakePHP**. Man kennt ja zum Beispiel die Einstellungen, auf die man von überall aus zugreifen kann über die statische Klasse **Configure**:

    echo Configure::read("Hello.World");

Das funktioniert vom Model, über den Controller bis zum View. Wäre es nicht wunderbar auf die gleiche Art und Weise auf den **angemeldeten Benutzer **zugreifen zu können? Ich denke da an:

    echo User::get("name");

Ja, wäre es und funktioniert ganz einfach. Die Idee stammt von [Matt Curry](http://www.pseudocoder.com/ "CakePHP Genie") und ist in seinem [kostenlosen Cake Buch](http://www.pseudocoder.com/free-cakephp-book "Free CakePHP Book") auf englisch beschrieben. Im Laufe der Zeit hab ich die Funktionen erweitert und angepasst.'
categories: CakePHP
redirect_from: "2010/06/03/uberall-auf-die-benutzerdaten-zugreifen/"

---

## Das User Model
Hier beginnt die Arbeit. Die Grundlage ist die Funktion **getInstance() **mit deren Hilfe die Daten gespeichert werden und sicher gestellt wird, dass immer die richtigen Daten zurück gegeben werden:

    function &getInstance($user = null) {
        static $instance = array();
        if ($user) {
            $instance[0] =& $user;
        }
        return $instance[0];
    }

Um neue Daten hinzuzufügen habe ich die Funktion **store()** erstellt. Diese kann beliebig oft aus dem Controller aufgerufen werden. Neue Daten ersetzen alte Inhalte. Mit Hilfe dieser Funktion kann man **nachträglich noch einzelne Daten** hinzufügen.

    function store($data) {
        $user = User::getInstance();
        $user = Set::merge($user, $data);
        User::getInstance($user);
    }

Und natürlich die Funktion um **Daten auszulesen**:

    function get($path = '') {
        $_user =& User::getInstance();
        if(empty($path)) {
            return $_user;
        }
        $path = str_replace('.', '/', $path);
        if (strpos($path, 'User') !== 0) {
            $path = sprintf('User/%s', $path);
        }
        if (strpos($path, '/') !== 0) {
            $path = sprintf('/%s', $path);
        }
        $value = Set::extract($path, $_user);
        if (!$value) {
            return false;
        }
        return $value[0];
    }

Wie man sieht wird mit der Funktion [Set::extract()](http://book.cakephp.org/view/1501/extract "Set::extract() im Cake Manual") aus den gespeicherten Daten gelesen. Die Core Utilities sind einfach großartig. Unbedingt durchstöbern!

## Im App Controller
Hier werden die Daten vom angemeldeten Benutzer gesetzt. Als erstes muss natürlich das Model importiert werden, unabhängig von einer Anmeldung. Damit alle Controller mit den Daten arbeiten können, gehört der folgende Code in die Funktion **beforeFilter()**.

    App::import('Model', 'User');
    $User = new User;

Als nächstes wird geprüft ob der Benutzer angemeldet ist. Wenn das der Fall ist, werden die Benutzerdaten **aus der Session ins Model **geschrieben:

    if($this->Session->check('Auth.User')) {
        $User->store($this->Session->read('Auth'));
    }

Hat man im Laufe der Abarbeitung der Anfrage noch weitere Informationen vom Benutzer gesammelt oder errechnet, kann man die einfach hinzufügen:

    $User->store(array('is_cool' => true));

## Überall
Überall, im View, im Controller oder im Model kann jetzt auf die **Benutzerdaten** zugegriffen werden:

    echo User::get('User.name');
    echo User::get('email');

Ich mag diese Form sehr! Sie ist schön, kurz und einprägsam. Man kann sie auch noch vielfältig erweitern.

## Sehr schöne Erweiterung
Kaum können sich Benutzer anmelden, sollen sie **verschiedene Rechte** auf einer Plattform haben. Mit den oben beschriebenen Grundlagen erreicht man schon sehr viel. Noch besser wird es, wenn man eine Funktion**check()** im Model hinzufügt um auf das vorhanden sein von Feldern zu prüfen.

    function check($path) {
        $value = User::get($path);
        if (!$value || empty($value) || $value === false) {
            return false;
        }
        return true;
    }

Damit kann man schon gut lesbare Abfragen schreiben.

    if(User::check('is_cool')) { /* usw. */ }

Aber so richtig sauber sieht das nicht aus. Und was passiert wenn es mehrere Rollen gibt die der Nutzer einnehmen kann? Dann wäre eine **is()** Funktion wesentlich schöner.

    if(User::is('cool')) //ist der benutzer cool?
    if(User::is('cool', 'okay')) //ist der benutzer cool oder okay?

**Das sieht nett aus!** Und der Schlüssel/die Funktion ist einfach implementiert. Im **User Model** einfach folgendes hinzufügen:

    function is() {
        $roles = func_get_args();
        foreach($roles as $role) {
            if(User::check('User.is_'.$role)) {
                return true;
            }
        }
        return false;
    }

Die Rechte werden im Benutzerarray erwartet in der Form**is\_Rechtename**. Im Controller also schnell hinzugefügt:

    $User->store(array('is_cool' => 1, 'is_okay' => 1, 'is_bloede' => 0));

Die Funktion **is()** nimmt den übergebenen Namen, setzt ein**is\_** davor und prüft ob die Variable in den Benutzerdaten gesetzt ist.

## Fazit
Ich finde dieses Pattern einfach großartig und arbeite nur noch damit! Ich hab versucht das ganze in ein Plugin zu packen um nicht jedes mal aus einem alten Projekt die Funktionen rüber zu kopieren, aber es daran gescheitert, dass das Benutzer Model, wenn es statisch aufgerufen wird natürlich nicht mehr seine Behaviors (UserStorage) beinhaltet. **Jemand eine Idee?**