/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestSuite( {
	name: 'Kevlar.Collection',
	
	
	items : [
		
		/*
		 * Test the constructor
		 */
		{
			name : "Test the constructor",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			"The constructor should accept a Model to initialize the Collection with" : function() {
				var model = new this.Model( { attr: 'value1' } ),
				    collection = new this.Collection( model );
				
				var models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model1 in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model in the collection should be the one provided to the constructor" );
			},
			
			"The constructor should accept an array of Models to initialize the Collection with" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				var models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( model1, models[ 0 ], "The first model should be the first model provided to the constructor" );
				Y.Assert.areSame( model2, models[ 1 ], "The second model should be the second model provided to the constructor" );
			}
		},
		
		
		/*
		 * Test createModel()
		 */
		{
			name : "Test createModel()",
			
			"createModel() should take an anonymous config object, and transform it into a Model instance, based on the modelClass config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					modelClass : Model
				} );
				
				var collection = new Collection();
				var model = collection.createModel( { attr: 'testValue' } );
				
				Y.Assert.isInstanceOf( Model, model );
				Y.Assert.areSame( 'testValue', model.get( 'attr' ) );
			}
		},
		
	
		/*
		 * Test add()
		 */
		{
			name : "Test add()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			"add() should be able to add a single Model instance to the Collection" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.add( model );
				
				models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model added should be the first model in the collection" );
			},
			
			
			"add() should be able to add an array of Model instances to the Collection" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.add( [ model1, model2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( model1, models[ 0 ], "The first model added in the array should be the first model in the collection" );
				Y.Assert.areSame( model2, models[ 1 ], "The second model added in the array should be the second model in the collection" );
			},
			
			
			// -------------------------
			
			// Test the 'add' event
			
			
			"add() should fire the 'add' event with the array of inserted models" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.add( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'add' event" );
				Y.Assert.areSame( model1, addedModels[ 0 ], "The first model added in the array should be the first model added to the collection" );
				Y.Assert.areSame( model2, addedModels[ 1 ], "The second model added in the array should be the second model added to the collection" );
			},
			
			
			"add() should fire the 'add' event with the array of inserted models, even if only one model is inserted" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.add( model );
				
				Y.Assert.areSame( 1, addedModels.length, "1 model should have been provided to the 'add' event" );
				Y.Assert.areSame( model, addedModels[ 0 ], "The model provided with the 'add' event should be the model added to the collection" );
			},
			
			
			// -------------------------
			
			// Test converting anonymous configs to Model instances
			
			
			"add() should transform anonymous data objects to Model instances, based on the modelClass config" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the modelClass
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' },
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.add( [ modelData1, modelData2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( 'value1', models[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', models[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			"add() should fire the 'add' event with instantiated models for any anonymous config objects" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the modelClass
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' };
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.add( [ modelData1, modelData2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'add' event" );
				Y.Assert.areSame( 'value1', addedModels[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', addedModels[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			// -------------------------
			
			// Test sorting functionality with the `sortBy` config
			
			
			"add() should insert models in the order specified by the sortBy config, if one is provided" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'name' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					sortBy : function( model1, model2 ) {
						var name1 = model1.get( 'name' ),
						    name2 = model2.get( 'name' );
						    
						return ( name1 < name2 ) ? -1 : ( name1 > name2 ) ? 1 : 0;
					}
				} );
				
				
				var model1 = new Model( { name : "A" } ),
				    model2 = new Model( { name : "B" } ),
				    model4 = new Model( { name : "D" } ),  // intentionally model4. Adding model3 later
				    models;
				
				var collection = new Collection();
				collection.add( [ model2, model4, model1 ] );  // Insert models in incorrect order
				
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model4 ], models, "The models should have been re-ordered based on the 'name' attribute" );
				
				
				// Now create a new model, and see if it gets inserted in the correct position
				var model3 = new Model( { name : "C" } );
				collection.add( model3 );
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "The models should have been re-ordered based on the 'name' attribute with the new model" );
			}
			
		},
		
		
		
		{
			/*
			 * Test remove()
			 */
			name : "Test remove()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			
			"remove() should be able to remove a single Model from the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } ),
				    model4 = new this.Model( { boolAttr: true, numberAttr: 3, stringAttr: "value3" } );
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.remove( model2 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model2, models, "model2 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model4 ], models, "The remaining 3 models should all exist, and be in the correct order" );
				
				collection.remove( model4 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model4, models, "model4 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3 ], models, "The remaining 2 models should all exist, and be in the correct order" );
				
				collection.remove( model1 );
				models = collection.getModels();
				Y.ArrayAssert.doesNotContain( model1, models, "model1 should no longer exist in the Collection" );
				Y.ArrayAssert.itemsAreSame( [ model3 ], models, "The remaining model should exist" );
				
				collection.remove( model3 );
				models = collection.getModels();
				Y.ArrayAssert.isEmpty( models, "There should be no more models left" );   
			},
			
			
			"remove() should be able to remove an array of Models from the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } ),
				    model4 = new this.Model( { boolAttr: true, numberAttr: 3, stringAttr: "value3" } );
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.remove( [ model2, model4 ] );
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model3 ], models, "Only model1 and model3 should remain" );
			},
			
			
			// -------------------------
			
			// Test converting anonymous configs to Model instances
			
			
			"remove() should fire the 'remove' event with the array of removed models, even if only one model has been removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removedModels;
				collection.on( 'remove', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.remove( model2 );
				Y.ArrayAssert.itemsAreSame( [ model2 ], removedModels );
			},
			
			
			"remove() should fire the 'remove' event with the array of removed models when multiple models are removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				var removedModels;
				collection.on( 'remove', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.remove( [ model1, model2 ] );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], removedModels );
			},
			
			
			"remove() should *not* fire the 'remove' event if no models are actually removed" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1 ] );
				
				var removeEventCallCount = 0;
				collection.on( 'remove', function( collection, models ) {
					removeEventCallCount++;
				} );
				
				collection.remove( model2 );  // model2 doesn't exist on the Collection
				Y.Assert.areSame( 0, removeEventCallCount );
			}			
		},
		
		
		
		{
			/*
			 * Test getFirst()
			 */
			name : "Test getFirst()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			
			"getFirst() should retrieve the first Model in the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    collection = new this.Collection( [ model1, model2 ] );
				    
				Y.Assert.areSame( model1, collection.getFirst() );
			},
			
			
			"getFirst() should return null if there are no models in the Collection" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isNull( collection.getFirst() );
			}
			
		},
		
		
		
		{
			/*
			 * Test getLast()
			 */
			name : "Test getLast()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			"getLast() should retrieve the first Model in the Collection" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    collection = new this.Collection( [ model1, model2 ] );
				    
				Y.Assert.areSame( model2, collection.getLast() );
			},
			
			
			"getLast() should return null if there are no models in the Collection" : function() {
				var collection = new this.Collection();
				
				Y.Assert.isNull( collection.getLast() );
			}			
		},
		
		
		{
			/*
			 * Test has()
			 */
			name : "Test has()",
			
			"has() should return true if a model has been added to the collection, and false if a model has not been added to the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } );
				var Collection = Kevlar.Collection.extend( {} );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Collection();
				
				Y.Assert.isFalse( collection.has( model1 ), "Initial condition: the collection should not have model1" );
				Y.Assert.isFalse( collection.has( model2 ), "Initial condition: the collection should not have model2" );
				
				collection.add( model1 );
				Y.Assert.isTrue( collection.has( model1 ), "The collection should now have model1" );
				
				Y.Assert.isFalse( collection.has( model2 ), "The collection should still not have model2, as it has not been added" );
				
				
				// Now remove model1, and test again
				collection.remove( model1 );
				Y.Assert.isFalse( collection.has( model1 ), "The collection should not have model1 anymore, as it has been removed" );
			}
		},
		
		
		/*
		 * Test find()
		 */
		{
			name : "Test find()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			"find() should find a Model by attribute and value" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } );
				    
				var collection = new this.Collection( [ model1, model2 ] ),
				    foundModel;
				
				foundModel = collection.find( 'boolAttr', false );
				Y.Assert.areSame( model1, foundModel, "did not find model by boolean false" );
				
				foundModel = collection.find( 'boolAttr', true );
				Y.Assert.areSame( model2, foundModel, "did not find model by boolean true" );
				
				foundModel = collection.find( 'numberAttr', 0 );
				Y.Assert.areSame( model1, foundModel, "did not find model by number 0" );
				
				foundModel = collection.find( 'numberAttr', 1 );
				Y.Assert.areSame( model2, foundModel, "did not find model by number 1" );
				
				foundModel = collection.find( 'stringAttr', "" );
				Y.Assert.areSame( model1, foundModel, "did not find model by empty string" );
				
				foundModel = collection.find( 'stringAttr', "value" );
				Y.Assert.areSame( model2, foundModel, "did not find model by string value" );
				
				// Try finding a model by a value that doesn't exist
				foundModel = collection.find( 'stringAttr', "ooglyBoogly" );
				Y.Assert.isNull( foundModel, "Finding a model by an attribute that doesn't exist should return null" );
			},
			
			
			"find() should start at a given startIndex when provided" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				// Start at index 1 (position 2), which should match model3 instead of model1
				foundModel = collection.find( 'boolAttr', false, { startIndex: 1 } );
				Y.Assert.areSame( model3, foundModel, "The model that was found should have been model3, because it is the only one that matched the criteria past the given startIndex" );
			}
			
		},
		
		
		
		/*
		 * Test findBy()
		 */
		{
			name : "Test findBy()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'boolAttr', 'numberAttr', 'stringAttr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					modelClass : this.Model
				} );
			},
			
			
			"findBy should accept a function that when it returns true, it considers the Model the match" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					if( model.get( 'boolAttr' ) === true ) {
						return true;
					}
				} );
				Y.Assert.areSame( model2, foundModel );
			},
			
			
			"findBy should return null when there is no match" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					// Simulate no match with an empty function that never returns `true`
				} );
				Y.Assert.isNull( foundModel );
			},
			
			
			"findBy should start at the given startIndex" : function() {
				var model1 = new this.Model( { boolAttr: false, numberAttr: 0, stringAttr: "" } ),
				    model2 = new this.Model( { boolAttr: true, numberAttr: 1, stringAttr: "value" } ),
				    model3 = new this.Model( { boolAttr: false, numberAttr: 2, stringAttr: "value2" } );
				    
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    foundModel;
				
				foundModel = collection.findBy( function( model, index ) {
					if( model.get( 'boolAttr' ) === false ) {
						return true;
					}
				}, { startIndex: 1 } );
				Y.Assert.areSame( model3, foundModel );
			}
		}
	]
	
} ) );