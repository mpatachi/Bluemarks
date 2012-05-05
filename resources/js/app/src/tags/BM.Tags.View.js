/**
 * @author Robert
 */

BM.Tags.View = {
	ddItemTemplate : function(name, id) {
		var it = $("<li><a href='#' tag-id='" + id + "'>" + name + "</a></li>");
		
		return it;
	},
	listTags : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		_(storage.tags).each(function(obj, key) {
			var itemTample = me.ddItemTemplate(obj.tag.name, key);
			BM.Templater.Tags.ddTagHolder().append(itemTample);
		});
		
		if (callback !== undefined) {
			BM.e(callback);	
		}
	},
	populateTypeahead : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var typeahead = $('.apply-tag-input');
		var tags = [];
		_(storage.tags).each(function(obj, key) {
			tags.push(obj.tag.name);
		});
		typeahead.typeahead({
			source : tags
		});
		if (callback !== undefined) {
			BM.e(callback);	
		}		
	},
	addTagToList : function(tag, callback) {
		var me = this;
		var itemTample = me.ddItemTemplate(tag.name, tag.intId);
		BM.Templater.Tags.ddTagHolder().append(itemTample);
		
		if (callback !== undefined) {
			BM.e(callback);		
		}	
	},
	bindHandlers : function() {
		$('.sort-tags').on('click', function(event) {
			var item = $(this);
			var active = item.hasClass('active');
			var toolbar = $('.tags-toolbar');
			
			if (active) {
				toolbar.animate({
					'marginTop' : '-51px'
				}, 300, 'linear');
			} else {
				toolbar.animate({
					'marginTop' : 0
				}, 300, 'linear');				
			}
		});
	},
	init : function() {
		var me = this;
		
		me.populateTypeahead(function() {
			
		});
		me.bindHandlers();
	}
};
