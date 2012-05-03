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
		//var origin = win.origin;
		var hostname = win.hostname;
		var protocol = win.protocol;
		var origin = protocol + '//' + hostname;
		
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
		var holder = $("<ul class='list-for-" + name + " directories-list' node='" + name + "'></ul>");
		
		return holder;
	},
	getAddModal : function() {
		var modal = $('#add-directory-modal');
		var submitBtn = modal.find('.modal-directory-add');
		var nameField = modal.find('.modal-directory-name');
		var selector = modal.find('.modal-parent-selector');
		var nameGroup = modal.find('.modal-name-group');
		var parentGroup = modal.find('.modal-parent-group');
		
		return {
			el : modal,
			submit : submitBtn,
			name : nameField,
			selector : selector,
			nameGroup : nameGroup,
			parentGroup : parentGroup
		};
	}	
};

BM.Templater.Categories = {
	ddCategoryHolder : function() {
		return $('.categories-dropdown');
	},
	getAddModal : function() {
		var modal = $('#add-category-modal');
		var submitBtn = modal.find('.modal-category-add');
		var nameField = modal.find('.modal-category-name');
		var nameGroup = modal.find('.modal-name-group');
		
		return {
			el : modal,
			submit : submitBtn,
			name : nameField,
			nameGroup : nameGroup,
		};		
	}
};

BM.Templater.Bookmarks = {
	bookmarksList : function() {
		return $('.bookmarks-list');
	},
	bookmarkTemplate : function(id, name, directory, category, type, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-directory='" + directory + "' bookmark-category='" + category + "' bookmark-type='" + type + "' ></li>");
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
				var dirId;		
				bookmarkCount++;
				var catIds = [];
				var categories = $b.categoriesId.split(' ');
				_(categories).each(function(cat) {
					_(me.categoriesRef).each(function(obj) {
						if (obj.realId == cat) {
							catIds.push(obj.id);
						}
					});
				});
				if ($b.directoryId != null) {
					var di = search(me.directoriesRef, function(obj) {
						return obj.realId == $b.directoryId;
					}, false, true);
					
					if (-1 !== di) {
						dirId = di.id;
					}					
				} else {
					dirId = 0;
				}
								
				var real = {
					id : $b.id, 
					name : $b.name, 
					directoryId : $b.directoryId, 
					categoriesId : $b.categoriesId, 
					typeId : $b.typeId, 
					noteId : $b.noteId,
					description : $b.description,
					url : $b.url,
					image : $b.image					
				};
				var proxy = {
					intId : bookmarkCount,
					directoryId : dirId,
					typeId : $b.typeId,
					categoriesId : catIds,
					url : $b.url,
					image : $b.image
				};
				//(id, name, dirId, catIds, typeId, noteId, description, url, img) -- old implementation
				// (proxy, real)
				var bookmark = new BM.Entities.Bookmark(
					proxy,
					real
				);
				me.bookmarks[bookmarkCount] = {
					bookmark : bookmark
				};
				
				return me.bookmarks[bookmarkCount];			
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
					$c.name,
					categoryCount
				);
				this.categories[categoryCount] = {
					category : category
				};
				var ref = {
					id : categoryCount,
					realId : $c.id 
				};
				this.categoriesRef.push(ref);
				
				return this.categories[categoryCount];
			},			
			storeAllCategories : function($list) {
				var me = this;
				var l = $list.length;
				var entity = BM.Entities;
				for (var i = 0; i < l; i++) {
					me.storeCategory($list[i]);
				}
			},
			addToDirectoryTree : function(directory) {
				var me = this;
				var ref = 'root';
				if (directory.parentId != 'null') {
					ref = 'directory-' + directory.parentId;
				}
				var rs = search(me.directoryTree, function(obj) {
					return obj.ref == ref;
				}, true);
						
				if (-1 !== rs) {
					me.directoryTree[rs].children.push(directory.intId);
				} else {
					var item = new BM.Entities.Relationer(ref, [directory.intId]);
					me.directoryTree.push(item);
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
			},
			dumpDirectories : function() {
				directoryCount = 0;
				this.directories = {};
				this.directoriesRef = [];
				this.directoryTree = [];
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
	var Bookmark = function(proxy, real) {
		this.proxy = proxy;
		this.real = real;
	};
	// var Bookmark = function(id, name, dirId, catIds, typeId, noteId, description, url, img) {
		// this.id = id;
		// this.name = name;
		// this.directoryId = dirId;
		// this.categoriesId = catIds;
		// this.typeId = typeId;
		// this.noteId = noteId;
		// this.description = description;
		// this.url = url;
		// this.image = img;
	// };
// 	
	// return function(id, name, dirId, catIds, typeId, noteId, description, url, img) {
		// return new Bookmark(id, name, dirId, catIds, typeId, noteId, description, url, img);
	// };
	return function(proxy, real) {
		return new Bookmark(proxy, real);
	}
})();

BM.Entities.Category = (function() {
	var Category = function(id, name, intId) {
		this.id = id;
		this.name = name;
		this.intId = intId;
	};
	
	return function(id, name, intId) {
		return new Category(id, name, intId);
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
	addDirectory : function(name, parentId) {
		var me = this;
		var storage = BM.Storage.g();
		var intParentId = parentId;
		 
		if (parentId != 'null') {
			var utils = BM.utils;
			var r = utils.search(storage.directoriesRef, function(obj) {
				return obj.id == parentId;
			});
			
			if (-1 !== r) {
				parentId = storage.directoriesRef[r].realId;
			}
		}
					
		var params = {
			name : name,
			parentId : parentId
		};
		BM.p('directories/add', function(response) {
			if (response.status === 'ok') {
				var directory = {
					id : response.data.id,
					name : name,
					parentId : parentId
				};
				var newDirectory = storage.storeDirectory(directory);
				newDirectory.directory.parentId = intParentId;
				storage.addToDirectoryTree(newDirectory.directory);
				BM.Directories.View.addDirectoryToList(newDirectory.directory);
				$(document).trigger('add-directory-success', [response.msg]);
			} else {
				$(document).trigger('add-directory-error', [response.msg]);
			}
		}, params);
	},
	updateDirectoriesList : function() {
		BM.Storage.g().dumpDirectories();
		this.getDirectories(function() {
 			BM.Directories.View.init();
 		});		
	},
	init : function() {
		var me = this;
 		me.getDirectories(function() {
 			BM.Directories.View.init();
 			BM.Directories.View.AddDirectory.init();
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
	addDirectoryToList : function(directory) {
		var targetNode;
		var utils = BM.utils;
		var storage = BM.Storage.g();
		var t = BM.Templater.Directories;
		if (directory.parentId != 'null') {
			// var r = utils.search(storage.directoriesRef, function(i) {
				// return i.realId == directory.parentId;
			// });
			
			// if (-1 !== r) {
				// var nodeId = storage.directoriesRef[r].id;
				// targetNode = 'directory-' + nodeId;
				// var listTemplate = t.listTemplate(targetNode);
				// var node = $(".directory-btn[node-id='" + nodeId + "']");
				// node.attr('node-target', targetNode);
			// }
			var nodeId = directory.parentId;	//i have overwriten the parentId with the internal pId
			targetNode = 'directory-' + nodeId;
			var listTemplate = t.listTemplate(targetNode);
			var node = $(".directory-btn[node-id='" + nodeId + "']");
			node.attr('node-target', targetNode);
			t.directoriesListHolder().append(listTemplate);
		} else {
			targetNode = 'root';
		}
		var dirRef = 'directory-' + directory.intId;
		var r = utils.search(storage.directoryTree, function(it) {
			return it.ref == dirRef;
		});
		if (-1 === r) {
			dirRef = 'none';
		}
		var listItem = t.itemTemplate(directory.name, directory.intId, dirRef, targetNode);
		var target = $(".directories-list[node='" + targetNode + "']");
		target.append(listItem);
	},
	listDirectories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Directories;
		var utils = BM.utils;
		
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
		var dList = $('.directories-list');
		var d = $(document);
		var dirNavigator = $('.directories-breadcum-navigation');
		var dirHolder = $('.directories-list-holder');
		
		dirHolder.on('click', '.directory-btn', function(event) {
			var item = $(this);
			var targetNode = item.attr('node-target');
			var nodeId = parseInt(item.attr('node-id'), 10);
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
					dirHolder.attr('active-node', nodeId);
				}
				
				d.trigger('sorter-activate-multiple-directories', [nodeId]);
			} else {
				d.trigger('sorter-activate-directory', [nodeId]);
			}
			
			//BM.Bookmarks.Sorter.g().activateDirectory(nodeId);	
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
				
				var temp = t[l-1].attr('node').split('-');
				var diactivate = parseInt(temp[1], 10);
				temp = t[l-2].attr('node').split('-');
				var activate = parseInt(temp[1], 10);
				if (temp[0] == 'root') {
					active = -1;
				}
				d.trigger('sorter-diactivate-multiple-directories', [diactivate]);	
				d.trigger('sorter-activate-multiple-directories', [activate]);
				dirHolder.attr('active-node', activate);
				
				me.activeList.splice(l-1, 1);			
			}

			return false;
		});
		
		var addDirInput = $('.add-new-directory');
		var addDirBtn = $('.add-directory-shortcut-btn');
		addDirInput.keyup(function(e) {
			if (e.keyCode == 27) {
				addDirInput.fadeOut(function() {
					addDirBtn.fadeIn();
				});
			}
		});
		addDirInput.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			
			var parent = dirHolder.attr('active-node');
			if (parent == -1) {
				parent = 'null';
			}
			d.trigger('add-directory', [addDirInput.val(), parent]);
			addDirInput.val('');
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirInput.blur(function() {
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirBtn.on('click', function() {
			$(this).fadeOut(function() {
				addDirInput.fadeIn();
				addDirInput.focus();
			});
			
			return false;
		});
	},
	init : function() {
		var me = this;
		$('.directories-list-holder').empty();
		
		me.listDirectories(function() {
			var r = $(".directories-list[node='root']");
			me.activeList.push(r);
			me.showDirectories(r);
			me.bindHandlers();
		});
	} 
};	/**
 * @author Robert
 * Directories.View.AddDirectory.js
 */

BM.Directories.View.AddDirectory = {
	modal : function() {
		return $('#add-directory-modal');
	},
	bindHandlers : function() {
		var modal = $('#add-directory-modal');
		var submitBtn = modal.find('.modal-directory-add');
		var nameField = modal.find('.modal-directory-name');
		var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		submitBtn.on('click', function() {
			d.trigger('add-directory', [nameField.val(), selector.val()]);
			
			return false;
		});
	},
	listParents : function(callback) {
		var storage = BM.Storage.g().directories;
		var selector = this.modal().find('.modal-parent-selector');

		_(storage).each(function(obj) {
			var item = "<option value='" + obj.directory.intId + "'>" + obj.directory.name + "</option>";
			selector.append(item);
		});
		
		BM.e(callback);
	},
	init : function() {
		var me = this;
		
		me.listParents();
		me.bindHandlers();
	}
};
/**
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
	addCategory : function(name, callback) {
		var params = {
			name : name
		};
		BM.p('categories/add', function(response) {
			if (response.status === 'ok') {
				var category = {
					id : response.data.id,
					name : name
				};
				var newCategory = BM.Storage.g().storeCategory(category);
				BM.Categories.View.addCategoryToList(newCategory.category);
				$(document).trigger('add-category-success', [response.msg]);
			} else {
				$(document).trigger('add-category-error', [response.msg]);
			}
		}, params);
	},
	init : function() {
		var me = this;
		me.getCategories(function() {
			BM.Categories.View.init();
			BM.Categories.View.AddCategory.init();
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
		
		if (callback !== undefined) {
			BM.e(callback);	
		}
	},
	addCategoryToList : function(category, callback) {
		var me = this;
		var itemTample = me.ddItemTemplate(category.name, category.intId);
		BM.Templater.Categories.ddCategoryHolder().append(itemTample);
		
		if (callback !== undefined) {
			BM.e(callback);		
		}	
	},
	bindHandlers : function() {
		$('.sort-categories').on('click', function(event) {
			var item = $(this);
			var active = item.hasClass('active');
			var toolbar = $('.categories-toolbar');
			
			if (active) {
				toolbar.animate({
					'marginTop' : 0
				}, 300, 'linear');
			} else {
				toolbar.animate({
					'marginTop' : '50px'
				}, 300, 'linear');				
			}
		});
	},
	init : function() {
		var me = this;
		
		me.listCategories(function() {
			
		});
		me.bindHandlers();
	}
};
/**
 * @author Robert
 */
BM.Categories.View.AddCategory = {
	bindHandlers : function() {
		var t = BM.Templater.Categories;
		var modal = t.getAddModal();
		//var submitBtn = modal.find('.modal-directory-add');
		//var nameField = modal.find('.modal-directory-name');
		//var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-category', [modal.name.val()]);
			
			return false;
		});
	},
	init : function() {
		var me = this;
		
		me.bindHandlers();
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
	addBookmark : function(name, url, directoryId, categoriesId, typeId, callback) {
		var params = {
			name : name,
			url : url,
			directoryId : directoryId,
			categoriesId : categoriesId,
			typeId : typeId
		};
		
		BM.p('bookmarks/add', function(response) {
			if (response.status === 'ok') {
				
			} else {
				
			}
		}, params);
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
/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var storage = BM.Storage.g();
		var t = BM.Templater.Bookmarks;
		_(storage.bookmarks).each(function(obj, key) {
			var bookmark = obj.bookmark.proxy;
			// var catName = "";
			// _(bookmark.categoriesId).each(function(cat) {
				// var r = storage.getCategory(cat);
				// catName += " " + r.category.name;
			// });
			var itemTemplate = t.bookmarkTemplate(key, bookmark.url, bookmark.directoryId, bookmark.categoriesId, bookmark.typeId);
			t.bookmarksList().append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	showBookmarks : function(filter, callback) {
		var t = BM.Templater.Bookmarks;
		t.bookmarksList().empty();
		var storage = BM.Storage.g();
		
		_(storage.bookmarks).each(function(obj, key) {
			var bookmark = obj.bookmark;
			
		});
		
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
 */

BM.Mediator = {};

BM.Mediator.Categories = {
	provide : function() {
		var d = $(document);
		var categories = BM.Categories;
		var t = BM.Templater;
		var modal = t.Categories.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add category event to the document
		 */
		d.on('add-category', function(event, name) {
			if (name == '') {
				return;
			}
			categories.addCategory(name);
		});
		/*
		 * displays error message if adding a category fails
		 */
		d.on('add-category-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});		
		/**
		 * hide the modal if the category is added with success
		 */
		d.on('add-category-success', function(event, msg) {
			modal.el.modal('hide');
		});
		/** fires when the modal is hiding
		 * 
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
		});
		/**
		 *  what happens on enter key press on the modal
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-category', [modal.name.val()]);
		});		
	}
};
BM.Mediator.Directories = {
	provide : function() {
		var d = $(document);
		var directories = BM.Directories;
		var t = BM.Templater;
		var modal = t.Directories.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add directory event to the document
		 */
		d.on('add-directory', function(event, name, parentId) {
			if (name == '') {
				return;
			}
			directories.addDirectory(name, parentId);
		});
		/*
		 * displays error message if adding a directory fails
		 */
		d.on('add-directory-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});
		/**
		 * hides the add directory modal when the success event is triggered
		 */
		d.on('add-directory-success', function(event, msg) {
			// nameGroup.removeClass('error');
			// nameGroup.addClass('success');
			// nameGroup.children('span').text(msg);
			modal.el.modal('hide');
		});
		/**
		 * resets the add directory modal on hide event
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
			modal.selector.val(modal.selector.prop('defaultSelected'));
		});
		/**
		 * adds an enter keypress event to the add directory modal 
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-directory', [modal.name.val(), modal.selector.val()]);
		});
	}
};

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document);
		var bookmarks = BM.Bookmarks;
		var sorter = bookmarks.Sorter.g();
		var t = BM.Templater;
		
		d.on('sorter-activate-directory', function(event, directoryId) {
			sorter.activateDirectory(directoryId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-activate-multiple-directories', function(event, directoryId) {
			var directoriesId = [directoryId];
			var listHolder = $('.list-for-directory-' + directoryId);
			var listItems = listHolder.find('.directory-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				directoriesId.push(index);
			});
			
			sorter.activateMultipleDirectory(directoriesId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-diactivate-multiple-directories', function(event, directoryId) {
			var directoriesId = [directoryId];
			var listHolder = $('.list-for-directory-' + directoryId);
			var listItems = listHolder.find('.directory-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				directoriesId.push(index);
			});
			
			sorter.diactivateMultipleDirectory(directoriesId);
		});
		
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			console.log(sorter.filters);
		});
	}
};

BM.Mediator.init = function() {
		this.Categories.provide();
		this.Directories.provide();
		this.Bookmarks.provide();
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
		BM.Mediator.init();
	},
	end : function() {
		
	}
};