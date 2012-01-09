/*global window, Ext, Y, Kevlar */
Ext.test.Session.addSuite( 'Kevlar.persistence', {
                                                 
	name: 'Kevlar.persistence.RestProxy',
	
	
	items : [
	
		{
			/*
			 * Test update()
			 */
			name: 'Test update()',
			
			setUp : function() {
				var ajaxFn = this.ajaxFn = function( options ) {
					options.success();
				};
				
				this.testProxy = new Kevlar.persistence.RestProxy( {
					ajax : ajaxFn
				} );
				
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addFields: [ 'field1', 'field2', 'field3' ],
					proxy : this.testProxy
				} );
			},
			
			
			
			"save() should NOT call its proxy's update() method when no fields have been changed" : function() {
				var updateCallCount = 0;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						updateCallCount++;
					},
					supportsIncrementalUpdates : function() { return true; }
				} );
				
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				// Note: do not change any fields before calling save()
				model.save();
				
				Y.Assert.areSame( 0, updateCallCount, "The proxy's update() method should not have not been called, since there are no changes" );
			},
			
			
			"The 'success' callback provided to save() should be called if no fields have been changed, and the proxy's update() method does not need to be called" : function() {
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					supportsIncrementalUpdates : function() { return true; }
				} );
				
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				// Note: do not change any fields before calling save()
				var successCallCount = 0;
				model.save( {
					success : function() { successCallCount++; }
				} );
				
				Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided to save() method should have been called even though there are no changes and the proxy didn't need to persist anything" );
			},
			
			
			// -----------------------			
			
			// Tests surrounding incremental updates
			
			
			"save() should provide the full set of data if the proxy does not support incremental updates" : function() {
				var dataToPersist;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						dataToPersist = data;
					},
					supportsIncrementalUpdates : function() { return false; }
				} );
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				
				
				// Change a field first (so that it has changes), then save
				model.set( 'field1', 'newfield1value' );
				model.save();
				
				Y.Assert.areEqual( 5, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have exactly 5 keys, one for each of the fields" );
				Y.ObjectAssert.ownsKeys( [ 'field1','field2','field3','field4','field5' ], dataToPersist );
			},
			
			
			
			"save() should provide only the changed data if the proxy does in fact support incremental updates" : function() {
				var dataToPersist;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						dataToPersist = data;
					},
					supportsIncrementalUpdates : function() { return true; }
				} );
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				
				
				// Change a field first (so that it has changes), then save
				model.set( 'field1', 'newfield1value' );
				model.save();
				
				Y.Assert.areEqual( 1, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have one key, the one that was changed" );
				Y.ObjectAssert.ownsKeys( [ 'field1' ], dataToPersist, "The dataToPersist should have 'field1'" );
			},
			
			
			// -----------------------			
			
			// Tests surround the 'persist' property of fields
			
			
			"save() should provide only 'persist' fields out of all of its data to the proxy's update() method when the proxy does not support incremental updates" : function() {
				var dataToPersist;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						dataToPersist = data;
					},
					supportsIncrementalUpdates : function() { return false; }
				} );
				
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addFields: [
						{ name: 'field1' },
						{ name: 'field2', defaultValue: "field2's default", persist: false },   // not persisted
						{ name: 'field3', defaultValue: function() { return "field3's default"; } },
						{ name: 'field4', convert : function( value, model ) { return model.get( 'field1' ) + " " + model.get( 'field2' ); } },
						{ name: 'field5', convert : function( value, model ) { return value + " " + model.get( 'field2' ); }, persist: false }   // not persisted
					],
					proxy : new MockProxy()
				} );
				var model = new TestModel();
				
				
				// Change a field first (so that it has changes), then save
				model.set( 'field1', 'newfield1value' );
				model.save();
				
				Y.Assert.areEqual( 3, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have 3 keys, the fields that are persisted (i.e. that don't have persist:false)" );
				Y.ObjectAssert.ownsKeys( [ 'field1','field3','field4' ], dataToPersist, "The dataToPersist should only have persisted fields" );
			},
			
			
			
			"save() should provide only 'persist' fields of the changed fields to the proxy's update() method when the proxy supports incremental updates" : function() {
				var dataToPersist;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						dataToPersist = data;
					},
					supportsIncrementalUpdates : function() { return true; }
				} );
				
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addFields: [
						{ name: 'field1' },
						{ name: 'field2', defaultValue: "field2's default", persist: false },   // not persisted
						{ name: 'field3', defaultValue: function() { return "field3's default"; } },
						{ name: 'field4', convert : function( value, model ) { return model.get( 'field1' ) + " " + model.get( 'field2' ); } },
						{ name: 'field5', convert : function( value, model ) { return value + " " + model.get( 'field2' ); }, persist: false }   // not persisted
					],
					proxy : new MockProxy()
				} );
				var model = new TestModel();
				
				
				// Change some fields first (so that it has changes), then save
				model.set( 'field2', 'newfield2value' );
				model.set( 'field3', 'newfield3value' );
				model.set( 'field4', 'newfield4value' );
				model.set( 'field5', 'newfield5value' );
				model.save();
				
				Y.Assert.areEqual( 2, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have 2 keys, the fields that are persisted (i.e. that don't have persist:false), out of the 4 that were modified" );
				Y.ObjectAssert.ownsKeys( [ 'field3','field4' ], dataToPersist, "The dataToPersist should only have persisted fields" );
			},
			
						
			
			"save() should NOT call its proxy's update() method when only fields that are not to be persisted have been changed" : function() {
				var updateCallCount = 0;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						updateCallCount++;
					},
					supportsIncrementalUpdates : function() { return false; }
				} );
				
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addFields: [
						{ name: 'field1' },
						{ name: 'field2', persist: false }
					],
					proxy : new MockProxy()
				} );
				
				var model = new TestModel( {
					field1: "field1value",
					field2: "field2value"
				} );
				
				// Make a change to a non-persisted field
				model.set( 'field2', "newfield2value" );
				model.save();
				
				Y.Assert.areSame( 0, updateCallCount, "The proxy's update() method should not have not been called, since there are no changes to persisted fields" );
			},
			
			
			
			// NOTE: This test is commented for now, as the behavior is not yet implemented in the Model
			/*
			"save() should in fact call its proxy's update() method when a field that is not to be persisted has changed, but a convert field uses that field and is persisted" : function() {
				var updateCallCount = 0;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						updateCallCount++;
					},
					supportsIncrementalUpdates : function() { return false; }
				} );
				
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addFields: [
						{ name: 'field1', persist: false },
						{ name: 'field2', convert : function( val, model ) { return model.get( 'field1' ); } }
					],
					proxy : new MockProxy()
				} );
				
				var model = new TestModel( {
					field1: "field1value", field2: "field2value"
				} );
				
				// Make a change to a non-persisted field
				model.set( 'field1', "newfield1value" );
				model.save();
				
				Y.Assert.areSame( 1, updateCallCount, "The proxy's update() method should have been called, since a field with a convert that IS persisted was updated by the non-persisted field" );
			},*/
			
			
			
			// ---------------------------------
			
			// TODO: Test that if a model attribute is modified twice after a persistence operation is started, it should be able to be reverted to its original value
			
			
			// Test that model attributes that are updated during a persistence request do not get marked as committed
			
			"Model attributes that are updated (via set()) while a persistence request is in progress should not be marked as committed when the persistence request completes" : function() {
				var test = this;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						// update method just calls 'success' callback in 50ms
						window.setTimeout( function() {
							options.success.call( options.scope || window );
						}, 50 );
					},
					supportsIncrementalUpdates : function() { return true; }
				} );
				
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				// Initial set
				model.set( 'field1', "origValue1" );
				model.set( 'field2', "origValue2" );
				
				// Begin persistence operation
				model.save( {
					success : function() {
						test.resume( function() {
							Y.Assert.isTrue( model.isDirty(), "The model should still be dirty after the persistence operation. field1 was set after the persistence operation began." );
							
							Y.Assert.isTrue( model.isModified( 'field1' ), "field1 should be marked as modified (dirty). It was updated (set) after the persistence operation began." );
							Y.Assert.isFalse( model.isModified( 'field2' ), "field2 should not be marked as modified. It was not updated after the persistence operation began." );
							
							Y.Assert.areSame( "newValue1", model.get( 'field1' ), "a get() operation on field1 should return the new value." );
							Y.Assert.areSame( "origValue2", model.get( 'field2' ), "a get() operation on field2 should return the persisted value. It was not updated since the persistence operation began." );
						} );
					}
				} );
				
				
				// Now set the field while the async persistence operation is in progress. Test will resume when the timeout completes
				model.set( 'field1', "newValue1" );
				// note: not setting field2 here
				
				// Wait for the setTimeout in the MockProxy
				test.wait( 100 );
			},
			
			
			
			"Model attributes that have been persisted should not be persisted again if they haven't changed since the last persist" : function() {
				var dataToPersist;
				var MockProxy = Kevlar.extend( Kevlar.persistence.Proxy, {
					update : function( data, options ) {
						dataToPersist = data;
						options.success.call( options.scope );
					},
					supportsIncrementalUpdates : function() { return true; }
				} );
				var MyModel = this.TestModel.extend( {
					proxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				
				// Change field1 first (so that it has changes), then save
				model.set( 'field1', 'newfield1value' );
				model.save();
				
				Y.Assert.areEqual( 1, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have one key after field1 has been changed" );
				Y.ObjectAssert.ownsKeys( [ 'field1' ], dataToPersist, "The dataToPersist should have 'field1'" );
				
				
				// Now change field2. The dataToPersist should not include field1, since it has been persisted
				model.set( 'field2', 'newfield2value' );
				model.save();
				
				Y.Assert.areEqual( 1, Kevlar.util.Object.objLength( dataToPersist ), "The dataToPersist should only have one key after field2 has been changed" );
				Y.ObjectAssert.ownsKeys( [ 'field2' ], dataToPersist, "The dataToPersist should have 'field2'" );
			}
		}
	]
} );