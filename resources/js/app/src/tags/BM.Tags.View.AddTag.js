/**
 * @author Robert
 */
BM.Tags.View.AddTag = {
	bindHandlers : function() {
		var t = BM.Templater.Tags;
		var modal = t.getAddModal();
		//var submitBtn = modal.find('.modal-directory-add');
		//var nameField = modal.find('.modal-directory-name');
		//var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-tag', [modal.name.val()]);
			
			return false;
		});
	},
	init : function() {
		var me = this;
		
		me.bindHandlers();
	}	
};
