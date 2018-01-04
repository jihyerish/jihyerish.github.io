enyo.path.addPath("enyo", "/usr/palm/frameworks/enyo/development/enyo");
enyo.path.addPath("lib/layout", "/usr/palm/frameworks/enyo/development/lib/layout");
enyo.path.addPath("lib/moonstone", "/usr/palm/frameworks/enyo/development/lib/moonstone");
enyo.path.addPath("lib/spotlight", "/usr/palm/frameworks/enyo/development/lib/spotlight");
enyo.path.addPath("lib/enyo-ilib", "/usr/palm/frameworks/enyo/development/lib/enyo-ilib");
enyo.path.addPath("lib/enyo-cordova", "/usr/palm/frameworks/enyo/development/lib/enyo-cordova");
enyo.path.addPath("lib/enyo-webos", "/usr/palm/frameworks/enyo/development/lib/enyo-webos");
enyo.path.addPath("lib", "lib");
enyo.depends(
	"/usr/palm/frameworks/enyo/development/lib/enyo-cordova/package.js",
	"/usr/palm/frameworks/enyo/development/lib/enyo-webos/package.js",
	"/usr/palm/frameworks/enyo/development/lib/layout/package.js",
	"/usr/palm/frameworks/enyo/development/lib/enyo-ilib/package.js",
	"/usr/palm/frameworks/enyo/development/lib/moonstone/package.js",
	"/usr/palm/frameworks/enyo/development/lib/spotlight/package.js",
	"build/app1.css",
	"build/app1.js"
);