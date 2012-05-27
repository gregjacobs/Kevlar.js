/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'StringAttribute',
	
	
	items : [
		
		/*
		 * Test getDefaultValue()
		 */
		{
			name : "Test getDefaultValue()",
			
			"getDefaultValue() should return an empty string in the default case (i.e. when the `useNull` config is false)" : function() {
				var attribute = new Kevlar.attribute.StringAttribute( { name: 'attr', useNull: false } );
				
				Y.Assert.areSame( "", attribute.getDefaultValue() );
			},
			
			"getDefaultValue() should return null when the `useNull` config is true" : function() {
				var attribute = new Kevlar.attribute.StringAttribute( { name: 'attr', useNull: true } );
				
				Y.Assert.isNull( attribute.getDefaultValue() );
			}
		},
	
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