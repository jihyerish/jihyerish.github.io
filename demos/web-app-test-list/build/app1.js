
// source/models/models.js


// source/controllers/controllers.js


// source/views/main.js
enyo.kind({name:"MyApp.MainView",kind:"moon.Panel",classes:"moon main-view",controller:".app.controllers.messageController",bindings:[{from:".controller.message",to:".title"}],components:[{content:"Your content here"},{kind:"moon.CheckboxItem",content:"CSS Asset Check"},{kind:"enyo.Image",src:"$lib/moonstone/images/css3-icon.png"}],headerComponents:[{kind:"moon.IconButton",src:"assets/icon-like.png"}]});

// source/apps/app.js
enyo.kind({name:"MyApp.Application",kind:"enyo.Application",controllers:[{name:"messageController",kind:"enyo.Controller",message:$L("Hello BareMoon 3")}],view:"MyApp.MainView"});

// source/start.js
enyo.ready(function(){new MyApp.Application({name:"app"})});
