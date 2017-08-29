---

layout: post
title: "Remind your team with Slack automatisation"
abstract: "It's take you just a few minutes to setup a script that automates a Google Spreadsheet and connect this to your team chat. You just need to know the right tools."
categories: Slack
background: wolken

---

# Why?

We have now a fancy coffee machine in the office and as you know, this machines needs a daily base of love to continue it's work for a longer time.

And after a while, when nobody wants to do it any more, we decided to setup a plan. Each team member a day, but how to setup an automated reminder?

# Automate Google Spreadsheet

First of all we need a database. Luckily there is a full featured database for free on the web you can use without any programming skills: Google Spreadsheet.

Just create a new file. But actually we have some programming skills and we don't want to enter something each day, because this is something a computer can do for us. His name is Google Apps!

Head over to [Google Scripts](https://script.google.com) and create a new script. First of all I created a function to return a name, each time its called.

```js
function getName(index) {
	const names = ['Paul', 'Bob', 'Michael'];
	return names[index % names.length]  
}
```

Next, the magic kicks in. Access your Spreadsheet and append a row with a name, each time it's called. 

```js
function insertInSpreadsheet() {
  var ss = SpreadsheetApp.openById('xxx');
  var sheet = ss.getSheets()[0];
  var index = sheet.getLastRow();
  ss.appendRow([getName(index)]);
}
```

Replace the `xxx` with your Spreadsheet ID, and you are done! The script is accessing the Spreadsheet, takes the first sheet and get the latest row, filled with content `sheet.getLastRow()`. I use this number as an index to get a different name, each time.

Then `appendRow()` to add new row.

## Setup the cronjob inside Google Spreadsheet

Thats nothing more than a few clicks: Goto `Edit` -> `Trigger of current project`, select the function `insertInSpreadsheet` and make your choices on an interval. I would recommed each minute for testing. Hit `Save`, thats it!

You can watch how your spreadsheet gets the data.


# Connect Spreadsheet with Slack

There are a lot of tools to do that, I choosed [Automate.io](https://automate.io/integration/google-sheets/slack) because I liked the name and they had good SEO. 

Take what ever fits you, connect your applications and fill some forms, that's it! Each change inside the Google Spreadsheet results in a Slack Message finally.

How great is that?


# Improvements

It takes not much to read the names out of the spreadsheet instead hard code them. You can also add fancy calculations for select the next team mate to clean the machine.

One further step would be to create a backwards channel, so you can reply: Done or I'm out of office and then the next person is selected. But this is something for later.

Have fun and continue automate everything.