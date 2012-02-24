/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with Nested Collections',
	
	
	items : [
		{
			/*
			 * Test setting nested Collections
			 */
			name : "Test setting nested Collections",
			
			
			"set() should only change the attribute that a nested Collection is being set to if it is a different Collection than it already has" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name: 'nestedCollection', type: 'collection' }
					]
				} );
				var NestedCollection = Kevlar.Collection.extend( {} );
				
				var model = new Model();
				var nestedCollection1 = new NestedCollection();
				var nestedCollection2 = new NestedCollection();
				
				
				// Add event handlers to determine when actual "sets" have been done
				var setCount = 0;
				model.addListener( 'change:nestedCollection', function() { setCount++; } );
				
				// Add random subscriptions to nestedCollection events, just to make sure this doesn't cause an issue.
				// (Using the old method of simply deep comparing the old object and the new object, which was unaware of 
				// nested Models, this would cause a "maximum call stack size exceeded" error on set())
				nestedCollection1.on( 'add', function(){} );
				nestedCollection2.on( 'remove', function(){} );
				
				
				// Set for the first time
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 1, setCount, "The collection should have been set for the first time" );
				
				// Now set the collection the second time. Should *not* fire a change event
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 1, setCount, "The collection should not have been re-set, because it is the same collection that is already there" );
				
				
				// Set the second nestedCollection now
				model.set( 'nestedCollection', nestedCollection2 );
				Y.Assert.areSame( 2, setCount, "The new collection (nestedCollection2) should have been set" );
				
				// Now set the second model the second time. Should *not* fire a change event
				model.set( 'nestedCollection', nestedCollection2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should not have been re-set, because it is the same model that is already there" );
				
				
				// Set to null, to make sure we accept collections again afterwards
				model.set( 'nestedCollection', null );
				Y.Assert.areSame( 3, setCount, "The attribute should have been set to null" );
				
				// Now set to a collection again
				model.set( 'nestedCollection', nestedCollection1 );
				Y.Assert.areSame( 4, setCount, "The attribute should have been set to nestedCollection1 after it had been null" );
			}
		},
		
		
		
		{
			/*
			 * Test the 'change' event for embedded collections
			 */
			name : "Test the 'change' event for embedded collections"/*,
			
			
			
			"When an attribute has changed in an embedded model, its parent model should fire the appropriate 'change' events" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				
				// Subscribe to the general 'change' event
				var parentGeneralChangeEventCount = 0,
				    parentGeneralChangedModel,
				    parentGeneralChangedAttribute,
				    parentGeneralChangedValue;
				    
				parentModel.on( 'change', function( model, attributeName, value ) {
					parentGeneralChangeEventCount++;
					parentGeneralChangedModel = model;
					parentGeneralChangedAttribute = attributeName;
					parentGeneralChangedValue = value;
				} );
				
				
				// We should also be able to subscribe to the general (but child model-specific) 'change' event for the embedded model itself
				var generalModelSpecificChangeEventCount = 0,
				    generalModelSpecificChangedModel,
				    generalModelSpecificChangedAttribute,
				    generalModelSpecificChangedValue;
				    
				parentModel.on( 'change:child', function( model, attributeName, value ) {
					generalModelSpecificChangeEventCount++;
					generalModelSpecificChangedModel = model;
					generalModelSpecificChangedAttribute = attributeName;
					generalModelSpecificChangedValue = value;
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChangedModel,
				    attrSpecificChangedValue;
				    
				parentModel.on( 'change:child.attr', function( model, value ) {
					attrSpecificChangeEventCount++;
					attrSpecificChangedModel = model;
					attrSpecificChangedValue = value;
				} );
				
				
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.areSame( 1, parentGeneralChangeEventCount, "The parent's general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, parentGeneralChangedModel, "The parent's general change event should have fired with the parent model" );
				Y.Assert.areSame( 'child.attr', parentGeneralChangedAttribute, "The parent's general change event should have fired with attributeName as the path to the nested model" );
				Y.Assert.areSame( 'asdf', parentGeneralChangedValue, "The parent's general change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, generalModelSpecificChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, generalModelSpecificChangedModel, "The childModel-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'attr', generalModelSpecificChangedAttribute, "The childModel-specific change event should have fired with attributeName of the changed attribute" );
				Y.Assert.areSame( 'asdf', generalModelSpecificChangedValue, "The childModel-specific change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChangedModel, "The attribute-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', attrSpecificChangedValue, "The attribute-specific change event should have fired with the new value" );
			},
			
			
			"When an attribute has changed in a non-embedded model, its parent model should *not* fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: false }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				var changeEventFired = false;    
				parentModel.on( 'change', function() {
					changeEventFired = true;
				} );
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.isFalse( changeEventFired );
			},
			
			
			"The parent model should no longer fire events from the child model after the child model has been un-set from the parent" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				var attrChangeEventCount = 0;
				parentModel.on( 'change', function( model, attrName, newValue ) {
					if( attrName === 'child.attr' ) {
						attrChangeEventCount++;
					}
				} );
				
				
				// Set a value in the child model. We should get a change event.
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.areSame( 1, attrChangeEventCount, "while the child model is attached, the change event count should have increased by 1" );
				
				
				// Now, unset the child model, and then set another attribute in it. We should not get another change event.
				parentModel.set( 'child', null );
				childModel.set( 'attr', 'asdf2' );
				
				Y.Assert.areSame( 1, attrChangeEventCount, "We should still only have 1 for the event firing count, as we un-set the child model from the parent" );
			},
			
			
			// ------------------------------
			
			// Test multiple levels of embedded models
			
			
			"When an attribute has changed in a deeply nested embedded model, its parent model should fire a 'change' event, with the parentAttr.childAttr.childAttr attributeName" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Parent' }, // for debugging
						{ name: 'intermediate', type: 'model', embedded: true }
					]
				} );
				
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Intermediate' }, // for debugging
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'name', defaultValue: 'Child' }, // for debugging
						{ name : 'attr', type: 'string' }
					]
				} );
				
				
				// Create the models 
				var parentModel = new ParentModel(),
				    intermediateModel = new IntermediateModel(),
				    childModel = new ChildModel();
				    
				parentModel.set( 'intermediate', intermediateModel );
				intermediateModel.set( 'child', childModel );
				
				
				// Subscribe to the general 'change' event
				var generalChangeEventCount = 0,
				    generalChangedModel,
				    generalChangedAttribute,
				    generalChangedValue;
				    
				parentModel.on( 'change', function( model, attributeName, value ) {
					generalChangeEventCount++;
					generalChangedModel = model;
					generalChangedAttribute = attributeName;
					generalChangedValue = value;
				} );
				
				
				// We should also be able to subscribe to the general (but intermediate model-specific) 'change' event for the embedded model itself
				var intermediateModelChangeEventCount = 0,
				    intermediateModelChangedModel,
				    intermediateModelChangedAttribute,
				    intermediateModelChangedValue;
				
				parentModel.on( 'change:intermediate', function( model, attributeName, value ) {
					intermediateModelChangeEventCount++;
					intermediateModelChangedModel = model;
					intermediateModelChangedAttribute = attributeName;
					intermediateModelChangedValue = value;
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event
				var childModelChangeEventCount = 0,
				    childModelChangedModel,
				    childModelChangedAttribute,
				    childModelChangedValue;
				
				parentModel.on( 'change:intermediate.child', function( model, attributeName, value ) {
					childModelChangeEventCount++;
					childModelChangedModel = model;
					childModelChangedAttribute = attributeName;
					childModelChangedValue = value;
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChangedModel,
				    attrSpecificChangedValue;
				    
				parentModel.on( 'change:intermediate.child.attr', function( model, value ) {
					attrSpecificChangeEventCount++;
					attrSpecificChangedModel = model;
					attrSpecificChangedValue = value;
				} );
				
				
				
				// Now set the value of the attribute in the child model
				window.a = true;
				childModel.set( 'attr', 'asdf' );
				window.a = false;
				
				Y.Assert.areSame( 1, generalChangeEventCount, "The general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalChangedModel, "The general change event should have fired with the parent model" );
				Y.Assert.areSame( 'intermediate.child.attr', generalChangedAttribute, "The general change event should have fired with the attributeName as the path to the child model's attribute" );
				Y.Assert.areSame( 'asdf', generalChangedValue, "The general change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, intermediateModelChangeEventCount, "The intermediateModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, intermediateModelChangedModel, "The intermediateModel-specific change event should have fired with the intermediate model" );
				Y.Assert.areSame( 'child.attr', intermediateModelChangedAttribute, "The intermediateModel-specific change event should have fired with path to the changed attribute in the deeper child model" );
				Y.Assert.areSame( 'asdf', intermediateModelChangedValue, "The intermediateModel-specific change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, childModelChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, childModelChangedModel, "The childModel-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'attr', childModelChangedAttribute, "The childModel-specific change event should have fired with the attributeName that was changed" );
				Y.Assert.areSame( 'asdf', childModelChangedValue, "The childModel-specific change event should have fired with the new value" );
				
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The childModel attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChangedModel, "The childModel attribute-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', attrSpecificChangedValue, "The childModel attribute-specific change event should have fired with the new value" );
			}*/
		}
	]
	
} ) );