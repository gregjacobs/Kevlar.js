/*global Ext, Y, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.ModelAttribute',
	
	
	items : [
	
		/*
		 * Test preSet()
		 */
		{
			name : "Test preSet()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				this.attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr',
					modelClass: this.Model
				} );
			},
			
			
			"preSet() should return null when provided any falsy value, or non-object" : function() {
				var value;
				
				value = this.attribute.preSet( null, 0 );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, 1 );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, "" );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, "hi" );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, false );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, true );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, undefined );
				Y.Assert.areSame( null, value );
				
				value = this.attribute.preSet( null, null );
				Y.Assert.areSame( null, value );
			},
			
			
			"preSet() should convert an anonymous data object to the provided modelClass" : function() {
				var data = { attr1: 1, attr2: 2 };
				var value = this.attribute.preSet( null, data );
				
				Y.Assert.isInstanceOf( this.Model, value, "The return value from preSet should have been an instance of the Model" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should have been set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should have been set to the new model" );
			},
			
			
			
			"if no modelClass was provided, preSet() should return an anonymous data object unchanged" : function() {
				var attribute = new Kevlar.attribute.ModelAttribute( { 
					name: 'attr'
				} );
				
				var data = { attr1: 1, attr2: 2 };
				var value = attribute.preSet( null, data );
				
				Y.Assert.areSame( data, value );
			}
		}
		
	]
	
} ) );