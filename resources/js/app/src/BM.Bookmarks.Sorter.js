/**
 * @author Robert
 */

BM.Bookmarks.Sorter = (function() {
	var instantiated = false;
	var d = $(document);
	var filters = {
		active : {
			directory : [],
			category : [],
			type : []
		},
		noActive : true
	};
	function init() {
		return {
			filters : filters,
			activateDirectory : function(id, callback) {
				filters.active.directory = [];
				filters.active.directory.push(id);
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			activateMultipleDirectory : function(list, callback) {
				filters.active.directory = list;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			diactivateDirectory : function(id) {
				var r = _.reject(filters.active.directory, function(num) {
					return num == id;
				});

				filters.active.directory = r;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			diactivateMultipleDirectory : function(list, callback) {
				var r = _.without(filters.active.directory, list);
				
				filters.active.directory = r;
				
				if (callback !== undefined) {
					BM.e(callback);
				}
				//d.trigger('sort-bookmarks');
			},
			activateCategory : function(id) {
				filters.active.category.push(id);
			},
			diactivateCategory : function(id) {
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
		}
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
