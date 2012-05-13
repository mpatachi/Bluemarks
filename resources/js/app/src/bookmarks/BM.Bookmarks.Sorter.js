/**
 * @author Robert
 */

BM.Bookmarks.Sorter = (function() {
	var instantiated = false;
	var d = $(document);
	var storage = BM.Storage.g();
	var bookmarks = {
		active : [],
		cache : []	
	};
	var filters = {
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
				
				_(active.folder).each(function(f) {
					var b = storage.bookmarksByFolder[f];
					if (b) {
						byFolder = b;
					}
				});
				
				_(active.tag).each(function(t) {
					var b = storage.bookmarksByTag[t];
					if (b) {
						byTag = t;
					}
				});
				if (byTag.length == 0) {
					r = byFolder;
				} else {
					r = _.intersection(byFolder, byTag);
				}
				
				BM.Bookmarks.View.showBookmarks(r);
				console.log(byFolder, byTag, r);
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
			diactivateFolder : function(id) {
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
			activateTag : function(id) {
				filters.active.tag.push(id);
			},
			diactivateTag : function(id) {
				/**
				 * diactivation code here
				 */
			},
			activateType : function(id) {
				filters.active.type.push(id);
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
