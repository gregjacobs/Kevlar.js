/*global jQuery, Ext, Y, Kevlar, tests */
tests.unit.data.add( new Ext.test.TestSuite( {
	name : 'Kevlar.data.NativeObjectConverter',
	
	items : [
	
		/*
		 * Test convert() with a model
		 */
		{
			name : "Test convert() with a model",
			
			"convert() should return a key for each of the Attributes in the Model, whether or not any data has been set to them" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 'attribute1', 'attribute2' ]
				} );
				var model = new Model( { attribute1: 'value1' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model );
				Y.ObjectAssert.hasKey( 'attribute1', data, "The data returned should have attribute1" );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.ObjectAssert.hasKey( 'attribute2', data, "The data returned should have attribute2, even though no value has been set to it" );
				Y.Assert.isUndefined( data.attribute2, "attribute2 should be undefined in the returned data" );
			},
			
			
			"convert() should return the data by running attributes' `get` functions (not just returning the raw data), when the `raw` option is not provided" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 
						'attribute1', 
						{ name: 'attribute2', get: function( valuel ) { return "42 " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
			},
			
			
			// -------------------------------
			
			// Test with `raw` option set to true
			
			"when the `raw` option is provided as true, convert() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 
						'attribute1', 
						{ name: 'attribute2', get: function( value ) { return "42 " + this.get( 'attribute1' ); } },
						{ name: 'attribute3', raw: function( value ) { return value + " " + this.get( 'attribute1' ); } }
					]
				} );
				var model = new Model( { attribute1: 'value1', attribute2: 'value2', attribute3: 'value3' } );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { raw: true } );
				Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
				Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
				Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
			},
			
			
			// -------------------------------
			
			// Test with `persistedOnly` option set to true
			
			"convert() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) with the `persistedOnly` option set to true" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [
						{ name : 'attribute1', persist: true },
						{ name : 'attribute2', persist: false },
						{ name : 'attribute3', persist: true },
						{ name : 'attribute4', persist: false }
					]
				} );
				
				var model = new Model();
				
				var persistedData = Kevlar.data.NativeObjectConverter.convert( model, { persistedOnly: true } );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( persistedData ), "The persisted data should only have 2 properties" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], persistedData, "The persisted data should have 'attribute1' and 'attribute3'" );
			},
			
			
			// -------------------------------
			
			// Test with specific `attributeNames`
			
			"convert() should only process the attributes of a Model that are defined by the 'attributeNames' option (if provided)" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [
						{ name : 'attribute1', persist: true },
						{ name : 'attribute2', persist: false },
						{ name : 'attribute3', persist: true },
						{ name : 'attribute4', persist: false }
					]
				} );
				
				var model = new Model();
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { attributeNames: [ 'attribute1', 'attribute3' ] } );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( data ), "The data should only have 2 properties" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], data, "The data should only have 'attribute1' and 'attribute3'" );
			},
			
			
			"Using the 'attributeNames' option should only affect the Model that is provided to convert(), not nested models" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attribute1', 'attribute2' ]
				} );
				
				var model = new Model( {
					attribute1: new Model( {  // nested model
						attribute1: 'innerValue1',
						attribute2: 'innerValue2'
					} ),
					attribute2: 'value2'
				} );
				
				var data = Kevlar.data.NativeObjectConverter.convert( model, { attributeNames: [ 'attribute1' ] } );
				
				// Check the outer object -- the conversion of `model`
				Y.Assert.areSame( 1, Kevlar.util.Object.length( data ), "The data should only have 1 property" );
				Y.ObjectAssert.ownsKeys( [ 'attribute1' ], data, "attribute1 should exist on the return data" );
				
				// Check the inner object -- the conversion of the nested model
				var innerData = data.attribute1;
				Y.Assert.areSame( 2, Kevlar.util.Object.length( innerData ), "The inner (nested) data should have 2 properties" );
				Y.Assert.areSame( 'innerValue1', innerData.attribute1, "The inner (nested) attribute1 should have the correct value" );
				Y.Assert.areSame( 'innerValue2', innerData.attribute2, "The inner (nested) attribute2 should have the correct value" );
			},
			
			
			// -------------------------------
			
			// Test with nested models that have circular references
			
			"convert() should deep convert nested models, while handing circular references" : function() {
				var Model = Kevlar.Model.extend( {
					addAttributes : [ 'value', 'relatedModel' ]
				} );
				
				var outerModel = new Model(),
				    innerModel = new Model();
				
				// Set up the outerModel to refer to the innerModel, and the innerModel to refer to the outerModel
				outerModel.set( 'value', 'outerModel-value' );
				outerModel.set( 'relatedModel', innerModel );
				
				innerModel.set( 'value', 'innerModel-value' );
				innerModel.set( 'relatedModel', outerModel );
				
				
				var data = Kevlar.data.NativeObjectConverter.convert( outerModel );
				Y.Assert.areSame( 2, Kevlar.util.Object.length( data ), "The outerModel data should only have 2 properties" );
				
				// Check that references to other models were set up correctly
				Y.Assert.areSame( 'innerModel-value', data.relatedModel.value, "Should be able to access the inner model's value from the outer model." );
				Y.Assert.areSame( 'outerModel-value', data.relatedModel.relatedModel.value, "Should be able to access the outer model's value from the inner model" );
				Y.Assert.areSame( 'innerModel-value', data.relatedModel.relatedModel.relatedModel.value, "Should be able to go around and around, just to make sure we have the circular dependency handled" );
				
				// Make sure that the data object for the outer model, when referenced from the inner model, points back to the `data` 
				// variable that is returned by the convert() method
				Y.Assert.areSame( data, data.relatedModel.relatedModel, "The outer -> inner -> outer should point to the `data` object returned by the convert() method, as that is the model that was converted" ); 
				
				// Make sure that references really do point to the same object
				Y.Assert.areSame( data.relatedModel.relatedModel, data.relatedModel.relatedModel.relatedModel.relatedModel, "The outer -> inner -> outer should point to the outer reference" );
			}
		},
		
		
		/*
		 * Test convert() with a Collection
		 */
		{
			name : "Test convert() with a Collection",
			
			"convert() should convert a Collection of Models into an Array of Objects" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var collection = new Collection( [ { attr1: 1, attr2: 2 }, { attr1: 3, attr2: 4 } ] );
				var data = Kevlar.data.NativeObjectConverter.convert( collection );
				
				Y.Assert.isArray( data, "the data should be an array" );
				Y.Assert.areSame( 2, data.length, "There should be 2 items in the array" );
				Y.Assert.areSame( 1, data[ 0 ].attr1, "The first array item's attr1 should be 1" );
				Y.Assert.areSame( 2, data[ 0 ].attr2, "The first array item's attr2 should be 2" );
				Y.Assert.areSame( 3, data[ 1 ].attr1, "The second array item's attr1 should be 3" );
				Y.Assert.areSame( 4, data[ 1 ].attr2, "The second array item's attr2 should be 4" );
			},
			
			
			
			// -------------------------------
			
			// Test with nested models/collections that have circular references
			
			"convert() should deep convert nested models/collections, while handing circular references" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'nestedCollection' ]
				} );
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model = new Model();
				var collection = new Collection();
				
				// Set up the model to hold the collection, while the collection holds the model
				model.set( 'nestedCollection', collection );
				collection.add( model );
				
				var data = Kevlar.data.NativeObjectConverter.convert( collection );
				
				Y.Assert.isArray( data, "the data should be an array" );
				Y.Assert.areSame( 1, data.length, "There should be 1 item in the array" );
				Y.Assert.isObject( data[ 0 ], "The data's first element should be an object" );
				Y.Assert.isArray( data[ 0 ].nestedCollection, "The data's first element's nestedCollection should be an array" );
				Y.Assert.areSame( data, data[ 0 ].nestedCollection, "The nested collection's array should refer back to the same array created for 'data'" );
				
				// Make sure we can reference through the nested collections
				Y.Assert.areSame( data, data[ 0 ].nestedCollection[ 0 ].nestedCollection[ 0 ].nestedCollection, "Nesty nesty nesty should work" );
			}
		}
	]

} ) );