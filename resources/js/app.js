/**
 * @author Robert
 */

$(document).ready(function() {
	AppBoot.init();
});

var Storage = (function() {
	var instantiated = false;
	
	function search(a, fnc) {
		var l = a.length;
		
		if (!fnc || typeof(fnc) != 'function') {
			return -1;
		}
		if (!a || !l || l < 1) {
			return -1;
		}
		for (var i = 0; i < l; i++) {
			if (fnc(a[i])) {
				return i;
			}
		}
		
		return -1;
	}
	
	function init() {
		return {
			bookmark : {
				/* bookmark object placeholder */
			},
			category : {
				/* category object placeholder */
			},
			directory : {
				/* directory object placeholder */
				id : null,
				name : null,
				parentId : null
			},
			bookmarks : [],
			categories : [],
			directories : [],
			
			storeBookmark : function($bookmark) {
				this.bookmarks.push($bookmark);
			},
			storeAllBookmarks : function($list) {
				
			},
			storeCategory : function($category) {
				this.categories.push($category);
			},
			storeDirectory : function($directory) {
				this.directories.push($directory);
			},
			storeAllDirectories : function($list) {
				var l = $list.length;
				for (var i = 0; i < l; i++) {
					this.directories.push($list[i]);
				}
			},
			getBookmark : function($id) {
				var r = search(this.bookmarks, function(obj) {
					return obj.id == $id;
				});
				if (-1 !== r) {
					return r;
				}
				
				return null;
			},
			getCategory : function() {
				
			},
			getDirectory : function() {
				
			}
		}
	}
	
	return {
		getInstace : function() {
			if (!instantiated) {
				instantiated = init();
			}		
			return instantiated;
		}
	}
})();

var BM = {
	baseUri : function() {
		var win = window.location;
		var origin = win.origin;

		return origin;		
	},
	apiUri : function() {
		var api = this.baseUri() + '/bluemarks/api/';
		
		return api;
	},
	p : function(command, callback, params) {
		var toGet = this.apiUri() + command;
		//var uriParams = $.param(params);
		var action = $.post(toGet, params);
		action.success(callback);		
	},
	g : function(command, callback, params) {
		var toGet = this.apiUri() + command;
		var uriParams = undefined;
		
		//var uriParams = jQuery.param(params);
		// if (params) {
			// uriParams = $.param(params);
			// console.log(uriParams);	
		// }
		
		var action = $.get(toGet, params);

		action.success(callback);
	},
	e : function(fnc) {
		if (fnc && typeof(fnc) === 'function') {
			fnc();
		}
	}
};

var Categories = {
	
};

var Directories = {
	getDirectory : function(id, limit) {
		var params = {
			id : id,
			limit : limit
		};
		var directory = BM.p('directories/list', function(data) {
			console.log(data);
		}, params);
		
		return directory;
	},
	getDirectories : function(callback, limit) {
		var directories = BM.p('directories/list_all', function(response) {
			if (response.status === "ok") {
				Storage.getInstace().storeAllDirectories(response.data);
				BM.e(callback);
			}
			
			/* should place error provider */
		});
	},
	init : function() {
		var me = this;
 		me.getDirectories();	
	}
};
Directories.View = {
	directoryHolder : 'directories-list',

	getDirectoriesHolder : function() {
		return $(this.directoryHolder);
	},
	listDirectories : function() {
		
	} 
};
var AppBoot = {
	user : {},

	getInfo : function() {
		var me = this;		
		var info = BM.p('info/app_boot', function(response) {
			me.user = response.data;
			me.displayUser();
		});
	},
	displayUser : function() {
		var holder = $('.current-user');
		holder.text(this.user.email);
	},
	init : function() {
		var me = this;
		me.getInfo();
		Directories.init();
	},
	end : function() {
		
	}
};
