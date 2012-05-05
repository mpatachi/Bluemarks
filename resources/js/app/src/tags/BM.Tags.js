/**
 * @author Robert
 */

BM.Tags = {
	getTags : function(callback, limit) {
		BM.p('tags/list_all', function(response) {
			if (response.status === 'ok') {
				// BM.Storage.g().storeAllTags(response.data);
				BM.Promiser.g().gettingTags.resolve(response.data);
				if (callback != undefined) {
					BM.e(callback);
				}
			}
		});
	},
	addTag : function(name, callback) {
		var params = {
			name : name
		};
		BM.p('tags/add', function(response) {
			if (response.status === 'ok') {
				var tag = {
					id : response.data.id,
					name : name
				};
				var newTag = BM.Storage.g().storeTag(tag);
				BM.Tags.View.addTagToList(newTag.tag);
				$(document).trigger('add-tag-success', [response.msg]);
			} else {
				$(document).trigger('add-tag-error', [response.msg]);
			}
		}, params);
	},
	init : function() {
		var me = this;
		var p = BM.Promiser.g();
		// me.getTags(function() {
			// BM.Tags.View.init();
			// BM.Tags.View.AddTag.init();
		// });
		me.getTags();
		p.gettingTags.done(function(data) {
			console.log('# done getting tags');
			BM.Storage.g().storeAllTags(data);
		});
		p.storingTags.done(function() {
			console.log('# done storing tags');
			BM.Tags.View.init();
			BM.Tags.View.AddTag.init();			
		});	
	}
};
