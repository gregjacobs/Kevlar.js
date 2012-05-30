/*!
 * Kevlar JS Library
 * Copyright(c) 2011 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 */
/*global Ext, tests */
(function() {
	tests.unit             = new Ext.test.TestSuite( 'unit' );
	tests.unit.attribute   = new Ext.test.TestSuite( 'attribute' )   .addTo( tests.unit );
	tests.unit.data        = new Ext.test.TestSuite( 'data' )        .addTo( tests.unit );
	tests.unit.persistence = new Ext.test.TestSuite( 'persistence' ) .addTo( tests.unit );
	tests.unit.util        = new Ext.test.TestSuite( 'util' )        .addTo( tests.unit );
	
	Ext.test.Session.addSuite( tests.unit );
})();

/*global window, jQuery, Ext, Y, tests, Kevlar */
/*jslint evil:true */
tests.unit.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar',
	
	items : [
		
		/*
		 * Test Kevlar.isArray()
		 */
		{
			name : "Test isArray()",
			
			test_isArray: function() {
				var C = Kevlar.extend(Object, {
					length: 1
				});
				Y.Assert.isTrue(Kevlar.isArray([]), 'Test with empty array');
				Y.Assert.isTrue(Kevlar.isArray([1, 2, 3, 4]), 'Test with filled array');
				Y.Assert.isFalse(Kevlar.isArray(false), 'Test with boolean #1');
				Y.Assert.isFalse(Kevlar.isArray(true), 'Test with boolean #2');
				Y.Assert.isFalse(Kevlar.isArray('foo'), 'Test with string');
				Y.Assert.isFalse(Kevlar.isArray(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isArray(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isArray(new Date()), 'Test with a date');
				Y.Assert.isFalse(Kevlar.isArray({}), 'Test with empty object');
				Y.Assert.isFalse(Kevlar.isArray(document.getElementsByTagName('body')), 'Test with node list');
				Y.Assert.isFalse(Kevlar.isArray(jQuery( 'body' )[ 0 ]), 'Test with element');
				Y.Assert.isFalse(Kevlar.isArray(new C()), 'Test with custom class that has a length property');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isBoolean()
		 */
		{
			name : "Test isBoolean()",
			
			test_isBoolean: function() {
				Y.Assert.isTrue(Kevlar.isBoolean(true), 'Test with true');
				Y.Assert.isTrue(Kevlar.isBoolean(false), 'Test with false');
				Y.Assert.isFalse(Kevlar.isBoolean([]), 'Test with empty array');
				Y.Assert.isFalse(Kevlar.isBoolean([1, 2, 3]), 'Test with filled array');
				Y.Assert.isFalse(Kevlar.isBoolean(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isBoolean(''), 'Test with empty string');
				Y.Assert.isFalse(Kevlar.isBoolean('foo'), 'Test with non empty string');
				Y.Assert.isFalse(Kevlar.isBoolean(jQuery( 'body' )[ 0 ]), 'Test with element');
				Y.Assert.isFalse(Kevlar.isBoolean(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isBoolean({}), 'Test with object');
				Y.Assert.isFalse(Kevlar.isBoolean(new Date()), 'Test with date');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isDate()
		 */
		{
			name : "Test isDate()",
			
			test_isDate: function() {
				Y.Assert.isTrue(Kevlar.isDate(new Date()), 'Test with simple date');
				Y.Assert.isTrue(Kevlar.isDate(Date.parseDate('2000', 'Y')), 'Test with simple date');
				Y.Assert.isFalse(Kevlar.isDate(true), 'Test with boolean');
				Y.Assert.isFalse(Kevlar.isDate(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isDate('foo'), 'Test with string');
				Y.Assert.isFalse(Kevlar.isDate(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isDate([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isDate({}), 'Test with object');
				Y.Assert.isFalse(Kevlar.isDate(jQuery( 'body' )[ 0 ]), 'Test with element');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isDefined()
		 */
		{
			name : "Test isDefined()",
			
			test_isDefined: function() {
				Y.Assert.isFalse(Kevlar.isDefined(undefined), 'Test with undefined');
				Y.Assert.isTrue(Kevlar.isDefined(null), 'Test with null');
				Y.Assert.isTrue(Kevlar.isDefined({}), 'Test with object');
				Y.Assert.isTrue(Kevlar.isDefined([]), 'Test with array');
				Y.Assert.isTrue(Kevlar.isDefined(new Date()), 'Test with date');
				Y.Assert.isTrue(Kevlar.isDefined(1), 'Test with number');
				Y.Assert.isTrue(Kevlar.isDefined(false), 'Test with boolean');
				Y.Assert.isTrue(Kevlar.isDefined(''), 'Test with empty string');
				Y.Assert.isTrue(Kevlar.isDefined('foo'), 'Test with non-empty string');
				Y.Assert.isTrue(Kevlar.isDefined(jQuery( 'body' )[ 0 ]), 'Test with element');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isElement()
		 */
		{
			name : "Test isElement()",
			
			test_isElement: function() {
				Y.Assert.isTrue(Kevlar.isElement(jQuery( 'body' )[ 0 ]), 'Test with element');
				Y.Assert.isFalse(Kevlar.isElement(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isElement(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isElement('foo'), 'Test with string');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isJQuery()
		 */
		{
			name : "Test isJQuery()",
			
			test_isJQuery: function() {
				Y.Assert.isFalse(Kevlar.isJQuery(jQuery( 'body' )[0]), 'Test with element');
				Y.Assert.isFalse(Kevlar.isJQuery(undefined), 'Test with undefined');
				Y.Assert.isFalse(Kevlar.isJQuery(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isJQuery(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isJQuery('foo'), 'Test with string');
				Y.Assert.isFalse(Kevlar.isJQuery(false), 'Test with boolean');
				Y.Assert.isFalse(Kevlar.isJQuery({}), 'Test with anonymous object');
				Y.Assert.isFalse(Kevlar.isJQuery(Kevlar.emptyFn), 'Test with function');
				Y.Assert.isFalse(Kevlar.isJQuery([]), 'Test with array');
				Y.Assert.isTrue(Kevlar.isJQuery(jQuery( 'body' )), 'Test with jQuery wrapped set object, with an element');
				Y.Assert.isTrue(Kevlar.isJQuery(jQuery( '#non-existent-element' )), 'Test with jQuery wrapped set object, without any elements');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isFunction()
		 */
		{
			name : "Test isFunction()",
			
			test_isFunction: function() {
				var c = new Kevlar.util.Observable(), o = {
					fn: function(){
					}
				};
				Y.Assert.isTrue(Kevlar.isFunction(function(){
				}), 'Test with anonymous function');
				Y.Assert.isTrue(Kevlar.isFunction(new Function('return "";')), 'Test with new Function syntax');
				Y.Assert.isTrue(Kevlar.isFunction(Kevlar.emptyFn), 'Test with static function');
				Y.Assert.isTrue(Kevlar.isFunction(c.fireEvent), 'Test with instance function');
				Y.Assert.isTrue(Kevlar.isFunction(o.fn), 'Test with function on object');
				Y.Assert.isFalse(Kevlar.isFunction(Kevlar.version), 'Test with class property');
				Y.Assert.isFalse(Kevlar.isFunction(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isFunction(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isFunction(''), 'Test with string');
				Y.Assert.isFalse(Kevlar.isFunction(new Date()), 'Test with date');
				Y.Assert.isFalse(Kevlar.isFunction([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isFunction({}), 'Test with object');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isNumber()
		 */
		{
			name : "Test isNumber()",
			
			test_isNumber: function(){
				Y.Assert.isTrue(Kevlar.isNumber(0), 'Test with 0');
				Y.Assert.isTrue(Kevlar.isNumber(4), 'Test with non-zero integer');
				Y.Assert.isTrue(Kevlar.isNumber(-3), 'Test with negative integer');
				Y.Assert.isTrue(Kevlar.isNumber(7.9), 'Test with positive float');
				Y.Assert.isTrue(Kevlar.isNumber(-4.3), 'Test with negative float');
				Y.Assert.isTrue(Kevlar.isNumber(Number.MAX_VALUE), 'Test with MAX_VALUE');
				Y.Assert.isTrue(Kevlar.isNumber(Number.MIN_VALUE), 'Test with MIN_VALUE');
				Y.Assert.isTrue(Kevlar.isNumber(Math.PI), 'Test with Math.PI');
				Y.Assert.isTrue(Kevlar.isNumber(Number('3.1')), 'Test with Number() constructor');
				Y.Assert.isFalse(Kevlar.isNumber(Number.NaN), 'Test with NaN');
				Y.Assert.isFalse(Kevlar.isNumber(Number.POSITIVE_INFINITY), 'Test with POSITIVE_INFINITY');
				Y.Assert.isFalse(Kevlar.isNumber(Number.NEGATIVE_INFINITY), 'Test with NEGATIVE_INFINITY');
				Y.Assert.isFalse(Kevlar.isNumber(true), 'Test with true');
				Y.Assert.isFalse(Kevlar.isNumber(''), 'Test with empty string');
				Y.Assert.isFalse(Kevlar.isNumber('1.0'), 'Test with string containing a number');
				Y.Assert.isFalse(Kevlar.isNumber(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isNumber(undefined), 'Test with undefined');
				Y.Assert.isFalse(Kevlar.isNumber([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isNumber({}), 'Test with object');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isObject()
		 */
		{
			name : "Test isObject()",
			
			test_isObject: function(){
				Y.Assert.isTrue(Kevlar.isObject({}), 'Test with empty object');
				Y.Assert.isTrue(Kevlar.isObject({
					foo: 1
				}), 'Test with object with properties');
				Y.Assert.isTrue(Kevlar.isObject(new Kevlar.util.Observable()), 'Test with object instance');
				Y.Assert.isTrue(Kevlar.isObject(new Object()), 'Test with new Object(  ) syntax');
				Y.Assert.isFalse(Kevlar.isObject(new Date()), 'Test with a date object');
				Y.Assert.isFalse(Kevlar.isObject([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isObject(new Array()), 'Test with new Array(  ) syntax');
				Y.Assert.isFalse(Kevlar.isObject(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isObject('foo'), 'Test with string');
				Y.Assert.isFalse(Kevlar.isObject(false), 'Test with boolean');
				Y.Assert.isFalse(Kevlar.isObject(new Number(3)), 'Test with new Number() syntax');
				Y.Assert.isFalse(Kevlar.isObject(new String('foo')), 'Test with new String() syntax');
				Y.Assert.isFalse(Kevlar.isObject(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isObject(undefined), 'Test with undefined');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isPrimitive()
		 */
		{
			name : "Test isPrimitive()",
			
			test_isPrimitive: function() {
				Y.Assert.isTrue(Kevlar.isPrimitive(1), 'Test with integer');
				Y.Assert.isTrue(Kevlar.isPrimitive(-3), 'Test with negative integer');
				Y.Assert.isTrue(Kevlar.isPrimitive(1.4), 'Test with floating number');
				Y.Assert.isTrue(Kevlar.isPrimitive(Number.MAX_VALUE), 'Test with Number.MAX_VALUE');
				Y.Assert.isTrue(Kevlar.isPrimitive(Math.PI), 'Test with Math.PI');
				Y.Assert.isTrue(Kevlar.isPrimitive(''), 'Test with empty string');
				Y.Assert.isTrue(Kevlar.isPrimitive('foo'), 'Test with non empty string');
				Y.Assert.isTrue(Kevlar.isPrimitive(true), 'Test with boolean true');
				Y.Assert.isTrue(Kevlar.isPrimitive(false), 'Test with boolean false');
				Y.Assert.isFalse(Kevlar.isPrimitive(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isPrimitive(undefined), 'Test with undefined');
				Y.Assert.isFalse(Kevlar.isPrimitive({}), 'Test with object');
				Y.Assert.isFalse(Kevlar.isPrimitive([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isPrimitive(new Kevlar.util.Observable()), 'Test with object instance');
			}
		},
			
			
		
		/*
		 * Test Kevlar.isString()
		 */
		{
			name : "Test isString()",
			
			test_isString: function(){
				var s = new String('foo');
				Y.Assert.isTrue(Kevlar.isString(''), 'Test with empty string');
				Y.Assert.isTrue(Kevlar.isString('foo'), 'Test with non empty string');
				Y.Assert.isTrue(Kevlar.isString(String('')), 'Test with String() syntax');
				Y.Assert.isFalse(Kevlar.isString(new String('')), 'Test with new String() syntax'); //should return an object that wraps the primitive
				Y.Assert.isFalse(Kevlar.isString(1), 'Test with number');
				Y.Assert.isFalse(Kevlar.isString(true), 'Test with boolean');
				Y.Assert.isFalse(Kevlar.isString(null), 'Test with null');
				Y.Assert.isFalse(Kevlar.isString(undefined), 'Test with undefined');
				Y.Assert.isFalse(Kevlar.isString([]), 'Test with array');
				Y.Assert.isFalse(Kevlar.isString({}), 'Test with number');
			}
		},
		
		
		// --------------------------------
		
		
		/*
		 * Test Kevlar.namespace()
		 */
		{
			name : "Test namespace()",
			
			test_namespace: function(){
				var w = window;
				
				Kevlar.namespace('FooTest1');
				Y.Assert.isNotUndefined(w.FooTest1, 'Test creation with a single top-level namespace');
				
				Kevlar.namespace('FooTest2', 'FooTest3', 'FooTest4');
				Y.Assert.isNotUndefined(w.FooTest2, 'Test creation with multiple top level namespaces');
				Y.Assert.isNotUndefined(w.FooTest3, 'Test creation with multiple top level namespaces');
				Y.Assert.isNotUndefined(w.FooTest4, 'Test creation with multiple top level namespaces');
				
				Kevlar.namespace('FooTest5', 'FooTest5.ns1', 'FooTest5.ns1.ns2', 'FooTest5.ns1.ns2.ns3');
				Y.Assert.isNotUndefined(w.FooTest5, 'Test a chain of namespaces, starting from a top-level');
				Y.Assert.isNotUndefined(w.FooTest5.ns1, 'Test a chain of namespaces, starting from a top-level');
				Y.Assert.isNotUndefined(w.FooTest5.ns1.ns2, 'Test a chain of namespaces, starting from a top-level');
				Y.Assert.isNotUndefined(w.FooTest5.ns1.ns2.ns3, 'Test a chain of namespaces, starting from a top-level');
				
				Kevlar.namespace('FooTest6.ns1', 'FooTest7.ns1');
				Y.Assert.isNotUndefined(w.FooTest6.ns1, 'Test creating lower level namespaces without first defining the top level');
				Y.Assert.isNotUndefined(w.FooTest7.ns1, 'Test creating lower level namespaces without first defining the top level');
				
				Kevlar.namespace('FooTest8', 'FooTest8.ns1.ns2');
				Y.Assert.isNotUndefined(w.FooTest8, 'Test creating a lower level namespace without defining the middle level');
				Y.Assert.isNotUndefined(w.FooTest8.ns1, 'Test creating a lower level namespace without defining the middle level');
				Y.Assert.isNotUndefined(w.FooTest8.ns1.ns2, 'Test creating a lower level namespace without defining the middle level');
				
				FooTest8.prop1 = 'foo';
				Kevlar.namespace('FooTest8');
				Y.Assert.areEqual('foo', FooTest8.prop1, 'Ensure existing namespaces are not overwritten');
			}
		},
			
			
		
		/*
		 * Test Kevlar.toArray()
		 */
		{
			name : "Test toArray()",
			
			/*
			 * Test Kevlar.toArray()
			 */
			test_toArray: function(){
				Y.Assert.isArray( Kevlar.toArray( document.getElementsByTagName( 'body' ) ), 'Test with node list' );
				
				(function() {
					var arr = Kevlar.toArray( arguments );
					Y.Assert.isArray( arr, 'Test with arguments object' );
					Y.Assert.areSame( 3, arr.length, 'Should be 3 args in the array' );
				})( 1, 2, 3 );
			}
		}
	]
	
} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Attribute',
	
	
	
	items: [
		{
			/*
			 * Test constructor
			 */
			name : "Test constructor",
	
			// --------------------------------
			//        Special Instructions
			// --------------------------------
			_should : {
				error : {
					"Instantiating an Attribute without a 'name' should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an undefined 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an undefined 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with a null 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with a null 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an empty 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an empty 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor"
				}
			},
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			// -----------------------
			
			// Check that the name property was provided
			
			"Instantiating an Attribute without a 'name' should throw an error" : function() {
				var attribute = new this.Attribute();
			},
			
			
			"Instantiating an Attribute with an undefined 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( undefined );
			},
			
			
			"Instantiating an Attribute with an undefined 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : undefined
				} );
			},
			
			
			"Instantiating an Attribute with a null 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( null );
			},
			
			
			"Instantiating an Attribute with a null 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : null
				} );
			},
			
			
			"Instantiating an Attribute with an empty 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( "" );
			},
			
			
			"Instantiating an Attribute with an empty 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : ""
				} );
			}
		},
		
		
		{
			/*
			 * Test getName()
			 */
			name: "Test getName()",
			
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			"The name property should be retrievable by getName()" : function() {
				var attribute1 = new this.Attribute( { name: 'testName' } );
				Y.Assert.areSame( 'testName', attribute1.getName(), "getName() not properly retriving Attribute's name. Was looking for 'testName'." );
				
				var attribute2 = new this.Attribute( { name: '_' } );
				Y.Assert.areSame( '_', attribute2.getName(), "getName() not properly retriving Attribute's name. Was looking for '_'." );
				
				var attribute3 = new this.Attribute( { name: "abc" } );
				Y.Assert.areSame( "abc", attribute3.getName(), "getName() not properly retriving Attribute's name. Was looking for 'abc'." );
			},
		
		
			// Make sure a number provided to the constructor as the 'name' is converted to a string datatype
			
			"Providing the attribute name as a number directly to the constructor argument should be converted to a string for the attribute's name" : function() {
				var attribute = new this.Attribute( 0 );
				Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
			},
			
			"Providing the attribute name as a property on the config should be converted to a string for the attribute's name" : function() {
				var attribute = new this.Attribute( {
					name : 0
				} );
				Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
			}
		},
		
		
		{
			/*
			 * Test getDefaultValue()
			 */
			name: "Test getDefaultValue()",
			
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			// Check that the defaultValue is handled correctly
	
			"A default provided as the keyword 'default' should be accepted properly as defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					'default' : 1
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as the keyword 'default' that is a function should be executed and set properly to defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					'default' : function() { return 1; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue should be accepted properly" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : 1
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue that is a function should be executed and set properly to defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : function() { return 1; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue that is a function should be executed each time the default is called for" : function() {
				var counter = 0;
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : function() { return ++counter; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
				Y.Assert.areSame( 2, attribute.getDefaultValue() );
			},
			
			
			"A defaultValue provided as an object should be recursed for functions, and those functions' return values should be used in the default" : function() {
				var attribute = new this.Attribute( {
					name : 'TestAttribute',
					'default' : { 
						a : "A",
						b : {
							innerB1 : function() {
								return "B1";
							},
							innerB2 : "B2"
						},
						c : {
							innerC1 : "C",
							innerC2 : function() {
								return "C2";
							}
						}
					}
				} );
				var defaultData = attribute.getDefaultValue();
				Y.Assert.areSame( "A", defaultData.a, "The 'default' config provided as an object should have had the value 'A' for property 'a'." );
				Y.Assert.areSame( "B1", defaultData.b.innerB1, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
				Y.Assert.areSame( "C2", defaultData.c.innerC2, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
			}
		},
		
		
		/*
		 * Test the doSet() method
		 */
		{
			name: "Test the doSet() method",
			
			
			"doSet() should call the Attribute's prototype set() method if there is no 'set' config, with the appropriate arguments" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var providedModel, 
				    providedNewValue, 
				    providedOldValue;
				    
				var Attribute = Kevlar.attribute.Attribute.extend( {
					set : function( model, newValue, oldValue ) {
						providedModel = model;
						providedNewValue = newValue;
						providedOldValue = oldValue;
					}
				} );
				
				var attribute = new Attribute( 'attr' );
				attribute.doSet( mockModel, newValue, oldValue );
				
				Y.Assert.areSame( mockModel, providedModel, "The mock model should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( newValue, providedNewValue, "The new value should have been provided as the second arg to the set() method" );
				Y.Assert.areSame( oldValue, providedOldValue, "The old value should have been provided as the third arg to the set() method" );
			},
			
			
			"doSet() should call a provided 'set' config function if provided to the Attribute, and it should be called in the scope of the model" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var contextCalledIn, 
				    providedNewValue, 
				    providedOldValue;
				    
				var Attribute = Kevlar.attribute.Attribute.extend( {} );
				
				var attribute = new Attribute( {
					name: 'attr',
					set: function( newValue, oldValue ) {
						contextCalledIn = this;
						providedNewValue = newValue;
						providedOldValue = oldValue;
					}
				} );
				
				attribute.doSet( mockModel, newValue, oldValue );
				
				Y.Assert.areSame( mockModel, contextCalledIn, "The 'set' config should have been called in the context of the mock model" );
				Y.Assert.areSame( newValue, providedNewValue, "The new value should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( oldValue, providedOldValue, "The old value should have been provided as the second arg to the set() method" );
			},
			
			
			"doSet() should wrap the provided 'set' config function if provided to the Attribute so that this._super() can be called from it for the original conversion" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var setMethodModel,
				    setMethodNewValue,
				    setMethodOldValue,
				    
				    setConfigContext,
				    setConfigNewValue,
				    setConfigOldValue;
				
				var Attribute = Kevlar.attribute.Attribute.extend( {
					set : function( model, newValue, oldValue ) {
						setMethodModel = model;
						setMethodNewValue = newValue;
						setMethodOldValue = oldValue;
					}
				} );
				
				var attribute = new Attribute( {
					name: 'attr',
					set: function( newValue, oldValue ) {   // the 'set' config
						setConfigContext = this;
						setConfigNewValue = newValue;
						setConfigOldValue = oldValue;
						
						this._super( arguments );
					}
				} );
				
				attribute.doSet( mockModel, newValue, oldValue );
				
				
				Y.Assert.areSame( mockModel, setMethodModel, "The mock model should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( newValue, setMethodNewValue, "The new value should have been provided as the second arg to the set() method" );
				Y.Assert.areSame( oldValue, setMethodOldValue, "The old value should have been provided as the third arg to the set() method" );
				
				Y.Assert.areSame( mockModel, setConfigContext, "The 'set' config should have been called in the context of the mock model" );
				Y.Assert.areSame( newValue, setConfigNewValue, "The new value should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( oldValue, setConfigOldValue, "The old value should have been provided as the second arg to the set() method" );
			}
		}
	]
	
} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'BooleanAttribute',
	
	
	items : [
	
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return the appropriate Boolean when provided a range of values and types, when the useNull config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.BooleanAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isFalse( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isFalse( value, "Test with value: null" );
				
				
				// Test with actual booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isFalse( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isTrue( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.isFalse( value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.isTrue( value, "Test with value: 1" );
				
				
				// Test with strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isFalse( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isFalse( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isTrue( value, "Test with value: 'true'" );				
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isFalse( value, "Test with value: {}" );
			},
			
			
			"beforeSet() should return null for 'unparsable' values/types, when the useNull config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.BooleanAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isNull( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isNull( value, "Test with value: null" );
				
				
				// Test with actual booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isFalse( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isTrue( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.isFalse( value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.isTrue( value, "Test with value: 1" );
				
				
				// Test with strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isNull( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isFalse( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isTrue( value, "Test with value: 'true'" );				
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isFalse( value, "Test with value: {}" );
			}
		}
	]


} ) );

/*global window, Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.CollectionAttribute',
	
	
	items : [
		
		/*
		 * Test constructor
		 */
		{
			name : "Test constructor",
			
			// Special instructions
			_should : {
				error : {
					"the constructor should throw an error if the undefined value is provided for the collectionClass config, which helps determine when late binding is needed for the collectionClass config" : 
						 "The 'collectionClass' config provided to an Attribute with the name 'attr' either doesn't exist, or doesn't " +
			             "exist just yet. Consider using the String or Function form of the collectionClass config for late binding, if needed"
				}
			},
			
			
			"the constructor should throw an error if the undefined value is provided for the collectionClass config, which helps determine when late binding is needed for the collectionClass config" : function() {
				var attr = new Kevlar.attribute.CollectionAttribute( {
					name : 'attr',
					collectionClass: undefined
				} );
				
				Y.Assert.fail( "The constructor should have thrown an error if the collectionClass config was provided but was undefined. This is to help with debugging when late binding for the collectionClass is needed." );
			}
		},
		
		
		/*
		 * Test valuesAreEqual()
		 */
		{
			name : "Test valuesAreEqual()",
			
			setUp : function() {
				this.attribute = new Kevlar.attribute.CollectionAttribute( { name: 'attr' } );
			},
			
			
			"valuesAreEqual() should return true for two null values" : function() {
				var result = this.attribute.valuesAreEqual( null, null );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for one null and one object" : function() {
				var result;
				
				result = this.attribute.valuesAreEqual( null, {} );
				Y.Assert.isFalse( result );
				
				result = this.attribute.valuesAreEqual( {}, null );
				Y.Assert.isFalse( result );
			},
			
			
			"valuesAreEqual() should return true for comparing the same collection" : function() {
				var Collection = Kevlar.Collection.extend( {} ),
				    collection = new Collection();
				
				var result = this.attribute.valuesAreEqual( collection, collection );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for two different collections" : function() {
				var Collection = Kevlar.Collection.extend( {} ),
				    collection1 = new Collection(),
				    collection2 = new Collection();
				
				var result = this.attribute.valuesAreEqual( collection1, collection2 );
				Y.Assert.isFalse( result );
			}
		},
		
		
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				this.attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: this.Collection
				} );
			},
			
			
			_should : {
				error : {
					"beforeSet() should throw an error if the string 'collectionClass' config does not reference a Collection class" :
						"The string value 'collectionClass' config did not resolve to a Collection class for attribute 'attr'",
					"beforeSet() should throw an error if the function value 'collectionClass' config does not reference a Collection class" :
						"The function value 'collectionClass' config did not resolve to a Collection class for attribute 'attr'"
				}
			},
			
			
			// -----------------------
			
			
			"beforeSet() should return null when provided any falsy value, or non-object" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.CollectionAttribute( { name: 'attr' } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( null, value );
			},
			
			
			// ---------------------------
			
			// Test errors for if the string or function 'collectionClass' configs still return an undefined value
			
			"beforeSet() should throw an error if the string 'collectionClass' config does not reference a Collection class" : function() {				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: 'somethingThatIsNotDefined'
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.fail( "The test should have thrown an error in the call to attribute.beforeSet()" );
			},
			
			
			"beforeSet() should throw an error if the function value 'collectionClass' config does not reference a Collection class" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: function() {
						return;  // undefined
					}
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.fail( "The test should have thrown an error in the call to attribute.beforeSet()" );
			},
			
			
			// ---------------------------
			
			// Test conversions from an array to a Collection
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a direct reference to the Collection subclass" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    oldValue,  // undefined
				    value = this.attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( this.Collection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a string" : function() {
				// Use a deeply nested namespace, as that will probably be what is used
				window.__Kevlar_CollectionAttributeTest = {};
				window.__Kevlar_CollectionAttributeTest.ns1 = {};
				window.__Kevlar_CollectionAttributeTest.ns1.ns2 = {};
				window.__Kevlar_CollectionAttributeTest.ns1.ns2.MyCollection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: '__Kevlar_CollectionAttributeTest.ns1.ns2.MyCollection'
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( window.__Kevlar_CollectionAttributeTest.ns1.ns2.MyCollection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a function" : function() {
				var TestCollection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: function() {
						return TestCollection;   // for late binding
					}
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( TestCollection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should return an actual Collection instance unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue,  // undefined
				    data = new this.Collection( [ { attr1 : 1, attr2: 2 } ] ),
				    value = this.attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.areSame( data, value, "The return value from beforeSet should have been the same collection instance" );
				
				var model = value.getAt( 0 );
				Y.Assert.areSame( 1, model.get( 'attr1' ), "The data should remain set to the new model" );
				Y.Assert.areSame( 2, model.get( 'attr2' ), "The data should remain set to the new model" );
			},
			
			
			// --------------------
			
			
			"if no collectionClass was provided, beforeSet() should return an array unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr'
				} );
				
				var data = [ { attr1: 1, attr2: 2 } ],
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.areSame( data, value );
			}
		},
		
		
		/*
		 * Test afterSet()
		 */
		{
			name : "Test afterSet()",
			
			
			"afterSet() should return the collection (i.e. it doesn't forget the return statement!)" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    mockCollection = JsMockito.mock( Kevlar.Collection );
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr'
				} );
				
				var value = attribute.afterSet( mockModel, mockCollection );
				Y.Assert.areSame( mockCollection, value );
			}
			
		}
		
	]
	
} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'DateAttribute',
	
	
	items : [
	
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return null when provided invalid values" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.DateAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isNull( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isNull( value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isNull( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isNull( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.isNull( value, "Test with value: 0" );
				
				/* Apparently chrome will parse this one as Jan 1, 2001...
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.isNull( value, "Test with value: 1" );
				*/
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.isNull( value, "Test with value: 1.42" );
				
				
				// Test with invalid strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isNull( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNull( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNull( value, "Test with value: 'true'" );
				
				/* Apparently chrome will parse this one as Jan 1, 2001...
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.isNull( value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.isNull( value, "Test with value: '1.11'" );	
				*/
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isNull( value, "Test with value: {}" );
			},
			
			
			"beforeSet() should return a Date object when provided valid values" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.DateAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with valid date strings
				value = attribute.beforeSet( mockModel, "2/22/2012", oldValue );
				Y.Assert.isInstanceOf( Date, value, "Test with value: '2/22/2012'" );
				
				
				// Test with a Date object
				var date = new Date( "2/22/2012" );
				value = attribute.beforeSet( mockModel, date, oldValue );
				Y.Assert.areSame( date, value, "Test with actual Date object" );
			}
		}
	]


} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'FloatAttribute',
	
	
	items : [
	
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return the appropriate string value when provided a range of values and types, when the useNull config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.FloatAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isNaN( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isNaN( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1" );
				
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.areSame( 1.42, value, "Test with value: 1.42" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( 0, value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'true'" );
				
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.areSame( 1.11, value, "Test with value: '1.11'" );	
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isNaN( value, "Test with value: {}" );
			},
			
			
			
			"beforeSet() should return null for 'unparsable' values/types, when the useNull config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.FloatAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isNull( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isNull( value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isNaN( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isNaN( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1" );
				
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.areSame( 1.42, value, "Test with value: 1.42" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isNull( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'true'" );
				
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.areSame( 1.11, value, "Test with value: '1.11'" );
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isNaN( value, "Test with value: {}" );
			},
			
			
			
			"beforeSet() should strip off $, %, and comma (',') characters from an input string, to make a float" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.FloatAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, "$1,000.32%", oldValue );
				Y.Assert.areSame( 1000.32, value, "Test with value: $1,000.32%" );
			}
		}
	]


} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'IntegerAttribute',
	
	
	items : [
	
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return the appropriate string value when provided a range of values and types, when the useNull config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.IntegerAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isNaN( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isNaN( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1" );
				
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1.42" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( 0, value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'true'" );
				
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1.11'" );	
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isNaN( value, "Test with value: {}" );
			},
			
			
			
			"beforeSet() should return null for 'unparsable' values/types, when the useNull config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.IntegerAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isNull( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isNull( value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.isNaN( value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.isNaN( value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( 0, value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1" );
				
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.areSame( 1, value, "Test with value: 1.42" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isNull( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNaN( value, "Test with value: 'true'" );
				
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.areSame( 1, value, "Test with value: '1.11'" );
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.isNaN( value, "Test with value: {}" );
			},
			
			
			
			"beforeSet() should strip off $, %, and comma (',') characters from an input string, to make an integer" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.IntegerAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, "$1,000.32%", oldValue );
				Y.Assert.areSame( 1000, value, "Test with value: $1,000.32%" );
			}
		}
	]


} ) );

/*global window, Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.ModelAttribute',
	
	
	items : [
		
		/*
		 * Test constructor
		 */
		{
			name : "Test constructor",
			
			// Special instructions
			_should : {
				error : {
					"the constructor should throw an error if the undefined value is provided for the modelClass config, which helps determine when late binding is needed for the modelClass config" : 
						 "The 'modelClass' config provided to an Attribute with the name 'attr' either doesn't exist, or doesn't " +
			             "exist just yet. Consider using the String or Function form of the modelClass config for late binding, if needed"
				}
			},
			
			
			"the constructor should throw an error if the undefined value is provided for the modelClass config, which helps determine when late binding is needed for the modelClass config" : function() {
				var attr = new Kevlar.attribute.ModelAttribute( {
					name : 'attr',
					modelClass: undefined
				} );
				
				Y.Assert.fail( "The constructor should have thrown an error if the modelClass config was provided but was undefined. This is to help with debugging when late binding for the modelClass is needed." );
			}
		},
		
		
		/*
		 * Test valuesAreEqual()
		 */
		{
			name : "Test valuesAreEqual()",
			
			setUp : function() {
				this.attribute = new Kevlar.attribute.ModelAttribute( { name: 'attr' } );
			},
			
			
			"valuesAreEqual() should return true for two null values" : function() {
				var result = this.attribute.valuesAreEqual( null, null );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for one null and one object" : function() {
				var result = this.attribute.valuesAreEqual( null, {} );
				Y.Assert.isFalse( result );
				
				var result = this.attribute.valuesAreEqual( {}, null );
				Y.Assert.isFalse( result );
			},
			
			
			"valuesAreEqual() should return true for comparing the same model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ]
				} );
				
				// NOTE: These should refer to the same object, as only one Model will be instantiated for two Models with the same ID 
				var model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 1 } );
				
				var result = this.attribute.valuesAreEqual( model1, model2 );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for two different models" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ]
				} );
				
				var model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 2 } );
				
				var result = this.attribute.valuesAreEqual( model1, model2 );
				Y.Assert.isFalse( result );
			}
		},
		
		
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				this.attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: this.Model
				} );
			},
			
			
			_should : {
				error : {
					"beforeSet() should throw an error if the string 'modelClass' config does not reference a Model class" :
						"The string value 'modelClass' config did not resolve to a Model class for attribute 'attr'",
					"beforeSet() should throw an error if the function value 'modelClass' config does not reference a Model class" :
						"The function value 'modelClass' config did not resolve to a Model class for attribute 'attr'"
				}
			},
			
			
			// -----------------------
			
			
			"beforeSet() should return null when provided any falsy value, or non-object" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.ModelAttribute( { name: 'attr' } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( null, value );
			},
			
			
			// ---------------------------
			
			// Test errors for if the string or function 'modelClass' configs still return an undefined value
			
			"beforeSet() should throw an error if the string 'modelClass' config does not reference a Model class" : function() {				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: 'somethingThatIsNotDefined'
				} );
				
				var data = { attr1: 1, attr2: 2 },
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.fail( "The test should have thrown an error in the call to attribute.beforeSet()" );
			},
			
			
			"beforeSet() should throw an error if the function value 'modelClass' config does not reference a Model class" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: function() {
						return;  // undefined
					}
				} );
				
				var data = { attr1: 1, attr2: 2 },
				    value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.fail( "The test should have thrown an error in the call to attribute.beforeSet()" );
			},
			
			
			// ---------------------------
			
			// Test conversions from an object to a Model
			
			
			"beforeSet() should convert an anonymous data object to the provided modelClass, when modelClass is a direct reference to the Model subclass" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    data = { attr1: 1, attr2: 2 },
				    oldValue,  // undefined
				    value = this.attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( this.Model, value, "The return value from beforeSet should have been an instance of the Model" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should have been set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should have been set to the new model" );
			},
			
			
			"beforeSet() should convert an anonymous data object to the provided modelClass, when modelClass is a string" : function() {
				// Use a deeply nested namespace, as that will probably be what is used
				window.__Kevlar_CollectionAttributeTest = {};
				window.__Kevlar_CollectionAttributeTest.ns1 = {};
				window.__Kevlar_CollectionAttributeTest.ns1.ns2 = {};
				window.__Kevlar_CollectionAttributeTest.ns1.ns2.MyModel = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: '__Kevlar_CollectionAttributeTest.ns1.ns2.MyModel'
				} );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( window.__Kevlar_CollectionAttributeTest.ns1.ns2.MyModel, value, "The return value from beforeSet should have been an instance of the Model" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should have been set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should have been set to the new model" );
			},
			
			
			"beforeSet() should convert an anonymous data object to the provided modelClass, when modelClass is a function" : function() {
				var TestModel = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: function() {
						return TestModel;   // for late binding
					}
				} );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.isInstanceOf( TestModel, value, "The return value from beforeSet should have been an instance of the Model" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should have been set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should have been set to the new model" );
			},
			
			
			"beforeSet() should return an actual Model instance unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue,  // undefined
				    data = new this.Model( { attr1 : 1, attr2: 2 } ),
				    value = this.attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.areSame( data, value, "The return value from beforeSet should have been the same model instance" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should remain set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should remain set to the new model" );
			},
			
			
			// --------------------
			
			
			"if no modelClass was provided, beforeSet() should return an anonymous data object unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr'
				} );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.areSame( data, value );
			}
		},		
		
		
		
		/*
		 * Test afterSet()
		 */
		{
			name : "Test afterSet()",
			
			
			"afterSet() should return the model (i.e. it doesn't forget the return statement!)" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr'
				} );
				
				var value = attribute.afterSet( mockModel, mockModel );  // just pass itself for the value, doesn't matter
				Y.Assert.areSame( mockModel, value );
			}
			
		}
			
		
	]
	
} ) );

/*global window, Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.ObjectAttribute',
	
	
	items : [
	
		/*
		 * Test the defaultValue
		 */
		{
			name : "Test the defaultValue",
			
			"The default defaultValue for ObjectAttribute should be null" : function() {
				Y.Assert.isNull( Kevlar.attribute.ObjectAttribute.prototype.defaultValue );
			}
		},
	
		
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return null when provided any falsy value, or non-object" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.ObjectAttribute( { name: 'attr' } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( null, value );
			},
			
			
			
			"beforeSet() should return an object unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.ObjectAttribute( { name: 'attr' } ),
				    oldValue;  // undefined
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.beforeSet( mockModel, data, oldValue );
				
				Y.Assert.areSame( data, value );
			}
		}
		
	]
	
} ) );

/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'StringAttribute',
	
	
	items : [
	
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			"beforeSet() should return the appropriate string value when provided a range of values and types, when the useNull config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.StringAttribute( { name: 'attr', useNull: false } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.areSame( "", value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.areSame( "", value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.areSame( "false", value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.areSame( "true", value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( "0", value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( "1", value, "Test with value: 1" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( "", value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.areSame( "hi", value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.areSame( "true", value, "Test with value: 'true'" );				
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.areSame( "[object Object]", value, "Test with value: {}" );
			},
			
			
			
			"beforeSet() should return null for 'unparsable' values/types, when the useNull config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.StringAttribute( { name: 'attr', useNull: true } ),
				    oldValue,  // undefined
				    value;
				
				// Test with undefined and null
				value = attribute.beforeSet( mockModel, undefined, oldValue );
				Y.Assert.isNull( value, "Test with value: undefined" );
				
				value = attribute.beforeSet( mockModel, null, oldValue );
				Y.Assert.isNull( value, "Test with value: null" );
				
				
				// Test with booleans
				value = attribute.beforeSet( mockModel, false, oldValue );
				Y.Assert.areSame( "false", value, "Test with value: false" );
				
				value = attribute.beforeSet( mockModel, true, oldValue );
				Y.Assert.areSame( "true", value, "Test with value: true" );
				
				
				// Test with numbers
				value = attribute.beforeSet( mockModel, 0, oldValue );
				Y.Assert.areSame( "0", value, "Test with value: 0" );
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.areSame( "1", value, "Test with value: 1" );
				
				
				// Test with actual strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.areSame( "", value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.areSame( "hi", value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.areSame( "true", value, "Test with value: 'true'" );				
				
				
				// Test with an object
				value = attribute.beforeSet( mockModel, {}, oldValue );
				Y.Assert.areSame( "[object Object]", value, "Test with value: {}" );
			}
		}
	]


} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestSuite( {
	name: 'Kevlar.Collection',
	
	
	items : [
		
		/*
		 * Test the constructor
		 */
		{
			name : "Test the constructor",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"The constructor should accept a configuration object to initialize the Collection with an initial set of models and any other custom configs" : function() {
				var model = new this.Model( { attr: 'value1' } );
				
				var collection = new this.Collection( {
					models: model,
					customConfig: 1
				} );
				
				var models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model in the collection should be the one provided to the 'models' config" );
				
				// Check that the custom config was applied to the collection
				Y.Assert.areSame( 1, collection.customConfig, "The customConfig should have been applied to the collection" );
			},
			
			"The constructor should accept an array of Models to initialize the Collection with" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				var models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( model1, models[ 0 ], "The first model should be the first model provided to the constructor" );
				Y.Assert.areSame( model2, models[ 1 ], "The second model should be the second model provided to the constructor" );
			}
		},
		
		
		/*
		 * Test createModel()
		 */
		{
			name : "Test createModel()",
			
			"createModel() should take an anonymous config object, and transform it into a Model instance, based on the 'model' config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var collection = new Collection();
				var model = collection.createModel( { attr: 'testValue' } );
				
				Y.Assert.isInstanceOf( Model, model );
				Y.Assert.areSame( 'testValue', model.get( 'attr' ) );
			}
		},
		
		
		
		/*
		 * Test add()
		 */
		{
			name : "Test add()",
			
			"add() should simply delegate to the insert() method" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var insertedModels, insertedIndex;
				var Collection = Kevlar.Collection.extend( {
					model : Model,
					
					// override insert() method, to make sure it is called
					insert : function( models, index ) {
						insertedModels = models;
						insertedIndex = index;
					}
				} );
				
				var collection = new Collection(),
				    model1 = new Model(),
				    model2 = new Model();
				    
				collection.add( [ model1, model2 ] );
				
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], insertedModels, "The models passed to insert() should be the same ones provided to add()" );
				Y.Assert.isUndefined( insertedIndex, "The index for the insert should be undefined, which defaults to appending the models to the collection" );
			}
		},
		
	
		/*
		 * Test insert()
		 */
		{
			name : "Test insert()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			// -------------------------
			
			// Test direct adding (appending) of models (not specifying an index of where to add them)
			
			
			"insert() should be able to add a single Model instance to the Collection" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( model );
				
				models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model added should be the first model in the collection" );
			},
			
			
			"insert() should be able to add an array of Model instances to the Collection" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( [ model1, model2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( model1, models[ 0 ], "The first model added in the array should be the first model in the collection" );
				Y.Assert.areSame( model2, models[ 1 ], "The second model added in the array should be the second model in the collection" );
			},
			
			
			"inserting (adding) one or more models should have the Collection considered as 'modified'" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be modified" );
				
				collection.add( model1 );
				Y.Assert.isTrue( collection.isModified(), "The collection should now be considered modified" );
			},
			
			
			// -------------------------
			
			// Test inserting models at specified indexes
			
			
			"insert() should be able to add a single Model instance to the Collection at a specified index" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2 ] ), // only inserting model1 and model2 for now
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "Initial condition: There should be 2 models in the collection" );
				
				// Now insert model3 in the middel
				collection.insert( model3, 1 );
				
				models = collection.getModels();
				Y.Assert.areSame( 3, models.length, "There should now be 3 models in the collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model2 ], models, "model3 should have been added in the middle" );
			},
			
			
			"insert() should be able to add an array of Model instance to the Collection at a specified index" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    model4 = new this.Model( { attr: 'value4' } ),
				    collection = new this.Collection( [ model1, model2 ] ), // only inserting model1 and model2 for now
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "Initial condition: There should be 2 models in the collection" );
				
				// Now insert model3 and model4 in the middel
				collection.insert( [ model3, model4 ], 1 );
				
				models = collection.getModels();
				Y.Assert.areSame( 4, models.length, "There should now be 4 models in the collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model4, model2 ], models, "model3 and model4 should have been added in the middle" );
			},
			
			
			
			
			// -------------------------
			
			// Test the 'add' event
			
			
			"insert() should fire the 'add' event for a single inserted model" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				var addEventCount = 0,
				    addedModel;
				    
				collection.on( 'add', function( collection, model ) {
					addEventCount++;
					addedModel = model;
				} );
				collection.insert( model );
				
				Y.Assert.areSame( 1, addEventCount, "The 'add' event should have been fired exactly once" );
				Y.Assert.areSame( model, addedModel, "The model provided with the 'add' event should be the model added to the collection" );
			},
			
			
			"insert() should fire the 'add' event one time for each of multiple inserted models" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				
				var addEventCount = 0,
				    addedModels = [];
				    
				collection.on( 'add', function( collection, model ) {
					addEventCount++;
					addedModels.push( model );
				} );
				collection.insert( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, addEventCount, "The 'add' event should have been fired exactly twice" );
				Y.Assert.areSame( model1, addedModels[ 0 ], "The first model added should be the first model added to the collection" );
				Y.Assert.areSame( model2, addedModels[ 1 ], "The second model added should be the second model added to the collection" );
			},
			
			
			"insert() should *not* fire the 'add' event for a model that is already in the Collection" : function() {
				var model = new this.Model( { attr: 'value1' } ),
				    collection = new this.Collection( [ model ] );  // initally add the model
				
				var addEventFired = false;
				collection.on( 'add', function( collection, model ) {
					addEventFired = true;
				} );
				collection.insert( model );
				
				Y.Assert.isFalse( addEventFired, "The 'add' event should not have been fired for another insert of the same model" );
			},
			
			
			"insert() should *not* fire the 'add' event for models that are already in the Collection when multiple models are inserted, and only some exist already" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    collection = new this.Collection( [ model1 ] );  // initally add model1
				
				var addEventCount = 0,
				    addedModels = [];
				    
				collection.on( 'add', function( collection, model ) {
					addEventCount++;
					addedModels.push( model );
				} );
				collection.insert( [ model1, model2 ] );  // now insert model1 and model2. Only model2 should really have been "added"
				
				Y.Assert.areSame( 1, addEventCount, "The 'add' event should have been fired exactly once" );
				Y.ArrayAssert.itemsAreSame( [ model2 ], addedModels, "The 'add' event should have only fired with the model that was actually added" );
			},
			
			
			// -------------------------
			
			// Test the 'addset' event
			
			
			"insert() should fire the 'addset' event with the array of inserted models, even if only one model is inserted" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				var addedModels;
				collection.on( 'addset', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( model );
				
				Y.Assert.areSame( 1, addedModels.length, "1 model should have been provided to the 'addset' event" );
				Y.Assert.areSame( model, addedModels[ 0 ], "The model provided with the 'addset' event should be the model added to the collection" );
			},
			
			
			"insert() should fire the 'addset' event with the array of inserted models when multiple models are inserted" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				var addedModels;
				collection.on( 'addset', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'addset' event" );
				Y.Assert.areSame( model1, addedModels[ 0 ], "The first model added in the array should be the first model added to the collection" );
				Y.Assert.areSame( model2, addedModels[ 1 ], "The second model added in the array should be the second model added to the collection" );
			},
			
			
			"insert() should *not* fire the 'addset' event for a model that is already in the Collection" : function() {
				var model = new this.Model( { attr: 'value1' } ),
				    collection = new this.Collection( [ model ] );  // initally add the model
				
				var addEventFired = false;
				collection.on( 'addset', function( collection, models ) {
					addEventFired = true;
				} );
				collection.insert( model );
				
				Y.Assert.isFalse( addEventFired, "The 'addset' event should not have been fired for another insert of the same model" );
			},
			
			
			"insert() should *not* fire the 'addset' event for models that are already in the Collection when multiple models are inserted, and only some exist already" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    collection = new this.Collection( [ model1 ] );  // initally add model1
				
				var addedModels;
				collection.on( 'addset', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ model1, model2 ] );  // now insert model1 and model2. Only model2 should really have been "added"
				
				Y.ArrayAssert.itemsAreSame( [ model2 ], addedModels, "The 'addset' event should have only fired with the model that was actually added" );
			},
			
			
			// -------------------------
			
			// Test reordering models
			
			
			"insert() should reorder models when they already exist in the Collection" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				collection.insert( model3, 0 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "insert() should have moved model3 to the beginning" );
				
				collection.insert( [ model2, model1 ], 0 );
				Y.ArrayAssert.itemsAreSame( [ model2, model1, model3 ], collection.getModels(), "insert() should have moved model2 and model1 to the beginning" );
				
				collection.insert( model2, 2 );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model2 ], collection.getModels(), "insert() should have moved model2 to the end" );
				
				
				// Try attempting to move models to out-of-bound indexes (they should be normalized)
				collection.insert( model2, -1000 );
				Y.ArrayAssert.itemsAreSame( [ model2, model1, model3 ], collection.getModels(), "insert() should have moved model2 to the beginning with an out of bounds negative index" );
				
				collection.insert( [ model1, model2 ], 1000 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "insert() should have moved model1 and model2 to the end with an out of bounds positive index" );
			},
			
			
			"insert() should fire the 'reorder' event when reordering models" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				var reorderEventCallCount = 0,
				    reorderedModels = [],      // all of these are
				    reorderedNewIndexes = [],  // arrays, for when we test
				    reorderedOldIndexes = [];  // reordering multiple models at once
				    
				collection.on( 'reorder', function( collection, model, newIndex, oldIndex ) {
					reorderEventCallCount++;
					reorderedModels.push( model );
					reorderedNewIndexes.push( newIndex );
					reorderedOldIndexes.push( oldIndex );
				} );
				
				collection.insert( model3, 0 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "The models should be in the correct new order (this is mostly here to just show which order the collection should now be in)" );
				Y.Assert.areSame( 1, reorderEventCallCount, "The reorder event should have been fired exactly once" );
				Y.ArrayAssert.itemsAreSame( [ model3 ], reorderedModels, "model3 should have been fired with a 'reorder' event (and that is the only reorder event that should have been fired)" );
				Y.ArrayAssert.itemsAreSame( [ 0 ], reorderedNewIndexes, "the new index for model3 should have been reported as index 0" );
				Y.ArrayAssert.itemsAreSame( [ 2 ], reorderedOldIndexes, "the old index for model3 should have been reported as index 2" );
				
				
				// Reset the result variables first
				reorderEventCallCount = 0;
				reorderedModels = [];
				reorderedNewIndexes = [];
				reorderedOldIndexes = [];
				
				collection.insert( [ model1, model2 ], 0 );  // move model1 and model2 back to the beginning
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], collection.getModels(), "The models should be in the correct new order (this is mostly here to just show which order the collection should now be in)" );
				Y.Assert.areSame( 2, reorderEventCallCount, "The reorder event should have been fired exactly twice" );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], reorderedModels, "model1 and model2 should have been fired with a 'reorder' events" );
				Y.ArrayAssert.itemsAreSame( [ 0, 1 ], reorderedNewIndexes, "the new indexes for model1 and model2 should have been reported as index 0, and 1, respectively" );
				Y.ArrayAssert.itemsAreSame( [ 1, 2 ], reorderedOldIndexes, "the old indexes for model1 and model2 should have been reported as index 1, and 2, respectively" );
			},
			
			
			"in a 'reorder' event handler, the new order of the models should be present immediately (getModels should return the models in the new order, inside a handler)" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				var modelsInReorderHandler;
				collection.on( 'reorder', function( collection, model, newIndex, oldIndex ) {
					modelsInReorderHandler = collection.getModels();
				} );
				
				collection.insert( model3, 1 );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model2 ], modelsInReorderHandler );	
				
				collection.insert( model1, 1 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], modelsInReorderHandler );
			},
			
			
			"After a reorder, the Collection should be considered 'modified'" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not yet be considered 'modified'" );
				
				collection.insert( model3, 1 );
				Y.Assert.isTrue( collection.isModified(), "The collection should now be considered modified, since there has been a reorder" );
			},
			
			
			"insert() should *not* reorder models when calling insert() without the `index` argument (which would be the case as well if add() was called)" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				collection.insert( model1 );  // supposed append, but model1 is already in the Collection, and an index was not given
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], collection.getModels(), "The models should be in the original order, as the supposed 'append' should not have happened because the model was already in the collection, and no new index was given" );
			},
			
			
			// -------------------------
			
			// Test converting anonymous configs to Model instances
			
			
			"insert() should transform anonymous data objects to Model instances, based on the 'model' config" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the 'model'
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' },
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( [ modelData1, modelData2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( 'value1', models[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', models[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			"insert() should fire the 'addset' event with instantiated models for any anonymous config objects" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the 'model'
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' };
				
				var addedModels;
				collection.on( 'addset', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ modelData1, modelData2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'addset' event" );
				Y.Assert.areSame( 'value1', addedModels[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', addedModels[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			// -------------------------
			
			// Test sorting functionality with the `sortBy` config
			
			
			"insert() should insert models in the order specified by the sortBy config, if one is provided" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'name' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					sortBy : function( model1, model2 ) {
						var name1 = model1.get( 'name' ),
						    name2 = model2.get( 'name' );
						    
						return ( name1 < name2 ) ? -1 : ( name1 > name2 ) ? 1 : 0;
					}
				} );
				
				
				var model1 = new Model( { name : "A" } ),
				    model2 = new Model( { name : "B" } ),
				    model4 = new Model( { name : "D" } ),  // intentionally model4. Adding model3 later
				    models;
				
				var collection = new Collection();
				collection.insert( [ model2, model4, model1 ] );  // Insert models in incorrect order
				
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model4 ], models, "The models should have been re-ordered based on the 'name' attribute" );
				
				
				// Now create a new model, and see if it gets inserted in the correct position
				var model3 = new Model( { name : "C" } );
				collection.insert( model3 );
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "The models should have been re-ordered based on the 'name' attribute with the new model" );
			},
			
			
			"the sortBy() function should be called in the scope of the Collection" : function() {
				var attributeNameToSortBy = "";
				
				var Model = Kevlar.Model.extend( {
					attributes : [ 'name' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// A method, just to make sure sortBy() is called in the correct scope
					getAttributeNameToSortBy : function() {
						return 'name';
					},
					
					sortBy : function( model1, model2 ) {
						attributeNameToSortBy = this.getAttributeNameToSortBy();  // If sortBy() is not called in the correct scope, this method call will fail
						
						return 0;
					}
				} );
				
				var model1 = new Model( { name : "A" } ),
				    model2 = new Model( { name : "B" } ),
				    model3 = new Model( { name : "C" } );
				    
				var collection = new Collection();
				collection.insert( [ model2, model3, model1 ] );  // Insert models in incorrect order
				
				Y.Assert.areSame( 'name', attributeNameToSortBy, "The attributeNameToSortBy variable should have been set by sortBy() being called in the correct scope, able to access its helper method" );
			},
			
			
			// -------------------------
			
			// Test duplicates functionality
			
			
			"insert() should not allow duplicate models (at this time. config option to come)" : function() {
				var model = new this.Model(),
				    collection = new this.Collection();
				
				collection.insert( [ model, model ] );  // try to add the model twice
				Y.ArrayAssert.itemsAreSame( [ model ], collection.getModels(), "There should only be the one model in the collection at this time" );
			},
			
			
			// -------------------------
			
			// Test adding the "id" change listener
			
			
			"insert() should attach a 'change' listener for changes to the 'idAttribute' of a model, so that its internal modelsById hashmap can be updated if it changes" : function() {
				var onModelIdChangeCallCount = 0,
				    newIdValue, oldIdValue;
				
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// extend onModelIdChange to test if it's being called the correct number of times, and with the correct arguments
					onModelIdChange : function( model, newValue, oldValue ) {
						onModelIdChangeCallCount++;
						newIdValue = newValue;
						oldIdValue = oldValue;
						
						// Now call original method
						this._super( arguments );
					}
				} );
				
				var model = new Model();
				var collection = new Collection( [ model ] );
				
				model.set( 'id', 1 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly once" );
				Y.Assert.areSame( 1, newIdValue, "The newIdValue should be 1" );
				Y.Assert.isUndefined( oldIdValue, "The oldIdValue should be undefined" );
				
				// As a check, make sure that the model can be retrieved by its ID
				Y.Assert.areSame( model, collection.getById( 1 ), "The model should have been able to be retrieved by its ID" );
				
				
				// Now set again, to make sure that the modelsById collection was updated correctly
				model.set( 'id', 2 );
				Y.Assert.areSame( 2, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly twice at this point" );
				Y.Assert.areSame( 2, newIdValue, "The newIdValue should be 2" );
				Y.Assert.areSame( 1, oldIdValue, "The oldIdValue should be 1" );
				
				// As a check, try to access the model by its old ID, and its new one
				Y.Assert.isNull( collection.getById( 1 ), "The model should no longer be retrievable by its old ID" );
				Y.Assert.areSame( model, collection.getById( 2 ), "The model should now be retrievable by its new ID" );
			}
		},
		
		
		
		{
			/*
			 * Test remove()
			 */
			name : "Test remove()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"remove() should be able to remove a single Model from the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } ),
				    model4 = new this.Model( { boolAttr: true, numberAttr: 3, stringAttr: "value3" } );
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.remove( model2 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model2, models, "model2 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model4 ], models, "The remaining 3 models should all exist, and be in the correct order" );
				
				collection.remove( model4 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model4, models, "model4 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3 ], models, "The remaining 2 models should all exist, and be in the correct order" );
				
				collection.remove( model1 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model1, models, "model1 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model3 ], models, "The remaining model should exist" );
				
				collection.remove( model3 );
				models = collection.getModels();
				Y.ArrayAssert.isEmpty( models, "There should be no more models left" );   
			},
			
			
			"remove() should be able to remove an array of Models from the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } ),
				    model4 = new this.Model( { boolAttr: true, numberAttr: 3, stringAttr: "value3" } );
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.remove( [ model2, model4 ] );
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model3 ], models, "Only model1 and model3 should remain" );
			},
			
						
			
			// -------------------------
			
			// Test the 'remove' event
			
			"remove() should fire the 'remove' event for a single model that is removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removeEventCount = 0,
				    removedModel,
				    removedIndex;
				    
				collection.on( 'remove', function( collection, model, index ) {
					removeEventCount++;
					removedModel = model;
					removedIndex = index;
				} );
				
				collection.remove( model2 );
				Y.Assert.areSame( 1, removeEventCount, "The 'remove' event should have been fired exactly once" );
				Y.Assert.areSame( model2, removedModel, "The removed model should have been model2" );
				Y.Assert.areSame( 1, removedIndex, "model2 should have been removed from index 1" );
			},
			
			
			"remove() should fire the 'remove' event once for each of the removed models when multiple models are removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removeEventCount = 0,
				    removedModels = [],
				    removedIndexes = [];
				    
				collection.on( 'remove', function( collection, model, index ) {
					removeEventCount++;
					removedModels.push( model );
					removedIndexes.push( index );
				} );
				
				collection.remove( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, removeEventCount, "The 'remove' event should have been fired exactly twice" );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], removedModels, "model1 and model2 should have been removed" );
				Y.ArrayAssert.itemsAreSame( [ 0, 0 ], removedIndexes, "The indexes for each model's removal should have both been 0, as after the first one is removed (at index 0), model2 is moved to index 0, and then removed itself" );
			},
			
			
			"remove() should *not* fire the 'remove' event if no models are actually removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1 ] );  // only putting model1 on the collection
				
				var removeEventCalled = false;
				collection.on( 'removeset', function( collection, models ) {
					removeEventCalled = true;
				} );
				
				collection.remove( model2 );  // model2 doesn't exist on the Collection
				Y.Assert.isFalse( removeEventCalled, "The 'remove' event should not have been called" );
			},
			
			
			
			// -------------------------
			
			// Test the 'removeset' event
			
			
			"remove() should fire the 'removeset' event with the array of removed models, even if only one model has been removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removedModels;
				collection.on( 'removeset', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.remove( model2 );
				Y.ArrayAssert.itemsAreSame( [ model2 ], removedModels );
			},
			
			
			"remove() should fire the 'removeset' event with the array of removed models when multiple models are removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removedModels;
				collection.on( 'removeset', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.remove( [ model1, model2 ] );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], removedModels );
			},
			
			
			"remove() should *not* fire the 'removeset' event if no models are actually removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1 ] );
				
				var removeEventCallCount = 0;
				collection.on( 'removeset', function( collection, models ) {
					removeEventCallCount++;
				} );
				
				collection.remove( model2 );  // model2 doesn't exist on the Collection
				Y.Assert.areSame( 0, removeEventCallCount );
			},
			
			
			// -------------------------
			
			// Test that the modelsById and modelsByClientId hashmaps are maintained properly
			
			
			"remove() should remove the model from the modelsById hashmap, so it is no longer retrievable by getById" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var model = new Model( { id : 1 } ); 
				var collection = new Kevlar.Collection( [ model ] );
				
				Y.Assert.areSame( model, collection.getById( 1 ), "Initial condition: the model should be available to getById()" );
				
				collection.remove( model );
				Y.Assert.isNull( collection.getById( 1 ), "The model should no longer be retrievable by getById() after removal" );
			},
			
			
			"remove() should remove the model from the modelsByClientId hashmap, so it is no longer retrievable by getById" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model = new Model(),
				    modelClientId = model.getClientId(),
				    collection = new Kevlar.Collection( [ model ] );
				
				Y.Assert.areSame( model, collection.getByClientId( modelClientId ), "Initial condition: the model should be available to getByClientId()" );
				
				collection.remove( model );
				Y.Assert.isNull( collection.getByClientId( modelClientId ), "The model should no longer be retrievable by getByClientId() after removal" );
			},
			
			
			// -------------------------
			
			// Test removing the "id" change listener
			
			
			"remove() should remove the 'change' listener for changes to the 'idAttribute' of a model, so that its internal modelsById hashmap can be updated if it changes" : function() {
				var onModelIdChangeCallCount = 0,
				    newIdValue, oldIdValue;
				
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// extend onModelIdChange to test if it's being called the correct number of times, and with the correct arguments
					onModelIdChange : function( model, newValue, oldValue ) {
						onModelIdChangeCallCount++;
						newIdValue = newValue;
						oldIdValue = oldValue;
						
						// Now call original method
						this._super( arguments );
					}
				} );
				
				var model = new Model();
				var collection = new Collection( [ model ] );
				
				model.set( 'id', 1 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly once" );
				Y.Assert.areSame( 1, newIdValue, "The newIdValue should be 1" );
				Y.Assert.isUndefined( oldIdValue, "The oldIdValue should be undefined" );
				
				// As a check, make sure that the model can be retrieved by its ID
				Y.Assert.areSame( model, collection.getById( 1 ), "The model should have been able to be retrieved by its ID" );
				
				
				// Now remove the model, and make sure that onModelIdChange does *not* get called subsequently
				collection.remove( model );
				
				
				// Now set again, to make sure that the onModelIdChange method does *not* get called
				model.set( 'id', 2 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should *not* have been called again at this point" );
			}
		},
		
		
		
		{
			/*
			 * Test removeAll()
			 */
			name : "Test removeAll()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes  : [ 'id' ],
					idAttribute : 'id'
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"removeAll() should be able to remove all Models from the Collection" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model(),
				    model4 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.removeAll();
				models = collection.getModels();
				Y.ArrayAssert.isEmpty( models, "There should be no models left in the collection" );
			},
			
			
			
			"removeAll() should fire the 'remove' event for each of the removed models" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model(),
				    model4 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] );
				
				var removedModels = [];
				collection.on( 'remove', function( collection, model ) {
					removedModels.push( model );
				} );
				
				collection.removeAll();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], removedModels );
			},
			
			
			"removeAll() should fire the 'removeset' event with the array of removed models when multiple models are removed" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model(),
				    model4 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] );
				
				var removedModels;
				collection.on( 'removeset', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.removeAll();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], removedModels );
			},
			
			
			
			"removeAll() should *not* fire the 'removeset' event if no models are actually removed" : function() {
				var collection = new this.Collection();  // no models
				
				var removeEventCallCount = 0;
				collection.on( 'removeset', function( collection, models ) {
					removeEventCallCount++;
				} );
				
				collection.removeAll();  // model2 doesn't exist on the Collection
				Y.Assert.areSame( 0, removeEventCallCount );
			},
			
			
			"removeAll() should clear the `modelsByClientId` and `modelsById` hashmaps" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getByClientId( model1.getClientId() ), "Initial condition: should be able to retrieve model1 by clientId" );
				Y.Assert.areSame( model1, collection.getById( model1.getId() ), "Initial condition: should be able to retrieve model1 by id" );
				Y.Assert.areSame( model2, collection.getByClientId( model2.getClientId() ), "Initial condition: should be able to retrieve model2 by clientId" );
				Y.Assert.areSame( model2, collection.getById( model2.getId() ), "Initial condition: should be able to retrieve model2 by id" );
				
				collection.removeAll();
				
				Y.Assert.isNull( collection.getByClientId( model1.getClientId() ), "should no longer be able to retrieve model1 by clientId" );
				Y.Assert.isNull( collection.getById( model1.getId() ), "should no longer be able to retrieve model1 by id" );
				Y.Assert.isNull( collection.getByClientId( model2.getClientId() ), "should no longer be able to retrieve model2 by clientId" );
				Y.Assert.isNull( collection.getById( model2.getId() ), "should no longer be able to retrieve model2 by id" );
			}
		},
		
		
		
		
		
		// ------------------------
		
		{
			/*
			 * Test getAt()
			 */
			name : "Test getAt()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"getAt() should return the model at a given index" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getAt( 0 ), "model1 should be at index 0" );
				Y.Assert.areSame( model2, collection.getAt( 1 ), "model2 should be at index 1" );
			},
			
			"getAt() should return null for an index that is out of bounds" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.isNull( collection.getAt( -1 ), "Should be null for a negative index" );
				Y.Assert.isNull( collection.getAt( 2 ), "Should be null for an index greater than the number of models" );
			}
		},
		
		
		
		{
			/*
			 * Test getFirst()
			 */
			name : "Test getFirst()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"getFirst() should retrieve the first Model in the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    collection = new this.Collection( [ model1, model2 ] );
				    
				Y.Assert.areSame( model1, collection.getFirst() );
			},
			
			
			"getFirst() should return null if there are no models in the Collection" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isNull( collection.getFirst() );
			}
			
		},
		
		
		
		{
			/*
			 * Test getLast()
			 */
			name : "Test getLast()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"getLast() should retrieve the first Model in the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    collection = new this.Collection( [ model1, model2 ] );
				    
				Y.Assert.areSame( model2, collection.getLast() );
			},
			
			
			"getLast() should return null if there are no models in the Collection" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isNull( collection.getLast() );
			}			
		},
		
		
		{
			/*
			 * Test getRange()
			 */
			name : "Test getRange()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"getRange() should retrieve all models when no arguments are provided" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models = collection.getRange();
				
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models );
			},
			
			
			"getRange() should retrieve models based on just the startIndex argument, defaulting endIndex to the last model in the Collection" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				models = collection.getRange( 0 );  // attempt to get all models starting at position 0
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "All models should have been retrieved" );
				
				models = collection.getRange( 1 );  // attempt to get all models starting at position 1
				Y.ArrayAssert.itemsAreSame( [ model2, model3 ], models, "The second and third models should have been retrieved" );
				
				models = collection.getRange( 2 );  // attempt to get all models starting at position 2
				Y.ArrayAssert.itemsAreSame( [ model3 ], models, "The third model should have been retrieved" );
				
				// Try an out-of-range startIndex
				models = collection.getRange( 3 );  // attempt to get all models starting at position 3 (out-of-range)
				Y.ArrayAssert.isEmpty( models, "No models should have been retrieved" );
			},
			
			
			"getRange() should retrieve models based on the startIndex and endIndex arguments" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				models = collection.getRange( 0, 0 );
				Y.ArrayAssert.itemsAreSame( [ model1 ], models, "0, 0 args did not work correctly. First model should have been retrieved" );
				
				models = collection.getRange( 0, 1 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], models, "0, 1 args did not work correctly. First and second model should have been retrieved" );
				
				models = collection.getRange( 1, 1 );
				Y.ArrayAssert.itemsAreSame( [ model2 ], models, "1, 1 args did not work correctly. Second model should have been retrieved" );
				
				models = collection.getRange( 1, 2 );
				Y.ArrayAssert.itemsAreSame( [ model2, model3 ], models, "1, 2 args did not work correctly. Second and third models should have been retrieved" );
				
				models = collection.getRange( 0, 2 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "0, 2 args did not work correctly. Second and third models should have been retrieved" );
				
				// Test out-of-range indexes
				models = collection.getRange( -10000, 10000 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "Out of range -10000, 10000 args did not work correctly. All models should have been retrieved" );
			}
		},
		
		
		{
			/*
			 * Test getModels()
			 */		
			name : "Test getModels()",
			
			"getModels() should return the array of models, but in a new array so that the array can be changed" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    model3 = new Model( { attr: 3 } ),
				    collection = new Kevlar.Collection( [ model1, model2, model3 ] );
				
				var modelsArray = collection.getModels();
				
				// Try removing a model from the array, and make sure that it does not affect the Collection
				modelsArray.splice( 0, 1 );
				Y.Assert.areSame( 2, modelsArray.length, "The models array should have been reduced to 2 elements" );
				Y.Assert.areSame( 3, collection.getCount(), "The number of models in the collection should still be 3" );
			}
		},
		
				
		{
			/*
			 * Test getData()
			 */
			name: 'Test getData()',
			
			setUp : function() {
				// Hijack the Kevlar.data.NativeObjectConverter for the tests
				this.origNativeObjectConverter = Kevlar.data.NativeObjectConverter;
				
				var args = this.args = {};
				Kevlar.data.NativeObjectConverter = {
					convert : function() {
						args[ 0 ] = arguments[ 0 ];
						args[ 1 ] = arguments[ 1 ];
					}
				};
			},
			
			tearDown : function() {
				// Restore the NativeObjectConverter after the tests
				Kevlar.data.NativeObjectConverter = this.origNativeObjectConverter;
			},
			
			
			// ---------------------------
			
			
			"getData() should delegate to the singleton NativeObjectConverter to create an Array representation of its data" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var collection = new Collection( [ { attr1: 'value1', attr2: 'value2' } ] );
				
				var optionsObj = { raw: true };
				var result = collection.getData( optionsObj );  // even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( collection, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the collection." );
				Y.Assert.areSame( optionsObj, this.args[ 1 ], "The second arg provided to NativeObjectConverter::convert() should have been the options object" );
			}
		},
		
		
		{
			/*
			 * Test getCount()
			 */
			name : "Test getCount()",
			
			"getCount() should return 0 for a brand new Collection" : function() {
				var collection = new Kevlar.Collection();
				
				Y.Assert.areSame( 0, collection.getCount() );
			},
			
			"getCount() should return the number of models inserted at any given time" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    model3 = new Model( { attr: 3 } ),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, collection.getCount(), "initially, the collection should have 2 models" );
				
				collection.remove( model1 );
				Y.Assert.areSame( 1, collection.getCount(), "After removal of model1, the collection should have 1 model" );
				
				collection.add( [ model1, model3 ] );
				Y.Assert.areSame( 3, collection.getCount(), "After adding model1 and model3, the collection should have 3 models" );
			}
		},
		
		
		{
			/*
			 * Test getByClientId()
			 */
			name : "Test getByClientId()",
			
			
			"getByClientId() should retrieve a model by its clientId" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model1 = new Model(),
				    model2 = new Model();
				
				var collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getByClientId( model1.getClientId() ), "model1 should have been able to be retrieved by its clientId" );
				Y.Assert.areSame( model2, collection.getByClientId( model2.getClientId() ), "model2 should have been able to be retrieved by its clientId" );
			},
			
			
			"getByClientId() should return null if the collection doesn't have the model whose clientId is requested" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model = new Model();
				
				var collection = new Kevlar.Collection();  // note: not adding model
				
				Y.Assert.isNull( collection.getByClientId( model.getClientId() ) );
			}
			
		},
		
		
		{
			/*
			 * Test getById
			 */
			name : "Test getById()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } );
			},
			
			
			"getById() should retrieve a model by its id attribute" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				
				var collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getById( 1 ), "model1 should have been able to be retrieved by its id" );
				Y.Assert.areSame( model2, collection.getById( 2 ), "model2 should have been able to be retrieved by its id" );
			},
			
			
			"getById() should return null for a model id that doesn't exist within its collection" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				
				var collection = new Kevlar.Collection();
				
				Y.Assert.isNull( collection.getById( 1 ), "Test with no models in the collection at all" );
				
				collection.add( model1 );
				Y.Assert.isNull( collection.getById( 2 ), "Test with a model in the collection" );
				
				Y.Assert.areSame( model1, collection.getById( 1 ), "Sanity check, model1 should be able to be retrieved by its id at this point" );
			},
			
			
			"getById() should retreive a model by its id attribute, even if it doesn't yet have an id when it is added to the collection (the id is added later)" : function() {
				var model = new this.Model(),  // no id yet
				    collection = new Kevlar.Collection( [ model ] );  // add the model
				
				// Now change the model's id
				model.set( 'id', 1 );
				
				Y.Assert.areSame( model, collection.getById( 1 ) );
			}
		},
		
		
		
		{
			/*
			 * Test has()
			 */
			name : "Test has()",
			
			"has() should return true if a model has been added to the collection, and false if a model has not been added to the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection();
				
				Y.Assert.isFalse( collection.has( model1 ), "Initial condition: the collection should not have model1" );
				Y.Assert.isFalse( collection.has( model2 ), "Initial condition: the collection should not have model2" );
				
				collection.add( model1 );
				Y.Assert.isTrue( collection.has( model1 ), "The collection should now have model1" );
				
				Y.Assert.isFalse( collection.has( model2 ), "The collection should still not have model2, as it has not been added" );
				
				
				// Now remove model1, and test again
				collection.remove( model1 );
				Y.Assert.isFalse( collection.has( model1 ), "The collection should not have model1 anymore, as it has been removed" );
			}
		},
		
		
		
		{
			/*
			 * Test indexOf()
			 */
			name : "Test indexOf()",
			
			
			"indexOf() should return the index of a model in the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 0, collection.indexOf( model1 ), "model1 should be at index 0" );
				Y.Assert.areSame( 1, collection.indexOf( model2 ), "model2 should be at index 1" );				
			},
			
			
			"indexOf() should return -1 for a model that does not exist within the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection( [ model1 ] );  // not adding model2
				
				Y.Assert.areSame( -1, collection.indexOf( model2 ), "model2 is not in the collection, so indexOf() should return -1" );
			}
		},
		
		
		
		{
			/*
			 * Test indexOfId()
			 */
			name : "Test indexOfId()",
			
			
			"indexOfId() should return the index of a model by its id in the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } ),
				    model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 2 } ),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 0, collection.indexOfId( 1 ), "model1 should be at index 0" );
				Y.Assert.areSame( 1, collection.indexOfId( 2 ), "model2 should be at index 1" );				
			},
			
			
			"indexOfId() should return -1 for a model by its id that does not exist within the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } ),
				    model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 2 } ),
				    collection = new Kevlar.Collection( [ model1 ] );  // not adding model2
				
				Y.Assert.areSame( -1, collection.indexOfId( 2 ), "model2 is not in the collection, so indexOfId() should return -1" );
			}
		},
		
		
		
		// -------------------------------
		
		
		{
			/*
			 * Test isModified
			 */
			name : "Test isModified()",
			
			setUp : function() {
				this.unmodifiedModel1 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( this.unmodifiedModel1 ).getClientId().thenReturn( 1 );
				JsMockito.when( this.unmodifiedModel1 ).isModified().thenReturn( false );
				
				this.unmodifiedModel2 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( this.unmodifiedModel2 ).getClientId().thenReturn( 2 );
				JsMockito.when( this.unmodifiedModel2 ).isModified().thenReturn( false );
				
				this.modifiedModel1 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( this.modifiedModel1 ).getClientId().thenReturn( 3 );
				JsMockito.when( this.modifiedModel1 ).isModified().thenReturn( true );
				
				this.modifiedModel2 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( this.modifiedModel2 ).getClientId().thenReturn( 4 );
				JsMockito.when( this.modifiedModel2 ).isModified().thenReturn( true );
								
				this.Collection = Kevlar.Collection.extend( {} );
			},
			
			
			// ------------------------
			
			// Test with changes to child models
			
			
			"isModified() should return false if no Models within the collection have been modified" : function() {
				var collection = new this.Collection( [ this.unmodifiedModel1 ] );
				
				Y.Assert.isFalse( collection.isModified() );
			},
			
			
			"isModified() should return true if a Model within the collection has been modified" : function() {
				var collection = new this.Collection( [ this.unmodifiedModel1, this.modifiedModel1 ] );
				
				Y.Assert.isTrue( collection.isModified() );
			},
			
			
			// ------------------------
			
			// Test with adds/removes/reorders to the collection
			
			
			"isModified() should return true if a model has been added to the Collection since the last commit/rollback" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				
				collection.add( this.unmodifiedModel1 );
				Y.Assert.isTrue( collection.isModified(), "The collection should now be modified, since a Model was added." );
			},
			
			
			"isModified() should return true if a model has been removed from the Collection since the last commit/rollback" : function() {
				var collection = new this.Collection( [ this.unmodifiedModel1, this.unmodifiedModel2 ] );
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				
				collection.remove( this.unmodifiedModel1 );
				Y.Assert.isTrue( collection.isModified(), "The collection should now be modified, since a Model was removed." );
			},
			
			
			"isModified() should return true if a model has been reordered in the Collection since the last commit/rollback" : function() {
				var collection = new this.Collection( [ this.unmodifiedModel1, this.unmodifiedModel2 ] );
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				
				collection.insert( this.unmodifiedModel1, 1 );  // move unmodifiedmodel1 to the 2nd position
				Y.Assert.isTrue( collection.isModified(), "The collection should now be modified, since a Model was reordered." );
			},
			
			
			// ------------------------
			
			// Test that commit()/rollback() causes isModified() to return false
			
			
			"isModified() should return false when there is a change, but commit()/rollback() has been called" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				
				// Add but then commit()
				collection.add( this.unmodifiedModel1 );
				collection.commit();
				Y.Assert.isFalse( collection.isModified(), "The collection should no longer be considered modified, since a Model was added, and then committed." );
				
				// Add but then rollback()
				collection.add( this.unmodifiedModel2 );
				collection.rollback();
				Y.Assert.isFalse( collection.isModified(), "The collection should no longer be considered modified, since a Model was added, and then rolled back." );
			}
		},
		
		
		// -------------------------------
		
		
		
		/*
		 * Test find()
		 */
		{
			name : "Test find()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"find() should find a Model by attribute and value" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] ),
				    foundModel;
				
				foundModel = collection.find( 'boolAttr', false );
				Y.Assert.areSame( model1, foundModel, "did not find model by boolean false" );
				
				foundModel = collection.find( 'boolAttr', true );
				Y.Assert.areSame( model2, foundModel, "did not find model by boolean true" );
				
				foundModel = collection.find( 'numberAttr', 0 );
				Y.Assert.areSame( model1, foundModel, "did not find model by number 0" );
				
				foundModel = collection.find( 'numberAttr', 1 );
				Y.Assert.areSame( model2, foundModel, "did not find model by number 1" );
				
				foundModel = collection.find( 'stringAttr', "" );
				Y.Assert.areSame( model1, foundModel, "did not find model by empty string" );
				
				foundModel = collection.find( 'stringAttr', "value" );
				Y.Assert.areSame( model2, foundModel, "did not find model by string value" );
				
				// Try finding a model by a value that doesn't exist
				foundModel = collection.find( 'stringAttr', "ooglyBoogly" );
				Y.Assert.isNull( foundModel, "Finding a model by an attribute that doesn't exist should return null" );
			},
			
			
			"find() should start at a given startIndex when provided" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				// Start at index 1 (position 2), which should match model3 instead of model1
				foundModel = collection.find( 'boolAttr', false, { startIndex: 1 } );
				Y.Assert.areSame( model3, foundModel, "The model that was found should have been model3, because it is the only one that matched the criteria past the given startIndex" );
			}
			
		},
		
		
		
		/*
		 * Test findBy()
		 */
		{
			name : "Test findBy()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"findBy should accept a function that when it returns true, it considers the Model the match" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					if( model.get( 'boolAttr' ) === true ) {
						return true;
					}
				} );
				Y.Assert.areSame( model2, foundModel );
			},
			
			
			"findBy should return null when there is no match" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					// Simulate no match with an empty function that never returns `true`
				} );
				Y.Assert.isNull( foundModel );
			},
			
			
			"findBy should start at the given startIndex" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					if( model.get( 'boolAttr' ) === false ) {
						return true;
					}
				}, { startIndex: 1 } );
				Y.Assert.areSame( model3, foundModel );
			}
		}
	]
	
} ) );

/*global jQuery, Ext, Y, Kevlar, tests */
tests.unit.data.add( new Ext.test.TestSuite( {
	name : 'Kevlar.data.NativeObjectConverter',
	
	items : [
	
		/*
		 * Test convert() with a model
		 */
		{
			name : "Test convert() with a model",
			
			"convert() should return a key for each of the Attributes in the Model, whether or not any data has been set to them" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 'attribute1', 'attribute2' ]
				} );
				var model = new Model( { attribute1: 'value1' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model );
				Y.ObjectAssert.hasKey( 'attribute1', data, "The data returned should have attribute1" );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.ObjectAssert.hasKey( 'attribute2', data, "The data returned should have attribute2, even though no value has been set to it" );
				Y.Assert.isUndefined( data.attribute2, "attribute2 should be undefined in the returned data" );
			},
			
			
			"convert() should return the data by running attributes' `get` functions (not just returning the raw data), when the `raw` option is not provided" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 
						'attribute1', 
						{ name: 'attribute2', get: function( valuel ) { return "42 " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
			},
			
			
			// -------------------------------
			
			// Test with `raw` option set to true
			
			"when the `raw` option is provided as true, convert() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 
						'attribute1', 
						{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } },
						{ name: 'attribute3', raw: function( value ) { return value + " " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new Model( { attribute1: 'value1', attribute2: 'value2', attribute3: 'value3' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { raw: true } );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
				Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
			},
			
			
			// -------------------------------
			
			// Test with `persistedOnly` option set to true
			
			"convert() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) with the `persistedOnly` option set to true" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [
						{ name : 'attribute1', persist: true },
						{ name : 'attribute2', persist: false },
						{ name : 'attribute3', persist: true },
						{ name : 'attribute4', persist: false }
					]
				} );
				
				var model = new Model();
				
				var persistedData = Kevlar.data.NativeObjectConverter.convert( model, { persistedOnly: true } );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( persistedData ), "The persisted data should only have 2 properties" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], persistedData, "The persisted data should have 'attribute1' and 'attribute3'" );
			},
			
			
			"convert() should only retrieve the data for the persisted attributes in nested models (i.e. attributes with persist: true) with the `persistedOnly` option set to true" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'id', type: 'string' },
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
				
				var childModel = new ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new ParentModel( {
					id: 1,
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				
				var persistedData = Kevlar.data.NativeObjectConverter.convert( parentModel, { persistedOnly: true } );
				Y.ObjectAssert.ownsKeys( [ 'id', 'child' ], persistedData, "The persisted data for the parent model should have 'id' and 'child' attributes" );
				
				var childAttrs = persistedData.child;
				Y.Assert.areSame( 1, Kevlar.util.Object.length( childAttrs ), "The child data shoud only have 1 property in the data (the persisted one)" );
				Y.ObjectAssert.ownsKeys( [ 'persistedAttr' ], childAttrs, "The child data should only have the 'persistedAttr' attribute" );
			},
			
			
			// -------------------------------
			
			// Test with specific `attributeNames`
			
			"convert() should only process the attributes of a Model that are defined by the 'attributeNames' option (if provided)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [
						{ name : 'attribute1', persist: true },
						{ name : 'attribute2', persist: false },
						{ name : 'attribute3', persist: true },
						{ name : 'attribute4', persist: false }
					]
				} );
				
				var model = new Model();
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { attributeNames: [ 'attribute1', 'attribute3' ] } );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( data ), "The data should only have 2 properties" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], data, "The data should only have 'attribute1' and 'attribute3'" );
			},
			
			
			"Using the 'attributeNames' option should only affect the Model that is provided to convert(), not nested models" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attribute1', 'attribute2' ]
				} );
				
				var model = new Model( {
					attribute1: new Model( {  // nested model
						attribute1: 'innerValue1',
						attribute2: 'innerValue2'
					} ),
					attribute2: 'value2'
				} );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { attributeNames: [ 'attribute1' ] } );
				
				// Check the outer object -- the conversion of `model`
				Y.Assert.areSame( 1, Kevlar.util.Object.length( data ), "The data should only have 1 property" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1' ], data, "attribute1 should exist on the return data" );
				
				// Check the inner object -- the conversion of the nested model
				var innerData = data.attribute1;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( innerData ), "The inner (nested) data should have 2 properties" );
				Y.Assert.areSame( 'innerValue1', innerData.attribute1, "The inner (nested) attribute1 should have the correct value" );
				Y.Assert.areSame( 'innerValue2', innerData.attribute2, "The inner (nested) attribute2 should have the correct value" );
			},
			
			
			// -------------------------------
			
			// Test with nested models that have circular references
			
			"convert() should deep convert nested models, while handing circular references" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 'value', 'relatedModel' ]
				} );
				
				var outerModel = new Model(),
				    innerModel = new Model();
				
				// Set up the outerModel to refer to the innerModel, and the innerModel to refer to the outerModel
				outerModel.set( 'value', 'outerModel-value' );
				outerModel.set( 'relatedModel', innerModel );
				
				innerModel.set( 'value', 'innerModel-value' );
				innerModel.set( 'relatedModel', outerModel );
				
				
				var data = Kevlar.data.NativeObjectConverter.convert( outerModel );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( data ), "The outerModel data should only have 2 properties" );
				
				// Check that references to other models were set up correctly
				Y.Assert.areSame( 'innerModel-value', data.relatedModel.value, "Should be able to access the inner model's value from the outer model." );
				Y.Assert.areSame( 'outerModel-value', data.relatedModel.relatedModel.value, "Should be able to access the outer model's value from the inner model" );
				Y.Assert.areSame( 'innerModel-value', data.relatedModel.relatedModel.relatedModel.value, "Should be able to go around and around, just to make sure we have the circular dependency handled" );
				
				// Make sure that the data object for the outer model, when referenced from the inner model, points back to the `data` 
				// variable that is returned by the convert() method
				Y.Assert.areSame( data, data.relatedModel.relatedModel, "The outer -> inner -> outer should point to the `data` object returned by the convert() method, as that is the model that was converted" ); 
				
				// Make sure that references really do point to the same object
				Y.Assert.areSame( data.relatedModel.relatedModel, data.relatedModel.relatedModel.relatedModel.relatedModel, "The outer -> inner -> outer should point to the outer reference" );
			}
		},
		
		
		/*
		 * Test convert() with a Collection
		 */
		{
			name : "Test convert() with a Collection",
			
			"convert() should convert a Collection of Models into an Array of Objects" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var collection = new Collection( [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ] );
				var data = Kevlar.data.NativeObjectConverter.convert( collection );
				
				Y.Assert.isArray( data, "the data should be an array" );
				Y.Assert.areSame( 2, data.length, "There should be 2 items in the array" );
				Y.Assert.areSame( 1, data[ 0 ].attr1, "The first array item's attr1 should be 1" );
				Y.Assert.areSame( 2, data[ 0 ].attr2, "The first array item's attr2 should be 2" );
				Y.Assert.areSame( 3, data[ 1 ].attr1, "The second array item's attr1 should be 3" );
				Y.Assert.areSame( 4, data[ 1 ].attr2, "The second array item's attr2 should be 4" );
			},
			
			
			
			// -------------------------------
			
			// Test with nested models/collections that have circular references
			
			"convert() should deep convert nested models/collections, while handing circular references" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'nestedCollection' ]
				} );
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model = new Model();
				var collection = new Collection();
				
				// Set up the model to hold the collection, while the collection holds the model
				model.set( 'nestedCollection', collection );
				collection.add( model );
				
				var data = Kevlar.data.NativeObjectConverter.convert( collection );
				
				Y.Assert.isArray( data, "the data should be an array" );
				Y.Assert.areSame( 1, data.length, "There should be 1 item in the array" );
				Y.Assert.isObject( data[ 0 ], "The data's first element should be an object" );
				Y.Assert.isArray( data[ 0 ].nestedCollection, "The data's first element's nestedCollection should be an array" );
				Y.Assert.areSame( data, data[ 0 ].nestedCollection, "The nested collection's array should refer back to the same array created for 'data'" );
				
				// Make sure we can reference through the nested collections
				Y.Assert.areSame( data, data[ 0 ].nestedCollection[ 0 ].nestedCollection[ 0 ].nestedCollection, "Nesty nesty nesty should work" );
			}
		}
	]

} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestCase( {
	name: 'Kevlar.ModelCache',
	
	setUp : function() {
		this.MockModel1 = function() {};
		this.MockModel1.__Kevlar_modelTypeId = 1;
		
		this.MockModel2 = function() {};
		this.MockModel2.__Kevlar_modelTypeId = 2;
		
		// Reset the ModelCache between tests
		Kevlar.ModelCache.models = {};
	},
	
	tearDown : function() {
		// Reset the ModelCache on tearDown as well, so we don't affect other tests
		Kevlar.ModelCache.models = {};
	},
	
	
	// --------------------------------
	
		
	"get() should return a reference to the same model provided to it if not providing an id" : function() {
		var model = new this.MockModel1();
		
		var retrievedModel = Kevlar.ModelCache.get( model );
		Y.Assert.areSame( model, retrievedModel );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed in with the same type (subclass), but not passing in any id's" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1 );
		var retrievedModel2 = Kevlar.ModelCache.get( model2 );
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should return a reference to the first model, when a second one is passed with the same id" : function() {
		var model1 = new this.MockModel1();
		var model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // 1 on both
		
		Y.Assert.areSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same id, but of a different model type (subclass)" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel2();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of 1 on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // but different types of models
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same type (subclass), but with a different id" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same type on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 2 );  // but different id's
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	}
	
	
} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestSuite( {
	name: 'Kevlar.Model',
	
	
	items : [
		{
			/*
			 * Test the onClassExtended static method 
			 */
			name : "Test the onClassExtended static method",
			
								
			"After extending model, the subclass should have a unique __Kevlar_modelTypeId property" : function() {
				var Model = Kevlar.Model.extend( {} );
				
				Y.Assert.isNumber( Model.__Kevlar_modelTypeId, "The Model should now have a static __Kevlar_modelTypeId property that is a number" );
			},
			
			
			// ------------------------
			
			// Test Attributes Inheritance
			
			
			"Attributes should inherit from a Model subclass's superclass when the subclass defines no attributes of its own" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'field1' ]
				} );
				var SubClassModel = Model.extend( {} );
				
				var attributes = (new SubClassModel()).attributes;
				Y.Assert.areSame( 1, Kevlar.util.Object.length( attributes ), "There should be exactly 1 attribute" );
				Y.ObjectAssert.hasKey( 'field1', attributes, "field1 should exist as the attribute" );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass when the subclass does define attributes of its own" : function() {
				// Reference the base class, and create a subclass
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Model.extend( {
					addAttributes : [ 'a', 'b' ]
				} );
				
				var attributes = (new SubClassModel()).attributes;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( attributes ), "There should be exactly 2 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass, and its superclass as well (i.e. more than one level up)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'c', 'd', 'e' ]
				} );
				
				var attributes = (new SubSubClassModel()).attributes;
				Y.Assert.areSame( 5, Kevlar.util.Object.length( attributes ), "There should be exactly 5 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', attributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', attributes, "SubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', attributes, "SubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass, and all of its superclasses (i.e. more than two levels up)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'c', 'd', 'e' ]
				} );
				var SubSubSubClassModel = Kevlar.extend( SubSubClassModel, {
					addAttributes : [ 'f' ]
				} );
				
				var attributes = (new SubSubSubClassModel()).attributes;
				Y.Assert.areSame( 6, Kevlar.util.Object.length( attributes ), "There should be exactly 6 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', attributes, "SubSubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', attributes, "SubSubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', attributes, "SubSubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'f', attributes, "SubSubSubClassModel should have the 'f' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attribute definitions defined in a subclass should take precedence over attribute definitions in a superclass" : function() {
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ { name : 'a', defaultValue: 1 } ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ { name : 'a', defaultValue: 2 }, 'b' ]
				} );
				
				var attributes = (new SubSubClassModel()).attributes;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( attributes ), "There should be exactly 2 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				
				// Check that the default value of the Attribute 'a' is 2, not 1 (as the Attribute in the subclass should have overridden its superclass Attribute)
				Y.Assert.areSame( 2, attributes.a.defaultValue, "The attribute in the subclass should have overridden its superclass" ); 
			},
			
			
			"A subclass that doesn't define any attributes should inherit all of them from its superclass(es)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {} );
				
				var attributes = (new SubSubClassModel()).attributes;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( attributes ), "There should be exactly 2 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			"A superclass that doesn't define any attributes should be skipped for attributes, but the subclass should still inherit from superclasses above it" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {} );  // one that doesn't define any attributes
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'a', 'b' ]
				} );
				
				var attributes = (new SubSubClassModel()).attributes;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( attributes ), "There should be exactly 2 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			// -------------------------------
			
			
			"One should be able to use `attributes` in place of `addAttributes` on the prototype, if they wish" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'a', 'b' ]
				} );
				var SubModel = Model.extend( {
					attributes : [ 'c' ]
				} );
				
				var attributes = (new SubModel()).attributes;
				Y.Assert.areSame( 3, Kevlar.util.Object.length( attributes ), "There should be exactly 3 attributes" );
				Y.ObjectAssert.hasKey( 'a', attributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', attributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', attributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
			}
		},
	
	
	
		{
			/*
			 * Test Initialization (constructor)
			 */
			name: 'Test Initialization (constructor)',
			ttype : 'testsuite',
			
			
			items : [
				{
					/*
					 * Test lazy instantiating a persistenceProxy
					 */
					name : "Test lazy instantiating a persistenceProxy",
					
					_should : {
						error : {
							"Attempting to instantiate a persistenceProxy with no 'type' attribute should throw an error" :
								"Kevlar.persistence.Proxy.create(): No `type` property provided on persistenceProxy config object",
								
							"Attempting to instantiate a persistenceProxy with an invalid 'type' attribute should throw an error" :
								"Kevlar.persistence.Proxy.create(): Unknown Proxy type: 'nonexistentproxy'"
						}
					},
					
					"Attempting to instantiate a persistenceProxy with no 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : {}
						} );
						
						var model = new TestModel();
					},
					
					"Attempting to instantiate a persistenceProxy with an invalid 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'nonExistentProxy'
							}
						} );
						
						var model = new TestModel();
					},
					
					"Providing a valid config object should instantiate the Proxy *on class's the prototype*" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'rest'  // a valid persistenceProxy type
							}
						} );
						
						var model = new TestModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestModel.prototype.persistenceProxy );
					},
					
					"Providing a valid config object should instantiate the Proxy *on the correct subclass's prototype*, shadowing superclasses" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'nonExistentProxy'  // an invalid persistenceProxy type
							}
						} );
						
						var TestSubModel = Kevlar.extend( TestModel, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'rest'  // a valid persistenceProxy type
							}
						} );
						
						var model = new TestSubModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestSubModel.prototype.persistenceProxy );
					}
				},
				
			
				{
					/*
					 * Test change event upon initialization
					 */
					name : "Test change event upon initialization",
					
					setUp : function() {
						this.TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [
								{ name: 'attribute1' },
								{ name: 'attribute2', defaultValue: "attribute2's default" },
								{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
								{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( newValue ) { return newValue + " " + newValue.get( 'attribute2' ); } }
							]
						} );
					},
					
					
					/* This test is no longer valid, as the constructor currently does not allow for a `listeners` config
					"The Model should not fire its 'change' event during the set of the initial data" : function() {
						var changeEventFired = false;
						var model = new this.TestModel( {
							attribute1: "attribute1 value"
						} );
						
						//model.addListener( 'change', function() { changeEventFired = true; } );
						Y.Assert.isFalse( changeEventFired, "The change event should not have fired during the set of the initial data" );
					},
					*/
					
					"The Model should fire its 'change' event when an attribute's data is set externally" : function() {
						var changeEventFired = false;
						var model = new this.TestModel();
						model.addListener( 'change', function() { changeEventFired = true; } );
						
						// Set the value
						model.set( 'attribute1', 'value1' );
						Y.Assert.isTrue( changeEventFired, "The change event should have been fired during the set of the new data" );
					}
				},
			
			
				{
					/*
					 * Test that the initial default values are applied
					 */
					name : "Test that the initial default values are applied",
					
					setUp : function() {
						this.TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [
								{ name: 'attribute1' },
								{ name: 'attribute2', defaultValue: "attribute2's default" },
								{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
								{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
							]
						} );
					},
			
					// Test that default values are applied to attribute values
					
					"A attribute with a defaultValue but no provided data should have its defaultValue when retrieved" : function() {
						var model = new this.TestModel();  // no data provided
						
						Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );
					},
					
					"A attribute with a defaultValue that is a function, but no provided data should have its defaultValue when retrieved" : function() {
						var model = new this.TestModel();  // no data provided
						
						Y.Assert.areSame( "attribute3's default", model.get( 'attribute3' ) );  // attribute3 has a defaultValue that is a function
					},
					
					"A attribute with a defaultValue and also provided data should have its provided data when retrieved" : function() {
						var model = new this.TestModel( {
							attribute2 : "attribute2's data"
						} );
						
						Y.Assert.areSame( "attribute2's data", model.get( 'attribute2' ), "The 'default' specified on the Attribute should *not* have been applied, since it has a value." );
					}
				},
				
				{
					/*
					 * Test initial data
					 */
					name : "Test initial data",
					
					"Providing initial data to the constructor should not leave the model set as 'dirty' (i.e. it should have no 'changes')" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
						} );
						
						var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
						Y.Assert.isFalse( model.isDirty(), "The model should not be dirty upon initialization" );
						Y.Assert.isTrue( Kevlar.util.Object.isEmpty( model.getChanges() ), "There should not be any 'changes' upon initialization" );
					}
				},				
				
				
				{
					/*
					 * Test that initialize() is called
					 */
					name : "Test that initialize() is called",
					
					
					"The initialize() method should be called with the constructor function, for subclass initialization" : function() {
						var initializeCalled = false;
						
						var MyModel = Kevlar.Model.extend( {
							addAttributes : [ 
								'test',
								{ name: 'test2', defaultValue: 'defaultForTest2' }
							],
							initialize : function() {
								initializeCalled = true;
							}
						} );
						
						var model = new MyModel();
						Y.Assert.isTrue( initializeCalled, "The initialize() method should have been called" ); 
					}
				}
			]
		},		
		
		
		
		{
			/*
			 * Test getId()
			 */
			name : "Test getId()",
			
			_should : {
				error : {
					"getId() should throw an error if the default idAttribute 'id' does not exist on the model" : 
						"Error: The `idAttribute` (currently set to an attribute named 'id') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it.",
					"getId() should throw an error with a custom idAttribute that does not relate to an attribute on the model" : 
						"Error: The `idAttribute` (currently set to an attribute named 'myIdAttribute') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it."
				}
			},
			
			"getId() should throw an error if the default idAttribute 'id' does not exist on the model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						// note: no attribute named 'id'
						'field1',
						'field2'
					]
				} );
				
				var model = new Model();
				model.getId();
				
				Y.Assert.fail( "The test should have errored" );
			},
			
			
			"getId() should throw an error with a custom idAttribute that does not relate to an attribute on the model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						'field1',
						'field2'
					],
					
					idAttribute: 'myIdAttribute'
				} );
				
				var model = new Model();
				model.getId();
				
				Y.Assert.fail( "The test should have errored" );
			},
			
			
			"getId() should return the value of the idAttribute" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'myIdAttribute' ],
					idAttribute: 'myIdAttribute'
				} );
				
				var model = new Model( {
					myIdAttribute: 1
				} );
				
				Y.Assert.areSame( 1, model.getId() );
			}
		},
		
		
		{
			/*
			 * Test getIdAttribute()
			 */
			name : "Test getIdAttribute()",
			
			
			"getIdAttribute() should return the Kevlar.attribute.Attribute referenced by the 'idAttribute' config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var model = new Model();
				Y.Assert.isInstanceOf( Kevlar.attribute.Attribute, model.getIdAttribute() );
			},
			
			
			"getIdAttribute() should return null if there is no attribute referenced by the 'idAttribute' config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'ooglyBoogly'
				} );
				
				var model = new Model();
				Y.Assert.isNull( model.getIdAttribute() );
			}
		},
		
		
		{
			/*
			 * Test getIdAttributeName()
			 */
			name : "Test getIdAttributeName()",
			
			
			"getIdAttributeName() should return the value of the 'idAttribute' config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'myBrandyNewIdAttribute'  // doesn't matter if there is no attribute that matches the idAttribute's name (for now...) 
				} );
				
				var model = new Model();
				Y.Assert.areSame( 'myBrandyNewIdAttribute', model.getIdAttributeName() );
			}
		},
		
		
		{
			/*
			 * Test hasIdAttribute()
			 */
			name : "Test hasIdAttribute()",
			
			
			"hasIdAttribute should return false when the idAttribute config does not reference a valid Attribute" : function() {
				var Model = Kevlar.Model.extend( {
					attributes  : [ 'attr' ],  // note: no "id" attribute
					idAttribute : 'id'
				} );
				
				var model = new Model();
				Y.Assert.isFalse( model.hasIdAttribute() );
			},
			
			
			"hasIdAttribute should return truue when the idAttribute config does reference a valid Attribute" : function() {
				var Model = Kevlar.Model.extend( {
					attributes  : [ 'id', 'attr' ],
					idAttribute : 'id'
				} );
				
				var model = new Model();
				Y.Assert.isTrue( model.hasIdAttribute() );
			}
		},
		
		{
			/*
			 * Test set()
			 */
			name: 'Test set()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
				
			
			/*
			 * Utility method to set the given attribute to all data types, including falsy values, and asserts that the operation was successful
			 * (i.e. the attribute returns the same exact value it was set to).
			 * 
			 * @method assertAttributeAcceptsAll
			 * @param {Kevlar.Model} model
			 * @param {String} attributeName
			 */
			assertAttributeAcceptsAll : function( model, attributeName ) {
				model.set( attributeName, undefined );
				Y.Assert.isUndefined( model.get( attributeName ), attributeName + "'s value should have the value set by set() (undefined)." );
				
				model.set( attributeName, null );
				Y.Assert.isNull( model.get( attributeName ), attributeName + "'s value should have the value set by set() (null)." );
				
				model.set( attributeName, true );
				Y.Assert.isTrue( model.get( attributeName ), attributeName + "'s value should have the value set by set() (true)." );
				
				model.set( attributeName, false );
				Y.Assert.isFalse( model.get( attributeName ), attributeName + "'s value should have the value set by set() (false)." );
				
				model.set( attributeName, 0 );
				Y.Assert.areSame( 0, model.get( attributeName ), attributeName + "'s value should have the value set by set() (0)." );
				
				model.set( attributeName, 1 );
				Y.Assert.areSame( 1, model.get( attributeName ), attributeName + "'s value should have the value set by set() (1)." );
				
				model.set( attributeName, "" );
				Y.Assert.areSame( "", model.get( attributeName ), attributeName + "'s value should have the value set by set() ('')." );
				
				model.set( attributeName, "Hello" );
				Y.Assert.areSame( "Hello", model.get( attributeName ), attributeName + "'s value should have the value set by set() ('Hello')." );
				
				model.set( attributeName, {} );
				Y.Assert.isObject( model.get( attributeName ), attributeName + "'s value should have the value set by set() (object)." );
				
				model.set( attributeName, [] );
				Y.Assert.isArray( model.get( attributeName ), attributeName + "'s value should have the value set by set() (array)." );
			},
			
			
			"set() should accept all datatypes including falsy values" : function() {
				var model = new this.TestModel();
				
				this.assertAttributeAcceptsAll( model, 'attribute1' );
			},
			
			"set() should accept all datatypes, and still work even with a default value" : function() {
				// Test with regular values, given a default value
				var model = new this.TestModel();
				
				this.assertAttributeAcceptsAll( model, 'attribute2' );  // attribute2 has a default value
			},
			
			"set() should accept all datatypes, and still work even with a given value" : function() {
				// Test with regular values, given a default value
				var model = new this.TestModel( {
					attribute2 : "initial value"
				} );
				
				this.assertAttributeAcceptsAll( model, 'attribute2' );  // attribute2 has a given value in this test ("initial value")
			},
			
			
			// ------------------------
			
			
			"After the successful set() of an attribute, the Model should be considered 'dirty'" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				var model = new TestModel();
				
				Y.Assert.isFalse( model.isDirty(), "Initially, the model should not be considered 'dirty'" );
				
				model.set( 'attribute1', 'value1' );
				Y.Assert.isTrue( model.isDirty(), "After a set, the model should now be considered 'dirty'" );
			},
			
			
			"After a set() of an attribute to the same value from a clean state, the Model should NOT be considered 'dirty' (as the value didn't change)" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				var model = new TestModel( { attribute1: 'value1' } );  // initial data, model not considered dirty
				
				Y.Assert.isFalse( model.isDirty(), "Initially, the model should not be considered 'dirty'" );
				
				// Set to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.isFalse( model.isDirty(), "After a set to the *same value*, the model should not be considered 'dirty' (as the value didn't change)" );
			},
			
			
			// ------------------------
			
			
			"set() should not re-set an attribute to the same value from the initial value provided to the constructor" : function() {
				var changeCount = 0;
				
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				
				var model = new TestModel( { attribute1: 'value1' } );
				model.addListener( 'change:attribute1', function() { changeCount++; } );
				
				// Set to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 0, changeCount, "The attribute should not have been registered as 'changed' when providing the same value" );
			},
			
			
			"set() should not re-set an attribute to the same value" : function() {
				var changeCount = 0;
				
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				
				var model = new TestModel();
				model.addListener( 'change:attribute1', function() { changeCount++; } );
				
				// Set for the first time
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 1, changeCount, "Initially, the attribute should have been changed exactly once." );
				
				// Set the second time to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 1, changeCount, "The attribute should not have been registered as 'changed' the second time. Should still only have '1 change'." );
			},
			
			
			// ------------------------------
			
			
			// Test set() with Attribute-specific set() functions			
			
			"set() should run the Attribute's set() method on an attribute that has initial data of its own" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( newValue ) { return newValue + " " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				Y.Assert.areSame( "attribute2val attribute1val", model.get( 'attribute2' ), "attribute2 should be the concatenation of its own value, a space, and attribute1" );
			},
			
			
			"set() should convert an attribute with a 'set' function when it is set() again" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( newValue ) { return newValue + " " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				// This call should cause attribute2's set() function to run
				model.set( 'attribute2', "newattribute2value" );
				
				Y.Assert.areSame( "newattribute2value attribute1val", model.get( 'attribute2' ), "attribute2 should be the concatenation of its own value, a space, and attribute2" );
			},
			
			
			"When set() is provided an Object (hashmap) of data to set, the attributes with user-provided 'set' methods should be run after ones with out any (in case they rely on the ones without setters)" : function() {
				var TestModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'attr_with_setter1', set: function( value ) { return this.get( 'attr_without_setter' ) + value; } },
						{ name: 'attr_without_setter' },
						{ name: 'attr_with_setter2', set: function( value ) { return this.get( 'attr_without_setter' ) + value; } }
					]
				} );
				
				var model = new TestModel();
				model.set( {
					attr_with_setter1: 1,
					attr_without_setter: 2,
					attr_with_setter2: 3
				} );
				
				Y.Assert.areSame( 3, model.get( 'attr_with_setter1' ), "The value should have been added from the attr_without_setter" );
				Y.Assert.areSame( 2, model.get( 'attr_without_setter' ), "The value should have been simply provided to attr_without_setter" );
				Y.Assert.areSame( 5, model.get( 'attr_with_setter2' ), "The value should have been added from the attr_without_setter" );
			},
			 
			
			// ------------------------
			
			
			// Test delegation to the Attribute's beforeSet() and afterSet() methods
			
			"set() should delegate to the Attribute's beforeSet() and afterSet() methods to do any pre and post processing needed for the value" : function() {
				var beforeSetValue, 
				    afterSetValue;
				
				var TestAttribute = Kevlar.attribute.Attribute.extend( {
					beforeSet : function( model, newValue, oldValue ) {
						return ( beforeSetValue = newValue + 1 );
					},
					afterSet : function( model, newValue ) {
						return ( afterSetValue = newValue + 20 );
					}
				} );
				
				var TestModel = Kevlar.Model.extend( {
					attributes : [
						new TestAttribute( {
							name : 'attr1',
							
							// A custom 'set' function that should be executed in between the beforeSet() and afterSet() methods
							set : function( value ) {
								return value + 5;
							}
						} )
					]
				} );
				
				var model = new TestModel( { attr1: 0 } );
				
				Y.Assert.areSame( 1, beforeSetValue );
				Y.Assert.areSame( 26, afterSetValue );
			},
			
			
			
			// ------------------------
			
			// Test the 'change' event
			
			"When an attribute is set, a generalized 'change' event should be fired" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    attributeNameChanged,
				    newValue,
				    oldValue;
				    
				model.addListener( 'change', function( model, attributeName, _newValue, _oldValue ) {
					changeEventFired = true;
					attributeNameChanged = attributeName;
					newValue = _newValue;
					oldValue = _oldValue;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change' event was not fired" );
				Y.Assert.areSame( "attribute2", attributeNameChanged, "The attributeName that was changed was not provided to the event correctly." );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
				Y.Assert.isUndefined( oldValue, "The oldValue for attribute2 that was changed was not provided to the event correctly. Should have been undefined, from having no original value" );
			},
			
			
			"When an attribute is set, a 'change:xxx' event should be fired for the changed attribute" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    newValue,
				    oldValue;
				    
				model.addListener( 'change:attribute2', function( model, _newValue, _oldValue ) {
					changeEventFired = true;
					newValue = _newValue;
					oldValue = _oldValue;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change:attribute2' event was not fired" );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
				Y.Assert.isUndefined( oldValue, "The oldValue for attribute2 that was changed was not provided to the event correctly. Should have been undefined, from having no original value" );
			},
			
			
			"When an attribute with a `set()` function of its own is set, the 'change' events should be fired" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ 
							// Attribute with a set() function that returns a new value
							name : 'attribute1',
							set : function( value ) { 
								return value;
							}
						},
						{ 
							// Attribute with a set() function that does not return a new value (presumably modifying some other Attribute in the model),
							// and therefore does not have a new value set to the underlying data
							name : 'attribute2', 
							set : function( value ) {
								// Presumably updating some other Attribute in the model
							}
						} 
					]
				} );
				
				var model = new TestModel(),
				    attribute1ChangeEventCount = 0,
				    attribute1ChangeEventValue,
				    attribute2ChangeEventCount = 0,
				    attribute2ChangeEventValue;
				    
				model.addListener( 'change:attribute1', function( model, value ) {
					attribute1ChangeEventCount++;
					attribute1ChangeEventValue = value;
				} );
				model.addListener( 'change:attribute2', function( model, value ) {
					attribute2ChangeEventCount++;
					attribute2ChangeEventValue = value;
				} );
				
				
				// Test changing the attribute with a set() function that returns a new value
				model.set( 'attribute1', 'attribute1value1' );
				Y.Assert.areSame( 1, attribute1ChangeEventCount, "The attribute1 change event count should now be 1, with the initial value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				Y.Assert.areSame( 'attribute1value1', attribute1ChangeEventValue, "The attribute1 change event value was not correct" );
				
				model.set( 'attribute1', 'attribute1value2' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should now be 2, with a new value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				Y.Assert.areSame( 'attribute1value2', attribute1ChangeEventValue, "The attribute1 change event value was not correct" );
				
				model.set( 'attribute1', 'attribute1value2' );  // setting to the SAME value, to make sure a new 'change' event has not been fired
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, being set to the same value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				
				
				// Test changing the attribute with a set() function that does *not* return a new value (which makes the model not store
				// any new value on its underlying data hash)
				model.set( 'attribute2', 'attribute2value1' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, as no new set has been performed on it" );
				Y.Assert.areSame( 1, attribute2ChangeEventCount, "The attribute2 change event count should now be 1, since a set has been performed on it" );
				Y.Assert.isUndefined( attribute2ChangeEventValue, "The attribute2 change event value should have been undefined, as its set() function does not return anything" );
				
				model.set( 'attribute2', 'attribute2value2' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, as no new set has been performed on it (2nd time)" );
				Y.Assert.areSame( 2, attribute2ChangeEventCount, "The attribute2 change event count should now be 2, since a set has been performed on it" );
				Y.Assert.isUndefined( attribute2ChangeEventValue, "The attribute2 change event value should still be undefined, as its set() function does not return anything" );				
			},
			
			
			"When an attribute with only a `get()` function is set, the 'change' events should be fired with the value from the get function, not the raw value (for both the newValue, and oldValue)" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					attributes: [
						{
							name : 'myAttribute',
							get : function( value ) { return value + 10; } // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel( { myAttribute: 10 } ),
				    changeEventNewValue,
				    changeEventOldValue,
				    attributeSpecificChangeEventNewValue,
				    attributeSpecificChangeEventOldValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue, oldValue ) {
						changeEventNewValue = newValue;
						changeEventOldValue = oldValue;
					},
					'change:myAttribute' : function( model, newValue, oldValue ) {
						attributeSpecificChangeEventNewValue = newValue;
						attributeSpecificChangeEventOldValue = oldValue;
					}
				} );
				
				model.set( 'myAttribute', 42 );  // the `get()` function on the Attribute will add 10 to this value when the attribute is retrieved
				
				Y.Assert.areSame( 52, changeEventNewValue, "The newValue provided with the change event should have come from myAttribute's `get()` function" );
				Y.Assert.areSame( 20, changeEventOldValue, "The oldValue provided with the change event should have come from myAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventNewValue, "The newValue provided with the attribute-specific change event should have come from myAttribute's `get()` function" );
				Y.Assert.areSame( 20, attributeSpecificChangeEventOldValue, "The oldValue provided with the attribute-specific change event should have come from myAttribute's `get()` function" );
			},
			
			
			"When an attribute with both a `set()` function, and `get()` function of its own is set, the 'change' events should be fired with the value from the `get()` function, not the raw value" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						'baseAttribute',
						{
							// Computed Attribute with both a set() function and a get() function, which simply uses 'baseAttribute' for its value
							// (which in practice, would probably be composed of two or more attributes, and possible does calculations as well)
							name : 'computedAttribute',
							set : function( value ) { this.set( 'baseAttribute', value ); },
							get : function( value ) { return this.get( 'baseAttribute' ) + 10; }   // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel( { baseAttribute: 10 } ),
				    changeEventNewValue,
				    changeEventOldValue,
				    attributeSpecificChangeEventNewValue,
				    attributeSpecificChangeEventOldValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue, oldValue ) {
						changeEventNewValue = newValue;
						changeEventOldValue = oldValue;
					},
					'change:computedAttribute' : function( model, newValue, oldValue ) {
						attributeSpecificChangeEventNewValue = newValue;
						attributeSpecificChangeEventOldValue = oldValue;
					}
				} );
				
				model.set( 'computedAttribute', 42 );  // the `get()` function will add 10 to this value when the attribute is retrieved
								
				
				Y.Assert.areSame( 52, changeEventNewValue, "The newValue provided with the change event should have come from computedAttribute's `get()` function" );
				Y.Assert.areSame( 20, changeEventOldValue, "The oldValue provided with the change event should have come from computedAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventNewValue, "The newValue provided with the attribute-specific change event should have come from computedAttribute's `get()` function" );
				Y.Assert.areSame( 20, attributeSpecificChangeEventOldValue, "The oldValue provided with the attribute-specific change event should have come from computedAttribute's `get()` function" );
			},
			
			
			// ------------------------
			
			// Test the 'changeset' event
			
			"When multiple attributes are set, a generalized 'changeset' event should be fired exactly once" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						'a',
						'b',
						'c',
						'unModifiedAttr'
					]
				} );
				var model = new TestModel( { 'a': 1, 'b': 2, 'c': 3 } ),
				    changeSetEventCount = 0,
				    changeSetNewValues,
				    changeSetOldValues;
				
				// Check the initial 'a', 'b', and 'c' values
				Y.Assert.areSame( 1, model.get( 'a' ), "initial value for a" );
				Y.Assert.areSame( 2, model.get( 'b' ), "initial value for b" );
				Y.Assert.areSame( 3, model.get( 'c' ), "initial value for c" );
				    
				model.addListener( 'changeset', function( model, newValues, oldValues ) {
					changeSetEventCount++;
					changeSetNewValues = newValues;
					changeSetOldValues = oldValues;
				} );
				
				// Modify attr1, attr2, and attr3
				model.set( { 'a': 11, 'b': 22, 'c': 33 } );
				Y.Assert.areSame( 1, changeSetEventCount, "The 'changeset' event should have been fired exactly once" );
				
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 3 properties" );
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 3 properties" );
				
				Y.Assert.areSame( 11, changeSetNewValues.a, "newValue for 'a'" );
				Y.Assert.areSame( 22, changeSetNewValues.b, "newValue for 'b'" );
				Y.Assert.areSame( 33, changeSetNewValues.c, "newValue for 'c'" );
				
				Y.Assert.areSame( 1, changeSetOldValues.a, "oldValue for 'a'" );
				Y.Assert.areSame( 2, changeSetOldValues.b, "oldValue for 'b'" );
				Y.Assert.areSame( 3, changeSetOldValues.c, "oldValue for 'c'" );
			},
			
			
			"When a computed attribute changes other attributes, the generalized 'changeset' event should still be only fired exactly once" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ 
							name : 'a', 
							set : function( value ) {
								this.set( 'b', value + 1 );
								this.set( 'c', value + 2 );
								return value;
							}
						}, 
						{ name : 'b' },
						{ name : 'c' },
						{ name : 'unModifiedAttr' }
					]
				} );
				var model = new TestModel( { 'a': 1 } ),  // setting 'a' will set 'b' and 'c'
				    changeSetEventCount = 0,
				    changeSetNewValues,
				    changeSetOldValues;
				
				// Check the initial 'a', 'b', and 'c' values
				Y.Assert.areSame( 1, model.get( 'a' ), "initial value for a" );
				Y.Assert.areSame( 2, model.get( 'b' ), "initial value for b. Should be set by the 'a' attribute's setter" );
				Y.Assert.areSame( 3, model.get( 'c' ), "initial value for c. Should be set by the 'a' attribute's setter" );
				
				model.addListener( 'changeset', function( model, newValues, oldValues ) {
					changeSetEventCount++;
					changeSetNewValues = newValues;
					changeSetOldValues = oldValues;
				} );
				
				model.set( 'a', 11 );
				Y.Assert.areSame( 1, changeSetEventCount, "The 'changeset' event should have been fired exactly once" );
				
				// Double check the 'a', 'b', and 'c' attributes have been changed
				Y.Assert.areSame( 11, model.get( 'a' ) );
				Y.Assert.areSame( 12, model.get( 'b' ) );
				Y.Assert.areSame( 13, model.get( 'c' ) );
				
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 3 properties" );
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 3 properties" );
				
				Y.Assert.areSame( 11, changeSetNewValues.a, "newValue for 'a'" );
				Y.Assert.areSame( 12, changeSetNewValues.b, "newValue for 'b'" );
				Y.Assert.areSame( 13, changeSetNewValues.c, "newValue for 'c'" );
				
				Y.Assert.areSame( 1, changeSetOldValues.a, "oldValue for 'a'" );
				Y.Assert.areSame( 2, changeSetOldValues.b, "oldValue for 'b'" );
				Y.Assert.areSame( 3, changeSetOldValues.c, "oldValue for 'c'" );
			},
			
			
			"When an attribute changes, and a handler of the change ends up setting other attributes, the generalized 'changeset' event should still be only fired exactly once" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ name : 'a' }, 
						{ name : 'b' },
						{ name : 'c' },
						{ name : 'unModifiedAttr' }
					]
				} );
				var model = new TestModel( { 'a': 1, 'b': 2, 'c': 3 } ),
				    changeSetEventCount = 0,
				    changeSetNewValues,
				    changeSetOldValues;
				
				// Check the initial 'a', 'b', and 'c' values
				Y.Assert.areSame( 1, model.get( 'a' ), "initial value for a" );
				Y.Assert.areSame( 2, model.get( 'b' ), "initial value for b" );
				Y.Assert.areSame( 3, model.get( 'c' ), "initial value for c" );
				
				// Add a 'change' listener which sets other attributes on the model
				model.addListener( 'change:a', function( model, newValue, oldValue ) {
					model.set( 'b', 22 );
					model.set( 'c', 33 );
				} );
				
				// Now add the 'changeset' listener for the results of the test
				model.addListener( 'changeset', function( model, newValues, oldValues ) {
					changeSetEventCount++;
					changeSetNewValues = newValues;
					changeSetOldValues = oldValues;
				} );
				
				model.set( 'a', 11 );
				Y.Assert.areSame( 1, changeSetEventCount, "The 'changeset' event should have been fired exactly once" );
				
				// Double check the 'a', 'b', and 'c' attributes have been changed
				Y.Assert.areSame( 11, model.get( 'a' ) );
				Y.Assert.areSame( 22, model.get( 'b' ) );
				Y.Assert.areSame( 33, model.get( 'c' ) );
				
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 3 properties" );
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 3 properties" );
				
				Y.Assert.areSame( 11, changeSetNewValues.a, "newValue for 'a'" );
				Y.Assert.areSame( 22, changeSetNewValues.b, "newValue for 'b'" );
				Y.Assert.areSame( 33, changeSetNewValues.c, "newValue for 'c'" );
				
				Y.Assert.areSame( 1, changeSetOldValues.a, "oldValue for 'a'" );
				Y.Assert.areSame( 2, changeSetOldValues.b, "oldValue for 'b'" );
				Y.Assert.areSame( 3, changeSetOldValues.c, "oldValue for 'c'" );
			},
			
			
			"When an attribute is changed multiple times within a single 'changeset', its oldValue value should have its *original* value (not any intermediate values)" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ name : 'a' }
					]
				} );
				var model = new TestModel( { 'a': 1 } ),
				    changeSetEventCount = 0,
				    changeSetNewValues,
				    changeSetOldValues;
				
				// Check the initial 'a' value
				Y.Assert.areSame( 1, model.get( 'a' ), "initial value for a" );
				
				// Add a 'change' listener which sets other attributes on the model
				// Note that this event handler only happens once, so it doesn't get recursively called from the extra sets to 'a'
				model.addListener( 'change:a', function( model, newValue, oldValue ) {
					model.set( 'a', 3 );
					model.set( 'a', 4 );
				}, this, { single: true } );
				
				// Now add the 'changeset' listener for the results of the test
				model.addListener( 'changeset', function( model, newValues, oldValues ) {
					changeSetEventCount++;
					changeSetNewValues = newValues;
					changeSetOldValues = oldValues;
				} );
				
				model.set( 'a', 2 );  // will eventually result in 'a' getting set to 4
				Y.Assert.areSame( 1, changeSetEventCount, "The 'changeset' event should have been fired exactly once" );
				
				// Double check the 'a' attribute has been changed to the last set value
				Y.Assert.areSame( 4, model.get( 'a' ) );
				
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 1 property" );
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 1 property" );
				
				Y.Assert.areSame( 4, changeSetNewValues.a, "newValue for 'a'" );
				Y.Assert.areSame( 1, changeSetOldValues.a, "oldValue for 'a'" );
			},
			
			
			"multiple 'changeset' events should work correctly, providing the correct newValues and oldValues each time" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ name : 'a' }, 
						{ name : 'b' },
						{ name : 'c' },
						{ name : 'unModifiedAttr' }
					]
				} );
				var model = new TestModel( { 'a': 1, 'b': 2, 'c': 3 } ),
				    changeSetEventCount = 0,
				    changeSetNewValues,
				    changeSetOldValues;
				
				// Check the initial 'a', 'b', and 'c' values
				Y.Assert.areSame( 1, model.get( 'a' ), "initial value for a" );
				Y.Assert.areSame( 2, model.get( 'b' ), "initial value for b" );
				Y.Assert.areSame( 3, model.get( 'c' ), "initial value for c" );
				
				// Now add the 'changeset' listener for the results of the test
				model.addListener( 'changeset', function( model, newValues, oldValues ) {
					changeSetEventCount++;
					changeSetNewValues = newValues;
					changeSetOldValues = oldValues;
				} );
				
				model.set( { 'a': 11, 'b': 22, 'c': 33 } );
				Y.Assert.areSame( 1, changeSetEventCount, "The 'changeset' event should have been fired exactly once" );
				
				// Double check the 'a', 'b', and 'c' attributes have been changed
				Y.Assert.areSame( 11, model.get( 'a' ) );
				Y.Assert.areSame( 22, model.get( 'b' ) );
				Y.Assert.areSame( 33, model.get( 'c' ) );
				
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 3 properties" );
				Y.Assert.areSame( 3, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 3 properties" );
				
				Y.Assert.areSame( 11, changeSetNewValues.a, "newValue for 'a'" );
				Y.Assert.areSame( 22, changeSetNewValues.b, "newValue for 'b'" );
				Y.Assert.areSame( 33, changeSetNewValues.c, "newValue for 'c'" );
				
				Y.Assert.areSame( 1, changeSetOldValues.a, "oldValue for 'a'" );
				Y.Assert.areSame( 2, changeSetOldValues.b, "oldValue for 'b'" );
				Y.Assert.areSame( 3, changeSetOldValues.c, "oldValue for 'c'" );
				
				
				// Now just change 'b' and 'c' manually
				model.set( { 'b': 222, 'c': 333 } );
				Y.Assert.areSame( 2, changeSetEventCount, "The 'changeset' event should have been fired exactly twice at this point (one more than the last test)" );
				
				// Double check the 'b', and 'c' attributes have been changed (and that 'a' hasn't)
				Y.Assert.areSame( 11, model.get( 'a' ) );
				Y.Assert.areSame( 222, model.get( 'b' ) );
				Y.Assert.areSame( 333, model.get( 'c' ) );
				
				Y.Assert.areSame( 2, Kevlar.util.Object.length( changeSetNewValues ), "The changeset's newValues should have exactly 2 properties" );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( changeSetOldValues ), "The changeset's oldValues should have exactly 2 properties" );
				
				Y.Assert.areSame( 222, changeSetNewValues.b, "newValue for 'b'" );
				Y.Assert.areSame( 333, changeSetNewValues.c, "newValue for 'c'" );
				
				Y.Assert.areSame( 22, changeSetOldValues.b, "oldValue for 'b'" );
				Y.Assert.areSame( 33, changeSetOldValues.c, "oldValue for 'c'" );
			},
			
			
			// ------------------------
			
			
			// Test Backbone Collection compatibility
			
			"for compatibility with Backbone's Collection, set() should set the id property to the Model object itself with the idAttribute is changed" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( value ) { return value + " " + this.get( 'attribute1' ); } }
					],
					idAttribute: 'attribute1'
				} );
				
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				Y.Assert.areSame( 'attribute1val', model.id, "The model's `id` property should have been set to attribute1's value, as that is the idAttribute." );
				
				model.set( 'attribute1', 'newValue' );
				Y.Assert.areSame( 'newValue', model.id, "The model's `id` property should have been set to attribute1's value after another set(), as that is the idAttribute." );
			}
		},
		
		
		
		{
			/*
			 * Test get()
			 */
			name: 'Test get()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', get : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			"running get() on an attribute with no initial value and no default value should return undefined" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.get( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running get() on an attribute with an initial value and no default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute1 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.get( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running get() on an attribute with no initial value but does have a default value should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running get() on an attribute with an initial value and a default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute2 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.get( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running get() on an attribute with no initial value but does have a default value which is a function should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute3's default", model.get( 'attribute3' ) );  // attribute3 has a defaultValue that is a function
			},
			
			"running get() on an attribute with a `get` function defined should return the value that the `get` function returns" : function() {
				var model = new this.TestModel( { attribute1: 'value1' } );
				Y.Assert.areSame( "value1 attribute2's default", model.get( 'attribute5' ) );
			}
		},
		
		
		{
			/*
			 * Test raw()
			 */
			name: 'Test raw()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ 
							name: 'attribute3', 
							get : function( newValue ) { 
								return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); 
							} 
						},
						{ 
							name: 'attribute4', 
							raw : function( newValue ) { 
								return newValue + " " + this.get( 'attribute1' );
							} 
						}
					]
				} );
			},
			
			
			"running raw() on an attribute with no initial value and no default value should return undefined" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.raw( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running raw() on an attribute with an initial value and no default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute1 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.raw( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running raw() on an attribute with no initial value but does have a default value should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.raw( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running raw() on an attribute with a `get` function defined should return the *underlying* value, not the value that the `get` function returns" : function() {
				var model = new this.TestModel( { attribute3: 'value1' } );
				Y.Assert.areSame( "value1", model.raw( 'attribute3' ) );
			},
			
			"running raw() on an attribute with a `raw` function defined should return the value that the `raw` function returns" : function() {
				var model = new this.TestModel( { 
					attribute1: 'value1',
					attribute4: 'value4'
				} );
				Y.Assert.areSame( "value4 value1", model.raw( 'attribute4' ) );
			}
		},
		
		
		{
			/*
			 * Test getDefault()
			 */
			name: 'Test getDefault()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			// Test that the default values of attributes can be retrieved
			
			"A attribute with no defaultValue should return undefined when trying to retrieve its default value" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.getDefault( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"A defaultValue should be able to be retrieved directly when the attribute has one" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.getDefault( 'attribute2' ) );  // attribute2 has a defaultValue of a string
			},
			
			"A defaultValue should be able to be retrieved directly when the defaultValue is a function that returns its default" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute3's default", model.getDefault( 'attribute3' ) );  // attribute2 has a defaultValue that is a function that returns a string
			}
		},	
			
		
		
		// ------------------------
		
		
		{
			/*
			 * Test onEmbeddedDataComponentChange()
			 */
			name : "Test onEmbeddedDataComponentChange()",
			
			"onEmbeddedDataComponentChange() should " : function() {
				
			}
		},
		
		
		
		
		// ------------------------
		
		
		
		
		
		{
			/*
			 * Test isDirty()
			 */
			name: 'Test isDirty()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			
			"isDirty() should return false after instantiating a Model with no data" : function() {
				var model = new this.TestModel();
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return false after instantiating a Model with initial data" : function() {
				var model = new this.TestModel( { attribute1: 1, attribute2: 2 } );
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return true after setting an attribute's data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				Y.Assert.isTrue( model.isDirty() );
			},
			
			"isDirty() should return false after setting an attribute's data, and then rolling back the data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				model.rollback();
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return false after setting an attribute's data, and then committing the data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				model.commit();
				Y.Assert.isFalse( model.isDirty() );
			}
		},
		
		
		
		{
			/*
			 * Test isModified()
			 */
			name: 'Test isModified()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
				
				this.ConcreteDataComponentAttribute = Kevlar.attribute.DataComponentAttribute.extend( {} );
				
				this.ConcreteDataComponent = Kevlar.DataComponent.extend( {
					// Implementation of abstract interface
					getData : Kevlar.emptyFn,
					isModified : Kevlar.emptyFn,
					commit : Kevlar.emptyFn,
					rollback : Kevlar.emptyFn
				} );
			},
			
			// -------------------------------------
			
			// Test checking the model as a whole
			
			"isModified should return false if there are no changes on the model" : function() {
				var model = new this.TestModel();
				
				Y.Assert.isFalse( model.isModified() );
			},
			
			
			"isModified should return true if there is at least one change on the model" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 'newValue1' );
				
				Y.Assert.isTrue( model.isModified() );
			},
			
			
			"isModified should return true if there are multiple changes on the model" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 'newValue1' );
				model.set( 'attribute2', 'newValue2' );
				
				Y.Assert.isTrue( model.isModified() );
			},
			
			
			// -------------------------------------
			
			// Test checking particular attributes
			
			"isModified() should return false for particular attributes that have not been changed, even if there are other changes" : function() {
				var model = new this.TestModel();
				model.set( 'attribute3', 'testing123' );
				
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1, with no defaultValue, should not be modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2, with a defaultValue, should not be modified" );
			},
			
			
			"isModified() should return true for particular attributes that have been changed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified" );
				Y.Assert.isTrue( model.isModified( 'attribute2' ), "attribute2 should be marked as modified" );
			},
			
			
			"isModified() should return false for particular attributes that have been changed, but then committed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been committed, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been committed, and therefore not marked as modified" );
			},
			
			
			"isModified() should return false for particular attributes that have been changed, but then rolled back" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.rollback();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been rolled back, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been rolled back, and therefore not marked as modified" );
			},
			
			
			// -------------------------
			
			// Test with embedded models/collections
			
			"In the case of embedded DataComponents, the parent model should be considered 'modified' when a child embedded DataComponent has changes" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						new this.ConcreteDataComponentAttribute( { name: 'child', embedded: true } )
					]
				} );
				
				var childDataComponent = JsMockito.mock( this.ConcreteDataComponent );
				JsMockito.when( childDataComponent ).isModified().thenReturn( true );
				
				var parentModel = new ParentModel( {
					child: childDataComponent
				} );
				
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while its child model is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'child' ), "The 'child' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child model has changes, but is not 'embedded'" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						new this.ConcreteDataComponentAttribute( { name: 'child', embedded: false } )  // note: NOT embedded
					]
				} );
				
				var childDataComponent = JsMockito.mock( this.ConcreteDataComponent );
				JsMockito.when( childDataComponent ).isModified().thenReturn( true );
				
				var parentModel = new ParentModel( {
					child: childDataComponent
				} );
				
				Y.Assert.isFalse( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child model is 'modified', because the child is not 'embedded'" );
			},
			
			
			
			// -------------------------
			
			// Test with the 'persistedOnly' option set to true
			
			"If the persistedOnly option is provided as true, isModified() should return true only if a persisted attribute is modified" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
				
				var model = new Model();
				
				Y.Assert.isFalse( model.isModified(), "Initial condition: the model should not be considered modified" );
				
				model.set( 'unpersistedAttr', 'value1' );
				Y.Assert.isTrue( model.isModified(), "The model should be considered 'modified' in general" );
				Y.Assert.isFalse( model.isModified( { persistedOnly: true } ), "The model only has unpersisted attributes modified, so this call should return false" );
				
				model.set( 'persistedAttr', 'value1' );
				Y.Assert.isTrue( model.isModified(), "The model should still be considered 'modified' in general" );
				Y.Assert.isTrue( model.isModified( { persistedOnly: true } ), "The model now has a persisted attribute that is modified. This should return true." );
			},
			
			
			"If the persistedOnly option is provided as true and a specific attribute name is given, isModified() should return true only if the attribute is both modified, and persisted" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
				
				var model = new Model();
				
				Y.Assert.isFalse( model.isModified( 'persistedAttr' ), "Initial condition: the 'persistedAttr' should not be considered modified" );
				Y.Assert.isFalse( model.isModified( 'unpersistedAttr' ), "Initial condition: the 'unpersistedAttr' should not be considered modified" );
				
				model.set( 'unpersistedAttr', 'value1' );
				Y.Assert.isTrue( model.isModified( 'unpersistedAttr' ), "The 'unpersistedAttr' should be considered 'modified' in general" );
				Y.Assert.isFalse( model.isModified( 'unpersistedAttr', { persistedOnly: true } ), "The 'unpersistedAttr' is not persisted, so this call should return false, even though it has been changed" );
				
				model.set( 'persistedAttr', 'value1' );
				Y.Assert.isTrue( model.isModified( 'persistedAttr' ), "The 'persistedAttr' should still be considered 'modified' in general" );
				Y.Assert.isTrue( model.isModified( 'persistedAttr', { persistedOnly: true } ), "The 'persistedAttr' is both modified, and persisted. This should return true." );
			}
			
		},
		
		
		{
			/*
			 * Test getData()
			 */
			name: 'Test getData()',
			
			setUp : function() {
				// Hijack the Kevlar.data.NativeObjectConverter for the tests
				this.origNativeObjectConverter = Kevlar.data.NativeObjectConverter;
				
				var args = this.args = {};
				Kevlar.data.NativeObjectConverter = {
					convert : function() {
						args[ 0 ] = arguments[ 0 ];
						args[ 1 ] = arguments[ 1 ];
					}
				};
			},
			
			tearDown : function() {
				// Restore the NativeObjectConverter after the tests
				Kevlar.data.NativeObjectConverter = this.origNativeObjectConverter;
			},
			
			
			// ---------------------------
			
			
			"getData() should delegate to the singleton NativeObjectConverter to create an Object representation of its data" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2' ]
				} );
				
				var model = new Model( {
					attr1: 'value1',
					attr2: 'value2'
				} );
				
				var optionsObj = { raw: true };
				var result = model.getData( optionsObj );  // even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( model, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the model." );
				Y.Assert.areSame( optionsObj, this.args[ 1 ], "The second arg provided to NativeObjectConverter::convert() should have been the options object" );
			}
		},
		
		
		{
			/*
			 * Test getChanges()
			 */
			name: 'Test getChanges()',
			
			setUp : function() {
				// Hijack the Kevlar.data.NativeObjectConverter for the tests
				this.origNativeObjectConverter = Kevlar.data.NativeObjectConverter;
				
				var args = this.args = {};
				Kevlar.data.NativeObjectConverter = {
					convert : function() {
						args[ 0 ] = arguments[ 0 ];
						args[ 1 ] = arguments[ 1 ];
					}
				};
				
				
				this.ConcreteDataComponentAttribute = Kevlar.attribute.DataComponentAttribute.extend( {} );
				this.ConcreteDataComponent = Kevlar.DataComponent.extend( { 
					// Implementation of abstract interface
					getData : Kevlar.emptyFn,
					isModified : Kevlar.emptyFn,
					commit : Kevlar.emptyFn,
					rollback : Kevlar.emptyFn
				} );
			},
			
			tearDown : function() {
				// Restore the NativeObjectConverter after the tests
				Kevlar.data.NativeObjectConverter = this.origNativeObjectConverter;
			},
			
			
			// ---------------------------
			
			
			"getChanges() should delegate to the singleton NativeObjectConverter to create an Object representation of its data, but only provide changed attributes for the attributes that should be returned" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 
						'attr1', 
						'attr2', 
						'attr3',
						new this.ConcreteDataComponentAttribute( { name: 'nestedDataComponent', embedded: false } ),  // this one NOT embedded
						new this.ConcreteDataComponentAttribute( { name: 'embeddedDataComponent', embedded: true } )  // this one IS embedded
					]
				} );
				
				
				var mockDataComponent = JsMockito.mock( this.ConcreteDataComponent );
				JsMockito.when( mockDataComponent ).isModified().thenReturn( true );
				
				var model = new Model( {
					attr1: 'value1',
					attr2: 'value2',
					attr3: 'value3',
					nestedDataComponent : mockDataComponent,
					embeddedDataComponent : mockDataComponent
				} );
				model.set( 'attr1', 'newValue1' );
				model.set( 'attr2', 'newValue2' );
				// Note: the mockDataComponent is always going to return true for its isModified() method, so no need to "change" it
				
				// even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				var result = model.getChanges( { raw: true } );  // add an extra option to make sure it goes through
				
				var optionsProvidedToConvert = this.args[ 1 ];  // defined in the setUp method
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( model, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the model." );
				Y.Assert.areSame( true, optionsProvidedToConvert.raw, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'raw:true' option" );
				Y.ArrayAssert.itemsAreSame( [ 'attr1', 'attr2', 'embeddedDataComponent' ], optionsProvidedToConvert.attributeNames, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'attributeNames' option, with the attributes that were changed" );
			}
		},
		
		
		{
			/*
			 * Test commit()
			 */
			name: 'Test commit()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
				
				
				this.ConcreteDataComponent = Kevlar.DataComponent.extend( { 
					// Implementation of abstract interface
					getData : Kevlar.emptyFn,
					isModified : Kevlar.emptyFn,
					commit : Kevlar.emptyFn,
					rollback : Kevlar.emptyFn
				} );
			},
				
			
			"committing changed data should cause the 'dirty' flag to be reset to false, and getChanges() to return an empty object" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				var changes = model.getChanges();
				Y.Assert.areSame( 0, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 0 properties" );
				
				Y.Assert.isFalse( model.isDirty(), "The model should no longer be marked as 'dirty'" );
			},
			
			
			"committing changed data should cause rollback() to have no effect" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				// Attempt a rollback, even though the data was committed. Should have no effect.
				model.rollback();
				Y.Assert.areSame( "new value 1", model.get( 'attribute1' ), "attribute1 should have been 'new value 1'. rollback() should not have had any effect." );
				Y.Assert.areSame( "new value 2", model.get( 'attribute2' ), "attribute2 should have been 'new value 2'. rollback() should not have had any effect." );
			},
			
			
			"committing changed data should fire the 'commit' event" : function() {
				var commitEventCount = 0;
				var model = new this.TestModel();
				model.addListener( 'commit', function() {
					commitEventCount++;
				} );
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				Y.Assert.areSame( 1, commitEventCount, "The 'commit' event should have been fired exactly once after committing." );
			},
			
			
			// --------------------
			
			// Test with embedded DataComponents (Models and Collections)
			
			"committing a parent model should also commit any embedded child DataComponent that the model holds" : function() {
				// A concrete subclass for testing
				var ConcreteDataComponentAttribute = Kevlar.attribute.DataComponentAttribute.extend( {
					// Implementation of abstract interface
					getData : Kevlar.emptyFn,
					isModified : Kevlar.emptyFn,
					commit : Kevlar.emptyFn,
					rollback : Kevlar.emptyFn
				} );
				
				var Model = Kevlar.Model.extend( {
					attributes : [ new ConcreteDataComponentAttribute( { name: 'childDataComponent', embedded: true } ) ]
				} );
				
				var mockDataComponent = JsMockito.mock( this.ConcreteDataComponent );
				var model = new Model();
				
				model.set( 'childDataComponent', mockDataComponent );
				model.commit();
				
				try {
					JsMockito.verify( mockDataComponent ).commit();  // verify that this was called at least once
				} catch( ex ) {
					Y.Assert.fail( ex );  // those newbs throw strings for errors...
				}
			}
			
		},
		
		
		
		{
			/*
			 * Test rollback()
			 */
			name: 'Test rollback()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
				
				
			"rollback() should revert the model's values back to default values if before any committed set() calls" : function() {
				// No initial data. 
				// attribute1 should be undefined
				// attribute2 should have the string "attribute2's default"
				var model = new this.TestModel();
				
				// Set, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values
				Y.Assert.isUndefined( model.get( 'attribute1' ) );
				Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should revert the model's values back to their pre-set() values" : function() {
				var model = new this.TestModel( {
					attribute1 : "original attribute1",
					attribute2 : "original attribute2"
				} );
				
				// Set, check the 'dirty' flag, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values
				Y.Assert.areSame( "original attribute1", model.get( 'attribute1' ) );
				Y.Assert.areSame( "original attribute2", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should revert the model's values back to their pre-set() values, when more than one set() call is made" : function() {
				var model = new this.TestModel( {
					attribute1 : "original attribute1",
					attribute2 : "original attribute2"
				} );
				
				// Set twice, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.set( 'attribute1', "new value 1 - even newer" );
				model.set( 'attribute2', "new value 2 - even newer" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values after rollback (that the 2nd set of set() calls didn't overwrite the original values) 
				Y.Assert.areSame( "original attribute1", model.get( 'attribute1' ) );
				Y.Assert.areSame( "original attribute2", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should fire the 'rollback' event" : function() {
				var rollbackEventCount = 0;
				
				var model = new this.TestModel( {
					attribute1 : 'orig1',
					attribute2 : 'orig2'
				} );
				model.on( 'rollback', function() {
					rollbackEventCount++;
				} );
				
				
				model.set( 'attribute1', 'new1' );
				
				Y.Assert.areSame( 0, rollbackEventCount, "Initial condition: The rollback event should not have been fired yet" );
				model.rollback();
				Y.Assert.areSame( 1, rollbackEventCount, "The rollback event should have been fired exactly once" );
			}
			
		},
		
		
		
		{
			/*
			 * Test load()
			 */
			name: 'Test load()',
			
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( newValue ) { return this.get( 'attribute1' ) + " " + this.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( newValue ) { return newValue + " " + this.get( 'attribute2' ); } }
					]
				} );
			},
		
			
			// Special instructions
			_should : {
				error : {
					"load() should throw an error if there is no configured persistenceProxy" : "Kevlar.Model::load() error: Cannot load. No persistenceProxy."
				}
			},
			
			
			"load() should throw an error if there is no configured persistenceProxy" : function() {
				var model = new this.TestModel( {
					// note: no configured persistenceProxy
				} );
				model.load();
				Y.Assert.fail( "load() should have thrown an error with no configured persistenceProxy" );
			},
			
			
			"load() should delegate to its persistenceProxy's read() method to retrieve the data" : function() {
				var proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
					// Implementation of abstract interface
					create : Kevlar.emptyFn,
					read : Kevlar.emptyFn,
					update : Kevlar.emptyFn,
					destroy : Kevlar.emptyFn
				} ) );
				
				var MyModel = this.TestModel.extend( {
					persistenceProxy : proxy
				} );
				
				
				// Instantiate and run the load() method to delegate
				var model = new MyModel(); 
				model.load();
				
				try {
					JsMockito.verify( proxy ).read();
				} catch( msg ) {
					Y.Assert.fail( msg );
				}
			}
		},
		
		
		{
			/*
			 * Test save()
			 */
			name: 'Test save()',
			ttype: 'testsuite',
			
			items : [
				{
					name : "General save() tests",
					
					setUp : function() {
						this.proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							// Implementation of abstract interface
							create: Kevlar.emptyFn,
							read: Kevlar.emptyFn,
							update: Kevlar.emptyFn,
							destroy: Kevlar.emptyFn
						} ) );
					},
					
					
					// Special instructions
					_should : {
						error : {
							"save() should throw an error if there is no configured persistenceProxy" : "Kevlar.Model::save() error: Cannot save. No persistenceProxy."
						}
					},
					
					
					"save() should throw an error if there is no configured persistenceProxy" : function() {
						var Model = Kevlar.Model.extend( {
							// note: no persistenceProxy
						} );
						var model = new Model();
						model.save();
						Y.Assert.fail( "save() should have thrown an error with no configured persistenceProxy" );
					},
					
					
					"save() should delegate to its persistenceProxy's create() method to persist changes when the Model does not have an id set" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							persistenceProxy : this.proxy
						} );
						
						var model = new Model();  // note: no 'id' set
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( this.proxy ).create();
						} catch( msg ) {
							Y.Assert.fail( msg );
						}
					},
					
					
					"save() should delegate to its persistenceProxy's update() method to persist changes, when the Model has an id" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							persistenceProxy : this.proxy
						} );
						
						var model = new Model( { id: 1 } );
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( this.proxy ).update();
						} catch( msg ) {
							Y.Assert.fail( msg );
						}
					}
				},
					
				
				{
					name : "save() callbacks tests",
					
					setUp : function() {
						this.proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							// Implementation of abstract interface
							create: Kevlar.emptyFn,
							read: Kevlar.emptyFn,
							update: Kevlar.emptyFn,
							destroy: Kevlar.emptyFn
						} ) );
						
						// Note: setting both create() and update() methods here
						this.proxy.create = this.proxy.update = function( model, options ) {
							if( options.success ) { options.success.call( options.scope || window ); }
							if( options.error ) { options.error.call( options.scope || window ); }
							if( options.complete ) { options.complete( options.scope || window ); }
						};
						
						this.Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1' ],
							persistenceProxy  : this.proxy
						} );
					},
					
					
					"save should call its 'success' and 'complete' callbacks if the persistenceProxy successfully creates" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						var model = new this.Model();
						model.save( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error while creating" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						var model = new this.Model();
						model.save( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'success' and 'complete' callbacks if the persistenceProxy successfully updates" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						var model = new this.Model( { id: 1 } );
						model.save( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error while updating" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						var model = new this.Model( { id: 1 } );
						model.save( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					}
				},
				
				
				{
					name : "Test basic persistence",
					
					setUp : function() {
						this.Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ]
						} );
					},
					
					// ---------------------------------
					
					
					"Model attributes that have been persisted should not be persisted again if they haven't changed since the last persist" : function() {
						var dataToPersist;
						var proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							create  : Kevlar.emptyFn,
							read    : Kevlar.emptyFn,
							update  : Kevlar.emptyFn,
							destroy : Kevlar.emptyFn
						} ) );
						JsMockito.when( proxy ).update().then( function( model, options ) {
							dataToPersist = model.getChanges();
							options.success.call( options.scope );
						} );
						
						var MyModel = this.Model.extend( {
							persistenceProxy : proxy
						} );
						var model = new MyModel( { id: 1 } );
						
						
						// Change attribute1 first (so that it has changes), then save
						model.set( 'attribute1', 'newattribute1value' );
						model.save();
						
						Y.Assert.areSame( 1, Kevlar.util.Object.length( dataToPersist ), "The dataToPersist should only have one key after attribute1 has been changed" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1' ], dataToPersist, "The dataToPersist should have 'attribute1'" );
						
						
						// Now change attribute2. The dataToPersist should not include attribute1, since it has been persisted
						model.set( 'attribute2', 'newattribute2value' );
						model.save();
						
						Y.Assert.areSame( 1, Kevlar.util.Object.length( dataToPersist ), "The dataToPersist should only have one key after attribute2 has been changed" );
						Y.ObjectAssert.ownsKeys( [ 'attribute2' ], dataToPersist, "The dataToPersist should have 'attribute2'" );
					}
				},
				
				
					
				{
					name : "Test concurrent persistence and model updates",
										
					
					// Creates a test Model with a mock persistenceProxy, which fires its 'success' callback after the given timeout
					createModel : function( timeout ) {
						var proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							create  : Kevlar.emptyFn,
							read    : Kevlar.emptyFn,
							update  : Kevlar.emptyFn,
							destroy : Kevlar.emptyFn
						} ) );
						JsMockito.when( proxy ).update().then( function( model, options ) {
							// update method just calls 'success' callback in 50ms
							window.setTimeout( function() {
								options.success.call( options.scope || window );
							}, timeout );
						} );
						
						return Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ],
							persistenceProxy : proxy
						} );
					},
					
					
					// ----------------------------
					
					// Test that model attributes that are updated during a persistence request do not get marked as committed
					
					"Model attributes that are updated (via set()) while a persistence request is in progress should not be marked as committed when the persistence request completes" : function() {
						var test = this;
						
						var Model = this.createModel( 50 ), // 50ms success callback
						    model = new Model( { id: 1 } );
						
						// Initial set
						model.set( 'attribute1', "origValue1" );
						model.set( 'attribute2', "origValue2" );
						
						// Begin persistence operation, defining a callback for when it is complete
						model.save( {
							success : function() {
								test.resume( function() {
									Y.Assert.isTrue( model.isDirty(), "The model should still be dirty after the persistence operation. attribute1 was set after the persistence operation began." );
									
									Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified (dirty). It was updated (set) after the persistence operation began." );
									Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should not be marked as modified. It was not updated after the persistence operation began." );
									
									Y.Assert.areSame( "newValue1", model.get( 'attribute1' ), "a get() operation on attribute1 should return the new value." );
									Y.Assert.areSame( "origValue2", model.get( 'attribute2' ), "a get() operation on attribute2 should return the persisted value. It was not updated since the persistence operation began." );
								} );
							}
						} );
						
						
						// Now set the attribute while the async persistence operation is in progress. Test will resume when the timeout completes
						model.set( 'attribute1', "newValue1" );
						// note: not setting attribute2 here
						
						// Wait for the setTimeout in the MockProxy
						test.wait( 100 );
					},
					
					
					"Model attributes that are updated *more than once* (via set()) while a persistence request is in progress should not be marked as committed when the persistence request completes" : function() {
						var test = this;
						
						var Model = this.createModel( 50 ), // 50ms success callback
						    model = new Model( { id: 1 } );
						
						// Initial set
						model.set( 'attribute1', "origValue1" );
						model.set( 'attribute2', "origValue2" );
						
						// Begin persistence operation, defining a callback for when it is complete
						model.save( {
							success : function() {
								test.resume( function() {
									Y.Assert.isTrue( model.isDirty(), "The model should still be dirty after the persistence operation. attribute1 was set after the persistence operation began." );
									
									Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified (dirty). It was updated (set) after the persistence operation began." );
									Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should not be marked as modified. It was not updated after the persistence operation began." );
									
									Y.Assert.areSame( "newValue11", model.get( 'attribute1' ), "a get() operation on attribute1 should return the new value." );
									Y.Assert.areSame( "origValue2", model.get( 'attribute2' ), "a get() operation on attribute2 should return the persisted value. It was not updated since the persistence operation began." );
									
									// Now rollback the model, and see if the original value of attribute1 is still there
									model.rollback();
									Y.Assert.areSame( "origValue1", model.get( 'attribute1' ), "The value for attribute1 should have been rolled back to its original value" ); 
								} );
							}
						} );
						
						
						// Now set the attribute twice while the async persistence operation is in progress. Test will resume when the timeout completes
						model.set( 'attribute1', "newValue1" );
						model.set( 'attribute1', "newValue11" );  // set it again
						// note: not setting attribute2 here
						
						// Wait for the setTimeout in the MockProxy
						test.wait( 100 );
					}
					
				}
			]
		},
		
		
		{
			/*
			 * Test destroy()
			 */
			name: 'Test destroy()',
			ttype : 'testsuite',
			
			items : [
				{
					name : "General destroy() tests",
					
					// Special instructions
					_should : {
						error : {
							"destroy() should throw an error if there is no configured persistenceProxy when it tries to destroy a model that has been persisted (i.e. has an id)" : 
								"Kevlar.Model::destroy() error: Cannot destroy model on server. No persistenceProxy."
						}
					},
					
					
					"destroy() should throw an error if there is no configured persistenceProxy when it tries to destroy a model that has been persisted (i.e. has an id)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ]
							// note: no persistenceProxy
						} );
						
						var model = new Model( { id: 1 } );  // the model needs an id to be considered as persisted on the server
						model.destroy();
						Y.Assert.fail( "destroy() should have thrown an error with no configured persistenceProxy" );
					},
					
					
					"destroy() should delegate to its persistenceProxy's destroy() method to persist the destruction of the model" : function() {
						var proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							create  : Kevlar.emptyFn,
							read    : Kevlar.emptyFn,
							update  : Kevlar.emptyFn,
							destroy : Kevlar.emptyFn
						} ) );
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'id' ],
							persistenceProxy : proxy
						} );
						
						var model = new Model( { id: 1 } );  // the model needs an id to be considered as persisted on the server
						
						// Run the destroy() method to delegate 
						model.destroy();
						
						try {
							JsMockito.verify( proxy ).destroy();
						} catch( e ) {
							Y.Assert.fail( "The model should have delegated to the destroy method exactly once." );
						}
					},
					
					
					"upon successful destruction of the Model, the Model should fire its 'destroy' event" : function() {
						var proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							create  : Kevlar.emptyFn,
							read    : Kevlar.emptyFn,
							update  : Kevlar.emptyFn,
							destroy : Kevlar.emptyFn
						} ) );
						JsMockito.when( proxy ).destroy().then( function( model, options ) {
							options.success.call( options.scope );
						} );
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'id' ],
							persistenceProxy : proxy
						} );
						
						var model = new Model( { id: 1 } );  // the model needs an id to be considered as persisted on the server
						
						var destroyEventFired = false;
						model.addListener( 'destroy', function() {
							destroyEventFired = true;
						} );
						
						// Run the destroy() method to delegate 
						model.destroy();
						Y.Assert.isTrue( destroyEventFired, "Should have fired its destroy event" );
					}
				},
			
			
				{
					name : "destroy() callbacks tests",
					
					setUp : function() {
						this.proxy = JsMockito.mock( Kevlar.persistence.Proxy.extend( {
							// Implementation of abstract interface
							create: Kevlar.emptyFn,
							read: Kevlar.emptyFn,
							update: Kevlar.emptyFn,
							destroy: Kevlar.emptyFn
						} ) );
					},
					
			
					"destroy() should call its 'success' and 'complete' callbacks if the persistenceProxy is successful" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						
						JsMockito.when( this.proxy ).destroy().then( function( model, options ) {
							if( options.success )  { options.success.call( options.scope ); }
							if( options.complete ) { options.complete( options.scope ); }
						} );
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'id' ],
							persistenceProxy  : this.proxy
						} );
						var model = new Model( { id: 1 } );  // the model needs an id to be considered as persisted on the server
						
						model.destroy( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"destroy() should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						JsMockito.when( this.proxy ).destroy().then( function( model, options ) {
							options.error.call( options.scope );
							options.complete( options.scope );
						} );
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'id' ],
							persistenceProxy  : this.proxy
						} );
						var model = new Model( { id: 1 } );  // the model needs an id to be considered as persisted on the server
						
						model.destroy( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					}
				}
			]
		}
	]
	
} ) );

/*global window, jQuery, Ext, Y, JsMockito, Kevlar, tests */
tests.unit.persistence.add( new Ext.test.TestSuite( {
	name: 'Kevlar.persistence.RestProxy',
	
	
	items : [
	
		{
			/*
			 * Test create()
			 */
			name: "Test create",
			ttype: 'testsuite',
			
			items : [
				{
					name: 'General create() tests',
					
					"create() should populate the model with any response data upon a successful ajax request" : function() {
						var testData = { attribute1: 'value1', attribute2: 'value2' };
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function( options ) { 
								options.success( testData );
							}
						} );
						var proxy = new TestProxy();
						
						var mockModel = JsMockito.mock( Kevlar.Model );
						proxy.create( mockModel );
						
						try {
							JsMockito.verify( mockModel ).set( testData );
						} catch( e ) {
							Y.Assert.fail( "The model should have had its data set to the testData" );
						}
					}
				},
				
				{
					name : "create()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'POST'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.create( model );
						Y.Assert.areSame( 'POST', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								create : 'PUT'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.create( model );
						Y.Assert.areSame( 'PUT', httpMethod );
					}
				}
			]
		},
					
	
		{
			/*
			 * Test read()
			 */
			name: "Test read",
			ttype: 'testsuite',
			
			items : [
				{
					name: 'General read() tests',
					
					"read() should populate the model data upon a successful ajax request" : function() {
						var testData = { attribute1: 'value1', attribute2: 'value2' };
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function( options ) { 
								options.success( testData );
							}
						} );
						var proxy = new TestProxy();
						
						var mockModel = JsMockito.mock( Kevlar.Model );
						proxy.read( mockModel );
						
						try {
							JsMockito.verify( mockModel ).set( testData );
						} catch( e ) {
							Y.Assert.fail( "The model should have had its data set to the testData" );
						}
					}
				},
				
				
				{
					name : "read()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'GET'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.read( model );
						Y.Assert.areSame( 'GET', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								read : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.read( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				}
			]
		},
		
		
		
		
		{
			/*
			 * Test update()
			 */
			name: "Test update()",
			ttype: 'testsuite',
			
			items : [
				{
					name : "General update() tests",
					
					
					"update() should NOT actually call the ajax method when no attributes have been changed" : function() {
						var ajaxCallCount = 0;
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function() { ajaxCallCount++; }
						} );
						var proxy = new TestProxy();
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( {} );
						
						proxy.update( model );
						
						Y.Assert.areSame( 0, ajaxCallCount, "The proxy's ajax() method should not have not been called, since there are no changes" );
					},
					
					
					"update() should in fact call the ajax method when attributes have been changed" : function() {
						var ajaxCallCount = 0;
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function() { ajaxCallCount++; }
						} );
						var proxy = new TestProxy();
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						proxy.update( model );
						
						Y.Assert.areSame( 1, ajaxCallCount, "The proxy's ajax() method should have been called, since there are changes to persist" );
					}
				},
					
				
				{
					name : "Test update() callbacks",
					
					setUp : function() {
						this.ajaxCallCount = 0;
						
						this.TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax: jQuery.proxy( function( options ) { 
								this.ajaxCallCount++;
								
								if( options.success ) { options.success(); }
								if( options.error ) { options.error(); }
								if( options.complete ) { options.complete(); }
							}, this )
						} );
					},
					
						
					"The 'success' and 'complete' callbacks provided to update() should be called if no attributes have been changed, and it does not need to do its ajax request" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( {} );
						
						var proxy = new this.TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						proxy.update( model, {
							success : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 0, this.ajaxCallCount, "The ajax method should not have been called" );
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided update() should have been called even though there are no changes and the proxy didn't need to persist anything" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called even though there are no changes and the proxy didn't need to persist anything" );
					},
					
					
					"The 'success' and 'complete' callbacks provided to update() should be called if the ajax request is successful" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var proxy = new this.TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						proxy.update( model, {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided update() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called" );
					},
					
					
					"The 'error' and 'complete' callbacks provided to update() should be called if the ajax request fails" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
							
						var proxy = new this.TestProxy();
						
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						proxy.update( model, {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' callback provided update() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called" );
					}
				},
					
					
				{
					name : "HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'PUT'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.update( model );
						Y.Assert.areSame( 'PUT', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								update : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.update( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				},
				
				
				
				{
					/*
					 * Test incremental updates
					 */
					name : "Test incremental updates",
					
					setUp : function() {						
						this.mockModel = JsMockito.mock( Kevlar.Model );
						JsMockito.when( this.mockModel ).getData( /*{ persistedOnly: true, raw: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1', attribute2: 'value2' } );
						JsMockito.when( this.mockModel ).getChanges( /*{ persistedOnly: true, raw: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute2: 'value2' } );  // 'attribute2' is the "change"
					},
					
					
					"update() should provide the full set of data to the ajax method if the proxy is not set to do incremental updates" : function() {
						var dataPersisted;
						var ajaxFn = function( options ) {
							dataPersisted = JSON.parse( options.data );  // the data is fed as a JSON encoded string
						};
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : ajaxFn,
							incremental: false
						} );
						var proxy = new TestProxy();
						
						proxy.update( this.mockModel );
						
						Y.Assert.areEqual( 2, Kevlar.util.Object.length( dataPersisted ), "The dataPersisted have exactly 2 keys, one for each of the attributes in the model" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute2' ], dataPersisted );
						Y.Assert.areEqual( 'value1', dataPersisted.attribute1 );
						Y.Assert.areEqual( 'value2', dataPersisted.attribute2 );
					},
					
					
					"update() should provide only the changed data if the proxy is set to do incremental updates" : function() {
						var dataPersisted;
						var ajaxFn = function( options ) {
							dataPersisted = JSON.parse( options.data );  // the data is fed as a JSON encoded string
						};
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : ajaxFn,
							incremental: true
						} );
						var proxy = new TestProxy();
						
						proxy.update( this.mockModel );
						
						Y.Assert.areEqual( 1, Kevlar.util.Object.length( dataPersisted ), "The dataPersisted have exactly 1 key, the one that was changed" );
						Y.ObjectAssert.ownsKeys( [ 'attribute2' ], dataPersisted );
						Y.Assert.areEqual( 'value2', dataPersisted.attribute2 );
					}
				}
			]
		},
		
		
		{
			/*
			 * Test destroy()
			 */
			name : 'Test destroy',
			ttype : 'testsuite',
			
			
			items : [
				{
					name : "Test destroy()'s callbacks", 
						
					"The 'success' and 'complete' callbacks provided to destroy() should be called if the ajax request is successful" : function() {
						var ajaxFn = function( options ) { 
							options.success();
							options.complete();
						};
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: ajaxFn
						} );
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var proxy = new TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						proxy.destroy( model, {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided destroy() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided destroy() should have been called" );
					},
					
					
					"The 'error' and 'complete' callbacks provided to destroy() should be called if the ajax request fails" : function() {
						var ajaxFn = function( options ) { 
							options.error();
							options.complete();
						};
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: ajaxFn
						} );
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var proxy = new TestProxy();
						
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						proxy.destroy( model, {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' callback provided destroy() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided destroy() should have been called" );
					}
				},
									
					
				{
					name : "destroy()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'DELETE'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.destroy( model );
						Y.Assert.areSame( 'DELETE', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getChanges( /*{ persistedOnly: true, raw: true } Unfortunately, JsMockito won't match this*/ ).thenReturn( { attribute1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								destroy : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.destroy( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				}
			]
		},
		
		
		{
			/*
			 * Test buildUrl()
			 */
			name: 'Test buildUrl()',
			
			
			"buildUrl() should handle a urlRoot without a trailing slash" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				var proxy = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl',
					appendId : false
				} );
				
				Y.Assert.areSame( '/testUrl', proxy.buildUrl( mockModel, 'create' ), "buildUrl() should have returned the urlRoot when doing a 'create'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'read' ), "buildUrl() should have appended the ID when doing a 'read'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'update' ), "buildUrl() should have appended the ID when doing a 'update'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'delete' ), "buildUrl() should have appended the ID when doing a 'delete'" );
			},


			"buildUrl() should handle a urlRoot with a trailing slash" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				var proxy = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl/',
					appendId : false
				} );
				
				Y.Assert.areSame( '/testUrl/', proxy.buildUrl( mockModel, 'create' ), "buildUrl() should have returned the urlRoot when doing a 'create'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'read' ), "buildUrl() should have appended the ID when doing a 'read'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'update' ), "buildUrl() should have appended the ID when doing a 'update'" );
				Y.Assert.areSame( '/testUrl/42', proxy.buildUrl( mockModel, 'delete' ), "buildUrl() should have appended the ID when doing a 'delete'" );
			}
		}
	]
} ) );

/*global jQuery, Ext, Y, Kevlar, tests */
tests.unit.util.add( new Ext.test.TestSuite( {
	name : 'Kevlar.util.Object',
	
	items : [
	
		/*
		 * Test clone()
		 */
		{
			name : "Test clone()",
			
			"clone() should return primitive types as-is" : function() {
				// Tests with primitive types
				Y.Assert.areSame( undefined, Kevlar.util.Object.clone( undefined ), "clone() not returning undefined when provided undefined." );
				Y.Assert.areSame( null, Kevlar.util.Object.clone( null ), "clone() not returning null when provided null." );
				Y.Assert.areSame( true, Kevlar.util.Object.clone( true ), "clone() not returning true when provided true." );
				Y.Assert.areSame( false, Kevlar.util.Object.clone( false ), "clone() not returning false when provided false." );
				Y.Assert.areSame( 0, Kevlar.util.Object.clone( 0 ), "clone() not returning 0 when provided 0." );
				Y.Assert.areSame( 1, Kevlar.util.Object.clone( 1 ), "clone() not returning 1 when provided 1." );
				Y.Assert.areSame( "", Kevlar.util.Object.clone( "" ), "clone() not returning empty string when provided an empty string." );
				Y.Assert.areSame( "hi", Kevlar.util.Object.clone( "hi" ), "clone() not returning string 'hi' when provided string 'hi'." );
			},
			
			"clone() should copy a Date object" : function() {
				var date = new Date( 2012, 1, 1, 1, 1, 1, 1 );
				var dateCopy = Kevlar.util.Object.clone( date );
				
				Y.Assert.areNotSame( date, dateCopy, "The copy should not be a reference to the original object" );
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( date, dateCopy ), "The copy should have the same date value" );
			},
			
			"clone() should copy a Date object that is nested within another object" : function() {
				var date = new Date( 2012, 1, 1, 1, 1, 1, 1 );
				var obj = { a: date };
				var objCopy = Kevlar.util.Object.clone( obj );
				
				Y.Assert.areNotSame( obj, objCopy, "The copy of the object should not be a reference to the input object" );
				Y.Assert.areNotSame( date, objCopy.a, "The date in the 'a' property should be a copy, not a reference to the same object" );
				
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( obj, objCopy ), "clone() should have copied the object" );
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( date, objCopy.a ), "clone() should have copied the Date object" );
			},
						
			"clone() should copy an array of primitives" : function() {
				var simpleArr = [ 1, 2, 3, 4, 5 ];
				Y.Assert.areNotSame( simpleArr, Kevlar.util.Object.clone( simpleArr ), "clone() returning same reference to array." );
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( [ 1, 2, 3, 4, 5 ], Kevlar.util.Object.clone( simpleArr ) ), "clone() not properly copying a simple array." );
			},
			
			"clone() should deep copy an array of mixed primitives and objects" : function() {
				var complexArr = [ { a: { inner: 1 }, b: 2 }, 1, "asdf", [ 1, 2, { a: 1 } ] ];
				Y.Assert.areNotSame( complexArr, Kevlar.util.Object.clone( complexArr ), "clone() returning same reference to complex array." );
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( [ { a: { inner: 1 }, b: 2 }, 1, "asdf", [ 1, 2, { a: 1 } ] ], Kevlar.util.Object.clone( complexArr ) ), "clone() not properly deep copying a complex array." );
				Y.Assert.areNotSame( complexArr[ 0 ], Kevlar.util.Object.clone( complexArr )[ 0 ], "clone() not properly deep copying a complex array. first element has same reference for original and copy." ); 
				Y.Assert.areNotSame( complexArr[ 0 ].a, Kevlar.util.Object.clone( complexArr )[ 0 ].a, "clone() not properly deep copying a complex array. first element, 'a' object, has same reference for original and copy." ); 
				Y.Assert.areSame( complexArr[ 0 ].a, Kevlar.util.Object.clone( complexArr, /*deep*/ false )[ 0 ].a, "clone() not properly shallow copying a complex array. first element, 'a' object, does not have same reference for original and copy." ); 
			},
			
			
			"clone() should copy a simple object of primitives" : function() {
				var simpleObj = { a: 1, b: 2 };
				Y.Assert.areNotSame( simpleObj, Kevlar.util.Object.clone( simpleObj ), "clone() returning same reference to simple object." );
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( { a: 1, b: 2 }, Kevlar.util.Object.clone( simpleObj ) ), "clone() not properly copying a simple object." );
			},
			
			"clone() should deep copy an object of primitives, nested arrays, and nested objects" : function() {
				var date = new Date( 2011, 1, 1 );
				var complexObj = { a: 1, b: { a: 1, b: [1,2,3], c: { a: null, b: undefined, c: true, d: false, e: "ohai" } }, c: [1,[1,2]], d: date };
				
				Y.Assert.areNotSame( complexObj, Kevlar.util.Object.clone( complexObj ), "clone() returning same reference to complex object." );
				
				Y.Assert.isTrue( Kevlar.util.Object.isEqual( { a: 1, b: { a: 1, b: [1,2,3], c: { a: null, b: undefined, c: true, d: false, e: "ohai" } }, c: [1,[1,2]], d: date }, Kevlar.util.Object.clone( complexObj ) ), "clone() not properly deep copying a complex object." );
				Y.Assert.areNotSame( complexObj.b, Kevlar.util.Object.clone( complexObj ).b, "clone() not properly deep copying a complex object. property 'b' has same reference for original and copy." );
				Y.Assert.areNotSame( complexObj.b.c, Kevlar.util.Object.clone( complexObj ).b.c, "clone() not properly deep copying a complex object. property 'b.c' has same reference for original and copy. Nested object inside nested object not getting copied." );
				Y.Assert.areSame( complexObj.b.c, Kevlar.util.Object.clone( complexObj, /*deep*/ false ).b.c, "clone() with 'deep' set to false (shallow copy mode) is still deep copying a complex object. property 'b.c' does not have same reference for original and copy." );
				Y.Assert.areNotSame( date, Kevlar.util.Object.clone( complexObj ).d, "The Date object in complexObj.d should have been a copy of the Date object, not a reference to the same object" );
			},
			
			
			"clone() should not copy prototype properties of instantiated objects" : function() {
				var MyClass = function() {
					this.ownVar = 1;
				};
				MyClass.prototype.prototypeVar = 2;
				
				var myInstance = new MyClass();
				var copiedInstance = Kevlar.util.Object.clone( myInstance );
				
				// First check that the owned property was copied
				Y.Assert.isTrue( copiedInstance.hasOwnProperty( 'ownVar' ), "clone() did not copy the owned property 'ownVar'" );
				Y.Assert.areSame( 1, copiedInstance.ownVar, "clone() did not copy the owned property 'ownVar' with the correct value" );
				
				// Now check that the prototype property was *not* copied
				Y.Assert.isFalse( copiedInstance.hasOwnProperty( 'prototypeVar' ), "clone() copied the prototype property 'prototypeVar'. It should not have." );
			}
		},
		
		
		
		/*
		 * Test isEqual()
		 */
		{
			name : "Test isEqual()",
			
			
			"isEqual() should work with all datatype comparisons (primitive and array/object)" : function() {
				// Quick reference
				var isEqual = Kevlar.util.Object.isEqual;
				
				Y.Assert.isTrue( isEqual( undefined, undefined ), "Error: undefined !== undefined" );
				Y.Assert.isFalse( isEqual( undefined, null ), "Error: undefined === null"  );
				Y.Assert.isFalse( isEqual( undefined, true ), "Error: undefined === true" );
				Y.Assert.isFalse( isEqual( undefined, false ), "Error: undefined === false" );
				Y.Assert.isFalse( isEqual( undefined, 0 ), "Error: undefined === 0" );
				Y.Assert.isFalse( isEqual( undefined, "" ), "Error: undefined === ''" );
				Y.Assert.isFalse( isEqual( undefined, {} ), "Error: undefined === {}" );
				Y.Assert.isFalse( isEqual( undefined, { a : 1 } ), "Error: undefined === { a : 1 }" );
				Y.Assert.isFalse( isEqual( undefined, [] ), "Error: undefined === []" );
				Y.Assert.isFalse( isEqual( undefined, [ 1,2,3 ] ), "Error: undefined === [ 1,2,3 ]" );
				Y.Assert.isFalse( isEqual( undefined, 42 ), "Error: undefined === 42" );
				Y.Assert.isFalse( isEqual( undefined, "test" ), "Error: undefined === 'test'" );
				
				Y.Assert.isTrue( isEqual( null, null ), "Error: null !== null" );
				Y.Assert.isFalse( isEqual( null, undefined ), "Error: null === undefined" );
				Y.Assert.isFalse( isEqual( null, true ), "Error: null === true" );
				Y.Assert.isFalse( isEqual( null, false ), "Error: null === false" );
				Y.Assert.isFalse( isEqual( null, 0 ), "Error: null === 0" );
				Y.Assert.isFalse( isEqual( null, "" ), "Error: null === ''" );
				Y.Assert.isFalse( isEqual( null, {} ), "Error: null === {}" );
				Y.Assert.isFalse( isEqual( null, { a : 1 } ), "Error: null === { a : 1 }" );
				Y.Assert.isFalse( isEqual( null, [] ), "Error: null === []" );
				Y.Assert.isFalse( isEqual( null, [ 1,2,3 ] ), "Error: null === [ 1,2,3 ]" );
				Y.Assert.isFalse( isEqual( null, 42 ), "Error: null === 42" );
				Y.Assert.isFalse( isEqual( null, "test" ), "Error: null === 'test'" );
				
				Y.Assert.isTrue( isEqual( true, true ), "Error: true !== true" );
				Y.Assert.isTrue( isEqual( false, false ), "Error: false !== true" );
				Y.Assert.isFalse( isEqual( true, false ), "Error: true === false" );
				Y.Assert.isFalse( isEqual( false, true ), "Error: false === true" );
				Y.Assert.isFalse( isEqual( false, 0 ), "Error: false === 0" );
				Y.Assert.isFalse( isEqual( true, 1 ), "Error: true === 1" );
				Y.Assert.isFalse( isEqual( false, "" ), "Error: false === ''" );
				Y.Assert.isFalse( isEqual( true, "true" ), "Error: true === 'true'" );
						
				Y.Assert.isTrue( isEqual( 0, 0 ), "Error: 0 !== 0" );
				Y.Assert.isTrue( isEqual( 1, 1 ), "Error: 1 !== 1" );
				Y.Assert.isTrue( isEqual( -1, -1 ), "Error: -1 !== -1" );
				Y.Assert.isFalse( isEqual( 0, 1 ), "Error: 0 === 1" );
				Y.Assert.isFalse( isEqual( 1, 0 ), "Error: 1 === 0" );
				Y.Assert.isFalse( isEqual( 1, 2 ), "Error: 1 === 2" );
				Y.Assert.isFalse( isEqual( 0, "" ), "Error: 0 === ''" );
				Y.Assert.isFalse( isEqual( 1, "1" ), "Error: 1 === '1'" );
				
				Y.Assert.isTrue( isEqual( "", "" ), "Error: '' !== ''" );
				Y.Assert.isTrue( isEqual( "asdf", "asdf" ), "Error: 'asdf' !== 'asdf'" );
				Y.Assert.isFalse( isEqual( "", 0 ), "Error: '' === 0" );
				Y.Assert.isFalse( isEqual( "asdf", "asdf2" ), "Error: 'asdf' === 'asdf2'" );
				Y.Assert.isFalse( isEqual( 0, "0" ), "Error: 0 === '0'" );
				Y.Assert.isFalse( isEqual( "0", 0 ), "Error: '0' === 0" );
				Y.Assert.isFalse( isEqual( 1, "1" ), "Error: 1 === '1'" );
				Y.Assert.isFalse( isEqual( "1", 1 ), "Error: '1' === 1" );
				
				Y.Assert.isFalse( isEqual( {}, null ), "Error: {} === null" );
				Y.Assert.isFalse( isEqual( {}, undefined ), "Error: {} === undefined" );
				Y.Assert.isFalse( isEqual( {}, true ), "Error: {} === true" );
				Y.Assert.isFalse( isEqual( {}, false ), "Error: {} === false" );
				Y.Assert.isFalse( isEqual( {}, 0 ), "Error: {} === 0" );
				Y.Assert.isFalse( isEqual( {}, 1 ), "Error: {} === 1" );
				Y.Assert.isFalse( isEqual( {}, "" ), "Error: {} === ''" );
				Y.Assert.isFalse( isEqual( {}, "test" ), "Error: {} === 'test'" );
				Y.Assert.isTrue( isEqual( {}, {} ), "Error: {} !== {}" );
				Y.Assert.isFalse( isEqual( {}, { a : 1 } ), "Error: {} === { a : 1 }" );
				Y.Assert.isFalse( isEqual( {}, [] ), "Error: {} === []" );
				Y.Assert.isFalse( isEqual( {}, [ 1,2,3 ] ), "Error: {} === [ 1,2,3 ]" );
				
				Y.Assert.isFalse( isEqual( [], null ), "Error: [] === null" );
				Y.Assert.isFalse( isEqual( [], undefined ), "Error: [] === undefined" );
				Y.Assert.isFalse( isEqual( [], true ), "Error: [] === true" );
				Y.Assert.isFalse( isEqual( [], false ), "Error: [] === false" );
				Y.Assert.isFalse( isEqual( [], 0 ), "Error: [] === 0" );
				Y.Assert.isFalse( isEqual( [], 1 ), "Error: [] === 1" );
				Y.Assert.isFalse( isEqual( [], "" ), "Error: [] === ''" );
				Y.Assert.isFalse( isEqual( [], "test" ), "Error: [] === 'test'" );
				Y.Assert.isFalse( isEqual( [], {} ), "Error: [] === {}" );
				Y.Assert.isFalse( isEqual( [], { a : 1 } ), "Error: [] === { a : 1 }" );
				Y.Assert.isTrue( isEqual( [], [] ), "Error: [] !== []" );
				Y.Assert.isFalse( isEqual( [], [ 1,2,3 ] ), "Error: [] === [ 1,2,3 ]" );
				
				var date = new Date( 2012, 1, 1, 10, 10, 10, 10 );
				Y.Assert.isFalse( isEqual( date, null ), "Error: date === null" );
				Y.Assert.isFalse( isEqual( date, undefined ), "Error: date === undefined" );
				Y.Assert.isFalse( isEqual( date, true ), "Error: date === true" );
				Y.Assert.isFalse( isEqual( date, false ), "Error: date === false" );
				Y.Assert.isFalse( isEqual( date, 0 ), "Error: date === 0" );
				Y.Assert.isFalse( isEqual( date, 1 ), "Error: date === 1" );
				Y.Assert.isFalse( isEqual( date, "" ), "Error: date === ''" );
				Y.Assert.isFalse( isEqual( date, "test" ), "Error: date === 'test'" );
				Y.Assert.isFalse( isEqual( date, {} ), "Error: date === {}" );
				Y.Assert.isFalse( isEqual( date, { a : 1 } ), "Error: date === { a : 1 }" );
				Y.Assert.isFalse( isEqual( date, [] ), "Error: date === []" );
				Y.Assert.isFalse( isEqual( date, [ 1,2,3 ] ), "Error: date === [ 1,2,3 ]" );
				Y.Assert.isFalse( isEqual( date, new Date( 2000, 1, 1, 1, 1, 1, 1 ) ), "Error: date === a date with a different date/time" );
				Y.Assert.isTrue( isEqual( date, new Date( 2012, 1, 1, 10, 10, 10, 10 ) ), "Error: date !== a date with a the same date/time" );
			},
			
			
			"isEqual() should work with deep object comparisons" : function() {
				// Quick reference
				var isEqual = Kevlar.util.Object.isEqual;
				
				var a = {a: 'text', b:[0,1]};
				var b = {a: 'text', b:[0,1]};
				var c = {a: 'text', b: 0};
				var d = {a: 'text', b: false};
				var e = {a: 'text', b:[1,0]};
				var f = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
				var g = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
				var h = {a: 'text', b:[1,0], f: function(){ this.a = this.b; }};
				var i = {
					a: 'text',
					c: {
						b: [1, 0],
						f: function(){
							this.a = this.b;
						}
					}
				};
				var j = {
					a: 'text',
					c: {
						b: [1, 0],
						f: function(){
							this.a = this.b;
						}
					}
				};
				var k = {a: 'text', b: null};
				var l = {a: 'text', b: undefined};
				
				Y.Assert.isTrue( isEqual( a, b ), "Error w/ object comparison. a !== b" );
				Y.Assert.isFalse( isEqual( a, c ), "Error w/ object comparison. a === c" );
				Y.Assert.isFalse( isEqual( c, d ), "Error w/ object comparison. c === d" );
				Y.Assert.isFalse( isEqual( a, e ), "Error w/ object comparison. a === e" );
				Y.Assert.isTrue( isEqual( f, g ), "Error w/ object comparison. f !== g" );
				Y.Assert.isFalse( isEqual( g, h ), "Error w/ object comparison. g === h" );
				Y.Assert.isTrue( isEqual( i, j ), "Error w/ object comparison. i !== j" );
				Y.Assert.isFalse( isEqual( d, k ), "Error w/ object comparison. d === k" );
				Y.Assert.isFalse( isEqual( k, i ), "Error w/ object comparison. k === i" );
			},
				
			
			"isEqual() should work with deep array comparisons" : function() {
				// Quick reference
				var isEqual = Kevlar.util.Object.isEqual;
				
				var a = [];
				var b = [];
				var c = [1];
				var d = [1];
				var e = [2];
				var f = [2];
				var g = [1,2,3];
				var h = [1,2,3];
				var i = [1,{a:1,b:2},3];
				var j = [1,{a:1,b:2},3];
				var k = [[1,2,3],{a:1,b:2},3];
				var l = [[1,2,3],{a:1,b:2},3];
				var m = [[1,{a:1,b:2,c:3},[1,2,3]],{a:1,b:[1,2]},{c:3}];
				var n = [[1,{a:1,b:2,c:3},[1,2,3]],{a:1,b:[1,2]},{c:3}];
				
				var o = [[1,2,3],{a:1,b:2},4];
				var p = [[1,2,3],{a:11,b:2},4];
				var q = [[1,22,3],{a:1,b:2},4];
				var r = [[1,{a:1,b:2,c:3},[1,1,3]],{a:1,b:[1,2]},{c:3}];
				var s = [[1,{a:1,b:2,c:3},[1,2,3]],{a:1,b:[2,2]},{c:3}];
				
				
				Y.Assert.isTrue( isEqual( a, b ), "Error w/ array comparison. a !== b" );
				Y.Assert.isTrue( isEqual( c, d ), "Error w/ array comparison. c !== d" );
				Y.Assert.isTrue( isEqual( e, f ), "Error w/ array comparison. e !== f" );
				Y.Assert.isTrue( isEqual( g, h ), "Error w/ array comparison. g !== h" );
				Y.Assert.isTrue( isEqual( i, j ), "Error w/ array comparison. i !== j" );
				Y.Assert.isTrue( isEqual( k, l ), "Error w/ array comparison. k !== l" );
				Y.Assert.isTrue( isEqual( m, n ), "Error w/ array comparison. m !== n" );
				
				Y.Assert.isFalse( isEqual( a, c ), "Error w/ array comparison. a === c" );
				Y.Assert.isFalse( isEqual( b, d ), "Error w/ array comparison. b === d" );
				Y.Assert.isFalse( isEqual( c, e ), "Error w/ array comparison. c === e" );
				Y.Assert.isFalse( isEqual( d, f ), "Error w/ array comparison. d === f" );
				Y.Assert.isFalse( isEqual( e, g ), "Error w/ array comparison. e === g" );
				Y.Assert.isFalse( isEqual( f, h ), "Error w/ array comparison. f === h" );
				Y.Assert.isFalse( isEqual( g, i ), "Error w/ array comparison. g === i" );
				Y.Assert.isFalse( isEqual( h, j ), "Error w/ array comparison. h === j" );
				Y.Assert.isFalse( isEqual( i, k ), "Error w/ array comparison. i === k" );
				Y.Assert.isFalse( isEqual( j, l ), "Error w/ array comparison. j === l" );
				Y.Assert.isFalse( isEqual( k, m ), "Error w/ array comparison. k === m" );
				Y.Assert.isFalse( isEqual( l, n ), "Error w/ array comparison. l === n" );
				
				Y.Assert.isFalse( isEqual( i, o ), "Error w/ array comparison. i === o" );
				Y.Assert.isFalse( isEqual( k, p ), "Error w/ array comparison. k === p" );
				Y.Assert.isFalse( isEqual( m, r ), "Error w/ array comparison. m === r" );
				Y.Assert.isFalse( isEqual( n, s ), "Error w/ array comparison. n === s" );
			},
				
			
			// --------------------------------
				
			
			"isEqual() should be able to shallow compare, with the 'deep' flag set to false, in case objects refer to each other" : function() {
				// Quick reference
				var isEqual = Kevlar.util.Object.isEqual;
				
				// Have objects that refer to one another, to make sure the comparison doesn't go deep.
				// Will get stack overflow error if they do.
				var obj1 = {};
				var obj2 = {};
				obj1.obj2 = obj2;
				obj2.obj1 = obj1;
				
				var a = [ obj1, obj2 ];
				var b = [ obj1, obj2 ];
				var returnVal;
				try {
					returnVal = Kevlar.util.Object.isEqual( a, b, /*deep*/ false );
				} catch( e ) {
					Y.Assert.fail( "Error w/ shallow array comparison and deep flag set to false. Comparison must be going deep, as this error would come from call stack size being reached." );
				}
				Y.Assert.isTrue( returnVal, "Error w/ shallow array comparison. a !== b" );
			}
		},
		
		
		
		/*
		 * Test objLength()
		 */
		{
			name : "Test objLength()",
			
			"objLength() should return 0 for an empty object" : function() {
				var obj = {};
				Y.Assert.areSame( 0, Kevlar.util.Object.length( obj ) );
			},
			
			"objLength() should return 0 for an empty object, even if the object has prototype properties" : function() {
				var MyClass = function() {};
				MyClass.prototype.prop = "prototype property";
				
				var myInstance = new MyClass();
				Y.Assert.areSame( 0, Kevlar.util.Object.length( myInstance ) );
			},
			
			"objLength() should return the number of owned properties in the object" : function() {
				var obj = {
					prop1 : "1",
					prop2 : "2"
				};
				Y.Assert.areSame( 2, Kevlar.util.Object.length( obj ) );
			},
			
			"objLength() should return the number of owned properties in the object, even if they are undefined or falsy" : function() {
				var obj = {
					prop1 : undefined,
					prop2 : null,
					prop3 : false,
					prop4 : 0,
					prop5 : ""
				};
				Y.Assert.areSame( 5, Kevlar.util.Object.length( obj ) );
			}
		},
		
		
		/*
		 * Test isEmpty()
		 */
		{
			name : "Test isEmpty()",
			
			"isEmpty() should return true for an empty object" : function() {
				var obj = {};
				Y.Assert.isTrue( Kevlar.util.Object.isEmpty( obj ) );
			},
			
			"isEmpty() should return true for an empty object, even if the object has prototype properties" : function() {
				var MyClass = function() {};
				MyClass.prototype.prop = "prototype property";
				
				var myInstance = new MyClass();
				Y.Assert.isTrue( Kevlar.util.Object.isEmpty( myInstance ) );
			},
			
			"isEmpty() should return false if the object owns properties" : function() {
				var obj = {
					prop1 : "1",
					prop2 : "2"
				};
				Y.Assert.isFalse( Kevlar.util.Object.isEmpty( obj ) );
			},
			
			"isEmpty() should return false if the object owns properties, even if the properties are undefined or falsy" : function() {
				var obj = {
					prop1 : undefined,
					prop2 : null,
					prop3 : false,
					prop4 : 0,
					prop5 : ""
				};
				Y.Assert.isFalse( Kevlar.util.Object.isEmpty( obj ) );
			}
		},
		
		
		/*
		 * Test keysToArray()
		 */
		{
			name : "Test keysToArray()",
			
			
			"keysToArray() should return an empty array for an empty object" : function() {
				var obj = {};
				
				var arr = Kevlar.util.Object.keysToArray( obj );
				Y.Assert.areSame( 0, arr.length );
			},
			
			
			"keysToArray() should return an empty array for an object with only prototype properties" : function() {
				var MyClass = function(){};
				MyClass.prototype.prop1 = 1;
				MyClass.prototype.prop2 = 2;
				
				var obj = new MyClass();
				
				var arr = Kevlar.util.Object.keysToArray( obj );
				Y.Assert.areSame( 0, arr.length );
			},
			
			
			"keysToArray() should return an array of the key names of the object" : function() {
				var obj = {
					prop1: 1,
					prop2: 2
				};
				
				var arr = Kevlar.util.Object.keysToArray( obj );
				Y.ArrayAssert.itemsAreSame( [ 'prop1', 'prop2' ], arr );
			},
			
			
			"keysToArray() should return an array of the key names of the object, but ignore prototype properties" : function() {
				var MyClass = function(){
					this.myOwnedProp = 1;
				};
				MyClass.prototype.prop1 = 1;
				MyClass.prototype.prop2 = 2;
				
				var obj = new MyClass();
				
				var arr = Kevlar.util.Object.keysToArray( obj );
				Y.ArrayAssert.itemsAreSame( [ 'myOwnedProp' ], arr );
			}
		}
	]
} ) );

/*global Ext, Y, Kevlar, tests */
tests.unit.util.add( new Ext.test.TestSuite( {
	name: 'Kevlar.util.Observable',
	
	
	setUp: function() {
		
    },


	// -----------------------
	
	
	// fireEvent() tests
	
	items : [
		{
			/*
			 * Test fireEvent()
			 */
			name : "Test fireEvent()",
			
			"firing an event with two listeners, and the first one returns false, should not stop the second from running (returning false should only stop event propagation)" : function() {
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'testevent' );
				
				var handler1Fired = false, handler2Fired = false;
				observable.addListener( 'testevent', function() { handler1Fired = true; return false; } );
				observable.addListener( 'testevent', function() { handler2Fired = true; } );
				
				observable.fireEvent( 'testevent' );
				
				Y.Assert.isTrue( handler1Fired, "The first event handler should have been executed" );
				Y.Assert.isTrue( handler2Fired, "The second event handler should have been executed, even though the first returned false. Returning false should not prevent other handlers from executing, only stop event bubbling." );
			},
			
			
			
			"firing an event where one of its handlers returns false should have the call to fireEvent() return false" : function() {
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'testevent' );
				
				observable.addListener( 'testevent', function() { return false; } );
				observable.addListener( 'testevent', function() {} );
				
				Y.Assert.isFalse( observable.fireEvent( 'testevent' ), "Firing the event where the first its two handlers returned false should have caused the return from fireEvent() to be false." );
				
				// ----------------------------------------------
				
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'testevent' );
				
				observable.addListener( 'testevent', function() {} );
				observable.addListener( 'testevent', function() { return false; } );
				
				Y.Assert.isFalse( observable.fireEvent( 'testevent' ), "Firing the event where the second of its two handlers returned false should have caused the return from fireEvent() to be false." );
				
				
				// ----------------------------------------------
				
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'testevent' );
				
				observable.addListener( 'testevent', function() {} );
				observable.addListener( 'testevent', function() { return false; } );
				observable.addListener( 'testevent', function() {} );
				
				Y.Assert.isFalse( observable.fireEvent( 'testevent' ), "Firing the event where the second of its three handlers returned false should have caused the return from fireEvent() to be false." );
			},
			
			
			
			"firing an event where none of its handlers returns false should have the call to fireEvent() return true" : function() {
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'testevent' );
				
				observable.addListener( 'testevent', function() {} );
				observable.addListener( 'testevent', function() {} );
				
				Y.Assert.isTrue( observable.fireEvent( 'testevent' ), "Firing the event where none of its handlers returned false should have caused the return from fireEvent() to be true." );
			}
		},
	
		
		{
			/*
			 * Test removeListener
			 */
			name : "Test removeListener()",
			
			"removeListener() should accept an object literal of events to remove" : function() {
				var observable = new Kevlar.util.Observable();
				observable.addEvents( 'evt1', 'evt2' );
				
				var evt1count = 0,
				    evt2count = 0,
				    evt1handler = function() { evt1count++; },
				    evt2handler = function() { evt2count++; },
				    myObjScope = {};
				observable.addListener( 'evt1', evt1handler, myObjScope );
				observable.addListener( 'evt2', evt2handler, myObjScope );
				
				// Fire them to check the initial addition of listeners
				observable.fireEvent( 'evt1' );
				observable.fireEvent( 'evt2' );
				Y.Assert.areSame( 1, evt1count, "Initial condition firing should set evt1count to 1" );
				Y.Assert.areSame( 1, evt2count, "Initial condition firing should set evt2count to 1" );
				
				
				// Now remove the handlers, and fire again
				observable.removeListener( {
					'evt1' : evt1handler,
					'evt2' : evt2handler,
					scope : myObjScope
				} );
				
				// Fire them to check that the counts did not increase
				observable.fireEvent( 'evt1' );
				observable.fireEvent( 'evt2' );
				Y.Assert.areSame( 1, evt1count, "The evt1count should still be at 1, because the handler was removed" );
				Y.Assert.areSame( 1, evt2count, "The evt2count should still be at 1, because the handler was removed" );
			}
		},
		
		
		{
			/*
			 * Test event bubbling
			 */
			name : "Test event bubbling",
	
	
			"firing an event where none of its handlers returns false should have allowed the event to bubble" : function() {
				var parentObservable = new Kevlar.util.Observable();		
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( 'testevent' );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() {} );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isTrue( eventBubbledToParent, "Firing the event where none of its handlers returned false should have allowed the event to bubble." );
			},
			
			
			"firing an event where its one handler returns false should have prevented the event from bubbling" : function() {
				var parentObservable = new Kevlar.util.Observable();		
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( 'testevent' );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() { return false; } );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isFalse( eventBubbledToParent, "Firing the event its one handler returned false should have prevented the event from bubbling." );
			},
			
			
			"firing an event where one of its handlers returns false should have prevented the event from bubbling" : function() {
				var parentObservable = new Kevlar.util.Observable();		
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( 'testevent' );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() { return false; } );
				childObservable.addListener( 'testevent', function() {} );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isFalse( eventBubbledToParent, "Firing the event where the first of its two handlers returned false should have prevented the event from bubbling." );
				
				// --------------------------------------------------
				
				var parentObservable = new Kevlar.util.Observable();		
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( 'testevent' );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() {} );
				childObservable.addListener( 'testevent', function() { return false; } );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isFalse( eventBubbledToParent, "Firing the event where the second of its two handlers returned false should have prevented the event from bubbling." );
			},
			
			
			"Providing the enableBubble() method an object or array of objects should enable bubbling just the same as a string or array of strings" : function() {
				var parentObservable = new Kevlar.util.Observable();		
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( { eventName : 'testevent' } );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() {} );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isTrue( eventBubbledToParent, "The enableBubble() method should have been able to take an object as its argument to enable bubbling for an event." );
			},
			
			
			"Providing the enableBubble() method a bubbleFn that just returns false should prevent bubbling" : function() {
				var parentObservable = new Kevlar.util.Observable();
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( { 
					eventName : 'testevent', 
					bubbleFn : function( observableObj ) { return false; } 
				} );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() {} );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isFalse( eventBubbledToParent, "A bubbleFn provided to enableBubble() that simply returns false should have prevented the event from bubbling." );
			},
			
			
			"Providing the enableBubble() method a bubbleFn that returns nothing should NOT prevent bubbling" : function() {
				var parentObservable = new Kevlar.util.Observable();
				var childObservable = new Kevlar.util.Observable();  
				childObservable.getBubbleTarget = function() { return parentObservable; }; // implement getBubbleTarget for the test
				
				childObservable.addEvents( 'testevent' );
				childObservable.enableBubble( {
					eventName: 'testevent', 
					bubbleFn: function( observableObj ) { /* empty */ }
				} );
				
				var eventBubbledToParent = false;
				parentObservable.addListener( 'testevent', function() { eventBubbledToParent = true; } );
				childObservable.addListener( 'testevent', function() {} );
				
				childObservable.fireEvent( 'testevent' );
				Y.Assert.isTrue( eventBubbledToParent, "A bubbleFn provided to enableBubble() that returns nothing should have NOT prevented the event from bubbling." );
			}
		}
	]
	
} ) );

/*global Ext, tests */
(function() {
	tests.integration               = new Ext.test.TestSuite( 'integration' );
	tests.integration.persistence   = new Ext.test.TestSuite( 'persistence' ) .addTo( tests.integration );
	//tests.integration.util        = new Ext.test.TestSuite( 'util' )        .addTo( tests.integration );
	
	Ext.test.Session.addSuite( tests.integration );
})();

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Collection with Models',
	
	
	items : [
		
		{
			/*
			 * Test Model Events
			 */
			name : "Test Model Events",
			
			
			"changing an attribute in a model should fire a general 'change' event in the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 'model1Value1' } ),
				    model2 = new Model( { attr: 'model2Value1' } ),
				    collection = new Collection( [ model1, model2 ] );
				
				var changeEventCallCount = 0,
				    changeEventCollection,
				    changeEventModel,
				    changeEventAttributeName,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change', function( collection, model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventCollection = collection;
					changeEventModel = model;
					changeEventAttributeName = attributeName;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model1 should have been fired with the collection that changed" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', changeEventAttributeName, "The event for model1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model2 should have been fired with the collection that changed" );
				Y.Assert.areSame( model2, changeEventModel, "The event for model2 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', changeEventAttributeName, "The event for model2 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'model2Value2', changeEventNewValue, "The event for model2 should have been fired with the new value" );
				Y.Assert.areSame( 'model2Value1', changeEventOldValue, "The event for model2 should have been fired with the old value" );
			},
			
			
			"changing an attribute in a model should fire an attribute-specific 'change' event in the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 'model1Value1' } ),
				    model2 = new Model( { attr: 'model2Value1' } ),
				    collection = new Collection( [ model1, model2 ] );
				
				var changeEventCallCount = 0,
				    changeEventCollection,
				    changeEventModel,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change:attr', function( collection, model, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventCollection = collection;
					changeEventModel = model;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model1 should have been fired with the collection that changed" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model2 should have been fired with the collection that changed" );
				Y.Assert.areSame( model2, changeEventModel, "The event for model2 should have been fired with the model that changed" );
				Y.Assert.areSame( 'model2Value2', changeEventNewValue, "The event for model2 should have been fired with the new value" );
				Y.Assert.areSame( 'model2Value1', changeEventOldValue, "The event for model2 should have been fired with the old value" );
			},
			
			
			"Any event that the Model fires should be relayed by the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					initialize : function() {
						this.addEvents( 'testevent' );
					}, 
					
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Collection( [ model1, model2 ] );
				
				var testEventCallCount = 0,
				    testEventCollection,
				    testEventModel,
				    testEventArg1,
				    testEventArg2,
				    testEventArg3;
				
				collection.on( 'testevent', function( collection, model, arg1, arg2, arg3 ) {
					testEventCallCount++;
					testEventCollection = collection;
					testEventModel = model;
					testEventArg1 = arg1;
					testEventArg2 = arg2;
					testEventArg3 = arg3;
				} );
				
				model1.fireEvent( 'testevent', model1, 1, 2, 3 );
				Y.Assert.areSame( 1, testEventCallCount, "The testevent should have been called exactly once" );
				Y.Assert.areSame( collection, testEventCollection, "The testevent should have been called with the collection (as it was provided)" );
				Y.Assert.areSame( model1, testEventModel, "The testevent should have been called with the model (as it was provided)" );
				Y.Assert.areSame( 1, testEventArg1, "arg1 should have been provided" );
				Y.Assert.areSame( 2, testEventArg2, "arg2 should have been provided" );
				Y.Assert.areSame( 3, testEventArg3, "arg3 should have been provided" );
			},
			
			
			"After a model has been removed from the Collection, the collection should no longer relay its events" : function() {
				var Model = Kevlar.Model.extend( {
					initialize : function() {
						this.addEvents( 'testevent' );
					}, 
					
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Collection( [ model1, model2 ] );
				
				var testEventCallCount = 0;
				
				collection.on( 'testevent', function() {
					testEventCallCount++;
				} );
				
				// Remove the model before firing the event
				collection.remove( model1 );
				
				model1.fireEvent( 'testevent' );
				Y.Assert.areSame( 0, testEventCallCount, "The testevent should *not* have been fired from the collection, as the child model was removed" );
			}
		},
		
		
		{
			/*
			 * Test isModified()
			 */
			name : "Test isModified()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 
						{ name : 'attr' },
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false } 
					]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"isModified() should return false if no Models within the collection have been modified" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
								
				Y.Assert.isFalse( collection.isModified() );
			},
			
			
			"isModified() should return true if a Model within the collection has been modified" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				model1.set( 'attr', 42 );
				
				Y.Assert.isTrue( collection.isModified() );
			},
			
			
			"isModified() should return false if a Model within the collection has been modified, but then rolled back or committed" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				model1.set( 'attr', 42 );
				Y.Assert.isTrue( collection.isModified(), "Just double checking that the collection is considered modified, before rolling back" );
				model1.rollback();
				Y.Assert.isFalse( collection.isModified(), "Should be false after rollback" );
				
				
				model1.set( 'attr', 42 );
				Y.Assert.isTrue( collection.isModified(), "Just double checking that the collection is considered modified again, before committing" );
				model1.commit();
				Y.Assert.isFalse( collection.isModified(), "Should be false after commit" );
			},
			
			
			// -------------------------
			
			// Test with the 'persistedOnly' option
			
			
			"With the 'persistedOnly' option, isModified() should only return true if one of its models has a persisted attribute that has been changed" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				Y.Assert.isFalse( collection.isModified( { persistedOnly: true } ), "Initial condition: the collection should not be considered modified with the 'persistedOnly' option set" );
				
				model2.set( 'persistedAttr', 'newValue' );
				Y.Assert.isTrue( collection.isModified( { persistedOnly: true } ), "The collection should now be considered modified, as it has a model with a persisted attribute that has been modified" );
			},
			
			
			"With the 'persistedOnly' option, isModified() should return false if none of its models have a persisted attribute that has been changed" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.isFalse( collection.isModified(), "Initial condition: the collection should not be considered modified" );
				Y.Assert.isFalse( collection.isModified( { persistedOnly: true } ), "Initial condition: the collection should not be considered modified with the 'persistedOnly' option set" );
				
				model2.set( 'unpersistedAttr', 'newValue' );
				Y.Assert.isFalse( collection.isModified( { persistedOnly: true } ), "The collection should *not* be considered modified, as its models only have unpersisted attribute changes" );
			}
		},
		
		
		{
			/*
			 * Test destroying a model. It should be removed from the collection.
			 */
			name : "Test destroying a model. It should be removed from the collection.",
			
			"When a model is destroyed, it should be removed from the collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    collection = new Collection( [ model1, model2 ] );
				
				Y.Assert.isTrue( collection.has( model1 ), "Initial condition: the collection should have model1" );
				
				model1.destroy();
				Y.Assert.isFalse( collection.has( model1 ), "model1 should have been removed from the collection upon destruction" );
			}
		}
	]

} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ModelAttribute',
	
	
	items : [
		{
			/*
			 * Test provided set() function
			 */
			name : "Test provided set() function",
			
			
			"The set() function provided to a ModelAttribute should be passed the instantiated Model if a 'modelClass' config is provided" : function() {
				var setValue;
				
				var InnerModel = Kevlar.Model.extend( {
					attributes : [ 'someAttr' ]
				} );
				
				var Model = Kevlar.Model.extend( {
					attributes : [
						{
							name : 'attr',
							type : 'model',
							modelClass : InnerModel,
							
							set : function( value ) {
								setValue = value;
								return value;
							}
						}
					]
				} );
				
				var model = new Model( {
					attr : { someAttr: 1 }
				} );
				Y.Assert.isInstanceOf( InnerModel, setValue );
			}
		},
		
		
		{
			/*
			 * Test retrieving the inner model from the outer model after it is set
			 */
			name : "Test retrieving the inner model from the outer model after it is set",
			
			
			"The get() method should be able to retrieve the Model after it has been set" : function() {
				var InnerModel = Kevlar.Model.extend( {
					attributes : [ 'someValue' ]
				} );
				
				var Model = Kevlar.Model.extend( {
					attributes : [
						{
							name : 'innerModel',
							type : 'model',
							modelClass : InnerModel
						}
					]
				} );
				
				var model = new Model( {
					innerModel : { someValue: 1 }
				} );
				var innerModel = model.get( 'innerModel' );
				
				Y.Assert.isInstanceOf( InnerModel, innerModel );
			}
		}
	]
	
} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ModelCache',
	
	
	items : [		
		{
			/*
			 * Duplicate models should not be able to be instantiated
			 */
			name : "Duplicate models should not be able to be instantiated",
			
			
			// Tests making sure different types / ids do NOT return the same model instance	
			"Instatiating two models of different types, but the same instance ID, should *not* be 'combined' into the same instance" : function() {
				var ModelClass1 = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				var ModelClass2 = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new ModelClass1( { id: 1 } );  // same id, but
				var model2 = new ModelClass2( { id: 1 } );  // different classes
				
				Y.Assert.areNotSame( model1, model2 );
			},
			
			
			"Instatiating two models of the same type, but the different instance IDs, should *not* be 'combined' into the same instance" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1 } );  // different id, but
				var model2 = new Model( { id: 2 } );  // same class
				
				Y.Assert.areNotSame( model1, model2 );
			},
			
			
			// Tests making sure that the same type/id returns the same model instance, and combines the data
			
			"Instantiating two models of both the same type, and which have the same instance ID, should really become the same single instance (i.e. not duplicating it). The same reference should be returned when constructing the duplicate model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1 } );
				var model2 = new Model( { id: 1 } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
			},


			"Instantiating one model and setting the ID later, then instantiating another with the same ID, the two models should point to the same instance" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model();
				model1.set( 'id', 1 );

				var model2 = new Model( { id: 1 } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
			},
			
			
			"Instantiating two models with the same ID should combine the initial data, with still, only one actual instance should be created" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id', 'firstName', 'lastName' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1, firstName: "Joe" } );
				var model2 = new Model( { id: 1, lastName: "Shmo" } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
				
				// Make sure that the data was combined onto the same model instance
				Y.Assert.areSame( "Joe", model1.get( 'firstName' ) );
				Y.Assert.areSame( "Shmo", model1.get( 'lastName' ) ); 
			}
		}
	]
		

} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with NativeObjectConverter',
	
	
	items : [
		{
			name : "Test getData()",
			ttype : 'suite',
			
			items : [
				{
					"Model::getData() should return a key for each of the Attributes in the Model, whether or not any data has been set to them" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model( { attribute1: 'value1' } );
						
						var data = model.getData();
						Y.ObjectAssert.hasKey( 'attribute1', data, "The data returned should have attribute1" );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.ObjectAssert.hasKey( 'attribute2', data, "The data returned should have attribute2, even though no value has been set to it" );
						Y.Assert.isUndefined( data.attribute2, "attribute2 should be undefined in the returned data" );
					},
					
					
					"Model::getData() should return the data by running attributes' `get` functions (not just returning the raw data), when the `raw` option is not provided" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } }
							]
						} );
						var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
						
						var data = model.getData();
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
					},
					
					
					// -------------------------------
					
					// Test with `raw` option set to true
					
					"when the `raw` option is provided as true, Model::getData() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } },
								{ name: 'attribute3', raw: function( value ) { return value + " " + this.get( 'attribute1' ); } }
							]
						} );
						var model = new Model( { attribute1: 'value1', attribute2: 'value2', attribute3: 'value3' } );
						
						var data = model.getData( { raw: true } );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
						Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
					},
					
					
					// -------------------------------
					
					// Test with `persistedOnly` option set to true
					
					"Model::getData() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) with the `persistedOnly` option set to true" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								{ name : 'attribute1', persist: true },
								{ name : 'attribute2', persist: false },
								{ name : 'attribute3', persist: true },
								{ name : 'attribute4', persist: false }
							]
						} );
						
						var model = new Model();
						
						var persistedData = model.getData( { persistedOnly: true } );
						Y.Assert.areSame( 2, Kevlar.util.Object.length( persistedData ), "The persisted data should only have 2 properties" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], persistedData, "The persisted data should have 'attribute1' and 'attribute3'" );
					}
				}
			]
		},
		
		
		{
			name : "Test getChanges()",
			ttype : 'suite',
			
			items : [
				{
					"Model::getChanges() should return a single attribute that has had its value changed" : function() {
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model();
						model.set( 'attribute1', "new value" );
						
						var changes = model.getChanges();
						Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 1 property" );
						Y.Assert.areSame( "new value", changes.attribute1, "The change to attribute1 should have been 'new value'." );
					},
					
					"Model::getChanges() should return multiple attributes that have had their values changed" : function() {
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model();
						model.set( 'attribute1', "new value 1" );
						model.set( 'attribute2', "new value 2" );
						
						var changes = model.getChanges();
						Y.Assert.areSame( 2, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 2 properties" );
						Y.Assert.areSame( "new value 1", changes.attribute1, "The change to attribute1 should have been 'new value 1'." );
						Y.Assert.areSame( "new value 2", changes.attribute2, "The change to attribute2 should have been 'new value 2'." );
					},
					
					
					"Model::getChanges() should return the data by running attributes' `get` functions (not just returning the raw data)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } },
								'attribute3'
							]
						} );
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' ); 
						
						var data = model.getChanges();
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
						Y.Assert.isFalse( 'attribute3' in data, "attribute3 should not exist in the 'changes' data, as it was never changed" );
					},
					
					
					// -------------------------------
					
					// Test with `raw` option set to true
					
					"when the `raw` option is provided as true, Model::getChanges() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								'attribute1', 
								{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } },
								{ name: 'attribute3', raw: function( value ) { return value + " " + this.get( 'attribute1' ); } },
								{ name: 'attribute4', defaultValue: 'value4' }
							]
						} );
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' ); 
						model.set( 'attribute3', 'value3' ); 
						
						var data = model.getChanges( { raw: true } );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
						Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
						Y.Assert.isFalse( 'attribute4' in data, "attribute4 should not exist in the 'changes' data, as it was never changed" );
					},
					
					
					// -------------------------------
					
					// Test with `persistedOnly` option set to true
					
					"Model::getChanges() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) that have been changed when the `persistedOnly` option is set to true" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								{ name : 'attribute1', persist: true },
								{ name : 'attribute2', persist: false },
								{ name : 'attribute3', persist: true },
								{ name : 'attribute4', persist: false }
							]
						} );
						
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' );
						
						var persistedChanges = model.getChanges( { persistedOnly: true } );
						Y.Assert.areSame( 1, Kevlar.util.Object.length( persistedChanges ), "The persisted changes should only have 1 property" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1' ], persistedChanges, "The persisted changes should only have 'attribute1'" );
					}
				}
			]
		}
	]
	
} ) );
	

/*global window, Ext, Y, JsMockito, tests, Class, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with Nested Collections',
	
	
	items : [
		{
			/*
			 * Test setting nested Collections
			 */
			name : "Test setting nested Collections",
			
			
			"set() should only change the attribute that a nested Collection is being set to if it is a different Collection than it already has" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name: 'nestedCollection', type: 'collection' }
					]
				} );
				var NestedCollection = Kevlar.Collection.extend( {} );
				
				var model = new Model();
				var nestedCollection1 = new NestedCollection();
				var nestedCollection2 = new NestedCollection();
				
				
				// Add event handlers to determine when actual "sets" have been done
				var setCount = 0;
				model.addListener( 'change:nestedCollection', function() { setCount++; } );
				
				// Add random subscriptions to nestedCollection events, just to make sure this doesn't cause an issue.
				// (Using the old method of simply deep comparing the old object and the new object, which was unaware of 
				// nested Models, this would cause a "maximum call stack size exceeded" error on set())
				nestedCollection1.on( 'add', function(){} );
				nestedCollection2.on( 'remove', function(){} );
				
				
				// Set for the first time
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 1, setCount, "The collection should have been set for the first time" );
				
				// Now set the collection the second time. Should *not* fire a change event
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 1, setCount, "The collection should not have been re-set, because it is the same collection that is already there" );
				
				
				// Set the second nestedCollection now
				model.set( 'nestedCollection', nestedCollection2 );
				Y.Assert.areSame( 2, setCount, "The new collection (nestedCollection2) should have been set" );
				
				// Now set the second model the second time. Should *not* fire a change event
				model.set( 'nestedCollection', nestedCollection2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should not have been re-set, because it is the same model that is already there" );
				
				
				// Set to null, to make sure we accept collections again afterwards
				model.set( 'nestedCollection', null );
				Y.Assert.areSame( 3, setCount, "The attribute should have been set to null" );
				
				// Now set to a collection again
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 4, setCount, "The attribute should have been set to nestedCollection1 after it had been null" );
			}
		},
		
		
		
		{
			/*
			 * Test the 'change' event for embedded collections
			 */
			name : "Test the 'change' event for embedded collections",
			
			
			
			"When an attribute has changed in a model of an embedded collection, its parent collection should fire the appropriate 'change' events" : function() {
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ],
					toString : function() { return "(ChildModel)"; }
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel,
					toString : function() { return "(Collection)"; }
				} );
				
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'myCollection', type: 'Collection', embedded: true } ],
					toString : function() { return "(ParentModel)"; }
				} );
				
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { myCollection: collection } );
				
				
				// A class to store the results
				var ChangeEventResults = Class( {
					constructor : function( model, attributeName, newValue, oldValue ) {
						this.model = model;
						this.attributeName = attributeName;
						this.newValue = newValue;
						this.oldValue = oldValue;
					}
				} );
				
				var CollectionChangeEventResults = ChangeEventResults.extend( {
					constructor : function( collection, model, attributeName, newValue, oldValue ) {
						this.collection = collection;
						this._super( [ model, attributeName, newValue, oldValue ] );
					}
				} );
				
				
				// 'change'
				var changeEventCallCount = 0,
				    changeEvent;
				
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEvent = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:myCollection'
				var attrSpecificChangeEventCallCount = 0,
				    attrSpecificChangeEvent;
				
				parentModel.on( 'change:myCollection', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCallCount++;
					attrSpecificChangeEvent = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:myCollection.*'
				var attrSpecificChangeAttrEventCallCount = 0,
				    attrSpecificChangeAttrEvent;
				
				parentModel.on( 'change:myCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					attrSpecificChangeAttrEventCallCount++;
					attrSpecificChangeAttrEvent = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				childModel1.set( 'attr', 'newValue1' );
				
				// 'change'
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( parentModel, changeEvent.model, "The event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( 'myCollection', changeEvent.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( collection, changeEvent.newValue, "The event for childModel1 should have been fired with the newValue of the collection" );
				Y.Assert.areSame( collection, changeEvent.oldValue, "The event for childModel1 should have been fired with the oldValue of the collection" );
				
				// 'change:myCollection'
				Y.Assert.areSame( 1, attrSpecificChangeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( parentModel, attrSpecificChangeEvent.model, "The attribute-specific event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( collection, attrSpecificChangeEvent.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue of the collection" );
				Y.Assert.areSame( collection, attrSpecificChangeEvent.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue of the collection" );
				
				// 'change:myCollection.*'
				Y.Assert.areSame( 1, attrSpecificChangeAttrEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, attrSpecificChangeAttrEvent.collection, "The attribute-specific event for childModel1 should have been fired with the collection" );
				Y.Assert.areSame( childModel1, attrSpecificChangeAttrEvent.model, "The attribute-specific event for childModel1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', attrSpecificChangeAttrEvent.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'newValue1', attrSpecificChangeAttrEvent.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue" );
				Y.Assert.areSame( 'origValue1', attrSpecificChangeAttrEvent.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue" );
			},
			
			
			
			"When an attribute has changed in a non-embedded collection, its parent model should *not* fire a 'change' event" : function() {
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'myCollection', type: 'collection', embedded: false } ]
				} );
				
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { myCollection: collection } );
				
				var changeEventCallCount = 0;
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
				} );
				
				childModel1.set( 'attr', 'newValue1' );
				Y.Assert.areSame( 0, changeEventCallCount, "The call count should be 0 - it is not an embedded collection" );
			},
			
			
			"The parent model should no longer fire events from the child collection after the child collection has been un-set from the parent" : function() {
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'myCollection', type: 'collection', embedded: true } ]
				} );
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { myCollection: collection } );
				
				var changeEventCallCount = 0;
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
				} );
				
				// Set a value in a child model. We should get a change event.
				childModel1.set( 'attr', 'newValue1' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be 1 (as an initial test)" );
				
				
				// Now, unset the child collection, and then set another attribute on a model within it. We should not get another change event.
				parentModel.set( 'myCollection', null );
				childModel1.set( 'attr', 'newNewValue1' );
				
				Y.Assert.areSame( 2, changeEventCallCount, "We should now only have 2 for the event firing count, as we un-set the child model from the parent (which was the +1), but shouldn't get 3 from childModel1's event" );
			},
						
			
			
			// ------------------------------
			
			// Test multiple levels of embedded models and collections
			
			/* Need to fully implement...
			"When an attribute has changed in a deeply nested embedded model/collection, its uppermost parent model should fire 'change' events for every step of the way" : function() {
				// Creating a structure as such:
				// 
				// ParentModel
				//   ParentCollection
				//     IntermediateModel
				//       ChildCollection
				//         ChildModel
								
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'parentCollection', type: 'Collection', embedded: true } ],
					toString : function() { return "(ParentModel)"; }
				} );
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [ { name: 'childCollection', type: 'Collection', embedded: true } ],
					toString : function() { return "(IntermediateModel)"; }
				} );
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ],
					toString : function() { return "(ChildModel)"; }
				} );
				
				var ParentCollection = Kevlar.Collection.extend( {
					model : IntermediateModel,
					toString : function() { return "(ParentCollection)"; }
				} );
				var ChildCollection = Kevlar.Collection.extend( {
					model : ChildModel,
					toString : function() { return "(ChildCollection)"; }
				} );
				
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    childCollection = new ChildCollection( [ childModel1, childModel2 ] ),
				    intermediateModel = new IntermediateModel( { childCollection: childCollection } ),
				    parentCollection = new ParentCollection( [ intermediateModel ] ),
				    parentModel = new ParentModel( { parentCollection: parentCollection } );
				
				
				// A class to store the results
				var ChangeEventResults = Class( {
					constructor : function( model, attributeName, newValue, oldValue ) {
						this.model = model;
						this.attributeName = attributeName;
						this.newValue = newValue;
						this.oldValue = oldValue;
					}
				} );
				
				var CollectionChangeEventResults = ChangeEventResults.extend( {
					constructor : function( collection, model, attributeName, newValue, oldValue ) {
						this.collection = collection;
						this._super( [ model, attributeName, newValue, oldValue ] );
					}
				} );
				
				
				// 'change'
				var parentModelChangeCallCount = 0,
				    parentModelChange;
				
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					parentModelChangeCallCount++;
					parentModelChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection'
				var parentCollectionChangeCallCount = 0,
				    parentCollectionChange;
				
				parentModel.on( 'change:parentCollection', function( model, newValue, oldValue ) {
					parentCollectionChangeCallCount++;
					parentCollectionChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.*'
				var parentCollectionAttrChangeCallCount = 0,
				    parentCollectionAttrChange;
				
				parentModel.on( 'change:parentCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					parentCollectionAttrChangeCallCount++;
					parentCollectionAttrChange = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection'
				var childCollectionChangeCallCount = 0,
				    childCollectionChange;
				
				parentModel.on( 'change:parentCollection.childCollection', function( model, newValue, oldValue ) {
					childCollectionChangeCallCount++;
					childCollectionChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection.*'
				var childCollectionAttrChangeCallCount = 0,
				    childCollectionAttrChange;
				
				parentModel.on( 'change:parentCollection.childCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					childCollectionAttrChangeCallCount++;
					childCollectionAttrChange = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection.attr'
				var childModelChangeCallCount = 0,
				    childModelChange;
				
				parentModel.on( 'change:parentCollection.childCollection.attr', function( collection, model, newValue, oldValue ) {
					childModelChangeCallCount++;
					childModelChange = new CollectionChangeEventResults( collection, model, newValue, oldValue );
				} );
				
				
				childModel1.set( 'attr', 'newValue1' );
				
				// 'change:parentCollection.childCollection.attr'
				Y.Assert.areSame( 1, childModelChangeCallCount, "The childModelChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( childCollection, childModelChange.collection, "The childModelChange should have been fired with the childCollection" );
				Y.Assert.areSame( childModel1, childModelChange.model, "The childModelChange should have been fired with childModel1" );
				Y.Assert.areSame( 'newValue1', childModelChange.newValue, "The childModelChangeshould have been fired with the correct newValue" );
				Y.Assert.areSame( 'origValue1', childModelChange.oldValue, "The childModelChange should have been fired with the correct oldValue" );
				
				// 'change:parentCollection.childCollection.*'
				Y.Assert.areSame( 1, childCollectionAttrChangeCallCount, "The childCollectionAttrChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( childCollection, childCollectionAttrChange.collection, "The attribute-specific event for childModel1 should have been fired with the collection" );
				Y.Assert.areSame( childModel1, childCollectionAttrChange.model, "The attribute-specific event for childModel1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', childCollectionAttrChange.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'newValue1', childCollectionAttrChange.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue" );
				Y.Assert.areSame( 'origValue1', childCollectionAttrChange.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue" );
				
				// 'change:parentCollection.childCollection'
				Y.Assert.areSame( 1, childCollectionChangeCallCount, "The childCollectionChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( intermediateModel, childCollectionChange.model, "The attribute-specific event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( childCollection, childCollectionChange.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue of the childCollection" );
				Y.Assert.areSame( childCollection, childCollectionChange.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue of the childCollection" );
				
				// 'change:parentCollection.*'
				Y.Assert.areSame( 1, parentCollectionAttrChangeCallCount, "The parentCollectionAttrChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentCollection, parentCollectionAttrChange.collection, "The parentCollectionAttrChange should have been fired with the collection" );
				Y.Assert.areSame( intermediateModel, parentCollectionAttrChange.model, "The parentCollectionAttrChange should have been fired with the model that changed" );
				Y.Assert.areSame( 'childCollection', parentCollectionAttrChange.attributeName, "The parentCollectionAttrChange should have been fired with the correct attribute name" );
				Y.Assert.areSame( childCollection, parentCollectionAttrChange.newValue, "The parentCollectionAttrChange should have been fired with the childCollection" );
				Y.Assert.areSame( childCollection, parentCollectionAttrChange.oldValue, "The parentCollectionAttrChange should have been fired with the childCollection" );
				
				// 'change:parentCollection'
				Y.Assert.areSame( 1, parentCollectionChangeCallCount, "The parentCollectionChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentModel, parentCollectionChange.model, "The parentCollectionChange should have been fired with the parentModel" );
				Y.Assert.areSame( parentCollection, parentCollectionChange.newValue, "The parentCollectionChange should have been fired with the newValue of the parentCollection" );
				Y.Assert.areSame( parentCollection, parentCollectionChange.oldValue, "The parentCollectionChange should have been fired with the oldValue of the parentCollection" );
				
				// 'change'
				Y.Assert.areSame( 1, parentModelChangeCallCount, "The parentModelChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentModel, parentModelChange.model, "The parentModelChange should have been fired with the parentModel" );
				Y.Assert.areSame( 'parentCollection', parentModelChange.attributeName, "The parentModelChange should have been fired with the correct attribute name" );
				Y.Assert.areSame( parentCollection, parentModelChange.newValue, "The parentModelChange should have been fired with the newValue of the parentCollection" );
				Y.Assert.areSame( parentCollection, parentModelChange.oldValue, "The parentModelChange should have been fired with the oldValue of the parentCollection" );
			},*/
			
			
			// ------------------------------
			
			// Test that a parent model fires a change event when a child collection is added to / removed from / reordered
			
			"When a child collection is added to / removed from / reordered, the parent model should fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'childCollection', type: 'collection', embedded: true } ],
					
					toString : function() { return "(ParentModel)"; }  // for debugging
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [ { name : 'attr', type: 'string' } ],
					
					toString : function() { return "(ChildModel)"; }  // for debugging
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel,
					
					toString : function() { return "(Collection)"; }  // for debugging
				} );
				
				
				var childModel1 = new ChildModel( { attr: 1 } ),
				    childModel2 = new ChildModel( { attr: 2 } ),
				    childModel3 = new ChildModel( { attr: 3 } ),  // not added to the collection initially
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { childCollection: collection } );
				
				
				var addSetEventCount = 0,
				    removeSetEventCount = 0,
				    reorderEventCount = 0;
				collection.on( 'addset', function() { addSetEventCount++; } );
				collection.on( 'removeset', function() { removeSetEventCount++; } );
				collection.on( 'reorder', function() { reorderEventCount++; } );
				
								
				var changeEventCount = 0,
				    changeModel, changeAttr, changeNewVal, changeOldVal;
				    
				parentModel.on( 'change', function( model, attr, newVal, oldVal ) {
					changeEventCount++;
					changeModel = model; changeAttr = attr; changeNewVal = newVal; changeOldVal = oldVal;
				} );
				
				
				Y.Assert.areSame( 0, addSetEventCount, "Initial condition: the addSetEventCount should be 0" );
				Y.Assert.areSame( 0, removeSetEventCount, "Initial condition: the removeSetEventCount should be 0" );
				Y.Assert.areSame( 0, reorderEventCount, "Initial condition: the reorderEventCount should be 0" );
				Y.Assert.areSame( 0, changeEventCount, "Initial condition: the changeCount should be 0" );
				
				
				collection.add( childModel3 );
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should now be 1" );
				Y.Assert.areSame( 0, removeSetEventCount, "The removeSetEventCount should still be 0" );
				Y.Assert.areSame( 0, reorderEventCount, "The reorderEventCount should still be 0" );
				Y.Assert.areSame( 1, changeEventCount, "The changeEventCount should now be 1 after an 'add' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for an add event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for an add event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for an add event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for an add event" );
				
				collection.remove( childModel3 );
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should still be 1" );
				Y.Assert.areSame( 1, removeSetEventCount, "The removeSetEventCount should now be 1" );
				Y.Assert.areSame( 0, reorderEventCount, "The reorderEventCount should still be 0" );
				Y.Assert.areSame( 2, changeEventCount, "The changeEventCount should now be 2 after a 'remove' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for a remove event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for a remove event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for a remove event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for a remove event" );
				
				collection.insert( childModel1, 1 );  // "reorder" childModel1 to the 2nd position
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should still be 1" );
				Y.Assert.areSame( 1, removeSetEventCount, "The removeSetEventCount should still be 1" );
				Y.Assert.areSame( 1, reorderEventCount, "The reorderEventCount should now be 1" );
				Y.Assert.areSame( 3, changeEventCount, "The changeEventCount should now be 3 after a 'reorder' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for a reorder event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for a reorder event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for a reorder event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for a reorder event" );
			}
		},
		
		
		{
			/*
			 * Test that the parent model "has changes" when an embedded collection is changed 
			 */
			name : "Test that the parent model \"has changes\" when an embedded collection is changed",
			
			"The parent model should have changes when a child embedded collection has changes" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'myCollection', type: 'collection', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var collection = new Collection( [ { attr: 1 }, { attr: 2 } ] );
				var parentModel = new ParentModel( {
					myCollection: collection
				} );
				
				collection.getAt( 0 ).set( 'attr', 'newValue' );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while a model in its child collection is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'myCollection' ), "The 'myCollection' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child collection has changes, but is not 'embedded'" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'myCollection', type: 'collection', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var collection = new Collection( [ { attr: 1 }, { attr: 2 } ] );
				var parentModel = new ParentModel( {
					myCollection: collection
				} );
				
				collection.getAt( 0 ).set( 'attr', 'newValue' );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child collection is 'modified', because the child is not 'embedded'" );
			}
		}
	]
	
} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with Nested Models',
	
	
	items : [
		{
			/*
			 * Test setting nested Models
			 */
			name : "Test setting nested Models",
			
			
			"set() should only change the attribute that a nested Model is being set to if it is a different model than it already has" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name: 'nestedModel', type: 'model' }
					]
				} );
				var NestedModel = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				var model = new Model();
				var nestedModel1 = new NestedModel();
				var nestedModel2 = new NestedModel();
				
				
				// Add event handlers to determine when actual "sets" have been done
				var setCount = 0;
				model.addListener( 'change:nestedModel', function() { setCount++; } );
				
				// Add random subscriptions to nestedModel events, just to make sure this doesn't cause an issue.
				// (Using the old method of simply deep comparing the old object and the new object, which was unaware of 
				// nested Models, this would cause a "maximum call stack size exceeded" error on set())
				nestedModel1.on( 'change:attr1', function(){} );
				nestedModel2.on( 'change:attr1', function(){} );
				
				
				// Set for the first time
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 1, setCount, "The model should have been set for the first time" );
				
				// Now set the model the second time. Should *not* fire a change event
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 1, setCount, "The model should not have been re-set, because it is the same model that is already there" );
				
				
				// Set the second nestedModel now
				model.set( 'nestedModel', nestedModel2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should have been set" );
				
				// Now set the second model the second time. Should *not* fire a change event
				model.set( 'nestedModel', nestedModel2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should not have been re-set, because it is the same model that is already there" );
				
				
				// Set to null, to make sure we accept models again afterwards
				model.set( 'nestedModel', null );
				Y.Assert.areSame( 3, setCount, "The attribute should have been set to null" );
				
				// Now set to a model again
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 4, setCount, "The attribute should have been set to nestedModel1 after it had been null" );
			}
		},
		
		
		
		{
			/*
			 * Test the 'change' event for embedded models
			 */
			name : "Test the 'change' event for embedded models",
			
			
			
			"When an attribute has changed in an embedded model, its parent model should fire the appropriate 'change' events" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				
				// A class to store the results
				var ChangeEventResults = function( model, attributeName, newValue, oldValue ) {
					this.model = model;
					this.attributeName = attributeName;
					this.newValue = newValue;
					this.oldValue = oldValue;
				};
				
				
				// Subscribe to the general 'change' event
				var parentGeneralChangeEventCount = 0,
				    parentGeneralChange;
				    
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					parentGeneralChangeEventCount++;
					parentGeneralChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but child model-specific) 'change' event for the embedded model itself
				var generalModelSpecificChangeEventCount = 0,
				    generalModelSpecificChange;
				    
				parentModel.on( 'change:child', function( model, newValue, oldValue ) {
					generalModelSpecificChangeEventCount++;
					generalModelSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but child model-specific) 'change' event for attributes on the embedded model itself
				var generalModelSpecificAttrChangeEventCount = 0,
				    generalModelSpecificAttrChange;
				    
				parentModel.on( 'change:child.*', function( model, attributeName, newValue, oldValue ) {
					generalModelSpecificAttrChangeEventCount++;
					generalModelSpecificAttrChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChange;
				    
				parentModel.on( 'change:child.attr', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCount++;
					attrSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				// 'change'
				Y.Assert.areSame( 1, parentGeneralChangeEventCount, "The parent's general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, parentGeneralChange.model, "The parent's general change event should have fired with the parent model" );
				Y.Assert.areSame( 'child', parentGeneralChange.attributeName, "The parent's general change event should have fired with attributeName for the childModel" );
				Y.Assert.areSame( childModel, parentGeneralChange.newValue, "The parent's general change event should have fired with the new value" );
				Y.Assert.areSame( childModel, parentGeneralChange.oldValue, "The parent's general change event should have fired with the old value" );
				
				// 'change:child'
				Y.Assert.areSame( 1, generalModelSpecificChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalModelSpecificChange.model, "The childModel-specific change event should have fired with the parent model" );
				Y.Assert.areSame( childModel, generalModelSpecificChange.newValue, "The childModel-specific change event should have fired with the new value" );
				Y.Assert.areSame( childModel, generalModelSpecificChange.oldValue, "The childModel-specific change event should have fired with the old value" );
				
				// 'change:child.*'
				Y.Assert.areSame( 1, generalModelSpecificAttrChangeEventCount, "The childModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( childModel, generalModelSpecificAttrChange.model, "The childModel-specific attribute change event should have fired with the child model" );
				Y.Assert.areSame( 'attr', generalModelSpecificAttrChange.attributeName, "The childModel-specific attribute change event should have fired with attributeName of the changed attribute" );
				Y.Assert.areSame( 'asdf', generalModelSpecificAttrChange.newValue, "The childModel-specific attribute change event should have fired with the new value" );
				Y.Assert.isUndefined( generalModelSpecificAttrChange.oldValue, "The childModel-specific attribute change event should have fired with the old value" );
				
				// 'change:child.attr'
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChange.model, "The attribute-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', attrSpecificChange.newValue, "The attribute-specific change event should have fired with the new value" );
				Y.Assert.isUndefined( attrSpecificChange.oldValue, "The attribute-specific change event should have fired with the old value" );
			},
			
			
			"When an attribute has changed in a non-embedded model, its parent model should *not* fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: false }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				var changeEventFired = false;    
				parentModel.on( 'change', function() {
					changeEventFired = true;
				} );
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.isFalse( changeEventFired );
			},
			
			
			"The parent model should no longer fire events from the child model after the child model has been un-set from the parent" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				var attrChangeEventCount = 0;
				parentModel.on( 'change', function( model, attrName, newValue ) {
					attrChangeEventCount++;
				} );
				
				
				// Set a value in the child model. We should get a change event.
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.areSame( 1, attrChangeEventCount, "while the child model is attached, the change event count should have increased by 1" );
				
				
				// Now, unset the child model, and then set another attribute in it. We should not get another change event.
				parentModel.set( 'child', null );
				childModel.set( 'attr', 'asdf2' );
				
				Y.Assert.areSame( 2, attrChangeEventCount, "We should only have 2 for the event firing count, as we un-set the child model from the parent (which is the +1), but then events on the childModel beyond that should not be counted" );
			},
			
			
			// ------------------------------
			
			// Test multiple levels of embedded models
			
			
			"When an attribute has changed in a deeply nested embedded model, its parent model should fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'intermediate', type: 'model', embedded: true }
					],
					
					toString : function() { return "(ParentModel)"; }  // for debugging
				} );
				
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					],
					
					toString : function() { return "(IntermediateModel)"; }  // for debugging
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					],
					
					toString : function() { return "(ChildModel)"; }  // for debugging
				} );
				
				
				// Create the models 
				var parentModel = new ParentModel(),
				    intermediateModel = new IntermediateModel(),
				    childModel = new ChildModel();
				    
				parentModel.set( 'intermediate', intermediateModel );
				intermediateModel.set( 'child', childModel );
				
				
				
				// A class to store the results
				var ChangeEventResults = function( model, attributeName, newValue, oldValue ) {
					this.model = model;
					this.attributeName = attributeName;
					this.newValue = newValue;
					this.oldValue = oldValue;
				};
				
				
				// Subscribe to the general 'change' event
				var generalChangeEventCount = 0,
				    generalChange;
				    
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					generalChangeEventCount++;
					generalChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but intermediate model-specific) 'change' event for the embedded model itself
				var intermediateModelChangeEventCount = 0,
				    intermediateModelChange;
				
				parentModel.on( 'change:intermediate', function( model, newValue, oldValue ) {
					intermediateModelChangeEventCount++;
					intermediateModelChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the attribute changes of the intermediate model
				var intermediateModelAttrChangeEventCount = 0,
				    intermediateModelAttrChange;
				
				parentModel.on( 'change:intermediate.*', function( model, attributeName, newValue, oldValue ) {
					intermediateModelAttrChangeEventCount++;
					intermediateModelAttrChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event
				var childModelChangeEventCount = 0,
				    childModelChange;
				
				parentModel.on( 'change:intermediate.child', function( model, newValue, oldValue ) {
					childModelChangeEventCount++;
					childModelChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event for attributes
				var childModelChangeAttrEventCount = 0,
				    childModelChangeAttr;
				
				parentModel.on( 'change:intermediate.child.*', function( model, attributeName, newValue, oldValue ) {
					childModelChangeAttrEventCount++;
					childModelChangeAttr = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the deeply embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChange;
				    
				parentModel.on( 'change:intermediate.child.attr', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCount++;
					attrSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				// 'change'
				Y.Assert.areSame( 1, generalChangeEventCount, "The general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalChange.model, "The general change event should have fired with the parent model" );
				Y.Assert.areSame( 'intermediate', generalChange.attributeName, "The general change event should have fired with the attributeName as the intermediate model" );
				Y.Assert.areSame( intermediateModel, generalChange.newValue, "The general change event should have fired with the intermediate model as the new value" );
				Y.Assert.areSame( intermediateModel, generalChange.oldValue, "The general change event should have fired with the intermediate model as the old value" );
				
				// 'change:intermediate'
				Y.Assert.areSame( 1, intermediateModelChangeEventCount, "The intermediateModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, intermediateModelChange.model, "The intermediateModel-specific change event should have fired with the parent model" );
				Y.Assert.areSame( intermediateModel, intermediateModelChange.newValue, "The intermediateModel-specific change event should have fired with the intermediate model as the new value" );
				Y.Assert.areSame( intermediateModel, intermediateModelChange.oldValue, "The intermediateModel-specific change event should have fired with the intermediate model as the old value" );
				
				// 'change:intermediate.*'
				Y.Assert.areSame( 1, intermediateModelAttrChangeEventCount, "The intermediateModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, intermediateModelAttrChange.model, "The intermediateModel-specific attribute change event should have fired with the intermediateModel" );
				Y.Assert.areSame( 'child', intermediateModelAttrChange.attributeName, "The intermediateModel-specific attribute change event should have fired with the child model attribute name" );
				Y.Assert.areSame( childModel, intermediateModelAttrChange.newValue, "The intermediateModel-specific attribute change event should have fired with the childModel as the new value" );
				Y.Assert.areSame( childModel, intermediateModelAttrChange.oldValue, "The intermediateModel-specific attribute change event should have fired with the childModel as the old value" );
				
				// 'change:intermediate.child'
				Y.Assert.areSame( 1, childModelChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, childModelChange.model, "The childModel-specific change event should have fired with the intermediateModel" );
				Y.Assert.areSame( childModel, childModelChange.newValue, "The childModel-specific change event should have fired with the child model as the new value" );
				Y.Assert.areSame( childModel, childModelChange.oldValue, "The childModel-specific change event should have fired with the child model as the old value" );
				
				// 'change:intermediate.child.*'
				Y.Assert.areSame( 1, childModelChangeAttrEventCount, "The childModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( childModel, childModelChangeAttr.model, "The childModel-specific attribute change event should have fired with the childModel" );
				Y.Assert.areSame( 'attr', childModelChangeAttr.attributeName, "The childModel-specific attribute change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', childModelChangeAttr.newValue, "The childModel-specific attribute change event should have fired with the new value" );
				Y.Assert.isUndefined( childModelChangeAttr.oldValue, "The childModel-specific attribute change event should have fired with the old value" );
				
				// 'change:intermediate.child.attr'
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The childModel attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChange.model, "The childModel attribute-specific change event should have fired with the childModel" );
				Y.Assert.areSame( 'asdf', attrSpecificChange.newValue, "The childModel attribute-specific change event should have fired with the new value" );
				Y.Assert.isUndefined( attrSpecificChange.oldValue, "The childModel attribute-specific change event should have fired with the old value" );
			}
		},
		
		
		{
			/*
			 * Test that the parent model "has changes" (is modified) when an embedded model is changed 
			 */
			name : "Test that the parent model \"has changes\" (is modified) when an embedded model is changed",
			
			setUp : function() {
				this.ParentWithEmbeddedChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ParentWithNonEmbeddedChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: false }  // Note: *not* embedded 
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' },
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"The parent model should have changes when a child embedded model has changes" : function() {
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isTrue( childModel.isModified(), "As a base test, the child model should be considered 'modified'" );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while its child model is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'child' ), "The 'child' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child model has changes, but is not 'embedded'" : function() {
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentWithNonEmbeddedChildModel( {
					child: childModel
				} );
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isFalse( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child model is 'modified', because the child is not 'embedded'" );
			},
			
			
			// ---------------------------
			
			// Test with 'persistedOnly' option to isModified()
			
			
			"Using the persistedOnly option, the parent model should be considered modified if an embedded child model has a persisted attribute change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'persistedAttr', 'newValue' );
				
				Y.Assert.isTrue( parentModel.isModified( { persistedOnly: true } ), "The parent model should be considered modified because its child model has a change on a persisted attribute" );
			},
			
			
			"Using the persistedOnly option, the parent model should *not* be considered modified if an embedded child model only has unpersisted attribute changes" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				Y.Assert.isFalse( parentModel.isModified( { persistedOnly: true } ), "The parent model should *not* be considered modified because its child model only has a change on an unpersisted attribute" );
			},
			
			
			// Test with specific attributes
			
			"Using the persistedOnly option and providing a specific attribute, the parent model should be considered modified if an embedded child model has a persisted attribute change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'persistedAttr', 'newValue' );
				
				Y.Assert.isTrue( parentModel.isModified( 'child', { persistedOnly: true } ), "The parent model should be considered modified because its child model has a change on a persisted attribute" );
			},
			
			
			"Using the persistedOnly option and providing a specific attribute, the parent model should *not* be considered modified if an embedded child model only has unpersisted attribute changes" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				Y.Assert.isFalse( parentModel.isModified( 'child', { persistedOnly: true } ), "The parent model should *not* be considered modified because its child model only has a change on an unpersisted attribute" );
			}
		},
		
		
		{
			/*
			 * Test getting changes from a parent model when an embedded model is changed 
			 */
			name : "Test getting changes from a parent model when an embedded model is changed",
			
			setUp : function() {
				this.ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"A child model with changes should be retrieved (with all of its data, because it is embedded) when any of its attributes has a change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'persistedAttr', 'newPersistedValue' );
				
				var changes = parentModel.getChanges();
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "There should be 1 property in the 'changes' object" );
				Y.ObjectAssert.hasKeys( [ 'child' ], changes, "'child' should be the property in the 'changes' object" );
				
				Y.Assert.areSame( 2, Kevlar.util.Object.length( changes.child ), "There should be 2 properties in the 'child' changes object" );
				Y.Assert.areSame( 'newPersistedValue', changes.child.persistedAttr, "persistedAttr should exist in the 'child' changes, with the new value" );
				Y.Assert.areSame( 'unpersistedValue', changes.child.unpersistedAttr, "unpersistedAttr should exist in the 'child' changes, with its original value" );
			},
			
			
			// -------------------------
			
			// Test with the 'persistedOnly' option
			
			
			"With the 'persistedOnly' option, a child model with changes should only be retrieved (with all of its persisted data, because it is embedded) when any of its *persisted* attributes has a change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'persistedAttr', 'newPersistedValue' );
				
				var changes = parentModel.getChanges( { persistedOnly: true } );
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "There should be 1 property in the 'changes' object" );
				Y.ObjectAssert.hasKeys( [ 'child' ], changes, "'child' should be the property in the 'changes' object" );
				
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes.child ), "There should be only 1 property (for the persisted one) in the 'child' changes object" );
				Y.Assert.areSame( 'newPersistedValue', changes.child.persistedAttr, "persistedAttr should exist in the 'child' changes, with the new value" );
			},
			
			
			"With the 'persistedOnly' option, a child model that only has changes to non-persisted attributes should *not* be retrieved with getChanges()" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'unpersistedAttr', 'newUnpersistedValue' );
				
				var changes = parentModel.getChanges( { persistedOnly: true } );
				Y.Assert.areSame( 0, Kevlar.util.Object.length( changes ), "There should be no properties in the 'changes' object" );
			}
		}
		
	]
	
} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ObjectAttribute',
	
	
	items : [
		{
			/*
			 * Test defaultValue of ObjectAttribute
			 */
			name : "Test defaultValue of ObjectAttribute",
			
			
			"The defaultValue for an ObjectAttribute should be null" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{
							name : 'attr',
							type : 'object'
						}
					]
				} );
				
				var model = new Model();
				Y.Assert.isNull( model.get( 'attr' ) );
			}
		}
	]
	
} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.persistence.add( new Ext.test.TestSuite( {
	
	name: 'RestProxy with Nested Models',
	
	
	items : [
		
		{
			/*
			 * Test updating when nested model attributes are changed
			 */
			name : "Test updating when nested model attributes are changed",
			
			setUp : function() {
				// A RestProxy subclass used for testing
				this.ajaxCallCount = 0;
				this.RestProxy = Kevlar.persistence.RestProxy.extend( {
					ajax : function() { 
						this.ajaxCallCount++; 
						return {};  // just an anonymous "ajax" object 
					}.createDelegate( this )
				} );
				
				this.ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'id', type: 'string' },
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"The parent model should *not* be persisted when only a non-persisted attribute of a nested model is changed" : function() {
				var ajaxCallCount = 0;
				
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentModel( {
					id: 1,
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				var proxy = new this.RestProxy(),
				    result = proxy.update( parentModel );
				
				Y.Assert.isNull( result, "The update() method should have returned null, because there should have been nothing to persist" );
			}
			
		}
	
	]
	
} ) );

