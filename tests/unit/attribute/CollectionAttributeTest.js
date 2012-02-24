/*global window, Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Kevlar.attribute.CollectionAttribute',
	
	
	items : [
		
		/*
		 * Test constructor
		 */
		{
			name : "Test constructor",
			
			// Special instructions
			_should : {
				error : {
					"the constructor should throw an error if the undefined value is provided for the collectionClass config, which helps determine when late binding is needed for the collectionClass config" : 
						 "The 'collectionClass' config provided to an Attribute with the name 'attr' either doesn't exist, or doesn't " +
			             "exist just yet. Consider using the String or Function form of the collectionClass config for late binding, if needed"
				}
			},
			
			
			"the constructor should throw an error if the undefined value is provided for the collectionClass config, which helps determine when late binding is needed for the collectionClass config" : function() {
				var attr = new Kevlar.attribute.CollectionAttribute( {
					name : 'attr',
					collectionClass: undefined
				} );
				
				Y.Assert.fail( "The constructor should have thrown an error if the collectionClass config was provided but was undefined. This is to help with debugging when late binding for the collectionClass is needed." );
			}
		},
		
		
		/*
		 * Test valuesAreEqual()
		 */
		{
			name : "Test valuesAreEqual()",
			
			setUp : function() {
				this.attribute = new Kevlar.attribute.CollectionAttribute( { name: 'attr' } );
			},
			
			
			"valuesAreEqual() should return true for two null values" : function() {
				var result = this.attribute.valuesAreEqual( null, null );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for one null and one object" : function() {
				var result;
				
				result = this.attribute.valuesAreEqual( null, {} );
				Y.Assert.isFalse( result );
				
				result = this.attribute.valuesAreEqual( {}, null );
				Y.Assert.isFalse( result );
			},
			
			
			"valuesAreEqual() should return true for comparing the same collection" : function() {
				var Collection = Kevlar.Collection.extend( {} ),
				    collection = new Collection();
				
				var result = this.attribute.valuesAreEqual( collection, collection );
				Y.Assert.isTrue( result );
			},
			
			
			"valuesAreEqual() should return false for two different collections" : function() {
				var Collection = Kevlar.Collection.extend( {} ),
				    collection1 = new Collection(),
				    collection2 = new Collection();
				
				var result = this.attribute.valuesAreEqual( collection1, collection2 );
				Y.Assert.isFalse( result );
			}
		},
		
		
		/*
		 * Test beforeSet()
		 */
		{
			name : "Test beforeSet()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				this.attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: this.Collection
				} );
			},
			
			
			"beforeSet() should return null when provided any falsy value, or non-object" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    attribute = new Kevlar.attribute.CollectionAttribute( { name: 'attr' } ),
				    oldValue,  // undefined
				    value;
				
				value = attribute.beforeSet( mockModel, oldValue, 0 );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, 1 );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, "" );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, "hi" );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, false );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, true );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, undefined );
				Y.Assert.areSame( null, value );
				
				value = attribute.beforeSet( mockModel, oldValue, null );
				Y.Assert.areSame( null, value );
			},
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a direct reference to the Collection subclass" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    oldValue,  // undefined
				    value = this.attribute.beforeSet( mockModel, oldValue, data );
				
				Y.Assert.isInstanceOf( this.Collection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a string" : function() {
				window.__Kevlar_CollectionAttributeTest_Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: '__Kevlar_CollectionAttributeTest_Collection'
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, oldValue, data );
				
				Y.Assert.isInstanceOf( window.__Kevlar_CollectionAttributeTest_Collection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should convert an array of data objects, when collectionClass is a function" : function() {
				var TestCollection = Kevlar.Collection.extend( {
					model : this.Model
				} );
				
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;  // undefined
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr',
					collectionClass: function() {
						return TestCollection;   // for late binding
					}
				} );
				
				var data = [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ],
				    value = attribute.beforeSet( mockModel, oldValue, data );
				
				Y.Assert.isInstanceOf( TestCollection, value, "The return value from beforeSet should have been an instance of the Collection" );
				
				var model1 = value.getAt( 0 ),
				    model2 = value.getAt( 1 );
				Y.Assert.areSame( 1, model1.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 2, model1.get( 'attr2' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 3, model2.get( 'attr1' ), "The data should have been converted to a model in the collection" );
				Y.Assert.areSame( 4, model2.get( 'attr2' ), "The data should have been converted to a model in the collection" );
			},
			
			
			"beforeSet() should return an actual Collection instance unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue,  // undefined
				    data = new this.Collection( [ { attr1 : 1, attr2: 2 } ] ),
				    value = this.attribute.beforeSet( mockModel, oldValue, data );
				
				Y.Assert.areSame( data, value, "The return value from beforeSet should have been the same collection instance" );
				
				var model = value.getAt( 0 );
				Y.Assert.areSame( 1, model.get( 'attr1' ), "The data should remain set to the new model" );
				Y.Assert.areSame( 2, model.get( 'attr2' ), "The data should remain set to the new model" );
			},
			
			
			// --------------------
			
			
			"if no collectionClass was provided, beforeSet() should return an array unchanged" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    oldValue;
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr'
				} );
				
				var data = [ { attr1: 1, attr2: 2 } ],
				    value = attribute.beforeSet( mockModel, oldValue, data );
				
				Y.Assert.areSame( data, value );
			}
		},
		
		
		/*
		 * Test afterSet()
		 */
		{
			name : "Test afterSet()",
			
			
			"afterSet() should return the collection (i.e. it doesn't forget the return statement!)" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    mockCollection = JsMockito.mock( Kevlar.Collection );
				
				var attribute = new Kevlar.attribute.CollectionAttribute( { 
					name: 'attr'
				} );
				
				var value = attribute.afterSet( mockModel, mockCollection );
				Y.Assert.areSame( mockCollection, value );
			}
			
		}
		
	]
	
} ) );