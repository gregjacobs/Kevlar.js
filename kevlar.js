/*!
 * Kevlar JS Library
 * Copyright(c) 2011 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 */
// Note: Kevlar license header automatically injected by build process.

/*!
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * 
 * Parts of this library are from Ext-Core.
 * 
 * MIT Licensed - http://extjs.com/license/mit.txt
 */

/*global window, jQuery */
/*jslint forin: true */
/**
 * @class Kevlar
 * @singleton
 * 
 * Main singleton class for the Kevlar library. 
 */
var Kevlar = function() {
	
	// Set up environment info
	this.uA             = window.navigator.userAgent.toLowerCase();
	this.browserVersion = parseFloat(this.uA.match(/.+(?:rv|it|ml|ra|ie)[\/: ]([\d.]+)/)[1]);
	this.isSafari       = /webkit/.test( this.uA );
	this.isOpera        = /opera/.test( this.uA );
	this.isIE           = /msie/.test( this.uA ) && !( /opera/.test( this.uA ) );
	this.isMoz          = /mozilla/.test( this.uA ) && !( /(compatible|webkit)/.test( this.uA ) );
	this.isWebKit       = /applewebkit/.test( this.uA );
	this.isGecko        = /gecko/.test( this.uA ) && ( /khtml/.test( this.uA ) === false );
	this.isKHTML        = /khtml/.test( this.uA );
	this.isMobileSafari = !!this.uA.match( /apple.*mobile.*safari/ );
	
	this.isMac          = /mac/.test( this.uA );
	this.isWindows      = /win/.test( this.uA );
	this.isLinux        = /linux/.test( this.uA );
	this.isUnix         = /x11/.test( this.uA );
};


Kevlar.prototype = {
	constructor : Kevlar,   // fix constructor property
	
	
	/**
	 * An empty function. This can be referred to in cases where you want a function
	 * but do not want to create a new function object. Used for performance and clarity
	 * reasons.
	 *
	 * @method emptyFn
	 */
	emptyFn : function() {},
	
	
	/**
	 * An abstract function (method). This can be referred to in cases where you want a function
	 * that is abstract, but do not want to create a new function object with a new thrown
	 * error string (which can bloat the code when repeated over many abstract classes/functions).
	 * One should check the call stack when this error is thrown to determine which abstract
	 * method they forgot to implement. 
	 * 
	 * Ex in a class's prototype object literal definition:
	 *     someMethod: Kevlar.abstractFn
	 *
	 * @method abstractFn
	 */
	abstractFn : function() {
		throw new Error( "method must be implemented in subclass" );
	},
	
	
	// --------------------------------
	

	/**
	 * Generates a new id. The id is a sequentially increasing number, starting with
	 * the first returned number being 1.
	 * 
	 * @method newId
	 * @return {Number} The new id.
	 */
	newId : (function() {
		var id = 0;
		return function() {
			return ++id;	
		};
	})(),
	
	
	// --------------------------------
	
	
	/**
	 * Copies all the properties of config to obj.
	 *
	 * @method apply
	 * @param {Object} obj The receiver of the properties
	 * @param {Object} config The source of the properties
	 * @param {Object} defaults A different object that will also be applied for default values
	 * @return {Object} returns obj
	 */
	apply : function( o, c, defaults ) {
		if( defaults ) {
			Kevlar.apply(o, defaults);  // no "this" reference for friendly out of scope calls
		}
		if( o && c && typeof c == 'object' ) {
			for( var p in c ) {
				o[ p ] = c[ p ];
			}
		}
		return o;
	},
	
	
	/**
	 * Copies all the properties of config to obj if they don't already exist.
	 *
	 * @method applyIf
	 * @param {Object} obj The receiver of the properties
	 * @param {Object} config The source of the properties
	 * @return {Object} returns obj
	 */
	applyIf : function( o, c ) {
		if( o ) {
			for( var p in c ) {
				if( !Kevlar.isDefined( o[ p ] ) ) {  // no "this" reference for friendly out of scope calls
					o[ p ] = c[ p ];
				}
			}
		}
		return o;
	},
	
	
	/**
	 * Copies a set of named properties fom the source object to the destination object.
	 * <p>example:<pre><code>
ImageComponent = Kevlar.extend(ui.Component, {
	initComponent: function() {
		MyComponent.superclass.initComponent.apply(this, arguments);
		this.initialBox = Kevlar.copyTo({}, this.initialConfig, 'x,y,width,height');
	}
});
	 * </code></pre>
	 * 
	 * @method copyTo
	 * @param {Object} dest The destination object.
	 * @param {Object} source The source object.
	 * @param {Array/String} names Either an Array of property names, or a comma-delimited list
	 * of property names to copy.
	 * @return {Object} The modified object.
	*/
	copyTo : function( dest, source, names ) {
		if( typeof names == 'string' ) {
			names = names.split(/[,;\s]/);
		}
		Kevlar.each( names, function( name ) {
			if( source.hasOwnProperty( name ) ) {
				dest[ name ] = source[ name ];
			}
		}, this );
		return dest;
	},
	
	
	/**
	 * <p>Extends one class to create a subclass of it based on a passed literal (`overrides`), and optionally any mixin 
	 * classes that are desired.</p>
	 * 
	 * <p>
	 *   This method adds a few methods to the class that it creates:
	 *   <div class="mdetail-params">
	 *     <ul>
	 *       <li><b>override</b>
	 *         <div class="sub-desc">Method that can be used to override members of the class with a passed object literal.</div>
	 *       </li>
	 *       <li><b>extend</b>
	 *         <div class="sub-desc">Method that can be used to extend the class, without calling Kevlar.extend(). Accepts the 2nd and 3rd arguments to this method (Kevlar.extend).</div>
	 *       </li>
	 *       <li><b>hasMixin</b>
	 *         <div class="sub-desc">
	 *           Method that can be used to find out if the class (or any of its superclasses) implement a given mixin. Accepts one argument: the class (constructor function) of the mixin. 
	 *           Note that it is preferable to check if a given object is an instance of another class or has a mixin by using the {@link Kevlar#isInstanceOf} method. This hasMixin() method will just
	 *           determine if the class has a given mixin, and not if it is an instance of a superclass, or even an instance of itself.
	 *         </div>
	 *       </li>
	 *     </ul>
	 *   </div>
	 * </p>
	 * 
	 * For example, to create a subclass of Kevlar.util.Observable, which will provide Observable events for the class:
	 * <pre><code>
MyComponent = Kevlar.extend( Kevlar.util.Observable, {
	
	constructor : function( config ) {
		// apply the properties of the config to the object
		Kevlar.apply( this, config );
		
		// Call superclass constructor
		MyComponent.superclass.constructor.call( this );
		
		// Your postprocessing here
	},
	
	// extension of another method (assuming Observable had this method)
	someMethod : function() {
		// some preprocessing, if needed
	
		MyComponent.superclass.someMethod.apply( this, arguments );  // send all arguments to superclass method
		
		// some post processing, if needed
	},

	// a new method for this subclass (not an extended method)
	yourMethod: function() {
		// etc.
	}
} );
</code></pre>
	 *
	 * This is an example of creating a class with a mixin called MyMixin:
	 * <pre><code>
MyComponent = Kevlar.extend( Kevlar.util.Observable, [ MyMixin ], {
	
	constructor : function( config ) {
		// apply the properties of the config to the object
		Kevlar.apply( this, config );
		
		// Call superclass constructor
		MyComponent.superclass.constructor.call( this );
		
		// Call the mixin's constructor
		MyMixin.constructor.call( this );
		
		// Your postprocessing here
	},
	
	
	// properties/methods of the mixin will be added automatically, if they don't exist already on the class
	
	
	// method that overrides or extends a mixin's method
	mixinMethod : function() {
		// call the mixin's method, if desired
		MyMixin.prototype.mixinMethod.call( this );
		
		// post processing
	}
	
} );
</code></pre>
	 *
	 * @param {Function} superclass The constructor function of the class being extended.
	 * @param {Array} mixins (optional) Any mixin classes (constructor functions) that should be mixed into the new subclass
	 *   after it is extended from the superclass.  Mixin properties/methods will <em>not</em> overwrite class methods, and
	 *   mixins are taken in the supplied order for later-defined mixins to take precedence over earlier-defined mixins in the array.
	 *   This argument is the second argument to allow client code to be clean and readable.
	 * @param {Object} overrides <p>An object literal with members that make up the subclass's properties/method. These are copied into the subclass's
	 *   prototype, and are therefore shared between all instances of the new class.</p> <p>This may contain a special member named
	 *   `<b>constructor</b>`, which is used to define the constructor function of the new subclass. If this property is <i>not</i> specified,
	 *   a constructor function is generated and returned which just calls the superclass's constructor, passing on its parameters.</p>
	 *   <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
	 * @return {Function} The subclass constructor from the `overrides` parameter, or a generated one if not provided.
	 */
	extend : (function() {
		// Set up some vars that will be used with the extend() method
		var classIdCounter = 0,  // a variable used for assigning a unique ID to each function, for use with the hasMixin() method that is attached to subclasses. Will be incremented for each new function.
		    objectConstructor = Object.prototype.constructor;
		
		// inline overrides function
		var inlineOverride = function( o ) {
			for( var m in o ) {
				this[ m ] = o[ m ];
			}
		};

		// extend() method itself
		return function( superclass, mixins, overrides ) {
			// mixins is an optional argument. it is at the 2nd argument position to allow client code to be clean and readable
			if( !Kevlar.isArray( mixins ) ) {
				overrides = mixins;
				mixins = [];   // empty mixins array. Needed because it will be attached to the subclass Function object.
			}
			
			var subclass = overrides.constructor != objectConstructor ? overrides.constructor : function() { superclass.apply( this, arguments ); },
			    F = function(){},
			    subclassPrototype,
			    superclassPrototype = superclass.prototype;
			
			F.prototype = superclassPrototype;
			subclassPrototype = subclass.prototype = new F();  // set up prototype chain
			subclassPrototype.constructor = subclass;          // fix constructor property
			subclass.superclass = superclassPrototype;
			
			// If the superclass is Object, set its constructor property to itself
			if( superclassPrototype.constructor == objectConstructor ) {
				superclassPrototype.constructor = superclass;
			}
			
			// Attach extra methods to subclass
			subclass.override = function( o ){
				Kevlar.override( subclass, o );
			};
			subclassPrototype.superclass = subclassPrototype.supr = ( function() {
				return superclassPrototype;
			} );
			subclassPrototype.override = inlineOverride;   // inlineOverride function defined above
			
			// Add the properties/methods defined in the "overrides" config (which is basically the subclass's 
			// properties/methods) onto the subclass prototype now
			Kevlar.override( subclass, overrides );
			
			subclass.extend = function( mixins, object ) { return Kevlar.extend( subclass, mixins, object ); };
			
			// Expose the constructor property on the class itself (as opposed to only on its prototype, which is normally only
			// available to instances of the class)
			subclass.constructor = subclassPrototype.constructor;
			
			
			// -----------------------------------
			
			
			// Handle mixins by applying their methods/properties to the subclass prototype. Methods defined by
			// the class itself will not be overwritten, and the later defined mixins take precedence over earlier
			// defined mixins. (Moving backwards through the mixins array to have the later mixin's methods/properties take priority)
			for( var i = mixins.length-1; i >= 0; i-- ) {
				var mixinPrototype = mixins[ i ].prototype;
				for( var prop in mixinPrototype ) {
					// Do not overwrite properties that already exist on the prototype
					if( typeof subclassPrototype[ prop ] === 'undefined' ) {
						subclassPrototype[ prop ] = mixinPrototype[ prop ];
					}
				}
			}
			
			// Store which mixin classes the subclass has. This is used in the hasMixin() method
			subclass.mixins = mixins;
						
			var mixinCache = {};  // cache used for caching results of if the given class has a mixin
			
			// Create the hasMixin() method as a static method on the subclass, and on the subclass's prototype, for determining 
			// if a given class/subclass has a mixin on itself, or any of its superclasses
			subclass.hasMixin = subclassPrototype.hasMixin = function( mixinClass, /* optional arg for the method itself, which defaults to the subclass */ nextParentClass ) {
				// Assign the mixinClass (the class we're looking for as a mixin) an ID if it doesn't yet have one
				var mixinClassId = mixinClass._classId;
				if( !mixinClassId ) {
					mixinClassId = mixinClass._classId = ++classIdCounter;  // classIdCounter is from the closure of the extend() method
				}
				
				// If we have the results of a call to this method for this mixin already, returned the cached result
				if( typeof mixinCache[ mixinClassId ] !== 'undefined' ) {
					return mixinCache[ mixinClassId ];
				
				} else {
					// No cached result from a previous call to this method for the mixin, do the lookup
					var currentClass = nextParentClass || subclass,  // subclass is from closure
					    mixins = currentClass.mixins;
					
					// The current class (which must be a super class of the subclass in this case) was not set up using extend(), and doesn't 
					// have the 'mixins' property. Return false immediately.
					if( !mixins ) {
						mixinCache[ mixinClassId ] = false;
						return false;
					}
					
					
					// Look for the mixin on the current class we're processing
					for( var i = 0, len = mixins.length; i < len; i++ ) {
						if( mixins[ i ] === mixinClass ) {
							// mixin was found, cache the result and return true now
							mixinCache[ mixinClassId ] = true;
							return true;
						}
					}
					
					// mixin wasn't found, check its superclass for the mixin (if it has one)
					if( currentClass.superclass && currentClass.superclass.constructor && currentClass.superclass.constructor !== Object ) {
						var returnValue = arguments.callee( mixinClass, currentClass.superclass.constructor );
						mixinCache[ mixinClassId ] = returnValue;  // cache the result from the call to its superclass
						return returnValue;
						
					} else {
						// mixin wasn't found, and the class has no superclass, cache the result and return false
						mixinCache[ mixinClassId ] = false;
						return false;
					}
				}
			};
			
			return subclass;
		};
	})(),
	
	
	/**
	 * Determines if a given object (`obj`) is an instance of a given class (`jsClass`). This method will
	 * return true if the `obj` is an instance of the `jsClass` itself, if it is a subclass of the `jsClass`,
	 * or if the `jsClass` is a mixin on the `obj`. For more information about classes and mixins, see the
	 * {@link #extend} method.
	 * 
	 * @method isInstanceOf
	 * @param {Mixed} obj The object to test.
	 * @param {Function} jsClass The class (constructor function) to see if the obj is an instance of, or has a mixin
	 * @return {Boolean} True if the obj is an instance of the jsClass (it is a direct instance of it, 
	 *   it inherits from it, or the jsClass is a mixin of it)
	 */
	isInstanceOf : function( obj, jsClass ) {
		if( typeof jsClass !== 'function' ) {
			throw new Error( "jsClass argument of isInstanceOf method expected a Function (constructor function) for a JavaScript class" );
		}
		
		if( !Kevlar.isObject( obj ) ) {   // note: no 'this' reference on Kevlar.isObject() for friendly out-of-scope calls (i.e. method is called when reference is locally cached)
			return false;
		} else if( obj instanceof jsClass ) {
			return true;
		} else if( obj.hasMixin && obj.hasMixin( jsClass ) ) {  // make sure it has the hasMixin method first. It will have this method if the object was set up with Kevlar.extend()
			return true;
		} else {
			return false;
		}
	},


	/**
	 * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
	 * Usage:<pre><code>
Kevlar.override(MyClass, {
	newMethod1: function(){
		// etc.
	},
	newMethod2: function(foo){
		// etc.
	}
});
</code></pre>
	 * @param {Object} origclass The class to override
	 * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
	 * containing one or more methods.
	 * @method override
	 */
	override : function( origclass, overrides ) {
		if( overrides ){
			var p = origclass.prototype;
			Kevlar.apply( p, overrides );
			if( Kevlar.isIE && overrides.hasOwnProperty( 'toString' ) ){
				p.toString = overrides.toString;
			}
		}
	},
	
	

	/**
	 * Creates namespaces to be used for scoping variables and classes so that they are not global.
	 * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
	 * <pre><code>
Kevlar.namespace('Company', 'Company.data');
Kevlar.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
	 * @param {String} namespace1
	 * @param {String} namespace2
	 * @param {String} etc...
	 * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
	 * @method namespace
	 */
	namespace : function(){
		var o, d;
		Kevlar.each( arguments, function(v) {
			d = v.split( "." );
			o = window[ d[ 0 ] ] = window[ d[ 0 ] ] || {};
			Kevlar.each( d.slice( 1 ), function( v2 ) {
				o = o[ v2 ] = o[ v2 ] || {};
			} );
		} );
		return o;
	},

	/**
	 * Converts any iterable (numeric indices and a length property) into a true array
	 * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
	 * For strings, use this instead: "abc".match(/./g) => [a,b,c];
	 * @param {Array/Arguments/NodeList} a The iterable object to be turned into a true Array.
	 * @return {Array} The array.
	 */
	toArray : function( a, i, j, res ) {  // used in Kevlar.util.Observable
		if( Kevlar.isIE ) {
			res = [];
			for( var x = 0, len = a.length; x < len; x++ ) {
				res.push( a[ x ] );
			}
			return res.slice( i || 0, j || res.length );
		} else {
			return Array.prototype.slice.call( a, i || 0, j || a.length );
		}
	},
	

	/**
	 * Iterates an array calling the supplied function.
	 * @param {Array/NodeList/Mixed} array The array to be iterated. If this
	 * argument is not really an array, the supplied function is called once.
	 * @param {Function} fn The function to be called with each item. If the
	 * supplied function returns false, iteration stops and this method returns
	 * the current <code>index</code>. This function is called with
	 * the following arguments:
	 * <div class="mdetail-params"><ul>
	 * <li><code>item</code> : <i>Mixed</i>
	 * <div class="sub-desc">The item at the current <code>index</code>
	 * in the passed <code>array</code></div></li>
	 * <li><code>index</code> : <i>Number</i>
	 * <div class="sub-desc">The current index within the array</div></li>
	 * <li><code>allItems</code> : <i>Array</i>
	 * <div class="sub-desc">The <code>array</code> passed as the first
	 * argument to <code>Kevlar.each</code>.</div></li>
	 * </ul></div>
	 * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
	 * Defaults to the <code>item</code> at the current <code>index</code>
	 * within the passed <code>array</code>.
	 * @return {Mixed} See description for the fn parameter.
	 */
	each : function( array, fn, scope ){   // needed for Kevlar.DelayedTask, and Kevlar.Observable
		if( Kevlar.isEmpty( array, true ) ) {
			return;
		}
		if( typeof array.length === 'undefined' || Kevlar.isPrimitive( array ) ) {
			array = [ array ];
		}
		for( var i = 0, len = array.length; i < len; i++ ) {
			if( fn.call( scope || array[i], array[i], i, array ) === false ) {
				return i;
			}
		}
	},
	
	
	// --------------------------------
	
	
	/**
	 * An accurate way of checking whether a given value is an Array.
	 *
	 * @method isArray
	 * @param {Mixed} a The value to check.
	 * @return {Boolean}
	 */
	isArray : function( v ) {
		return !!v && Object.prototype.toString.apply( v ) === '[object Array]';
	},
	
	/**
	 * Whether a given value is an Object.
	 *
	 * @method isObject
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isObject : function( v ) {
		return !!v && Object.prototype.toString.call( v ) === '[object Object]';  
	},
	
	/**
	 * Whether a given value is a Function.
	 *
	 * @method isFunction
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isFunction : function( v ) {
		return !!v && v.constructor === Function;  
	},
	
	
	/**
	 * Returns true if the passed object is a JavaScript date object, otherwise false.
	 *
	 * @param {Object} object The object to test
	 * @return {Boolean}
	 */
	isDate : function( v ) {
		return Object.prototype.toString.apply( v ) === '[object Date]';
	},
	
	
	/**
	 * Whether a given value is a String.
	 *
	 * @method isString
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isString : function( v ) {
		return typeof v === 'string';
	},
	
	/**
	 * Whether a given value is a Number.
	 *
	 * @method isNumber
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isNumber : function( v ) {
		return typeof v === 'number' && isFinite( v ); 
	},
	
	/**
	 * Whether a given value is a Boolean.
	 *
	 * @method isBoolean
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isBoolean : function( v ) {
		return typeof v === 'boolean';
	},
	  
	/**
	 * Whether a given value is a Regular Expression.
	 *
	 * @method isRegExp
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isRegExp : function( v ) {
		return !!v && v.constructor === RegExp;  
	},
	
	/**
	 * Whether a given value is an DOM element.
	 *
	 * @method isElement
	 * @param {Mixed} v The value to check.
	 * @return {Boolean}
	 */
	isElement : function( v ) {
		return v ? v.nodeType === 1 : false;
	},
	
	/**
	 * Returns true if the given `value` is a jQuery wrapped set object.
	 * 
	 * @method isJQuery
	 * @param {Mixed} value The value to check.
	 * @return {Boolean}
	 */
	isJQuery : function( value ) {
		return value instanceof jQuery;
	},
	
	/**
	 * Returns true if the passed value is not undefined.
	 *
	 * @param {Mixed} value The value to test
	 * @return {Boolean}
	 */
	isDefined : function( v ) {
		return typeof v !== 'undefined';
	},
	
	/**
	 * Whether a given value is undefined.
	 *
	 * @method isUndefined
	 * @param  {Mixed} v The value to check
	 * @return {Boolean}
	 */
	isUndefined : function( v ) {
		return typeof v === 'undefined';
	},
	
	/**
	 * Returns true if the passed value is a JavaScript 'primitive' (i.e. a string, number, or boolean).
	 *
	 * @param {Mixed} value The value to test.
	 * @return {Boolean}
	 */
	isPrimitive : function( v ) {
		return Kevlar.isString( v ) || Kevlar.isNumber( v ) || Kevlar.isBoolean( v );
	},
	
	/**
	 * <p>Returns true if the passed value is empty.</p>
	 * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
	 * <li>null</li>
	 * <li>undefined</li>
	 * <li>an empty array</li>
	 * <li>a zero length string (Unless the `allowBlank` parameter is `true`)</li>
	 * </ul></div>
	 * @param {Mixed} value The value to test
	 * @param {Boolean} [allowBlank=false] True to allow empty strings.
	 * @return {Boolean}
	 */
	isEmpty : function( v, allowBlank ) {
		return v === null || v === undefined || ((Kevlar.isArray( v ) && !v.length)) || (!allowBlank ? v === '' : false);
	},
	
	
	
	// --------------------------------
	

	/**
	 * Escapes the passed string for use in a regular expression.
	 * @param {String} str
	 * @return {String}
	 */
	escapeRe : function(s) {
		return s.replace(/([\-.*+?\^$\{\}\(\)|\[\]\/\\])/g, "\\$1");
	}
	
};


// Create global Kevlar singleton over class
Kevlar = new Kevlar();

/*global Kevlar */
Kevlar.namespace(
	'Kevlar.persistence',
	'Kevlar.util'
);

/*global window, Kevlar */
/*jslint forin: true */
(function(){

var KevlarUTIL = Kevlar.util,
    TOARRAY = Kevlar.toArray,
    EACH = Kevlar.each,
    ISOBJECT = Kevlar.isObject,
    TRUE = true,
    FALSE = false;
	
/**
 * @class Kevlar.util.Observable
 * Base class that provides a common interface for publishing events. Subclasses are expected to
 * to have a property "events" with all the events defined, and, optionally, a property "listeners"
 * with configured listeners defined.<br>
 * For example:
 * <pre><code>
Employee = Kevlar.extend(Kevlar.util.Observable, {
    constructor: function(config){
        this.name = config.name;
        this.addEvents({
            "fired" : true,
            "quit" : true
        });

        // Copy configured listeners into *this* object so that the base class&#39;s
        // constructor will add them.
        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        Employee.superclass.constructor.call(config)
    }
});
</code></pre>
 * This could then be used like this:<pre><code>
var newEmployee = new Employee({
    name: employeeName,
    listeners: {
        quit: function() {
            // By default, "this" will be the object that fired the event.
            alert(this.name + " has quit!");
        }
    }
});
</code></pre>
 */
KevlarUTIL.Observable = function(){
    /**
     * @cfg {Object} listeners (optional) <p>A config object containing one or more event handlers to be added to this
     * object during initialization.  This should be a valid listeners config object as specified in the
     * {@link #addListener} example for attaching multiple handlers at once.</p>
     * To access DOM events directly from a Component's HTMLElement, listeners must be added to the <i>{@link ui.Component#getEl Element}</i> 
     * after the Component has been rendered. A plugin can simplify this step:<pre><code>
// Plugin is configured with a listeners config object.
// The Component is appended to the argument list of all handler functions.
DomObserver = Kevlar.extend(Object, {
    constructor: function(config) {
        this.listeners = config.listeners ? config.listeners : config;
    },

    // Component passes itself into plugin&#39;s init method
    initPlugin: function(c) {
        var p, l = this.listeners;
        for (p in l) {
            if (Kevlar.isFunction(l[p])) {
                l[p] = this.createHandler(l[p], c);
            } else {
                l[p].fn = this.createHandler(l[p].fn, c);
            }
        }

        // Add the listeners to the Element immediately following the render call
        c.render = c.render.{@link Function#createSequence createSequence}(function() {
            var e = c.getEl();
            if (e) {
                e.on(l);
            }
        });
    },

    createHandler: function(fn, c) {
        return function(e) {
            fn.call(this, e, c);
        };
    }
});

var combo = new Kevlar.form.ComboBox({

    // Collapse combo when its element is clicked on
    plugins: [ new DomObserver({
        click: function(evt, comp) {
            comp.collapse();
        }
    })],
    store: myStore,
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all'
});
     * </code></pre></p>
     */
    var me = this, e = me.events;
    me.events = e || {};
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
};

KevlarUTIL.Observable.prototype = {
    // private
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    /**
     * <p>Fires the specified event with the passed parameters (minus the event name).</p>
     * <p>An event may be set to bubble up an Observable parent hierarchy (See {@link ui.Component#getBubbleTarget})
     * by calling {@link #enableBubble}.</p>
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fireEvent : function() {
        var args = TOARRAY(arguments),
            eventName = args[0].toLowerCase(),
            me = this,
            ret = TRUE,
            ce = me.events[eventName],
            q,
            parentComponent;
			
        if (me.eventsSuspended === TRUE) {
			q = me.eventQueue;
            if (q) {
                q.push(args);
            }
			
        } else if( ISOBJECT(ce) && ce.bubble ) {
            if( ce.fire.apply( ce, args.slice( 1 ) ) === false ) {
                return FALSE;
            }
			
			// Firing of the event on this Observable didn't return false, check the bubbleFn for permission (if the event has one).
			// If the bubbleFn returns false, we return here and don't bubble
			var bubbleFn = ce.bubbleFn,
			    bubbleFnScope = ce.bubbleFnScope;
				
			if( bubbleFn && bubbleFn.call( bubbleFnScope, this ) === false ) {
				return false;
			}
			
			
			// fire the event on the "parent" Observable (i.e. the "bubble target" observable)
            parentComponent = me.getBubbleTarget && me.getBubbleTarget();
            if( parentComponent && parentComponent.enableBubble ) {  // test for if parentComponent is an Observable?
				// If the parentComponent doesn't have the bubbled event, 
				// or the bubbled event on the parentComponent is not yet an Event object, 
				// or the bubbled event on the parentComponent doesn't have the bubble flag set to true,
				// or the bubbled event on the parentComponent doesn't have a bubbleFn, but this one does
				// then run enableBubble for the event on the parentComponent
                if( !parentComponent.events[ eventName ] || !Kevlar.isObject( parentComponent.events[ eventName ] ) || !parentComponent.events[ eventName ].bubble || ( !parentComponent.events[ eventName ].bubbleFn && bubbleFn ) ) {
                    parentComponent.enableBubble( {
						eventName: eventName,
						bubbleFn: bubbleFn,
						scope: bubbleFnScope
					} );
                }
                return parentComponent.fireEvent.apply( parentComponent, args );
            }
			
        } else {
            if( ISOBJECT( ce ) ) {
                args.shift();
                ret = ce.fire.apply( ce, args );
            }
        }
		
        return ret;
    },

    /**
     * Appends an event handler to this object.
     * @param {String}   eventName The name of the event to listen for.
     * @param {Function} handler The method the event invokes.
     * @param {Object}   scope (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to the object which fired the event.</b>
     * @param {Object}   options (optional) An object containing handler configuration.
     * properties. This may contain any of the following properties:<ul>
     * <li><b>scope</b> : Object<div class="sub-desc">The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to the object which fired the event.</b></div></li>
     * <li><b>delay</b> : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</div></li>
     * <li><b>single</b> : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
     * <li><b>buffer</b> : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Kevlar.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
     * <li><b>target</b> : Observable<div class="sub-desc">Only call the handler if the event was fired on the target Observable, <i>not</i>
     * if the event was bubbled up from a child Observable.</div></li>
     * </ul><br>
     * <p>
     * <b>Combining Options</b><br>
     * Using the options argument, it is possible to combine different types of listeners:<br>
     * <br>
     * A delayed, one-time listener.
     * <pre><code>
myDataView.on('click', this.onClick, this, {
single: true,
delay: 100
});</code></pre>
     * <p>
     * <b>Attaching multiple handlers in 1 call</b><br>
     * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.
     * <p>
     * <pre><code>
myGridPanel.on({
'click' : {
    fn: this.onClick,
    scope: this,
    delay: 100
},
'mouseover' : {
    fn: this.onMouseOver,
    scope: this
},
'mouseout' : {
    fn: this.onMouseOut,
    scope: this
}
});</code></pre>
 * <p>
 * Or a shorthand syntax:<br>
 * <pre><code>
myGridPanel.on({
'click' : this.onClick,
'mouseover' : this.onMouseOver,
'mouseout' : this.onMouseOut,
 scope: this
});</code></pre>
     */
    addListener : function(eventName, fn, scope, o){
        var me = this,
            e,
            oe,
            isF,
            ce;
			
        if (ISOBJECT(eventName)) {
            o = eventName;
            for (e in o){
                oe = o[e];
                if (!me.filterOptRe.test(e)) {
                    me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                }
            }
        } else {
            eventName = eventName.toLowerCase();
            ce = me.events[eventName] || TRUE;
            if (Kevlar.isBoolean(ce)) {
                me.events[eventName] = ce = new KevlarUTIL.Event(me, eventName);
            }
            ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
        }
    },

    /**
     * Removes an event handler.
     * @param {String}   eventName The type of event the handler was associated with.
     * @param {Function} handler   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object}   scope     (optional) The scope originally specified for the handler.
     */
    removeListener : function( eventName, fn, scope ) {
        var ce = this.events[ eventName.toLowerCase() ];
        if ( ISOBJECT( ce ) ) {
            ce.removeListener( fn, scope );
        }
    },
	

    /**
     * Removes all listeners for this object
     */
    purgeListeners : function() {
        var events = this.events,
            evt,
            key;
		
        for( key in events ) {
            evt = events[ key ];
            if( ISOBJECT( evt ) ) {
                evt.clearListeners();
            }
        }
    },
	

    /**
     * Adds the specified events to the list of events which this Observable may fire.
     * @param {Object/String} o Either an object with event names as properties with a value of <code>true</code>
     * or the first event name string if multiple event names are being passed as separate parameters.
     * @param {String} Optional. Event name if multiple event names are being passed as separate parameters.
     * Usage:<pre><code>
this.addEvents('storeloaded', 'storecleared');
</code></pre>
     */
    addEvents : function(o){
        var me = this;
        me.events = me.events || {};
        if (Kevlar.isString(o)) {
            var a = arguments,
                i = a.length;
            while(i--) {
                me.events[a[i]] = me.events[a[i]] || TRUE;
            }
        } else {
            Kevlar.applyIf(me.events, o);
        }
    },

    /**
     * Checks to see if this object has any listeners for a specified event
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */
    hasListener : function(eventName){
        var e = this.events[eventName];
        return ISOBJECT(e) && e.listeners.length > 0;
    },


    /**
     * Suspend the firing of all events. (see {@link #resumeEvents})
     * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events;
     */
    suspendEvents : function(queueSuspended){
        this.eventsSuspended = TRUE;
        if(queueSuspended && !this.eventQueue){
            this.eventQueue = [];
        }
    },

    /**
     * Resume firing events. (see {@link #suspendEvents})
     * If events were suspended using the `<b>queueSuspended</b>` parameter, then all
     * events fired during event suspension will be sent to any listeners now.
     */
    resumeEvents : function(){
        var me = this,
            queued = me.eventQueue || [];
        me.eventsSuspended = FALSE;
        delete me.eventQueue;
        EACH(queued, function(e) {
            me.fireEvent.apply(me, e);
        });
    },
	
	
	/**
     * Relays selected events from the specified Observable as if the events were fired by `<b>this</b>`.
     * @param {Object} o The Observable whose events this object is to relay.
     * @param {Array} events Array of event names to relay.
     */
    relayEvents : function(o, events){
        var me = this;
        function createHandler(eventName){
            return function(){
                return me.fireEvent.apply(me, [eventName].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
        for(var i = 0, len = events.length; i < len; i++){
            var eventName = events[i];
            me.events[eventName] = me.events[eventName] || true;
            o.on(eventName, createHandler(eventName), me);
        }
    },
	
	
	/**
     * <p>Enables events fired by this Observable to bubble up an owner hierarchy by calling {@link #getBubbleTarget} to determine
     * the object's owner. The default implementation of {@link #getBubbleTarget} in this class is just to return null, which specifies no owner.
     * This method should be overridden by subclasses to provide this if applicable.</p>
     * <p>This is commonly used by {@link ui.Component ui.Components} to bubble events to owner {@link ui.Container iu.Containers}. 
     * See {@link ui.Component#getBubbleTarget}. The default implementation in {@link ui.Component} returns the Component's immediate owner, 
     * but if a known target is required, this can be overridden to access that target more quickly.</p>
     * <p>Example:</p><pre><code>
MyClass = Kevlar.extend( Kevlar.util.Observable, {

	constructor : function() {
		...
		
		this.addEvents( 'myBubbledEvent' );
		this.enableBubble( 'myBubbledEvent' );  // enable the bubble
	},


	getBubbleTarget : function() {
		// return a reference to some component that is the target for bubbling. this component may be listened to directly for the 'myBubbledEvent' event
	}

} );
</code></pre>
	 * @param {Array/String.../Object...} events The event name to bubble, Array of event names, or one argument per event name. This may also
	 *   be an array of objects, where the objects have the following properties:<div class="mdetail-params"><ul>
	 *   <li><b>eventName</b> : String<div class="sub-desc">The name of the event to enable bubbling for.</div></li>
	 *   <li>
	 *     <b>bubbleFn</b> : Function
	 *     <div class="sub-desc">
	 *       A function that determines, at every level in the hierarchy, if bubbling should continue. If this function returns false
	 *       at any point, the bubbling of the event is stopped. The function is given one argument: the Observable that the event
	 *       has just been fired for.  This function can be used to test for some condition, and then stop bubbling based on that condition.
	 *     </div>
	 *   </li>
	 *   <li>
	 *     <b>scope</b> : Object
	 *     <div class="sub-desc">The scope to run the bubbleFn in. Defaults to the Observable that the event bubbling was enabled on.</div>
	 *   </li>
	 * </ul></div>
	 */
	enableBubble: function( events ) {
		var me = this;
		if( !Kevlar.isEmpty( events ) ) {
			events = Kevlar.isArray( events ) ? events : Kevlar.toArray( arguments );
			
			Kevlar.each( events, function( eventArg ) {
				var eventName, bubbleFn, scope;  // the last 2 vars are for if an argument was specified as an object, and these were included
				
				// an object with the key 'eventName' is accepted for the enableBubble method
				if( typeof eventArg === 'object' ) {
					eventName = eventArg.eventName;
					bubbleFn = eventArg.bubbleFn;
					scope = eventArg.scope;
				} else {
					eventName = eventArg;  // string event argument
				}
				
				eventName = eventName.toLowerCase();
				var ce = me.events[ eventName ] || true;
				if( Kevlar.isBoolean( ce ) ) {
					ce = new KevlarUTIL.Event( me, eventName );
					me.events[ eventName ] = ce;
				}
				ce.bubble = true;
				
				// Add the bubbleFn, if provided by an object argument to enableBubble
				if( typeof bubbleFn === 'function' ) {
					ce.bubbleFn = bubbleFn;
					ce.bubbleFnScope = scope || me;  // default to the Observable's scope
				}
			} );
		}
	},
	
	
	/**
	 * Specifies the Observable that is the target of the event's bubbling, if bubbling is enabled for
	 * events by the {@link #enableBubble} method. This default implementation returns null, and should
	 * be overridden by subclasses to specify their bubbling target.
	 * 
	 * @protected
	 * @method getBubbleTarget
	 * @return {Kevlar.util.Observable} The Observable that is the target for event bubbling, or null if none.
	 */
	getBubbleTarget : function() {
		return null;
	}
	
};

var OBSERVABLE = KevlarUTIL.Observable.prototype;
/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * @param {String}   eventName     The type of event to listen for
 * @param {Function} handler       The method the event invokes
 * @param {Object}   scope         (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
 * <b>If omitted, defaults to the object which fired the event.</b>
 * @param {Object}   options       (optional) An object containing handler configuration.
 * @method on
 */
OBSERVABLE.on = OBSERVABLE.addListener;
/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * @param {String}   eventName     The type of event the handler was associated with.
 * @param {Function} handler       The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object}   scope         (optional) The scope originally specified for the handler.
 * @method un
 */
OBSERVABLE.un = OBSERVABLE.removeListener;

/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * @param {String}   eventName     The type of event to listen for
 * @param {Function} handler       The method the event invokes
 * @param {Object}   scope         (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
 * <b>If omitted, defaults to the object which fired the event.</b>
 * @param {Object}   options       (optional) An object containing handler configuration.
 * @method bind
 */
OBSERVABLE.bind = OBSERVABLE.addListener;
/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * @param {String}   eventName     The type of event the handler was associated with.
 * @param {Function} handler       The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object}   scope         (optional) The scope originally specified for the handler.
 * @method unbind
 */
OBSERVABLE.unbind = OBSERVABLE.removeListener;

/**
 * Removes <b>all</b> added captures from the Observable.
 * @param {Kevlar.util.Observable} o The Observable to release
 * @static
 */
KevlarUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = OBSERVABLE.fireEvent;
};

function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, TOARRAY(arguments));
        }
    };
}

function createBuffered(h, o, l, scope){
    l.task = new KevlarUTIL.DelayedTask();
    return function(){
        l.task.delay(o.buffer, h, scope, TOARRAY(arguments));
    };
}

function createSingle(h, e, fn, scope){
    return function(){
        e.removeListener(fn, scope);
        return h.apply(scope, arguments);
    };
}

function createDelayed(h, o, l, scope){
    return function(){
        var task = new KevlarUTIL.DelayedTask();
        if(!l.tasks) {
            l.tasks = [];
        }
        l.tasks.push(task);
        task.delay(o.delay || 10, h, scope, TOARRAY(arguments));
    };
}



KevlarUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
	
	// this object may also get the properties 'bubble', 'bubbleFn', and 'bubbleFnScope' if Observable's enableBubble() method is run for it
};

KevlarUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
            l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){ // if we are currently firing this event, don't disturb the listener loop
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.push(l);
        }
    },

    createListener: function(fn, scope, o){
        o = o || {};
		scope = scope || this.obj;
		
        var l = {
            fn: fn,
            scope: scope,
            options: o
        }, h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        if(o.delay){
            h = createDelayed(h, o, l, scope);
        }
        if(o.single){
            h = createSingle(h, this, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o, l, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){
        var list = this.listeners,
            i = list.length,
            l,
            s;
        while(i--) {
            l = list[i];
            if(l) {
                s = l.scope;
                if(l.fn == fn && (s == scope || s == this.obj)){
                    return i;
                }
            }
        }
        return -1;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
            l,
            k,
            me = this,
            ret = FALSE;
        if((index = me.findListener(fn, scope)) != -1){
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            l = me.listeners[index];
            if(l.task) {
                l.task.cancel();
                delete l.task;
            }
            k = l.tasks && l.tasks.length;
            if(k) {
                while(k--) {
                    l.tasks[k].cancel();
                }
                delete l.tasks;
            }
            me.listeners.splice(index, 1);
            ret = TRUE;
        }
        return ret;
    },

    // Iterate to stop any buffered/delayed events
    clearListeners : function(){
        var me = this,
            l = me.listeners,
            i = l.length;
        while(i--) {
            me.removeListener(l[i].fn, l[i].scope);
        }
    },

    fire : function() {
        var me = this,
            args = TOARRAY(arguments),
            listeners = me.listeners,
            len = listeners.length,
            i = 0,
            l,
		    handlerReturnedFalse = false;  // added code

        if(len > 0){
            me.firing = TRUE;
            for (; i < len; i++) {
                l = listeners[i];
                if(l && l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
					handlerReturnedFalse = true;
                    //return (me.firing = FALSE);  -- old code, prevented other handlers from running if one returned false
                }
            }
        }
        me.firing = FALSE;
        //return TRUE;  -- old code
        return ( handlerReturnedFalse ) ? false : true;  // if any of the event handlers returned false, return false from this method. otherwise, return true
    }
};
})();

/**
 * @abstract
 * @class Kevlar.persistence.Proxy
 * @extends Kevlar.util.Observable
 * 
 * Proxy is the base class for subclasses that perform CRUD (Create, Read, Update, and Delete) operations on the server.
 * 
 * @constructor
 * @param {Object} config The configuration options for this class, specified in an object (hash).
 */
/*global Kevlar */
Kevlar.persistence.Proxy = Kevlar.extend( Kevlar.util.Observable, {
	
	constructor : function( config ) {
		// Apply the config
		Kevlar.apply( this, config );
	},
	
	
	/**
	 * Creates a Model on the server.
	 * 
	 * @abstract
	 * @method create
	 * @param {Kevlar.Model} model The Model instance to create on the server.
	 */
	create : Kevlar.abstractFn,
	
	
	/**
	 * Reads a Model from the server.
	 * 
	 * @abstract
	 * @method read
	 * @param {Kevlar.Model} model The Model instance to read from the server.
	 */
	read : Kevlar.abstractFn,
	
	
	/**
	 * Updates the Model on the server, using the provided `data`.  
	 * 
	 * @abstract
	 * @method update
	 * @param {Kevlar.Model} model The model to persist to the server. 
	 */
	update : Kevlar.abstractFn,
	
	
	/**
	 * Destroys (deletes) the Model on the server. This method is not named "delete" as "delete" is a JavaScript reserved word.
	 * 
	 * @abstract
	 * @method destroy
	 * @param {Kevlar.Model} model The Model instance to delete on the server.
	 */
	destroy : Kevlar.abstractFn
	
} );


// Apply Static Properties
Kevlar.apply( Kevlar.persistence.Proxy, {
	
	/**
	 * An object (hashmap) of proxy name -> Proxy class key/value pairs, used to look up
	 * a Proxy subclass by name.
	 * 
	 * @private
	 * @static
	 * @property {Object} proxies
	 */
	proxies : {},
	
	/**
	 * Registers a Proxy subclass by name, so that it may be created by an anonymous object
	 * with a `type` attribute when set to the prototype of a {@link Kevlar.Model}.
	 *
	 * @static  
	 * @method register
	 * @param {String} type The type name of the proxy.
	 * @param {Function} proxyClass The class (constructor function) to register.
	 */
	register : function( type, proxyClass ) {
		var Proxy = Kevlar.persistence.Proxy;  // quick reference to this class's constructor
		
		type = type.toLowerCase();
		if( typeof proxyClass !== 'function' ) {
			throw new Error( "A Proxy subclass constructor function must be provided to registerProxy()" );
		}
		
		if( !Proxy.proxies[ type ] ) { 
			Proxy.proxies[ type ] = proxyClass;
		} else {
			throw new Error( "Error: Proxy type '" + type + "' already registered." );
		}
	},
	
	
	/**
	 * Creates (instantiates) a {@link Kevlar.persistence.Proxy} based on its type name, given
	 * a configuration object that has a `type` property. If an already-instantiated 
	 * {@link Kevlar.persistence.Proxy Proxy} is provided, it will simply be returned unchanged.
	 * 
	 * @method create
	 * @param {Object} config The configuration object for the Proxy. Config objects should have the property `type`, 
	 *   which determines which type of {@link @link Kevlar.persistence.Proxy} will be instantiated. If the object does not
	 *   have a `type` property, an error will be thrown. Note that already-instantiated {@link Kevlar.persistence.Proxy Proxies} 
	 *   will simply be returned unchanged. 
	 * @return {Kevlar.persistence.Proxy} The instantiated Proxy.
	 */
	create : function( config ) {
		var Proxy = Kevlar.persistence.Proxy;  // quick reference to this class's constructor
		var type = config.type ? config.type.toLowerCase() : undefined;
		
		if( config instanceof Kevlar.persistence.Proxy ) {
			// Already a Proxy instance, return it
			return config;
			
		} else if( Proxy.proxies[ type ] ) {
			return new Proxy.proxies[ type ]( config );
			
		} else if( !( 'type' in config ) ) {
			// No `type` property provided on config object
			throw new Error( "Kevlar.persistence.proxy.create(): No `type` property provided on proxy config object" );
			 
		} else {
			// No registered Proxy type with the given type, throw an error
			throw new Error( "Kevlar.persistence.Proxy.create(): Unknown Proxy type: '" + type + "'" );
		}
	}

} );

/**
 * @class Kevlar.Field
 * @extends Object
 * 
 * Field definition object for {@link Kevlar.Model Models}. The Field itself does not store data, but instead simply
 * defines the behaviors of a {@link Kevlar.Model Model's} fields.  A {@link Kevlar.Model Model} is made up of Fields. 
 * 
 * @constructor
 * @param {Object/String} config The field object's config, which is its definition. Can also be its field name provided directly as a string.
 */
/*global Kevlar */
Kevlar.Field = Kevlar.extend( Object, {
	
	/**
	 * @cfg {String} name (required)
	 * The name for the field, which is used by the owner Model to reference it.
	 */
	name : "",
	
	/**
	 * @cfg {String} type
	 * Currently unused, but specifies the type of the Field. In the future, this may be implemented to do type checking
	 * on field data.
	 * 
	 * This may be one of the following values:
	 * <ul>
	 *   <li>auto (default, no type checking is done)</li>
	 *   <li>int</li>
	 *   <li>float</li>
	 *   <li>string</li>
	 *   <li>boolean</li>
	 *   <li>date</li>
	 *   <li>object</li>
	 *   <li>array</li>
	 * </ul>
	 */
	
	/**
	 * @cfg {Mixed/Function} defaultValue
	 * The default value for the Field, if it has no value of its own. This can also be specified as the config 'default', 
	 * but must be wrapped in quotes as `default` is a reserved word in JavaScript.<br><br>
	 *
	 * If the defaultValue is a function, the function will be executed, and its return value used as the defaultValue.
	 */
	
	/**
	 * @cfg {Function} convert
	 * A function that can be used when the Field is created to convert its value. This function is passed two arguments:
	 * <div class="mdetail-params">
	 *   <ul>
	 *     <li>
	 *       <b>value</b> : Mixed
	 *       <div class="sub-desc">
	 *         The provided data value to the field. If the field had no initial data value, its {@link #defaultValue} will be provided. 
	 *         If it has no data, and no {@link #defaultValue}, it will be undefined.
	 *       </div>
	 *     </li>
	 *     <li>
	 *       <b>model</b> : Kevlar.Model
	 *       <div class="sub-desc">The Model instance that this Field belongs to.</div>
	 *     </li>
	 *   </ul>
	 * </div>
	 * 
	 * This function should return the value that the Field should hold. Ex:
	 * <pre><code>convert : function( value, model ) { return model.get( 'someOtherField' ) * value; }</code></pre>
	 * 
	 * Note that this function is called in the order of the field definitions, and doesn't resolve dependencies on the 'convert' of
	 * other fields, so keep this in mind.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope to call the {@link #convert} function in. 
	 */
	
	/**
	 * @cfg {Boolean} persist
	 * True if the field should be persisted by its {@link Kevlar.Model Model} using the Model's {@link Kevlar.Model#proxy proxy}.
	 * Set to false to prevent the field from being persisted.
	 */
	persist : true,
	
	
	constructor : function( config ) {
		// If the argument wasn't an object, it must be its field name
		if( typeof config !== 'object' ) {
			config = { name: config };
		}
		
		// Copy members of the field definition (config) provided onto this object
		Kevlar.apply( this, config );
		
		
		// Each Field must have a name.
		var name = this.name;
		if( name === undefined || name === null || name === "" ) {
			throw new Error( "no 'name' property provided to Kevlar.Field constructor" );
			
		} else if( typeof this.name === 'number' ) {  // convert to a string if it is a number
			this.name = name.toString();
		}
		
		
		// Handle defaultValue
		if( this[ 'default' ] ) {  // accept the key as simply 'default'
			this.defaultValue = this[ 'default' ];
		}
		if( typeof this.defaultValue === "function" ) {
			this.defaultValue = this.defaultValue();
		}
		
		// If defaultValue is an object, recurse through it and execute any functions, using their return values as the defaults
		if( typeof this.defaultValue === 'object' ) {
			(function recurse( obj ) {
				for( var prop in obj ) {
					if( obj.hasOwnProperty( prop ) ) {
						if( typeof obj[ prop ] === 'function' ) {
							obj[ prop ] = obj[ prop ]();
						} else if( typeof obj[ prop ] === 'object' ) {
							recurse( obj[ prop ] );
						}
					}
				}
			})( this.defaultValue );
		}
		
	},
	
	
	/**
	 * Retrieves the name for the Field.
	 * 
	 * @method getName()
	 */
	getName : function() {
		return this.name;
	}
	
} );

/**
 * @class Kevlar.Model
 * @extends Kevlar.util.Observable
 * 
 * Data storage and persistence facility for Quark data. 
 * 
 * @constructor
 * @param {Object} data Any initial data for the attributes, specified in an object (hash map).
 */
/*global window, Kevlar */
Kevlar.Model = Kevlar.extend( Kevlar.util.Observable, {
	
	/**
	 * @cfg {Kevlar.persistence.Proxy} proxy
	 * The proxy to use (if any) to persist the data to the server.
	 */
	
	/**
	 * @cfg {String[]/Object[]} addFields
	 * Array of {@link Kevlar.Field Field} declarations. These are objects with any number of properties, but they
	 * must have the property 'name'. See {@link Kevlar.Field} for more information. They will become instantiated
	 * {@link Kevlar.Field} objects upon instantiation.<br><br>
	 * 
	 * Fields defined on the prototype of a Model (like below), and its subclasses, are concatenated together come
	 * instantiation time. This means that the Kevlar.Model base class can define the 'id' field, and then subclasses
	 * can define their own fields to append to it.  So if a subclass defined the fields `[ 'name', 'phone' ]`, then the
	 * final concatenated array of fields for the subclass would be `[ 'id', 'name', 'phone' ]`. This works for however many
	 * levels of subclasses there are.<br><br>
	 * 
	 * This array will become an object (hash) come instantiation time, with the keys as the field names, and the values as
	 * the instantiated {@link Kevlar.Field} objects that represent them.
	 */
	addFields : [],
	
	/**
	 * @cfg {String} idField
	 * The field that should be used as the ID for the Model. 
	 */
	idField : "id",
	
	
	/**
	 * @private
	 * @property {Object} data
	 * A hash that holds the current data for the {@link Kevlar.Field Fields}. The property names in this object match 
	 * the field names.  This hash holds the current data as it is modified by {@link #set}.
	 */
	
	/**
	 * @private
	 * @property {Boolean} dirty
	 * Flag for quick-testing if the Model currently has un-committed data.
	 */
	dirty : false,
	
	/**
	 * @private 
	 * @property {Object} modifiedData
	 * A hash that serves two functions:<br> 
	 * 1) Properties are set to it when a field is modified. The property name is the field {@link Kevlar.Field#name}. 
	 * This allows it to be used to determine which fields have been modified. 
	 * 2) The <b>original</b> (non-committed) data of the field (before it was {@link #set}) is stored as the value of the 
	 * property. When rolling back changes (via {@link #rollback}), these values are copied back onto the {@link #data} object
	 * to overwrite the data to be rolled back.
	 * 
	 * Went back and forth with naming this `originalData` and `modifiedData`, because it stores original data, but is used
	 * to determine which data is modified... 
	 */
	
	/**
	 * @private
	 * @property {Boolean} initialized
	 * Set to true after the Model's initialization (instantiation) process. This flag is tested against, and is used to prevent 
	 * the firing of events while the Model is still initializing. Events should only be fired after the initialization process,
	 * including the setting of the initial data, is complete.
	 */
	initialized : false,
	
	
	
	constructor : function( data ) {		
		// Call superclass constructor
		Kevlar.Model.superclass.constructor.call( this );
		
		// If this class has a proxy definition that is an object literal, instantiate it *onto the prototype*
		// (so one Proxy instance can be shared for every model)
		if( typeof this.proxy === 'object' && !( this.proxy instanceof Kevlar.persistence.Proxy ) ) {
			this.constructor.prototype.proxy = Kevlar.persistence.Proxy.create( this.proxy );
		}
		
		
		this.addEvents(
			/**
			 * Fires when a {@link Kevlar.Field} in the Model has changed its value. This is a 
			 * convenience event to respond to just a single field's change. Ex: if you want to
			 * just respond to the `title` field's change, you could subscribe to `change:title`. 
			 * 
			 * @event change:[fieldName]
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Mixed} value The new value. 
			 */
			
			/**
			 * Fires when a {@link Kevlar.Field} in the Model has changed its value.
			 * 
			 * @event change
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {String} fieldName The field name for the Field that was changed.
			 * @param {Mixed} value The new value.
			 */
			'change'
		);
		
		
		// Initialize the 'fields' array, which gets turned into an object (hash)
		this.initFields();
		
		
		// Default the data to an empty object
		data = data || {};
		
		// Set the default values for fields that don't have a value.
		// Note: This has the side effect of putting the 'undefined' value into the 'data' hash for field data that wasn't
		// provided, and doesn't have a default. This allows 'convert' fields that weren't specified with a value to get their
		// initial value when the call to this.set() is made later in this method.
		var fields = this.fields;  // this.fields is now a hash of the Field objects, keyed by their name
		for( var name in fields ) {
			if( data[ name ] === undefined ) {
				data[ name ] = fields[ name ].defaultValue;
			}
		}
		
		// Initialize the data 
		this.data = {};  // re-initialize the instance property (formerly a config) to an empty hash. This will be populated by the call to set()
		this.modifiedData = {};
		
		this.set( data );
		this.commit();  // because we are initializing, the data is not dirty
		this.initialized = true;  // to enable the firing of events, now that the Model is fully initialized with its initial data set
	},
	
	
	/**
	 * Initializes the Model's {@link #fields} by walking up the prototype change from the current Model subclass
	 * up to this (the base) class, collecting their `addFields` arrays, and combining them into one single fields hash. 
	 * See {@link fields} for more information.
	 * 
	 * @private
	 * @method initFields
	 */
	initFields : function() {
		this.fields = {};
		
		// Define concatenated fields array from all subclasses
		var fieldsObjects = [],
		    currentConstructor = this.constructor,
		    currentProto = currentConstructor.prototype;
		
		// Walk up the prototype chain from the current object, collecting 'addFields' objects as we go along
		do {
			if( currentProto.hasOwnProperty( 'addFields' ) && Kevlar.isArray( currentProto.addFields ) ) {    // skip over any prototype that doesn't define 'addFields' itself
				fieldsObjects = fieldsObjects.concat( currentProto.addFields );
			}
		} while( ( currentConstructor = ( currentProto = currentConstructor.superclass ) && currentProto.constructor ) );
		
		// After we have the array of fields, go backwards through them, which allows fields from subclasses to override those in superclasses
		for( var i = fieldsObjects.length; i--; ) {
			var fieldObj = fieldsObjects[ i ];
			
			// Normalize to a Kevlar.Field configuration object if it is a string
			if( typeof fieldObj === 'string' ) {
				fieldObj = { name: fieldObj };
			}
			
			var field = this.createField( fieldObj );
			this.fields[ field.getName() ] = field;
		}
	},
	
	
	/**
	 * Factory method which by default creates a {@link Kevlar.Field}, but may be overridden by subclasses
	 * to create different {@link Kevlar.Field} subclasses. 
	 * 
	 * @protected
	 * @method createField
	 * @param {Object} fieldObj The field object provided on the prototype. If it was a string, it will have been
	 *   normalized to the object `{ name: fieldName }`.
	 * @return {Kevlar.Field}
	 */
	createField : function( fieldObj ) {
		return new Kevlar.Field( fieldObj );
	},
	
	
	/**
	 * Retrieves the Field objects that are present for the Model, in an object (hashmap) where the keys
	 * are the Field names, and the values are the {@link Kevlar.Field} objects themselves.
	 * 
	 * @method getFields
	 * @return {Object} 
	 */
	getFields : function() {
		return this.fields;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Retrieves the ID for the Model. This uses the configured {@link #idField} to retrieve
	 * the correct ID field for the Model.
	 * 
	 * @method getId
	 * @return {Mixed} The ID for the Model.
	 */
	getId : function() {
		return this.get( this.idField );
	},

	
	// --------------------------------
	
	
	/**
	 * Retrieves the value for the field given by `key`.
	 * 
	 * @method get
	 * @param {String} fieldName The name of the Field whose value to retieve.
	 * @return {Mixed} The value of the field given by `key`, or undefined if the key was not found. 
	 */
	get : function( key ) {
		if( !( key in this.data ) ) {
			throw new Error( "Kevlar.Model::get() error: provided key '" + key + "' was not found in the Model." );
		}
		return this.data[ key ];
	},
	
	
	/**
	 * Sets the value for a {@link Kevlar.Field Field} given its `name`, and a `value`. For example, a call could be made as this:
	 * <pre><code>model.set( 'field1', 'value1' );</code></pre>
	 * 
	 * As an alternative form, multiple valuse can be set at once by passing an Object into the first argument of this method. Ex:
	 * <pre><code>model.set( { key1: 'value1', key2: 'value2' } );</code></pre>
	 * Note that in this form, the method will ignore any property in the object (hash) that don't have associated Fields.<br><br>
	 * 
	 * When fields are set, their {@link Kevlar.Field#convert} method is run, if they have one defined.
	 * 
	 * @method set
	 * @param {String/Object} fieldName The field name for the Field to set, or an object (hash) of name/value pairs.
	 * @param {Mixed} value (optional) The value to set to the field. Required if the `fieldName` argument is a string (i.e. not a hash). 
	 */
	set : function( fieldName, value ) {
		var fields = this.fields,
		    fieldsWithConverts = [];
		
		if( typeof fieldName === 'object' ) {
			// Hash provided 
			var values = fieldName;  // for clarity, and so we can reuse the fieldName variable
			
			for( fieldName in values ) {
				// filter out prototype properties of the provided object (hash), and make sure there is an associated field for the property
				// (i.e. ignore any properties that don't have an associated Field).
				if( values.hasOwnProperty( fieldName ) && ( fieldName in fields ) ) {
					
					// Fields with converts have to be deferred for their set() call until all fields without converts
					// have been processed, to guarantee that they have access to all non-converted data first.
					if( typeof fields[ fieldName ].convert === 'function' ) {
						fieldsWithConverts.push( fieldName );  // push it onto the array, to be handled later
					} else {
						this.set( fieldName, values[ fieldName ] );
					}
					
				}
			}
			
			// After all fields without a 'convert' function have been set, we can now set the ones with a 'convert' function.
			// This is done so that fields with a convert function have access to the data for fields without a 'convert' function
			// before their 'convert' function is run.
			for( var i = 0, len = fieldsWithConverts.length; i < len; i++ ) {
				fieldName = fieldsWithConverts[ i ];
				this.set( fieldName, values[ fieldName ] );
			}
			
		} else {
			// fieldName and value provided
			var field = fields[ fieldName ];
			if( !field ) {
				throw new Error( "Kevlar.Model.set(): A field with the fieldName '" + fieldName + "' was not found." );
			}
			
			// Get the current value of the field
			var currentValue = this.data[ fieldName ];
			
			// If the field has a 'convert' function defined, call it to convert the data
			if( typeof field.convert === 'function' ) {
				value = field.convert.call( field.scope || window, value, this );  // provided the value, and the Model instance
			}
			
			// Store the field's *current* value (not the new value) into the "modifiedData" fields hash.
			// This should only happen the first time the field is set, so that the field can be rolled back even if there are multiple
			// set() calls to change it.
			if( !( fieldName in this.modifiedData ) ) {
				this.modifiedData[ fieldName ] = currentValue;
			}
			this.data[ fieldName ] = value;
			this.dirty = true;
			
			// Only fire the events if the Model has been fully initialized (i.e. this isn't a call to set() from the constructor).
			if( this.initialized ) {
				this.fireEvent( 'change:' + fieldName, this, value );
				this.fireEvent( 'change', this, fieldName, value );
			}
		}
	},
	
	
	/**
	 * Returns the default value specified for a Field.
	 * 
	 * @method getDefault
	 * @param {String} fieldName The field name to retrieve the default value for.
	 * @return {Mixed} The default value for the field.
	 */
	getDefault : function( fieldName ) {
		return this.fields[ fieldName ].defaultValue;
	},
	
	
	/**
	 * Determines if the Model has a given field (attribute).
	 * 
	 * @method has
	 * @param {String} fieldName The name of the field (attribute) name to test for.
	 * @return {Boolean} True if the Model has the given field name.
	 */
	has : function( fieldName ) {
		return !!this.fields[ fieldName ];
	},
	
	
	// --------------------------------
	
	
	/**
	 * Determines if the Model currently has un-committed (i.e. changed) data.
	 * 
	 * @method isDirty
	 * @return {Boolean}
	 */
	isDirty : function() {
		return this.dirty;
	},
	
	
	/**
	 * Determines if a given field has been modified since the last {@link #commit} or {@link #rollback}.
	 * 
	 * @method isModified
	 * @param {String} fieldName
	 * @return {Boolean} True if the field has been modified, false otherwise.
	 */
	isModified : function( fieldName ) {
		return this.modifiedData.hasOwnProperty( fieldName );
	},
	
	
	/**
	 * Retrieves all {@link Kevlar.Field Field} values held by the Model whose values have been changed since the last
	 * {@link #commit} or {@link #rollback}.
	 * 
	 * @method getChanges
	 * @return {Object} A hash of the fields that have been changed since the last {@link #commit} or {@link #rollback}.
	 *   The hash's property names are the field names, and the hash's values are the new values.
	 */
	getChanges : function() {
		var modifiedData = this.modifiedData,
		    changes = {};
			
		for( var fieldName in modifiedData ) {
			if( modifiedData.hasOwnProperty( fieldName ) ) {
				changes[ fieldName ] = this.get( fieldName );
			}
		}		
		return changes;
	},
	
	
	/**
	 * Retrieves the values for all of the fields in the Model. Note: returns a copy of the data so that the object
	 * retrieved from this method may be modified.
	 * 
	 * @methods toJSON
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.Field Field} values.
	 */
	toJSON : function() {
		return Kevlar.util.Object.clone( this.data );
	},
	
	
	/**
	 * Commits dirty fields' data. Data can no longer be reverted after a commit has been performed. Note: When developing with a {@link #proxy},
	 * this method should normally not need to be called explicitly, as it will be called upon the successful persistence of the Model's data
	 * to the server.
	 * 
	 * @method commit
	 */
	commit : function() {
		this.modifiedData = {};  // reset the modifiedData hash. There is no modified data.
		this.dirty = false;
	},
	
	
	/**
	 * Rolls back the Model fields that have been changed since the last commit or rollback.
	 * 
	 * @method rollback
	 */
	rollback : function() {
		// Loop through the modifiedData hash, which holds the *original* values, and set them back to the data hash.
		var modifiedData = this.modifiedData;
		for( var fieldName in modifiedData ) {
			if( modifiedData.hasOwnProperty( fieldName ) ) {
				this.data[ fieldName ] = modifiedData[ fieldName ];
			}
		}
		
		this.modifiedData = {};
		this.dirty = false;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Sets the {@link #proxy} to use to persist the Model's data.
	 * 
	 * @method setProxy
	 * @param {Kevlar.persistence.Proxy} proxy
	 */
	setProxy : function( proxy ) {
		// Proxy's get placed on the prototype, so they are shared between instances
		this.constructor.prototype.proxy = proxy;
	},
	
	
	/**
	 * Persists the Model data to the backend, using the configured {@link #proxy}. If the request to persist the Model's data is successful,
	 * the Model's data will be {@link #commit committed}.
	 * 
	 * @method save
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.failure] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	save : function( options ) {
		options = options || {};
		
		// No proxy, cannot save. Throw an error
		if( !this.proxy ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. No proxy." );
		}
		
		// Store a "snapshot" of the data that is being persisted. This is used to compare against the Model's current data at the time of when the persistence operation 
		// completes. Anything that does not match this persisted snapshot data must have been updated while the persistence operation was in progress, and the Model must 
		// be marked as dirty for those fields after its commit() runs. This is a bit roundabout that a commit() operation runs when the persistence operation is complete
		// and then data is manually modified, but this is also the correct time to run the commit() operation, as we still want to see the changes if the request fails. 
		// So, if a persistence request fails, we should have all of the data still marked as dirty, both the data that was to be persisted, and any new data that was set 
		// while the persistence operation was being attempted.
		var persistedData = Kevlar.util.Object.clone( this.data );
		
		var successCallback = function() {
			// The request to persist the data was successful, commit the Model
			this.commit();
			
			// Loop over the persisted snapshot data, and see if any Model attributes were updated while the persistence request was taking place.
			// If so, those fields should be marked as modified, with the snapshot data used as the "originals". See the note above where persistedData was set. 
			var currentData = this.toJSON();
			for( var fieldName in persistedData ) {
				if( persistedData.hasOwnProperty( fieldName ) && !Kevlar.util.Object.isEqual( persistedData[ fieldName ], currentData[ fieldName ] ) ) {
					this.modifiedData[ fieldName ] = persistedData[ fieldName ];   // set the last persisted value on to the "modifiedData" object. Note: "modifiedData" holds *original* values, so that the "data" object can hold the latest values. It is how we know a field is modified as well.
					this.dirty = true;
				}
			}
			
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		var failureCallback = function() {
			if( typeof options.failure === 'function' ) {
				options.failure.call( options.scope || window );
			}
		};
		
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( options.scope || window );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			failure  : failureCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to update the data on the server
		this.proxy.update( this, proxyOptions );
	}
	
} );

/**
 * @class Kevlar.persistence.RestProxy
 * @extends Kevlar.persistence.Proxy
 * 
 * RestProxy is responsible for performing CRUD operations in a RESTful manner for a given Model on the server.
 * 
 * @constructor
 * @param {Object} config The configuration options for this class, specified in an object (hash).
 */
/*global window, jQuery, Kevlar */
Kevlar.persistence.RestProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
	
	/**
	 * @cfg {String} url
	 * The url to use in a RESTful manner to perform CRUD operations. Ex: "/tasks"
	 */
	url : "",
	
    /**
     * @cfg {Boolean} appendId
     * True to automatically append the ID of the Model to the {@link #url} when
     * performing requests. 
     */
    appendId: true,
    
    /**
     * @cfg {Boolean} incremental
     * True to have the RestProxy only provide data that has changed to the server when
     * updating a model. By using this, it isn't exactly following REST per se, but can
     * optimize requests by only providing a subset of the full model data. Only enable
     * this if your server supports this.
     */
    incremental : false,
	
	
	/**
	 * @cfg {String} rootProperty
	 * If the server requires the data to be wrapped in a property of its own, use this config
	 * to specify it. For example, if PUT'ing a Task's data needs to look like this, use this config:
	 * 
	 *     {
	 *         "task" : {
	 *             "text" : "Do Something",
	 *             "isDone" : false
	 *         }
	 *     }
	 * 
	 * This config should be set to "task" in this case.
	 */
	rootProperty : "",
	
	
	/**
	 * @private
	 * @property {Function} ajax
	 * A reference to the AJAX function to use for persistence. This is normally left as jQuery.ajax,
	 * but is changed for the unit tests.
	 */
	ajax : jQuery.ajax,
	
	
	
	/**
	 * Creates a Model on the server.
	 * 
	 * @method create
	 * @param {Kevlar.Model} The Model instance to create on the server.
	 */
	create : function() {
		throw new Error( "create() not yet implemented" );
	},
	
	
	/**
	 * Reads a Model from the server.
	 * 
	 * @method read
	 * @param {Kevlar.Model} The Model instance to read from the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.failure] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	read : function( model, options ) {
		options = options || {};
		
		var successCallback = function( data ) {
			model.set( data );
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'GET',
			dataType : 'json',
			
			success  : successCallback,
			error    : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Updates the given Model on the server.  This method uses "incremental" updates, in which only the changed fields of the `model`
	 * are persisted.
	 * 
	 * @method update
	 * @param {Kevlar.Model} model The model to persist to the server. 
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the update is successful.
	 * @param {Function} [options.failure] Function to call if the update fails.
	 * @param {Function} [options.complete] Function to call regardless of if the update is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	update : function( model, options ) {
		options = options || {};
		
		var changedData = model.getChanges(),
		    allData = model.toJSON();   // note: returns a copy of the data so that we can modify the object's properties
		
		// Set the data to persist, based on if the proxy is set to do incremental updates or not
		var dataToPersist;
		if( this.incremental ) {
			dataToPersist = changedData;  // supports incremental updates, we can just send it the changes
		} else {
			dataToPersist = allData;      // does not support incremental updates, provide all data
		}
		
		// Remove properties from the dataToPersist that relate to the fields that have persist: false.
		var fields = model.getFields();
		for( var fieldName in fields ) {
			if( fields.hasOwnProperty( fieldName ) && fields[ fieldName ].persist === false ) {
				delete dataToPersist[ fieldName ];
				delete changedData[ fieldName ];   // used to determine if we need to persist the data at all (next). This will be the same object in the case that the proxy supports incremental updates, but no harm in doing this.
			}
		}
		
		
		// Short Circuit: If there is no changed data in any of the fields that are to be persisted, there is no need to run a request. Run the 
		// success callback and return out.
		if( Kevlar.util.Object.isEmpty( changedData, /* filterPrototype */ true ) ) {
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
			if( typeof options.complete === 'function' ) {
				options.complete.call( options.scope || window );
			}
			return;
		}
		
		
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		// Finally, persist to the server
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'PUT',
			contentType: "application/json",
			data     : JSON.stringify( dataToPersist ),
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Destroys (deletes) the Model on the server.
	 * 
	 * Note that this method is not named "delete" as "delete" is a JavaScript reserved word.
	 * 
	 * @method destroy
	 * @param {Kevlar.Model} The Model instance to delete on the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.failure] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	destroy : function( model, options ) {
		options = options || {};
		
		this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model.getId() ),
			type     : 'DELETE',
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	// -------------------
	
	
	/**
	 * Builds the URL to use to do CRUD operations.
	 * 
	 * @private
	 * @method buildUrl
	 * @param {String} [id] The ID of the Model.
	 * @return {String} The url to use.
	 */
	buildUrl : function( id ) {
		var url = this.url;
		    
		// And now, use the model's ID to set the url.
		if( this.appendId && id ) {
			if( !url.match( /\/$/ ) ) {
				url += '/';
			}
			
			url += id;
		}
		
		return url;
	}
	
} );

// Register the proxy so that it can be created by an object literal with a `type` property
Kevlar.persistence.Proxy.register( 'rest', Kevlar.persistence.RestProxy );

/**
 * @class Kevlar.util.DelayedTask
 *
 * <p> The DelayedTask class provides a convenient way to "buffer" the execution of a method,
 * performing setTimeout where a new timeout cancels the old timeout. When called, the
 * task will wait the specified time period before executing. If durng that time period,
 * the task is called again, the original call will be cancelled. This continues so that
 * the function is only called a single time for each iteration.</p>
 * <p>This method is especially useful for things like detecting whether a user has finished
 * typing in a text field. An example would be performing validation on a keypress. You can
 * use this class to buffer the keypress events for a certain number of milliseconds, and
 * perform only if they stop for that amount of time.  Usage:</p><pre><code>
var task = new Kevlar.util.DelayedTask(function(){
	alert(Kevlar.getDom('myInputField').value.length);
});
// Wait 500ms before calling our function. If the user presses another key 
// during that 500ms, it will be cancelled and we'll wait another 500ms.
Kevlar.get('myInputField').on('keypress', function(){
	task.{@link #delay}(500); 
});
 * </code></pre> 
 * <p>Note that we are using a DelayedTask here to illustrate a point. The configuration
 * option `buffer` for {@link Kevlar.util.Observable#addListener addListener/on} will
 * also setup a delayed task for you to buffer events.</p> 
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call.
 * @param {Object} scope (optional) The default scope (The <code><b>this</b></code> reference) in which the
 * function is called. If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args (optional) The default Array of arguments.
 */
/*global Kevlar */
Kevlar.util.DelayedTask = function(fn, scope, args){
	var me = this,
	    id,
	    call = function(){
	        clearInterval(id);
	        id = null;
	        fn.apply(scope, args || []);
		};
		
	/**
	 * Cancels any pending timeout and queues a new one
	 * @param {Number} delay The milliseconds to delay
	 * @param {Function} newFn (optional) Overrides function passed to constructor
	 * @param {Object} newScope (optional) Overrides scope passed to constructor. Remember that if no scope
	 * is specified, <code>this</code> will refer to the browser window.
	 * @param {Array} newArgs (optional) Overrides args passed to constructor
	 */
	me.delay = function(delay, newFn, newScope, newArgs){
		me.cancel();
		fn = newFn || fn;
		scope = newScope || scope;
		args = newArgs || args;
		id = setInterval(call, delay);
	};

	/**
	 * Cancel the last queued timeout
	 */
	me.cancel = function(){
		if(id){
			clearInterval(id);
			id = null;
		}
	};
	
	/**
	 * Determines if there is currently a pending timeout
	 */
	me.isPending = function() {
		return !!id;
	};
	
};

/**
 * @class Kevlar.util.Html
 * @singleton
 * 
 * Utility class for doing image html/text transformations.
 */
/*global Kevlar */
Kevlar.util.Html = {
	
	/**
	 * Converts certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages, and for
	 * using HTML strings within HTML attributes.
	 * 
	 * @method encode
	 * @param {String} value The string to encode
	 * @return {String} The encoded text
	 */
	encode : function( value ) {
		return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	},
	
	
	/**
	 * Converts certain characters (&, <, >, and ') from their HTML character equivalents.
	 * 
	 * @method decode
	 * @param {String} value The string to decode
	 * @return {String} The decoded text
	 */
	decode : function( value ) {
		return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
	},
	
	
	/**
	 * Returns the html with all tags stripped.
	 * 
	 * @method stripTags
	 * @param {String} v The html to be stripped.
	 * @return {String} The resulting text.
	 */
	stripTags : function(v) {
        return !v ? v : String( v ).replace( /<\/?[^>]+>/gi, "" );
	},
	
	
    /**
     * Replace newlines with &lt;br /&gt; tags
     * 
     * @method nl2br
     * @param {String} text The text to convert newlines into &lt;br /&gt; tags.
     * @return {String} The converted text.
     */
    nl2br : function( text ) {
        return text.replace( /\n/gim, "<br />" );
    }
    
};


/**
 * @class Kevlar.util.Object
 * @singleton
 * 
 * Utility class for methods relating to Object functionality.
 */
/*global Kevlar */
Kevlar.util.Object = {
	
	/**
	 * Clones an object.  Will only clone regular objects and arrays, and not objects created from a constructor
	 * function (unless the constructor function takes no arguments).
	 * 
	 * @method clone
	 * @param {Object} obj
	 * @param {Boolean} [deep=true] True to make a deep (recursive) copy. Set to false if only a shallow copy is desired.
	 * @return {Object} The cloned object.
	 */
	clone : function( obj, deep ) {
		// 'deep' argument missing, assume true
		if( typeof deep === 'undefined' ) {
			deep = true;
		}
		
		var c;
		// Non objects aren't passed by reference, so just send it back.
		if( typeof obj !== 'object' || obj === null ) {
			return obj;
		}
		
		c = new obj.constructor(); 
		
		// copy properties owned by the object (do not copy prototype properties)
		for( var p in obj ) {
			if( obj.hasOwnProperty( p ) ) {
				c[p] = deep ? Kevlar.util.Object.clone( obj[p], true ) : obj[p];  // note: no 'this' reference (as in this.clone()), for friendly out of scope calls
			}
		}
		
		return c;
	},
	
	
	/** 
	 * Tests if `a` and `b` are equal.
	 * 
	 * @method isEqual
	 * @param {Object} a
	 * @param {Object} b
	 * @param {Boolean} [deep=true] If true, will do a deep compare of objects/arrays. Set to false for a shallow compare.
	 * @return {Boolean}
	 */
	isEqual: function( a, b, deep ) {
		if( typeof deep === 'undefined' ) {
			deep = true;
		}
		
		if( typeof a !== typeof b ) { return false; }
		
		if( typeof a !== 'object' ) {
			// simple types
			if( a !== b ) { return false; }
			
		} else {
			if( a === null && a !== b ) { return false; }
			
			// Make sure there are the same number of keys in each object
			var objLength = Kevlar.util.Object.length;  // no 'this' reference for friendly out of scope calls
			if( objLength( a ) !== objLength( b ) ) { return false; }
			
			for (var p in a) {
				if(typeof(a[p]) !== typeof(b[p])) { return false; }
				if((a[p]===null) !== (b[p]===null)) { return false; }
				switch (typeof(a[p])) {
					case 'undefined':
						if (typeof(b[p]) != 'undefined') { return false; }
						break;
					case 'object':
						if( a[p]!==null && b[p]!==null && ( a[p].constructor.toString() !== b[p].constructor.toString() || ( deep ? !Kevlar.util.Object.isEqual(a[p], b[p] ) : false ) ) ) {  // NOTE: full call to Kevlar.util.Object.isEqual (instead of this.isEqual) to allow for friendly out-of-scope calls 
							return false;
						}
						break;
					case 'function':
						if(a[p].toString() != b[p].toString()) { return false; }
						break;
					default:
						if (a[p] !== b[p]) {
							return false;
						}
				}
			}
		}
		return true;
	},
	
	
	/**
	 * Returns the number of properties that belong to a given object. Does not include
	 * the number of properties on the object's prototype.
	 * 
	 * @method length
	 * @param {Object} obj
	 * @return {Number}
	 */
	length: function( obj ) {
		var result = 0;
		for( var item in obj ) {
			if( obj.hasOwnProperty( item ) ) {
				result++;
			}
		}
		return result;
	},
	
	
	
	/**
	 * Tests if an object is empty (i.e. has no "owned" properties). Properties
	 * on the object's prototype will not be included in the check.
	 * 
	 * @method isEmpty
	 * @param {Object} obj
	 * @return {Boolean}
	 */
	isEmpty : function( obj ) {
		for( var i in obj ) {
			if( obj.hasOwnProperty( i ) ) {
				return false;
			}
		}
		return true;
	}
	
};

