/**
 * @author Robert
 * BM.js
 */

var BM = {};

BM = {
	/*
	 * the environment
	 * can be:
	 * 		1. development
	 * 		2. production
	 */
	environment : 'development',
	thumbnails : 'not-active',
	baseUri : function() {
		var win = window.location;
		//var origin = win.origin;
		var hostname = win.hostname;
		var protocol = win.protocol;
		var origin = protocol + '//' + hostname;
		if (this.environment == 'development') {
			origin += '/bluemarks';
		}
		return origin;		
	},
	apiUri : function() {
		///var api = this.baseUri() + '/bluemarks/api/';
		var api = this.baseUri() + '/api/';
		return api;
	},
	p : function(command, callback, params) {
		var toGet = this.apiUri() + command;
		//var uriParams = $.param(params);
		var action = $.post(toGet, params);
		action.success(callback);		
	},
	g : function(command, callback, params) {
		var toGet = this.apiUri() + command;
		var uriParams = undefined;
		
		//var uriParams = jQuery.param(params);
		// if (params) {
			// uriParams = $.param(params);
			// console.log(uriParams);	
		// }
		
		var action = $.get(toGet, params);

		action.success(callback);
	},
	e : function(fnc) {
		if (fnc && typeof(fnc) === 'function') {
			fnc();
		}
	}
};

BM.utils = {
	/**
	 * search function
	 * @param a array
	 * @param fnc function
	 * @param ns bool
	 * @param os bool 
	 * @return index
	 * note : if ns is set to true then if the input a is empty 
	 * -2 is returned to specifie that a is empty.
	 * 		  if os is set to true then the whole object is returned
	 * TODO: use the BM.utils.search instead.
	 */	
	search : function (a, fnc, ns, os) {
		var l = a.length;
		if (!fnc || typeof(fnc) != 'function') {
			return -1;
		}
		if (true === ns) {
			if (!a || !l) {
				return -1;
			}
			if (l < 1) {
				return -2;
			}
		} else {
			if (!a || !l || l < 1) {
				return -1;
			}
		}
		for (var i = 0; i < l; i++) {
			if (fnc(a[i])) {
				if (true === os) {
					return a[i];
				}
				return i;
			}
		}
		
		return -1;
	}
};
