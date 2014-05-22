/*global require, console */
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var slug = require('slug');
var mysql = require('mysql');
var md = require('html-md');
var connection = mysql.createConnection({
	host: 'localhost',
	port: '8889',
	user: 'root',
	password: 'root',
	database: 'id14_temp'
});
var posts_dir = '../_posts/';

var old_files = fs.readdirSync(posts_dir);
_.each(old_files, function(file) {
	console.log(file);
	fs.unlinkSync(posts_dir+file);
});

var getAbstract = function(content) {
	var sentences = content.split('.');
	var r = _.first(sentences, 2).join(' ').replace(/(<([^>]+)>)/ig,"");
	r = r.replace(/(\[([^>]+)\])/ig,"");
	return r;
};

var clean = function(content) {
	content = content.replace(/'/g, '"');
	content = content.replace(/\[code\]/g, '<pre>');
	content = content.replace(/\[\/code\]/g, '</pre>');
	return md(content, {inline: true});
};

var permalink = function(date, title) {
	return date.replace(/-/g, '/') +'/'+slug(title).toLowerCase()+'/';
};

var prepareContent = function(title, raw_content, categories, date, is_html) {
	var nl = "\n";
	var seperator = raw_content.indexOf('<!--more-->') > 0 ? '<!--more-->' : '<!-- more -->';
	var splitted_content = raw_content.split(seperator);
	var abstract;
	if(splitted_content.length > 1) {
		abstract = splitted_content[0].replace(nl, '');
	}
	else {
		abstract = getAbstract(raw_content);
	}
	var content = splitted_content[1] ? splitted_content[1] : splitted_content[0];
	
	var new_content = '---'+nl+nl;
	new_content+= 'layout: post'+nl;
	new_content+= 'title: "'+title+'"'+nl;
	if(is_html) {
		new_content+= 'abstract: \''+clean(abstract, { inline: true })+'\''+nl;
	}
	else {
		new_content+= 'abstract: \''+abstract+'\''+nl;
	}
	new_content+= 'categories: '+categories.join(', ')+nl;
	new_content+= 'redirect_from: "'+permalink(date, title)+'"'+nl;
	new_content+= nl+'---'+nl+nl;

	if(is_html) {
		//remove images
		content = content.replace(/<img.*?\/>/ig, '');

		//replace [tab]
		content = content.replace(/\[tab\]/g, '    ');

		//replace [code]
		content = content.replace(/\[code([^\]]*)?\]/g, '<pre>');
		content = content.replace(/\[\/code\]/g, '</pre>');

		//html to markdown
		content = md(content, { inline: true });
	}

	new_content += content;


	return new_content;
};

connection.connect(function(err) {
	if(err) {
		console.error('mysql connection error:', err);
		return;
	}
	
	connection.query('SELECT term_id AS id, name FROM kas_wp_terms', function(err, r) {
		if(err) { console.error('mysql error:', err); return; }
		var terms = {};
		_.each(r, function(term) {
			terms[term.id] = term.name;
		});

		connection.query('SELECT id, post_date, post_content, post_title FROM kas_wp_posts WHERE post_status = "publish" AND post_title != "" ORDER BY post_date', function(err, results) {
			if(err) {
				console.error('mysql query error:', err);
				return;
			}

			_.each(results, function(result) {
				//find categories
				connection.query('SELECT term_taxonomy_id AS id FROM kas_wp_term_relationships WHERE object_id = "'+result.id+'"', function(err, r) {
					if(err) { console.error('mysql error:', err); return; }
					var result_terms = [];
					_.each(r, function(a) {
						result_terms.push(terms[a.id]);
					});

					var date = moment(result.post_date);
					var filename = date.format('YYYY-MM-DD')+'-'+slug(result.post_title).toLowerCase()+'.md';
					var is_html = date.format('YYYY') < 2012;
					var content = prepareContent(result.post_title, result.post_content, result_terms, date.format('YYYY-MM-DD'), is_html);
					console.log('#'+result.id+': '+filename);
					fs.writeFile(posts_dir+filename, content);
				});
			});
		});
	});
});