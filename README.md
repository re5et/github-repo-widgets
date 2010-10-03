Github Repo Widgets
===========

Github Repo Widgets is a MooTools plugin that allows you to fetch information regarding a Github repository using a JSONP request, and builds an HTML widget for you.

![Screenshot](http://re5et.github.com/projects/github-repo-widgets/assets/images/github-repo-widget-screenshot.png)

How to use
----------

You can use GithubRepoWidget to create a widget by doing the following:

    var myRepoWidget = new GithubRepoWidget('mootools', 'mootools-more');
    myRepoWidget.addEvent('complete', function(response, widget){
        $('myElement').grab(widget);
    });

or you can supply an element to inject into and have the complete event handled for you:

    var myRepoWidget = new GithubRepoWidget('re5et', '.dotfiles', {
        'injectInto': $('myElement')
    });

You can also use hoverCards, which will automatically find github repo links and attach hovercards to them, by running:

    GithubRepoWidget.hovercards()
