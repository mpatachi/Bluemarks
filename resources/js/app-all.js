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
	},
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='directory-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='directories-list' node='" + name + "'></ul>");
		
		return holder;
	},	
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
	var directoryCount = 0;
	
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
			directories : {
				
			},
			bookmarkRef : [],
			directoriesRef : [],
			categoriesRef : [],
			directoryTree : [],
						
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
				var ref = {
					id : categoryCount,
					realId : $c.id 
				};
				this.categoriesRef.push(ref);
			},			
			storeAllCategories : function($list) {
				var me = this;
				var l = $list.length;
				var entity = BM.Entities;
				for (var i = 0; i < l; i++) {
					me.storeCategory($list[i]);
				}
			},
			storeDirectory : function($directory, $id) {
				var returnId;
				var dir = new BM.Entities.Directory(
							$directory.id,
							$directory.name,
							$directory.parentId
					);
				if ($id == undefined) {
					directoryCount++;					
					var ref = {
						id : directoryCount,
						realId : $directory.id
					};
					dir.intId = directoryCount;
					this.directories[directoryCount] = {
						directory : dir
					};					
					this.directoriesRef.push(ref);
					returnId = directoryCount;
				} else {
					dir.intId = $id;
					this.directories[$id] = {
						directory : dir
					};
					returnId = $id;
				}
				
				return this.directories[returnId];
			},
			storeAllDirectories : function($list) {
				var me = this;
				var l = $list.length;
				var root = new BM.Entities.Relationer('root', []);
				var check = false;
				var currentItem;
				/*
				 * for each item in the list create a new directory entity and pass
				 * the values of the properties after that add it into the internal data
				 * structure
				 */
				for (var i = 0; i < l; i++) {
					var item = $list[i];
					var pId = item.parentId;
					
					if (false === check) {
						currentItem = me.storeDirectory(item);
					} else {
						var di = search(me.directoriesRef, function(obj) {
							return obj.realId == item.id;
						}, false, true);
						
						if (-1 !== di) {
							currentItem = me.storeDirectory(item, di.id);
						} else {
							currentItem = me.storeDirectory(item);
						}
					}

					var intId = currentItem.directory.intId;
					
					/*
					 * if the parent id of the item is null add it to root
					 */
					if (pId == null) {
						root.children.push(intId);
					} else {
						/*
						 * else if the parent id is set then search in the
						 * directories reference for the existence of the directory
						 */
						var refId;
						var r = search(me.directoriesRef, function(obj) {
							return obj.realId == pId;
						}, false, true);
						
						if (-1 == r) {
							/*
							 * if the directory does not exist yet then 
							 * create a temporary holder for it 
							 * we just set the id of the directory 
							 */
							check = true;	//we set the check value to search later for existing references
							var temp = {
								id : pId,
								name : null,
								parentId : null
							};
							me.storeDirectory(temp);
							refId = directoryCount; //set the reference id to the latest directory
						} else {
							refId = r.id;	//if there is a reference the we se only the reference id
						}

						/*
						 * we search for an existing instance in the directory tree
						 */
						var rs = search(me.directoryTree, function(obj) {
							return obj.ref == 'directory-' + refId;
						}, true);
						/*
						 * if there is an instance then we add the internal id of the item
						 * to it's children
						 * 
						 * if not then we create a new instance and we add the internal id of the item
						 * to it's children 
						 */
						if (-1 !== rs) {
							me.directoryTree[rs].children.push(intId);
						} else {
							var item = new BM.Entities.Relationer('directory-' + refId, [intId]);
							me.directoryTree.push(item);
						}
					}
				}
				me.directoryTree.push(root);
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
				// var r = search(this.directories, function(obj) {
					// if (obj.id == id) {
						// return obj;	
					// }
				// }, false, true);
// 				
				// if (-1 !== r) {
					// return r;
				// }
// 				
				// return null;
				return this.directories[id];
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
	var Directory = function(id, name, parentId, intId) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		this.intId = intId;
		//this.realParentId = realParentId;
	};
	
	return function(id, name, parentId, intId) {
		return new Directory(id, name, parentId, intId);
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
	
	getDirectoriesHolder : function() {
		return $(this.directoryHolder);
	},
	listDirectories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Directories;
		var utils = BM.utils;
		// _(storage.directoriesRef).each(function(obj) {
			// var listTemplate = t.listTemplate(obj.ref);
// 			
			// _(obj.children).each(function(index) {
				// var item = storage.getDirectory(index);
				// var listItem = t.itemTemplate(item.name, item.id, 'directory-' + item.id, obj.ref);
				// listTemplate.append(listItem);
			// });
// 			
			// /*
			 // * add the templates to the DOM
			 // * TODO: the items are added directly should run through a templating
			 // * 		 system.
			 // */
			// t.directoriesListHolder().append(listTemplate);
		// });
		_(storage.directoryTree).each(function(obj) {
			var listTemplate = t.listTemplate(obj.ref);

			_(obj.children).each(function(index) {
				var item = storage.getDirectory(index).directory;
				var dirRef = 'directory-' + item.intId;
				var r = utils.search(storage.directoryTree, function(it) {
					return it.ref == dirRef;
				});
				if (-1 === r) {
					dirRef = 'none';
				}
				var listItem = t.itemTemplate(item.name, item.intId, dirRef, obj.ref);
				listTemplate.append(listItem);
			});
			
			t.directoriesListHolder().append(listTemplate);
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
			var item = $(this);
			var targetNode = item.attr('node-target');
			if (targetNode !== 'none') {
				var target = $(".directories-list[node='" + targetNode + "']");
				if(target.length > 0) {
					var toHide = item.parents('.directories-list');
					var parentNode = item.attr('node-parent');
					me.hideDirectories(toHide);
					me.showDirectories(target);
					dirNavigator.attr('node-target', parentNode);
					me.activeDirectory = target;	//introduce the active directory
					me.activeList.push(target);	//introduce the active directory to the active dir list 
				}
			}

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