/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'BooleanAttribute',
	
	
	items : [
		
		/*
		 * Test getDefaultValue()
		 */
		{
			name : "Test getDefaultValue()",
			
			"getDefaultValue() should return false in the default case (i.e. when the `useNull` config is false)" : function() {
				var attribute = new Kevlar.attribute.BooleanAttribute( { name: 'attr', useNull: false } );
				
				Y.Assert.isFalse( attribute.getDefaultValue() );
			},
			
			"getDefaultValue() should return null when the `useNull` config is true" : function() {
				var attribute = new Kevlar.attribute.BooleanAttribute( { name: 'attr', useNull: true } );
				
				Y.Assert.isNull( attribute.getDefaultValue() );
			}
		},
		
		
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