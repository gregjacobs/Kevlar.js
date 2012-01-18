/*!
 * Kevlar JS Library
 * Copyright(c) 2011 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 */
/*global jQuery, describe, it, expect, Kevlar */
/*jslint evil:true */

	
describe( 'Kevlar', function() {

		describe( 'Yee haw', function() {

			it( "test_hi", function() {

			} );
		} );

		describe( 'Test apply()', function() {


			it( "test_zomgzor", function() {

			} );


			it( "test_apply", function() {
				var o1 = Kevlar.apply({}, {
					foo: 1,
					bar: 2
				});
				Y.ObjectAssert.hasKeys(o1, {
					foo: 1,
					bar: 2
				}, 'Test simple apply, with a return value');
				
				var o2 = {};
				Kevlar.apply(o2, {
					opt1: 'x',
					opt2: 'y'
				});
				Y.ObjectAssert.hasKeys(o2, {
					opt1: 'x',
					opt2: 'y'
				}, 'Test that the reference is changed');
				
				var o3 = Kevlar.apply({}, {
					prop1: 1
				});
				expect( o3.prop2 ).toBeUndefined();
				
				var o4 = Kevlar.apply({
					foo: 1,
					baz: 4
				}, {
					foo: 2,
					bar: 3
				});
				Y.ObjectAssert.hasKeys(o4, {
					foo: 2,
					bar: 3,
					baz: 4
				}, 'Ensure that properties get overwritten by defaults');
				
				var o5 = {};
				Kevlar.apply(o5, {
					foo: 'new',
					exist: true
				}, {
					foo: 'old',
					def: true
				});
				Y.ObjectAssert.hasKeys(o5, {
					foo: 'new',
					def: true,
					exist: true
				}, 'Test using defaults');
				
				var o6 = Kevlar.apply({}, {
					foo: 'foo',
					bar: 'bar'
				}, {
					foo: 'oldFoo',
					bar: 'oldBar'
				});
				Y.ObjectAssert.hasKeys(o6, {
					foo: 'foo',
					bar: 'bar'
				}, 'Test to ensure all defaults get overridden');
				
				Y.Assert.isNull(Kevlar.apply(null, {}), 'Test null first argument');
			} );
		} );
			
		
		/*
		 * Test applyIf()
		 */

		describe( 'Test applyIf()', function() {
			
			
			it( "test_applyIf", function() {
				var o1 = Kevlar.applyIf({}, {
					foo: 'foo',
					bar: 'bar'
				});
				Y.ObjectAssert.hasKeys(o1, {
					foo: 'foo',
					bar: 'bar'
				}, 'Test with an empty destination object');
				
				var o2 = Kevlar.applyIf({
					foo: 'foo'
				}, {
					foo: 'oldFoo'
				});
				Y.ObjectAssert.hasKeys(o2, {
					foo: 'foo'
				}, 'Ensure existing properties don\'t get overridden');
				
				var o3 = Kevlar.applyIf({
					foo: 1,
					bar: 2
				}, {
					bar: 3,
					baz: 4
				});
				Y.ObjectAssert.hasKeys(o3, {
					foo: 1,
					bar: 2,
					baz: 4
				}, 'Test mixing properties to be overridden');
				
				var o4 = {};
				Kevlar.applyIf(o4, {
					foo: 2
				}, {
					foo: 1
				});
				Y.ObjectAssert.hasKeys(o4, {
					foo: 2
				}, 'Test that the reference of the object is changed');
				
				Y.Assert.isNull(Kevlar.applyIf(null, {}), 'Test null first argument');
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.each()
		 */

		describe( 'Test each()', function() {
			
			it( "test_each", function() {
				var sum = 0;
				Kevlar.each([1, 2, 3, 4], function(val){
					sum += val;
				});
				expect( sum ).toEqual( 10 );
					
				var s = '';
				Kevlar.each(['T', 'e', 's', 't', 'i', 'n', 'g'], function(c){
					s += c;
				});
				expect( s ).toEqual( 'Testing' );
					
				sum = 0;
				Kevlar.each(5, function(num){
					sum += num;
				});
				expect( sum ).toEqual( 5 );
					
				var hit = false;
				Kevlar.each([], function(){
					hit = true;
				});
				expect( hit ).toEqual( false );
					
				hit = false;
				Kevlar.each(null, function(){
					hit = true;
				});
				expect( hit ).toEqual( false );
					
				hit = false;
				Kevlar.each(document.getElementsByTagName('body'), function(){
					hit = true;
				});
				expect( hit ).toEqual( true );
					
				var arr = [];
				Kevlar.each([1, 2, 3, 4, 5, 6], function(val, idx){
					arr.push(idx);
				});
				Y.ArrayAssert.itemsAreEqual([0, 1, 2, 3, 4, 5], arr, 'Test index is passed correctly');
					
				sum = 0;
				Kevlar.each([1, 2, 3, 4, 5, 6], function(val){
					if(val > 4){
						return false;
					}
					sum += val;
				});
				expect( sum ).toEqual( 10 );
					
				sum = 0;
				var scope = {value: 3};
				Kevlar.each([1, 2, 3], function(val){
					sum += val * this.value;
				}, scope);
				expect( sum ).toEqual( 18 );
					
				sum = 0;
				scope = {value: 5};
				Kevlar.each([1, 2, 3], function(val){
					sum += val * this.value; //value should be 5
				}, scope);
				expect( sum ).toEqual( 30 );
			} );
		} );
			
		
		/*
		 * Test Kevlar.isArray()
		 */

		describe( 'Test isArray()', function() {
			
			it( "test_isArray", function() {
				var C = Kevlar.extend(Object, {
					length: 1
				});
				expect( Kevlar.isArray([]) ).toEqual( true );
				expect( Kevlar.isArray([1, 2, 3, 4]) ).toEqual( true );
				expect( Kevlar.isArray(false) ).toEqual( false );
				expect( Kevlar.isArray(true) ).toEqual( false );
				expect( Kevlar.isArray('foo') ).toEqual( false );
				expect( Kevlar.isArray(1) ).toEqual( false );
				expect( Kevlar.isArray(null) ).toEqual( false );
				expect( Kevlar.isArray(new Date()) ).toEqual( false );
				expect( Kevlar.isArray({}) ).toEqual( false );
				expect( Kevlar.isArray(document.getElementsByTagName('body')) ).toEqual( false );
				expect( Kevlar.isArray(jQuery( 'body' )[ 0 ]) ).toEqual( false );
				expect( Kevlar.isArray(new C()) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isBoolean()
		 */

		describe( 'Test isBoolean()', function() {
			
			it( "test_isBoolean", function() {
				expect( Kevlar.isBoolean(true) ).toEqual( true );
				expect( Kevlar.isBoolean(false) ).toEqual( true );
				expect( Kevlar.isBoolean([]) ).toEqual( false );
				expect( Kevlar.isBoolean([1, 2, 3]) ).toEqual( false );
				expect( Kevlar.isBoolean(1) ).toEqual( false );
				expect( Kevlar.isBoolean('') ).toEqual( false );
				expect( Kevlar.isBoolean('foo') ).toEqual( false );
				expect( Kevlar.isBoolean(jQuery( 'body' )[ 0 ]) ).toEqual( false );
				expect( Kevlar.isBoolean(null) ).toEqual( false );
				expect( Kevlar.isBoolean({}) ).toEqual( false );
				expect( Kevlar.isBoolean(new Date()) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isDate()
		 */

		describe( 'Test isDate()', function() {
			
			it( "test_isDate", function() {
				expect( Kevlar.isDate(new Date()) ).toEqual( true );
				expect( Kevlar.isDate(Date.parseDate('2000', 'Y')) ).toEqual( true );
				expect( Kevlar.isDate(true) ).toEqual( false );
				expect( Kevlar.isDate(1) ).toEqual( false );
				expect( Kevlar.isDate('foo') ).toEqual( false );
				expect( Kevlar.isDate(null) ).toEqual( false );
				expect( Kevlar.isDate([]) ).toEqual( false );
				expect( Kevlar.isDate({}) ).toEqual( false );
				expect( Kevlar.isDate(jQuery( 'body' )[ 0 ]) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isDefined()
		 */

		describe( 'Test isDefined()', function() {
			
			it( "test_isDefined", function() {
				expect( Kevlar.isDefined(undefined) ).toEqual( false );
				expect( Kevlar.isDefined(null) ).toEqual( true );
				expect( Kevlar.isDefined({}) ).toEqual( true );
				expect( Kevlar.isDefined([]) ).toEqual( true );
				expect( Kevlar.isDefined(new Date()) ).toEqual( true );
				expect( Kevlar.isDefined(1) ).toEqual( true );
				expect( Kevlar.isDefined(false) ).toEqual( true );
				expect( Kevlar.isDefined('') ).toEqual( true );
				expect( Kevlar.isDefined('foo') ).toEqual( true );
				expect( Kevlar.isDefined(jQuery( 'body' )[ 0 ]) ).toEqual( true );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isElement()
		 */

		describe( 'Test isElement()', function() {
			
			it( "test_isElement", function() {
				expect( Kevlar.isElement(jQuery( 'body' )[ 0 ]) ).toEqual( true );
				expect( Kevlar.isElement(null) ).toEqual( false );
				expect( Kevlar.isElement(1) ).toEqual( false );
				expect( Kevlar.isElement('foo') ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isJQuery()
		 */

		describe( 'Test isJQuery()', function() {
			
			it( "test_isJQuery", function() {
				expect( Kevlar.isJQuery(jQuery( 'body' )[0]) ).toEqual( false );
				expect( Kevlar.isJQuery(undefined) ).toEqual( false );
				expect( Kevlar.isJQuery(null) ).toEqual( false );
				expect( Kevlar.isJQuery(1) ).toEqual( false );
				expect( Kevlar.isJQuery('foo') ).toEqual( false );
				expect( Kevlar.isJQuery(false) ).toEqual( false );
				expect( Kevlar.isJQuery({}) ).toEqual( false );
				expect( Kevlar.isJQuery(Kevlar.emptyFn) ).toEqual( false );
				expect( Kevlar.isJQuery([]) ).toEqual( false );
				expect( Kevlar.isJQuery(jQuery( 'body' )) ).toEqual( true );
				expect( Kevlar.isJQuery(jQuery( '#non-existent-element' )) ).toEqual( true );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isFunction()
		 */

		describe( 'Test isFunction()', function() {
			
			it( "test_isFunction", function() {
				var c = new Kevlar.util.Observable(), o = {
					fn: function(){
					}
				};
				expect( Kevlar.isFunction(function(){
				}) ).toEqual( true );
				expect( Kevlar.isFunction(new Function('return "";')) ).toEqual( true );
				expect( Kevlar.isFunction(Kevlar.emptyFn) ).toEqual( true );
				expect( Kevlar.isFunction(c.fireEvent) ).toEqual( true );
				expect( Kevlar.isFunction(o.fn) ).toEqual( true );
				expect( Kevlar.isFunction(Kevlar.version) ).toEqual( false );
				expect( Kevlar.isFunction(null) ).toEqual( false );
				expect( Kevlar.isFunction(1) ).toEqual( false );
				expect( Kevlar.isFunction('') ).toEqual( false );
				expect( Kevlar.isFunction(new Date()) ).toEqual( false );
				expect( Kevlar.isFunction([]) ).toEqual( false );
				expect( Kevlar.isFunction({}) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isNumber()
		 */

		describe( 'Test isNumber()', function() {
			
			it( "test_isNumber", function() {
				expect( Kevlar.isNumber(0) ).toEqual( true );
				expect( Kevlar.isNumber(4) ).toEqual( true );
				expect( Kevlar.isNumber(-3) ).toEqual( true );
				expect( Kevlar.isNumber(7.9) ).toEqual( true );
				expect( Kevlar.isNumber(-4.3) ).toEqual( true );
				expect( Kevlar.isNumber(Number.MAX_VALUE) ).toEqual( true );
				expect( Kevlar.isNumber(Number.MIN_VALUE) ).toEqual( true );
				expect( Kevlar.isNumber(Math.PI) ).toEqual( true );
				expect( Kevlar.isNumber(Number('3.1')) ).toEqual( true );
				expect( Kevlar.isNumber(Number.NaN) ).toEqual( false );
				expect( Kevlar.isNumber(Number.POSITIVE_INFINITY) ).toEqual( false );
				expect( Kevlar.isNumber(Number.NEGATIVE_INFINITY) ).toEqual( false );
				expect( Kevlar.isNumber(true) ).toEqual( false );
				expect( Kevlar.isNumber('') ).toEqual( false );
				expect( Kevlar.isNumber('1.0') ).toEqual( false );
				expect( Kevlar.isNumber(null) ).toEqual( false );
				expect( Kevlar.isNumber(undefined) ).toEqual( false );
				expect( Kevlar.isNumber([]) ).toEqual( false );
				expect( Kevlar.isNumber({}) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isObject()
		 */

		describe( 'Test isObject()', function() {
			
			it( "test_isObject", function() {
				expect( Kevlar.isObject({}) ).toEqual( true );
				expect( Kevlar.isObject({
					foo: 1
				}) ).toEqual( true );
				expect( Kevlar.isObject(new Kevlar.util.Observable()) ).toEqual( true );
				expect( Kevlar.isObject(new Object()) ).toEqual( true );
				expect( Kevlar.isObject(new Date()) ).toEqual( false );
				expect( Kevlar.isObject([]) ).toEqual( false );
				expect( Kevlar.isObject(new Array()) ).toEqual( false );
				expect( Kevlar.isObject(1) ).toEqual( false );
				expect( Kevlar.isObject('foo') ).toEqual( false );
				expect( Kevlar.isObject(false) ).toEqual( false );
				expect( Kevlar.isObject(new Number(3)) ).toEqual( false );
				expect( Kevlar.isObject(new String('foo')) ).toEqual( false );
				expect( Kevlar.isObject(null) ).toEqual( false );
				expect( Kevlar.isObject(undefined) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isPrimitive()
		 */

		describe( 'Test isPrimitive()', function() {
			
			it( "test_isPrimitive", function() {
				expect( Kevlar.isPrimitive(1) ).toEqual( true );
				expect( Kevlar.isPrimitive(-3) ).toEqual( true );
				expect( Kevlar.isPrimitive(1.4) ).toEqual( true );
				expect( Kevlar.isPrimitive(Number.MAX_VALUE) ).toEqual( true );
				expect( Kevlar.isPrimitive(Math.PI) ).toEqual( true );
				expect( Kevlar.isPrimitive('') ).toEqual( true );
				expect( Kevlar.isPrimitive('foo') ).toEqual( true );
				expect( Kevlar.isPrimitive(true) ).toEqual( true );
				expect( Kevlar.isPrimitive(false) ).toEqual( true );
				expect( Kevlar.isPrimitive(null) ).toEqual( false );
				expect( Kevlar.isPrimitive(undefined) ).toEqual( false );
				expect( Kevlar.isPrimitive({}) ).toEqual( false );
				expect( Kevlar.isPrimitive([]) ).toEqual( false );
				expect( Kevlar.isPrimitive(new Kevlar.util.Observable()) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.isString()
		 */

		describe( 'Test isString()', function() {
			
			it( "test_isString", function() {
				var s = new String('foo');
				expect( Kevlar.isString('') ).toEqual( true );
				expect( Kevlar.isString('foo') ).toEqual( true );
				expect( Kevlar.isString(String('')) ).toEqual( true );
				expect( Kevlar.isString(new String('')) ).toEqual( false ); //should return an object that wraps the primitive
				expect( Kevlar.isString(1) ).toEqual( false );
				expect( Kevlar.isString(true) ).toEqual( false );
				expect( Kevlar.isString(null) ).toEqual( false );
				expect( Kevlar.isString(undefined) ).toEqual( false );
				expect( Kevlar.isString([]) ).toEqual( false );
				expect( Kevlar.isString({}) ).toEqual( false );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.namespace()
		 */

		describe( 'Test namespace()', function() {
			
			it( "test_namespace", function() {
				var w = window;
				
				Kevlar.namespace('FooTest1');
				expect( w.FooTest1 ).toBeUndefined();
				
				Kevlar.namespace('FooTest2', 'FooTest3', 'FooTest4');
				expect( w.FooTest2 ).toBeUndefined();
				expect( w.FooTest3 ).toBeUndefined();
				expect( w.FooTest4 ).toBeUndefined();
				
				Kevlar.namespace('FooTest5', 'FooTest5.ns1', 'FooTest5.ns1.ns2', 'FooTest5.ns1.ns2.ns3');
				expect( w.FooTest5 ).toBeUndefined();
				expect( w.FooTest5.ns1 ).toBeUndefined();
				expect( w.FooTest5.ns1.ns2 ).toBeUndefined();
				expect( w.FooTest5.ns1.ns2.ns3 ).toBeUndefined();
				
				Kevlar.namespace('FooTest6.ns1', 'FooTest7.ns1');
				expect( w.FooTest6.ns1 ).toBeUndefined();
				expect( w.FooTest7.ns1 ).toBeUndefined();
				
				Kevlar.namespace('FooTest8', 'FooTest8.ns1.ns2');
				expect( w.FooTest8 ).toBeUndefined();
				expect( w.FooTest8.ns1 ).toBeUndefined();
				expect( w.FooTest8.ns1.ns2 ).toBeUndefined();
				
				FooTest8.prop1 = 'foo';
				Kevlar.namespace('FooTest8');
				expect( FooTest8.prop1 ).toEqual( 'foo' );
			} );
		} );
			
			
		
		/*
		 * Test Kevlar.toArray()
		 */

		describe( 'Test toArray()', function() {
			
			/*
			 * Test Kevlar.()
			 */
			it( "test_toArray", function() {
				Y.Assert.isArray(Kevlar.toArray(document.getElementsByTagName('body')), 'Test with node list');
			} );
		} );
		
		
		/*
		 * Test extend()
		 */

		describe( 'Test extend()', function() {
	
			
			it( "extend() should set up simple prototype-chaining inheritance", function() {
				var Dude = Kevlar.extend(Object, {
					constructor: function(config){
						Kevlar.apply(this, config);
						this.isBadass = false;
					}
				});
				var Aweysome = Kevlar.extend(Dude, {
					constructor: function(){
						Aweysome.superclass.constructor.apply(this, arguments);
						this.isBadass = true;
					}
				});
				
				var david = new Aweysome({
					davis: 'isAwesome'
				});
				expect( david.davis ).toEqual( 'isAwesome' );
				expect( david.isBadass ).toEqual( true );
				Y.Assert.isFunction(david.override, 'Test if extend added the override method');
				Y.ObjectAssert.areEqual({
					isBadass: true,
					davis: 'isAwesome'
				}, david, 'Test if David is badass and awesome');
			} );
			
			
			
			it( "extend() should add static 'constructor' property to the class (constructor function)", function() {
				var A = Kevlar.extend( Object, {} );
				expect( A ).toBe( A.constructor );
			} );
			
			
			
			it( "extend() should add static 'constructor' property to a subclass (constructor function)", function() {
				var A = Kevlar.extend( Object, {} );
				var B = Kevlar.extend( A, {} );
				expect( B ).toBe( B.constructor );
			} );
			
			
			
			it( "extend() should add static 'superclass' property to a subclass (constructor function) that refers to its superclass prototype", function() {
				var A = Kevlar.extend( Object, {} );
				var B = Kevlar.extend( A, {} );
				expect( A.prototype ).toBe( B.superclass );
			} );
			
			
			
			it( "extend() should be able to add in a single mixin class into another class", function() {
				var mixinFnExecuted = false; 
				
				var Mixin = Kevlar.extend( Object, {
					mixinFn : function() {
						mixinFnExecuted = true;
					}
				} );
				
				var MyClass = Kevlar.extend( Object, [ Mixin ], {
					// empty
				} );
				
				
				var instance = new MyClass(); 
				instance.mixinFn();   // execute the function
				expect( mixinFnExecuted ).toEqual( true );
			} );
			
			
			
			it( "extend() should not overwrite a class's methods/properties with a mixin's methods/properties", function() {
				var data = null; 
				
				var Mixin = Kevlar.extend( Object, {
					testProp : "Mixin defined",
					"testMethod" : function() {
						data = "Mixin defined";
					}
				} );
				
				var MyClass = Kevlar.extend( Object, [ Mixin ], {
					testProp : "MyClass defined",
					testMethod : function() {
						data = "MyClass defined";
					}
				} );
				
				
				var instance = new MyClass(); 
				expect( instance.testProp ).toBe( "MyClass defined" );
				
				instance.testMethod();
				expect( data ).toBe( "MyClass defined" );
			} );
			
			
			
			it( "extend() should have later-defined mixins take precedence over earlier-defined mixins", function() {
				var Mixin1 = Kevlar.extend( Object, {
					testProp : "Mixin1 defined"
				} );
				var Mixin2 = Kevlar.extend( Object, {
					testProp : "Mixin2 defined"
				} );
				
				var MyClass = Kevlar.extend( Object, [ Mixin1, Mixin2 ], {
					// empty
				} );
				
				var instance = new MyClass();
				expect( instance.testProp ).toBe( "Mixin2 defined" );
			} );
			
			
			
			it( "extend() should have set up the hasMixin() method, which should check the class for a given mixin", function() {
				var Mixin = Kevlar.extend( Object, {} );
				var SomeOtherMixin = Kevlar.extend( Object, {} );
				
				var MyClass = Kevlar.extend( Object, [ Mixin ], {} );
				
				expect( MyClass.hasMixin( Mixin ) ).toEqual( true );
				expect( MyClass.hasMixin( SomeOtherMixin ) ).toEqual( false );
			} );
			
			
			
			it( "extend() should have set up the hasMixin() method, which should check the class and all of its superclasses for a given mixin", function() {
				var Mixin = Kevlar.extend( Object, {} );
				var SomeOtherMixin = Kevlar.extend( Object, {} );
				var SomeOtherMixin2 = Kevlar.extend( Object, {} );
				var NobodyHasThisMixin = Kevlar.extend( Object, {} );
				
				var MySuperBaseClass = Kevlar.extend( Object, [ Mixin ], {} );
				var MyBaseClass = Kevlar.extend( MySuperBaseClass, [ SomeOtherMixin ], {} );
				var MyClass = Kevlar.extend( MyBaseClass, [ SomeOtherMixin2 ], {} );
				
				// Looping tests twice. First iteration tests the lookup, second tests that caching is working correctly
				for( var i = 0; i <= 1; i++ ) {
					var pass = ( i === 0 ) ? "initial" : "cached"; 
					expect( MyClass.hasMixin( Mixin ) ).toEqual( true );
					expect( MyClass.hasMixin( SomeOtherMixin ) ).toEqual( true );
					expect( MyClass.hasMixin( SomeOtherMixin2 ) ).toEqual( true );
					expect( MyClass.hasMixin( NobodyHasThisMixin ) ).toEqual( false );
				}
			} );
			
			
			
			it( "extend() should have set up the hasMixin() method, which should work with mixins and classes defined by regular functions (not using extend())", function() {
				var Mixin = function() {};
				var SomeOtherMixin = function() {};
				var NobodyHasThisMixin = function() {};
				
				var MySuperBaseClass = function() {};
				var MyBaseClass = Kevlar.extend( MySuperBaseClass, [ Mixin ], {} );
				var MyClass = Kevlar.extend( MyBaseClass, [ SomeOtherMixin ], {} );
				
				// Looping tests twice. First iteration tests the lookup, second tests that caching is working correctly
				for( var i = 0; i <= 1; i++ ) {
					var pass = ( i === 0 ) ? "initial" : "cached"; 
					expect( MyClass.hasMixin( Mixin ) ).toEqual( true );
					expect( MyClass.hasMixin( SomeOtherMixin ) ).toEqual( true );
					expect( MyClass.hasMixin( NobodyHasThisMixin ) ).toEqual( false );
				}
			} );
			
			
			it( "extend() should have set up the hasMixin() method on the subclass's prototype, which should work as the static one on an instance's class", function() {
				var Mixin = Kevlar.extend( Object, {} );
				var SomeOtherMixin = Kevlar.extend( Object, {} );
				var SomeOtherMixin2 = Kevlar.extend( Object, {} );
				var NobodyHasThisMixin = Kevlar.extend( Object, {} );
				
				var MySuperBaseClass = Kevlar.extend( Object, [ Mixin ], {} );
				var MyBaseClass = Kevlar.extend( MySuperBaseClass, [ SomeOtherMixin ], {} );
				var MyClass = Kevlar.extend( MyBaseClass, [ SomeOtherMixin2 ], {} );
				var instance = new MyClass();
				
				// Looping tests twice. First iteration tests the lookup, second tests that caching is working correctly
				for( var i = 0; i <= 1; i++ ) {
					var pass = ( i === 0 ) ? "initial" : "cached"; 
					expect( instance.hasMixin( Mixin ) ).toEqual( true );
					expect( instance.hasMixin( SomeOtherMixin ) ).toEqual( true );
					expect( instance.hasMixin( SomeOtherMixin2 ) ).toEqual( true );
					expect( instance.hasMixin( NobodyHasThisMixin ) ).toEqual( false );
				}
			} );
		} );
		
		
		/*
		 * Test isInstanceOf()
		 */

		describe( 'Test isInstanceOf()', function() {
			
			it( "isInstanceOf() should return false for any primitive type", function() {
				expect( Kevlar.isInstanceOf( undefined, Object ) ).toEqual( false );
				expect( Kevlar.isInstanceOf( null, Object ) ).toEqual( false );
				expect( Kevlar.isInstanceOf( 1, Object ) ).toEqual( false );
				expect( Kevlar.isInstanceOf( "hi", Object ) ).toEqual( false );
				expect( Kevlar.isInstanceOf( true, Object ) ).toEqual( false );
			} );
			
			
			it( "isInstanceOf() should return true when testing an anonymous object with the Object constructor", function() {
				expect( Kevlar.isInstanceOf( {}, Object ) ).toEqual( true );
			} );
			
			
			it( "isInstanceOf() should return true when testing an object of a class", function() {
				var MyClass = Kevlar.extend( Object, { 
					constructor : function() {}
				} );
				
				var myInstance = new MyClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyClass ) ).toEqual( true );
			} );
			
			
			it( "isInstanceOf() should return true when testing an object that is a subclass of a given class", function() {
				var MyClass = Kevlar.extend( Object, { 
					constructor : function() {}
				} );
				var MySubClass = Kevlar.extend( MyClass, {
					constructor : function() {}
				} );
				
				var myInstance = new MySubClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyClass ) ).toEqual( true );
			} );
			
			
			it( "isInstanceOf() should return false when testing an object that is not an instance of a given class", function() {
				var MyClass = Kevlar.extend( Object, { 
					constructor : function() {}
				} );
				
				var SomeOtherClass = Kevlar.extend( Object, {
					constructor : function() {}
				} );
				
				var myInstance = new SomeOtherClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyClass ) ).toEqual( false );
			} );
			
			
			it( "isInstanceOf() should return true when testing an object that has a given mixin class", function() {
				var MyMixinClass = Kevlar.extend( Object, {
					constructor : function() {}
				} );
				
				var MyClass = Kevlar.extend( Object, [ MyMixinClass ], { 
					constructor : function() {}
				} );
				
				var myInstance = new MyClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyMixinClass ) ).toEqual( true );
			} );
			
			
			it( "isInstanceOf() should return true when testing an object that has a given mixin class implemented in its superclass", function() {
				var MyMixinClass = Kevlar.extend( Object, {
					constructor : function() {}
				} );
				
				var MyClass = Kevlar.extend( Object, [ MyMixinClass ], { 
					constructor : function() {}
				} );
				var MySubClass = Kevlar.extend( MyClass, { 
					constructor : function() {}
				} );
				
				var myInstance = new MySubClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyMixinClass ) ).toEqual( true );
			} );
			
			
			it( "isInstanceOf() should return true when testing an object that has a given mixin class implemented in its superclass's superclass", function() {
				var MyMixinClass = Kevlar.extend( Object, {
					constructor : function() {}
				} );
				
				var MyClass = Kevlar.extend( Object, [ MyMixinClass ], { 
					constructor : function() {}
				} );
				var MySubClass = Kevlar.extend( MyClass, { 
					constructor : function() {}
				} );
				var MySubSubClass = Kevlar.extend( MySubClass, { 
					constructor : function() {}
				} );
				
				var myInstance = new MySubSubClass();
				
				expect( Kevlar.isInstanceOf( myInstance, MyMixinClass ) ).toEqual( true );
			} );
		} );
		
} );

