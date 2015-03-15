define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/map.html'
], function($, _, Backbone, mapTemplate){
  var MapView = Backbone.View.extend({
    
    el: $('#container'),

    context:{},
    mapW:400,
    mapH:200,
    mapX:20,
    mapY:20,
    mouseX:0,
    mouseY:0,
    zoom:5,
    grid_color:'#eeeeee',
    current_tool:undefined,
    current_object:undefined,
    tool_mouseover_iterator:undefined,
    track_mouse:false,
    move_map: false,
    last_position:{},
    objects:[],

    events: {
      'mousewheel':'zoomFunction',
      'mouseover':'trackMouseStart',
      'mouseout':'trackMouseEnd',
      'mousemove':'trackMouse',
      'click':'clickMouse',
      'mousedown':'mouseDown',
      'mouseup':'mouseUp'
    },

    initialize: function(options){
      this.mapW = options.mapW / this.zoom;
      this.mapH = options.mapH / this.zoom;
      this.mapX = this.mapX / this.zoom;
      this.mapY = this.mapY / this.zoom;
    },

    mouseDown: function(e){
      e.preventDefault();
      if (e.button === 1) {
        this.move_map = true;
        this.last_position.x = e.pageX;
        this.last_position.y = e.pageY;

      }
    },

    mouseUp: function(e){
      e.preventDefault();
      if (e.button === 1) {
        this.move_map = false;
      }
    },

    currentToolChange: function(tool){
      this.current_tool = tool;
    },

    currentToolReset: function(){
      this.current_tool = undefined;
    },

    drawCurrentTool: function(){
      var that = this;
      if(that.current_tool != undefined && this.track_mouse == true){
        var size_x = that.current_tool.get("largeur") * this.zoom;
        var size_y = that.current_tool.get("hauteur") * this.zoom;
        that.context.drawImage(that.current_tool.get("image"), that.mouseX - (size_x/2), that.mouseY - (size_y/2), size_x, size_y);
      }
    },

    drawCurrentObject: function(){
      var that = this;
      if(that.current_object != undefined && this.track_mouse == true){
        var size_x = that.current_object.w * this.zoom;
        var size_y = that.current_object.h * this.zoom;
        that.context.drawImage(that.current_object.img, that.mouseX - (size_x/2), that.mouseY - (size_y/2), size_x, size_y);
      }
    },
    
    trackMouseStart:function(e){
      this.track_mouse = true;
      
    },
    
    trackMouseEnd:function(){
      this.track_mouse = false;
    },
    
    trackMouse: function(e){
        //Balade sur la map avec le clic molette
        if(this.move_map == true){
          var deltaX = this.last_position.x - e.pageX;
          var deltaY = this.last_position.y - e.pageY;
          var map = this.$el.find("#map");
          var newY = (parseFloat(map.css("top")) - deltaY);

          if(newY <= 0 && deltaY < 0) map.css("top", newY + "px");
          if(newY - $(window).height() > -map.height() && deltaY > 0) map.css("top", newY + "px");


          var newX = (parseFloat(map.css("left")) - deltaX);
          if(newX<=0 && newX - $(window).width() > -map.width()) map.css("left", newX + "px");
          this.last_position.x = e.clientX;
          this.last_position.y = e.clientY;
          return true;
        }
        var parentOffset = this.$el.parent().offset(); 
        this.mouseX = e.pageX - parentOffset.left;
        this.mouseY = e.pageY - parentOffset.top;

        for(var i=0; i<this.objects.length;i++){
          if(this.objects[i].x * this.zoom<e.pageX && e.pageX<this.objects[i].x * this.zoom + this.objects[i].w * this.zoom){
            if(this.objects[i].y * this.zoom<e.pageY && e.pageY<this.objects[i].y * this.zoom + this.objects[i].h * this.zoom){
              this.tool_mouseover_iterator = i;
              return true;
            }
          }
        }
        this.tool_mouseover_iterator = undefined;
    },

    clickMouse: function(e){
      if(this.current_tool != undefined && this.track_mouse == true){
        var object = {};
        var size_x = this.current_tool.get("largeur") ;
        var size_y = this.current_tool.get("hauteur") ;
        object.img = this.current_tool.get("image");
        object.x = (this.mouseX)/this.zoom - (size_x/2);
        object.y = (this.mouseY)/this.zoom - (size_y/2);
        object.w = size_x;
        object.h = size_y;
        this.objects.push(object);
        this.currentToolReset();
      }

      if(this.current_object != undefined && this.track_mouse == true){
        var object = {};
        var size_x = this.current_object.w ;
        var size_y = this.current_object.h ;
        object.img = this.current_object.img;
        object.x = (this.mouseX)/this.zoom - (size_x/2);
        object.y = (this.mouseY)/this.zoom - (size_y/2);
        object.w = size_x;
        object.h = size_y;
        this.objects.push(object);
        this.current_object = undefined;
      }else if(this.tool_mouseover_iterator != undefined){
        this.current_object = this.objects[this.tool_mouseover_iterator];
        this.objects.splice(this.tool_mouseover_iterator, 1);
        this.tool_mouseover_iterator = undefined;
        this.track_mouse = true;

      }
    },

    zoomFunction: function(e){
      if(e.originalEvent.wheelDelta > 0){ //Zoom in
        if(this.zoom < 10)this.zoom ++;
      }else{ //Zoom out
        if(this.zoom > 1)this.zoom --;
      }
      this.redraw();
    },

    drawMap: function(){
      this.$el.find("#map")[0].width = this.mapW * this.zoom;
      this.$el.find("#map")[0].height = this.mapH * this.zoom;
    },

    drawGrid: function(){
      this.context = this.$el.find("#map")[0].getContext("2d");
      this.context.fillStyle = this.grid_color;
      for(var ix = 0; ix <= this.mapW * this.zoom; ix += this.mapX * this.zoom){
         this.context.fillRect(ix,0,1,this.mapH  * this.zoom);
      }

       for(var iy = 0; iy <= this.mapW * this.zoom; iy += this.mapX * this.zoom){
         this.context.fillRect(0, iy,this.mapW  * this.zoom, 1);
      }
      
    },

    drawObjects:function(){
      for(var i=0; i<this.objects.length;i++){
        this.context.drawImage(this.objects[i].img, this.objects[i].x * this.zoom, this.objects[i].y * this.zoom, this.objects[i].w * this.zoom, this.objects[i].h * this.zoom);
      }
    },

    render: function(){
      var data = {};
      var compiledTemplate = _.template( mapTemplate, data );
      this.$el.append( compiledTemplate );
      this.redraw();
    },

    redraw: function(){
      var that = this;
      this.drawMap();
      this.drawGrid();
      this.drawObjects();
      this.drawCurrentTool();
      this.drawCurrentObject();
      setTimeout(function(){that.redraw();}, 15);
    }


  });
  return MapView;
});