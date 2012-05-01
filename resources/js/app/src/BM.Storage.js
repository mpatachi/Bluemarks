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
