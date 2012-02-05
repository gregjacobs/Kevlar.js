/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with NativeObjectConverter',
	
	
	items : [
		{
			name : "Test getData()",
			ttype : 'suite',
			
			items : [
				{
					"Model::getData() should return a key for each of the Attributes in the Model, whether or not any data has been set to them" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model( { attribute1: 'value1' } );
						
						var data = model.getData();
						Y.ObjectAssert.hasKey( 'attribute1', data, "The data returned should have attribute1" );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.ObjectAssert.hasKey( 'attribute2', data, "The data returned should have attribute2, even though no value has been set to it" );
						Y.Assert.isUndefined( data.attribute2, "attribute2 should be undefined in the returned data" );
					},
					
					
					"Model::getData() should return the data by running attributes' `get` functions (not just returning the raw data), when the `raw` option is not provided" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } }
							]
						} );
						var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
						
						var data = model.getData();
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
					},
					
					
					// -------------------------------
					
					// Test with `raw` option set to true
					
					"when the `raw` option is provided as true, Model::getData() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
								{ name: 'attribute3', raw: function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
							]
						} );
						var model = new Model( { attribute1: 'value1', attribute2: 'value2', attribute3: 'value3' } );
						
						var data = model.getData( { raw: true } );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
						Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
					},
					
					
					// -------------------------------
					
					// Test with `persistedOnly` option set to true
					
					"Model::getData() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) with the `persistedOnly` option set to true" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								{ name : 'attribute1', persist: true },
								{ name : 'attribute2', persist: false },
								{ name : 'attribute3', persist: true },
								{ name : 'attribute4', persist: false }
							]
						} );
						
						var model = new Model();
						
						var persistedData = model.getData( { persistedOnly: true } );
						Y.Assert.areSame( 2, Kevlar.util.Object.length( persistedData ), "The persisted data should only have 2 properties" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1', 'attribute3' ], persistedData, "The persisted data should have 'attribute1' and 'attribute3'" );
					}
				}
			]
		},
		
		
		{
			name : "Test getChanges()",
			ttype : 'suite',
			
			items : [
				{
					"Model::getChanges() should return a single attribute that has had its value changed" : function() {
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model();
						model.set( 'attribute1', "new value" );
						
						var changes = model.getChanges();
						Y.Assert.areSame( 1, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 1 property" );
						Y.Assert.areSame( "new value", changes.attribute1, "The change to attribute1 should have been 'new value'." );
					},
					
					"Model::getChanges() should return multiple attributes that have had their values changed" : function() {
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1', 'attribute2' ]
						} );
						var model = new Model();
						model.set( 'attribute1', "new value 1" );
						model.set( 'attribute2', "new value 2" );
						
						var changes = model.getChanges();
						Y.Assert.areSame( 2, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 2 properties" );
						Y.Assert.areSame( "new value 1", changes.attribute1, "The change to attribute1 should have been 'new value 1'." );
						Y.Assert.areSame( "new value 2", changes.attribute2, "The change to attribute2 should have been 'new value 2'." );
					},
					
					
					"Model::getChanges() should return the data by running attributes' `get` functions (not just returning the raw data)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 
								'attribute1', 
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
								'attribute3'
							]
						} );
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' ); 
						
						var data = model.getChanges();
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( '42 value1', data.attribute2, "attribute2 should have had its `get` function run, and that used as the value in the data" );
						Y.Assert.isFalse( 'attribute3' in data, "attribute3 should not exist in the 'changes' data, as it was never changed" );
					},
					
					
					// -------------------------------
					
					// Test with `raw` option set to true
					
					"when the `raw` option is provided as true, Model::getChanges() should return the data by running attributes' `raw` functions (not using `get`)" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								'attribute1', 
								{ name: 'attribute2', get: function( value, model ) { return "42 " + model.get( 'attribute1' ); } },
								{ name: 'attribute3', raw: function( value, model ) { return value + " " + model.get( 'attribute1' ); } },
								{ name: 'attribute4', defaultValue: 'value4' }
							]
						} );
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' ); 
						model.set( 'attribute3', 'value3' ); 
						
						var data = model.getChanges( { raw: true } );
						Y.Assert.areSame( 'value1', data.attribute1, "attribute1 should be 'value1'" );
						Y.Assert.areSame( 'value2', data.attribute2, "attribute2 should NOT have had its `get` function run. Its underlying data should have been returned" );
						Y.Assert.areSame( 'value3 value1', data.attribute3, "attribute3 should have had its `raw` function run, and that value returned" );
						Y.Assert.isFalse( 'attribute4' in data, "attribute4 should not exist in the 'changes' data, as it was never changed" );
					},
					
					
					// -------------------------------
					
					// Test with `persistedOnly` option set to true
					
					"Model::getChanges() should only retrieve the data for the persisted attributes (i.e. attributes with persist: true) that have been changed when the `persistedOnly` option is set to true" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [
								{ name : 'attribute1', persist: true },
								{ name : 'attribute2', persist: false },
								{ name : 'attribute3', persist: true },
								{ name : 'attribute4', persist: false }
							]
						} );
						
						var model = new Model();
						model.set( 'attribute1', 'value1' );
						model.set( 'attribute2', 'value2' );
						
						var persistedChanges = model.getChanges( { persistedOnly: true } );
						Y.Assert.areSame( 1, Kevlar.util.Object.length( persistedChanges ), "The persisted changes should only have 1 property" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1' ], persistedChanges, "The persisted changes should only have 'attribute1'" );
					}
				}
			]
		}
	]
	
} ) );
	