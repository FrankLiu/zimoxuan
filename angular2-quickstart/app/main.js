(function(app){
	document.addEventListener('DOMContentLoaded', function(evt){
		ng.platform.browser.bootstrap(app.AppComponent);
	});
})(window.app || (window.app = {}));