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
