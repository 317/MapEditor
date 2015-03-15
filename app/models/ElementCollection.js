define([
	'jquery',
	'underscore',
	'backbone',
	'models/Element'
], function($, _, Backbone, Element){
  	var ElementCollection = Backbone.Collection.extend({
  		model: Element
	});
	return ElementCollection;
});

