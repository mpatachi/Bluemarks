/**
 * @author Robert
 * Directories.View.js
 */
BM.Directories.View = {
	directoryHolder : 'directories-list',
	isLoading : false,
	activeDirectory : null,
	activeList : [],
	
	getDirectoriesHolder : function() {
		return $(this.directoryHolder);
	},
	listDirectories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Directories;
		var utils = BM.utils;
		
		_(storage.directoryTree).each(function(obj) {
			var listTemplate = t.listTemplate(obj.ref);

			_(obj.children).each(function(index) {
				var item = storage.getDirectory(index).directory;
				var dirRef = 'directory-' + item.intId;
				var r = utils.search(storage.directoryTree, function(it) {
					return it.ref == dirRef;
				});
				if (-1 === r) {
					dirRef = 'none';
				}
				var listItem = t.itemTemplate(item.name, item.intId, dirRef, obj.ref);
				listTemplate.append(listItem);
			});
			
			t.directoriesListHolder().append(listTemplate);
		});

		BM.e(callback);
	},
	showDirectories : function(item) {
		//var d = $(".directories-list[node='" + id + "']");
		item.fadeIn('200');
	},
	hideDirectories : function(item) {
		item.hide();
	},
	bindHandlers : function() {
		var me = this;
		var d = $('.directories-list');
		var dirNavigator = $('.directories-breadcum-navigation');

		d.on('click', 'a', function(event) {
			var item = $(this);
			var targetNode = item.attr('node-target');
			if (targetNode !== 'none') {
				var target = $(".directories-list[node='" + targetNode + "']");
				if(target.length > 0) {
					var toHide = item.parents('.directories-list');
					var parentNode = item.attr('node-parent');
					me.hideDirectories(toHide);
					me.showDirectories(target);
					dirNavigator.attr('node-target', parentNode);
					me.activeDirectory = target;	//introduce the active directory
					me.activeList.push(target);	//introduce the active directory to the active dir list 
				}
			}

			return false;
		});
		/*
		 * TODO: use a targeting system instead of array
		 */
		dirNavigator.on('click', function(event) {
			var t = me.activeList;
			var l = t.length;

			if (l > 1) {
				me.hideDirectories(t[l-1]);
				me.showDirectories(t[l-2]);
				me.activeList.splice(l-1, 1);
			}

			return false;
		});
	},
	init : function() {
		var me = this;
		me.listDirectories(function() {
			var r = $(".directories-list[node='root']");
			me.activeList.push(r);
			me.showDirectories(r);
			me.bindHandlers();
		});
	} 
};	