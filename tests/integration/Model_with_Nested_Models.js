/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with Nested Models',
	
	
	items : [
		{
			/*
			 * Test setting nested Models
			 */
			name : "Test setting nested Models",
			
			
			"set() should only change the attribute that a nested Model is being set to if it is a different model than it already has" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name: 'nestedModel', type: 'model' }
					]
				} );
				var NestedModel = Kevlar.Model.extend( {
					attributes : [ 'attr1', 'attr2' ]
				} );
				
				var model = new Model();
				var nestedModel1 = new NestedModel();
				var nestedModel2 = new NestedModel();
				
				
				// Add event handlers to determine when actual "sets" have been done
				var setCount = 0;
				model.addListener( 'change:nestedModel', function() { setCount++; } );
				
				// Add random subscriptions to nestedModel events, just to make sure this doesn't cause an issue.
				// (Using the old method of simply deep comparing the old object and the new object, which was unaware of 
				// nested Models, this would cause a "maximum call stack size exceeded" error on set())
				nestedModel1.on( 'change:attr1', function(){} );
				nestedModel2.on( 'change:attr1', function(){} );
				
				
				// Set for the first time
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 1, setCount, "The model should have been set for the first time" );
				
				// Now set the model the second time. Should *not* fire a change event
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 1, setCount, "The model should not have been re-set, because it is the same model that is already there" );
				
				
				// Set the second nestedModel now
				model.set( 'nestedModel', nestedModel2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should have been set" );
				
				// Now set the second model the second time. Should *not* fire a change event
				model.set( 'nestedModel', nestedModel2 );
				Y.Assert.areSame( 2, setCount, "The new model (nestedModel2) should not have been re-set, because it is the same model that is already there" );
				
				
				// Set to null, to make sure we accept models again afterwards
				model.set( 'nestedModel', null );
				Y.Assert.areSame( 3, setCount, "The attribute should have been set to null" );
				
				// Now set to a model again
				model.set( 'nestedModel', nestedModel1 );
				Y.Assert.areSame( 4, setCount, "The attribute should have been set to nestedModel1 after it had been null" );
			}
		},
		
		
		
		{
			/*
			 * Test the 'change' event for nested models
			 */
			name : "Test the 'change' event for nested models",
			
			
			
			"When an attribute has changed in a nested model, its parent model should fire the appropriate 'change' events" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model' }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				
				// A class to store the results
				var ChangeEventResults = function( model, attributeName, newValue, oldValue ) {
					this.model = model;
					this.attributeName = attributeName;
					this.newValue = newValue;
					this.oldValue = oldValue;
				};
				
				
				// Subscribe to the general 'change' event
				var parentGeneralChangeEventCount = 0,
				    parentGeneralChange;
				    
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					parentGeneralChangeEventCount++;
					parentGeneralChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but child model-specific) 'change' event for the embedded model itself
				var generalModelSpecificChangeEventCount = 0,
				    generalModelSpecificChange;
				    
				parentModel.on( 'change:child', function( model, newValue, oldValue ) {
					generalModelSpecificChangeEventCount++;
					generalModelSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but child model-specific) 'change' event for attributes on the embedded model itself
				var generalModelSpecificAttrChangeEventCount = 0,
				    generalModelSpecificAttrChange;
				    
				parentModel.on( 'change:child.*', function( model, attributeName, newValue, oldValue ) {
					generalModelSpecificAttrChangeEventCount++;
					generalModelSpecificAttrChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChange;
				    
				parentModel.on( 'change:child.attr', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCount++;
					attrSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				// 'change'
				Y.Assert.areSame( 1, parentGeneralChangeEventCount, "The parent's general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, parentGeneralChange.model, "The parent's general change event should have fired with the parent model" );
				Y.Assert.areSame( 'child', parentGeneralChange.attributeName, "The parent's general change event should have fired with attributeName for the childModel" );
				Y.Assert.areSame( childModel, parentGeneralChange.newValue, "The parent's general change event should have fired with the new value" );
				Y.Assert.areSame( childModel, parentGeneralChange.oldValue, "The parent's general change event should have fired with the old value" );
				
				// 'change:child'
				Y.Assert.areSame( 1, generalModelSpecificChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalModelSpecificChange.model, "The childModel-specific change event should have fired with the parent model" );
				Y.Assert.areSame( childModel, generalModelSpecificChange.newValue, "The childModel-specific change event should have fired with the new value" );
				Y.Assert.areSame( childModel, generalModelSpecificChange.oldValue, "The childModel-specific change event should have fired with the old value" );
				
				// 'change:child.*'
				Y.Assert.areSame( 1, generalModelSpecificAttrChangeEventCount, "The childModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( childModel, generalModelSpecificAttrChange.model, "The childModel-specific attribute change event should have fired with the child model" );
				Y.Assert.areSame( 'attr', generalModelSpecificAttrChange.attributeName, "The childModel-specific attribute change event should have fired with attributeName of the changed attribute" );
				Y.Assert.areSame( 'asdf', generalModelSpecificAttrChange.newValue, "The childModel-specific attribute change event should have fired with the new value" );
				Y.Assert.isUndefined( generalModelSpecificAttrChange.oldValue, "The childModel-specific attribute change event should have fired with the old value" );
				
				// 'change:child.attr'
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChange.model, "The attribute-specific change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', attrSpecificChange.newValue, "The attribute-specific change event should have fired with the new value" );
				Y.Assert.isUndefined( attrSpecificChange.oldValue, "The attribute-specific change event should have fired with the old value" );
			},
			
			
			"The parent model should no longer fire events from the child model after the child model has been un-set from the parent" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr' }
					]
				} );
				
				var childModel = new ChildModel();
				var parentModel = new ParentModel( {
					child: childModel
				} );
				
				var attrChangeEventCount = 0;
				parentModel.on( 'change', function( model, attrName, newValue ) {
					attrChangeEventCount++;
				} );
				
				
				// Set a value in the child model. We should get a change event.
				childModel.set( 'attr', 'asdf' );
				
				Y.Assert.areSame( 1, attrChangeEventCount, "while the child model is attached, the change event count should have increased by 1" );
				
				
				// Now, unset the child model, and then set another attribute in it. We should not get another change event.
				parentModel.set( 'child', null );
				childModel.set( 'attr', 'asdf2' );
				
				Y.Assert.areSame( 2, attrChangeEventCount, "We should only have 2 for the event firing count, as we un-set the child model from the parent (which is the +1), but then events on the childModel beyond that should not be counted" );
			},
			
			
			// ------------------------------
			
			// Test multiple levels of nested models
			
			
			"When an attribute has changed in a deeply nested model, its parent model should fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'intermediate', type: 'model' }
					],
					
					toString : function() { return "(ParentModel)"; }  // for debugging
				} );
				
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model' }
					],
					
					toString : function() { return "(IntermediateModel)"; }  // for debugging
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr' }
					],
					
					toString : function() { return "(ChildModel)"; }  // for debugging
				} );
				
				
				// Create the models 
				var parentModel = new ParentModel(),
				    intermediateModel = new IntermediateModel(),
				    childModel = new ChildModel();
				    
				parentModel.set( 'intermediate', intermediateModel );
				intermediateModel.set( 'child', childModel );
				
				
				
				// A class to store the results
				var ChangeEventResults = function( model, attributeName, newValue, oldValue ) {
					this.model = model;
					this.attributeName = attributeName;
					this.newValue = newValue;
					this.oldValue = oldValue;
				};
				
				
				// Subscribe to the general 'change' event
				var generalChangeEventCount = 0,
				    generalChange;
				    
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					generalChangeEventCount++;
					generalChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should also be able to subscribe to the general (but intermediate model-specific) 'change' event for the embedded model itself
				var intermediateModelChangeEventCount = 0,
				    intermediateModelChange;
				
				parentModel.on( 'change:intermediate', function( model, newValue, oldValue ) {
					intermediateModelChangeEventCount++;
					intermediateModelChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the attribute changes of the intermediate model
				var intermediateModelAttrChangeEventCount = 0,
				    intermediateModelAttrChange;
				
				parentModel.on( 'change:intermediate.*', function( model, attributeName, newValue, oldValue ) {
					intermediateModelAttrChangeEventCount++;
					intermediateModelAttrChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event
				var childModelChangeEventCount = 0,
				    childModelChange;
				
				parentModel.on( 'change:intermediate.child', function( model, newValue, oldValue ) {
					childModelChangeEventCount++;
					childModelChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// We should be able to subscribe to the deeply nested (but childModel-specific) 'change' event for attributes
				var childModelChangeAttrEventCount = 0,
				    childModelChangeAttr;
				
				parentModel.on( 'change:intermediate.child.*', function( model, attributeName, newValue, oldValue ) {
					childModelChangeAttrEventCount++;
					childModelChangeAttr = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// And finally, we should be able to subscribe to the attribute-specific 'change' event from the deeply embedded model itself
				var attrSpecificChangeEventCount = 0,
				    attrSpecificChange;
				    
				parentModel.on( 'change:intermediate.child.attr', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCount++;
					attrSpecificChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// Now set the value of the attribute in the child model
				childModel.set( 'attr', 'asdf' );
				
				// 'change'
				Y.Assert.areSame( 1, generalChangeEventCount, "The general change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, generalChange.model, "The general change event should have fired with the parent model" );
				Y.Assert.areSame( 'intermediate', generalChange.attributeName, "The general change event should have fired with the attributeName as the intermediate model" );
				Y.Assert.areSame( intermediateModel, generalChange.newValue, "The general change event should have fired with the intermediate model as the new value" );
				Y.Assert.areSame( intermediateModel, generalChange.oldValue, "The general change event should have fired with the intermediate model as the old value" );
				
				// 'change:intermediate'
				Y.Assert.areSame( 1, intermediateModelChangeEventCount, "The intermediateModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( parentModel, intermediateModelChange.model, "The intermediateModel-specific change event should have fired with the parent model" );
				Y.Assert.areSame( intermediateModel, intermediateModelChange.newValue, "The intermediateModel-specific change event should have fired with the intermediate model as the new value" );
				Y.Assert.areSame( intermediateModel, intermediateModelChange.oldValue, "The intermediateModel-specific change event should have fired with the intermediate model as the old value" );
				
				// 'change:intermediate.*'
				Y.Assert.areSame( 1, intermediateModelAttrChangeEventCount, "The intermediateModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, intermediateModelAttrChange.model, "The intermediateModel-specific attribute change event should have fired with the intermediateModel" );
				Y.Assert.areSame( 'child', intermediateModelAttrChange.attributeName, "The intermediateModel-specific attribute change event should have fired with the child model attribute name" );
				Y.Assert.areSame( childModel, intermediateModelAttrChange.newValue, "The intermediateModel-specific attribute change event should have fired with the childModel as the new value" );
				Y.Assert.areSame( childModel, intermediateModelAttrChange.oldValue, "The intermediateModel-specific attribute change event should have fired with the childModel as the old value" );
				
				// 'change:intermediate.child'
				Y.Assert.areSame( 1, childModelChangeEventCount, "The childModel-specific change event should have fired exactly once" );
				Y.Assert.areSame( intermediateModel, childModelChange.model, "The childModel-specific change event should have fired with the intermediateModel" );
				Y.Assert.areSame( childModel, childModelChange.newValue, "The childModel-specific change event should have fired with the child model as the new value" );
				Y.Assert.areSame( childModel, childModelChange.oldValue, "The childModel-specific change event should have fired with the child model as the old value" );
				
				// 'change:intermediate.child.*'
				Y.Assert.areSame( 1, childModelChangeAttrEventCount, "The childModel-specific attribute change event should have fired exactly once" );
				Y.Assert.areSame( childModel, childModelChangeAttr.model, "The childModel-specific attribute change event should have fired with the childModel" );
				Y.Assert.areSame( 'attr', childModelChangeAttr.attributeName, "The childModel-specific attribute change event should have fired with the child model" );
				Y.Assert.areSame( 'asdf', childModelChangeAttr.newValue, "The childModel-specific attribute change event should have fired with the new value" );
				Y.Assert.isUndefined( childModelChangeAttr.oldValue, "The childModel-specific attribute change event should have fired with the old value" );
				
				// 'change:intermediate.child.attr'
				Y.Assert.areSame( 1, attrSpecificChangeEventCount, "The childModel attribute-specific change event should have fired exactly once" );
				Y.Assert.areSame( childModel, attrSpecificChange.model, "The childModel attribute-specific change event should have fired with the childModel" );
				Y.Assert.areSame( 'asdf', attrSpecificChange.newValue, "The childModel attribute-specific change event should have fired with the new value" );
				Y.Assert.isUndefined( attrSpecificChange.oldValue, "The childModel attribute-specific change event should have fired with the old value" );
			}
		},
		
		
		{
			/*
			 * Test that the parent model "has changes" (is modified) when an embedded model is changed 
			 */
			name : "Test that the parent model \"has changes\" (is modified) when an embedded model is changed",
			
			setUp : function() {
				this.ParentWithEmbeddedChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ParentWithNonEmbeddedChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: false }  // Note: *not* embedded 
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' },
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"The parent model should have changes when a child embedded model has changes" : function() {
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isTrue( childModel.isModified(), "As a base test, the child model should be considered 'modified'" );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while its child model is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'child' ), "The 'child' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child model has changes, but is not 'embedded'" : function() {
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentWithNonEmbeddedChildModel( {
					child: childModel
				} );
				
				childModel.set( 'attr', 'newValue' );
				Y.Assert.isFalse( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child model is 'modified', because the child is not 'embedded'" );
			},
			
			
			// ---------------------------
			
			// Test with 'persistedOnly' option to isModified()
			
			
			"Using the persistedOnly option, the parent model should be considered modified if an embedded child model has a persisted attribute change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'persistedAttr', 'newValue' );
				
				Y.Assert.isTrue( parentModel.isModified( { persistedOnly: true } ), "The parent model should be considered modified because its child model has a change on a persisted attribute" );
			},
			
			
			"Using the persistedOnly option, the parent model should *not* be considered modified if an embedded child model only has unpersisted attribute changes" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				Y.Assert.isFalse( parentModel.isModified( { persistedOnly: true } ), "The parent model should *not* be considered modified because its child model only has a change on an unpersisted attribute" );
			},
			
			
			// Test with specific attributes
			
			"Using the persistedOnly option and providing a specific attribute, the parent model should be considered modified if an embedded child model has a persisted attribute change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'persistedAttr', 'newValue' );
				
				Y.Assert.isTrue( parentModel.isModified( 'child', { persistedOnly: true } ), "The parent model should be considered modified because its child model has a change on a persisted attribute" );
			},
			
			
			"Using the persistedOnly option and providing a specific attribute, the parent model should *not* be considered modified if an embedded child model only has unpersisted attribute changes" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persisted',
					unpersistedAttr: 'unpersisted'
				} );
				var parentModel = new this.ParentWithEmbeddedChildModel( {
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				Y.Assert.isFalse( parentModel.isModified( 'child', { persistedOnly: true } ), "The parent model should *not* be considered modified because its child model only has a change on an unpersisted attribute" );
			}
		},
		
		
		{
			/*
			 * Test getting changes from a parent model when an embedded model is changed 
			 */
			name : "Test getting changes from a parent model when an embedded model is changed",
			
			setUp : function() {
				this.ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"A child model with changes should be retrieved (with all of its data, because it is embedded) when any of its attributes has a change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'persistedAttr', 'newPersistedValue' );
				
				var changes = parentModel.getChanges();
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "There should be 1 property in the 'changes' object" );
				Y.ObjectAssert.hasKeys( [ 'child' ], changes, "'child' should be the property in the 'changes' object" );
				
				Y.Assert.areSame( 2, Kevlar.util.Object.length( changes.child ), "There should be 2 properties in the 'child' changes object" );
				Y.Assert.areSame( 'newPersistedValue', changes.child.persistedAttr, "persistedAttr should exist in the 'child' changes, with the new value" );
				Y.Assert.areSame( 'unpersistedValue', changes.child.unpersistedAttr, "unpersistedAttr should exist in the 'child' changes, with its original value" );
			},
			
			
			// -------------------------
			
			// Test with the 'persistedOnly' option
			
			
			"With the 'persistedOnly' option, a child model with changes should only be retrieved (with all of its persisted data, because it is embedded) when any of its *persisted* attributes has a change" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'persistedAttr', 'newPersistedValue' );
				
				var changes = parentModel.getChanges( { persistedOnly: true } );
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "There should be 1 property in the 'changes' object" );
				Y.ObjectAssert.hasKeys( [ 'child' ], changes, "'child' should be the property in the 'changes' object" );
				
				Y.Assert.areSame( 1, Kevlar.util.Object.length( changes.child ), "There should be only 1 property (for the persisted one) in the 'child' changes object" );
				Y.Assert.areSame( 'newPersistedValue', changes.child.persistedAttr, "persistedAttr should exist in the 'child' changes, with the new value" );
			},
			
			
			"With the 'persistedOnly' option, a child model that only has changes to non-persisted attributes should *not* be retrieved with getChanges()" : function() {
				var childModel = new this.ChildModel( {
					persistedAttr: 'persistedValue',
					unpersistedAttr: 'unpersistedValue' 
				} );
				var parentModel = new this.ParentModel( {
					child: childModel
				} );
				
				Y.Assert.areSame( 0, Kevlar.util.Object.length( parentModel.getChanges() ), "Initial condition: there should be no changes" );
				
				childModel.set( 'unpersistedAttr', 'newUnpersistedValue' );
				
				var changes = parentModel.getChanges( { persistedOnly: true } );
				Y.Assert.areSame( 0, Kevlar.util.Object.length( changes ), "There should be no properties in the 'changes' object" );
			}
		}
		
	]
	
} ) );