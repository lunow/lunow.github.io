---

layout: post
title: "Open corresponding files in VSCode"
abstract: "VSCode becomes my default editor quite fast. It's a great software and the fact that a browser is currently powering your web development environment is quite fascinating. Most of all because you can write extensions with the knowledge you already have. So I tried."
categories: VSCode
background: wolken

---


# VSCode
VSCode becomes my default editor quite fast. It's a great software and the fact that a browser is currently powering your web development environment is quite fascinating. Most of all because you can write extensions with the knowledge you already have.

Recently our dev teams decide to store all files belonging to one component in the same folder with the same name. Leads us to a folder structure like this.

```
	src/
		component/
			component.js
			component.html
			component.test.js
		comp2/
			comp2.js
			comp2.html
			comp2.test.js

```

Of course you need to switch between this files from time to time and I don't want to think about it anymore.


## Open Corresponding Files

So I created my first VSCode Extension, you can find it on the [marketplace](https://marketplace.visualstudio.com/items?itemName=PaulLunow.open-corresponding-files).

It adds a small script that extracts the basename of the current file and searches for corresponding files with other extensions. The list of "other" extension is configurable. By default it contains `[".test.js", ".js", ".html"]`.

Head over to your editor and install the extension or take a look into the [GitHub Repo](https://github.com/lunow/vscode-correspoding-files).


## TODO

* Its doing just easy string matching, so if you specify the extension list like this `[".js", ".test.js"]` it will never open a *.test.js file, because .js matches first. So please fix it or invert the order.
* I added some basic tests, but I digged not into the "real" extension testing of VSCode. Feel free to improve it.
* There is missing an extension icon

If you like the decision and you are also facsinated by the possiblities of JavaScript today, you may concider [work with us](https://nepos.io/jobs.html).