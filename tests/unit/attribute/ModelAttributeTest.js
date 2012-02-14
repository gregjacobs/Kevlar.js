/*global Ext, Y, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.ModelAttribute',
	
	
	items : [
	
		/*
		 * Test constructor
		 */
		{
			name : "Test constructor",
			
			// Special instructions
			_should : {
				error : {
					"the constructor should throw an error if the undefined value is provided for the modelClass config, which helps determine when late binding is needed for the modelClass config" : 
						 "The 'modelClass' config provided to an Attribute with the name 'attr' either doesn't exist, or doesn't " +
			             "exist just yet. Consider using the String or Function form of the modelClass config for very late binding, if needed"
				}
			},
			
			
			"the constructor should throw an error if the undefined value is provided for the modelClass config, which helps determine when late binding is needed for the modelClass config" : function() {
				var attr = new Kevlar.attribute.ModelAttribute( {
					name : 'attr',
					modelClass: undefined
				} );
				
				Y.Assert.fail( "The constructor should have thrown an error if the modelClass config was provided but was undefined. This is to help with debugging when late binding for the modelClass is needed." );
			}
		},
	
	
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
			
			
			"preSet() should return a Model instance unchanged" : function() {
				var data = new this.Model( { attr1 : 1, attr2: 2 } );
				var value = this.attribute.preSet( null, data );
				
				Y.Assert.areSame( data, value, "The return value from preSet should have been the same model instance" );
				Y.Assert.areSame( 1, value.get( 'attr1' ), "The data should remain set to the new model" );
				Y.Assert.areSame( 2, value.get( 'attr2' ), "The data should remain set to the new model" );
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