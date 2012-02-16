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
				    value;
				
				value = attribute.beforeSet( mockModel, null, 0 );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, 1 );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, "" );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, "hi" );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, false );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, true );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, undefined );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, null, null );
				Y.Assert.areSame( null, value );
			},
			
			
			
			"beforeSet() should return an object unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.ObjectAttribute( { name: 'attr' } );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.beforeSet( mockModel, null, data );
				
				Y.Assert.areSame( data, value );
			}
		}
		
	]
	
} ) );