---

layout: post
title: "Weg mit den verdammten Anführungszeichen von WordPress"
abstract: 'WordPress verändert bekanntlich alle Anführungszeichen in einem Beitrag und zerstört so jedes Codestückchen Aber das muss nicht sein!
Diese Zeile muss in die functions'
categories: WordPress
redirect_from: "2009/01/08/weg-mit-den-verdammten-anfuhrungszeichen-von-wordpress/"

---

WordPress verändert bekanntlich alle **Anführungszeichen** in einem Beitrag und zerstört so jedes Codestückchen. Aber das muss nicht sein!

    remove_filter('the_content', 'wptexturize');

Diese Zeile muss in die _functions.php_ übernommen werden und schon sind sie Vergangenheit!
Endlich. Der Tipp kam von den [10 Killer WordPress Hacks](http://www.smashingmagazine.com/2009/01/07/10-killer-wordpress-hacks/) vom Smashingmagazin. Danke, weitermachen!