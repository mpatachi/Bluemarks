/**
 * @author Robert
 */

BM.Entities = {};

BM.Entities.Bookmark = {
	
};

BM.Entities.Category = (function() {
	var Category = function(id, name) {
		this.id = id;
		this.name = name;
	};
	
	return function(id, name) {
		return new Category(id, name);
	};
})();

BM.Entities.Directory = (function() {
	var Directory = function(id, name, parentId) {
		this.id = id;
		this.name = name;
		this.parentId = parentId;
		//this.realId = realId;
		//this.realParentId = realParentId;
	};
	
	return function(id, name, parentId) {
		return new Directory(id, name, parentId);
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
