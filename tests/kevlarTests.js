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

/*global Ext, tests */
(function() {
	tests.integration               = new Ext.test.TestSuite( 'integration' );
	//tests.integration.persistence = new Ext.test.TestSuite( 'persistence' ) .addTo( tests.integration );
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
					attributes : [ 'attr' ]
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
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } }
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
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
								{ name: 'attribute3', raw: function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
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
					
					"when the `raw` option is provided as true, Model::getChanges() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
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
				
				
				var changeEventCallCount = 0,
				    changeEvent;
				
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEvent = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				var attrSpecificChangeEventCallCount = 0,
				    attrSpecificChangeEvent;
				
				parentModel.on( 'change:myCollection', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCallCount++;
					attrSpecificChangeEvent = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				var attrSpecificChangeAttrEventCallCount = 0,
				    attrSpecificChangeAttrEvent;
				
				parentModel.on( 'change:myCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					attrSpecificChangeAttrEventCallCount++;
					attrSpecificChangeAttrEvent = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				window.a = true;
				childModel1.set( 'attr', 'newValue1' );
				window.a = false;
				
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
			}/*,
			
			
			// ------------------------------
			
			// Test multiple levels of embedded models
			
			
			"When an attribute has changed in a deeply nested embedded model, its parent model should fire a 'change' event, with the parentAttr.childAttr.childAttr attributeName" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Parent' }, // for debugging
						{ name: 'intermediate', type: 'model', embedded: true }
					]
				} );
				
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Intermediate' }, // for debugging
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Child' }, // for debugging
						{ name : 'attr', type: 'string' }
					]
				} );
				
				
				// Create the models 
				var parentModel = new ParentModel(),
				    intermediateModel = new IntermediateModel(),
				    childModel = new ChildModel();
				    
				parentModel.set( 'intermediate', intermediateModel );
				intermediateModel.set( 'child', childModel );
				
				
				// Subscribe to the general 'change' event
				var generalChangeEventCount = 0,
				    generalChangedModel,
				    generalChangedAttribute,
				    generalChangedValue;
				    
				parentModel.on( 'change', function( model, attributeName, value ) {
					generalChangeEventCount++;
					generalChangedModel = model;
					generalChangedAttribute = attributeName;
					generalChangedValue = value;
				} );
				
				
				// We should also be able to subscribe to the general (but intermediate model-specific) 'change' event for the embedded model itself
				var intermediateModelChangeEventCount = 0,
				    intermediateModelChangedModel,
				    intermediateModelChangedAttribute,
				    intermediateModelChangedValue;
				
				parentModel.on( 'change:intermediate', function( model, attributeName, value ) {
					intermediateModelChangeEventCount++;
					intermediateModelChangedModel = model;
					intermediateModelChangedAttribute = attributeName;
					intermediateModelChangedValue = value;
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event
				var childModelChangeEventCount = 0,
				    childModelChangedModel,
				    childModelChangedAttribute,
				    childModelChangedValue;
				
				parentModel.on( 'change:intermediate.child', function( model, attributeName, value ) {
					childModelChangeEventCount++;
					childModelChangedModel = model;
					childModelChangedAttribute = attributeName;
					childModelChangedValue = value;
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChangedModel,
				    attrSpecificChangedValue;
				    
				parentModel.on( 'change:intermediate.child.attr', function( model, value ) {
					attrSpecificChangeEventCount++;
					attrSpecificChangedModel = model;
					attrSpecificChangedValue = value;
				} );
				
				
				
				// Now set the value of the attribute in the child model
				window.a = true;
				childModel.set( 'attr', 'asdf' );
				window.a = false;
				
				Y.Assert.areSame( 1, generalChangeEventCount, "The general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalChangedModel, "The general change event should have fired with the parent model" );
				Y.Assert.areSame( 'intermediate.child.attr', generalChangedAttribute, "The general change event should have fired with the attributeName as the path to the child model's attribute" );
				Y.Assert.areSame( 'asdf', generalChangedValue, "The general change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, intermediateModelChangeEventCount, "The intermediateModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, intermediateModelChangedModel, "The intermediateModel-specific change event should have fired with the intermediate model" );
				Y.Assert.areSame( 'child.attr', intermediateModelChangedAttribute, "The intermediateModel-specific change event should have fired with path to the changed attribute in the deeper child model" );
				Y.Assert.areSame( 'asdf', intermediateModelChangedValue, "The intermediateModel-specific change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, childModelChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, childModelChangedModel, "The childModel-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'attr', childModelChangedAttribute, "The childModel-specific change event should have fired with the attributeName that was changed" );
				Y.Assert.areSame( 'asdf', childModelChangedValue, "The childModel-specific change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The childModel attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChangedModel, "The childModel attribute-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', attrSpecificChangedValue, "The childModel attribute-specific change event should have fired with the new value" );
			}*/
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
			
			
			"When an attribute has changed in a deeply nested embedded model, its parent model should fire a 'change' event, with the parentAttr.childAttr.childAttr attributeName" : function() {
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
			 * Test that the parent model "has changes" when an embedded model is changed 
			 */
			name : "Test that the parent model \"has changes\" when an embedded model is changed",
			
			"The parent model should have changes when a child embedded model has changes" : function() {
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
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isTrue( childModel.isModified(), "As a base test, the child model should be considered 'modified'" );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while its child model is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'child' ), "The 'child' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child model has changes, but is not 'embedded'" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: false }  // note: NOT embedded
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
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isFalse( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child model is 'modified', because the child is not 'embedded'" );
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

