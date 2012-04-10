/**
 * @author Robert
 * init.js
 */

$(document).ready(function() {
	BM.AppBoot.init();
});/**
 * @author Robert
 * BM.js
 */

var BM = {};

BM = {
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

BM.utils = {
	/**
	 * search function
	 * @param a array
	 * @param fnc function
	 * @param ns bool
	 * @param os bool 
	 * @return index
	 * note : if ns is set to true then if the input a is empty 
	 * -2 is returned to specifie that a is empty.
	 * 		  if os is set to true then the whole object is returned
	 * TODO: use the BM.utils.search instead.
	 */	
	search : function (a, fnc, ns, os) {
		var l = a.length;
		if (!fnc || typeof(fnc) != 'function') {
			return -1;
		}
		if (true === ns) {
			if (!a || !l) {
				return -1;
			}
			if (l < 1) {
				return -2;
			}
		} else {
			if (!a || !l || l < 1) {
				return -1;
			}
		}
		for (var i = 0; i < l; i++) {
			if (fnc(a[i])) {
				if (true === os) {
					return a[i];
				}
				return i;
			}
		}
		
		return -1;
	}
};
/**
 * @author Robert
 */

BM.Templater = {};

BM.Templater.Directories = {
	leftSidebar : function() {
		return $('.left-sidebar');
	},
	directoriesListHolder : function() {
		return $('.directories-list-holder');
	}
};

BM.Templater.Categories = {
	ddCategoryHolder : function() {
		return $('.categories-dropdown');
	}
};

BM.Templater.Bookmarks = {
	bookmarksList : function() {
		return $('.bookmarks-list');
	},
	bookmarkTemplate : function(id, name, category, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-category='" + category + "' ></li>");
		var link = $("<a href='#' class='thumbnail'></a>");
		var img = $("<img src='../resources/img/160x120.gif' alt=''>");
		var title = $("<h5>" + name + "</h5>");
		link.append(img, title);
		li.append(link);
		
		return li; 
	}
};
/**
 * @author Robert
 * Storage.js
 */

BM.Storage = (function() {
	var instantiated = false;
	var bookmarkCount = 0;
	var categoryCount = 0;
	
	function init() {
		/**
		 * private search function
		 * @param a array
		 * @param fnc function
		 * @param ns bool 
		 * @return index
		 * note : if ns is set to true then if the input a is empty 
		 * -2 is returned to specifie that a is empty.
		 * TODO: use the BM.utils.search instead.
		 */
		function search(a, fnc, ns, os) {
			var l = a.length;
			if (!fnc || typeof(fnc) != 'function') {
				return -1;
			}
			if (true === ns) {
				if (!a || !l) {
					return -1;
				}
				if (l < 1) {
					return -2;
				}
			} else {
				if (!a || !l || l < 1) {
					return -1;
				}
			}
			for (var i = 0; i < l; i++) {
				if (fnc(a[i])) {
					if (true === os) {
						return a[i];
					}
					return i;
				}
			}
			
			return -1;
		}
		
		return {
			bookmarks : {
					
			},
			categories : {
				
			},
			directories : [],
			directoriesRef : [],
			categoriesRef : [],
			
			storeBookmark : function($b) {
				var me = this;
				//this.bookmarks.push($bookmark);
				bookmarkCount++;
				var catIds = [];
				//TODO to myself: review this please it was late :))
				var categories = $b.categoriesId.split(' ');
				_(categories).each(function(cat) {
					_(me.categoriesRef).each(function(obj) {
						if (obj.realId == cat) {
							catIds.push(obj.id);
						}
					});
				});
				//(id, name, dirId, catIds, typeId, noteId, description, url, img)
				var bookmark = new BM.Entities.Bookmark(
					$b.id, 
					$b.name, 
					$b.directoryId, 
					catIds, 
					$b.typeId, 
					$b.noteId,
					$b.description,
					$b.url,
					$b.image
				);
				this.bookmarks[bookmarkCount] = {
					bookmark : bookmark
				};			
			},
			storeAllBookmarks : function($list) {
				var me = this;
				var l = $list.length;
				for (var i =0; i< l; i++) {
					me.storeBookmark($list[i]);
				}
				//console.log(me.bookmarks);
			},
			storeDirectory : function($directory) {
				this.directories.push($directory);
			},
			storeCategory : function($c) {
				categoryCount++;
				var category = new BM.Entities.Category(
					$c.id, 
					$c.name
				);
				this.categories[categoryCount] = {
					category : category
				};
				var cr = {
					id : categoryCount,
					realId : $c.id 
				};
				this.categoriesRef.push(cr);
			},			
			storeAllCategories : function($list) {
				var me = this;
				var l = $list.length;
				var entity = BM.Entities;
				for (var i = 0; i < l; i++) {
					me.storeCategory($list[i]);
				}
			},
			/*
			 * Stores all the bookmarks into an internal data structure
			 * @param object list
			 * TODO: need to implement some sort of internal id for each element
			 * 		  the server id will be too long in the future
			 */
			storeAllDirectories : function($list) {
				var me = this;
				var l = $list.length;
				var root = new BM.Entities.Relationer('root', []);
				/*
				 * for each item in the list create a new directory entity and pass
				 * the values of the properties after that add it into the internal data
				 * structure
				 */
				for (var i = 0; i < l; i++) {
					var dir = new BM.Entities.Directory(
						$list[i].id,
						$list[i].name,
						$list[i].parentId
					);
					/*
					 * create the node realtion between the directories and store them
					 * in a data structure we use a 'skeleton' entity for the item
					 */
					if ($list[i].parentId == null) {
						root.children.push($list[i].id);
					} else {
						/*
						 * check if there is a referance to the items parent id in the
						 * data structure if returns -1 then there is no referance so we
						 * create that referance, if there is one then we add the current item
						 * to that referance
						 */
						var r = search(me.directoriesRef, function(obj) {
							return obj.ref == 'directory-' + $list[i].parentId;
						}, true);
						if (-1 !== r) {
							me.directoriesRef[r].children.push($list[i].id);
						} else {
							var item = new BM.Entities.Relationer('directory-' + $list[i].parentId, [$list[i].id]);
							me.directoriesRef.push(item);
						}						
					}
					me.directories.push(dir);
				};
				me.directoriesRef.push(root);
			},
			getBookmark : function(id) {
				// var r = search(this.bookmarks, function(obj) {
					// return obj.id == $id;
				// }, false, true);
				// if (-1 !== r) {
					// return r;
				// }
// 				
				// return null;
				return this.bookmarks[id];
			},
			getCategory : function(id) {
				return this.categories[id];
			},
			getDirectory : function(id) {
				var r = search(this.directories, function(obj) {
					if (obj.id == id) {
						return obj;	
					}
				}, false, true);
				
				if (-1 !== r) {
					return r;
				}
				
				return null;
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
/**
 * @author Robert
 */

BM.Entities = {};

BM.Entities.Bookmark = (function() {
	var Bookmark = function(id, name, dirId, catIds, typeId, noteId, description, url, img) {
		this.id = id;
		this.name = name;
		this.directoryId = dirId;
		this.categoriesId = catIds;
		this.typeId = typeId;
		this.noteId = noteId;
		this.description = description;
		this.url = url;
		this.image = img;
	};
	
	return function(id, name, dirId, catIds, typeId, noteId, description, url, img) {
		return new Bookmark(id, name, dirId, catIds, typeId, noteId, description, url, img);
	};
})();

BM.Entities.Category = (function() {
	var Category = function(id, name) {
		this.id = id;
		this.name = name;
	};
	
	return function(id, name) {
		return new Category(id, name);
	};
})();

BM.Entities.Directory = (function() {
	var Directory = function(id, name, parentId) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		//this.realId = realId;
		//this.realParentId = realParentId;
	};
	
	return function(id, name, parentId) {
		return new Directory(id, name, parentId);
	};
})();

BM.Entities.Relationer = (function() {
	var Relationer = function(ref, children) {
		this.ref = ref;
		this.children = children;
	};
	
	return function(ref, children) {
		return new Relationer(ref, children);
	}
})();
/**
 * @author Robert
 * Directories.js
 */

BM.Directories = {
	directoriesRef : [],
	
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
		BM.p('directories/list_all', function(response) {
			if (response.status === 'ok') {
				BM.Storage.g().storeAllDirectories(response.data);
				BM.e(callback);
			}
			
			/* should place error provider */
		});
	},
	init : function() {
		var me = this;
 		me.getDirectories(function() {
 			BM.Directories.View.init();
 		});	
	}
};
/**
 * @author Robert
 * Directories.View.js
 */
BM.Directories.View = {
	directoryHolder : 'directories-list',
	isLoading : false,
	activeDirectory : null,
	activeList : [],
	
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='directory-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='directories-list' node='" + name + "'></ul>");
		
		return holder;
	},
	
	getDirectoriesHolder : function() {
		return $(this.directoryHolder);
	},
	listDirectories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		
		_(storage.directoriesRef).each(function(obj) {
			var listTemplate = me.listTemplate(obj.ref);
			
			_(obj.children).each(function(index) {
				var item = storage.getDirectory(index);
				var listItem = me.itemTemplate(item.name, item.id, 'directory-' + item.id, obj.ref);
				listTemplate.append(listItem);
			});
			
			/*
			 * add the templates to the DOM
			 * TODO: the items are added directly should run through a templating
			 * 		 system.
			 */
			BM.Templater.Directories.directoriesListHolder().append(listTemplate);
		});
		
		BM.e(callback);
	},
	showDirectories : function(item) {
		//var d = $(".directories-list[node='" + id + "']");
		item.fadeIn('200');
	},
	hideDirectories : function(item) {
		item.hide();
	},
	bindHandlers : function() {
		var me = this;
		var d = $('.directories-list');
		var dirNavigator = $('.directories-breadcum-navigation');

		d.on('click', 'a', function(event) {
			var id = 'directory-' + $(this).attr('node-id');
			var temp = $(".directories-list[node='" + id + "']");
			
			if(temp.length > 0) {
				var toHide = $(this).parents('.directories-list');
				var parentNode = toHide.attr('node');
				me.hideDirectories(toHide);
				me.showDirectories(temp);
				dirNavigator.attr('node-target', parentNode);
				me.activeDirectory = temp;	//introduce the active directory
				me.activeList.push(temp);	//introduce the active directory to the active dir list 
			}
			
			//me.showDirectories(n);	
			return false;
		});
		/*
		 * TODO: use a targeting system instead of array
		 */
		dirNavigator.on('click', function(event) {
			var t = me.activeList;
			var l = t.length;

			if (l > 1) {
				me.hideDirectories(t[l-1]);
				me.showDirectories(t[l-2]);
				me.activeList.splice(l-1, 1);
			}

			return false;
		});
	},
	init : function() {
		var me = this;
		me.listDirectories(function() {
			var r = $(".directories-list[node='root']");
			me.activeList.push(r);
			me.showDirectories(r);
			me.bindHandlers();
		});
	} 
};	/**
 * @author Robert
 */

BM.Categories = {
	getCategories : function(callback, limit) {
		BM.p('categories/list_all', function(response) {
			if (response.status === 'ok') {
				BM.Storage.g().storeAllCategories(response.data);
				BM.e(callback);
			}
		});
	},
	init : function() {
		var me = this;
		me.getCategories(function() {
			BM.Categories.View.init();
		});
	}
};
/**
 * @author Robert
 */

BM.Categories.View = {
	ddItemTemplate : function(name, id) {
		var it = $("<li><a href='#' category-id='" + id + "'>" + name + "</a></li>");
		
		return it;
	},
	listCategories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		_(storage.categories).each(function(obj, key) {
			var itemTample = me.ddItemTemplate(obj.category.name, key);
			BM.Templater.Categories.ddCategoryHolder().append(itemTample);
		});
		
		BM.e(callback);
	},
	bindHandlers : function() {
		
	},
	init : function() {
		var me = this;
		
		me.listCategories(function() {
			
		});
	}
};
/**
 * @author Robert
 */

BM.Bookmarks = {
	getBookmarks : function(callback, limit) {
		BM.p('bookmarks/list_all', function(response) {
			if (response.status === 'ok') {
				BM.Storage.g().storeAllBookmarks(response.data);
				BM.e(callback);
			}
		});
	},
	init : function() {
		var me = this;
		me.getBookmarks(function() {
			BM.Bookmarks.View.init();
		});
	}
};
/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Bookmarks;
		_(storage.bookmarks).each(function(obj, key) {
			var catName = "";
			_(obj.bookmark.categoriesId).each(function(cat) {
				var r = storage.getCategory(cat);
				catName += " " + r.category.name;
			});
			var itemTemplate = t.bookmarkTemplate(key, obj.bookmark.url, catName);
//			console.log(itemTemplate);
//			console.log(t.bookmarksList());
			t.bookmarksList().append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	init : function() {
		var me = this;
		
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
	}
};
/**
 * @author Robert
 * AppBoot.js
 */

BM.AppBoot = {
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
		BM.Directories.init();
		BM.Categories.init();
		BM.Bookmarks.init();
	},
	end : function() {
		
	}
};