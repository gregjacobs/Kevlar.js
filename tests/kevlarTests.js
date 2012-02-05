/*!
 * Kevlar JS Library
 * Copyright(c) 2011 Gregory Jacobs.
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 */
/*global Ext, tests */
(function() {
	tests.unit             = new Ext.test.TestSuite( 'unit' );
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

/*global Ext, Y, Kevlar, tests */
tests.unit.add( new Ext.test.TestCase( {
	
	name: 'Kevlar.Attribute',
	
	
	setUp : function() {
		
	},
	
	
	// --------------------------------
	//        Special Instructions
	// --------------------------------
	_should : {
		error : {
			"Instantiating an Attribute without a 'name' should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with an undefined 'name' argument should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with an undefined 'name' property should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with a null 'name' argument should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with a null 'name' property should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with an empty 'name' argument should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor",
			"Instantiating an Attribute with an empty 'name' property should throw an error" : "no 'name' property provided to Kevlar.Attribute constructor"
		}
	},
	
	
	
	// --------------------------------
	//             Tests
	// --------------------------------
	
	
	// Check that the name property was provided
	
	"Instantiating an Attribute without a 'name' should throw an error" : function() {
		var attribute = new Kevlar.Attribute();
	},
	
	
	"Instantiating an Attribute with an undefined 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.Attribute( undefined );
	},
	
	
	"Instantiating an Attribute with an undefined 'name' property should throw an error" : function() {
		var attribute = new Kevlar.Attribute( {
			name : undefined
		} );
	},
	
	
	"Instantiating an Attribute with a null 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.Attribute( null );
	},
	
	
	"Instantiating an Attribute with a null 'name' property should throw an error" : function() {
		var attribute = new Kevlar.Attribute( {
			name : null
		} );
	},
	
	
	"Instantiating an Attribute with an empty 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.Attribute( "" );
	},
	
	
	"Instantiating an Attribute with an empty 'name' property should throw an error" : function() {
		var attribute = new Kevlar.Attribute( {
			name : ""
		} );
	},
	
	
	
	// Check that the 'name' property can be retrieved by getName()
	
	"The name property should be retrievable by getName()" : function() {
		var attribute1 = new Kevlar.Attribute( { name: 'testName' } );
		Y.Assert.areSame( 'testName', attribute1.getName(), "getName() not properly retriving Attribute's name. Was looking for 'testName'." );
		
		var attribute2 = new Kevlar.Attribute( { name: '_' } );
		Y.Assert.areSame( '_', attribute2.getName(), "getName() not properly retriving Attribute's name. Was looking for '_'." );
		
		var attribute3 = new Kevlar.Attribute( { name: "abc" } );
		Y.Assert.areSame( "abc", attribute3.getName(), "getName() not properly retriving Attribute's name. Was looking for 'abc'." );
	},
	
	
	// Make sure a number provided to the constructor as the 'name' is converted to a string datatype
	
	"Providing the attribute name as a number directly to the constructor argument should be converted to a string for the attribute's name" : function() {
		var attribute = new Kevlar.Attribute( 0 );
		Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
	},
	
	"Providing the attribute name as a property on the config should be converted to a string for the attribute's name" : function() {
		var attribute = new Kevlar.Attribute( {
			name : 0
		} );
		Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
	},
	
	
	// --------------------------------------
	
	
	// Check that defaultValue is handled correctly
	
	"A default provided as the keyword 'default' should be accepted properly as defaultValue" : function() {
		var attribute = new Kevlar.Attribute( {
			name : "TestAttribute",
			'default' : 1
		} );
		
		Y.Assert.areSame( 1, attribute.defaultValue );
	},
	
	
	"A default provided as the keyword 'default' that is a function should be executed and set properly to defaultValue" : function() {
		var attribute = new Kevlar.Attribute( {
			name : "TestAttribute",
			'default' : function() { return 1; }
		} );
		
		Y.Assert.areSame( 1, attribute.defaultValue );
	},
	
	
	"A default provided as defaultValue should be accepted properly" : function() {
		var attribute = new Kevlar.Attribute( {
			name : "TestAttribute",
			defaultValue : 1
		} );
		
		Y.Assert.areSame( 1, attribute.defaultValue );
	},
	
	
	"A default provided as defaultValue that is a function should be executed and set properly to defaultValue" : function() {
		var attribute = new Kevlar.Attribute( {
			name : "TestAttribute",
			defaultValue : function() { return 1; }
		} );
		
		Y.Assert.areSame( 1, attribute.defaultValue );
	},
	
	
	"A defaultValue provided as an object should be recursed for functions, and those functions' return values should be used in the default" : function() {
		var attribute = new Kevlar.Attribute( {
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
		var defaultData = attribute.defaultValue;
		Y.Assert.areSame( "A", defaultData.a, "The 'default' config provided as an object should have had the value 'A' for property 'a'." );
		Y.Assert.areSame( "B1", defaultData.b.innerB1, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
		Y.Assert.areSame( "C2", defaultData.c.innerC2, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
	}
	
} ) );

/*global jQuery, Ext, Y, Kevlar, tests */
tests.unit.data.add( new Ext.test.TestSuite( {
	name : 'Kevlar.data.NativeObjectConverter',
	
	items : [
	
		/*
		 * Test convert()
		 */
		{
			name : "Test convert()",
			
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
						{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } }
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
						{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
						{ name: 'attribute3', raw: function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
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
				Y.Assert.areSame( data, data.relatedModel.relatedModel, "The outer -> inner -> outer should point to the data object returned by the convert() method, as that is the model that was converted" ); 
				
				// Make sure that references really do point to the same object
				Y.Assert.areSame( data.relatedModel.relatedModel, data.relatedModel.relatedModel.relatedModel.relatedModel, "The outer -> inner -> outer should point to the outer reference" );
			}
		}
	]

} ) );

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestCase( {
	name: 'Kevlar.ModelCache',
	
	setUp : function() {
		// Reset the ModelCache's modelTypeIdCounter back to 0, and its models cache back to empty between tests
		Kevlar.ModelCache.modelTypeIdCounter = 0;
		Kevlar.ModelCache.models = {};
	},
	
	tearDown : function() {
		// Reset the ModelCache's variables on tearDown as well, so we don't affect other tests
		Kevlar.ModelCache.modelTypeIdCounter = 0;
		Kevlar.ModelCache.models = {};
	},
	
	
	
	"get() should assign a '__Kevlar_modelTypeId' to a model subclass that hasn't had one assigned yet (i.e. a new one)" : function() {
		var MockModel = function(){};
		
		Y.Assert.isUndefined( MockModel.__Kevlar_modelTypeId, "Initial condition: the Model should not have a __Kevlar_modelTypeId yet" );
		
		var model = new MockModel();
		Kevlar.ModelCache.get( model );
		
		Y.Assert.areSame( 1, MockModel.__Kevlar_modelTypeId, "The Model should have had a new __Kevlar_modelTypeId assigned" );
	},
	
	
	"get() should return a reference to the same model provided to it if not providing an id" : function() {
		var MockModel = function(){};
		var model = new MockModel();
		
		var retrievedModel = Kevlar.ModelCache.get( model );
		Y.Assert.areSame( model, retrievedModel );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed in with the same type (subclass), but not passing in any id's" : function() {
		var MockModel = function(){};
		    
		var model1 = new MockModel(),
		    model2 = new MockModel();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1 );
		var retrievedModel2 = Kevlar.ModelCache.get( model2 );
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should return a reference to the first model, when a second one is passed with the same id" : function() {
		var MockModel = function(){};
		var model1 = new MockModel();
		var model2 = new MockModel();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // 1 on both
		
		Y.Assert.areSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same id, but of a different model type (subclass)" : function() {
		var MockModel1 = function(){},
		    MockModel2 = function(){};
		    
		var model1 = new MockModel1(),
		    model2 = new MockModel2();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of 1 on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // but different types of models
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same type (subclass), but with a different id" : function() {
		var MockModel = function(){};
		    
		var model1 = new MockModel(),
		    model2 = new MockModel();
		
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
			 * Test Initialization (constructor)
			 */
			name: 'Test Initialization (constructor)',
			ttype : 'testsuite',
			
			
			items : [
				{
					/*
					 * Test lazy instantiating a proxy
					 */
					name : "Test lazy instantiating a proxy",
					
					_should : {
						error : {
							"Attempting to instantiate a proxy with no 'type' attribute should throw an error" :
								"Kevlar.persistence.proxy.create(): No `type` property provided on proxy config object",
								
							"Attempting to instantiate a proxy with an invalid 'type' attribute should throw an error" :
								"Kevlar.persistence.Proxy.create(): Unknown Proxy type: 'nonexistentproxy'"
						}
					},
					
					"Attempting to instantiate a proxy with no 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							proxy : {}
						} );
						
						var model = new TestModel();
					},
					
					"Attempting to instantiate a proxy with an invalid 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							proxy : { 
								type : 'nonExistentProxy'
							}
						} );
						
						var model = new TestModel();
					},
					
					"Providing a valid config object should instantiate the Proxy *on class's the prototype*" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							proxy : { 
								type : 'rest'  // a valid proxy type
							}
						} );
						
						var model = new TestModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestModel.prototype.proxy );
					},
					
					"Providing a valid config object should instantiate the Proxy *on the correct subclass's prototype*, shadowing superclasses" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							proxy : { 
								type : 'nonExistentProxy'  // an invalid proxy type
							}
						} );
						
						var TestSubModel = Kevlar.extend( TestModel, {
							addAttributes: [ 'attribute1' ],
							proxy : { 
								type : 'rest'  // a valid proxy type
							}
						} );
						
						var model = new TestSubModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestSubModel.prototype.proxy );
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
								{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
								{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
						Y.Assert.isTrue( Kevlar.util.Object.isEmpty( model.getChanges ), "There should not be any 'changes' upon initialization" );
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
			 * Test Attributes Inheritance
			 */
			name: 'Test Attributes Inheritance',
			
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			
			/*
			 * Utility method to remove duplicates from an array. Used by {@link #assertAttributesHashCorrect} for its check for the number of
			 * attributes that should exist.  Uses a hash to remove duplicates.
			 * 
			 * @method removeArrayDuplicates 
			 * @param {Array} arr
			 */
			removeArrayDuplicates : function( arr ) {
				var out=[], obj={};
				
				for( var i = 0, len = arr.length; i < len; i++ ) {
					obj[ arr[ i ] ] = 0;
				}
				for( i in obj ) { if( obj.hasOwnProperty( i ) ) { out.push( i ); } }
				
				return out;
			},
			
			
			/*
			 * Given a Model (provided as the last arg), and its superclasses, asserts that the number of attributes found on the prototypes of each Model
			 * matches the number of keys in the final {@link Kevlar.Model#attributes} hash, and that there is one key for each Attribute
			 * found in the 'attributes' prototype arrays.
			 * 
			 * Basically asserts that the final hash that the Kevlar.Model compiles from itself, and all of its superclasses, is correct.
			 * 
			 * @method assertAttributesHashCorrect
			 * @param {Kevlar.Model...} One or more Model classes, starting with the highest level Model (the "highest superclass" Model),
			 *   going all the way down to the lowest subclass Model.  Ex of args: Model, SubClassModel, SubSubClassModel. In this example,
			 *   the SubSubClassModel is the Model that will be tested.  
			 */
			assertAttributesHashCorrect : function( /* ... */ ) {
				var models = Kevlar.toArray( arguments ),
				    i, len;
				
				// Get the full array of prototype attributes (from the Model, SubClassModel, SubSubClassModel, etc), and the expected number of attributes
				var prototypeAttributes = [];
				for( i = 0, len = models.length; i < len; i++ ) {
					var currentPrototype = models[ i ].prototype;
					if( currentPrototype.hasOwnProperty( 'attributes' ) ) {
						prototypeAttributes = prototypeAttributes.concat( models[ i ].prototype.attributes );
					} else if( currentPrototype.hasOwnProperty( 'addAttributes' ) ) {
						prototypeAttributes = prototypeAttributes.concat( models[ i ].prototype.addAttributes );
					}
				}
				
				// Convert the array to a duplicates-removed array of attribute names
				var attributeNames = [];
				for( i = 0, len = prototypeAttributes.length; i < len; i++ ) {
					var attributeName = new Kevlar.Attribute( prototypeAttributes[ i ] ).getName();
					attributeNames.push( attributeName );
				}
				attributeNames = this.removeArrayDuplicates( attributeNames );
				var expectedAttributeCount = attributeNames.length;
				
				
				// Check the instance attributes of the Model under test now
				var instance = new models[ models.length - 1 ](),  // the last Model class provided to the method. It is assumed that all previous arguments are its superclasses
				    instanceAttributes = instance.attributes;
				
				var attributeCount = Kevlar.util.Object.length( instanceAttributes );
				Y.Assert.areSame( expectedAttributeCount, attributeCount, "There should be the same number of resulting attributes in the 'instanceAttributes' hash as the original 'attributes' arrays of the Model classes." );
				
				// Check that all of the attributes defined by each Model's prototype exist in the final 'attributes' hash
				for( i = 0, len = attributeNames.length; i < len; i++ ) {
					Y.ObjectAssert.hasKey( attributeNames[ i ], instanceAttributes, "The Model (last arg to assertAttributesHashCorrect) should have defined the '" + attributeNames[ i ] + "' attribute in its final 'attributes' hash" );
				}
			},
			
			
			// ---------------------------
			
			
			// Tests
			
			"Attributes should inherit from a Model subclass's superclass when the subclass defines no attributes of its own" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'field1' ]
				} );
				var SubClassModel = Model.extend( {} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass when the subclass does define attributes of its own" : function() {
				// Reference the base class, and create a subclass
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Model.extend( {
					addAttributes : [ 'a', 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
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
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', instanceAttributes, "SubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', instanceAttributes, "SubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
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
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel, SubSubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', instanceAttributes, "SubSubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', instanceAttributes, "SubSubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'f', instanceAttributes, "SubSubSubClassModel should have the 'f' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attribute definitions defined in a subclass should take precedence over attribute definitions in a superclass" : function() {
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ { name : 'a', defaultValue: 1 } ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ { name : 'a', defaultValue: 2 }, 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				
				// Check that the default value of the Attribute 'a' is 2, not 1 (as the Attribute in the subclass should have overridden its superclass Attribute)
				Y.Assert.areSame( 2, instanceAttributes[ 'a' ].defaultValue, "The attribute in the subclass should have overridden its superclass" ); 
			},
			
			
			"A subclass that doesn't define any attributes should inherit all of them from its superclass(es)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			"A superclass that doesn't define any attributes should be skipped for attributes, but the subclass should still inherit from superclasses above it" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {} );  // one that doesn't define any attributes
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'a', 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			// -------------------------------
			
			
			"One should be able to use `attributes` in place of `addAttributes` on the prototype, if they wish" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'a', 'b' ]
				} );
				var SubModel = Model.extend( {
					attributes : [ 'c' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubModel );
				
				var instanceAttributes = (new SubModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
			}
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
			 * Test set()
			 */
			name: 'Test set()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
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
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
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
			
			
			// ------------------------
			
			// Test the 'change' event
			
			"When an attribute is set, a generalized 'change' event should be fired" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    attributeNameChanged = "",
				    newValue = "";
				    
				model.addListener( 'change', function( model, attributeName, value ) {
					changeEventFired = true;
					attributeNameChanged = attributeName;
					newValue = value;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change' event was not fired" );
				Y.Assert.areSame( "attribute2", attributeNameChanged, "The attributeName that was changed was not provided to the event correctly." );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
			},
			
			
			"When an attribute is set, a 'change:xxx' event should be fired for the changed attribute" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    newValue = "";
				    
				model.addListener( 'change:attribute2', function( model, value ) {
					changeEventFired = true;
					newValue = value;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change:attribute2' event was not fired" );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
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
							set : function( value, model ) {
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
			
			
			"When an attribute with only a `get()` function is set, the 'change' events should be fired with the value from the get function, not the raw value" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{
							name : 'myAttribute',
							get : function( value, model ) { return value + 10; } // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel(),
				    changeEventValue,
				    attributeSpecificChangeEventValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue ) {
						changeEventValue = newValue;
					},
					'change:myAttribute' : function( model, newValue ) {
						attributeSpecificChangeEventValue = newValue;
					}
				} );
				
				model.set( 'myAttribute', 42 );  // the `get()` function on the Attribute will add 10 to this value when the attribute is retrieved
				
				Y.Assert.areSame( 52, changeEventValue, "The value provided with the change event should have come from myAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventValue, "The value provided with the attribute-specific change event should have come from myAttribute's `get()` function" );
			},
			
			
			"When an attribute with both a `set()` function, and `get()` function of its own is set, the 'change' events should be fired with the value from the `get()` function, not the raw value" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						'baseAttribute',
						{
							// Computed Attribute with both a set() function and a get() function, which simply uses 'baseAttribute' for its value
							// (which in practice, would probably be composed of two or more attributes, and possible does calculations as well)
							name : 'computedAttribute',
							set : function( value, model ) { model.set( 'baseAttribute', value ); },
							get : function( value, model ) { return model.get( 'baseAttribute' ) + 10; }   // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel(),
				    changeEventValue,
				    attributeSpecificChangeEventValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue ) {
						changeEventValue = newValue;
					},
					'change:computedAttribute' : function( model, newValue ) {
						attributeSpecificChangeEventValue = newValue;
					}
				} );
				
				model.set( 'computedAttribute', 42 );  // the `get()` function will add 10 to this value when the attribute is retrieved
								
				Y.Assert.areSame( 52, changeEventValue, "The value provided with the change event should have come from the computedAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventValue, "The value provided with the attribute-specific change event should have come from the computedAttribute's `get()` function" );
			},
			
			
			
			// ------------------------
			
			
			"for compatibility with Backbone's Collection, set() should set the id property to the Model object itself with the idAttribute is changed" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', get : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } }
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
							get : function( value, model ) { 
								return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); 
							} 
						},
						{ 
							name: 'attribute4', 
							raw : function( value, model ) { 
								return value + " " + model.get( 'attribute1' );
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			"isModified() should return false for attributes that have not been changed" : function() {
				var model = new this.TestModel();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1, with no defaultValue, should not be modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2, with a defaultValue, should not be modified" );
			},
			
			
			"isModified() should return true for attributes that have been changed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified" );
				Y.Assert.isTrue( model.isModified( 'attribute2' ), "attribute2 should be marked as modified" );
			},
			
			
			"isModified() should return false for attributes that have been changed, but then committed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been committed, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been committed, and therefore not marked as modified" );
			},
			
			
			"isModified() should return false for attributes that have been changed, but then rolled back" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.rollback();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been rolled back, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been rolled back, and therefore not marked as modified" );
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
			},
			
			tearDown : function() {
				// Restore the NativeObjectConverter after the tests
				Kevlar.data.NativeObjectConverter = this.origNativeObjectConverter;
			},
			
			
			// ---------------------------
			
			
			"getChanges() should delegate to the singleton NativeObjectConverter to create an Object representation of its data, but only provide changed attributes for the attributes that should be returned" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2', 'attr3' ]
				} );
				
				var model = new Model( {
					attr1: 'value1',
					attr2: 'value2',
					attr3: 'value3'
				} );
				model.set( 'attr1', 'newValue1' );
				model.set( 'attr2', 'newValue2' );
				
				// even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				var result = model.getChanges( { raw: true } );  // add an extra option to make sure it goes through
				
				var optionsProvidedToConvert = this.args[ 1 ];
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( model, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the model." );
				Y.Assert.areSame( true, optionsProvidedToConvert.raw, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'raw:true' option" );
				Y.ArrayAssert.itemsAreSame( [ 'attr1', 'attr2' ], optionsProvidedToConvert.attributeNames, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'attributeNames' option, with the attributes that were changed" );
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
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
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
		
			
			// Special instructions
			_should : {
				error : {
					"load() should throw an error if there is no configured proxy" : "Kevlar.Model::load() error: Cannot load. No proxy."
				}
			},
			
			
			"load() should throw an error if there is no configured proxy" : function() {
				var model = new this.TestModel( {
					// note: no configured proxy
				} );
				model.load();
				Y.Assert.fail( "load() should have thrown an error with no configured proxy" );
			},
			
			
			"load() should delegate to its proxy's read() method to retrieve the data" : function() {
				var readCallCount = 0;
				var MockProxy = Kevlar.persistence.Proxy.extend( {
					read : function( model, options ) {
						readCallCount++;
					}
				} );
				
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				// Run the load() method to delegate 
				model.load();
				
				Y.Assert.areSame( 1, readCallCount, "The proxy's read() method should have been called exactly once" );
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
					
					// Special instructions
					_should : {
						error : {
							"save() should throw an error if there is no configured proxy" : "Kevlar.Model::save() error: Cannot save. No proxy."
						}
					},
					
					
					"save() should throw an error if there is no configured proxy" : function() {
						var Model = Kevlar.Model.extend( {
							// note: no proxy
						} );
						var model = new Model();
						model.save();
						Y.Assert.fail( "save() should have thrown an error with no configured proxy" );
					},
					
					
					"save() should delegate to its proxy's create() method to persist changes when the Model does not have an id set" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							proxy : mockProxy
						} );
						
						var model = new Model();  // note: no 'id' set
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( mockProxy ).create();
						} catch( message ) {
							Y.Assert.fail( "The proxy's update() method should have been called exactly once. " + message );
						}
					},
					
					
					"save() should delegate to its proxy's update() method to persist changes, when the Model has an id" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							proxy : mockProxy
						} );
						
						var model = new Model( { id: 1 } );
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( mockProxy, JsMockito.Verifiers.once() ).update();
						} catch( message ) {
							Y.Assert.fail( "The proxy's update() method should have been called exactly once. " + message );
						}
					}
				},
					
				
				{
					name : "save() callbacks tests",
					
					setUp : function() {
						this.mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						// Note: setting both create() and update() methods here
						this.mockProxy.create = this.mockProxy.update = function( model, options ) {
							if( options.success ) { options.success.call( options.scope || window ); }
							if( options.error ) { options.error.call( options.scope || window ); }
							if( options.complete ) { options.complete( options.scope || window ); }
						};
						
						this.Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1' ],
							proxy  : this.mockProxy
						} );
					},
					
					
					"save should call its 'success' and 'complete' callbacks if the proxy successfully creates" : function() {
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
					
					
					"save should call its 'error' and 'complete' callbacks if the proxy encounters an error while creating" : function() {
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
					
					
					"save should call its 'success' and 'complete' callbacks if the proxy successfully updates" : function() {
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
					
					
					"save should call its 'error' and 'complete' callbacks if the proxy encounters an error while updating" : function() {
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
						var MockProxy = Kevlar.persistence.Proxy.extend( {
							update : function( model, options ) {
								dataToPersist = model.getChanges();
								options.success.call( options.scope );
							}
						} );
						var MyModel = this.Model.extend( {
							proxy : new MockProxy()
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
										
					
					// Creates a test Model with a mock proxy, which fires its 'success' callback after the given timeout
					createModel : function( timeout ) {
						var MockProxy = Kevlar.persistence.Proxy.extend( {
							update : function( model, options ) {
								// update method just calls 'success' callback in 50ms
								window.setTimeout( function() {
									options.success.call( options.scope || window );
								}, timeout );
							}
						} );
						
						return Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ],
							proxy : new MockProxy()
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
							"destroy() should throw an error if there is no configured proxy" : "Kevlar.Model::destroy() error: Cannot destroy. No proxy."
						}
					},
					
					
					"destroy() should throw an error if there is no configured proxy" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
							// note: no proxy
						} );
						
						var model = new Model();
						model.destroy();
						Y.Assert.fail( "destroy() should have thrown an error with no configured proxy" );
					},
					
					
					"destroy() should delegate to its proxy's destroy() method to persist the destruction of the model" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );				
						var Model = Kevlar.Model.extend( {
							proxy : mockProxy
						} );
						
						var model = new Model();
						
						// Run the destroy() method to delegate 
						model.destroy();
						
						try {
							JsMockito.verify( mockProxy, JsMockito.Verifiers.once() ).destroy();
						} catch( e ) {
							Y.Assert.fail( "The model should have delegated to the destroy method exactly once." );
						}
					},
					
					
					"upon successful destruction of the Model, the Model should fire its 'destroy' event" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						mockProxy.destroy = function( model, options ) {
							options.success.call( options.scope );
						};
						
						var Model = Kevlar.Model.extend( {
							proxy : mockProxy
						} );
						
						var model = new Model();
						
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
						this.mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						this.mockProxy.destroy = function( model, options ) {
							if( options.success )  { options.success.call( options.scope ); }
							if( options.error )    { options.error.call( options.scope ); }
							if( options.complete ) { options.complete( options.scope ); }
						};
					},
					
			
					"destroy() should call its 'success' and 'complete' callbacks if the proxy is successful" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1' ],
							proxy  : this.mockProxy
						} );
						var model = new Model();
						
						model.destroy( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"destroy() should call its 'error' and 'complete' callbacks if the proxy encounters an error" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						    
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						mockProxy.destroy = function( model, options ) {
							options.error.call( options.scope );
							options.complete( options.scope );
						};
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1' ],
							proxy  : this.mockProxy
						} );
						var model = new Model();
						
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
			
			
			"buildUrl() should return simply the configured urlRoot, if the 'appendId' config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				var proxy = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl',
					appendId : false
				} );
				
				Y.Assert.areSame( '/testUrl', proxy.buildUrl( mockModel ), "buildUrl() should have simply still returned the url" );
			},
			
			
			"buildUrl() should return the configured urlRoot with the model's id, if the 'appendId' config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				// Try with no trailing slash on the url
				var proxy1 = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl',  // note: no trailing slash
					appendId : true
				} );
				
				Y.Assert.areSame( '/testUrl/42', proxy1.buildUrl( mockModel ), "buildUrl() should have returned the url with the id appended" );
				
				// Try with a trailing slash on the url
				var proxy2 = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl/',  // note: trailing slash exists
					appendId : true
				} );
				
				Y.Assert.areSame( '/testUrl/42', proxy2.buildUrl( mockModel ), "buildUrl() should have returned the url with the id appended" );
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
	//tests.integration.persistence = new Ext.test.TestSuite( 'persistence' ) .addTo( tests.integration );
	//tests.integration.util        = new Ext.test.TestSuite( 'util' )        .addTo( tests.integration );
	
	Ext.test.Session.addSuite( tests.integration );
})();

/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ModelCache',
	
	
	items : [
	
		{
			/*
			 * Test that by constructing a Model, it indirectly gets a __Kevlar_modelTypeId property from the ModelCache
			 */
			name : "Test that by constructing a Model, it indirectly gets a __Kevlar_modelTypeId property from the ModelCache",
			
			
			"constructing the first instance of a new Model subclass should indirectly get a __Kevlar_modelTypeId property by the ModelCache" : function() {
				var Model = Kevlar.Model.extend( {} );
				
				Y.Assert.isUndefined( Model.__Kevlar_modelTypeId, "Initial condition: The Model subclass should not yet have a __Kevlar_modelTypeId property" );
				var instance1 = new Model();
				Y.Assert.isNumber( Model.__Kevlar_modelTypeId, "The Model should now have a static __Kevlar_modelTypeId property" );
			},
			
			
			"constructing the second instance of a new Model subclass should not change the __Kevlar_modelTypeId property that was set from instantiating the first instance" : function() {
				var Model = Kevlar.Model.extend( {} );
				var instance1 = new Model();
				
				var __Kevlar_modelTypeId = Model.__Kevlar_modelTypeId;
				Y.Assert.isNumber( Model.__Kevlar_modelTypeId, "Initial Condition: The Model should now have a static __Kevlar_modelTypeId property, which is a number" );
				
				var instance2 = new Model();
				Y.Assert.areSame( __Kevlar_modelTypeId, Model.__Kevlar_modelTypeId, "The Model's __Kevlar_modelTypeId should not have been changed from instantiating a second instance" );
			}
		},
		
		
		
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


			
			
			/*
			
			
			"getChanges() should return a single attribute that has had its value changed" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value" );
				
				var changes = model.getChanges();
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 1 property" );
				Y.Assert.areSame( "new value", changes.attribute1, "The change to attribute1 should have been 'new value'." );
			},
			
			"getChanges() should return multiple attributes that have had their values changed" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				
				var changes = model.getChanges();
				Y.Assert.areSame( 2, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 2 properties" );
				Y.Assert.areSame( "new value 1", changes.attribute1, "The change to attribute1 should have been 'new value 1'." );
				Y.Assert.areSame( "new value 2", changes.attribute2, "The change to attribute2 should have been 'new value 2'." );
			},
			
			
			"getChanges() should return the data by running attributes' `get` functions (not just returning the raw data)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 
						'attribute1', 
						{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
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
			
			"when the `raw` option is provided as true, getChanges() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [
						'attribute1', 
						{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
						{ name: 'attribute3', raw: function( value, model ) { return value + " " + model.get( 'attribute1' ); } },
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
			
			"getChanges() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) that have been changed when the `persistedOnly` option is set to true" : function() {
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
			
*/

