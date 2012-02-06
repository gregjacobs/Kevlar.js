/*!
 * Kevlar JS Library
 * Copyright(c) 2011 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 * 
 * https://github.com/gregjacobs/Kevlar.js
 */
/*!
 * Class.js
 * Version 0.1.2
 * 
 * Copyright(c) 2012 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 * 
 * https://github.com/gregjacobs/Class.js
 */
/**
 * @class Class
 * 
 * Utility for powerful JavaScript class creation. This provides a number of features for OOP in JavaScript, including:
 * 
 * - Single inheritance with subclasses (like Java, C#, etc.)
 * - Mixin classes
 * - Static methods, which can optionally be automatically inherited by subclasses
 * - A static method which is placed on classes that are created, which can be used to determine if the *class* is a subclass of 
 *   another (unlike the `instanceof` operator, which checks if an *instance* is a subclass of a given class).
 * - An `instanceOf()` method, which should be used instead of the JavaScript `instanceof` operator, to determine if the instance 
 *   is an instance of a provided class, superclass, or mixin (the JavaScript `instanceof` operator only covers the first two).
 * - The ability to add static methods while creating/extending a class, right inside the definition using special properties `statics`
 *   and `inheritedStatics`. The former only applies properties to the class being created, while the latter applies properties to the
 *   class being created, and all subclasses which extend it. (Note that the keyword for this had to be `statics`, and not `static`, as 
 *   `static` is a reserved word in Javascript). 
 * - A special static method, onClassExtended(), which can be placed in either the `statics` or `inheritedStatics` section, that is
 *   executed after the class has been extended.
 * 
 * Note that this is not the base class of all `Class` classes. It is a utility to create classes, and extend other classes. The
 * fact that it is not required to be at the top of any inheritance hierarchy means that you may use it to extend classes from
 * other frameworks and libraries, with all of the features that this implementation provides. 
 *  
 * Simple example of creating classes:
 *     
 *     var Animal = Class( {
 *         constructor : function( name ) {
 *             this.name = name;
 *         },
 *         
 *         sayHi : function() {
 *             alert( "Hi, my name is: " + this.name );
 *         },
 *         
 *         eat : function() {
 *             alert( this.name + " is eating" );
 *         }
 *     } );
 *     
 *     
 *     var Dog = Animal.extend( {
 *         // Override sayHi method from superclass
 *         sayHi : function() {
 *             alert( "Woof! My name is: " + this.name );
 *         }
 *     } );
 *     
 *     var Cat = Animal.extend( {
 *         // Override sayHi method from superclass
 *         sayHi : function() {
 *             alert( "Meow! My name is: " + this.name );
 *         }
 *     } );
 *     
 *     
 *     var dog1 = new Dog( "Lassie" );
 *     var dog2 = new Dog( "Bolt" );
 *     var cat = new Cat( "Leonardo Di Fishy" );
 *     
 *     dog1.sayHi();  // "Woof! My name is: Lassie"
 *     dog2.sayHi();  // "Woof! My name is: Bolt"
 *     cat.sayHi();   // "Meow! My name is: Leonardo Di Fishy"
 *     
 *     dog1.eat();  // "Lassie is eating"
 *     dog2.eat();  // "Bolt is eating"
 *     cat.eat();   // "Leonardo Di Fishy is eating"
 */
/*global window */
/*jslint forin:true */
var Class = (function() {
	
	// Utility functions / variables
	
	var version = "0.1.2";
	
	
	/**
	 * Determines if a value is an object.
	 * 
	 * @private
	 * @static
	 * @method isObject
	 * @param {Mixed} value
	 * @return {Boolean} True if the value is an object, false otherwise.
	 */
	function isObject( value ) {
		return !!value && Object.prototype.toString.call( value ) === '[object Object]';  
	}
	
	
	// For dealing with IE's toString() problem
	var isIE = false;
	if( typeof window !== 'undefined' ) {
		var uA = window.navigator.userAgent.toLowerCase();
		isIE = /msie/.test( uA ) && !( /opera/.test( uA ) );
	}
	
	
	// A variable, which is incremented, for assigning unique ID's to classes (constructor functions), allowing 
	// for caching through lookups on hashmaps
	var classIdCounter = 0;
	
	
	// ----------------------------------------
	
	
	/**
	 * @constructor
	 * 
	 * Creates a new class that extends from `Object` (the base class of all classes in JavaScript). Running the
	 * `Class` constructor function is equivalent of calling {@link #extend Class.extend()}. To extend classes
	 * that are already subclassed, use either {@link Class#extend}, or the static `extend` method that is added
	 * to all subclasses.
	 * 
	 * Examples for the `Class` constructor:
	 * 
	 *     // Create a new class, with Object as the superclass
	 *     // (i.e. no other particular superclass; see {@link #extend} for that)
	 *     var MyClass = new Class( {
	 *         constructor : function() {
	 *             console.log( "Constructing, 123" );
	 *         },
	 *     
	 *         method1 : function() {},
	 *         method2 : function() {}
	 *     } );
	 *     
	 *     
	 *     // Can be used without the `new` keyword as well, if desired.
	 *     // This may actually make more sense, as you're creating the definition for a class, not an instance.
	 *     var MyClass = Class( {
	 *         constructor : function() {
	 *             console.log( "Constructing, 123" );
	 *         },
	 *     
	 *         method1 : function() {},
	 *         method2 : function() {}
	 *     } );
	 *     
	 *     
	 *     // The above two examples are exactly equivalent to:
	 *     var MyClass = Class.extend( Object, {
	 *         constructor : function() {
	 *             console.log( "Constructing, 123" );
	 *         },
	 *     
	 *         method1 : function() {},
	 *         method2 : function() {}
	 *     } );
	 * 
	 * See {@link #extend} for details about extending classes.
	 * 
	 * @param {Object} classDefinition The class definition. See the `overrides` parameter of {@link #extend}.
	 */
	var Class = function( classDefinition ) {
		return Class.extend( Object, classDefinition );
	};
	
	
	/**
	 * @static
	 * @property {String} version
	 * 
	 * Readonly property that gives the version number of Class.js that is being used.
	 */
	Class.version = version;
	
	
	/**
	 * Copies all the properties of `config` to `obj`.
	 *
	 * @static
	 * @method apply
	 * @param {Object} obj The receiver of the properties
	 * @param {Object} config The source of the properties
	 * @param {Object} defaults A different object that will also be applied for default values
	 * @return {Object} returns obj
	 */
	Class.apply = function( o, c, defaults ) {
		if( defaults ) {
			Class.apply( o, defaults );  // no "this" reference for friendly out of scope calls
		}
		if( o && c && typeof c == 'object' ) {
			for( var p in c ) {
				o[ p ] = c[ p ];
			}
		}
		return o;
	};
	
	
	/**
	 * Copies all the properties of config to obj if they don't already exist.
	 *
	 * @static
	 * @method applyIf
	 * @param {Object} obj The receiver of the properties
	 * @param {Object} config The source of the properties
	 * @return {Object} returns obj
	 */
	Class.applyIf = function( o, c ) {
		if( o ) {
			for( var p in c ) {
				if( typeof o[ p ] === 'undefined' ) {
					o[ p ] = c[ p ];
				}
			}
		}
		return o;
	};
		
		
	/**
	 * Extends one class to create a subclass of it based on a passed object literal (`overrides`), and optionally any mixin 
	 * classes that are desired.
	 * 
	 * This method adds a few methods to the class that it creates:
	 * 
	 * - override : Method that can be used to override members of the class with a passed object literal. 
	 *   Same as {@link #override}, without the first argument.
	 * - extend : Method that can be used to directly extend the class. Same as this method, except without
	 *   the first argument.
	 * - hasMixin : Method that can be used to find out if the class (or any of its superclasses) implement a given mixin. 
	 *   Accepts one argument: the class (constructor function) of the mixin. Note that it is preferable to check if a given 
	 *   object is an instance of another class or has a mixin by using the {@link #isInstanceOf} method. This hasMixin() 
	 *   method will just determine if the class has a given mixin, and not if it is an instance of a superclass, or even an 
	 *   instance of itself.
	 * 
	 * 
	 * For example, to create a subclass of MySuperclass:
	 * 
	 *     MyComponent = Class.extend( MySuperclass, {
	 *         
	 *         constructor : function( config ) {
	 *             // apply the properties of the config object to this instance
	 *             Class.apply( this, config );
	 *             
	 *             // Call superclass constructor
	 *             MyComponent.superclass.constructor.call( this );
	 *             
	 *             // Your postprocessing here
	 *         },
	 *     
	 *         // extension of another method (assuming MySuperclass had this method)
	 *         someMethod : function() {
	 *             // some preprocessing, if needed
	 *         
	 *             MyComponent.superclass.someMethod.apply( this, arguments );  // send all arguments to superclass method
	 *             
	 *             // some post processing, if needed
	 *         },
	 *     
	 *         // a new method for this subclass (not an extended method)
	 *         yourMethod: function() {
	 *             // implementation
	 *         }
	 *     } );
	 *
	 * This is an example of creating a class with a mixin called MyMixin:
	 * 
	 *     MyComponent = Class.extend( Class.util.Observable, {
	 *         mixins : [ MyMixin ],
	 *         
	 *         constructor : function( config ) {
	 *             // apply the properties of the config to the object
	 *             Class.apply( this, config );
	 *             
	 *             // Call superclass constructor
	 *             MyComponent.superclass.constructor.call( this );
	 *             
	 *             // Call the mixin's constructor
	 *             MyMixin.constructor.call( this );
	 *             
	 *             // Your postprocessing here
	 *         },
	 *         
	 *         
	 *         // properties/methods of the mixin will be added automatically, if they don't exist already on the class
	 *         
	 *         
	 *         // method that overrides or extends a mixin's method
	 *         mixinMethod : function() {
	 *             // call the mixin's method, if desired
	 *             MyMixin.prototype.mixinMethod.call( this );
	 *             
	 *             // post processing
	 *         }
	 *         
	 *     } );
	 * 
	 * Note that calling superclass methods can be done with either the [Class].superclass or [Class].__super__ property.
	 *
	 * @static
	 * @method extend
	 * @param {Function} superclass The constructor function of the class being extended. If making a brand new class with no superclass, this may
	 *   either be omitted, or provided as `Object`.
	 * @param {Object} overrides <p>An object literal with members that make up the subclass's properties/method. These are copied into the subclass's
	 *   prototype, and are therefore shared between all instances of the new class.</p> <p>This may contain a special member named
	 *   `<b>constructor</b>`, which is used to define the constructor function of the new subclass. If this property is <i>not</i> specified,
	 *   a constructor function is generated and returned which just calls the superclass's constructor, passing on its parameters.</p>
	 *   <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
	 * @return {Function} The subclass constructor from the `overrides` parameter, or a generated one if not provided.
	 */
	Class.extend = (function() {
		// Set up some private vars that will be used with the extend() method
		var objectConstructor = Object.prototype.constructor;
		
		// inline override function
		var inlineOverride = function( o ) {
			for( var m in o ) {
				this[ m ] = o[ m ];
			}
		};
	
		// extend() method itself
		return function( superclass, overrides ) {
			// The first argument may be omitted, making Object the superclass
			if( arguments.length === 1 ) {
				overrides = superclass;
				superclass = Object;
			}
			
			// Grab any special properties from the overrides
			var statics = overrides.statics,
			    inheritedStatics = overrides.inheritedStatics,
			    mixins = overrides.mixins;
			
			delete overrides.statics;
			delete overrides.inheritedStatics;
			delete overrides.mixins;
			
			
			var subclass = overrides.constructor !== objectConstructor ? overrides.constructor : ( superclass === Object ? function(){} : function() { return superclass.apply( this, arguments ); } ),
			    F = function(){},
			    subclassPrototype,
			    superclassPrototype = superclass.prototype;
			
			F.prototype = superclassPrototype;
			subclassPrototype = subclass.prototype = new F();  // set up prototype chain
			subclassPrototype.constructor = subclass;          // fix constructor property
			subclass.superclass = subclass.__super__ = superclassPrototype;
			
			// If the superclass is Object, set its constructor property to itself (`Function`, which is what the real superclass is now)
			if( superclassPrototype.constructor === objectConstructor ) {
				superclassPrototype.constructor = superclass;
			}
			
			// Attach new static methods to the subclass
			subclass.override = function( overrides ) { Class.override( subclass, overrides ); };
			subclass.extend = function( overrides ) { return Class.extend( subclass, overrides ); };
			subclass.hasMixin = function( mixin ) { return Class.hasMixin( subclass, mixin ); };
			
			// Attach new instance methods to the subclass
			subclassPrototype.superclass = subclassPrototype.supr = function() { return superclassPrototype; };
			subclassPrototype.override = inlineOverride;   // inlineOverride function defined above
			subclassPrototype.hasMixin = function( mixin ) { return Class.hasMixin( this.constructor, mixin ); };   // inlineOverride function defined above
			
			// Finally, add the properties/methods defined in the "overrides" config (which is basically the subclass's 
			// properties/methods) onto the subclass prototype now
			Class.override( subclass, overrides );
			
			
			// Expose the constructor property on the class itself (as opposed to only on its prototype, which is normally only
			// available to instances of the class)
			subclass.constructor = subclassPrototype.constructor;
			
			
			// -----------------------------------
			
			// Now apply inherited statics to the class. Inherited statics from the superclass are first applied,
			// and then all overrides (so that subclasses's inheritableStatics take precedence)
			if( inheritedStatics || superclass.__Class_inheritedStatics ) {
				inheritedStatics = Class.apply( {}, inheritedStatics, superclass.__Class_inheritedStatics );  // inheritedStatics takes precedence of the superclass's inherited statics
				Class.apply( subclass, inheritedStatics );
				subclass.__Class_inheritedStatics = inheritedStatics;  // store the inheritedStatics for the next subclass
			}
			
			// Now apply statics to the class. These statics should override any inheritableStatics for the current subclass.
			// However, the inheritableStatics will still affect subclasses of this subclass.
			if( statics ) {
				Class.apply( subclass, statics );
			}
			
			
			// Handle mixins by applying their methods/properties to the subclass prototype. Methods defined by
			// the class itself will not be overwritten, and the later defined mixins take precedence over earlier
			// defined mixins. (Moving backwards through the mixins array to have the later mixin's methods/properties take priority)
			if( mixins ) {
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
			}
			
			
			// If there is a static onClassExtended method, call it now with the new subclass as the argument
			if( typeof subclass.onClassExtended === 'function' ) {
				subclass.onClassExtended( subclass );
			}
			
			return subclass;
		};
	} )();
	

	/**
	 * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
	 * Usage:
	 * 
	 *     Class.override( MyClass, {
	 *         newMethod1 : function() {
	 *             // etc.
	 *         },
	 *         newMethod2 : function( foo ) {
	 *             // etc.
	 *         }
	 *     } );
	 * 
	 * @static
	 * @method override
	 * @param {Object} origclass The class to override
	 * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
	 * containing one or more methods.
	 */
	Class.override = function( origclass, overrides ) {
		if( overrides ){
			var p = origclass.prototype;
			Class.apply( p, overrides );
			if( isIE && overrides.hasOwnProperty( 'toString' ) ) {
				p.toString = overrides.toString;
			}
		}
	};
	


	/**
	 * Determines if a given object (`obj`) is an instance of a given class (`jsClass`). This method will
	 * return true if the `obj` is an instance of the `jsClass` itself, if it is a subclass of the `jsClass`,
	 * or if the `jsClass` is a mixin on the `obj`. For more information about classes and mixins, see the
	 * {@link #extend} method.
	 * 
	 * @static
	 * @method isInstanceOf
	 * @param {Mixed} obj The object (instance) to test.
	 * @param {Function} jsClass The class (constructor function) of which to see if the `obj` is an instance of, or has a mixin of.
	 * @return {Boolean} True if the obj is an instance of the jsClass (it is a direct instance of it, 
	 *   it inherits from it, or the jsClass is a mixin of it)
	 */
	Class.isInstanceOf = function( obj, jsClass ) {
		if( typeof jsClass !== 'function' ) {
			throw new Error( "jsClass argument of isInstanceOf method expected a Function (constructor function) for a JavaScript class" );
		}
		
		if( !isObject( obj ) ) {
			return false;
		} else if( obj instanceof jsClass ) {
			return true;
		} else if( Class.hasMixin( obj.constructor, jsClass ) ) {
			return true;
		} else {
			return false;
		}
	};
	
	
	
	/**
	 * Determines if a class has a given mixin. Note: Most likely, you will want to use {@link #isInstanceOf} instead,
	 * as that will tell you if the given class either extends another class, or either has, or extends a class with
	 * a given mixin.
	 * 
	 * @static
	 * @method hasMixin
	 * @param {Function} classToTest
	 * @param {Function} mixinClass
	 */
	Class.hasMixin = function( classToTest, mixinClass ) {
		// Assign the mixinClass (the class we're looking for as a mixin) an ID if it doesn't yet have one. This is done
		// here (instead of in extend()) so that any class can be used as a mixin, not just ones extended from Class.js)
		var mixinClassId = mixinClass.__Class_classId;
		if( !mixinClassId ) {
			mixinClassId = mixinClass.__Class_classId = ++classIdCounter;  // classIdCounter is from outer anonymous function of this class, and is used to assign a unique ID
		}
		
		// Create a cache for quick re-lookups of the mixin on this class
		var hasMixinCache = classToTest.__Class_hasMixinCache;
		if( !hasMixinCache ) {
			hasMixinCache = classToTest.__Class_hasMixinCache = {};
		}
		
		// If we have the results of a call to this method for this mixin already, returned the cached result
		if( mixinClassId in hasMixinCache ) {
			return hasMixinCache[ mixinClassId ];
		
		} else {
			// No cached result from a previous call to this method for the mixin, do the lookup
			var mixins = classToTest.mixins,
			    superclass = ( classToTest.superclass || classToTest.__super__ );
			
			// Look for the mixin on the classToTest, if it has any
			if( mixins ) {
				for( var i = 0, len = mixins.length; i < len; i++ ) {
					if( mixins[ i ] === mixinClass ) {
						return ( hasMixinCache[ mixinClassId ] = true );  // mixin was found, cache the result and return
					}
				}
			}
			
			// mixin wasn't found on the classToTest, check its superclass for the mixin (if it has one)
			if( superclass && superclass.constructor && superclass.constructor !== Object ) {
				var returnValue = Class.hasMixin( superclass.constructor, mixinClass );
				return ( hasMixinCache[ mixinClassId ] = returnValue );  // cache the result from the call to its superclass, and return that value
				
			} else {
				// mixin wasn't found, and the class has no superclass, cache the result and return false
				return ( hasMixinCache[ mixinClassId ] = false );
			}
		}
	};
	
	
	return Class;
	
} )();


// Note: Kevlar license header automatically injected by build process.

/*!
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * 
 * Parts of this library are from Ext-Core.
 * 
 * MIT Licensed - http://extjs.com/license/mit.txt
 */

/*global window, jQuery, Class */
/*jslint forin: true */
/**
 * @class Kevlar
 * @singleton
 * 
 * Main singleton class and utility functions for the Kevlar library. 
 */
var Kevlar = function() {
	// Find out if we're on IE
	var uA = window.navigator.userAgent.toLowerCase();
	this.isIE = /msie/.test( uA ) && !( /opera/.test( uA ) );
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
	 * @method apply
	 * @inheritdoc Class#static-method-apply
	 */
	apply : Class.apply,
	
	
	/**
	 * @method applyIf
	 * @inheritdoc Class#static-method-applyIf
	 */
	applyIf : Class.applyIf,
	
	
	/**
	 * @method extend
	 * @inheritdoc Class#static-method-extend
	 */
	extend : Class.extend,
	
	
	// --------------------------------
	
	
	/**
	 * Creates namespaces to be used for scoping variables and classes so that they are not global.
	 * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
	 * 
	 *     Kevlar.namespace( 'Company', 'Company.data' );
	 *     Kevlar.namespace( 'Company.data' ); // equivalent and preferable to above syntax
	 *     Company.Widget = function() { ... }
	 *     Company.data.CustomStore = function(config) { ... }
	 * 
	 * @param {String} namespace1
	 * @param {String} namespace2
	 * @param {String} etc...
	 * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
	 * @method namespace
	 */
	namespace : function(){
		var o, d, i, len, j, jlen, ns,
		    args = arguments;   // var for minification collapse
		    
		for( i = 0, len = args.length; i < len; i++ ) {
			d = args[ i ].split( '.' );
			
			// First in the dot delimited string is the global
			o = window[ d[ 0 ] ] = window[ d[ 0 ] ] || {};
			
			// Now start at the second namespace in, to continue down the line of dot delimited namespaces to create
			for( j = 1, jlen = d.length; j < jlen; j++ ) {
				ns = d[ j ];  // the current namespace
				o = o[ ns ] = o[ ns ] || {};
			}
		}
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
	}
	
};


// Create global Kevlar singleton over class
Kevlar = new Kevlar();

/*global Kevlar */
Kevlar.namespace(
	'Kevlar.data',
	'Kevlar.persistence',
	'Kevlar.util'
);

/*global window, Kevlar */
/*jslint forin: true */
(function(){

var KevlarUTIL = Kevlar.util,
	TOARRAY = Kevlar.toArray,
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
		
		// Fire an "all" event for compatibility with Backbone. Will probably be removed in the future
		if( eventName !== 'all' ) {
			this.fireEvent.apply( this, [ 'all' ].concat( Array.prototype.slice.call( arguments, 0 ) ) );
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
	 * myDataView.on('click', this.onClick, this, {
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
		
		return this;
	},

	/**
	 * Removes an event handler.
	 * @param {String}   eventName The type of event the handler was associated with.
	 * @param {Function} handler   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
	 * @param {Object}   scope	 (optional) The scope originally specified for the handler.
	 */
	removeListener : function( eventName, fn, scope ) {
		if( typeof eventName === 'object' ) {
			var events = eventName; // for clarity
			for( var event in events ) {
				this.removeListener( event, events[ event ], events.scope );
			}
		} else {
			var ce = this.events[ eventName.toLowerCase() ];
			if ( ISOBJECT( ce ) ) {
				ce.removeListener( fn, scope );
			}
		}
		
		return this;
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
		
		for( var i = 0, len = queued.length; i < len; i++ ) {
			var result = me.fireEvent.apply( me, queued[ i ] );
			if( result === false ) {  // handler returned false, stop firing other events. Not sure why we'd need this, but this was the original behavior with the .each() method
				return;
			}
		}
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
	 *    <li><b>eventName</b> : String<div class="sub-desc">The name of the event to enable bubbling for.</div></li>
	 *   <li>
	 *	 <b>bubbleFn</b> : Function
	 *	 <div class="sub-desc">
	 *    A function that determines, at every level in the hierarchy, if bubbling should continue. If this function returns false
	 *    at any point, the bubbling of the event is stopped. The function is given one argument: the Observable that the event
	 *    has just been fired for.  This function can be used to test for some condition, and then stop bubbling based on that condition.
	 *    </div>
	 *    </li>
	 *    <li>
	 *    <b>scope</b> : Object
	 *    <div class="sub-desc">The scope to run the bubbleFn in. Defaults to the Observable that the event bubbling was enabled on.</div>
	 *    </li>
	 * </ul></div>
	 */
	enableBubble: function( events ) {
		var me = this,
		    eventArg,
		    eventName, bubbleFn, scope;
		    
		if( !Kevlar.isEmpty( events ) ) {
			events = Kevlar.isArray( events ) ? events : Kevlar.toArray( arguments );
			
			for( var i = 0, len = events.length; i < len; i++ ) {
				eventArg = events[ i ];
				eventName = bubbleFn = scope = undefined;  // the last 2 vars are for if an argument was specified as an object, and these were included
				
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
			}
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
 * @param {String}   eventName	 The type of event to listen for
 * @param {Function} handler	   The method the event invokes
 * @param {Object}   scope		 (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
 * <b>If omitted, defaults to the object which fired the event.</b>
 * @param {Object}   options	   (optional) An object containing handler configuration.
 * @method on
 */
OBSERVABLE.on = OBSERVABLE.addListener;
/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * @param {String}   eventName	 The type of event the handler was associated with.
 * @param {Function} handler	   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object}   scope		 (optional) The scope originally specified for the handler.
 * @method un
 */
OBSERVABLE.un = OBSERVABLE.removeListener;

/**
 * Appends an event handler to this object (shorthand for {@link #addListener}.)
 * @param {String}   eventName	 The type of event to listen for
 * @param {Function} handler	   The method the event invokes
 * @param {Object}   scope		 (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
 * <b>If omitted, defaults to the object which fired the event.</b>
 * @param {Object}   options	   (optional) An object containing handler configuration.
 * @method bind
 */
OBSERVABLE.bind = OBSERVABLE.addListener;
/**
 * Removes an event handler (shorthand for {@link #removeListener}.)
 * @param {String}   eventName	 The type of event the handler was associated with.
 * @param {Function} handler	   The handler to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
 * @param {Object}   scope		 (optional) The scope originally specified for the handler.
 * @method unbind
 */
OBSERVABLE.unbind = OBSERVABLE.removeListener;
/**
 * Alias of {@link #fireEvent}
 * 
 * @method trigger
 */
OBSERVABLE.trigger = OBSERVABLE.fireEvent;

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
	 * An object (hashmap) of persistence proxy name -> Proxy class key/value pairs, used to look up
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
	 * @param {String} type The type name of the persistence proxy.
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
	 * @static
	 * @method create
	 * @param {Object} config The configuration object for the Proxy. Config objects should have the property `type`, 
	 *   which determines which type of {@link Kevlar.persistence.Proxy} will be instantiated. If the object does not
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
			throw new Error( "Kevlar.persistence.Proxy.create(): No `type` property provided on persistenceProxy config object" );
			 
		} else {
			// No registered Proxy type with the given type, throw an error
			throw new Error( "Kevlar.persistence.Proxy.create(): Unknown Proxy type: '" + type + "'" );
		}
	}

} );

/**
 * @class Kevlar.Attribute
 * @extends Object
 * 
 * Attribute definition object for a {@link Kevlar.Model Model}. The Attribute itself does not store data, but instead simply
 * defines the behaviors of a {@link Kevlar.Model Model's} attributes. A {@link Kevlar.Model Model} is made up of Attributes. 
 * 
 * Note: You will most likely not instantiate Attribute objects directly. This is used by {@link Kevlar.Model} with its
 * {@link Kevlar.Model#attributes attributes} prototype config. Anonymous config objects provided to {@link Kevlar.Model#attributes attributes}
 * will be passed to the Attribute constructor.
 */
/*global Kevlar */
Kevlar.Attribute = Kevlar.extend( Object, {
	
	/**
	 * @cfg {String} name (required)
	 * The name for the attribute, which is used by the owner Model to reference it.
	 */
	name : "",
	
	/**
	 * @cfg {Function} type
	 * Specifies the type of the Attribute, in which a conversion of the raw data will be performed. 
	 * Currently, this config accepts a constructor function for the type. If a {@link Kevlar.Model}
	 * subclass is provided, any raw data object will be fed to the constructor function.
	 * 
	 * In the future, this may be implemented for other custom types.
	 */
	
	/**
	 * @cfg {Mixed/Function} defaultValue
	 * The default value for the Attribute, if it has no value of its own. This can also be specified as the config 'default', 
	 * but must be wrapped in quotes as `default` is a reserved word in JavaScript.
	 *
	 * If the defaultValue is a function, the function will be executed, and its return value used as the defaultValue.
	 */
	
	/**
	 * @cfg {Function} set
	 * A function that can be used to convert the value provided to the attribute, to a new value which will be stored
	 * on the {@link Kevlar.Model Model}. This function is passed the following arguments:
	 * 
	 * @cfg {Mixed} set.value The provided data value to the attribute. If the attribute has no initial data value, its {@link #defaultValue}
	 *   will be provided to this argument upon instantiation of the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} set.model The Model instance that this Attribute belongs to.
	 * 
	 * The function should then do any processing that is necessary, and return the value that the Attribute should hold. For example,
	 * this `set` function will convert a string value to a 
	 * <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date" target="_blank">Date</a>
	 * object. Otherwise, it will return the value unchanged:
	 *     
	 *     set : function( value, model ) {
	 *         if( typeof value === 'string' ) {
	 *             value = new Date( value );
	 *         }
	 *         return value;
	 *     }
	 * 
	 * The {@link Kevlar.Model Model} instance is passed to this function as well, in case other Attributes need to be queried, or need
	 * to be {@link Kevlar.Model#set set} by the `set` function. However, in the case of querying other Attributes for their value, be 
	 * careful in that they may not be set to the expected value when the `set` function executes. For creating computed Attributes that 
	 * rely on other Attributes' values, use a {@link #get} function instead.
	 * 
	 * Notes:
	 * 
	 * - Both a `set` and a {@link #get} function can be used in conjunction.
	 * - The `set` function is called upon instantiation of the {@link Kevlar.Model Model}, if the Model is passed an initial value
	 *   for the Attribute, or if the Attribute has a {@link #defaultValue}.
	 */
	
	/**
	 * @cfg {Function} get
	 * A function that can be used to change the value that is returned when the Model's {@link Kevlar.Model#get get} method is called
	 * on the Attribute. This is useful to create "computed" attributes, which may be created based on other Attributes' values.  The function is 
	 * passed two arguments, and should return the computed value.
	 * 
	 * @cfg {Mixed} get.value The value that the Attribute currently has stored in the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} get.model The Model instance that this Attribute belongs to.
	 * 
	 * For example, if we had a {@link Kevlar.Model Model} with `firstName` and `lastName` Attributes, and we wanted to create a `fullName` 
	 * Attribute, this could be done as such:
	 * 
	 *     {
	 *         name : 'fullName',
	 *         get : function( value, model ) {  // in this example, the Attribute has no value of its own, so we ignore the first arg
	 *             return model.get( 'firstName' ) + " " + model.get( 'lastName' );
	 *         }
	 *     }
	 * 
	 * Note: if the intention is to convert a provided value which needs to be stored on the {@link Kevlar.Model Model} in a different way,
	 * use a {@link #set} function instead. 
	 * 
	 * However, also note that both a {@link #set} and a `get` function can be used in conjunction.
	 */
	
	/**
	 * @cfg {Function} raw
	 * A function that can be used to convert an Attribute's value to a raw representation, usually for persisting data on a server.
	 * This function is automatically called (if it exists) when a persistence {@link Kevlar.persistence.Proxy proxy} is collecting
	 * the data to send to the server. The function is passed two arguments, and should return the raw value.
	 * 
	 * @cfg {Mixed} raw.value The underlying value that the Attribute currently has stored in the {@link Kevlar.Model Model}.
	 * @cfg {Kevlar.Model} raw.model The Model instance that this Attribute belongs to.
	 * 
	 * For example, a Date object is normally converted to JSON with both its date and time components in a serialized string (such
	 * as "2012-01-26T01:20:54.619Z"). To instead persist the Date in m/d/yyyy format, one could create an Attribute such as this:
	 * 
	 *     {
	 *         name : 'eventDate',
	 *         set : function( value, model ) { return new Date( value ); },  // so the value is stored as a Date object when used client-side
	 *         raw : function( value, model ) {
	 *             return (value.getMonth()+1) + '/' + value.getDate() + '/' + value.getFullYear();  // m/d/yyyy format 
	 *         }
	 *     }
	 * 
	 * The value that this function returns is the value that is used when the Model's {@link Kevlar.Model#raw raw} method is called
	 * on the Attribute.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope to call the {@link #set}, {@link #get}, and {@link #raw} functions in. Defaults to the {@link Kevlar.Model Model}
	 * instance. 
	 */
	
	/**
	 * @cfg {Boolean} persist
	 * True if the attribute should be persisted by its {@link Kevlar.Model Model} using the Model's {@link Kevlar.Model#persistenceProxy persistenceProxy}.
	 * Set to false to prevent the attribute from being persisted.
	 */
	persist : true,
	
	
	/**
	 * Creates a new Attribute instance. Note: You will normally not be using this constructor function, as this class
	 * is only used internally by {@link Kevlar.Model}.
	 * 
	 * @constructor 
	 * @param {Object/String} config An object (hashmap) of the Attribute object's configuration options, which is its definition. 
	 *   Can also be its Attribute {@link #name} provided directly as a string.
	 */
	constructor : function( config ) {
		// If the argument wasn't an object, it must be its attribute name
		if( typeof config !== 'object' ) {
			config = { name: config };
		}
		
		// Copy members of the attribute definition (config) provided onto this object
		Kevlar.apply( this, config );
		
		
		// Each Attribute must have a name.
		var name = this.name;
		if( name === undefined || name === null || name === "" ) {
			throw new Error( "no 'name' property provided to Kevlar.Attribute constructor" );
			
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
	 * Retrieves the name for the Attribute.
	 * 
	 * @method getName()
	 */
	getName : function() {
		return this.name;
	},
	
	
	/**
	 * Determines if the Attribute should be persisted.
	 * 
	 * @method isPersisted
	 * @return {Boolean}
	 */
	isPersisted : function() {
		return this.persist;
	}
	
} );

/**
 * @private
 * @class Kevlar.data.NativeObjectConverter
 * @singleton
 * 
 * NativeObjectConverter allows for the conversion of {@link Kevlar.Collection Collection} / {@link Kevlar.Model Models}
 * to their native Array / Object representations, while dealing with circular dependencies.
 */
/*global Kevlar */
Kevlar.data.NativeObjectConverter = {
	
	/**
	 * Converts a {@link Kevlar.Collection Collection} or {@link Kevlar.Model} to its native Array/Object representation,
	 * while dealing with circular dependencies.
	 * 
	 * @method convert
	 * 
	 * @param {Kevlar.Collection/Kevlar.Model} A Collection or Model to convert to its native Array/Object representation.
	 * @param {Object} [options] An object (hashmap) of options to change the behavior of this method. This may include:
	 * @param {String[]} [options.attributeNames] In the case that a {@link Kevlar.Model Model} is provided to this method, this
	 *   may be an array of the attribute names that should be returned in the output object.  Other attributes will not be processed.
	 *   (Note: only affects the Model passed to this method, and not nested models.)
	 * @param {Boolean} [options.persistedOnly] True to have the method only return data for the persisted attributes on
	 *   Models (i.e. attributes with the {@link Kevlar.Attribute#persist persist} config set to true, which is the default).
	 * @param {Boolean} [options.raw] True to have the method only return the raw data for the attributes, by way of the {@link #raw} method. 
	 *   This is used for persistence, where the raw data values go to the server rather than higher-level objects, or where some kind of serialization
	 *   to a string must take place before persistence (such as for Date objects). 
	 * 
	 * @return {Object[]/Object} An array of objects (for the case of a Collection}, or an Object (for the case of a Model)
	 *   with the internal attributes converted to their native equivalent.
	 */
	convert : function( obj, options ) {
		options = options || {};
		var cache = {},  // keyed by models' clientId, and used for handling circular dependencies
		    persistedOnly = !!options.persistedOnly,
		    raw = !!options.raw,
		    data = {};
		
		// Prime the cache with the Model provided to this method, so that if a circular reference points back to this
		// model, the data object is not duplicated as an internal object (i.e. it should refer right back to the converted Model's 
		// data object)
		cache[ obj.getClientId() ] = data;
		
		// Recursively goes through the data structure, and convert models to objects
		Kevlar.apply( data, (function convert( obj ) {
			var attributes = obj.getAttributes(),
			    attributeNames = options.attributeNames || Kevlar.util.Object.keysToArray( attributes ),
			    data = {},
			    i, len, attributeName, currentValue,
			    modelClientId, cachedModel;
			    
			// Slight hack, but delete options.attributeNames now, so that it is not used again for inner Models (should only affect the first 
			// Model that gets converted, i.e. the Model provided to this method)
			delete options.attributeNames;
			
			for( i = 0, len = attributeNames.length; i < len; i++ ) {
				attributeName = attributeNames[ i ];
				if( !persistedOnly || attributes[ attributeName ].isPersisted() === true ) {
					currentValue = data[ attributeName ] = ( raw ) ? obj.raw( attributeName ) : obj.get( attributeName );
					
					// Process nested models
					if( currentValue instanceof Kevlar.Model ) {
						modelClientId = currentValue.getClientId();
						
						if( ( cachedModel = cache[ modelClientId ] ) ) {
							data[ attributeName ] = cachedModel;
						} else {
							// first, set up an object for the cache (so it exists when checking for it in the next call to convert()), 
							// and set that object to the return data as well
							data[ attributeName ] = cache[ modelClientId ] = {};
							
							// now, populate that object with the properties of the inner object
							Kevlar.apply( cache[ modelClientId ], convert( currentValue ) );  
						}
					}
				}
			}
			return data;
		})( obj ) );
		
		return data;
	}
	
};

/**
 * @class Kevlar.Model
 * @extends Kevlar.util.Observable
 * 
 * Generalized data storage class, which has a number of data-related features, including the ability to persist the data to a backend server.
 * Basically, a Model represents some object of data that your application uses. For example, in an online store, one might define two Models: 
 * one for Users, and the other for Products. These would be `User` and `Product` models, respectively. Each of these Models would in turn,
 * have the {@link Kevlar.Attribute Attributes} (data values) that each Model is made up of. Ex: A User model may have: `userId`, `firstName`, and 
 * `lastName` Attributes.
 */
/*global window, Kevlar */
/*jslint forin:true */
Kevlar.Model = Kevlar.extend( Kevlar.util.Observable, {
	
	/**
	 * @cfg {Kevlar.persistence.Proxy} persistenceProxy
	 * The persistence proxy to use (if any) to persist the data to the server.
	 */
	persistenceProxy : null,
	
	/**
	 * @cfg {String[]/Object[]} attributes
	 * Array of {@link Kevlar.Attribute Attribute} declarations. These are objects with any number of properties, but they
	 * must have the property 'name'. See the configuration options of {@link Kevlar.Attribute} for more information. 
	 * 
	 * Anonymous config objects defined here will become instantiated {@link Kevlar.Attribute} objects. An item in the array may also simply 
	 * be a string, which will specify the name of the {@link Kevlar.Attribute Attribute}, with no other {@link Kevlar.Attribute Attribute} 
	 * configuration options.
	 * 
	 * Attributes defined on the prototype of a Model, and its superclasses, are concatenated together come
	 * instantiation time. This means that the Kevlar.Model base class can define the 'id' attribute, and then subclasses
	 * can define their own attributes to append to it. So if a subclass defined the attributes `[ 'name', 'phone' ]`, then the
	 * final concatenated array of attributes for the subclass would be `[ 'id', 'name', 'phone' ]`. This works for however many
	 * levels of subclasses there are.
	 * 
	 * Example:
	 * 
	 *     attributes : [
	 *         'id',    // name-only; no other configs for this attribute (not recommended! should declare the {@link Kevlar.Attribute#type type})
	 *         { name: 'firstName', type: 'string' },
	 *         { name: 'lastName', type: 'string' },
	 *         {
	 *             name : 'fullName',
	 *             get  : function( value, model ) {
	 *                 return model.get( 'firstName' ) + ' ' + model.get( 'lastName' );
	 *             }
	 *         }
	 *     ]
	 * 
	 * Note: If using hierarchies of more than one Model subclass deep, consider using the {@link #addAttributes} alias instead of this
	 * config, which does the same thing (defines attributes), but better conveys that attributes in subclasses are being *added* to the
	 * attributes of the superclass, rather than *overriding* attributes of the superclass.
	 */
	attributes : [],
	
	/**
	 * @cfg {String[]/Object[]} addAttributes
	 * Alias of {@link #attributes}, which may make more sense to use in hierarchies of models that go past more than one level of nesting, 
	 * as it conveys the meaning that the attributes are being *added* to the attributes that are already defined in its superclass, not
	 * replacing them.
	 * 
	 * This config is recommended over {@link #attributes} for any hierarchy of models that goes past one level of nesting, or even those that 
	 * don't but may do so in the future.
	 */
	
	/**
	 * @cfg {String} idAttribute
	 * The attribute that should be used as the ID for the Model. 
	 */
	idAttribute : 'id',
	
	
	/**
	 * @private
	 * @property {Object} attributes
	 * 
	 * A hash of the combined Attributes, which have been put together from the current Model subclass, and all of
	 * its superclasses. This is created by the {@link #initAttributes} method upon instantiation.
	 */
	
	/**
	 * @private
	 * @property {Object} data
	 * 
	 * A hash that holds the current data for the {@link Kevlar.Attribute Attributes}. The property names in this object match 
	 * the attribute names.  This hash holds the current data as it is modified by {@link #set}.
	 */
	
	/**
	 * @private
	 * @property {Boolean} dirty
	 * 
	 * Flag for quick-testing if the Model currently has un-committed data.
	 */
	dirty : false,
	
	/**
	 * @private 
	 * @property {Object} modifiedData
	 * A hash that serves two functions:<br> 
	 * 1) Properties are set to it when an attribute is modified. The property name is the attribute {@link Kevlar.Attribute#name}. 
	 * This allows it to be used to determine which attributes have been modified. 
	 * 2) The <b>original</b> (non-committed) data of the attribute (before it was {@link #set}) is stored as the value of the 
	 * property. When rolling back changes (via {@link #rollback}), these values are copied back onto the {@link #data} object
	 * to overwrite the data to be rolled back.
	 * 
	 * Went back and forth with naming this `originalData` and `modifiedData`, because it stores original data, but is used
	 * to determine which data is modified... 
	 */
	
	/**
	 * @protected
	 * @property {String} clientId (readonly)
	 * 
	 * A unique ID for the Model on the client side. This is used to uniquely identify each Model instance.
	 * Retrieve with {@link #getClientId}.
	 */
	
	/**
	 * @hide
	 * @property {String} id (readonly)
	 * The id for the Model. This property is set when the attribute specified by the {@link #idAttribute} config
	 * is {@link #set}. 
	 * 
	 * *** Note: This property is here solely to maintain compatibility with Backbone's Collection, and should
	 * not be accessed or used, as it will most likely be removed in the future.
	 */
	
	/**
	 * @hide
	 * @property {String} cid (readonly)
	 * A "client id" for the Model. This is a uniquely generated identifier assigned to the Model.
	 * 
	 * *** Note: This property is here solely to maintain compatibility with Backbone's Collection, and should
	 * not be accessed or used, as it will most likely be removed in the future.
	 */
	
	
	inheritedStatics : {
		/**
		 * A static property that is unique to each Kevlar.Model subclass, which uniquely identifies it.
		 * This is used as part of the Model cache, where it is determined if a Model instance already exists
		 * if two models have the same modelTypeId, and instance id.
		 * 
		 * @inheritable
		 * @static
		 * @property {Number} modelTypeId
		 */
	},
	
	
	
	/**
	 * Creates a new Model instance.
	 * 
	 * @constructor 
	 * @param {Object} [data] Any initial data for the {@link #attributes attributes}, specified in an object (hash map). See {@link #set}.
	 */
	constructor : function( data ) {
		var me = this;
		
		// Default the data to an empty object
		data = data || {};
		
		
		// --------------------------
		
		// Handle this new model being a duplicate of a model that already exists (with the same id)
				
		// If there already exists a model of the same type, with the same ID, update that instance,
		// and return that instance from the constructor. We don't create duplicate Model instances
		// with the same ID.
		me = Kevlar.ModelCache.get( me, data[ me.idAttribute ] );
		if( me !== this ) {
			me.set( data );   // set any provided initial data to the already-existing instance (as to combine them),
			return me;        // and then return the already-existing instance
		}
		
		
		// --------------------------
		
		
		// Call superclass constructor (Observable)
		Kevlar.Model.superclass.constructor.call( me );
		
		// If this class has a persistenceProxy definition that is an object literal, instantiate it *onto the prototype*
		// (so one Proxy instance can be shared for every model)
		if( me.persistenceProxy && typeof me.persistenceProxy === 'object' && !( me.persistenceProxy instanceof Kevlar.persistence.Proxy ) ) {
			me.constructor.prototype.persistenceProxy = Kevlar.persistence.Proxy.create( me.persistenceProxy );
		}
		
		
		me.addEvents(
			/**
			 * Fires when a {@link Kevlar.Attribute} in the Model has changed its value. This is a 
			 * convenience event to respond to just a single attribute's change. Ex: if you want to
			 * just respond to the `title` attribute's change, you could subscribe to `change:title`. Ex:
			 * 
			 *     model.addListener( 'change:myAttribute', function( model, newValue ) { ... } );
			 * 
			 * @event change:[attributeName]
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {Mixed} newValue The new value, processed by the attribute's {@link Kevlar.Attribute#get get} function if one exists. 
			 * @param {Mixed} oldValue The old (previous) value, processed by the attribute's {@link Kevlar.Attribute#get get} function if one exists. 
			 */
			
			/**
			 * Fires when a {@link Kevlar.Attribute} in the Model has changed its value.
			 * 
			 * @event change
			 * @param {Kevlar.Model} model This Model instance.
			 * @param {String} attributeName The attribute name for the Attribute that was changed.
			 * @param {Mixed} newValue The new value, processed by the attribute's {@link Kevlar.Attribute#get get} function if one exists. 
			 * @param {Mixed} oldValue The old (previous) value, processed by the attribute's {@link Kevlar.Attribute#get get} function if one exists. 
			 */
			'change',
			
			/**
			 * Fires when the data in the model is {@link #method-commit committed}. This happens if the
			 * {@link #method-commit commit} method is called, and after a successful {@link #save}.
			 * 
			 * @event commit
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'commit',
			
			/**
			 * Fires when the data in the model is {@link #method-rollback rolled back}. This happens when the
			 * {@link #method-rollback rollback} method is called.
			 * 
			 * @event rollback
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'rollback',
			
			/**
			 * Fires when the Model has been destroyed (via {@link #method-destroy}).
			 * 
			 * @event destroy
			 * @param {Kevlar.Model} model This Model instance.
			 */
			'destroy'
		);
		
		// Initialize the 'attributes' array, which gets turned into an object (hash)
		me.initAttributes();
		
		
		// Create a client ID for the Model, and set it to the property 'cid' as well to maintain compatibility with Backbone's Collection
		me.clientId = me.cid = 'c' + Kevlar.newId();
		
		
		// Set the default values for attributes that don't have an initial value.
		var attributes = me.attributes,  // me.attributes is a hash of the Attribute objects, keyed by their name
		    attributeDefaultValue;
		for( var name in attributes ) {
			if( data[ name ] === undefined && ( attributeDefaultValue = attributes[ name ].defaultValue ) !== undefined ) {
				data[ name ] = attributeDefaultValue;
			}
		}
		
		// Initialize the underlying data object, which stores all attribute values
		me.data = {};
		
		// Initialize the data hash for storing attribute names of modified data, and their original values (see property description)
		me.modifiedData = {};
		
		// Set the initial data / defaults, if we have any
		me.set( data );
		me.commit();  // and because we are initializing, the data is not dirty
		
		// Call hook method for subclasses
		me.initialize();
	},
	
	
	/**
	 * Hook methods for subclasses to initialize themselves. This method should be overridden in subclasses to 
	 * provide any model-specific initialization.
	 * 
	 * Note that it is good practice to always call the superclass `initialize` method from within yours (even if
	 * your class simply extends Kevlar.Model, which has no `initialize` implementation). This is to future proof it
	 * from being moved under another superclass, or if there is ever an implementation made in this class.
	 * 
	 * Ex:
	 * 
	 *     MyModel = Kevlar.Model.extend( {
	 *         initialize : function() {
	 *             MyModel.superclass.initialize.apply( this, arguments );   // or could be MyModel.__super__.initialize.apply( this, arguments );
	 *             
	 *             // my initialization logic goes here
	 *         }
	 *     }
	 * 
	 * @protected
	 * @method initialize
	 */
	initialize : Kevlar.emptyFn,
	
	
	
	/**
	 * Initializes the Model's {@link #attributes} by walking up the prototype change from the current Model subclass
	 * up to this (the base) class, collecting their `attributes` arrays, and combining them into one single attributes hash. 
	 * See {@link attributes} for more information.
	 * 
	 * @private
	 * @method initAttributes
	 */
	initAttributes : function() {
		this.attributes = {};
		
		// Define concatenated attributes array from all subclasses
		var attributesObjects = [],
		    currentConstructor = this.constructor,
		    currentProto = currentConstructor.prototype;
		
		// Walk up the prototype chain from the current object, collecting 'attributes' and 'addAttributes' objects as we go along
		do {
			// skip over any prototype that doesn't define `attributes` or `addAttributes` itself
			if( currentProto.hasOwnProperty( 'attributes' ) && Kevlar.isArray( currentProto.attributes ) ) {    
				attributesObjects = attributesObjects.concat( currentProto.attributes );
			} else if( currentProto.hasOwnProperty( 'addAttributes' ) && Kevlar.isArray( currentProto.addAttributes ) ) {
				attributesObjects = attributesObjects.concat( currentProto.addAttributes );
			}
		} while( ( currentConstructor = ( currentProto = currentConstructor.superclass ) && currentProto.constructor ) );
		
		// After we have the array of attributes, go backwards through them, which allows attributes from subclasses to override those in superclasses
		for( var i = attributesObjects.length; i--; ) {
			var attributeObj = attributesObjects[ i ];
			
			// Normalize to a Kevlar.Attribute configuration object if it is a string
			if( typeof attributeObj === 'string' ) {
				attributeObj = { name: attributeObj };
			}
			
			var attribute = this.createAttribute( attributeObj );
			this.attributes[ attribute.getName() ] = attribute;
		}
	},
	
	
	/**
	 * Factory method which by default creates a {@link Kevlar.Attribute}, but may be overridden by subclasses
	 * to create different {@link Kevlar.Attribute} subclasses. 
	 * 
	 * @protected
	 * @method createAttribute
	 * @param {Object} attributeObj The attribute object provided on the prototype. If it was a string, it will have been
	 *   normalized to the object `{ name: attributeName }`.
	 * @return {Kevlar.Attribute}
	 */
	createAttribute : function( attributeObj ) {
		return new Kevlar.Attribute( attributeObj );
	},
	
	
	/**
	 * Retrieves the Attribute objects that are present for the Model, in an object (hashmap) where the keys
	 * are the Attribute names, and the values are the {@link Kevlar.Attribute} objects themselves.
	 * 
	 * @method getAttributes
	 * @return {Object} 
	 */
	getAttributes : function() {
		return this.attributes;
	},
	
	
	/**
	 * Retrieves the Model instance's unique {@link #clientId}.
	 * 
	 * @method getClientId
	 * @return {String} The Model instance's unique {@link #clientId}. 
	 */
	getClientId : function() {
		return this.clientId;
	},
	
	
	// --------------------------------
	
	
	/**
	 * Retrieves the ID for the Model. This uses the configured {@link #idAttribute} to retrieve
	 * the correct ID attribute for the Model.
	 * 
	 * @method getId
	 * @return {Mixed} The ID for the Model.
	 */
	getId : function() {
		// Provide a friendlier error message than what get() provides if the idAttribute is not an Attribute of the Model
		if( !( this.idAttribute in this.attributes ) ) {
			throw new Error( "Error: The `idAttribute` (currently set to an attribute named '" + this.idAttribute + "') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it." );
		}
		return this.get( this.idAttribute );
	},

	
	// --------------------------------
	
	
	/**
	 * Sets the value for a {@link Kevlar.Attribute Attribute} given its `name`, and a `value`. For example, a call could be made as this:
	 * 
	 *     model.set( 'attribute1', 'value1' );
	 * 
	 * As an alternative form, multiple valuse can be set at once by passing an Object into the first argument of this method. Ex:
	 * 
	 *     model.set( { key1: 'value1', key2: 'value2' } );
	 * 
	 * Note that in this form, the method will ignore any property in the object (hash) that don't have associated Attributes.<br><br>
	 * 
	 * When attributes are set, their {@link Kevlar.Attribute#set} method is run, if they have one defined.
	 * 
	 * @method set
	 * @param {String/Object} attributeName The attribute name for the Attribute to set, or an object (hash) of name/value pairs.
	 * @param {Mixed} [newValue] The value to set to the attribute. Required if the `attributeName` argument is a string (i.e. not a hash). 
	 */
	set : function( attributeName, newValue ) {
		if( typeof attributeName === 'object' ) {
			// Hash provided 
			var values = attributeName;  // for clarity
			for( var fldName in values ) {  // a new variable, 'fldName' instead of 'attributeName', so that JSLint stops whining about "Bad for in variable 'attributeName'" (for whatever reason it does that...)
				if( values.hasOwnProperty( fldName ) ) {
					this.set( fldName, values[ fldName ] );
				}
			}
			
		} else {
			// attributeName and newValue provided
			var attribute = this.attributes[ attributeName ];
			if( !attribute ) {
				throw new Error( "Kevlar.Model.set(): An attribute with the attributeName '" + attributeName + "' was not found." );
			}
			
			// Get the current value of the attribute, and its current "getter" value (to provide to the 'change' event as the oldValue)
			var currentValue = this.data[ attributeName ],
			    currentGetterValue = this.get( attributeName );
			
			
			// If the attribute has a 'set' function defined, call it to convert the data
			if( typeof attribute.set === 'function' ) {
				newValue = attribute.set.call( attribute.scope || this, newValue, this );  // provided the newValue, and the Model instance
				
				// *** Temporary workaround to get the 'change' event to fire on an Attribute whose set() function does not
				// return a new value to set to the underlying data. This will be resolved once dependencies are 
				// automatically resolved in the Attribute's get() function
				if( newValue === undefined ) {
					// This is to make the following block below think that there is already data in for the attribute, and
					// that it has the same value. If we don't have this, the change event will fire twice, the
					// the model will be set as 'dirty', and the old value will be put into the `modifiedData` hash.
					if( !( attributeName in this.data ) ) {
						this.data[ attributeName ] = undefined;
					}
					
					// Fire the events with the value of the Attribute after it has been processed by any Attribute-specific `get()` function.
					newValue = this.get( attributeName );
					
					// Now manually fire the events
					this.fireEvent( 'change:' + attributeName, this, newValue, currentGetterValue );  // model, newValue, oldValue
					this.fireEvent( 'change', this, attributeName, newValue, currentGetterValue );    // model, attributeName, newValue, oldValue
				}
			}
			
			
			// Only change if there is no current value for the attribute, or if newValue is different from the current
			if( !( attributeName in this.data ) || !Kevlar.util.Object.isEqual( currentValue, newValue ) ) {
				// Store the attribute's *current* value (not the newValue) into the "modifiedData" attributes hash.
				// This should only happen the first time the attribute is set, so that the attribute can be rolled back even if there are multiple
				// set() calls to change it.
				if( !( attributeName in this.modifiedData ) ) {
					this.modifiedData[ attributeName ] = currentValue;
				}
				this.data[ attributeName ] = newValue;
				this.dirty = true;
				
				
				// Now that we have set the new raw value to the internal `data` hash, we want to fire the events with the value
				// of the Attribute after it has been processed by any Attribute-specific `get()` function.
				newValue = this.get( attributeName );
				
				// If the attribute is the "idAttribute", set the `id` property on the model for compatibility with Backbone's Collection
				if( attributeName === this.idAttribute ) {
					this.id = newValue;
				}
				
				this.fireEvent( 'change:' + attributeName, this, newValue, currentGetterValue );  // model, newValue, oldValue
				this.fireEvent( 'change', this, attributeName, newValue, currentGetterValue );    // model, attributeName, newValue, oldValue
			}
		}
	},
	
	
	/**
	 * Retrieves the value for the attribute given by `attributeName`. If the {@link Kevlar.Attribute Attribute} has a
	 * {@link Kevlar.Attribute#get get} function defined, that function will be called, and its return value
	 * will be used as the return of this method.
	 * 
	 * @method get
	 * @param {String} attributeName The name of the Attribute whose value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.Attribute#get get} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.Attribute#get get}
	 * function, and the value has never been set.  
	 */
	get : function( attributeName ) {
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::get() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		
		// If there is a `get` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.get === 'function' ) {
			value = attribute.get.call( attribute.scope || this, value, this );  // provided the value, and the Model instance
		}
		
		return value;
	},
	
	
	/**
	 * Retrieves the *raw* value for the attribute given by `attributeName`. If the {@link Kevlar.Attribute Attributes} has a
	 * {@link Kevlar.Attribute#raw raw} function defined, that function will be called, and its return value will be used
	 * by the return of this method. If not, the underlying data that is currently stored will be returned, bypassing any
	 * {@link Kevlar.Attribute#get get} function defined on the {@link Kevlar.Attribute Attribute}.
	 * 
	 * @method raw
	 * @param {String} attributeName The name of the Attribute whose raw value to retieve.
	 * @return {Mixed} The value of the attribute returned by the Attribute's {@link Kevlar.Attribute#raw raw} function (if
	 * one exists), or the underlying value of the attribute. Will return undefined if there is no {@link Kevlar.Attribute#raw raw}
	 * function, and the value has never been set.
	 */
	raw : function( attributeName ) {
		if( !( attributeName in this.attributes ) ) {
			throw new Error( "Kevlar.Model::raw() error: attribute '" + attributeName + "' was not found on the Model." );
		}
		
		var value = this.data[ attributeName ],
		    attribute = this.attributes[ attributeName ];
		    
		// If there is a `raw` function on the Attribute, run it now to convert the value before it is returned.
		if( typeof attribute.raw === 'function' ) {
			value = attribute.raw.call( attribute.scope || this, value, this );  // provided the value, and the Model instance
		}
		
		return value;
	},
	
	
	/**
	 * Returns the default value specified for an Attribute.
	 * 
	 * @method getDefault
	 * @param {String} attributeName The attribute name to retrieve the default value for.
	 * @return {Mixed} The default value for the attribute.
	 */
	getDefault : function( attributeName ) {
		return this.attributes[ attributeName ].defaultValue;
	},
	
	
	/**
	 * Determines if the Model has a given attribute (attribute).
	 * 
	 * @method has
	 * @param {String} attributeName The name of the attribute (attribute) name to test for.
	 * @return {Boolean} True if the Model has the given attribute name.
	 */
	has : function( attributeName ) {
		return !!this.attributes[ attributeName ];
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
	 * Determines if any attribute(s) in the model are modified, or if a given attribute has been modified, since the last 
	 * {@link #method-commit} or {@link #method-rollback}.
	 * 
	 * @method isModified
	 * @param {String} [attributeName] Provide this argument to test if a particular attribute has been modified. If this is not 
	 *   provided, the model itself will be checked to see if there are any modified attributes. 
	 * @return {Boolean} True if the attribute has been modified, false otherwise.
	 */
	isModified : function( attributeName ) {
		if( !attributeName ) {
			return !Kevlar.util.Object.isEmpty( this.modifiedData );
		} else {
			return ( attributeName in this.modifiedData );
		}
	},
	
	
	/**
	 * Retrieves the values for all of the attributes in the Model. The Model attributes are retrieved via the {@link #get} method,
	 * to pre-process the data before it is returned in the final hash, unless the `raw` option is set to true,
	 * in which case the Model attributes are retrieved via {@link #raw}. 
	 * 
	 * @methods getData
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details.
	 * @return {Object} A hash of the data, where the property names are the keys, and the values are the {@link Kevlar.Attribute Attribute} values.
	 */
	getData : function( options ) {
		return Kevlar.data.NativeObjectConverter.convert( this, options );
	},
	
	
	/**
	 * Retrieves the values for all of the {@link Kevlar.Attribute attributes} in the Model whose values have been changed since
	 * the last {@link #method-commit} or {@link #method-rollback}. 
	 * 
	 * The Model attributes are retrieved via the {@link #get} method, to pre-process the data before it is returned in the final hash, 
	 * unless the `raw` option is set to true, in which case the Model attributes are retrieved via {@link #raw}.
	 * 
	 * @method getChanges
	 * @param {Object} [options] An object (hash) of options to change the behavior of this method. This object is sent to
	 *   the {@link Kevlar.data.NativeObjectConverter#convert NativeObjectConverter's convert method}, and accepts all of the options
	 *   that the {@link Kevlar.data.NativeObjectConverter#convert} method does. See that method for details.
	 * @return {Object} A hash of the attributes that have been changed since the last {@link #commit} or {@link #rollback}.
	 *   The hash's property names are the attribute names, and the hash's values are the new values.
	 */
	getChanges : function( options ) {
		options = options || {};
		
		// Provide specific attribute names to the NativeObjectConverter's convert() method, which are only the
		// names for attributes that have changed
		options.attributeNames = Kevlar.util.Object.keysToArray( this.modifiedData );
		
		return Kevlar.data.NativeObjectConverter.convert( this, options );
	},
	
	
	/**
	 * Commits dirty attributes' data. Data can no longer be reverted after a commit has been performed. Note: When developing with a {@link #persistenceProxy},
	 * this method should normally not need to be called explicitly, as it will be called upon the successful persistence of the Model's data
	 * to the server.
	 * 
	 * @method commit
	 */
	commit : function() {
		this.modifiedData = {};  // reset the modifiedData hash. There is no modified data.
		this.dirty = false;
		
		this.fireEvent( 'commit', this );
	},
	
	
	/**
	 * Rolls back the Model attributes that have been changed since the last commit or rollback.
	 * 
	 * @method rollback
	 */
	rollback : function() {
		// Loop through the modifiedData hash, which holds the *original* values, and set them back to the data hash.
		var modifiedData = this.modifiedData;
		for( var attributeName in modifiedData ) {
			if( modifiedData.hasOwnProperty( attributeName ) ) {
				this.data[ attributeName ] = modifiedData[ attributeName ];
			}
		}
		
		this.modifiedData = {};
		this.dirty = false;
		
		this.fireEvent( 'rollback', this );
	},
	
	
	// --------------------------------
	
	
	/**
	 * @hide
	 * Creates a clone of the Model, by copying its instance data.
	 * 
	 * Note: This is a very very early, alpha version of the method, where the final version will most likely
	 * account for shared nested models, while copying embedded models and other such nested data. Will also handle 
	 * circular dependencies. Do not use just yet.
	 * 
	 * @method clone
	 * @return {Kevlar.Model} The new Model instance, which is a clone of the Model this method was called on.
	 */
	clone : function() {
		var data = Kevlar.util.Object.clone( this.getData() );
		
		// Remove the id, so that it becomes a new model. If this is kept here, a reference to this exact
		// model will be returned instead of a new one, as the framework does not allow duplicate models with
		// the same id.
		delete data[ this.idAttribute ];  
		
		return new this.constructor( data );
	},
	
	
	// --------------------------------
	
	
	/**
	 * Sets the {@link #persistenceProxy} to use to persist the Model's data. Note that this is set
	 * to the *prototype* of the Model, for use with all instances of the Model. Because
	 * of this, it is usually best to define the {@link #persistenceProxy} on the prototype of a Model
	 * subclass.
	 * 
	 * @method setProxy
	 * @param {Kevlar.persistence.Proxy} persistenceProxy
	 */
	setProxy : function( persistenceProxy ) {
		// Proxy's get placed on the prototype, so they are shared between instances
		this.constructor.prototype.persistenceProxy = persistenceProxy;
	},
	
	
	/**
	 * Gets the {@link #persistenceProxy} that is currently configured for this Model. Note that
	 * the same persistenceProxy instance is shared between all instances of the model.
	 * 
	 * @method getProxy
	 * @return {Kevlar.persistence.Proxy} The persistenceProxy, or null if there is no persistenceProxy currently set.
	 */
	getProxy : function() {
		return this.persistenceProxy;
	},
	
	
	/**
	 * Loads the Model data from the server, using the configured {@link #persistenceProxy}.
	 * 
	 * @method load
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.failure] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `failure`, and `complete` callbacks in.
	 */
	load : function( options ) {
		options = options || {};
		
		// No persistenceProxy, cannot load. Throw an error
		if( !this.persistenceProxy ) {
			throw new Error( "Kevlar.Model::load() error: Cannot load. No persistenceProxy." );
		}
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : options.success  || Kevlar.emptyFn,
			failure  : options.failure  || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			scope    : options.scope    || window
		};
		
		// Make a request to update the data on the server
		this.persistenceProxy.read( this, proxyOptions );
	},
	
	
	/**
	 * Persists the Model data to the backend, using the configured {@link #persistenceProxy}. If the request to persist the Model's data is successful,
	 * the Model's data will be {@link #method-commit committed} upon completion.
	 * 
	 * @method save
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the save is successful.
	 * @param {Function} [options.error] Function to call if the save fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	save : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		// No persistenceProxy, cannot save. Throw an error
		if( !this.persistenceProxy ) {
			throw new Error( "Kevlar.Model::save() error: Cannot save. No persistenceProxy." );
		}
		
		// Store a "snapshot" of the data that is being persisted. This is used to compare against the Model's current data at the time of when the persistence operation 
		// completes. Anything that does not match this persisted snapshot data must have been updated while the persistence operation was in progress, and the Model must 
		// be marked as dirty for those attributes after its commit() runs. This is a bit roundabout that a commit() operation runs when the persistence operation is complete
		// and then data is manually modified, but this is also the correct time to run the commit() operation, as we still want to see the changes if the request fails. 
		// So, if a persistence request fails, we should have all of the data still marked as dirty, both the data that was to be persisted, and any new data that was set 
		// while the persistence operation was being attempted.
		var persistedData = Kevlar.util.Object.clone( this.data );
		
		var successCallback = function() {
			// The request to persist the data was successful, commit the Model
			this.commit();
			
			// Loop over the persisted snapshot data, and see if any Model attributes were updated while the persistence request was taking place.
			// If so, those attributes should be marked as modified, with the snapshot data used as the "originals". See the note above where persistedData was set. 
			var currentData = this.getData();
			for( var attributeName in persistedData ) {
				if( persistedData.hasOwnProperty( attributeName ) && !Kevlar.util.Object.isEqual( persistedData[ attributeName ], currentData[ attributeName ] ) ) {
					this.modifiedData[ attributeName ] = persistedData[ attributeName ];   // set the last persisted value on to the "modifiedData" object. Note: "modifiedData" holds *original* values, so that the "data" object can hold the latest values. It is how we know an attribute is modified as well.
					this.dirty = true;
				}
			}
			
			
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
		};
		
		var errorCallback = function() {
			if( typeof options.error === 'function' ) {
				options.error.call( scope );
			}
		};
		
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			error    : errorCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to create or update the data on the server
		if( typeof this.getId() === 'undefined' ) {
			this.persistenceProxy.create( this, proxyOptions );
		} else {
			this.persistenceProxy.update( this, proxyOptions );
		}
	},
	
	
	/**
	 * Destroys the Model on the backend, using the configured {@link #persistenceProxy}.
	 * 
	 * @method destroy
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the destroy is successful.
	 * @param {Function} [options.error] Function to call if the destroy fails.
	 * @param {Function} [options.complete] Function to call when the operation is complete, regardless of a success or fail state.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. This may also
	 *   be provided as `context` if you prefer.
	 */
	destroy : function( options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		// No persistenceProxy, cannot destroy. Throw an error
		if( !this.persistenceProxy ) {
			throw new Error( "Kevlar.Model::destroy() error: Cannot destroy. No persistenceProxy." );
		}
		
		var successCallback = function() {
			this.fireEvent( 'destroy', this );
			
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
		};
		var errorCallback = function() {
			if( typeof options.error === 'function' ) {
				options.error.call( scope );
			}
		};
		var completeCallback = function() {
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
		};
		
		var proxyOptions = {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,   // defaults to true
			success  : successCallback,
			error    : errorCallback,
			complete : completeCallback,
			scope    : this
		};
		
		// Make a request to destroy the data on the server
		this.persistenceProxy.destroy( this, proxyOptions );
	}
	
	
} );


/**
 * Alias of {@link #load}. See {@link #load} for description and arguments.
 * 
 * @method fetch
 */
Kevlar.Model.prototype.fetch = Kevlar.Model.prototype.load;


/**
 * Alias of {@link #getData}, which is currently just for compatibility with 
 * Backbone's Collection. Do not use. Use {@link #getData} instead.
 * 
 * @method toJSON
 */
Kevlar.Model.prototype.toJSON = Kevlar.Model.prototype.getData;

/**
 * @private
 * @class Kevlar.ModelCache
 * @singleton
 * 
 * Singleton class which caches models by their type (subclass type), and id. This is used
 * to retrieve models, and not duplicate them when instantiating the same model type with the
 * same instance id. 
 * 
 * This is a class used internally by Kevlar, and should not be used directly.
 */
/*global Kevlar */
Kevlar.ModelCache = {
	
	/**
	 * Private variable which is used to return new unique ID's for each model type ({@link Kevlar.Model} subclass).
	 * 
	 * @private
	 * @property {Number} modelTypeIdCounter
	 */
	modelTypeIdCounter : 0,
	
	
	/**
	 * The hashmap of model references stored in the cache. This hashmap is a two-level hashmap, first keyed by the
	 * {@link Kevlar.Model Model's} assigned `__Kevlar_modelTypeId`, and then its instance id.
	 * 
	 * @private
	 * @property {Object} models
	 */
	models : {},
	
	
	/**
	 * Returns a Model that is in the cache with the same model type (model subclass) and instance id, if one exists
	 * that matches the type of the provided `model`, and the provided instance `id`. If a Model does not already exist, 
	 * the provided `model` is simply returned.
	 * 
	 * @method get
	 * @param {Kevlar.Model} model
	 * @param {String} [id]
	 */
	get : function( model, id ) {
		var modelClass = model.constructor,
		    modelTypeId = modelClass.__Kevlar_modelTypeId,  // the current modelTypeId, if any
		    cachedModel;
				
		// Assign this Model subclass a unique modelTypeId if it doesn't have one yet
		if( !modelTypeId ) {
			modelTypeId = ++this.modelTypeIdCounter;
			
			// Assign the model's constructor (i.e. the Kevlar.Model subclass) a new, unique modelTypeId
			modelClass.__Kevlar_modelTypeId = modelTypeId;
			
			// Add a hashmap for the new model type in the cache as well
			this.models[ modelTypeId ] = {};
		}
				
		// If the model has an id provided with it, pull the cached model with that id (if it exists), or otherwise cache it
		if( typeof id !== 'undefined' ) {
			cachedModel = this.models[ modelTypeId ][ id ];
			if( !cachedModel ) {
				this.models[ modelTypeId ][ id ] = model;
			}
		}
		
		return cachedModel || model;
	}

};

/**
 * @class Kevlar.persistence.RestProxy
 * @extends Kevlar.persistence.Proxy
 * 
 * RestProxy is responsible for performing CRUD operations in a RESTful manner for a given Model on the server.
 * 
 * @constructor Creates a new RestProxy instance.
 * @param {Object} config The configuration options for this class, specified in an object (hash).
 */
/*global window, jQuery, Kevlar */
Kevlar.persistence.RestProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
	
	/**
	 * @cfg {String} urlRoot
	 * The url to use in a RESTful manner to perform CRUD operations. Ex: `/tasks`.
	 * 
	 * The {@link Kevlar.Model#idAttribute id} of the {@link Kevlar.Model} being read/updated/deleted
	 * will automatically be appended to this url. Ex: `/tasks/12`
	 */
	urlRoot : "",
	
	/**
	 * @cfg {Boolean} appendId
	 * True to automatically append the ID of the Model to the {@link #urlRoot} when
	 * performing 'read', 'update', and 'delete' actions. 
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
	 * @cfg {Object} actionMethods
	 * A mapping of the HTTP method to use for each action. This may be overridden for custom
	 * server implementations.
	 */
	actionMethods : {
		create  : 'POST',
		read    : 'GET',
		update  : 'PUT',
		destroy : 'DELETE'
	},
	
	/**
	 * @private
	 * @property {Function} ajax
	 * A reference to the AJAX function to use for persistence. This is normally left as jQuery.ajax,
	 * but is changed for the unit tests.
	 */
	ajax : jQuery.ajax,
	
	
	
	/**
	 * Accessor to set the {@link #rootProperty} after instantiation.
	 * 
	 * @method setRootProperty
	 * @param {String} rootProperty The new {@link #rootProperty} value. This can be set to an empty string 
	 *   to remove the {@link #rootProperty}.
	 */
	setRootProperty : function( rootProperty ) {
		this.rootProperty = rootProperty;
	},
	
	
	/**
	 * Creates the Model on the server. Any response data that is provided from the request is
	 * then {@link Kevlar.Model#set} to the Model.
	 * 
	 * @method create
	 * @param {Kevlar.Model} The Model instance to create on the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	create : function( model, options ) {
		options = options || {};
		
		// Set the data to persist
		var dataToPersist = model.getData( { persistedOnly: true, raw: true } );
				
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		var successCallback = function( data ) {
			if( data ) {
				model.set( data );
				model.commit();
			}
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'create' ),
			type     : this.getMethod( 'create' ),
			dataType : 'json',
			data     : JSON.stringify( dataToPersist ),
			contentType : 'application/json',
			
			success  : successCallback,  // note: currently called in the scope of options.scope
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Reads the Model from the server.
	 * 
	 * @method read
	 * @param {Kevlar.Model} The Model instance to read from the server.
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the delete is successful.
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	read : function( model, options ) {
		options = options || {};
		
		var successCallback = function( data ) {
			model.set( data );
			model.commit();
			
			if( typeof options.success === 'function' ) {
				options.success.call( options.scope || window );
			}
		};
		
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'read' ),
			type     : this.getMethod( 'read' ),
			dataType : 'json',
			
			success  : successCallback,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	/**
	 * Updates the given Model on the server.  This method uses "incremental" updates, in which only the changed attributes of the `model`
	 * are persisted.
	 * 
	 * @method update
	 * @param {Kevlar.Model} model The model to persist to the server. 
	 * @param {Object} [options] An object which may contain the following properties:
	 * @param {Boolean} [options.async=true] True to make the request asynchronous, false to make it synchronous.
	 * @param {Function} [options.success] Function to call if the update is successful.
	 * @param {Function} [options.error] Function to call if the update fails.
	 * @param {Function} [options.complete] Function to call regardless of if the update is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in. 
	 *   This may also be provided as `context` if you prefer.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request, *or `null` if no request is made
	 *   because the model contained no changes*.
	 */
	update : function( model, options ) {
		options = options || {};
		var scope = options.scope || options.context || window;
		
		var changedData = model.getChanges( { persistedOnly: true, raw: true } );
		
		// Short Circuit: If there is no changed data in any of the attributes that are to be persisted, there is no need to make a 
		// request. Run the success callback and return out.
		if( Kevlar.util.Object.isEmpty( changedData ) ) {
			if( typeof options.success === 'function' ) {
				options.success.call( scope );
			}
			if( typeof options.complete === 'function' ) {
				options.complete.call( scope );
			}
			return null;
		}
		
		
		// Set the data to persist, based on if the persistence proxy is set to do incremental updates or not
		var dataToPersist;
		if( this.incremental ) {
			dataToPersist = changedData;   // uses incremental updates, we can just send it the changes
		} else {
			dataToPersist = model.getData( { persistedOnly: true, raw: true } );  // non-incremental updates, provide all persisted data
		}
		
		
		// Handle needing a different "root" wrapper object for the data
		if( this.rootProperty ) {
			var dataWrap = {};
			dataWrap[ this.rootProperty ] = dataToPersist;
			dataToPersist = dataWrap;
		}
		
		
		// Finally, persist to the server
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'update' ),
			type     : this.getMethod( 'update' ),
			dataType : 'json',
			data     : JSON.stringify( dataToPersist ),
			contentType : 'application/json',
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : scope
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
	 * @param {Function} [options.error] Function to call if the delete fails.
	 * @param {Function} [options.complete] Function to call regardless of if the delete is successful or fails.
	 * @param {Object} [options.scope=window] The object to call the `success`, `error`, and `complete` callbacks in.
	 * @return {jqXHR} The jQuery XMLHttpRequest superset object for the request.
	 */
	destroy : function( model, options ) {
		options = options || {};
		
		return this.ajax( {
			async    : ( typeof options.async === 'undefined' ) ? true : options.async,  // async defaults to true.
			
			url      : this.buildUrl( model, 'destroy' ),
			type     : this.getMethod( 'destroy' ),
			
			success  : options.success  || Kevlar.emptyFn,
			error    : options.error    || Kevlar.emptyFn,
			complete : options.complete || Kevlar.emptyFn,
			context  : options.scope    || window
		} );
	},
	
	
	// -------------------
	
	
	/**
	 * Builds the URL to use to do CRUD operations.
	 * 
	 * @protected
	 * @method buildUrl
	 * @param {Kevlar.Model} model The model that a url is being built for.
	 * @param {String} [action] The action being taken. This will be one of: 'create', 'read', 'update', or 'destroy'.
	 *   At this time, this parameter is not used by the buildUrl method, but can be used by subclasses of RestProxy.
	 * @return {String} The url to use.
	 */
	buildUrl : function( model, action ) {
		var url = this.urlRoot;
		
		// And now, use the model's ID to set the url.
		if( this.appendId ) {
			if( !url.match( /\/$/ ) ) {
				url += '/';
			}
			
			url += encodeURIComponent( model.getId() );
		}
		
		return url;
	},
	
	
	/**
	 * Retrieves the HTTP method that should be used for a given action. This is, by default, done via 
	 * a lookup to the {@link #actionMethods} config object.
	 * 
	 * @protected
	 * @method getMethod
	 * @param {String} action The action that is being taken. Should be 'create', 'read', 'update', or 'destroy'.
	 * @return {String} The HTTP method that should be used.
	 */
	getMethod : function( action ) {
		return this.actionMethods[ action ];
	}
	
} );

// Register the persistence proxy so that it can be created by an object literal with a `type` property
Kevlar.persistence.Proxy.register( 'rest', Kevlar.persistence.RestProxy );

/**
 * @class Kevlar.util.DelayedTask
 *
 * The DelayedTask class provides a convenient way to "buffer" the execution of a method,
 * performing setTimeout where a new timeout cancels the old timeout. When called, the
 * task will wait the specified time period before executing. If during that time period,
 * the task is called again, the original call will be cancelled. This continues so that
 * the function is only called a single time for each iteration.
 * 
 * This method is especially useful for things like detecting whether a user has finished
 * typing in a text field. An example would be performing validation on a keypress. You can
 * use this class to buffer the keypress events for a certain number of milliseconds, and
 * perform only if they stop for that amount of time.  Usage:
 * 
 *     var task = new Kevlar.util.DelayedTask( function() {
 *         alert( document.getElementById( 'myInputField' ).value.length );
 *     } );
 *     
 *     // Wait 500ms before calling our function. If the user presses another key 
 *     // during that 500ms, it will be cancelled and we'll wait another 500ms.
 *     document.getElementById( 'myInputField' ).onkeypress = function() {
 *         task.delay( 500 ); 
 *     } );
 *     
 * Note that we are using a DelayedTask here to illustrate a point. The configuration
 * option `buffer` for {@link Kevlar.util.Observable#addListener addListener/on} will
 * also setup a delayed task for you to buffer events.
 *  
 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call.
 * @param {Object} scope (optional) The default scope (The `this` reference) in which the
 *   function is called. If not specified, `this` will refer to the browser window.
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
 * @class Kevlar.util.Object
 * @singleton
 * 
 * Utility class for methods relating to Object functionality.
 */
/*global Kevlar */
/*jslint forin:true */
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
		
		// Non objects aren't passed by reference, so just send it back.
		if( typeof obj !== 'object' || obj === null ) {
			return obj;
		}
		
		// If the type is one of the built in classes that has a copy constructor, use that
		switch( obj.constructor ) {
			case Date : case RegExp : case String : case Number : case Boolean :
				return new obj.constructor( obj );
		}
		
		var c = new obj.constructor(); 
		
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
			// Double equals on a and b == null, but strict comparison on the actual comparison of the falsy's
			if( a == null || b == null ) { return a === b; }
			
			// Arrays have to be handled separately... Otherwise {} could be considered the same as []
			if( Kevlar.isArray( a ) !== Kevlar.isArray( b ) ) {
				return false;
			}
			
			var className = Object.prototype.toString.call( a );
			if( className != Object.prototype.toString.call( b ) ) { return false; }
			switch( className ) {
				case '[object String]' :
					return a === String( b );
					
				case '[object Number]' :
					return a !== +a ? b !== +b : (a === 0 ? 1 / a === 1 / b : a === +b);
					
				case '[object Date]' : 
				case '[object Boolean]' :
					return +a === +b;
					
				case '[object RegExp]' :
					return a.source === b.source &&
					       a.global === b.global &&
					       a.multiline === b.multiline &&
					       a.ignoreCase === b.ignoreCase;
			}
			
			
			// Make sure there are the same number of keys in each object
			var objLength = Kevlar.util.Object.length;  // no 'this' reference for friendly out of scope calls
			if( objLength( a ) !== objLength( b ) ) { return false; }
			
			for( var p in a ) {
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
	},
	
	
	/**
	 * Takes each of the keys (property names) of an object, and puts them into an array.
	 * 
	 * @method keysToArray
	 * @param {Object} obj
	 * @return {String[]} An array of the key (property) names.
	 */
	keysToArray : function( obj ) {
		var arr = [],
		    key;
		    
		for( key in obj ) {
			if( obj.hasOwnProperty( key ) ) {
				arr.push( key );
			}
		}
		return arr;
	}
	
};

