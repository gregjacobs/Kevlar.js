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
				    changeEventModel,
				    changeEventAttributeName,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventModel = model;
					changeEventAttributeName = attributeName;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', changeEventAttributeName, "The event for model1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
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
				    changeEventModel,
				    changeEventNewValue,
				    changeEventOldValue;
				    
				collection.on( 'change:attr', function( model, newValue, oldValue ) {
					changeEventCallCount++;
					changeEventModel = model;
					changeEventNewValue = newValue;
					changeEventOldValue = oldValue;
				} );
				
				model1.set( 'attr', 'model1Value2' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( model1, changeEventModel, "The event for model1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'model1Value2', changeEventNewValue, "The event for model1 should have been fired with the new value" );
				Y.Assert.areSame( 'model1Value1', changeEventOldValue, "The event for model1 should have been fired with the old value" );
				
				model2.set( 'attr', 'model2Value2' );
				Y.Assert.areSame( 2, changeEventCallCount, "The call count should now be exactly 2" );
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
				    testEventModel,
				    testEventArg1,
				    testEventArg2,
				    testEventArg3;
				
				collection.on( 'testevent', function( model, arg1, arg2, arg3 ) {
					testEventCallCount++;
					testEventModel = model;
					testEventArg1 = arg1;
					testEventArg2 = arg2;
					testEventArg3 = arg3;
				} );
				
				model1.fireEvent( 'testevent', model1, 1, 2, 3 );
				Y.Assert.areSame( 1, testEventCallCount, "The testevent should have been called exactly once" );
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
		}
		
	]

} ) );