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
