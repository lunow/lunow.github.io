---

layout: post
title: "Boost up next level with Gulp, Browser Sync and ES6"
abstract: "Okay, its time for two things: blogging in english and boost you up to next level Javascript with ES6. This post shows both."
categories: AngularJs
background: marktplatz

---

# Why?

Times are chainging and so you have to also. ES6 will come and it will help you to write better, faster and more reliable Javascript code. So don't wait and take this christmas present for a simple and quick introduction.

I wrote the last years all my blog posts in german. That's changed, because my new company is building a complete new OS, we are a great development team and daily language is english, of course. So if you have some spare time, feel free to send me a [pull request on Github](https://github.com/lunow/lunow.github.io) with some corrections or improvements!

And if you are looking for a new job, and interested in learning, new technologies and building with us a new OS, [take a look here](http://nepos.io)!


# What do I need?

The browsers are not able to understand your shiny new ES6 code. Thats why you have to compile it to "old" Javascript. Luckely not on your own, Babel will do that for you.

Beside that, you need NodeJS installed in a version >6 ([use `n` for easy upgrading](https://www.npmjs.com/package/n)) and follow this tutorial.


# The basics

Open a terminal. And please do so. As a successfull developer you love the keyboard and you want to do everything as straight forward as possible. If not done already, upgrade NOW to [iTerm](https://www.iterm2.com/version3.html).

Create an empty folder and create a new `npm` package:

	$ npm init --yes

Install the needed dependencies

	$ npm install --save-dev gulp gulp-babel gulp-sourcemaps gulp-concat babel-preset-latest babel-plugin-transform-object-rest-spread babel-plugin-transform-es2015-destructuring browser-sync 

Yes, it's a bit of stuff, but it's needed. Next, create basic folder structure and a few files:

	mkdir src
	mkdir dist
	touch gulpfile.js
	touch src/index.js
	touch index.html


# HTML Structure

Lets start with a pretty basic HTML5 structure inside `index.html`

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Hello World</title>
	</head>
	<body>
		Hello World
		
		<script src="dist/all.js"></script>
	</body>
	</html>

And just a simple greeting inside `src/index.js`

	const greetings = name => {
		console.log(`Hello ${name}`);
	};

	greetings('user');

Uh, ES6! Arrow function and template string. There are so much to learn! But first of all the browser will not be able to execute it like this.


# Lets babel it

We need to make babel to work. Therefore lets create a gulp task to do so:

	const gulp = require('gulp');
	const sourcemaps = require('gulp-sourcemaps');
	const babel = require('gulp-babel');
	const concat = require('gulp-concat');

	gulp.task('build', () => {
		return gulp.src('./src/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015'],
				plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread']
			}))
			.pipe(concat('all.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./dist'));
	});

This one is doing a bit. Searching all `*.js` files inside `src` folder. Create a sourcemap, pipe it through babel, combine it to one file and write it to `dist` folder.

Great. So much in just a few lines. But its still not visible as a website.


# Start a server

Lets serve the stuff localy. The most awesome tool is `browser-sync`. You installed it already. Create a new task and let it spin up a browser for you.

	const browserSync = require('browser-sync').create();

	gulp.task('serve', function(cb) {
		browserSync.init({
			open: false,
			server: {
				baseDir: '.'
			}
		});
	}); 

Thats it! Open [http://localhost:3000](http://localhost:3000) and you will see your webpage. But one important thing is missing.


# Add live reload!

The time of hiting reload all the time is over. Don't do it any more! Let your tools do this. First of all we want to rebuild the js files if we change them.

	gulp.task('serve', function(cb) {
		browserSync.init({
			open: false,
			server: {
				baseDir: '.'
			}
		});

		gulp.watch('./src/**/*.js', ['build']);
	});

Fine, but not enough. The browser did not reload. Add just one line after the first `gulp.watch` command.

	gulp.watch(['./dist/*.js', './**/*.html']).on('change', browserSync.reload);

Done. Its watching for all `*.js` files inside the `dist` folder and all `.html` files in the project and trigger the browser to reload.

Everything else is done by the tools for you.


# Improvements

You can always improve your code.

1. Always: Have a single source of trust and don't repeat yourself. In the example you just copy pasted the path to your JS files. Avoid this! Create a constant object that holds all your paths inside the gulpfile.
2. Its a good idea to tell npm how to start your project. From now on, if you visit an old project, you can start everything with `npm start` and don't think about the current implementation. Add `"start": "gulp serve"` to the `scripts` object inside `package.json`.
3. Build your project before serving it. So you don't need to trigger a watch event. Just let gulp know: `gulp.task('serve', ['build'], function(cb) { ...`.

And now search for ES6 tutorials and learn all the great stuff. Its worth it! [Come and work with us](http://nepos.io)









