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
					model : this.Model
				} );
			},
			
			"The constructor should accept a configuration object to initialize the Collection with an initial set of models and any other custom configs" : function() {
				var model = new this.Model( { attr: 'value1' } );
				
				var collection = new this.Collection( {
					models: model,
					customConfig: 1
				} );
				
				var models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model in the collection should be the one provided to the 'models' config" );
				
				// Check that the custom config was applied to the collection
				Y.Assert.areSame( 1, collection.customConfig, "The customConfig should have been applied to the collection" );
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
			
			"createModel() should take an anonymous config object, and transform it into a Model instance, based on the 'model' config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
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
			
			"add() should simply delegate to the insert() method" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var insertedModels, insertedIndex;
				var Collection = Kevlar.Collection.extend( {
					model : Model,
					
					// override insert() method, to make sure it is called
					insert : function( models, index ) {
						insertedModels = models;
						insertedIndex = index;
					}
				} );
				
				var collection = new Collection(),
				    model1 = new Model(),
				    model2 = new Model();
				    
				collection.add( [ model1, model2 ] );
				
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], insertedModels, "The models passed to insert() should be the same ones provided to add()" );
				Y.Assert.isUndefined( insertedIndex, "The index for the insert should be undefined, which defaults to appending the models to the collection" );
			}
		},
		
	
		/*
		 * Test insert()
		 */
		{
			name : "Test insert()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"insert() should be able to add a single Model instance to the Collection" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( model );
				
				models = collection.getModels();
				Y.Assert.areSame( 1, models.length, "There should now be one model in the collection" );
				Y.Assert.areSame( model, models[ 0 ], "The model added should be the first model in the collection" );
			},
			
			
			"insert() should be able to add a single Model instance to the Collection at a specified index" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2 ] ), // only inserting model1 and model2 for now
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "Initial condition: There should be 2 models in the collection" );
				
				// Now insert model3 in the middel
				collection.insert( model3, 1 );
				
				models = collection.getModels();
				Y.Assert.areSame( 3, models.length, "There should now be 3 models in the collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model2 ], models, "model3 should have been added in the middle" );
			},
			
			
			"insert() should be able to add an array of Model instances to the Collection" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( [ model1, model2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( model1, models[ 0 ], "The first model added in the array should be the first model in the collection" );
				Y.Assert.areSame( model2, models[ 1 ], "The second model added in the array should be the second model in the collection" );
			},
			
			
			"insert() should be able to add an array of Model instance to the Collection at a specified index" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    model4 = new this.Model( { attr: 'value4' } ),
				    collection = new this.Collection( [ model1, model2 ] ), // only inserting model1 and model2 for now
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "Initial condition: There should be 2 models in the collection" );
				
				// Now insert model3 and model4 in the middel
				collection.insert( [ model3, model4 ], 1 );
				
				models = collection.getModels();
				Y.Assert.areSame( 4, models.length, "There should now be 4 models in the collection" );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model4, model2 ], models, "model3 and model4 should have been added in the middle" );
			},
			
			
			
			
			// -------------------------
			
			// Test the 'add' event
			
			
			"insert() should fire the 'add' event with the array of inserted models, even if only one model is inserted" : function() {
				var collection = new this.Collection(),
				    model = new this.Model( { attr: 'value' } ),
				    models;
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( model );
				
				Y.Assert.areSame( 1, addedModels.length, "1 model should have been provided to the 'add' event" );
				Y.Assert.areSame( model, addedModels[ 0 ], "The model provided with the 'add' event should be the model added to the collection" );
			},
			
			
			"insert() should fire the 'add' event with the array of inserted models when multiple models are inserted" : function() {
				var collection = new this.Collection(),
				    model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    models;
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'add' event" );
				Y.Assert.areSame( model1, addedModels[ 0 ], "The first model added in the array should be the first model added to the collection" );
				Y.Assert.areSame( model2, addedModels[ 1 ], "The second model added in the array should be the second model added to the collection" );
			},
			
			
			"insert() should *not* fire the 'add' event for a model that is already in the Collection" : function() {
				var model = new this.Model( { attr: 'value1' } ),
				    collection = new this.Collection( [ model ] );  // initally add the model
				
				var addEventFired = false;
				collection.on( 'add', function( collection, models ) {
					addEventFired = true;
				} );
				collection.insert( model );
				
				Y.Assert.isFalse( addEventFired, "The 'add' event should not have been fired for another insert of the same model" );
			},
			
			
			"insert() should *not* fire the 'add' event for a model that is already in the Collection when multiple models are inserted, and only some exist already" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    collection = new this.Collection( [ model1 ] );  // initally add model1
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ model1, model2 ] );  // now insert model1 and model2. Only model2 should really have been "added"
				
				Y.ArrayAssert.itemsAreSame( [ model2 ], addedModels, "The 'add' event should have only fired with the model that was actually added" );
			},
			
			
			// -------------------------
			
			// Test reordering models
			
			
			"insert() should reorder models when they already exist in the Collection" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				collection.insert( model3, 0 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "insert() should have moved model3 to the beginning" );
				
				collection.insert( [ model2, model1 ], 0 );
				Y.ArrayAssert.itemsAreSame( [ model2, model1, model3 ], collection.getModels(), "insert() should have moved model2 and model1 to the beginning" );
				
				collection.insert( model2, 2 );
				Y.ArrayAssert.itemsAreSame( [ model1, model3, model2 ], collection.getModels(), "insert() should have moved model2 to the end" );
				
				
				// Try attempting to move models to out-of-bound indexes (they should be normalized)
				collection.insert( model2, -1000 );
				Y.ArrayAssert.itemsAreSame( [ model2, model1, model3 ], collection.getModels(), "insert() should have moved model2 to the beginning with an out of bounds negative index" );
				
				collection.insert( [ model1, model2 ], 1000 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "insert() should have moved model1 and model2 to the end with an out of bounds positive index" );
			},
			
			
			"insert() should fire the 'reorder' event when reordering models" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				var reorderEventCallCount = 0,
				    reorderedModels = [],      // all of these are
				    reorderedNewIndexes = [],  // arrays, for when we test
				    reorderedOldIndexes = [];  // reordering multiple models at once
				    
				collection.on( 'reorder', function( collection, model, newIndex, oldIndex ) {
					reorderEventCallCount++;
					reorderedModels.push( model );
					reorderedNewIndexes.push( newIndex );
					reorderedOldIndexes.push( oldIndex );
				} );
				
				collection.insert( model3, 0 );
				Y.ArrayAssert.itemsAreSame( [ model3, model1, model2 ], collection.getModels(), "The models should be in the correct new order (this is mostly here to just show which order the collection should now be in)" );
				Y.Assert.areSame( 1, reorderEventCallCount, "The reorder event should have been fired exactly once" );
				Y.ArrayAssert.itemsAreSame( [ model3 ], reorderedModels, "model3 should have been fired with a 'reorder' event (and that is the only reorder event that should have been fired)" );
				Y.ArrayAssert.itemsAreSame( [ 0 ], reorderedNewIndexes, "the new index for model3 should have been reported as index 0" );
				Y.ArrayAssert.itemsAreSame( [ 2 ], reorderedOldIndexes, "the old index for model3 should have been reported as index 2" );
				
				
				// Reset the result variables first
				reorderEventCallCount = 0;
				reorderedModels = [];
				reorderedNewIndexes = [];
				reorderedOldIndexes = [];
				
				collection.insert( [ model1, model2 ], 0 );  // move model1 and model2 back to the beginning
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], collection.getModels(), "The models should be in the correct new order (this is mostly here to just show which order the collection should now be in)" );
				Y.Assert.areSame( 2, reorderEventCallCount, "The reorder event should have been fired exactly twice" );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], reorderedModels, "model1 and model2 should have been fired with a 'reorder' events" );
				Y.ArrayAssert.itemsAreSame( [ 0, 1 ], reorderedNewIndexes, "the new indexes for model1 and model2 should have been reported as index 0, and 1, respectively" );
				Y.ArrayAssert.itemsAreSame( [ 1, 2 ], reorderedOldIndexes, "the old indexes for model1 and model2 should have been reported as index 1, and 2, respectively" );
			},
			
			
			"insert() should *not* reorder models when calling insert() without the `index` argument (which would be the case as well if add() was called)" : function() {
				var model1 = new this.Model( { attr: 'value1' } ),
				    model2 = new this.Model( { attr: 'value2' } ),
				    model3 = new this.Model( { attr: 'value3' } ),
				    collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				collection.insert( model1 );  // supposed append, but model1 is already in the Collection, and an index was not given
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], collection.getModels(), "The models should be in the original order, as the supposed 'append' should not have happened because the model was already in the collection, and no new index was given" );
			},
			
			
			// -------------------------
			
			// Test converting anonymous configs to Model instances
			
			
			"insert() should transform anonymous data objects to Model instances, based on the 'model' config" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the 'model'
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' },
				    models;
				
				models = collection.getModels();
				Y.Assert.areSame( 0, models.length, "Initial condition: There should be no models in the collection" );
				
				collection.insert( [ modelData1, modelData2 ] );
				
				models = collection.getModels();
				Y.Assert.areSame( 2, models.length, "There should now be two models in the collection" );
				Y.Assert.areSame( 'value1', models[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', models[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			"insert() should fire the 'add' event with instantiated models for any anonymous config objects" : function() {
				var collection = new this.Collection(),  // note: this.Collection is configured with this.Model as the 'model'
				    modelData1 = { attr: 'value1' },
				    modelData2 = { attr: 'value2' };
				
				var addedModels;
				collection.on( 'add', function( collection, models ) {
					addedModels = models;
				} );
				collection.insert( [ modelData1, modelData2 ] );
				
				Y.Assert.areSame( 2, addedModels.length, "2 models should have been provided to the 'add' event" );
				Y.Assert.areSame( 'value1', addedModels[ 0 ].get( 'attr' ), "The first model added in the array should have the data provided from modelData1" );
				Y.Assert.areSame( 'value2', addedModels[ 1 ].get( 'attr' ), "The second model added in the array should have the data provided from modelData2" );
			},
			
			
			// -------------------------
			
			// Test sorting functionality with the `sortBy` config
			
			
			"insert() should insert models in the order specified by the sortBy config, if one is provided" : function() {
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
				collection.insert( [ model2, model4, model1 ] );  // Insert models in incorrect order
				
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model4 ], models, "The models should have been re-ordered based on the 'name' attribute" );
				
				
				// Now create a new model, and see if it gets inserted in the correct position
				var model3 = new Model( { name : "C" } );
				collection.insert( model3 );
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "The models should have been re-ordered based on the 'name' attribute with the new model" );
			},
			
			
			"the sortBy() function should be called in the scope of the Collection" : function() {
				var attributeNameToSortBy = "";
				
				var Model = Kevlar.Model.extend( {
					attributes : [ 'name' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// A method, just to make sure sortBy() is called in the correct scope
					getAttributeNameToSortBy : function() {
						return 'name';
					},
					
					sortBy : function( model1, model2 ) {
						attributeNameToSortBy = this.getAttributeNameToSortBy();  // If sortBy() is not called in the correct scope, this method call will fail
						
						return 0;
					}
				} );
				
				var model1 = new Model( { name : "A" } ),
				    model2 = new Model( { name : "B" } ),
				    model3 = new Model( { name : "C" } );
				    
				var collection = new Collection();
				collection.insert( [ model2, model3, model1 ] );  // Insert models in incorrect order
				
				Y.Assert.areSame( 'name', attributeNameToSortBy, "The attributeNameToSortBy variable should have been set by sortBy() being called in the correct scope, able to access its helper method" );
			},
			
			
			// -------------------------
			
			// Test duplicates functionality
			
			
			"insert() should not allow duplicate models (at this time. config option to come)" : function() {
				var model = new this.Model(),
				    collection = new this.Collection();
				
				collection.insert( [ model, model ] );  // try to add the model twice
				Y.ArrayAssert.itemsAreSame( [ model ], collection.getModels(), "There should only be the one model in the collection at this time" );
			},
			
			
			// -------------------------
			
			// Test adding the "id" change listener
			
			
			"insert() should attach a 'change' listener for changes to the 'idAttribute' of a model, so that its internal modelsById hashmap can be updated if it changes" : function() {
				var onModelIdChangeCallCount = 0,
				    newIdValue, oldIdValue;
				
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// extend onModelIdChange to test if it's being called the correct number of times, and with the correct arguments
					onModelIdChange : function( model, newValue, oldValue ) {
						onModelIdChangeCallCount++;
						newIdValue = newValue;
						oldIdValue = oldValue;
						
						// Now call original method
						this._super( arguments );
					}
				} );
				
				var model = new Model();
				var collection = new Collection( [ model ] );
				
				model.set( 'id', 1 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly once" );
				Y.Assert.areSame( 1, newIdValue, "The newIdValue should be 1" );
				Y.Assert.isUndefined( oldIdValue, "The oldIdValue should be undefined" );
				
				// As a check, make sure that the model can be retrieved by its ID
				Y.Assert.areSame( model, collection.getById( 1 ), "The model should have been able to be retrieved by its ID" );
				
				
				// Now set again, to make sure that the modelsById collection was updated correctly
				model.set( 'id', 2 );
				Y.Assert.areSame( 2, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly twice at this point" );
				Y.Assert.areSame( 2, newIdValue, "The newIdValue should be 2" );
				Y.Assert.areSame( 1, oldIdValue, "The oldIdValue should be 1" );
				
				// As a check, try to access the model by its old ID, and its new one
				Y.Assert.isNull( collection.getById( 1 ), "The model should no longer be retrievable by its old ID" );
				Y.Assert.areSame( model, collection.getById( 2 ), "The model should now be retrievable by its new ID" );
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
					model : this.Model
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
			},
			
			
			// -------------------------
			
			// Test that the modelsById and modelsByClientId hashmaps are maintained properly
			
			
			"remove() should remove the model from the modelsById hashmap, so it is no longer retrievable by getById" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var model = new Model( { id : 1 } ); 
				var collection = new Kevlar.Collection( [ model ] );
				
				Y.Assert.areSame( model, collection.getById( 1 ), "Initial condition: the model should be available to getById()" );
				
				collection.remove( model );
				Y.Assert.isNull( collection.getById( 1 ), "The model should no longer be retrievable by getById() after removal" );
			},
			
			
			"remove() should remove the model from the modelsByClientId hashmap, so it is no longer retrievable by getById" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model = new Model(),
				    modelClientId = model.getClientId(),
				    collection = new Kevlar.Collection( [ model ] );
				
				Y.Assert.areSame( model, collection.getByClientId( modelClientId ), "Initial condition: the model should be available to getByClientId()" );
				
				collection.remove( model );
				Y.Assert.isNull( collection.getByClientId( modelClientId ), "The model should no longer be retrievable by getByClientId() after removal" );
			},
			
			
			// -------------------------
			
			// Test removing the "id" change listener
			
			
			"remove() should remove the 'change' listener for changes to the 'idAttribute' of a model, so that its internal modelsById hashmap can be updated if it changes" : function() {
				var onModelIdChangeCallCount = 0,
				    newIdValue, oldIdValue;
				
				var Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				var Collection = Kevlar.Collection.extend( {
					// extend onModelIdChange to test if it's being called the correct number of times, and with the correct arguments
					onModelIdChange : function( model, newValue, oldValue ) {
						onModelIdChangeCallCount++;
						newIdValue = newValue;
						oldIdValue = oldValue;
						
						// Now call original method
						this._super( arguments );
					}
				} );
				
				var model = new Model();
				var collection = new Collection( [ model ] );
				
				model.set( 'id', 1 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should have been called exactly once" );
				Y.Assert.areSame( 1, newIdValue, "The newIdValue should be 1" );
				Y.Assert.isUndefined( oldIdValue, "The oldIdValue should be undefined" );
				
				// As a check, make sure that the model can be retrieved by its ID
				Y.Assert.areSame( model, collection.getById( 1 ), "The model should have been able to be retrieved by its ID" );
				
				
				// Now remove the model, and make sure that onModelIdChange does *not* get called subsequently
				collection.remove( model );
				
				
				// Now set again, to make sure that the onModelIdChange method does *not* get called
				model.set( 'id', 2 );
				Y.Assert.areSame( 1, onModelIdChangeCallCount, "The onModelIdChange method should *not* have been called again at this point" );
			}
		},
		
		
		{
			/*
			 * Test removeAll()
			 */
			name : "Test removeAll()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes  : [ 'id' ],
					idAttribute : 'id'
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"removeAll() should be able to remove all Models from the Collection" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model(),
				    model4 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] ),
				    models;
				
				// Test initial condition
				models = collection.getModels();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], models, "Initial condition: the Collection should have 4 models" );
				
				collection.removeAll();
				models = collection.getModels();
				Y.ArrayAssert.isEmpty( models, "There should be no models left in the collection" );
			},
			
			
			
			"removeAll() should fire the 'remove' event with the array of removed models when multiple models are removed" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model(),
				    model4 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2, model3, model4 ] );
				
				var removedModels;
				collection.on( 'remove', function( collection, models ) {
					removedModels = models;
				} );
				
				collection.removeAll();
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3, model4 ], removedModels );
			},
			
			
			
			"removeAll() should *not* fire the 'remove' event if no models are actually removed" : function() {
				var collection = new this.Collection();  // no models
				
				var removeEventCallCount = 0;
				collection.on( 'remove', function( collection, models ) {
					removeEventCallCount++;
				} );
				
				collection.removeAll();  // model2 doesn't exist on the Collection
				Y.Assert.areSame( 0, removeEventCallCount );
			},
			
			
			"removeAll() should clear the `modelsByClientId` and `modelsById` hashmaps" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getByClientId( model1.getClientId() ), "Initial condition: should be able to retrieve model1 by clientId" );
				Y.Assert.areSame( model1, collection.getById( model1.getId() ), "Initial condition: should be able to retrieve model1 by id" );
				Y.Assert.areSame( model2, collection.getByClientId( model2.getClientId() ), "Initial condition: should be able to retrieve model2 by clientId" );
				Y.Assert.areSame( model2, collection.getById( model2.getId() ), "Initial condition: should be able to retrieve model2 by id" );
				
				collection.removeAll();
				
				Y.Assert.isNull( collection.getByClientId( model1.getClientId() ), "should no longer be able to retrieve model1 by clientId" );
				Y.Assert.isNull( collection.getById( model1.getId() ), "should no longer be able to retrieve model1 by id" );
				Y.Assert.isNull( collection.getByClientId( model2.getClientId() ), "should no longer be able to retrieve model2 by clientId" );
				Y.Assert.isNull( collection.getById( model2.getId() ), "should no longer be able to retrieve model2 by id" );
			}
		},
		
		
		
		
		
		// ------------------------
		
		{
			/*
			 * Test getAt()
			 */
			name : "Test getAt()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes: [ 'id' ],
					idAttribute: 'id'
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"getAt() should return the model at a given index" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getAt( 0 ), "model1 should be at index 0" );
				Y.Assert.areSame( model2, collection.getAt( 1 ), "model2 should be at index 1" );
			},
			
			"getAt() should return null for an index that is out of bounds" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model();
				    
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.isNull( collection.getAt( -1 ), "Should be null for a negative index" );
				Y.Assert.isNull( collection.getAt( 2 ), "Should be null for an index greater than the number of models" );
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
					model : this.Model
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
					model : this.Model
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
			 * Test getRange()
			 */
			name : "Test getRange()",
			
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"getRange() should retrieve all models when no arguments are provided" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models = collection.getRange();
				
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models );
			},
			
			
			"getRange() should retrieve models based on just the startIndex argument, defaulting endIndex to the last model in the Collection" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				models = collection.getRange( 0 );  // attempt to get all models starting at position 0
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "All models should have been retrieved" );
				
				models = collection.getRange( 1 );  // attempt to get all models starting at position 1
				Y.ArrayAssert.itemsAreSame( [ model2, model3 ], models, "The second and third models should have been retrieved" );
				
				models = collection.getRange( 2 );  // attempt to get all models starting at position 2
				Y.ArrayAssert.itemsAreSame( [ model3 ], models, "The third model should have been retrieved" );
				
				// Try an out-of-range startIndex
				models = collection.getRange( 3 );  // attempt to get all models starting at position 3 (out-of-range)
				Y.ArrayAssert.isEmpty( models, "No models should have been retrieved" );
			},
			
			
			"getRange() should retrieve models based on the startIndex and endIndex arguments" : function() {
				var model1 = new this.Model(),
				    model2 = new this.Model(),
				    model3 = new this.Model();
				
				var collection = new this.Collection( [ model1, model2, model3 ] ),
				    models;
				
				models = collection.getRange( 0, 0 );
				Y.ArrayAssert.itemsAreSame( [ model1 ], models, "0, 0 args did not work correctly. First model should have been retrieved" );
				
				models = collection.getRange( 0, 1 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2 ], models, "0, 1 args did not work correctly. First and second model should have been retrieved" );
				
				models = collection.getRange( 1, 1 );
				Y.ArrayAssert.itemsAreSame( [ model2 ], models, "1, 1 args did not work correctly. Second model should have been retrieved" );
				
				models = collection.getRange( 1, 2 );
				Y.ArrayAssert.itemsAreSame( [ model2, model3 ], models, "1, 2 args did not work correctly. Second and third models should have been retrieved" );
				
				models = collection.getRange( 0, 2 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "0, 2 args did not work correctly. Second and third models should have been retrieved" );
				
				// Test out-of-range indexes
				models = collection.getRange( -10000, 10000 );
				Y.ArrayAssert.itemsAreSame( [ model1, model2, model3 ], models, "Out of range -10000, 10000 args did not work correctly. All models should have been retrieved" );
			}
		},
		
		
		{
			/*
			 * Test getModels()
			 */		
			name : "Test getModels()",
			
			"getModels() should return the array of models, but in a new array so that the array can be changed" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    model3 = new Model( { attr: 3 } ),
				    collection = new Kevlar.Collection( [ model1, model2, model3 ] );
				
				var modelsArray = collection.getModels();
				
				// Try removing a model from the array, and make sure that it does not affect the Collection
				modelsArray.splice( 0, 1 );
				Y.Assert.areSame( 2, modelsArray.length, "The models array should have been reduced to 2 elements" );
				Y.Assert.areSame( 3, collection.getCount(), "The number of models in the collection should still be 3" );
			}
		},
		
				
		{
			/*
			 * Test getData()
			 */
			name: 'Test getData()',
			
			setUp : function() {
				// Hijack the Kevlar.data.NativeObjectConverter for the tests
				this.origNativeObjectConverter = Kevlar.data.NativeObjectConverter;
				
				var args = this.args = {};
				Kevlar.data.NativeObjectConverter = {
					convert : function() {
						args[ 0 ] = arguments[ 0 ];
						args[ 1 ] = arguments[ 1 ];
					}
				};
			},
			
			tearDown : function() {
				// Restore the NativeObjectConverter after the tests
				Kevlar.data.NativeObjectConverter = this.origNativeObjectConverter;
			},
			
			
			// ---------------------------
			
			
			"getData() should delegate to the singleton NativeObjectConverter to create an Array representation of its data" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var collection = new Collection( [ { attr1: 'value1', attr2: 'value2' } ] );
				
				var optionsObj = { raw: true };
				var result = collection.getData( optionsObj );  // even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( collection, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the collection." );
				Y.Assert.areSame( optionsObj, this.args[ 1 ], "The second arg provided to NativeObjectConverter::convert() should have been the options object" );
			}
		},
		
		
		{
			/*
			 * Test getCount()
			 */
			name : "Test getCount()",
			
			"getCount() should return 0 for a brand new Collection" : function() {
				var collection = new Kevlar.Collection();
				
				Y.Assert.areSame( 0, collection.getCount() );
			},
			
			"getCount() should return the number of models inserted at any given time" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    model3 = new Model( { attr: 3 } ),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 2, collection.getCount(), "initially, the collection should have 2 models" );
				
				collection.remove( model1 );
				Y.Assert.areSame( 1, collection.getCount(), "After removal of model1, the collection should have 1 model" );
				
				collection.add( [ model1, model3 ] );
				Y.Assert.areSame( 3, collection.getCount(), "After adding model1 and model3, the collection should have 3 models" );
			}
		},
		
		
		{
			/*
			 * Test getByClientId()
			 */
			name : "Test getByClientId()",
			
			
			"getByClientId() should retrieve a model by its clientId" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model1 = new Model(),
				    model2 = new Model();
				
				var collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getByClientId( model1.getClientId() ), "model1 should have been able to be retrieved by its clientId" );
				Y.Assert.areSame( model2, collection.getByClientId( model2.getClientId() ), "model2 should have been able to be retrieved by its clientId" );
			},
			
			
			"getByClientId() should return null if the collection doesn't have the model whose clientId is requested" : function() {
				var Model = Kevlar.Model.extend( {} ),
				    model = new Model();
				
				var collection = new Kevlar.Collection();  // note: not adding model
				
				Y.Assert.isNull( collection.getByClientId( model.getClientId() ) );
			}
			
		},
		
		
		{
			/*
			 * Test getById
			 */
			name : "Test getById()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } );
			},
			
			
			"getById() should retrieve a model by its id attribute" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				
				var collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( model1, collection.getById( 1 ), "model1 should have been able to be retrieved by its id" );
				Y.Assert.areSame( model2, collection.getById( 2 ), "model2 should have been able to be retrieved by its id" );
			},
			
			
			"getById() should return null for a model id that doesn't exist within its collection" : function() {
				var model1 = new this.Model( { id: 1 } ),
				    model2 = new this.Model( { id: 2 } );
				
				var collection = new Kevlar.Collection();
				
				Y.Assert.isNull( collection.getById( 1 ), "Test with no models in the collection at all" );
				
				collection.add( model1 );
				Y.Assert.isNull( collection.getById( 2 ), "Test with a model in the collection" );
				
				Y.Assert.areSame( model1, collection.getById( 1 ), "Sanity check, model1 should be able to be retrieved by its id at this point" );
			},
			
			
			"getById() should retreive a model by its id attribute, even if it doesn't yet have an id when it is added to the collection (the id is added later)" : function() {
				var model = new this.Model(),  // no id yet
				    collection = new Kevlar.Collection( [ model ] );  // add the model
				
				// Now change the model's id
				model.set( 'id', 1 );
				
				Y.Assert.areSame( model, collection.getById( 1 ) );
			}
		},
		
		
		
		{
			/*
			 * Test has()
			 */
			name : "Test has()",
			
			"has() should return true if a model has been added to the collection, and false if a model has not been added to the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection();
				
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
		
		
		
		{
			/*
			 * Test indexOf()
			 */
			name : "Test indexOf()",
			
			
			"indexOf() should return the index of a model in the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 0, collection.indexOf( model1 ), "model1 should be at index 0" );
				Y.Assert.areSame( 1, collection.indexOf( model2 ), "model2 should be at index 1" );				
			},
			
			
			"indexOf() should return -1 for a model that does not exist within the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'attr' ] } ),
				    model1 = new Model(),
				    model2 = new Model(),
				    collection = new Kevlar.Collection( [ model1 ] );  // not adding model2
				
				Y.Assert.areSame( -1, collection.indexOf( model2 ), "model2 is not in the collection, so indexOf() should return -1" );
			}
		},
		
		
		
		{
			/*
			 * Test indexOfId()
			 */
			name : "Test indexOfId()",
			
			
			"indexOfId() should return the index of a model by its id in the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } ),
				    model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 2 } ),
				    collection = new Kevlar.Collection( [ model1, model2 ] );
				
				Y.Assert.areSame( 0, collection.indexOfId( 1 ), "model1 should be at index 0" );
				Y.Assert.areSame( 1, collection.indexOfId( 2 ), "model2 should be at index 1" );				
			},
			
			
			"indexOfId() should return -1 for a model by its id that does not exist within the collection" : function() {
				var Model = Kevlar.Model.extend( { attributes: [ 'id' ], idAttribute: 'id' } ),
				    model1 = new Model( { id: 1 } ),
				    model2 = new Model( { id: 2 } ),
				    collection = new Kevlar.Collection( [ model1 ] );  // not adding model2
				
				Y.Assert.areSame( -1, collection.indexOfId( 2 ), "model2 is not in the collection, so indexOfId() should return -1" );
			}
		},
		
		
		
		// -------------------------------
		
		
		{
			/*
			 * Test isModified
			 */
			name : "Test isModified()",
			
			setUp : function() {
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			
			"isModified() should return false if no Models within the collection have been modified" : function() {
				var model = JsMockito.mock( Kevlar.Model );
				JsMockito.when( model ).isModified().thenReturn( false );
				
				var collection = new this.Collection( [ model ] );
				
				Y.Assert.isFalse( collection.isModified() );
			},
			
			
			"isModified() should return true if a Model within the collection has been modified" : function() {
				var model1 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( model1 ).getClientId().thenReturn( 1 );     // (models must have a different clientID so they are considered unique)
				JsMockito.when( model1 ).isModified().thenReturn( false );
				
				var model2 = JsMockito.mock( Kevlar.Model );
				JsMockito.when( model2 ).getClientId().thenReturn( 2 );     // (models must have a different clientID so they are considered unique)
				JsMockito.when( model2 ).isModified().thenReturn( true );
				
				var collection = new this.Collection( [ model1, model2 ] );
				
				Y.Assert.isTrue( collection.isModified() );
			}
		},
		
		
		// -------------------------------
		
		
		
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
					model : this.Model
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
					model : this.Model
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