# id2014

Start blogging on GitHub. Its fun and easy. Here you find everything I used to create the blog http://www.interaktionsdesigner.de


## Local Development

You need a few things to start:

- Install [Jekyll](http://jekyllrb.com/) (On Mavericks [this](http://stackoverflow.com/questions/22460117/error-error-installing-jekyll-error-failed-to-build-gem-native-extension/23298607#23298607) solved my install problems)
- Install [Bower](http://bower.io/)
- Install [SASS](http://sass-lang.com/)
- Clone Repository
- Run `bower install` inside the cloned folder
- Run `sass --watch css/sass:css/compiled`
- Run `jekyll serve --watch` to start the Jekyll Server and let it watch for changes while developing (if that is not working, run `bundle exec jekyll serve --watch`)
- Visit the Blog in the browser http://localhost:4000/


## Import posts from WordPress

Okay, its not the cleanest method, but its works. So grap the following WordPress Tables: `wp_posts`, `wp_terms`, `wp_term_relationships` and make it locally available.

- Run `npm install` in the Folder `_sql_to_md`.
- Update the login data in the `index.js` file.
- Run with `node index.js` from subfolder.

The script will remove(!) all files in `_posts`, grap the content from the database and transform it to *.md Files.
Its very specialiced for my blog, but you can use it as an entry point.
