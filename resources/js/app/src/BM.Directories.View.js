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
	addDirectoryToList : function(directory) {
		var targetNode;
		var utils = BM.utils;
		var storage = BM.Storage.g();
		var t = BM.Templater.Directories;
		if (directory.parentId != 'null') {
			// var r = utils.search(storage.directoriesRef, function(i) {
				// return i.realId == directory.parentId;
			// });
			
			// if (-1 !== r) {
				// var nodeId = storage.directoriesRef[r].id;
				// targetNode = 'directory-' + nodeId;
				// var listTemplate = t.listTemplate(targetNode);
				// var node = $(".directory-btn[node-id='" + nodeId + "']");
				// node.attr('node-target', targetNode);
			// }
			var nodeId = directory.parentId;	//i have overwriten the parentId with the internal pId
			targetNode = 'directory-' + nodeId;
			var listTemplate = t.listTemplate(targetNode);
			var node = $(".directory-btn[node-id='" + nodeId + "']");
			node.attr('node-target', targetNode);
			t.directoriesListHolder().append(listTemplate);
		} else {
			targetNode = 'root';
		}
		var dirRef = 'directory-' + directory.intId;
		var r = utils.search(storage.directoryTree, function(it) {
			return it.ref == dirRef;
		});
		if (-1 === r) {
			dirRef = 'none';
		}
		var listItem = t.itemTemplate(directory.name, directory.intId, dirRef, targetNode);
		var target = $(".directories-list[node='" + targetNode + "']");
		target.append(listItem);
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
		var dList = $('.directories-list');
		var d = $(document);
		var dirNavigator = $('.directories-breadcum-navigation');
		var dirHolder = $('.directories-list-holder');
		
		dirHolder.on('click', '.directory-btn', function(event) {
			var item = $(this);
			var targetNode = item.attr('node-target');
			var nodeId = parseInt(item.attr('node-id'), 10);
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
					dirHolder.attr('active-node', nodeId);
				}
				
				d.trigger('sorter-activate-multiple-directories', [nodeId]);
			} else {
				d.trigger('sorter-activate-directory', [nodeId]);
			}
			
			//BM.Bookmarks.Sorter.g().activateDirectory(nodeId);	
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
				
				var temp = t[l-1].attr('node').split('-');
				var diactivate = parseInt(temp[1], 10);
				temp = t[l-2].attr('node').split('-');
				var activate = parseInt(temp[1], 10);
				if (temp[0] == 'root') {
					active = -1;
				}
				d.trigger('sorter-diactivate-multiple-directories', [diactivate]);	
				d.trigger('sorter-activate-multiple-directories', [activate]);
				dirHolder.attr('active-node', activate);
				
				me.activeList.splice(l-1, 1);			
			}

			return false;
		});
		
		var addDirInput = $('.add-new-directory');
		var addDirBtn = $('.add-directory-shortcut-btn');
		addDirInput.keyup(function(e) {
			if (e.keyCode == 27) {
				addDirInput.fadeOut(function() {
					addDirBtn.fadeIn();
				});
			}
		});
		addDirInput.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			
			var parent = dirHolder.attr('active-node');
			if (parent == -1) {
				parent = 'null';
			}
			d.trigger('add-directory', [addDirInput.val(), parent]);
			addDirInput.val('');
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirInput.blur(function() {
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirBtn.on('click', function() {
			$(this).fadeOut(function() {
				addDirInput.fadeIn();
				addDirInput.focus();
			});
			
			return false;
		});
	},
	init : function() {
		var me = this;
		$('.directories-list-holder').empty();
		
		me.listDirectories(function() {
			var r = $(".directories-list[node='root']");
			me.activeList.push(r);
			me.showDirectories(r);
			me.bindHandlers();
		});
	} 
};	