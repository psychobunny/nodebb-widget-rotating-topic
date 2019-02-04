"use strict";

var async = module.parent.require('async');
var nconf = module.parent.require('nconf');
var validator = module.parent.require('validator');

var db = module.parent.require('./database');
var categories = module.parent.require('./categories');
var user = module.parent.require('./user');
var plugins = module.parent.require('./plugins');
var topics = module.parent.require('./topics');
var posts = module.parent.require('./posts');
var groups = module.parent.require('./groups');
var utils = module.parent.require('./utils');

var benchpressjs = module.parent.require('benchpressjs');

var app;

var Widget = module.exports;

Widget.init = function(params, callback) {
	app = params.app;
	callback();
};

function getCidsArray(widget) {
	var cids = widget.data.cid || '';
	cids = cids.split(',');
	cids = cids.map(function (cid) {
		return parseInt(cid, 10);
	}).filter(Boolean);
	return cids;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
    	[array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
}

Widget.renderWidget = function(widget, callback) {
	var cids = getCidsArray(widget);
	async.waterfall([
		function (next) {
			var key;
			if (cids.length) {
				if (cids.length === 1) {
					key = 'cid:' + cids[0] + ':tids';
				} else {
					key = cids.map(function (cid) {
						return 'cid:' + cid + ':tids';
					});
				}
			} else {
				if (widget.templateData.cid) {
					key = 'cid:' + widget.templateData.cid + ':tids';
				} else {
					if (widget.data.showRecent) {
						key = 'topics:recent';
					} else {
						return next(null, {topics: []});
					}
				}
			}
			
			topics.getTopicsFromSet(key, widget.uid, 0, 30, next);
		},
		function (data, next) {
			var topic = {};

			if (!data.topics.length) {
				return app.render('widgets/rotatingtopic', {
					count: 0,
					relative_path: nconf.get('relative_path')
				}, next);
			}

			data.topics = data.topics.sort(function(a, b){
				return parseInt(a.timestamp, 10) < parseInt(b.timestamp, 10) ? 1 : -1
			});

			var mostRecentTopicDate = new Date(data.topics[0].timestamp)
			var todaysDate = new Date();

			shuffleArray(data.topics);

			var mainPids = data.topics.map(function(a) {
				return a.mainPid;
			});

			posts.getPostsByPids(mainPids, widget.uid, function(err, posts) {
				if (err) {
					return next (err);
				}

				var topics = [];

				for (var i = 0, ii = posts.length; i < ii; i++) {
					topics.push({
						title: data.topics[i].title,
						content: posts[i].content,
						slug: data.topics[i].slug,
					});
				}

				app.render('widgets/rotatingtopic', {
					topics: topics,
					count: data.topics.length,
					relative_path: nconf.get('relative_path')
				}, next);
			});
		},
		function (html, next) {
			widget.html = html;
			next(null, widget);
		},
	], callback);
};

Widget.defineWidgets = function(widgets, callback) {
	var widget = {
		widget: "rotatingtopic",
		name: "Rotating Topic",
		description: "Rotating topic of the day widget with a slider.",
		content: 'admin/rotatingtopic'
	};

	app.render(widget.content, {}, function(err, html) {
		widget.content = html;
		widgets.push(widget);
		callback(err, widgets);
	});
};
