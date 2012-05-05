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
				$(document).trigger('add-folder-success', [response.msg]);
			} else {
				$(document).trigger('add-folder-error', [response.msg]);
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
 		me.getFolders();
 		p.gettingFolders.done(function(data) {
 			console.log('# done getting folders');
 			BM.Storage.g().storeAllFolders(data);	
 		});
 		p.storingFolders.done(function() {
 			console.log('# done storing folders');
 			BM.Folders.View.init();
 			BM.Folders.View.AddFolder.init(); 			
 		});
	}
};
