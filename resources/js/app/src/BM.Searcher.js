/**
 * @author Robert
 */

BM.Searcher = {
	omnibar : null,
	results : [],
	config : {
		tag : true,
		folder : true,
		bookmark : true,
	},
	bindHandlers : function() {
		var me = this;
		var bookmarks = BM.Storage.g().bookmarks;
		me.omnibar.on('input', function(event) {
			var value = this.value;
			var len = value.length;
			if (len == 0) {
				me.omnibar.popover('hide');
			}
			me.results = [];
			if (len >= 2) {
				_(bookmarks).each(function(obj) {
					var o = obj.bookmark.proxy;
					var q = new RegExp(value, "i");
					var s = o.name.search(q);
					if (s > -1) {
						me.results.push(o);
					}
				});
				me.omnibar.popover('show');
				console.log(me.results);
			}
		});
	},
	addPopovers : function() {
		var me = this;
		me.omnibar.popover({
			placement : 'bottom',
			trigger : 'manual',
			title : function() {
				return 'search results';
				//return target.children('.title').html();
			},
			content : function() {
				var r = me.results;
				var html = [];
				if (r.length == 0) {
					html.push('<p>no results</p>');
				}
				for (var i = 0, l = r.length; i < l; i++) {
					html.push("<a href='" + r[i].url + "' class='search-result' target='_blank'>" + r[i].name + "</a><div class='search-separator'></div>");
				}

				return html.join('');
				//return target.children('.content').html();
			}
		});
		$('.search-btn').on('click', function() {
			return false;
		});
	},
	init : function() {
		var me = this;
		me.omnibar = $('#omnibar-input');
		me.bindHandlers();
		me.addPopovers();
	}
};
