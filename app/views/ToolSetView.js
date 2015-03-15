define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/toolset.html',
  'views/ToolView',
], function($, _, Backbone, toolsetTemplate, ToolView){
  var ToolSetView = Backbone.View.extend({
    
    el: $('#toolset'),
    is_move:false,
    last_position:{},
    nbTools:0,
    events: {
      'mousedown .titre':'startMoveToolset',
      'mouseup .titre':'endMoveToolset',
      'mousemove .titre': 'moveToolset'
    },

    initialize: function(options){
      var that = this;
      var url = "elements/";
      $.ajax({
        url: url,
        success: function(data){
           $(data).find("a:contains(elt_)").each(function(){
              that.nbTools++;
           });
           that.render();
           var n = 0;
            $(data).find("a:contains(elt_)").each(function(){
              new ToolView({url:url+$(this).attr("href"), el:$("#tool_"+n)});
              n++;
           });
        }
      });
    },

    startMoveToolset:function(e){
      e.preventDefault();
      this.is_move = true;
      this.last_position.x = e.clientX;
      this.last_position.y = e.clientY;
    },

    moveToolset: function(e){
      if(this.is_move == true){
        var deltaX = this.last_position.x - e.clientX;
        var deltaY = this.last_position.y - e.clientY;
        this.$el.css("top", (parseFloat(this.$el.css("top")) - deltaY) + "px");
        this.$el.css("left", (parseFloat(this.$el.css("left")) - deltaX) + "px");
        this.last_position.x = e.clientX;
        this.last_position.y = e.clientY;
      }
    },

    endMoveToolset:function(e){
      e.preventDefault();
      this.is_move = false;
    },

    render: function(){
      var that = this;
      var data = {nbTools: that.nbTools};
      var compiled = _.template(toolsetTemplate)(data);
      this.$el.append(compiled);
      this.delegateEvents();
    }

  });
  return ToolSetView;
});