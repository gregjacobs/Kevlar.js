/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Collection with Models',
	
	
	items : [
		
		{
			/*
			 * Test Model Events
			 */
			name : "Test Model Events",
			
			
			"changing an attribute in a model should fire a general 'change' event in the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 'model1Value1' } ),
				    model2 = new Model( { attr: 'model2Value1' } ),
				    collection = new Collection( [ model1, model2 ] );
				
				var changeEventCallCount = 0,
				    changeEventCollection,
				    changeEventModel,
				    changeEventAttributeName,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change', function( collection, model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventCollection = collection;
					changeEventModel = model;
					changeEventAttributeName = attributeName;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model1 should have been fired with the collection that changed" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', changeEventAttributeName, "The event for model1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model2 should have been fired with the collection that changed" );
				Y.Assert.areSame( model2, changeEventModel, "The event for model2 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', changeEventAttributeName, "The event for model2 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'model2Value2', changeEventNewValue, "The event for model2 should have been fired with the new value" );
				Y.Assert.areSame( 'model2Value1', changeEventOldValue, "The event for model2 should have been fired with the old value" );
			},
			
			
			"changing an attribute in a model should fire an attribute-specific 'change' event in the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 'model1Value1' } ),
				    model2 = new Model( { attr: 'model2Value1' } ),
				    collection = new Collection( [ model1, model2 ] );
				
				var changeEventCallCount = 0,
				    changeEventCollection,
				    changeEventModel,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change:attr', function( collection, model, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventCollection = collection;
					changeEventModel = model;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model1 should have been fired with the collection that changed" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
				Y.Assert.areSame( collection, changeEventCollection, "The event for model2 should have been fired with the collection that changed" );
				Y.Assert.areSame( model2, changeEventModel, "The event for model2 should have been fired with the model that changed" );
				Y.Assert.areSame( 'model2Value2', changeEventNewValue, "The event for model2 should have been fired with the new value" );
				Y.Assert.areSame( 'model2Value1', changeEventOldValue, "The event for model2 should have been fired with the old value" );
			},
			
			
			"Any event that the Model fires should be relayed by the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					initialize : function() {
						this.addEvents( 'testevent' );
					}, 
					
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Collection( [ model1, model2 ] );
				
				var testEventCallCount = 0,
				    testEventCollection,
				    testEventModel,
				    testEventArg1,
				    testEventArg2,
				    testEventArg3;
				
				collection.on( 'testevent', function( collection, model, arg1, arg2, arg3 ) {
					testEventCallCount++;
					testEventCollection = collection;
					testEventModel = model;
					testEventArg1 = arg1;
					testEventArg2 = arg2;
					testEventArg3 = arg3;
				} );
				
				model1.fireEvent( 'testevent', model1, 1, 2, 3 );
				Y.Assert.areSame( 1, testEventCallCount, "The testevent should have been called exactly once" );
				Y.Assert.areSame( collection, testEventCollection, "The testevent should have been called with the collection (as it was provided)" );
				Y.Assert.areSame( model1, testEventModel, "The testevent should have been called with the model (as it was provided)" );
				Y.Assert.areSame( 1, testEventArg1, "arg1 should have been provided" );
				Y.Assert.areSame( 2, testEventArg2, "arg2 should have been provided" );
				Y.Assert.areSame( 3, testEventArg3, "arg3 should have been provided" );
			},
			
			
			"After a model has been removed from the Collection, the collection should no longer relay its events" : function() {
				var Model = Kevlar.Model.extend( {
					initialize : function() {
						this.addEvents( 'testevent' );
					}, 
					
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model(),
				    model2 = new Model(),
				    collection = new Collection( [ model1, model2 ] );
				
				var testEventCallCount = 0;
				
				collection.on( 'testevent', function() {
					testEventCallCount++;
				} );
				
				// Remove the model before firing the event
				collection.remove( model1 );
				
				model1.fireEvent( 'testevent' );
				Y.Assert.areSame( 0, testEventCallCount, "The testevent should *not* have been fired from the collection, as the child model was removed" );
			}
		},
		
		
		{
			/*
			 * Test isModified()
			 */
			name : "Test isModified()",
			
			setUp : function() {
				this.Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				this.Collection = Kevlar.Collection.extend( {
					model : this.Model
				} );
			},
			
			"isModified() should return false if no Models within the collection have been modified" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
								
				Y.Assert.isFalse( collection.isModified() );
			},
			
			"isModified() should return true if a Model within the collection has been modified" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				model1.set( 'attr', 42 );
				
				Y.Assert.isTrue( collection.isModified() );
			},
			
			"isModified() should return false if a Model within the collection has been modified, but then rolled back or committed" : function() {
				var model1 = new this.Model( { attr: 1 } ),
				    model2 = new this.Model( { attr: 2 } ),
				    collection = new this.Collection( [ model1, model2 ] );
				
				model1.set( 'attr', 42 );
				Y.Assert.isTrue( collection.isModified(), "Just double checking that the collection is considered modified, before rolling back" );
				model1.rollback();
				Y.Assert.isFalse( collection.isModified(), "Should be false after rollback" );
				
				
				model1.set( 'attr', 42 );
				Y.Assert.isTrue( collection.isModified(), "Just double checking that the collection is considered modified again, before committing" );
				model1.commit();
				Y.Assert.isFalse( collection.isModified(), "Should be false after commit" );
			}
		},
		
		
		{
			/*
			 * Test destroying a model. It should be removed from the collection.
			 */
			name : "Test destroying a model. It should be removed from the collection.",
			
			"When a model is destroyed, it should be removed from the collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : Model
				} );
				
				var model1 = new Model( { attr: 1 } ),
				    model2 = new Model( { attr: 2 } ),
				    collection = new Collection( [ model1, model2 ] );
				
				Y.Assert.isTrue( collection.has( model1 ), "Initial condition: the collection should have model1" );
				
				model1.destroy();
				Y.Assert.isFalse( collection.has( model1 ), "model1 should have been removed from the collection upon destruction" );
			}
		}
	]

} ) );