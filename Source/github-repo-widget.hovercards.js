/*
---
script: github-repo-widget.hovercards.js

description: Github repo widget hovercards.	 Automatically finds github repo links and applies a github repo widget hovercard to the link

license: MIT-style

authors: [atom smith]

requires:
- GithubRepoWidget
- more/ 1.3.0.1rc1: [Element.Position]

provides: [GithubRepoWidget.hoverCards]
...
*/

GithubRepoWidget.hoverCards = function(hoverCardOptions, positionOptions){
	hoverCardOptions = hoverCardOptions || {};
	positionOptions = positionOptions || {};
	var cards = [];
	$$('a[href*="github.com"]').each(function(a){
		var chunks = a.get('href').split('/');
		var user = chunks[3];
		var repo = chunks[4];
		if(user && repo){
			var card = new GithubRepoWidget(user, repo, hoverCardOptions);
			card.addEvent('complete', function(response, container){
				if(hoverCardOptions.linkClass != undefined)
				{
					a.addClass(hoverCardOptions.linkClass);
				}
				container.setStyle('display','none');
				$(document.body).grab(container);
				container.addEvent('mouseleave', function(){
					container.setStyle('display', 'none');
				});
				a.addEvent('mouseenter', function(){
					container.position($merge({
						relativeTo: a,
						position: 'bottomLeft'
					}, positionOptions));
					container.setStyle('display', 'block');
				});
			});
			cards.push(card);
		}
	});
	return cards;
};
