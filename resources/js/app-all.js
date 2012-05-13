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

BM.Entities.Tag = (function() {
	var Tag = function(id, name, intId) {
		this.id = id;
		this.name = name;
		this.intId = intId;
	};
	
	return function(id, name, intId) {
		return new Tag(id, name, intId);
	};
})();

BM.Entities.Folder = (function() {
	var Folder = function(id, name, parentId, intId) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		this.intId = intId;
		//this.realParentId = realParentId;
	};
	
	return function(id, name, parentId, intId) {
		return new Folder(id, name, parentId, intId);
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
 */

BM.Promiser = (function() {
	var gettingFolders = new $.Deferred(),
	gettingTags = new $.Deferred(),
	gettingBookmarks = new $.Deferred(),
	storingFolders = new $.Deferred(),
	storingTags = new $.Deferred(),
	storingBookmarsk = new $.Deferred(),
	fixingNoFolder = new $.Deferred(),
	instantiated = null;

	function init() {
			
		return {
			fixingNoFolder : fixingNoFolder,
			gettingFolders : gettingFolders,
			gettingTags : gettingTags,
			gettingBookmarks : gettingBookmarks,
			storingFolders : storingFolders,
			storingTags : storingTags,
			storingBookmarsk : storingBookmarsk
		};
	}
	
	return {
		g : function() {
			if (!instantiated) {
				instantiated = init();
			}
			
			return instantiated;
		}
	};
})();
/**
 * @author Robert
 * Storage.js
 */

BM.Storage = (function() {
	var instantiated = false;
	var bookmarkCount = 0;
	var tagCount = 0;
	var folderCount = 0;
	
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
			tags : {
				
			},
			folders : {
				
			},
			bookmarksByTag : {
				
			},
			bookmarksByFolder : {
				
			},
			bookmarkRef : [],
			foldersRef : [],
			tagsRef : [],
			folderTree : [],
			tagsName : [],
						
			storeBookmark : function($b) {
				var me = this;
				var dirId;		
				bookmarkCount++;
				// var tagsIds = [];
				// var tags = $b.tagsId.split(' ');
				// var tagsRef = me.tagsRef;
				// _(tags).each(function(cat) {
					// _(tagsRef).each(function(obj) {
						// if (obj.realId == cat) {
							// tagsIds.push(obj.id);
						// }
					// });
				// });
				
				if ($b.folderId != null) {
					var di = search(me.foldersRef, function(obj) {
						return obj.realId == $b.folderId;
					}, false, true);
					
					if (-1 !== di) {
						dirId = di.id;
					}					
				} else {
					dirId = 0;
				}
								
				var real = {
					id : $b.id, 
					//name : $b.name, 
					folderId : $b.folderId, 
					//tags : $b.tags, 
					//typeId : $b.typeId, 
					noteId : $b.noteId,
					description : $b.description,
					//url : $b.url,
					//image : $b.image					
				};
				var proxy = {
					intId : bookmarkCount,
					folderId : dirId,
					typeId : $b.typeId,
					tags : $b.tags,
					name : $b.name, 					
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
				me.bookmarksByFolder[dirId] = me.bookmarksByFolder[dirId] || [];
				me.bookmarksByFolder[dirId].push(bookmarkCount);
				var tag = $b.tags.split(',');
				_(tag).each(function(item) {
					me.bookmarksByTag[item] = me.bookmarksByTag[item] || [];
					me.bookmarksByTag[item].push(bookmarkCount);
				});
				return me.bookmarks[bookmarkCount];			
			},
			storeAllBookmarks : function($list) {
				var me = this;
				var l = $list.length;
				for (var i = 0; i< l; i++) {
					me.storeBookmark($list[i]);
				}
				BM.Promiser.g().storingBookmarsk.resolve();
			},
			storeTag : function($c) {
				tagCount++;
				
				var ref = {
					id : tagCount,
					realId : $c.id 
				};
				
				this.tagsRef.push(ref);
				this.tagsName.push($c.name);
								
				var tag = new BM.Entities.Tag(
					$c.id, 
					$c.name,
					tagCount
				);
				this.tags[tagCount] = {
					tag : tag
				};

				return this.tags[tagCount];
			},			
			storeAllTags : function($list) {
				var me = this;
				var l = $list.length;
				var entity = BM.Entities;
				for (var i = 0; i < l; i++) {
					me.storeTag($list[i]);
				}
				
				BM.Promiser.g().storingTags.resolve(); //resolve the promise
			},
			addToFolderTree : function(folder) {
				var me = this;
				var ref = 'root';
				if (folder.parentId != 'null') {
					ref = 'folder-' + folder.parentId;
				}
				var rs = search(me.folderTree, function(obj) {
					return obj.ref == ref;
				}, true);
						
				if (-1 !== rs) {
					me.folderTree[rs].children.push(folder.intId);
				} else {
					var item = new BM.Entities.Relationer(ref, [folder.intId]);
					me.folderTree.push(item);
				}				
			},
			storeFolder : function($folder, $id) {
				var returnId;
				var dir = new BM.Entities.Folder(
							$folder.id,
							$folder.name,
							$folder.parentId
					);
				if ($id == undefined) {
					folderCount++;					
					var ref = {
						id : folderCount,
						realId : $folder.id
					};
					dir.intId = folderCount;
					this.folders[folderCount] = {
						folder : dir
					};					
					this.foldersRef.push(ref);
					returnId = folderCount;
				} else {
					dir.intId = $id;
					this.folders[$id] = {
						folder : dir
					};
					returnId = $id;
				}
				
				return this.folders[returnId];
			},
			noFolderFix : function() {
				var root = new BM.Entities.Relationer('root', [0]);
				this.folderTree.push(root);
				BM.Promiser.g().storingFolders.resolve();				
			},
			storeAllFolders : function($list) {
				var me = this;
				var l = $list.length;
				var root = new BM.Entities.Relationer('root', [0]);
				var check = false;
				var currentItem;
				/*
				 * for each item in the list create a new folder entity and pass
				 * the values of the properties after that add it into the internal data
				 * structure
				 */
				for (var i = 0; i < l; i++) {
					var item = $list[i];
					var pId = item.parentId;
					
					if (false === check) {
						currentItem = me.storeFolder(item);
					} else {
						var di = search(me.foldersRef, function(obj) {
							return obj.realId == item.id;
						}, false, true);
						
						if (-1 !== di) {
							currentItem = me.storeFolder(item, di.id);
						} else {
							currentItem = me.storeFolder(item);
						}
					}

					var intId = currentItem.folder.intId;
					
					/*
					 * if the parent id of the item is null add it to root
					 */
					if (pId == null) {
						root.children.push(intId);
					} else {
						/*
						 * else if the parent id is set then search in the
						 * folders reference for the existence of the folder
						 */
						var refId;
						var r = search(me.foldersRef, function(obj) {
							return obj.realId == pId;
						}, false, true);
						
						if (-1 == r) {
							/*
							 * if the folder does not exist yet then 
							 * create a temporary holder for it 
							 * we just set the id of the folder 
							 */
							check = true;	//we set the check value to search later for existing references
							var temp = {
								id : pId,
								name : null,
								parentId : null
							};
							me.storeFolder(temp);
							refId = folderCount; //set the reference id to the latest folder
						} else {
							refId = r.id;	//if there is a reference the we se only the reference id
						}

						/*
						 * we search for an existing instance in the folder tree
						 */
						var rs = search(me.folderTree, function(obj) {
							return obj.ref == 'folder-' + refId;
						}, true);
						/*
						 * if there is an instance then we add the internal id of the item
						 * to it's children
						 * 
						 * if not then we create a new instance and we add the internal id of the item
						 * to it's children 
						 */
						if (-1 !== rs) {
							me.folderTree[rs].children.push(intId);
						} else {
							var item = new BM.Entities.Relationer('folder-' + refId, [intId]);
							me.folderTree.push(item);
						}
					}
				}
				me.folderTree.push(root);
				BM.Promiser.g().storingFolders.resolve();
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
			getTag : function(id) {
				return this.tags[id];
			},
			getFolder : function(id) {
				// var r = search(this.folders, function(obj) {
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
				return this.folders[id];
			},
			dumpFolders : function() {
				folderCount = 0;
				this.folders = {};
				this.foldersRef = [];
				this.folderTree = [];
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

BM.Templater = {};

BM.Templater.Folders = {
	leftSidebar : function() {
		return $('.left-sidebar');
	},
	foldersListHolder : function() {
		return $('.folders-list-holder');
	},
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='folder-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='list-for-" + name + " folders-list' node='" + name + "'></ul>");
		
		return holder;
	},
	getAddModal : function() {
		var modal = $('#add-folder-modal');
		var submitBtn = modal.find('.modal-folder-add');
		var nameField = modal.find('.modal-folder-name');
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

BM.Templater.Tags = {
	// ddTagHolder : function() {
		// return $('.categories-dropdown');
	// },
	// getAddModal : function() {
		// var modal = $('#add-tag-modal');
		// var submitBtn = modal.find('.modal-tag-add');
		// var nameField = modal.find('.modal-tag-name');
		// var nameGroup = modal.find('.modal-name-group');
// 		
		// return {
			// el : modal,
			// submit : submitBtn,
			// name : nameField,
			// nameGroup : nameGroup,
		// };		
	// },
	tagTypeahead : function() {
		return $('.apply-tag-input');
	}
};

BM.Templater.Bookmarks = {
	bookmarksList : function() {
		return $('.bookmarks-list');
	},
	getAddModal : function() {
		var modal = $('#add-bookmark-modal');
		var submitBtn = modal.find('.modal-bookmark-add-confirm');
		var urlField = modal.find('.modal-bookmark-url');
		var folderField = modal.find('.modal-bookmark-folder');
		var tagsField = modal.find('.modal-bookmark-tags');
		var urlGroup = modal.find('.modal-url-group');
		var folderGroup = modal.find('.modal-folder-group');
		var tagsGroup = modal.find('.modal-tags-group');
		
		return {
			el : modal,
			submit : submitBtn,
			url : urlField,
			folder : folderField,
			tags : tagsField,
			urlGroup : urlGroup,
			folderGroup : folderGroup,
			tagsGroup : tagsGroup
		};
	},	
	bookmarkTemplate : function(id, name, url, folder, tag, type, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-folder='" + folder + "' bookmark-tag='" + tag + "' bookmark-type='" + type + "' ></li>");
		var link = $("<a href='" + url + "' target='_blank' class='thumbnail'></a>");
		var img = $("<img src='../resources/img/160x120.gif' alt=''>");
		var title = $("<h5>" + name + "</h5>");
		link.append(img, title);
		li.append(link);
		
		return li; 
	}
};
/**
 * @author Robert
 * Folders.js
 */

BM.Folders = {
	foldersRef : [],
	
	getFolder : function(id, limit) {
		var params = {
			id : id,
			limit : limit
		};
		var folder = BM.p('folders/list', function(data) {
			console.log(data);
		}, params);
		
		return folder;
	},
	getFolders : function(callback, limit) {
		BM.p('folders/list_all', function(response) {
			if (response.status === 'ok') {
				//BM.Storage.g().storeAllFolders(response.data);
				BM.Promiser.g().gettingFolders.resolve(response.data);
				if (callback != undefined) {
					BM.e(callback);
				}
			} else if (response.status === 'error') {
				BM.Promiser.g().fixingNoFolder.resolve();
			}
			
			/* should place error provider */
		});
	},
	addFolder : function(name, parentId) {
		var me = this;
		var storage = BM.Storage.g();
		var intParentId = parentId;
		 
		if (parentId != 'null') {
			var utils = BM.utils;
			var r = utils.search(storage.foldersRef, function(obj) {
				return obj.id == parentId;
			});
			
			if (-1 !== r) {
				parentId = storage.foldersRef[r].realId;
			}
		}
					
		var params = {
			name : name,
			parentId : parentId
		};
		BM.p('folders/add', function(response) {
			if (response.status === 'ok') {
				var folder = {
					id : response.data.id,
					name : name,
					parentId : parentId
				};
				var newFolder = storage.storeFolder(folder);
				newFolder.folder.parentId = intParentId;
				storage.addToFolderTree(newFolder.folder);
				BM.Folders.View.addFolderToList(newFolder.folder);
				//$(document).trigger('add-folder-success', [response.msg]);
			} else {
				//$(document).trigger('add-folder-error', [response.msg]);
			}
		}, params);
	},
	updateFoldersList : function() {
		BM.Storage.g().dumpFolders();
		this.getFolders(function() {
 			BM.Folders.View.init();
 		});		
	},
	init : function() {
		var me = this;
		var p = BM.Promiser.g();
		
 		// me.getFolders(function() {
 			// BM.Folders.View.init();
 			// BM.Folders.View.AddFolder.init();
 		// });
 		p.fixingNoFolder.done(function() {
 			console.log('# there were no folders -- fixing');
 			var storage = BM.Storage.g();
			var folder = new BM.Entities.Folder(
								'0',
								'Unsorted',
								null
				);
			folder.intId = '0';
			var ref = {
				id : '0',
				realId : '0'
			};
			storage.foldersRef.push(ref);
			//inject special folder "Unsorted"
 			storage.folders[0] = {
 				folder : folder 		
 			};			
			storage.noFolderFix(); 			
 		});	
 		p.gettingFolders.done(function(data) {
 			console.log('# done getting folders');
 			var storage = BM.Storage.g();
			var folder = new BM.Entities.Folder(
								'0',
								'Unsorted',
								null
				);
			folder.intId = '0';
			var ref = {
				id : '0',
				realId : '0'
			};
			storage.foldersRef.push(ref);			
			//inject special folder "Unsorted"
 			storage.folders[0] = {
 				folder : folder 		
 			};
 			storage.storeAllFolders(data);	
 		});
 		p.storingFolders.done(function() {
 			console.log('# done storing folders');
 			BM.Folders.View.init();
 			BM.Folders.View.AddFolder.init(); 			
 		});
 		me.getFolders(); 		
	}
};
/**
 * @author Robert
 * Folders.View.js
 */
BM.Folders.View = {
	folderHolder : 'folders-list',
	isLoading : false,
	activeFolder : $('.list-for-root'),
	currentFolder : null,
	activeList : [],
	
	getFoldersHolder : function() {
		return $(this.folderHolder);
	},
	addFolderToList : function(folder) {
		console.log('addFolderToList');
		var targetNode;
		var utils = BM.utils;
		var storage = BM.Storage.g();
		var t = BM.Templater.Folders;
		if (folder.parentId != 'null') {
			// var r = utils.search(storage.foldersRef, function(i) {
				// return i.realId == folder.parentId;
			// });
			
			// if (-1 !== r) {
				// var nodeId = storage.foldersRef[r].id;
				// targetNode = 'folder-' + nodeId;
				// var listTemplate = t.listTemplate(targetNode);
				// var node = $(".folder-btn[node-id='" + nodeId + "']");
				// node.attr('node-target', targetNode);
			// }
			var nodeId = folder.parentId;	//i have overwriten the parentId with the internal pId
			targetNode = 'folder-' + nodeId;
			var node = $(".folder-btn[node-id='" + nodeId + "']");
			node.attr('node-target', targetNode);
			if ($('.list-for-' + targetNode).length == 0) {
				var listTemplate = t.listTemplate(targetNode);
				t.foldersListHolder().append(listTemplate);
			}
		} else {
			targetNode = 'root';
		}
		var dirRef = 'folder-' + folder.intId;
		var r = utils.search(storage.folderTree, function(it) {
			return it.ref == dirRef;
		});
		if (-1 === r) {
			dirRef = 'none';
		}
		var listItem = t.itemTemplate(folder.name, folder.intId, dirRef, targetNode);
		var target = $(".folders-list[node='" + targetNode + "']");
		target.append(listItem);
	},
	listFolders : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Folders;
		var utils = BM.utils;
		
		_(storage.folderTree).each(function(obj) {
			var listTemplate = t.listTemplate(obj.ref);

			_(obj.children).each(function(index) {
				var item = storage.getFolder(index).folder;
				var dirRef = 'folder-' + item.intId;
				var r = utils.search(storage.folderTree, function(it) {
					return it.ref == dirRef;
				});
				if (-1 === r) {
					dirRef = 'none';
				}
				var listItem = t.itemTemplate(item.name, item.intId, dirRef, obj.ref);
				listTemplate.append(listItem);
			});
			
			t.foldersListHolder().append(listTemplate);
		});

		BM.e(callback);
	},
	showFolders : function(item) {
		//var d = $(".folders-list[node='" + id + "']");
		item.fadeIn('200');
	},
	hideFolders : function(item) {
		item.hide();
	},
	bindHandlers : function() {
		var me = this;
		var dList = $('.folders-list');
		var d = $(document);
		//var dirNavigator = $('.folders-breadcrumb-navigation');
		var dirHolder = $('.folders-list-holder');
		var breadcrumb = $('.breadcrumb-active-folders');
		
		/*
		 * main logi of the folder navigation
		 */
		dirHolder.on('click', '.folder-btn', function(event) {
			var item = $(this);
			var targetNode = item.attr('node-target');
			var nodeId = parseInt(item.attr('node-id'), 10);
			var itemText = item.text();
			var parentNode = item.attr('node-parent');
			var folder = $("<span class='active' node-id='" + nodeId + "' node-target='" + targetNode + "' node-name='" + itemText + "' node-parent='" + parentNode + "'>" + itemText + "/</span>");
			var breadcrumbChildren = breadcrumb.children();
			breadcrumbChildren.removeClass('active');
			
			if (targetNode !== 'none') {
				var target = $(".folders-list[node='" + targetNode + "']");
				if(target.length > 0) {
					var toHide = item.parents('.folders-list');
					
					me.hideFolders(toHide);
					me.showFolders(target);
					//dirNavigator.attr('node-target', parentNode);
					me.activeFolder = target;	//introduce the active folder
					me.activeList.push(target);	//introduce the active folder to the active dir list 
				}
				
				//d.trigger('sorter-activate-multiple-folders', [nodeId]);
				// breadcrumb.append(folder);
			} else {

			}
			var bLastItem = breadcrumbChildren.last();
			
			if (bLastItem.attr('node-parent') == parentNode) {
				bLastItem.remove();
			}
			breadcrumb.append(folder);
			dirHolder.attr('active-node', nodeId);			
			me.currentFolder = nodeId;
			d.trigger('sorter-activate-folder');

			return false;
		});
		/*
		 * show the root folders only
		 */
		$('.breadcrumb-show-root').on('click', function() {
			var target = $('.list-for-root');
			if (target == me.activeFolder) {
				return;
			}
			breadcrumb.empty();
			console.log('showing root folder');
			me.hideFolders(me.activeFolder);
			me.showFolders(target);
			me.activeFolder = target;
			dirHolder.attr('active-node', -1);
		});
		/*
		 * the folder navigation by breadcrumb
		 */
		breadcrumb.on('click', 'span', function() {
			var item = $(this);
			if (item.hasClass('active')) {
				return;
			}
			console.log('#');
			var parent = item.parent();
			var parentChildren = parent.children();
			var len = parentChildren.length;
			var index = parentChildren.index(item);
			var target = $('.list-for-' + item.attr('node-target'));
			me.hideFolders(me.activeFolder);
			me.showFolders(target);
			me.activeFolder = target;
			me.currentFolder = parseInt(item.attr('node-id'), 10);	
			if (index < len - 1) {
				for (var i = index + 1; i < len; i++) {
					parentChildren.eq(i).remove();
				}
			}
			if (index == len -1) {
				parentChildren.eq(index + 1).remove();
			}
			parentChildren.eq(index).addClass('active');
			d.trigger('sorter-activate-folder');
		});
		/*
		 * TODO: use a targeting system instead of array
		 */
		// dirNavigator.on('click', function(event) {
			// var t = me.activeList;
			// var l = t.length;
// 
			// if (l > 1) {
				// me.hideFolders(t[l-1]);
				// me.showFolders(t[l-2]);
// 				
				// var temp = t[l-1].attr('node').split('-');
				// var diactivate = parseInt(temp[1], 10);
				// temp = t[l-2].attr('node').split('-');
				// var activate = parseInt(temp[1], 10);
				// if (temp[0] == 'root') {
					// active = -1;
				// }
				// d.trigger('sorter-diactivate-multiple-folders', [diactivate]);	
				// d.trigger('sorter-activate-multiple-folders', [activate]);
				// dirHolder.attr('active-node', activate);
// 				
				// me.activeList.splice(l-1, 1);			
			// }
// 
			// return false;
		// });
		
		var addDirInput = $('.add-new-folder');
		var addDirBtn = $('.add-folder-shortcut-btn');
		addDirInput.keyup(function(e) {
			if (e.keyCode == 27) {
				addDirInput.fadeOut(function() {
					addDirInput.val('');
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
			d.trigger('add-folder', [addDirInput.val(), parent]);
			addDirInput.val('');
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirInput.blur(function() {
			addDirInput.fadeOut(function() {
				addDirInput.val('');
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
		$('.folders-list-holder').empty();
		
		me.listFolders(function() {
			var r = $(".folders-list[node='root']");
			me.activeList.push(r);
			me.showFolders(r);
			me.bindHandlers();
		});
	} 
};	/**
 * @author Robert
 * Folders.View.AddFolder.js
 */

BM.Folders.View.AddFolder = {
	modal : function() {
		return $('#add-folder-modal');
	},
	bindHandlers : function() {
		var modal = $('#add-folder-modal');
		var submitBtn = modal.find('.modal-folder-add');
		var nameField = modal.find('.modal-folder-name');
		var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		submitBtn.on('click', function() {
			d.trigger('add-folder', [nameField.val(), selector.val()]);
			
			return false;
		});
	},
	listParents : function(callback) {
		var storage = BM.Storage.g().folders;
		var selector = this.modal().find('.modal-parent-selector');

		_(storage).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			selector.append(item);
		});
		
		if (callback != undefined) {
			BM.e(callback);
		}
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

BM.Tags = {
	getTags : function(callback, limit) {
		BM.p('tags/list_all', function(response) {
			if (response.status === 'ok') {
				// BM.Storage.g().storeAllTags(response.data);
				BM.Promiser.g().gettingTags.resolve(response.data);
				if (callback != undefined) {
					BM.e(callback);
				}
			}
		});
	},
	addTag : function(name, callback) {
		if (name == '') {
			return;
		}		
		var params = {
			name : name
		};
		BM.p('tags/add', function(response) {
			if (response.status === 'ok') {
				var tag = {
					id : response.data.id,
					name : name
				};
				var newTag = BM.Storage.g().storeTag(tag);
				//BM.Tags.View.addTagToList(newTag.tag);
				$(document).trigger('add-tag-success', [response.msg]);
			} else {
				$(document).trigger('add-tag-error', [response.msg]);
			}
		}, params);
	},
	init : function() {
		var me = this;
		var p = BM.Promiser.g();
		// me.getTags(function() {
			// BM.Tags.View.init();
			// BM.Tags.View.AddTag.init();
		// });
		p.gettingTags.done(function(data) {
			console.log('# done getting tags');
			BM.Storage.g().storeAllTags(data);
		});
		p.storingTags.done(function() {
			console.log('# done storing tags');
			BM.Tags.View.init();
			//BM.Tags.View.AddTag.init();			
		});
		me.getTags();			
	}
};
/**
 * @author Robert
 */

BM.Tags.View = {
	tagsList : [],
	typeaheadObject : null,
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */	
	// ddItemTemplate : function(name, id) {
		// var it = $("<li><a href='#' tag-id='" + id + "'>" + name + "</a></li>");
// 		
		// return it;
	// },
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */
	// listTags : function(callback) {
		// var me = this;
		// var storage = BM.Storage.g();
		// _(storage.tags).each(function(obj, key) {
			// var itemTample = me.ddItemTemplate(obj.tag.name, key);
			// BM.Templater.Tags.ddTagHolder().append(itemTample);
		// });
// 		
		// if (callback !== undefined) {
			// BM.e(callback);	
		// }
	// },
	populateTypeahead : function(callback) {
		var me = this;
		var tags = BM.Storage.g().tagsName;
		var typeahead = $('.apply-tag-input');
		// var tags = [];
		// _(storage.tags).each(function(obj, key) {
			// tags.push(obj.tag.name);
		// });
		me.typeaheadObject = typeahead.typeahead({
			source : tags
		});
		me.tagsList = tags;
		if (callback !== undefined) {
			BM.e(callback);	
		}		
	},
	updateTypeahead : function(data) {
		var me = this;
		var tags = BM.Storage.g().tagsName;
		// var tags = [];
		// _(storage.tags).each(function(obj, key) {
			// tags.push(obj.tag.name);
		// });
		me.typeaheadObject.data('typeahead').source = tags;
		me.tagsList = tags;
		
	},
	addPopovers : function() {
		var applyTagInput = $('.apply-tag-input');
		var target = $('#apply-tag-popover-add');
		applyTagInput.popover({
			placement : 'bottom',
			trigger : 'manual',
			title : function() {
				return target.children('.title').html();
			},
			content : function() {
				return target.children('.content').html();
			}
		});
	},
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */	
	// addTagToList : function(tag, callback) {
		// var me = this;
		// var itemTample = me.ddItemTemplate(tag.name, tag.intId);
		// BM.Templater.Tags.ddTagHolder().append(itemTample);
// 		
		// if (callback !== undefined) {
			// BM.e(callback);		
		// }	
	// },
	bindHandlers : function() {
		var me = this;
		var d = $(document);
		$('.sort-tags').on('click', function(event) {
			var item = $(this);
			var active = item.hasClass('active');
			var toolbar = $('.tags-toolbar');
			
			if (active) {
				toolbar.animate({
					'marginTop' : '-51px'
				}, 300, 'linear');
			} else {
				toolbar.animate({
					'marginTop' : 0
				}, 300, 'linear');				
			}
		});
		
		var applyTagInput = $('.apply-tag-input');
		var applyTagBtn = $('.apply-tag-btn');
		var popoverIsActive = false; 
		applyTagInput.keyup(function(e) {
			if (e.keyCode == 27) {
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');					
					popoverIsActive = false;
					applyTagBtn.fadeIn();
				});
			}
		});
		applyTagInput.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			var value = applyTagInput.val();
			if (value == '') {
				return;
			}
			var r = _.find(me.tagsList, function(item) {
				return item == value;
			});
			if (!r) {
				// popoverIsActive = true;
				// applyTagInput.popover('show');
				// d.trigger('bind-tag-popover-events');
				d.trigger('show-tag-popover');				
			} else {
				//d.trigger('apply-tag', [value]);
				popoverIsActive = false;
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');
					applyTagBtn.fadeIn();
				});				
			}			
		});
		// applyTagInput.on('change', function() {
			// if (popoverIsActive) {
				// applyTagInput.fadeOut(function() {
					// applyTagInput.popover('hide');
					// popoverIsActive = false;
					// applyTagInput.val('');
					// applyTagBtn.fadeIn();
				// });	
			// }
		// });
		applyTagInput.on('input', function(e) {
			if (popoverIsActive) {
				// d.trigger('unbind-tag-popover-events');
				// applyTagInput.popover('hide');				
				// popoverIsActive = false;
				d.trigger('hide-tag-popover');
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');
					applyTagBtn.fadeIn();
				});					
			}
		});
		applyTagInput.blur(function() {
			if (popoverIsActive) {
				return;
			}
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});
		});
		applyTagBtn.on('click', function() {
			$(this).fadeOut(function() {
				applyTagInput.fadeIn();
				applyTagInput.focus();
			});
			
			return false;
		});
		d.on('bind-tag-popover-events', function() {
			var popConfirm = $('.tag-popover-confirm');
			popConfirm.on('click', function(event) {
				d.trigger('add-tag', [applyTagInput.val()]);
				
				return false;
			});
			var popClose = $('.tag-popover-close');
			popClose.on('click', function(event) {
				// d.trigger('unbind-tag-popover-events');
				// applyTagInput.popover('hide');
				// popoverIsActive = false;
				d.trigger('hide-tag-popover');
				applyTagInput.val('');
				applyTagInput.focus();
				
				return false;		
			});			
		});
		d.on('unbind-tag-popover-events', function() {
			var popConfirm = $('.tag-popover-confirm');
			popConfirm.off('click');
			var popClose = $('.tag-popover-close');
			popClose.off('click');						
		});
		d.on('show-tag-popover', function() {
			popoverIsActive = true;
			applyTagInput.popover('show');
			d.trigger('bind-tag-popover-events');			
		});
		d.on('hide-tag-popover', function() {
			d.trigger('unbind-tag-popover-events');
			applyTagInput.popover('hide');
			popoverIsActive = false;
		});
		d.on('hide-apply-tag-input', function() {
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});			
		});			
	},
	init : function() {
		var me = this;
		
		me.populateTypeahead();
		me.addPopovers();
		me.bindHandlers();
	}
};
/**
 * @author Robert
 */
BM.Tags.View.AddTag = {
	bindHandlers : function() {
		var t = BM.Templater.Tags;
		var modal = t.getAddModal();
		//var submitBtn = modal.find('.modal-directory-add');
		//var nameField = modal.find('.modal-directory-name');
		//var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-tag', [modal.name.val()]);
			
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
				//BM.Storage.g().storeAllBookmarks(response.data);
				BM.Promiser.g().gettingBookmarks.resolve(response.data);
				
				if (callback != undefined) {
					BM.e(callback);
				}
			}
		});
	},
	formatUrl : function(url) {
		var reg = url.match(/(http:\/\/|https:\/\/|ftp:\/\/)+\b/);
		
		if (reg) {
			return url;
		}
		
		var protocol = "http://";
		
		return protocol + url;
	},
	addBookmark : function(url, folderId, tags, callback) {
		var storage = BM.Storage.g();
		var folder;
		if (folderId == 'null') {
			folder = null;
		} else {
			folder = storage.folders[folderId].folder.id;
		}
		var formatedUrl = this.formatUrl(url);
		
		var params = {
			url : formatedUrl,
			folderId : folder,
			tags : tags
		};
		console.log(params);
		BM.p('bookmarks/add', function(response) {
			if (response.status === 'ok') {
				console.log('bookmark added', response.data);
			} else {
				
			}
		}, params);
	},
	init : function() {
		var me = this;
		var p = BM.Promiser.g();
		// me.getBookmarks(function() {
			// BM.Bookmarks.View.init();
		// });
		p.gettingBookmarks.done(function(data) {
			console.log('# done getting bookmarks');
			
			$.when(p.storingTags, p.storingFolders).done(function() {
				BM.Storage.g().storeAllBookmarks(data);
			});	
		});
		p.storingBookmarsk.done(function() {
			console.log('# done storing bookmarks');
		});
		$.when(p.storingTags, p.storingFolders, p.storingBookmarsk).done(function() {
			BM.Bookmarks.View.init();
			BM.Bookmarks.View.AddBookmark.init();
		});
		me.getBookmarks();
	}
};
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
			var itemTemplate = t.bookmarkTemplate(key, bookmark.name, bookmark.url, bookmark.folderId, bookmark.tags, bookmark.typeId);
			t.bookmarksList().append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	showBookmarks : function(list, callback) {
		var t = BM.Templater.Bookmarks;
		var bHolder = t.bookmarksList();
		bHolder.empty();
		var bookmarks = BM.Storage.g().bookmarks;
		var len = list.length;
		if (len == 0) {
			bHolder.text('looks like there is no bookmarks');
			return;
		}
		for (var i = 0; i < len; i++) {
			var b = bookmarks[list[i]];
			var itemTemplate = t.bookmarkTemplate(b.intId, b.name, b.url, b.folderId, b.tags, b.typeId);
			bHolder.append(itemTemplate); 			
		}
	},
	addPopovers : function() {
		var popoverContent = $('#add-bookmark-popover');
		var target = $('.bookmark-action');
		target.popover({
			placement : 'bottom',
			trigger : 'manual',
			title : function() {
				return popoverContent.children('.title').html();
			},
			content : function() {
				return popoverContent.children('.content').html();
			}
		});		
	},
	bindHandlers : function() {
		var me = this;
		var d = $(document);
//		var addPopoverIsActive = false;
		var addBookmarkBtn = $('.bookmark-action');
		
		// d.on('show-add-bookmark-popover', function() {
			// addPopoverIsActive = true;
			// addBookmarkBtn.popover('show');
			// d.trigger('bind-add-bookmark-popover-events');			
		// });
		// d.on('hide-add-bookmark-popover', function() {
			// d.trigger('unbind-add-bookmark-popover-events');
			// addBookmarkBtn.popover('hide');
			// addPopoverIsActive = false;
		// });
		// d.on('bind-add-bookmark-popover-events', function() {
			// var popConfirm = $('.add-bookmark-popover-confirm');
			// popConfirm.on('click', function(event) {
				// //d.trigger('add-bookmark', [applyTagInput.val()]);
				// console.log('this will be for adding bookmarks');
				// return false;
			// });
			// var popClose = $('.add-bookmark-popover-close');
			// popClose.on('click', function(event) {
				// d.trigger('hide-add-bookmark-popover');
				// //applyTagInput.val('');
				// //applyTagInput.focus();
// 				
				// return false;		
			// });			
		// });
		// d.on('unbind-add-bookmark-popover-events', function() {
			// var popConfirm = $('.add-bookmark-popover-confirm');
			// popConfirm.off('click');
			// var popClose = $('.add-bookmark-popover-close');
			// popClose.off('click');						
		// });			
		// addBookmarkBtn.on('click', function() {
			// if (addPopoverIsActive) {
				// d.trigger('hide-add-bookmark-popover');
			// } else {
				// d.trigger('show-add-bookmark-popover');
			// }
		// });	
	},
	init : function() {
		var me = this;
		
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
		//me.addPopovers();
		//me.bindHandlers();
	}
};
/**
 * @author Robert
 */

BM.Bookmarks.View.AddBookmark = {
	modal : BM.Templater.Bookmarks.getAddModal(),
	bindHandlers : function() {
		var me = this;
		var t = BM.Templater.Bookmarks;
		var modal = me.modal;
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-bookmark', [modal.url.val(), modal.folder.val(), modal.tags.val()]);
			
			return false;
		});
	},
	listFolders : function() {
		var storage = BM.Storage.g().folders;
		var modal = this.modal;
		_(storage).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			modal.folder.append(item);
		});		
	},
	init : function() {
		var me = this;
		me.listFolders();
		me.bindHandlers();
	}
};
/**
 * @author Robert
 */

BM.Mediator = {};

BM.Mediator.Tags = {
	provide : function() {
		var d = $(document);
		var tags = BM.Tags;
		var t = BM.Templater;
		//var modal = t.Tags.getAddModal();
		//var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		d.on('apply-tag', function(event, name) {
			if (name == '') {
				return;
			}			
		});
		/**
		 * bind the add tag event to the document
		 */
		d.on('add-tag', function(event, name) {
			if (name == '') {
				return;
			}
			tags.addTag(name);
		});
		/*
		 * displays error message if adding a tag fails
		 */
		// d.on('add-tag-error', function(event, msg) {
			// nameGroup.removeClass('success'); 
			// nameGroup.addClass('error');
			// nameGroup.children('span').text(msg);
		// });		
		/**
		 * hide the modal if the tag is added with success
		 */
		d.on('add-tag-success', function(event, msg) {
			tags.View.updateTypeahead();
			d.trigger('hide-tag-popover');
			d.trigger('hide-apply-tag-input');
		});
		/** fires when the modal is hiding
		 * 
		 */
		// modal.el.on('hide', function() {
			// modal.name.val('');
			// nameGroup.children('span').text('');
			// nameGroup.removeClass('error').removeClass('success');
		// });
		/**
		 *  what happens on enter key press on the modal
		 */
		// modal.el.on('keypress', function(event) {
			// if (event.keyCode !== 13) {
				// return;
			// }
			// d.trigger('add-tag', [modal.name.val()]);
		// });		
	}
};
BM.Mediator.Folders = {
	provide : function() {
		var d = $(document);
		var folders = BM.Folders;
		var t = BM.Templater;
		var modal = t.Folders.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add folder event to the document
		 */
		d.on('add-folder', function(event, name, parentId) {
			if (name == '') {
				return;
			}
			folders.addFolder(name, parentId);
		});
		/*
		 * displays error message if adding a folder fails
		 */
		d.on('add-folder-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});
		/**
		 * hides the add folder modal when the success event is triggered
		 */
		d.on('add-folder-success', function(event, msg) {
			// nameGroup.removeClass('error');
			// nameGroup.addClass('success');
			// nameGroup.children('span').text(msg);
			modal.el.modal('hide');
		});
		/**
		 * resets the add folder modal on hide event
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
			modal.selector.val(modal.selector.prop('defaultSelected'));
		});
		/**
		 * adds an enter keypress event to the add folder modal 
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-folder', [modal.name.val(), modal.selector.val()]);
		});
	}
};

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document);
		var bookmarks = BM.Bookmarks;
		var view = bookmarks.View;
		var foldersView = BM.Folders.View;
		var sorter = bookmarks.Sorter.g();
		var t = BM.Templater;
		var addBmActive = false;
		
		d.on('sorter-activate-folder', function(event) {
			var current = foldersView.currentFolder;
			var node = $(".folder-btn[node-id='" + current + "']");
			var nodeTarge = node.attr('node-target');
			console.log('current folder is: ', foldersView.currentFolder);
			if ( nodeTarge === 'none') {
				sorter.activateFolder(current, function() {
					d.trigger('sort-bookmarks');
				});				
			} else {
				var foldersId = [current];
				var listHolder = $('.list-for-folder-' + current);
				var listItems = listHolder.find('.folder-btn');
				listItems.each(function() {
					var index = parseInt($(this).attr('node-id'), 10);
					foldersId.push(index);
				});
				
				sorter.activateMultipleFolder(foldersId, function() {
					d.trigger('sort-bookmarks');
				});				
			}
			// sorter.activateFolder(folderId, function() {
				// d.trigger('sort-bookmarks');
			// });
		});
		
		// d.on('sorter-activate-multiple-folders', function(event, folderId) {
			// var foldersId = [folderId];
			// var listHolder = $('.list-for-folder-' + folderId);
			// var listItems = listHolder.find('.folder-btn');
			// listItems.each(function() {
				// var index = parseInt($(this).attr('node-id'), 10);
				// foldersId.push(index);
			// });
// 			
			// sorter.activateMultipleFolder(foldersId, function() {
				// d.trigger('sort-bookmarks');
			// });
		// });
// 		
		// d.on('sorter-diactivate-multiple-folders', function(event, folderId) {
			// var foldersId = [folderId];
			// var listHolder = $('.list-for-folder-' + folderId);
			// var listItems = listHolder.find('.folder-btn');
			// listItems.each(function() {
				// var index = parseInt($(this).attr('node-id'), 10);
				// foldersId.push(index);
			// });
// 			
			// sorter.diactivateMultipleFolder(foldersId);
		// });
		
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			sorter.sortBookmarks();
		});
		
		d.on('add-bookmark', function(event, url, folder, tags) {
			console.log(url, folder, tags);
			if (url == '') {
				return;
			}
			bookmarks.addBookmark(url, folder, tags);
		});
		// var bookmarkAction = $('.main-bookmark-action');
		// var bookmarkExecutor = $('.main-action-executor')
		// bookmarkAction.on('click', function() {
			// if (!addBmActive) {
				// bookmarkAction.children('i').addClass('icon-white');
				// addBmActive = true;
				// setTimeout(function() {
					// $('.main-action-bar-input').focus();
					// bookmarkExecutor.children('i').addClass('icon-plus');
				// }, 50);
			// } else {
				// addBmActive = false;
				// bookmarkAction.children('i').removeClass('icon-white');
				// bookmarkExecutor.children('i').removeClass('icon-plus');
			// }
		// });
		// $('.main-action-bar-input').blur(function() {
			// if (!addBmActive) { return; }
			// setTimeout(function() {
				// if (addBmActive) {
					// addBmActive = false;
					// bookmarkAction.button('toggle');
					// bookmarkAction.children('i').removeClass('icon-white');
					// bookmarkExecutor.children('i').removeClass('icon-plus');
				// }				
			// }, 100);
// 
		// });
	}
};

BM.Mediator.init = function() {
		this.Tags.provide();
		this.Folders.provide();
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
		var holder = $('.current-user .username');
		holder.text(this.user.email);
	},
	init : function() {
		var me = this;
		me.getInfo();
		BM.Folders.init();
		BM.Tags.init();
		BM.Bookmarks.init();
		BM.Mediator.init();					

	},
	end : function() {
		
	}
};