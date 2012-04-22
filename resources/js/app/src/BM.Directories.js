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
