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
