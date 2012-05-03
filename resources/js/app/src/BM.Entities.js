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

BM.Entities.Category = (function() {
	var Category = function(id, name, intId) {
		this.id = id;
		this.name = name;
		this.intId = intId;
	};
	
	return function(id, name, intId) {
		return new Category(id, name, intId);
	};
})();

BM.Entities.Directory = (function() {
	var Directory = function(id, name, parentId, intId) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		this.intId = intId;
		//this.realParentId = realParentId;
	};
	
	return function(id, name, parentId, intId) {
		return new Directory(id, name, parentId, intId);
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
