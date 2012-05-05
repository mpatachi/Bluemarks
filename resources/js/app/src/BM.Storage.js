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
			bookmarkRef : [],
			foldersRef : [],
			tagsRef : [],
			folderTree : [],
						
			storeBookmark : function($b) {
				var me = this;
				var dirId;		
				bookmarkCount++;
				var tagsIds = [];
				var tags = $b.tagsId.split(' ');
				var tagsRef = me.tagsRef;
				_(tags).each(function(cat) {
					_(tagsRef).each(function(obj) {
						if (obj.realId == cat) {
							tagsIds.push(obj.id);
						}
					});
				});
				// var tg = tags.length;
				// var tgr = tagsRef.length;
				// for (; tg > 0; tg--) {
					// for (; tgr > 0; tgr--) {
						// console.log(tagsRef[tgr]);
					// }
				// }
				
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
					name : $b.name, 
					folderId : $b.folderId, 
					tagsId : $b.tagsId, 
					typeId : $b.typeId, 
					noteId : $b.noteId,
					description : $b.description,
					url : $b.url,
					image : $b.image					
				};
				var proxy = {
					intId : bookmarkCount,
					folderId : dirId,
					typeId : $b.typeId,
					tagsId : tagsIds,
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
			storeAllFolders : function($list) {
				var me = this;
				var l = $list.length;
				var root = new BM.Entities.Relationer('root', []);
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
