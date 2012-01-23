/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
/*global phantom, console */
/*jslint evil:true */
function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if(!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 100); //< repeat check every 100ms
}


if (phantom.args.length === 0 || phantom.args.length > 2) {
	console.log('Usage: run-jasmine.js URL');
	phantom.exit();
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.open(phantom.args[0], function(status){
	if (status !== "success") {
		console.log("Unable to access network");
		phantom.exit();
	} else {
		waitFor(function(){
			return page.evaluate(function(){
				if (document.body.querySelector('.finished-at')) {
					return true;
				}
				return false;
			});
		}, function(){
			page.evaluate(function(){
				var outputFailedRecursive = function( suiteEl, indentLevel ) {
					var i, j, len, msgLen,
					    indent = "";
					    
					for( i = 0; i < indentLevel; i++ ) {
						indent += '  ';
					}
					
					var suiteDescriptionEl = suiteEl.querySelector( '.description' );
					console.log( indent + suiteDescriptionEl.innerText );
					
					var childSuites = suiteEl.querySelectorAll( '.suite.failed' );
					for( i = 0, len = childSuites.length; i < len; i++ ) {
						// Because it seems we can't simply select children of a particular element using querySelectorAll, 
						// filter out non-children here
						if( childSuites[ i ].parentNode === suiteEl ) {
							outputFailedRecursive( childSuites[ i ], indentLevel + 1 );
						} 
					}
					
					var childSpecs = suiteEl.querySelectorAll( '.spec.failed' );
					for( i = 0, len = childSpecs.length; i < len; i++ ) {
						// Because it seems we can't simply select children of a particular element using querySelectorAll, 
						// filter out non-children here
						if( childSpecs[ i ].parentNode === suiteEl ) {
							var specDescriptionEl = childSpecs[ i ].querySelector( '.description' );
							console.log( indent + indent + specDescriptionEl.innerText );
							
							var messages = childSpecs[ i ].querySelectorAll( '.resultMessage.fail' );
							for( j = 0, msgLen = messages.length; j < msgLen; j++ ) {
								console.log( indent + indent + indent + messages[ j ].innerText );
							}
						}
					}
					
					console.log( '' );
				};
				
				console.log( document.body.querySelector( '.description' ).innerText );
				console.log( '' );
				var mainSuites = document.body.querySelectorAll( 'div.jasmine_reporter > div.suite.failed' );
				for (var i = 0, mainSuitesLen = mainSuites.length; i < mainSuitesLen; ++i) {
					outputFailedRecursive( mainSuites[ i ], 0 );
				}
			});
			phantom.exit();
		});
	}
});