define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone){
  	var Element = Backbone.Model.extend({

  		initialize: function(options, callback){
  			var that = this;
  			$.ajax({
            url:options.url+"data.json",
            success: function(data){
            	for (var key in data ){
				   that.set(key, data[key]);
				}
				
				that.set("img_url", that.get("url")+"image.png");

				var img = new Image();   // Crée un nouvel objet Image
				img.src = that.get("img_url");
				that.set("image", img)
				callback();
            }});
		}

	});
	return Element;
});

