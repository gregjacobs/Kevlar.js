/*global window, Ext, Y, JsMockito, tests, Class, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with Nested Collections',
	
	
	items : [
		{
			/*
			 * Test default nested Collection initialization
			 */
			name : "Test default nested Collection initialization",
			
			// Special instructions
			_should : {
				ignore: {
					"A nested Collection attribute should default to be an empty collection" : true
				}
			},
			
			"A nested Collection attribute should default to be an empty collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						{ name: 'nestedCollection', type: 'collection' }  // note: no specific defaultValue
					]
				} );
				var model = new Model();
				
				Y.Assert.isInstanceOf( Kevlar.Collection, model.get( 'nestedCollection' ), "The 'nestedCollection' should have been an instance of Kevlar.Collection" );
				Y.Assert.areSame( 0, model.get( 'nestedCollection' ).getCount(), "The 'nestedCollection' should be empty" );
			} 
		},
		
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
			 * Test the 'change' event for nested collections
			 */
			name : "Test the 'change' event for nested collections",
			
			
			
			"When an attribute has changed in a model of a nested collection, its parent collection should fire the appropriate 'change' events" : function() {
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ],
					toString : function() { return "(ChildModel)"; }
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel,
					toString : function() { return "(Collection)"; }
				} );
				
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'myCollection', type: 'Collection' } ],
					toString : function() { return "(ParentModel)"; }
				} );
				
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { myCollection: collection } );
				
				
				// A class to store the results
				var ChangeEventResults = Class( {
					constructor : function( model, attributeName, newValue, oldValue ) {
						this.model = model;
						this.attributeName = attributeName;
						this.newValue = newValue;
						this.oldValue = oldValue;
					}
				} );
				
				var CollectionChangeEventResults = ChangeEventResults.extend( {
					constructor : function( collection, model, attributeName, newValue, oldValue ) {
						this.collection = collection;
						this._super( [ model, attributeName, newValue, oldValue ] );
					}
				} );
				
				
				// 'change'
				var changeEventCallCount = 0,
				    changeEvent;
				
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
					changeEvent = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:myCollection'
				var attrSpecificChangeEventCallCount = 0,
				    attrSpecificChangeEvent;
				
				parentModel.on( 'change:myCollection', function( model, newValue, oldValue ) {
					attrSpecificChangeEventCallCount++;
					attrSpecificChangeEvent = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:myCollection.*'
				var attrSpecificChangeAttrEventCallCount = 0,
				    attrSpecificChangeAttrEvent;
				
				parentModel.on( 'change:myCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					attrSpecificChangeAttrEventCallCount++;
					attrSpecificChangeAttrEvent = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				childModel1.set( 'attr', 'newValue1' );
				
				// 'change'
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( parentModel, changeEvent.model, "The event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( 'myCollection', changeEvent.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( collection, changeEvent.newValue, "The event for childModel1 should have been fired with the newValue of the collection" );
				Y.Assert.areSame( collection, changeEvent.oldValue, "The event for childModel1 should have been fired with the oldValue of the collection" );
				
				// 'change:myCollection'
				Y.Assert.areSame( 1, attrSpecificChangeEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( parentModel, attrSpecificChangeEvent.model, "The attribute-specific event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( collection, attrSpecificChangeEvent.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue of the collection" );
				Y.Assert.areSame( collection, attrSpecificChangeEvent.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue of the collection" );
				
				// 'change:myCollection.*'
				Y.Assert.areSame( 1, attrSpecificChangeAttrEventCallCount, "The call count should now be exactly 1" );
				Y.Assert.areSame( collection, attrSpecificChangeAttrEvent.collection, "The attribute-specific event for childModel1 should have been fired with the collection" );
				Y.Assert.areSame( childModel1, attrSpecificChangeAttrEvent.model, "The attribute-specific event for childModel1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', attrSpecificChangeAttrEvent.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'newValue1', attrSpecificChangeAttrEvent.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue" );
				Y.Assert.areSame( 'origValue1', attrSpecificChangeAttrEvent.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue" );
			},
			
						
			"The parent model should no longer fire events from the child collection after the child collection has been un-set from the parent" : function() {
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'myCollection', type: 'collection' } ]
				} );
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { myCollection: collection } );
				
				var changeEventCallCount = 0;
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					changeEventCallCount++;
				} );
				
				// Set a value in a child model. We should get a change event.
				childModel1.set( 'attr', 'newValue1' );
				Y.Assert.areSame( 1, changeEventCallCount, "The call count should now be 1 (as an initial test)" );
				
				
				// Now, unset the child collection, and then set another attribute on a model within it. We should not get another change event.
				parentModel.set( 'myCollection', null );
				childModel1.set( 'attr', 'newNewValue1' );
				
				Y.Assert.areSame( 2, changeEventCallCount, "We should now only have 2 for the event firing count, as we un-set the child model from the parent (which was the +1), but shouldn't get 3 from childModel1's event" );
			},
						
			
			
			// ------------------------------
			
			// Test multiple levels of embedded models and collections
			
			/* Need to fully implement...
			"When an attribute has changed in a deeply nested embedded model/collection, its uppermost parent model should fire 'change' events for every step of the way" : function() {
				// Creating a structure as such:
				// 
				// ParentModel
				//   ParentCollection
				//     IntermediateModel
				//       ChildCollection
				//         ChildModel
								
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'parentCollection', type: 'Collection' } ],
					toString : function() { return "(ParentModel)"; }
				} );
				var IntermediateModel = Kevlar.Model.extend( {
					attributes : [ { name: 'childCollection', type: 'Collection' } ],
					toString : function() { return "(IntermediateModel)"; }
				} );
				var ChildModel = Kevlar.Model.extend( {
					attributes: [ 'attr' ],
					toString : function() { return "(ChildModel)"; }
				} );
				
				var ParentCollection = Kevlar.Collection.extend( {
					model : IntermediateModel,
					toString : function() { return "(ParentCollection)"; }
				} );
				var ChildCollection = Kevlar.Collection.extend( {
					model : ChildModel,
					toString : function() { return "(ChildCollection)"; }
				} );
				
				
				var childModel1 = new ChildModel( { attr: 'origValue1' } ),
				    childModel2 = new ChildModel( { attr: 'origValue2' } ),
				    childCollection = new ChildCollection( [ childModel1, childModel2 ] ),
				    intermediateModel = new IntermediateModel( { childCollection: childCollection } ),
				    parentCollection = new ParentCollection( [ intermediateModel ] ),
				    parentModel = new ParentModel( { parentCollection: parentCollection } );
				
				
				// A class to store the results
				var ChangeEventResults = Class( {
					constructor : function( model, attributeName, newValue, oldValue ) {
						this.model = model;
						this.attributeName = attributeName;
						this.newValue = newValue;
						this.oldValue = oldValue;
					}
				} );
				
				var CollectionChangeEventResults = ChangeEventResults.extend( {
					constructor : function( collection, model, attributeName, newValue, oldValue ) {
						this.collection = collection;
						this._super( [ model, attributeName, newValue, oldValue ] );
					}
				} );
				
				
				// 'change'
				var parentModelChangeCallCount = 0,
				    parentModelChange;
				
				parentModel.on( 'change', function( model, attributeName, newValue, oldValue ) {
					parentModelChangeCallCount++;
					parentModelChange = new ChangeEventResults( model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection'
				var parentCollectionChangeCallCount = 0,
				    parentCollectionChange;
				
				parentModel.on( 'change:parentCollection', function( model, newValue, oldValue ) {
					parentCollectionChangeCallCount++;
					parentCollectionChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.*'
				var parentCollectionAttrChangeCallCount = 0,
				    parentCollectionAttrChange;
				
				parentModel.on( 'change:parentCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					parentCollectionAttrChangeCallCount++;
					parentCollectionAttrChange = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection'
				var childCollectionChangeCallCount = 0,
				    childCollectionChange;
				
				parentModel.on( 'change:parentCollection.childCollection', function( model, newValue, oldValue ) {
					childCollectionChangeCallCount++;
					childCollectionChange = new ChangeEventResults( model, '', newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection.*'
				var childCollectionAttrChangeCallCount = 0,
				    childCollectionAttrChange;
				
				parentModel.on( 'change:parentCollection.childCollection.*', function( collection, model, attributeName, newValue, oldValue ) {
					childCollectionAttrChangeCallCount++;
					childCollectionAttrChange = new CollectionChangeEventResults( collection, model, attributeName, newValue, oldValue );
				} );
				
				
				// 'change:parentCollection.childCollection.attr'
				var childModelChangeCallCount = 0,
				    childModelChange;
				
				parentModel.on( 'change:parentCollection.childCollection.attr', function( collection, model, newValue, oldValue ) {
					childModelChangeCallCount++;
					childModelChange = new CollectionChangeEventResults( collection, model, newValue, oldValue );
				} );
				
				
				childModel1.set( 'attr', 'newValue1' );
				
				// 'change:parentCollection.childCollection.attr'
				Y.Assert.areSame( 1, childModelChangeCallCount, "The childModelChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( childCollection, childModelChange.collection, "The childModelChange should have been fired with the childCollection" );
				Y.Assert.areSame( childModel1, childModelChange.model, "The childModelChange should have been fired with childModel1" );
				Y.Assert.areSame( 'newValue1', childModelChange.newValue, "The childModelChangeshould have been fired with the correct newValue" );
				Y.Assert.areSame( 'origValue1', childModelChange.oldValue, "The childModelChange should have been fired with the correct oldValue" );
				
				// 'change:parentCollection.childCollection.*'
				Y.Assert.areSame( 1, childCollectionAttrChangeCallCount, "The childCollectionAttrChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( childCollection, childCollectionAttrChange.collection, "The attribute-specific event for childModel1 should have been fired with the collection" );
				Y.Assert.areSame( childModel1, childCollectionAttrChange.model, "The attribute-specific event for childModel1 should have been fired with the model that changed" );
				Y.Assert.areSame( 'attr', childCollectionAttrChange.attributeName, "The event for childModel1 should have been fired with the correct attribute name" );
				Y.Assert.areSame( 'newValue1', childCollectionAttrChange.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue" );
				Y.Assert.areSame( 'origValue1', childCollectionAttrChange.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue" );
				
				// 'change:parentCollection.childCollection'
				Y.Assert.areSame( 1, childCollectionChangeCallCount, "The childCollectionChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( intermediateModel, childCollectionChange.model, "The attribute-specific event for childModel1 should have been fired with the parentModel" );
				Y.Assert.areSame( childCollection, childCollectionChange.newValue, "The attribute-specific event for childModel1 should have been fired with the newValue of the childCollection" );
				Y.Assert.areSame( childCollection, childCollectionChange.oldValue, "The attribute-specific event for childModel1 should have been fired with the oldValue of the childCollection" );
				
				// 'change:parentCollection.*'
				Y.Assert.areSame( 1, parentCollectionAttrChangeCallCount, "The parentCollectionAttrChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentCollection, parentCollectionAttrChange.collection, "The parentCollectionAttrChange should have been fired with the collection" );
				Y.Assert.areSame( intermediateModel, parentCollectionAttrChange.model, "The parentCollectionAttrChange should have been fired with the model that changed" );
				Y.Assert.areSame( 'childCollection', parentCollectionAttrChange.attributeName, "The parentCollectionAttrChange should have been fired with the correct attribute name" );
				Y.Assert.areSame( childCollection, parentCollectionAttrChange.newValue, "The parentCollectionAttrChange should have been fired with the childCollection" );
				Y.Assert.areSame( childCollection, parentCollectionAttrChange.oldValue, "The parentCollectionAttrChange should have been fired with the childCollection" );
				
				// 'change:parentCollection'
				Y.Assert.areSame( 1, parentCollectionChangeCallCount, "The parentCollectionChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentModel, parentCollectionChange.model, "The parentCollectionChange should have been fired with the parentModel" );
				Y.Assert.areSame( parentCollection, parentCollectionChange.newValue, "The parentCollectionChange should have been fired with the newValue of the parentCollection" );
				Y.Assert.areSame( parentCollection, parentCollectionChange.oldValue, "The parentCollectionChange should have been fired with the oldValue of the parentCollection" );
				
				// 'change'
				Y.Assert.areSame( 1, parentModelChangeCallCount, "The parentModelChangeCallCount should now be exactly 1" );
				Y.Assert.areSame( parentModel, parentModelChange.model, "The parentModelChange should have been fired with the parentModel" );
				Y.Assert.areSame( 'parentCollection', parentModelChange.attributeName, "The parentModelChange should have been fired with the correct attribute name" );
				Y.Assert.areSame( parentCollection, parentModelChange.newValue, "The parentModelChange should have been fired with the newValue of the parentCollection" );
				Y.Assert.areSame( parentCollection, parentModelChange.oldValue, "The parentModelChange should have been fired with the oldValue of the parentCollection" );
			},*/
			
			
			// ------------------------------
			
			// Test that a parent model fires a change event when a child collection is added to / removed from / reordered
			
			"When a child collection is added to / removed from / reordered, the parent model should fire a 'change' event" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [ { name: 'childCollection', type: 'collection' } ],
					
					toString : function() { return "(ParentModel)"; }  // for debugging
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [ { name : 'attr', type: 'string' } ],
					
					toString : function() { return "(ChildModel)"; }  // for debugging
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel,
					
					toString : function() { return "(Collection)"; }  // for debugging
				} );
				
				
				var childModel1 = new ChildModel( { attr: 1 } ),
				    childModel2 = new ChildModel( { attr: 2 } ),
				    childModel3 = new ChildModel( { attr: 3 } ),  // not added to the collection initially
				    collection = new Collection( [ childModel1, childModel2 ] ),
				    parentModel = new ParentModel( { childCollection: collection } );
				
				
				var addSetEventCount = 0,
				    removeSetEventCount = 0,
				    reorderEventCount = 0;
				collection.on( 'addset', function() { addSetEventCount++; } );
				collection.on( 'removeset', function() { removeSetEventCount++; } );
				collection.on( 'reorder', function() { reorderEventCount++; } );
				
				
				var changeEventCount = 0,
				    collectionSpecificChangeEventCount = 0,
				    changeModel, changeAttr, changeNewVal, changeOldVal;
				    
				parentModel.on( 'change', function( model, attr, newVal, oldVal ) {
					changeEventCount++;
					changeModel = model; changeAttr = attr; changeNewVal = newVal; changeOldVal = oldVal;
				} );
				
				parentModel.on( 'change:childCollection', function( model, newVal, oldVal ) {
					collectionSpecificChangeEventCount++;
				} );
				
				Y.Assert.areSame( 0, addSetEventCount, "Initial condition: the addSetEventCount should be 0" );
				Y.Assert.areSame( 0, removeSetEventCount, "Initial condition: the removeSetEventCount should be 0" );
				Y.Assert.areSame( 0, reorderEventCount, "Initial condition: the reorderEventCount should be 0" );
				Y.Assert.areSame( 0, changeEventCount, "Initial condition: the changeCount should be 0" );
				Y.Assert.areSame( 0, collectionSpecificChangeEventCount, "Initial condition: the collectionSpecificChangeEventCount should be 0" );
				
				
				collection.add( childModel3 );
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should now be 1" );
				Y.Assert.areSame( 0, removeSetEventCount, "The removeSetEventCount should still be 0" );
				Y.Assert.areSame( 0, reorderEventCount, "The reorderEventCount should still be 0" );
				Y.Assert.areSame( 1, changeEventCount, "The changeEventCount should now be 1 after an 'add' event" );
				Y.Assert.areSame( 1, collectionSpecificChangeEventCount, "The collectionSpecificChangeEventCount should now be 1 after an 'add' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for an add event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for an add event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for an add event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for an add event" );
				
				collection.remove( childModel3 );
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should still be 1" );
				Y.Assert.areSame( 1, removeSetEventCount, "The removeSetEventCount should now be 1" );
				Y.Assert.areSame( 0, reorderEventCount, "The reorderEventCount should still be 0" );
				Y.Assert.areSame( 2, changeEventCount, "The changeEventCount should now be 2 after a 'remove' event" );
				Y.Assert.areSame( 2, collectionSpecificChangeEventCount, "The collectionSpecificChangeEventCount should now be 2 after an 'remove' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for a remove event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for a remove event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for a remove event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for a remove event" );
				
				collection.insert( childModel1, 1 );  // "reorder" childModel1 to the 2nd position
				Y.Assert.areSame( 1, addSetEventCount, "The addSetEventCount should still be 1" );
				Y.Assert.areSame( 1, removeSetEventCount, "The removeSetEventCount should still be 1" );
				Y.Assert.areSame( 1, reorderEventCount, "The reorderEventCount should now be 1" );
				Y.Assert.areSame( 3, changeEventCount, "The changeEventCount should now be 3 after a 'reorder' event" );
				Y.Assert.areSame( 3, collectionSpecificChangeEventCount, "The collectionSpecificChangeEventCount should now be 3 after an 'reorder' event" );
				Y.Assert.areSame( parentModel, changeModel, "The changed model should be the parent model for a reorder event" );
				Y.Assert.areSame( 'childCollection', changeAttr, "The changed attribute should be the childCollection for a reorder event" );
				Y.Assert.areSame( collection, changeNewVal, "The newValue for the change event should be the collection for a reorder event" );
				Y.Assert.areSame( collection, changeOldVal, "The oldValue for the change event should be the collection for a reorder event" );
			}
		},
		
		
		{
			/*
			 * Test that the parent model "has changes" when an embedded collection is changed 
			 */
			name : "Test that the parent model \"has changes\" when an embedded collection is changed",
			
			"The parent model should have changes when a child embedded collection has changes" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'myCollection', type: 'collection', embedded: true }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				var collection = new Collection( [ { attr: 1 }, { attr: 2 } ] );
				var parentModel = new ParentModel( {
					myCollection: collection
				} );
				
				collection.getAt( 0 ).set( 'attr', 'newValue' );
				Y.Assert.isTrue( parentModel.isModified(), "The parent model should be considered 'modified' while a model in its child collection is 'modified'" );
				Y.Assert.isTrue( parentModel.isModified( 'myCollection' ), "The 'myCollection' attribute should be considered 'modified'" );
			},
			
			
			"The parent model should *not* have changes when a child collection has changes, but is not 'embedded'" : function() {
				var ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'myCollection', type: 'collection', embedded: false }
					]
				} );
				
				var ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'attr', type: 'string' }
					]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					model : ChildModel
				} );
				
				
				var collection = new Collection( [ { attr: 1 }, { attr: 2 } ] );
				var parentModel = new ParentModel( {
					myCollection: collection
				} );
				
				collection.getAt( 0 ).set( 'attr', 'newValue' );
				Y.Assert.isFalse( parentModel.isModified(), "The parent model should not be considered 'modified' even though its child collection is 'modified', because the child is not 'embedded'" );
			}
		}
	]
	
} ) );