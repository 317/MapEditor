App = {};

// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/MapView',
  'views/ToolSetView'
], function($, _, Backbone, MapView, ToolSetView){

  App.initialize = function(){
     App.mapView = new MapView({mapW:650, mapH:650});
     App.mapView.render();

     App.toolsetView = new ToolSetView();
     // App.toolsetView.render()
  }

  return {
    initialize: App.initialize
  };
});