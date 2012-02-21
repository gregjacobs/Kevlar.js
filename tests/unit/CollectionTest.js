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
			}
		},
		
		
		
		{
			/*
			 * Test remove()
			 */
			name : "Test remove()"
			
		},
		
		
		
		{
			/*
			 * Test getFirst()
			 */
			name : "Test getFirst()"
			
		},
		
		
		
		{
			/*
			 * Test getLast()
			 */
			name : "Test getLast()"
			
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
					// Simulate no match with empty function that never returns `true`
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