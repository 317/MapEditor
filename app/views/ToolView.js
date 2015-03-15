define([
  'jquery',     
  'underscore', 
  'backbone',
  'text!templates/tool.html',
  'models/Element'
], function($, _, Backbone, toolTemplate, Element){
	 var ToolView = Backbone.View.extend({
	 	el: $('#toolset_list'),
	 	events:{
	 		"click":"toolSelected"
	 	},
	 	tool:{},

	 	initialize: function(options){
	 		var that = this;
	 		that.setElement(options.el)
	 		that.tool = new Element(options, function(){
	 			that.render();
	 		});
	 	},

	 	toolSelected: function(e){
	 		//alert(this.el);
	 		App.mapView.currentToolChange(this.tool);
	 	},

	 	render: function(){
			var data = {"tool": this.tool};
			var compiled = _.template(toolTemplate)(data);
			this.$el.append(compiled)

	    }
	 });
	 return ToolView;
});

