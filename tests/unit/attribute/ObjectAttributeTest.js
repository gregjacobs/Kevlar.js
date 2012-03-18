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