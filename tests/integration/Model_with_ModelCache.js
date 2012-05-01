/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ModelCache',
	
	
	items : [		
		{
			/*
			 * Duplicate models should not be able to be instantiated
			 */
			name : "Duplicate models should not be able to be instantiated",
			
			
			// Tests making sure different types / ids do NOT return the same model instance	
			"Instatiating two models of different types, but the same instance ID, should *not* be 'combined' into the same instance" : function() {
				var ModelClass1 = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				var ModelClass2 = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new ModelClass1( { id: 1 } );  // same id, but
				var model2 = new ModelClass2( { id: 1 } );  // different classes
				
				Y.Assert.areNotSame( model1, model2 );
			},
			
			
			"Instatiating two models of the same type, but the different instance IDs, should *not* be 'combined' into the same instance" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1 } );  // different id, but
				var model2 = new Model( { id: 2 } );  // same class
				
				Y.Assert.areNotSame( model1, model2 );
			},
			
			
			// Tests making sure that the same type/id returns the same model instance, and combines the data
			
			"Instantiating two models of both the same type, and which have the same instance ID, should really become the same single instance (i.e. not duplicating it). The same reference should be returned when constructing the duplicate model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1 } );
				var model2 = new Model( { id: 1 } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
			},


			"Instantiating one model and setting the ID later, then instantiating another with the same ID, the two models should point to the same instance" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model();
				model1.set( 'id', 1 );

				var model2 = new Model( { id: 1 } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
			},
			
			
			"Instantiating two models with the same ID should combine the initial data, with still, only one actual instance should be created" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'id', 'firstName', 'lastName' ],
					idAttribute : 'id'
				} );
				
				var model1 = new Model( { id: 1, firstName: "Joe" } );
				var model2 = new Model( { id: 1, lastName: "Shmo" } );
				
				// Make sure that only one model was created for id 1
				Y.Assert.areSame( model1, model2, "model1 and model2 should point to the same object" );
				
				// Make sure that the data was combined onto the same model instance
				Y.Assert.areSame( "Joe", model1.get( 'firstName' ) );
				Y.Assert.areSame( "Shmo", model1.get( 'lastName' ) ); 
			}
		}
	]
		

} ) );