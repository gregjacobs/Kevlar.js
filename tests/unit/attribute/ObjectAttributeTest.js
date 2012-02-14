/*global window, Ext, Y, Kevlar, tests */
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
		 * Test preSet()
		 */
		{
			name : "Test preSet()",
			
			
			"preSet() should return null when provided any falsy value, or non-object" : function() {
				var attribute = new Kevlar.attribute.ObjectAttribute( { name: 'attr' } ),
				    value;
				
				value = attribute.preSet( null, 0 );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, 1 );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, "" );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, "hi" );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, false );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, true );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, undefined );
				Y.Assert.areSame( null, value );
				
				value = attribute.preSet( null, null );
				Y.Assert.areSame( null, value );
			},
			
			
			
			"preSet() should return an object unchanged" : function() {
				var attribute = new Kevlar.attribute.ObjectAttribute( { name: 'attr' } );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.preSet( null, data );
				
				Y.Assert.areSame( data, value );
			}
		}
		
	]
	
} ) );