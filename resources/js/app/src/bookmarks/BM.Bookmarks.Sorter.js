/**
 * @author Robert
 */

BM.Bookmarks.Sorter = (function() {
	var instantiated = false,
		d = $(document),
		storage = BM.Storage.g(),
		bookmarks = {
			active : [],
			cache : [],
			more : false,
			max : 15,
			last : 0,
			counter : 0	
		},
		filters = {
			active : {
				folder : [],
				tag : [],
				type : []
			},
			noActive : true
		};
	function init() {
		return {
			filters : filters,
			bookmarks : bookmarks,
			sortBookmarks : function() {
				var me = this;
				var byFolder = [];
				var byTag = [];
				var active = filters.active;
				var r;
				bookmarks.active = [],
				bookmarks.cache = [],
				bookmarks.more = false,
				bookmarks.max = 15,
				bookmarks.last = 0,
				bookmarks.counter = 0;				
				
				_(active.folder).each(function(f) {
					var b = storage.bookmarksByFolder[f];
					if (b) {
						byFolder.push(b);
					}
				});
				
				_(active.tag).each(function(t) {
					var b = storage.bookmarksByTag[t];
					if (b) {
						byTag.push(b);
					}
				});

				if (byTag.length == 0) {
					r = _.chain(byFolder).flatten().uniq().value();
				} else if (byFolder.length == 0) {
					r = _.chain(byTag).flatten().uniq().value();
				} else {
					var byF = _.chain(byFolder).flatten().uniq().value();
					var byT = _.chain(byTag).flatten().uniq().value();
					r = _.intersection(byF, byT);
				}
				
				bookmarks.cache = r;
				// var rest = r;
				// if (r.length > 15) {
					// rest = r.slice(0,15)
					// bookmarks.more = true;
					// bookmarks.last = 15;
					// d.trigger('more-bookmarks-available');
				// }
				// bookmarks.active = rest;
// 				
				// BM.Bookmarks.View.showBookmarks(rest);
				this.showBookmarks();
				//console.log(byFolder, byTag, r);
			},
			showBookmarks : function() {
				var	r = bookmarks.cache,
					len = bookmarks.cache.length;
				if (bookmarks.last > len) {
					d.trigger('more-bookmarks-available', [false]);
					
					return;
				}
				if (len > bookmarks.max) {
					bookmarks.counter += 1;
					var maxy = 	bookmarks.counter * bookmarks.max;				
					r = bookmarks.cache.slice(bookmarks.last,maxy);
					bookmarks.last = maxy;
					bookmarks.more = true;
					if (bookmarks.last > len) {
						bookmarks.more = false;
						d.trigger('more-bookmarks-available', [false]);
					} else {
						bookmarks.more = true;
						d.trigger('more-bookmarks-available', [true]);						
					}					
				} else {
					bookmarks.more = false;
					d.trigger('more-bookmarks-available', [false]);							
				}
				
				bookmarks.active = r;
		
				console.log('###');				
				BM.Bookmarks.View.showBookmarks(bookmarks.active);
			},
			activateFolder : function(id, callback) {
				filters.active.folder = [];
				filters.active.folder.push(id);
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			activateMultipleFolder : function(list, callback) {
				filters.active.folder = list;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			diactivateFolder : function(id, callback) {
				var r = _.reject(filters.active.folder, function(num) {
					return num == id;
				});

				filters.active.folder = r;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			diactivateMultipleFolder : function(list, callback) {
				var r = _.without(filters.active.folder, list);
				
				filters.active.folder = r;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			activateTag : function(id, callback) {
				filters.active.tag.push(id);
				
				if (callback !== undefined) {
					BM.e(callback);
				}				
			},
			diactivateTag : function(tag, callback) {
				var r = _.reject(filters.active.tag, function(value) {
					return value === tag;
				});
				
				filters.active.tag = r;

				if (callback !== undefined) {
					BM.e(callback);
				}				
			},
			activateType : function(id, callback) {
				filters.active.type.push(id);
				
				if (callback !== undefined) {
					BM.e(callback);
				}
			},
			diactivateType : function(id) {
				/**
				 * diactivation code here
				 */
			}
		};
	}
	
	return {
		getInstace : function() {
			if (!instantiated) {
				instantiated = init();
			}		
			return instantiated;
		},
		g : function() {
			if (!instantiated) {
				instantiated = init();
			}		
			return instantiated;
		}
	}
})();
