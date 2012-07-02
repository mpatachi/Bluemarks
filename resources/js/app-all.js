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
	savingBookmark,
	instantiated = null;

	function init() {
			
		return {
			fixingNoFolder : fixingNoFolder,
			gettingFolders : gettingFolders,
			gettingTags : gettingTags,
			gettingBookmarks : gettingBookmarks,
			storingFolders : storingFolders,
			storingTags : storingTags,
			storingBookmarsk : storingBookmarsk,
			savingBookmark : savingBookmark,
			promise : {
				saveBookmark : function() {
					savingBookmark = new $.Deferred();
				}
			}
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
			foldersId : [0],
						
			storeBookmark : function($b, callback) {
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
				
				var retBookmark = me.bookmarks[bookmarkCount];

				if (callback != undefined) {
					BM.e(callback(retBookmark));
				}				
				
				return retBookmark;			
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
					this.foldersId.push(returnId);
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
	}
};

BM.Templater.Tags = {
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
	getEditModal : function() {
		var modal = $('#edit-bookmark-modal');
		var submitBtn = modal.find('.modal-bookmark-save-confirm');
		var titleField = modal.find('.modal-bookmark-title');
		var urlField = modal.find('.modal-bookmark-url');
		var folderField = modal.find('.modal-bookmark-folder');
		var tagsField = modal.find('.modal-bookmark-tags');
		var descField = modal.find('.modal-bookmark-description');
		var titleGroup = modal.find('.modal-title-group');
		var urlGroup = modal.find('.modal-url-group');
		var folderGroup = modal.find('.modal-folder-group');
		var tagsGroup = modal.find('.modal-tags-group');
		var descGroup = modal.find('.modal-description-group');
		
		return {
			el : modal,
			submit : submitBtn,
			title : titleField,
			url : urlField,
			folder : folderField,
			tags : tagsField,
			description : descriptionField,
			titleGroup : titleGroup,
			urlGroup : urlGroup,
			folderGroup : folderGroup,
			tagsGroup : tagsGroup,
			descriptionGroup : descGroup
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
			var folderItemList = [];
			_(obj.children).each(function(index) {
				var item = storage.getFolder(index).folder;
				var dirRef = 'folder-' + item.intId;
				var r = utils.search(storage.folderTree, function(it) {
					return it.ref == dirRef;
				});
				if (-1 === r) {
					dirRef = 'none';
				}
				//var listItem = t.itemTemplate(item.name, item.intId, dirRef, obj.ref);
				//listTemplate.append(listItem);
				var listItem = "<li><a href='#' class='folder-btn' node-id='" + item.intId + "' node-target='" + dirRef + "' node-parent='" + obj.ref + "'>" + item.name + "</a></li>"
				folderItemList.push(listItem);
			});
			var toAppend = folderItemList.join('');
			listTemplate.html(toAppend);
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
			d.trigger('show-root-folders');
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
	activeTags : null,
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
	addToActiveTags : function(tag) {
		var parent = this.activeTags.parent(),
			item = "<li class='tag-active-item'><span tag-name='" + tag + "'>" + tag + "<a class='close tag-remove' href='#'>&times;</a></span></li>",  
			html = this.activeTags.html();
		this.activeTags.detach();
		html += item;
		this.activeTags.html(html);
		parent.append(this.activeTags);		
	},
	bindHandlers : function() {
		var me = this,
			d = $(document),
			applyTagInput = $('.apply-tag-input'),
		 	applyTagBtn = $('.apply-tag-btn'),
		 	toolbar = $('.tags-toolbar');
		 	
		$('.sort-tags').on('click', function(event) {
			var item = $(this),
				active = item.hasClass('active');
					
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
		$('#active-tags-list').on('click', '.tag-remove', function(event) {
			var item = $(this),
				parent = item.parent(),
				value = parent.attr('tag-name');
			parent.remove();
			d.trigger('sorter-diactivate-tag', [value]);
			
			return false;
		});
		function hideTagInput() {
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});			
		}

		applyTagInput.keyup(function(e) {
			if (e.keyCode == 27) {
				hideTagInput();
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
				hideTagInput();
			} else {
				me.addToActiveTags(value);
				d.trigger('sorter-activate-tag', [value]);
				hideTagInput();			
			}			
		});
		applyTagInput.blur(function() {
			hideTagInput();
		});
		applyTagBtn.on('click', function() {
			$(this).fadeOut(function() {
				applyTagInput.fadeIn();
				applyTagInput.focus();
			});
			
			return false;
		});
	
		d.on('hide-apply-tag-input', function() {
			hideTagInput();		
		});			
	},
	init : function() {
		var me = this;
		
		me.populateTypeahead();
		me.activeTags = $('#active-tags-list');
		//me.addPopovers();
		me.bindHandlers();
	}
};
/**
 * @author Robert
 */

BM.Bookmarks = {
	/*
	 * Gets all bookmarks from the server,
	 * if the status is ok then the Promise is resolved
	 */
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
	/*
	 * Formats the url, if there is no protocol present in the url,
	 * default http protocol is added to the url
	 * 
	 * @param string url
	 * @return string url 
	 */
	formatUrl : function(url) {
		var reg = url.match(/(http:\/\/|https:\/\/|ftp:\/\/)+\b/);
		
		if (reg) {
			return url;
		}
		
		var protocol = "http://";
		
		return protocol + url;
	},
	/*
	 * Substracts the base url from a given url.
	 * 
	 * @param string url
	 * @return string url
	 */
	baseUrl : function(url) {
		var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
		
		return url.match(re)[0].toString();
	},
	/*
	 * Adding a bookmark logic
	 * 
	 * @param string url
	 * @param string folderId
	 * @param string tags
	 * @param function callback
	 */
	addBookmark : function(url, folderId, tags, callback) {
		var storage = BM.Storage.g();
		var promiser = BM.Promiser.g();
		var folder;
		var d = $(document)
		if (folderId == 'null') {
			folder = null;
		} else {
			folder = storage.folders[folderId].folder.id;
		}
		var formatedUrl = this.formatUrl(url);
		var baseUrl = this.baseUrl(formatedUrl);
		
		var params = {
			url : formatedUrl,
			folderId : folder,
			tags : tags,
			base_url : baseUrl
		};
		//generates a promise for saving the bookmark before we send a request to the server.
		//promiser.promise.saveBookmark();
		
		BM.p('bookmarks/add', function(response) {
			if (response.status === 'ok') {
				storage.storeBookmark(response.data, function(bookmark) {
					//promiser.promise.savingBookmark.resolve(bookmark);	//if the status is ok we can resolve the promise
					d.trigger('done-add-bookmark', [bookmark.bookmark.proxy]);				
				});
				
			} else {
				//promiser.promise.savingBookmark.reject();		//if the status is error promise is rejected
				d.trigger('fail-add-bookmark');
			}	
		}, params);
		
		var params2 = {
			url : baseUrl
		};
		BM.p('thumbs/save', function(response) {
			if (response.status === 'ok') {
				console.log(response.msg);
			} else {
				console.log(response.msg);
			}
		}, params2);
	},
	init : function() {
		var me = this,
			p = BM.Promiser.g(),
			d = $(document);
			
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
			BM.Bookmarks.View.EditBookmark.init();
			d.trigger('remove-main-loading');
		});
		me.getBookmarks();
	}
};
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
			counter : 0,
			list : {}	
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
				bookmarks.counter = 0,
				bookmarks.list = {};				
				
				d.trigger('reset-bookmark-nav-history');
				
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
				console.log('bookmarks cache: ', bookmarks.cache);
				console.log('current bookmark count: ', bookmarks.cache.length, ' max bookmark to show: ', bookmarks.max);
				console.log('pages: ', Math.ceil(bookmarks.cache.length / bookmarks.max));
				console.log('slicing: ',bookmarks.cache.slice(bookmarks.last,1 * 15));
				var len = bookmarks.cache.length;
				var pageCount = Math.ceil(len / bookmarks.max);
				for (var i = 1; i < pageCount + 1; i++) {
					var it = i * bookmarks.max;
					bookmarks.list[i] = bookmarks.cache.slice(bookmarks.last,it);
					bookmarks.last = it;
				}
				console.log('bookmarks cache: ', bookmarks.cache);
				console.log('bookmarks list: ',bookmarks.list);
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
				// var	r = bookmarks.cache,
					// len = bookmarks.cache.length;
				// if (bookmarks.last > len) {
					// d.trigger('more-bookmarks-available', [false]);
// 					
					// return;
				// }
				// if (len > bookmarks.max) {
					// bookmarks.counter += 1;
					// var maxy = 	bookmarks.counter * bookmarks.max;				
					// r = bookmarks.cache.slice(bookmarks.last,maxy);
					// bookmarks.last = maxy;
					// bookmarks.more = true;
					// if (bookmarks.last > len) {
						// bookmarks.more = false;
						// d.trigger('more-bookmarks-available', [false]);
					// } else {
						// bookmarks.more = true;
						// d.trigger('more-bookmarks-available', [true]);						
					// }					
				// } else {
					// bookmarks.more = false;
					// d.trigger('more-bookmarks-available', [false]);							
				// }
				// bookmarks.list[bookmarks.counter] = r;
				// bookmarks.active = r;
// 		
				// console.log('###');
				// if (bookmarks.counter > 1) {
					// d.trigger('show-bookmark-nav-history');
				// }
				if (bookmarks.cache.length == 0) {
					d.trigger('reset-bookmark-nav-history');
					BM.Bookmarks.View.showBookmarks([]);
				} else {
					d.trigger('show-bookmark-nav-history');				
					BM.Bookmarks.View.showBookmarks(bookmarks.list[1]);
				}
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
/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var folders = BM.Storage.g().foldersId;
		BM.Bookmarks.Sorter.g().activateMultipleFolder(folders, function() {
			$(document).trigger('sort-bookmarks');
		});
			// t = BM.Templater.Bookmarks,
			// bHolder = t.bookmarksList(),
			// bHolderParent = bHolder.parent(),
			// html = '',
			// i = bookmarks.length;
		// bHolder.detach();
		// bHolder.empty();
		// _(bookmarks).each(function(obj, key) {
			// var bookmark = obj.bookmark.proxy;
			// var img = "<img src='../resources/img/160x120.gif' alt=''>";
			// var title = "<h5>" + bookmark.name + "</h5>";
			// html += "<li class='span2' bookmark-id='" + key + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a>" + "</li>"  
		// });
		// // for (; i > 0; i--) {
			// // var bookmark = bookmarks[i-1].bookmark.proxy;			
			// // var img = "<img src='../resources/img/160x120.gif' alt=''>";
			// // var title = "<h5>" + bookmark.name + "</h5>";
			// // html += "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a>" + "</li>"
		// // }		
		// bHolder.html(html);
		// bHolderParent.append(bHolder);
		if (callback != undefined) {
			BM.e(callback);
		}
	},
	showBookmarkNavHistory : function() {
		var nav = $('#bookmark-nav-history');
		var list = BM.Bookmarks.Sorter.g().bookmarks.list;
		var html = [];
		var i = 0;
		_(list).each(function(obj) {
			i++;
			var item = "<a href='#' data-list='" + obj + "' data-page='" + i + "'></a>";
			html.push(item);
		});
		nav.html(html.join(''));
	},
	resetBookmarkNavHistory : function() {
		var nav = $('#bookmark-nav-history');
		nav.html('');
	},
	showBookmarks : function(list, callback) {
		var t = BM.Templater.Bookmarks,
			bHolder = t.bookmarksList(),
			bHolderParent = bHolder.parent(),
			html = [],
			bookmarks = BM.Storage.g().bookmarks,
			i = list.length;
		bHolder.detach();
		bHolder.empty();	
		if (i == 0) {
			bHolder.html("<p class='no-bookmarks'>looks like there is no bookmarks</p>");
			bHolderParent.append(bHolder);
			return;
		}
		for (; i > 0; i--) {
			var bookmark = bookmarks[list[i-1]].bookmark.proxy,		
				//img = "<img src='../resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
				img = "<img class='bookmark-thumb' data-original='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' src='' alt=''>",
				title = "<h5>" + bookmark.name + "</h5>",
				buttons = "<div class='action-group'><a href='#' data-id='" + bookmark.intId + "' class='action-group-btn delete' title='delete'><i class='icon-trash'></i></a><div class='btn-group-right'><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn edit' title='edit'><i class='icon-pencil'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn share' title='share'><i class='icon-share-alt'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn mark' title='mark'><i class='icon-ok'></i></a></div></div>";
			html.push("<li draggable='true' class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + buttons + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a></li>");
		}		
		bHolder.html(html.join(''));
		bHolderParent.append(bHolder);
		/*
		 * check if the thumbnail has loaded
		 * if not set the default image
		 */
		var wall = bHolder.find('.bookmark-thumb');
		for (i = 0, l = wall.length; i < l; i++) {
			wall[i].src = wall[i].dataset.original;
			$(wall[i]).error(function() {
				console.log(this);
				this.src = '/bluemarks/resources/img/default_thumb.jpg';
			});
		}				
	},
	addBookmarkToView : function(bookmark) { 
		var	img = "<img class='bookmark-thumb' data-original='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' src='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
			title = "<h5>" + bookmark.name + "</h5>",
			buttons = "<div class='action-group'><a href='#' data-id='" + bookmark.intId + "' class='action-group-btn delete' title='delete'><i class='icon-trash'></i></a><div class='btn-group-right'><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn edit' title='edit'><i class='icon-pencil'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn share' title='share'><i class='icon-share-alt'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn mark' title='mark'><i class='icon-ok'></i></a></div></div>";
			html = "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + buttons + "</a></li>";
		var $obj = $(html);
		BM.Templater.Bookmarks.bookmarksList().prepend($obj);
	},
	bindHandlers : function() {
		var me = this,
			d = $(document),
			addBookmark = $('#add-bookmark'),
			shareAll = $('#share-all'),
			openAll = $('#open-all'),
			wall = $('#wall'),
			editModal = $('#edit-bookmark-modal'),
			storage = BM.Storage.g();
		d.on('show-root-folders', function() {
			me.listBookmarks();
		});
		
		shareAll.on('click', function(event) {
			return false;
		});
		openAll.on('click', function(event) {
			return false;
		});
		// wall.on('error', '.bookmark-thumb', function() {
			// console.log('error loading image', this.dataset.original);
		// });
		wall.on('click', '.edit', function() {
			editModal.modal('toggle');
			var bookmark = storage.bookmarks[this.dataset.id].bookmark;
			console.log(bookmark);
			editModal.find('.modal-bookmark-title').val(bookmark.proxy.name);
			editModal.find('.modal-bookmark-url').val(bookmark.proxy.url);
			editModal.find('.modal-bookmark-tags').val(bookmark.proxy.tags);
			editModal.find('.modal-bookmark-folder').val(this.dataset.id);
			editModal.find('.modal-bookmark-description').val(bookmark.real.description);
			return false;
		});
		$('#bookmark-nav-history').on('click', 'a', function() {
			var array = this.dataset.list.split(',');
			me.showBookmarks(array);
			$(this).parent()[0].dataset.page = this.dataset.page;
			return false;
		});
		$('#show-more-bookmarks').on('click', function() {
			d.trigger('show-more-bookmarks');

			return false;
		});		
	},
	init : function() {
		var me = this;
		// $('#wall').on('error', '.bookmark-thumb', function() {
			// console.log('error loading image', this.dataset.original);
		// });
		$('.bookmark-thumb').live('error', function() {
			console.log('errrorasdada');
		});	
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
		me.showBookmarkNavHistory();
		//me.addPopovers();
		me.bindHandlers();
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

BM.Bookmarks.View.EditBookmark = {
	modal : $('#edit-bookmark-modal'),
	bindHandlers : function() {
		// var me = this;
		// var t = BM.Templater.Bookmarks;
		// var modal = me.modal;
		// var d = $(document);
// 		
		// modal.submit.on('click', function() {
			// d.trigger('add-bookmark', [modal.url.val(), modal.folder.val(), modal.tags.val()]);
// 			
			// return false;
		// });
	},
	listFolders : function() {
		var folders = BM.Storage.g().folders;
		var modal = this.modal;
		var foldersSel = modal.find('.modal-bookmark-folder');
		var html = [foldersSel.html()];	
		_(folders).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			html.push(item);
		});
		
		foldersSel.html(html.join(''));
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
		var d = $(document),
			tags = BM.Tags;
			
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
		// });		
		/**
		 * hide the modal if the tag is added with success
		 */
		d.on('add-tag-success', function(event, msg) {
			tags.View.updateTypeahead();
		});
	}
};
BM.Mediator.Folders = {
	provide : function() {
		var d = $(document),
			folders = BM.Folders;
		
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
			/*
			 * some error message here
			 */
		});
		/**
		 * hides the add folder modal when the success event is triggered
		 */
		d.on('add-folder-success', function(event, msg) {
			/*
			 * what happend when success
			 */
		});
	}
};

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document),
			//p = BM.Promiser.g(),
			bookmarks = BM.Bookmarks,
			view = bookmarks.View,
			foldersView = BM.Folders.View,
			sorter = bookmarks.Sorter.g(),
			t = BM.Templater,
			more = false,
			navHistory = false;
			//loadingTemplate = $("<div id='bookmark-loading' class='loading'><div class='body'><span class='loader'>&nbsp;</span><span class='text'>application is starting...</span></div></div>");
		/*
		 * 
		 */
		// d.on('apply-loading-bookmarks', function(event) {
			// $('#wall').append(loadingTemplate);
		// });
		// d.on('remove-loading-bookmarks', function(event) {
			// $('#bookmark-loading').remove();
		// });
		d.on('more-bookmarks-available', function(event, ok) {
			if (ok) {
				more = true;
				$('#show-more-bookmarks').removeClass('disabled');
			} else {
				more = false;
				$('#show-more-bookmarks').addClass('disabled');				
			}
		});
		d.on('show-more-bookmarks', function(event) {
			if (more) {
				//d.trigger('apply-loading-bookmarks');
				sorter.showBookmarks();
			}
		});		
		/*
		 * event for activating a folder(s) as the current filter(s)
		 */
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
		});
		/*
		 * this event fires when we add tags to the selected tags list
		 */
		d.on('sorter-activate-tag', function(event, tag) {
			if (tag == '') {
				return;
			}
			sorter.activateTag(tag, function() {
				d.trigger('sort-bookmarks');
			});
		});
		/*
		 * this event fires when we remove a tag from the selected tags list
		 */
		d.on('sorter-diactivate-tag', function(event, tag) {
			if (tag == '') {
				return;
			}
			sorter.diactivateTag(tag, function() {
				d.trigger('sort-bookmarks');
			});
		});		
		/*
		 * this is a generic bookmark sorter event
		 */
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			sorter.sortBookmarks();
		});
		/*
		 * fires when we want to add a bookmark
		 */
		d.on('add-bookmark', function(event, url, folder, tags) {
			console.log(url, folder, tags);
			if (url == '') {
				return;
			}
			bookmarks.addBookmark(url, folder, tags);
		});
		
		// p.savingBookmarks.done(function(b) {
			// console.log(b);
		// });
		
		d.on('done-add-bookmark', function(event, b) {
			d.trigger('add-bookmark-to-view', [b]);
		});
		d.on('fail-add-bookmark', function(event) {
			
		});
		
		d.on('add-bookmark-to-view', function(event, b) {
			var cur;
			if (foldersView.currentFolder == null) {
				cur = 0;
			}
			if (foldersView.currentFolder == b.folderId) {
				view.addBookmarkToView(b);
			}
		});
		
		d.on('show-bookmark-nav-history', function(event) {
				view.showBookmarkNavHistory();
		});
		
		d.on('reset-bookmark-nav-history', function(event) {
			view.resetBookmarkNavHistory();
			navHistory = false;
		});
	}
};

BM.Mediator.init = function() {
		this.Tags.provide();
		this.Folders.provide();
		this.Bookmarks.provide();
};
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
				for (var i = 0, l = r.length; i < l; i++) {
					html.push("<a href='#' class='search-result'>" + r[i].name + "</a><br />");
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
/**
 * @author Robert
 * AppBoot.js
 */

BM.AppBoot = {
	user : {},

	getInfo : function() {
		var me = this;		
		var info = BM.p('info/app_boot', function(response) {
			if (response.status == 'ok') {
				me.user = response.data;
				me.displayUser();
			}			
		});
	},
	displayUser : function() {
		var holder = $('.current-user .username');
		holder.text(this.user.email);
	},
	removeLoading : function() {
		var loading = $('#main-loading'),
			app = $('#app-container'),
			d = $(document);
		d.on('remove-main-loading', function() {
			setTimeout(function() {
				loading.hide();
				app.fadeIn();
			}, 400);
		});
		d.on('change-main-loading', function(event, msg) {
			loading.find('span').html(msg);
		});
	},
	init : function() {
		var me = this;
		me.getInfo();
		me.removeLoading();
		BM.Folders.init();
		BM.Tags.init();
		BM.Bookmarks.init();
		BM.Mediator.init();	
		BM.Searcher.init();				
	},
	end : function() {
		
	}
};