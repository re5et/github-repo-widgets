/*
---
script: github-repo-widget.js

description: Github repo widget, fetches repo information from github and displays it

license: MIT-style

authors: [atom smith]

requires:
- core/1.2.4: [Class.Extras, Element.Event, Element.Style, Selectors]
- more/1.2.4.4: [Request.JSONP]

provides: [GithubRepoWidget]
...
*/

var GithubRepoWidget = new Class({

	Implements: [Options, Events],

	options: {
		buildWidget: true,
		injectInto: false,
		dateFormat: '%b %d, %Y',
		containerElement: 'div',
		containerOptions: {
			'class': 'github-repo-widget'
		}
	},

	initialize: function(user, repo, options){
		this.setOptions(options);
		this.requestUrl = 'http://github.com/api/v2/json/repos/show/' + user + '/' + repo;
		if(this.options.injectInto){
			this.loading();
		}
		this.getInfo();
		return this;
	},

	loading: function(){
		this.options.injectInto.grab(new Element('span', {
			'class': 'github-repo-widget-loading',
			text: 'loading github repo widget...'
		}));
	},

	getInfo: function(){
		new Request.JSONP({
			url: this.requestUrl,
			onComplete: function(response){
				this.repo = response.repository;
				if(this.options.buildWidget){
					this.html = this.buildWidget();
				} else {
					this.html = false;
				}
				this.fireEvent('complete', [response, this.html]);
			}.bind(this)
		}).send();
	},

	buildWidget: function(){
		var container = new Element(this.options.containerElement, this.options.containerOptions);
		var main = new Element('div', {
			'class': 'main'
		});
		container.grab(main);

		var possessive = (this.repo.owner[this.repo.owner - 1] == 's') ? "'" : "'s";

		var owner = new Element('a', {
			'class': 'owner',
			href: 'http://github.com/'+this.repo.owner,
			text: this.repo.owner + possessive
		});
		main.grab(owner);

		var name = new Element('a', {
			'class': 'name',
			href: this.repo.url,
			text: this.repo.name
		});
		main.grab(name);

		if(this.repo.fork){
			var forked_from = new Element('p', {
				text: 'forked from: '
			});

			forked_from.grab(new Element('a', {
				text: this.repo.parent,
				href: 'http://github.com/' + this.repo.parent
			}));
			main.grab(forked_from);
		}

		var description = new Element('p', {
			'class': 'description',
			text: this.repo.description
		});
		main.grab(description);

		var created = new Element('p', {
			'class': 'created_at',
			text: 'created: ' +
				new Date.parse(this.repo.created_at).format(this.options.dateFormat)
		});
		main.grab(created);

		var updated = new Element('p', {
			'class': 'last_push',
			text: 'updated: ' +
				new Date.parse(this.repo.pushed_at).format(this.options.dateFormat)
		});
		main.grab(updated);

		var quicklinks = new Element('ul', {
			'class': 'quicklinks'
		});

		if(this.repo.homepage){
			var homepage = new Element('li', {
				'class': 'homepage'
			});
			homepage.grab(new Element('a', {
				text: 'homepage',
				href: this.repo.homepage
			}));
			quicklinks.grab(homepage);
		}

		var watchers = new Element('li', {
			'class': 'watchers'
		});
		watchers.grab(new Element('a', {
			text: 'watchers ' + this.repo.watchers,
			href: this.repo.url + '/watchers'
		}));
		quicklinks.grab(watchers);

		var forks = new Element('li', {
			'class': 'forks'
		});
		forks.grab(new Element('a', {
			text: 'forks ' + this.repo.forks,
			href: this.repo.url + '/network'
		}));

		quicklinks.grab(forks);

		if(this.repo.has_issues){
			var issues = new Element('li', {
				'class': 'issues'
			});
			issues.grab(new Element('a', {
				text: 'issues ' + this.repo.open_issues,
				href: this.repo.url + '/issues'
			}));
			quicklinks.grab(issues);
		}

		if(this.repo.has_downloads){
			var downloads = new Element('li', {
				'class': 'downloads'
			});
			downloads.grab(new Element('a', {
				text: 'downloads',
				href: this.repo.url + '/downloads'
			}));
			quicklinks.grab(downloads);
		}

		if(this.repo.has_wiki){
			var wiki = new Element('li', {
				'class': 'wiki'
			});
			wiki.grab(new Element('a', {
				text: 'wiki',
				href: this.repo.url + '/wiki'
			}));
			quicklinks.grab(wiki);
		}

		container.grab(quicklinks);

		container.grab(new Element('hr', {
			styles: {
				clear:'both',
				margin:0,
				padding:0
			}
		}));

		if(this.options.injectInto){
			this.options.injectInto.empty();
			this.options.injectInto.grab(container);
		}

		return container;
	}

});
