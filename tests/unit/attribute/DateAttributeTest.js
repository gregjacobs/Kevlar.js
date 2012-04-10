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
				
				value = attribute.beforeSet( mockModel, 1, oldValue );
				Y.Assert.isNull( value, "Test with value: 1" );
				
				value = attribute.beforeSet( mockModel, 1.42, oldValue );
				Y.Assert.isNull( value, "Test with value: 1.42" );
				
				
				// Test with invalid strings
				value = attribute.beforeSet( mockModel, "", oldValue );
				Y.Assert.isNull( value, "Test with value: ''" );
				
				value = attribute.beforeSet( mockModel, "hi", oldValue );
				Y.Assert.isNull( value, "Test with value: 'hi'" );
				
				value = attribute.beforeSet( mockModel, "true", oldValue );
				Y.Assert.isNull( value, "Test with value: 'true'" );
				
				value = attribute.beforeSet( mockModel, "1", oldValue );
				Y.Assert.isNull( value, "Test with value: '1'" );
				
				value = attribute.beforeSet( mockModel, "1.11", oldValue );
				Y.Assert.isNull( value, "Test with value: '1.11'" );	
				
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