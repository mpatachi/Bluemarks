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
	addBookmark : function(name, url, folderId, tagsId, typeId, callback) {
		var params = {
			name : name,
			url : url,
			folderId : folderId,
			tagsId : tagsId,
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
		});
		me.getBookmarks();
	}
};
