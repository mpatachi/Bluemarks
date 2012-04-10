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
