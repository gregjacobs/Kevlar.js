/*global jQuery, Ext, Y, tests, Kevlar */
/*jslint evil:true */
tests.unit.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar',
	
	items : [
	
		/*
		 * Test Kevlar.each()
		 */
		{
			name : "Test each()",
			
			test_each: function(){
				var sum = 0;
				Kevlar.each([1, 2, 3, 4], function(val){
					sum += val;
				});
				Y.Assert.areEqual(10, sum, 'Simple each on an array of numbers');
					
				var s = '';
				Kevlar.each(['T', 'e', 's', 't', 'i', 'n', 'g'], function(c){
					s += c;
				});
				Y.Assert.areEqual('Testing', s, 'Simple each on array of strings');
					
				sum = 0;
				Kevlar.each(5, function(num){
					sum += num;
				});
				Y.Assert.areEqual(5, sum, 'Test with a non array parameter, number');
					
				var hit = false;
				Kevlar.each([], function(){
					hit = true;
				});
				Y.Assert.isFalse(hit, 'Test with empty array parameter');
					
				hit = false;
				Kevlar.each(null, function(){
					hit = true;
				});
				Y.Assert.isFalse(hit, 'Test with null parameter');
					
				hit = false;
				Kevlar.each(document.getElementsByTagName('body'), function(){
					hit = true;
				});
				Y.Assert.isTrue(hit, 'Test iteration over NodeLists');
					
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
				Y.Assert.areEqual(10, sum, 'Test that returning false stops iteration');
					
				sum = 0;
				var scope = {value: 3};
				Kevlar.each([1, 2, 3], function(val){
					sum += val * this.value;
				}, scope);
				Y.Assert.areEqual(18, sum, 'Test scope argument #1');
					
				sum = 0;
				scope = {value: 5};
				Kevlar.each([1, 2, 3], function(val){
					sum += val * this.value; //value should be 5
				}, scope);
				Y.Assert.areEqual(30, sum, 'Test scope argument #2');
			}
		},
			
		
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
			 * Test Kevlar.()
			 */
			test_toArray: function(){
				Y.Assert.isArray(Kevlar.toArray(document.getElementsByTagName('body')), 'Test with node list');
			}
		}
	]
	
} ) );
