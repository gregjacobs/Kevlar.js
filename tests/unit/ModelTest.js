/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestSuite( {
	name: 'Kevlar.Model',
	
	
	items : [
	
		{
			/*
			 * Test Initialization (constructor)
			 */
			name: 'Test Initialization (constructor)',
			ttype : 'testsuite',
			
			
			items : [
				{
					/*
					 * Test lazy instantiating a persistenceProxy
					 */
					name : "Test lazy instantiating a persistenceProxy",
					
					_should : {
						error : {
							"Attempting to instantiate a persistenceProxy with no 'type' attribute should throw an error" :
								"Kevlar.persistence.Proxy.create(): No `type` property provided on persistenceProxy config object",
								
							"Attempting to instantiate a persistenceProxy with an invalid 'type' attribute should throw an error" :
								"Kevlar.persistence.Proxy.create(): Unknown Proxy type: 'nonexistentproxy'"
						}
					},
					
					"Attempting to instantiate a persistenceProxy with no 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : {}
						} );
						
						var model = new TestModel();
					},
					
					"Attempting to instantiate a persistenceProxy with an invalid 'type' attribute should throw an error" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'nonExistentProxy'
							}
						} );
						
						var model = new TestModel();
					},
					
					"Providing a valid config object should instantiate the Proxy *on class's the prototype*" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'rest'  // a valid persistenceProxy type
							}
						} );
						
						var model = new TestModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestModel.prototype.persistenceProxy );
					},
					
					"Providing a valid config object should instantiate the Proxy *on the correct subclass's prototype*, shadowing superclasses" : function() {
						var TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'nonExistentProxy'  // an invalid persistenceProxy type
							}
						} );
						
						var TestSubModel = Kevlar.extend( TestModel, {
							addAttributes: [ 'attribute1' ],
							persistenceProxy : { 
								type : 'rest'  // a valid persistenceProxy type
							}
						} );
						
						var model = new TestSubModel();
						Y.Assert.isInstanceOf( Kevlar.persistence.RestProxy, TestSubModel.prototype.persistenceProxy );
					}
				},
				
			
				{
					/*
					 * Test change event upon initialization
					 */
					name : "Test change event upon initialization",
					
					setUp : function() {
						this.TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [
								{ name: 'attribute1' },
								{ name: 'attribute2', defaultValue: "attribute2's default" },
								{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
								{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
							]
						} );
					},
					
					
					/* This test is no longer valid, as the constructor currently does not allow for a `listeners` config
					"The Model should not fire its 'change' event during the set of the initial data" : function() {
						var changeEventFired = false;
						var model = new this.TestModel( {
							attribute1: "attribute1 value"
						} );
						
						//model.addListener( 'change', function() { changeEventFired = true; } );
						Y.Assert.isFalse( changeEventFired, "The change event should not have fired during the set of the initial data" );
					},
					*/
					
					"The Model should fire its 'change' event when an attribute's data is set externally" : function() {
						var changeEventFired = false;
						var model = new this.TestModel();
						model.addListener( 'change', function() { changeEventFired = true; } );
						
						// Set the value
						model.set( 'attribute1', 'value1' );
						Y.Assert.isTrue( changeEventFired, "The change event should have been fired during the set of the new data" );
					}
				},
			
			
				{
					/*
					 * Test that the initial default values are applied
					 */
					name : "Test that the initial default values are applied",
					
					setUp : function() {
						this.TestModel = Kevlar.extend( Kevlar.Model, {
							addAttributes: [
								{ name: 'attribute1' },
								{ name: 'attribute2', defaultValue: "attribute2's default" },
								{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
								{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
								{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
							]
						} );
					},
			
					// Test that default values are applied to attribute values
					
					"A attribute with a defaultValue but no provided data should have its defaultValue when retrieved" : function() {
						var model = new this.TestModel();  // no data provided
						
						Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );
					},
					
					"A attribute with a defaultValue that is a function, but no provided data should have its defaultValue when retrieved" : function() {
						var model = new this.TestModel();  // no data provided
						
						Y.Assert.areSame( "attribute3's default", model.get( 'attribute3' ) );  // attribute3 has a defaultValue that is a function
					},
					
					"A attribute with a defaultValue and also provided data should have its provided data when retrieved" : function() {
						var model = new this.TestModel( {
							attribute2 : "attribute2's data"
						} );
						
						Y.Assert.areSame( "attribute2's data", model.get( 'attribute2' ), "The 'default' specified on the Attribute should *not* have been applied, since it has a value." );
					}
				},
				
				{
					/*
					 * Test initial data
					 */
					name : "Test initial data",
					
					"Providing initial data to the constructor should not leave the model set as 'dirty' (i.e. it should have no 'changes')" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
						} );
						
						var model = new Model( { attribute1: 'value1', attribute2: 'value2' } );
						Y.Assert.isFalse( model.isDirty(), "The model should not be dirty upon initialization" );
						Y.Assert.isTrue( Kevlar.util.Object.isEmpty( model.getChanges ), "There should not be any 'changes' upon initialization" );
					}
				},				
				
				
				{
					/*
					 * Test that initialize() is called
					 */
					name : "Test that initialize() is called",
					
					
					"The initialize() method should be called with the constructor function, for subclass initialization" : function() {
						var initializeCalled = false;
						
						var MyModel = Kevlar.Model.extend( {
							addAttributes : [ 
								'test',
								{ name: 'test2', defaultValue: 'defaultForTest2' }
							],
							initialize : function() {
								initializeCalled = true;
							}
						} );
						
						var model = new MyModel();
						Y.Assert.isTrue( initializeCalled, "The initialize() method should have been called" ); 
					}
				}
			]
		},
		
	
		{
			/*
			 * Test Attributes Inheritance
			 */
			name: 'Test Attributes Inheritance',
			
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			
			/*
			 * Utility method to remove duplicates from an array. Used by {@link #assertAttributesHashCorrect} for its check for the number of
			 * attributes that should exist.  Uses a hash to remove duplicates.
			 * 
			 * @method removeArrayDuplicates 
			 * @param {Array} arr
			 */
			removeArrayDuplicates : function( arr ) {
				var out=[], obj={};
				
				for( var i = 0, len = arr.length; i < len; i++ ) {
					obj[ arr[ i ] ] = 0;
				}
				for( i in obj ) { if( obj.hasOwnProperty( i ) ) { out.push( i ); } }
				
				return out;
			},
			
			
			/*
			 * Given a Model (provided as the last arg), and its superclasses, asserts that the number of attributes found on the prototypes of each Model
			 * matches the number of keys in the final {@link Kevlar.Model#attributes} hash, and that there is one key for each Attribute
			 * found in the 'attributes' prototype arrays.
			 * 
			 * Basically asserts that the final hash that the Kevlar.Model compiles from itself, and all of its superclasses, is correct.
			 * 
			 * @method assertAttributesHashCorrect
			 * @param {Kevlar.Model...} One or more Model classes, starting with the highest level Model (the "highest superclass" Model),
			 *   going all the way down to the lowest subclass Model.  Ex of args: Model, SubClassModel, SubSubClassModel. In this example,
			 *   the SubSubClassModel is the Model that will be tested.  
			 */
			assertAttributesHashCorrect : function( /* ... */ ) {
				var models = Kevlar.toArray( arguments ),
				    i, len;
				
				// Get the full array of prototype attributes (from the Model, SubClassModel, SubSubClassModel, etc), and the expected number of attributes
				var prototypeAttributes = [];
				for( i = 0, len = models.length; i < len; i++ ) {
					var currentPrototype = models[ i ].prototype;
					if( currentPrototype.hasOwnProperty( 'attributes' ) ) {
						prototypeAttributes = prototypeAttributes.concat( models[ i ].prototype.attributes );
					} else if( currentPrototype.hasOwnProperty( 'addAttributes' ) ) {
						prototypeAttributes = prototypeAttributes.concat( models[ i ].prototype.addAttributes );
					}
				}
				
				// Convert the array to a duplicates-removed array of attribute names
				var attributeNames = [];
				for( i = 0, len = prototypeAttributes.length; i < len; i++ ) {
					var attributeName = new Kevlar.Attribute( prototypeAttributes[ i ] ).getName();
					attributeNames.push( attributeName );
				}
				attributeNames = this.removeArrayDuplicates( attributeNames );
				var expectedAttributeCount = attributeNames.length;
				
				
				// Check the instance attributes of the Model under test now
				var instance = new models[ models.length - 1 ](),  // the last Model class provided to the method. It is assumed that all previous arguments are its superclasses
				    instanceAttributes = instance.attributes;
				
				var attributeCount = Kevlar.util.Object.length( instanceAttributes );
				Y.Assert.areSame( expectedAttributeCount, attributeCount, "There should be the same number of resulting attributes in the 'instanceAttributes' hash as the original 'attributes' arrays of the Model classes." );
				
				// Check that all of the attributes defined by each Model's prototype exist in the final 'attributes' hash
				for( i = 0, len = attributeNames.length; i < len; i++ ) {
					Y.ObjectAssert.hasKey( attributeNames[ i ], instanceAttributes, "The Model (last arg to assertAttributesHashCorrect) should have defined the '" + attributeNames[ i ] + "' attribute in its final 'attributes' hash" );
				}
			},
			
			
			// ---------------------------
			
			
			// Tests
			
			"Attributes should inherit from a Model subclass's superclass when the subclass defines no attributes of its own" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'field1' ]
				} );
				var SubClassModel = Model.extend( {} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass when the subclass does define attributes of its own" : function() {
				// Reference the base class, and create a subclass
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Model.extend( {
					addAttributes : [ 'a', 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass, and its superclass as well (i.e. more than one level up)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'c', 'd', 'e' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', instanceAttributes, "SubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', instanceAttributes, "SubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attributes should inherit from a Model subclass's superclass, and all of its superclasses (i.e. more than two levels up)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'c', 'd', 'e' ]
				} );
				var SubSubSubClassModel = Kevlar.extend( SubSubClassModel, {
					addAttributes : [ 'f' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel, SubSubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'd', instanceAttributes, "SubSubSubClassModel should have the 'd' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'e', instanceAttributes, "SubSubSubClassModel should have the 'e' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'f', instanceAttributes, "SubSubSubClassModel should have the 'f' attribute defined in its final 'attributes' hash." );
			},
			
			
			"Attribute definitions defined in a subclass should take precedence over attribute definitions in a superclass" : function() {
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ { name : 'a', defaultValue: 1 } ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ { name : 'a', defaultValue: 2 }, 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				
				// Check that the default value of the Attribute 'a' is 2, not 1 (as the Attribute in the subclass should have overridden its superclass Attribute)
				Y.Assert.areSame( 2, instanceAttributes[ 'a' ].defaultValue, "The attribute in the subclass should have overridden its superclass" ); 
			},
			
			
			"A subclass that doesn't define any attributes should inherit all of them from its superclass(es)" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {
					addAttributes : [ 'a', 'b' ]
				} );
				var SubSubClassModel = Kevlar.extend( SubClassModel, {} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			"A superclass that doesn't define any attributes should be skipped for attributes, but the subclass should still inherit from superclasses above it" : function() {
				// Reference the base class, and create two subclasses
				var Model = Kevlar.Model.extend( {} );
				var SubClassModel = Kevlar.extend( Model, {} );  // one that doesn't define any attributes
				var SubSubClassModel = Kevlar.extend( SubClassModel, {
					addAttributes : [ 'a', 'b' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubClassModel, SubSubClassModel );
				
				// As a sanity check for the assertAttributesHashCorrect test code, assert that at least the attributes defined by subclasses are there 
				// (not asserting anything against the base Kevlar.Model's attributes array, as they are subject to change).
				var instanceAttributes = (new SubSubClassModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
			},
			
			
			// -------------------------------
			
			
			"One should be able to use `attributes` in place of `addAttributes` on the prototype, if they wish" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'a', 'b' ]
				} );
				var SubModel = Model.extend( {
					attributes : [ 'c' ]
				} );
				
				// Run the test code
				this.assertAttributesHashCorrect( Model, SubModel );
				
				var instanceAttributes = (new SubModel()).attributes;
				Y.ObjectAssert.hasKey( 'a', instanceAttributes, "SubSubClassModel should have the 'a' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'b', instanceAttributes, "SubSubClassModel should have the 'b' attribute defined in its final 'attributes' hash." );
				Y.ObjectAssert.hasKey( 'c', instanceAttributes, "SubSubClassModel should have the 'c' attribute defined in its final 'attributes' hash." );
			}
		},
		
		
		
		
		
		{
			/*
			 * Test getId()
			 */
			name : "Test getId()",
			
			_should : {
				error : {
					"getId() should throw an error if the default idAttribute 'id' does not exist on the model" : 
						"Error: The `idAttribute` (currently set to an attribute named 'id') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it.",
					"getId() should throw an error with a custom idAttribute that does not relate to an attribute on the model" : 
						"Error: The `idAttribute` (currently set to an attribute named 'myIdAttribute') was not found on the Model. Set the `idAttribute` config to the name of the id attribute in the Model. The model can't be saved or destroyed without it."
				}
			},
			
			"getId() should throw an error if the default idAttribute 'id' does not exist on the model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						// note: no attribute named 'id'
						'field1',
						'field2'
					]
				} );
				
				var model = new Model();
				model.getId();
				
				Y.Assert.fail( "The test should have errored" );
			},
			
			
			"getId() should throw an error with a custom idAttribute that does not relate to an attribute on the model" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [
						'field1',
						'field2'
					],
					
					idAttribute: 'myIdAttribute'
				} );
				
				var model = new Model();
				model.getId();
				
				Y.Assert.fail( "The test should have errored" );
			},
			
			
			"getId() should return the value of the idAttribute" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'myIdAttribute' ],
					idAttribute: 'myIdAttribute'
				} );
				
				var model = new Model( {
					myIdAttribute: 1
				} );
				
				Y.Assert.areSame( 1, model.getId() );
			}
		},
		
		
		{
			/*
			 * Test set()
			 */
			name: 'Test set()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
				
			
			/*
			 * Utility method to set the given attribute to all data types, including falsy values, and asserts that the operation was successful
			 * (i.e. the attribute returns the same exact value it was set to).
			 * 
			 * @method assertAttributeAcceptsAll
			 * @param {Kevlar.Model} model
			 * @param {String} attributeName
			 */
			assertAttributeAcceptsAll : function( model, attributeName ) {
				model.set( attributeName, undefined );
				Y.Assert.isUndefined( model.get( attributeName ), attributeName + "'s value should have the value set by set() (undefined)." );
				
				model.set( attributeName, null );
				Y.Assert.isNull( model.get( attributeName ), attributeName + "'s value should have the value set by set() (null)." );
				
				model.set( attributeName, true );
				Y.Assert.isTrue( model.get( attributeName ), attributeName + "'s value should have the value set by set() (true)." );
				
				model.set( attributeName, false );
				Y.Assert.isFalse( model.get( attributeName ), attributeName + "'s value should have the value set by set() (false)." );
				
				model.set( attributeName, 0 );
				Y.Assert.areSame( 0, model.get( attributeName ), attributeName + "'s value should have the value set by set() (0)." );
				
				model.set( attributeName, 1 );
				Y.Assert.areSame( 1, model.get( attributeName ), attributeName + "'s value should have the value set by set() (1)." );
				
				model.set( attributeName, "" );
				Y.Assert.areSame( "", model.get( attributeName ), attributeName + "'s value should have the value set by set() ('')." );
				
				model.set( attributeName, "Hello" );
				Y.Assert.areSame( "Hello", model.get( attributeName ), attributeName + "'s value should have the value set by set() ('Hello')." );
				
				model.set( attributeName, {} );
				Y.Assert.isObject( model.get( attributeName ), attributeName + "'s value should have the value set by set() (object)." );
				
				model.set( attributeName, [] );
				Y.Assert.isArray( model.get( attributeName ), attributeName + "'s value should have the value set by set() (array)." );
			},
			
			
			"set() should accept all datatypes including falsy values" : function() {
				var model = new this.TestModel();
				
				this.assertAttributeAcceptsAll( model, 'attribute1' );
			},
			
			"set() should accept all datatypes, and still work even with a default value" : function() {
				// Test with regular values, given a default value
				var model = new this.TestModel();
				
				this.assertAttributeAcceptsAll( model, 'attribute2' );  // attribute2 has a default value
			},
			
			"set() should accept all datatypes, and still work even with a given value" : function() {
				// Test with regular values, given a default value
				var model = new this.TestModel( {
					attribute2 : "initial value"
				} );
				
				this.assertAttributeAcceptsAll( model, 'attribute2' );  // attribute2 has a given value in this test ("initial value")
			},
			
			
			// ------------------------
			
			
			"After the successful set() of an attribute, the Model should be considered 'dirty'" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				var model = new TestModel();
				
				Y.Assert.isFalse( model.isDirty(), "Initially, the model should not be considered 'dirty'" );
				
				model.set( 'attribute1', 'value1' );
				Y.Assert.isTrue( model.isDirty(), "After a set, the model should now be considered 'dirty'" );
			},
			
			
			"After a set() of an attribute to the same value from a clean state, the Model should NOT be considered 'dirty' (as the value didn't change)" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				var model = new TestModel( { attribute1: 'value1' } );  // initial data, model not considered dirty
				
				Y.Assert.isFalse( model.isDirty(), "Initially, the model should not be considered 'dirty'" );
				
				// Set to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.isFalse( model.isDirty(), "After a set to the *same value*, the model should not be considered 'dirty' (as the value didn't change)" );
			},
			
			
			// ------------------------
			
			
			"set() should not re-set an attribute to the same value from the initial value provided to the constructor" : function() {
				var changeCount = 0;
				
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				
				var model = new TestModel( { attribute1: 'value1' } );
				model.addListener( 'change:attribute1', function() { changeCount++; } );
				
				// Set to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 0, changeCount, "The attribute should not have been registered as 'changed' when providing the same value" );
			},
			
			
			"set() should not re-set an attribute to the same value" : function() {
				var changeCount = 0;
				
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [ 'attribute1' ]
				} );
				
				var model = new TestModel();
				model.addListener( 'change:attribute1', function() { changeCount++; } );
				
				// Set for the first time
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 1, changeCount, "Initially, the attribute should have been changed exactly once." );
				
				// Set the second time to the same value
				model.set( 'attribute1', 'value1' );
				Y.Assert.areSame( 1, changeCount, "The attribute should not have been registered as 'changed' the second time. Should still only have '1 change'." );
			},
			
			
			// ------------------------------
			
			
			// Test set() with Attribute-specific set() functions			
			
			"set() should run the Attribute's set() method on an attribute that has initial data of its own" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
					]
				} );
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				Y.Assert.areSame( "attribute2val attribute1val", model.get( 'attribute2' ), "attribute2 should be the concatenation of its own value, a space, and attribute1" );
			},
			
			
			"set() should convert an attribute with a 'set' function when it is set() again" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
					]
				} );
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				// This call should cause attribute2's set() function to run
				model.set( 'attribute2', "newattribute2value" );
				
				Y.Assert.areSame( "newattribute2value attribute1val", model.get( 'attribute2' ), "attribute2 should be the concatenation of its own value, a space, and attribute2" );
			},
			
			
			// ------------------------
			
			// Test the 'change' event
			
			"When an attribute is set, a generalized 'change' event should be fired" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    attributeNameChanged = "",
				    newValue = "";
				    
				model.addListener( 'change', function( model, attributeName, value ) {
					changeEventFired = true;
					attributeNameChanged = attributeName;
					newValue = value;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change' event was not fired" );
				Y.Assert.areSame( "attribute2", attributeNameChanged, "The attributeName that was changed was not provided to the event correctly." );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
			},
			
			
			"When an attribute is set, a 'change:xxx' event should be fired for the changed attribute" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 'attribute1', 'attribute2' ]
				} );
				var model = new TestModel(),
				    changeEventFired = false,
				    newValue = "";
				    
				model.addListener( 'change:attribute2', function( model, value ) {
					changeEventFired = true;
					newValue = value;
				} );
				
				model.set( 'attribute2', "brandNewValue" );
				Y.Assert.isTrue( changeEventFired, "The 'change:attribute2' event was not fired" );
				Y.Assert.areSame( "brandNewValue", newValue, "The value for attribute2 that was changed was not provided to the event correctly." );
			},
			
			
			"When an attribute with a `set()` function of its own is set, the 'change' events should be fired" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						{ 
							// Attribute with a set() function that returns a new value
							name : 'attribute1',
							set : function( value ) { 
								return value;
							}
						},
						{ 
							// Attribute with a set() function that does not return a new value (presumably modifying some other Attribute in the model),
							// and therefore does not have a new value set to the underlying data
							name : 'attribute2', 
							set : function( value, model ) {
								// Presumably updating some other Attribute in the model
							}
						} 
					]
				} );
				
				var model = new TestModel(),
				    attribute1ChangeEventCount = 0,
				    attribute1ChangeEventValue,
				    attribute2ChangeEventCount = 0,
				    attribute2ChangeEventValue;
				    
				model.addListener( 'change:attribute1', function( model, value ) {
					attribute1ChangeEventCount++;
					attribute1ChangeEventValue = value;
				} );
				model.addListener( 'change:attribute2', function( model, value ) {
					attribute2ChangeEventCount++;
					attribute2ChangeEventValue = value;
				} );
				
				
				// Test changing the attribute with a set() function that returns a new value
				model.set( 'attribute1', 'attribute1value1' );
				Y.Assert.areSame( 1, attribute1ChangeEventCount, "The attribute1 change event count should now be 1, with the initial value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				Y.Assert.areSame( 'attribute1value1', attribute1ChangeEventValue, "The attribute1 change event value was not correct" );
				
				model.set( 'attribute1', 'attribute1value2' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should now be 2, with a new value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				Y.Assert.areSame( 'attribute1value2', attribute1ChangeEventValue, "The attribute1 change event value was not correct" );
				
				model.set( 'attribute1', 'attribute1value2' );  // setting to the SAME value, to make sure a new 'change' event has not been fired
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, being set to the same value" );
				Y.Assert.areSame( 0, attribute2ChangeEventCount, "The attribute2 change event count should still be 0, as no set has been performed on it yet" );
				
				
				// Test changing the attribute with a set() function that does *not* return a new value (which makes the model not store
				// any new value on its underlying data hash)
				model.set( 'attribute2', 'attribute2value1' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, as no new set has been performed on it" );
				Y.Assert.areSame( 1, attribute2ChangeEventCount, "The attribute2 change event count should now be 1, since a set has been performed on it" );
				Y.Assert.isUndefined( attribute2ChangeEventValue, "The attribute2 change event value should have been undefined, as its set() function does not return anything" );
				
				model.set( 'attribute2', 'attribute2value2' );
				Y.Assert.areSame( 2, attribute1ChangeEventCount, "The attribute1 change event count should still be 2, as no new set has been performed on it (2nd time)" );
				Y.Assert.areSame( 2, attribute2ChangeEventCount, "The attribute2 change event count should now be 2, since a set has been performed on it" );
				Y.Assert.isUndefined( attribute2ChangeEventValue, "The attribute2 change event value should still be undefined, as its set() function does not return anything" );				
			},
			
			
			"When an attribute with only a `get()` function is set, the 'change' events should be fired with the value from the get function, not the raw value" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{
							name : 'myAttribute',
							get : function( value, model ) { return value + 10; } // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel(),
				    changeEventValue,
				    attributeSpecificChangeEventValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue ) {
						changeEventValue = newValue;
					},
					'change:myAttribute' : function( model, newValue ) {
						attributeSpecificChangeEventValue = newValue;
					}
				} );
				
				model.set( 'myAttribute', 42 );  // the `get()` function on the Attribute will add 10 to this value when the attribute is retrieved
				
				Y.Assert.areSame( 52, changeEventValue, "The value provided with the change event should have come from myAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventValue, "The value provided with the attribute-specific change event should have come from myAttribute's `get()` function" );
			},
			
			
			"When an attribute with both a `set()` function, and `get()` function of its own is set, the 'change' events should be fired with the value from the `get()` function, not the raw value" : function() {
				var TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [ 
						'baseAttribute',
						{
							// Computed Attribute with both a set() function and a get() function, which simply uses 'baseAttribute' for its value
							// (which in practice, would probably be composed of two or more attributes, and possible does calculations as well)
							name : 'computedAttribute',
							set : function( value, model ) { model.set( 'baseAttribute', value ); },
							get : function( value, model ) { return model.get( 'baseAttribute' ) + 10; }   // add 10, to make sure we're using the getter
						}
					]
				} );
				
				var model = new TestModel(),
				    changeEventValue,
				    attributeSpecificChangeEventValue;
				
				model.on( {
					'change' : function( model, attributeName, newValue ) {
						changeEventValue = newValue;
					},
					'change:computedAttribute' : function( model, newValue ) {
						attributeSpecificChangeEventValue = newValue;
					}
				} );
				
				model.set( 'computedAttribute', 42 );  // the `get()` function will add 10 to this value when the attribute is retrieved
								
				Y.Assert.areSame( 52, changeEventValue, "The value provided with the change event should have come from the computedAttribute's `get()` function" );
				Y.Assert.areSame( 52, attributeSpecificChangeEventValue, "The value provided with the attribute-specific change event should have come from the computedAttribute's `get()` function" );
			},
			
			
			
			// ------------------------
			
			
			"for compatibility with Backbone's Collection, set() should set the id property to the Model object itself with the idAttribute is changed" : function() {
				var TestModel = Kevlar.Model.extend( {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', set : function( value, model ) { return value + " " + model.get( 'attribute1' ); } }
					],
					idAttribute: 'attribute1'
				} );
				
				var model = new TestModel( {
					attribute1 : "attribute1val",
					attribute2 : "attribute2val"
				} );
				
				Y.Assert.areSame( 'attribute1val', model.id, "The model's `id` property should have been set to attribute1's value, as that is the idAttribute." );
				
				model.set( 'attribute1', 'newValue' );
				Y.Assert.areSame( 'newValue', model.id, "The model's `id` property should have been set to attribute1's value after another set(), as that is the idAttribute." );
			}
		},
		
		
		{
			/*
			 * Test get()
			 */
			name: 'Test get()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', get : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			"running get() on an attribute with no initial value and no default value should return undefined" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.get( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running get() on an attribute with an initial value and no default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute1 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.get( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running get() on an attribute with no initial value but does have a default value should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running get() on an attribute with an initial value and a default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute2 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.get( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running get() on an attribute with no initial value but does have a default value which is a function should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute3's default", model.get( 'attribute3' ) );  // attribute3 has a defaultValue that is a function
			},
			
			"running get() on an attribute with a `get` function defined should return the value that the `get` function returns" : function() {
				var model = new this.TestModel( { attribute1: 'value1' } );
				Y.Assert.areSame( "value1 attribute2's default", model.get( 'attribute5' ) );
			}
		},
		
		
		{
			/*
			 * Test raw()
			 */
			name: 'Test raw()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ 
							name: 'attribute3', 
							get : function( value, model ) { 
								return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); 
							} 
						},
						{ 
							name: 'attribute4', 
							raw : function( value, model ) { 
								return value + " " + model.get( 'attribute1' );
							} 
						}
					]
				} );
			},
			
			
			"running raw() on an attribute with no initial value and no default value should return undefined" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.raw( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running raw() on an attribute with an initial value and no default value should return the initial value" : function() {
				var model = new this.TestModel( {
					attribute1 : "initial value"
				} );
				Y.Assert.areSame( "initial value", model.raw( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"running raw() on an attribute with no initial value but does have a default value should return the default value" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.raw( 'attribute2' ) );  // attribute2 has a default value
			},
			
			"running raw() on an attribute with a `get` function defined should return the *underlying* value, not the value that the `get` function returns" : function() {
				var model = new this.TestModel( { attribute3: 'value1' } );
				Y.Assert.areSame( "value1", model.raw( 'attribute3' ) );
			},
			
			"running raw() on an attribute with a `raw` function defined should return the value that the `raw` function returns" : function() {
				var model = new this.TestModel( { 
					attribute1: 'value1',
					attribute4: 'value4'
				} );
				Y.Assert.areSame( "value4 value1", model.raw( 'attribute4' ) );
			}
		},
		
		
		{
			/*
			 * Test getDefault()
			 */
			name: 'Test getDefault()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			// Test that the default values of attributes can be retrieved
			
			"A attribute with no defaultValue should return undefined when trying to retrieve its default value" : function() {
				var model = new this.TestModel();
				Y.Assert.isUndefined( model.getDefault( 'attribute1' ) );  // attribute1 has no default value
			},
			
			"A defaultValue should be able to be retrieved directly when the attribute has one" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute2's default", model.getDefault( 'attribute2' ) );  // attribute2 has a defaultValue of a string
			},
			
			"A defaultValue should be able to be retrieved directly when the defaultValue is a function that returns its default" : function() {
				var model = new this.TestModel();
				Y.Assert.areSame( "attribute3's default", model.getDefault( 'attribute3' ) );  // attribute2 has a defaultValue that is a function that returns a string
			}
		},	
			
		
		
		{
			/*
			 * Test isDirty()
			 */
			name: 'Test isDirty()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			
			"isDirty() should return false after instantiating a Model with no data" : function() {
				var model = new this.TestModel();
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return false after instantiating a Model with initial data" : function() {
				var model = new this.TestModel( { attribute1: 1, attribute2: 2 } );
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return true after setting an attribute's data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				Y.Assert.isTrue( model.isDirty() );
			},
			
			"isDirty() should return false after setting an attribute's data, and then rolling back the data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				model.rollback();
				Y.Assert.isFalse( model.isDirty() );
			},
			
			"isDirty() should return false after setting an attribute's data, and then committing the data" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', 1 );
				model.commit();
				Y.Assert.isFalse( model.isDirty() );
			}
		},
		
		
		
		{
			/*
			 * Test isModified()
			 */
			name: 'Test isModified()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
			
			
			"isModified() should return false for attributes that have not been changed" : function() {
				var model = new this.TestModel();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1, with no defaultValue, should not be modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2, with a defaultValue, should not be modified" );
			},
			
			
			"isModified() should return true for attributes that have been changed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified" );
				Y.Assert.isTrue( model.isModified( 'attribute2' ), "attribute2 should be marked as modified" );
			},
			
			
			"isModified() should return false for attributes that have been changed, but then committed" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been committed, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been committed, and therefore not marked as modified" );
			},
			
			
			"isModified() should return false for attributes that have been changed, but then rolled back" : function() {
				var model = new this.TestModel();
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.rollback();
				Y.Assert.isFalse( model.isModified( 'attribute1' ), "attribute1 should have been rolled back, and therefore not marked as modified" );
				Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should have been rolled back, and therefore not marked as modified" );
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
			
			
			"getData() should delegate to the singleton NativeObjectConverter to create an Object representation of its data" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2' ]
				} );
				
				var model = new Model( {
					attr1: 'value1',
					attr2: 'value2'
				} );
				
				var optionsObj = { raw: true };
				var result = model.getData( optionsObj );  // even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( model, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the model." );
				Y.Assert.areSame( optionsObj, this.args[ 1 ], "The second arg provided to NativeObjectConverter::convert() should have been the options object" );
			}
		},
		
		
		{
			/*
			 * Test getChanges()
			 */
			name: 'Test getChanges()',
			
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
			
			
			"getChanges() should delegate to the singleton NativeObjectConverter to create an Object representation of its data, but only provide changed attributes for the attributes that should be returned" : function() {
				var Model = Kevlar.Model.extend( {
					attributes: [ 'attr1', 'attr2', 'attr3' ]
				} );
				
				var model = new Model( {
					attr1: 'value1',
					attr2: 'value2',
					attr3: 'value3'
				} );
				model.set( 'attr1', 'newValue1' );
				model.set( 'attr2', 'newValue2' );
				
				// even though there really is no result from this unit test with a mock object, this has the side effect of populating the test data
				var result = model.getChanges( { raw: true } );  // add an extra option to make sure it goes through
				
				var optionsProvidedToConvert = this.args[ 1 ];
				
				// Check that the correct arguments were provided to the NativeObjectConverter's convert() method
				Y.Assert.areSame( model, this.args[ 0 ], "The first arg provided to NativeObjectConverter::convert() should have been the model." );
				Y.Assert.areSame( true, optionsProvidedToConvert.raw, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'raw:true' option" );
				Y.ArrayAssert.itemsAreSame( [ 'attr1', 'attr2' ], optionsProvidedToConvert.attributeNames, "The second arg provided to NativeObjectConverter::convert() should have receieved the 'attributeNames' option, with the attributes that were changed" );
			}
		},
		
		
		{
			/*
			 * Test commit()
			 */
			name: 'Test commit()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
				
			
			"committing changed data should cause the 'dirty' flag to be reset to false, and getChanges() to return an empty object" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				var changes = model.getChanges();
				Y.Assert.areSame( 0, Kevlar.util.Object.length( changes ), "The changes hash retrieved should have exactly 0 properties" );
				
				Y.Assert.isFalse( model.isDirty(), "The model should no longer be marked as 'dirty'" );
			},
			
			
			"committing changed data should cause rollback() to have no effect" : function() {
				var model = new this.TestModel();
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				// Attempt a rollback, even though the data was committed. Should have no effect.
				model.rollback();
				Y.Assert.areSame( "new value 1", model.get( 'attribute1' ), "attribute1 should have been 'new value 1'. rollback() should not have had any effect." );
				Y.Assert.areSame( "new value 2", model.get( 'attribute2' ), "attribute2 should have been 'new value 2'. rollback() should not have had any effect." );
			},
			
			
			"committing changed data should fire the 'commit' event" : function() {
				var commitEventCount = 0;
				var model = new this.TestModel();
				model.addListener( 'commit', function() {
					commitEventCount++;
				} );
				
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.commit();
				
				Y.Assert.areSame( 1, commitEventCount, "The 'commit' event should have been fired exactly once after committing." );
			}
		},
			
			
		
		{
			/*
			 * Test rollback()
			 */
			name: 'Test rollback()',
	
	
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
				
				
			"rollback() should revert the model's values back to default values if before any committed set() calls" : function() {
				// No initial data. 
				// attribute1 should be undefined
				// attribute2 should have the string "attribute2's default"
				var model = new this.TestModel();
				
				// Set, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values
				Y.Assert.isUndefined( model.get( 'attribute1' ) );
				Y.Assert.areSame( "attribute2's default", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should revert the model's values back to their pre-set() values" : function() {
				var model = new this.TestModel( {
					attribute1 : "original attribute1",
					attribute2 : "original attribute2"
				} );
				
				// Set, check the 'dirty' flag, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values
				Y.Assert.areSame( "original attribute1", model.get( 'attribute1' ) );
				Y.Assert.areSame( "original attribute2", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should revert the model's values back to their pre-set() values, when more than one set() call is made" : function() {
				var model = new this.TestModel( {
					attribute1 : "original attribute1",
					attribute2 : "original attribute2"
				} );
				
				// Set twice, and then rollback
				model.set( 'attribute1', "new value 1" );
				model.set( 'attribute2', "new value 2" );
				model.set( 'attribute1', "new value 1 - even newer" );
				model.set( 'attribute2', "new value 2 - even newer" );
				Y.Assert.isTrue( model.isDirty(), "The 'dirty' flag should be true." );
				model.rollback();
				
				// Check that they have the original values after rollback (that the 2nd set of set() calls didn't overwrite the original values) 
				Y.Assert.areSame( "original attribute1", model.get( 'attribute1' ) );
				Y.Assert.areSame( "original attribute2", model.get( 'attribute2' ) );
				
				// Check that isDirty() returns false
				Y.Assert.isFalse( model.isDirty(), "The 'dirty' flag should be false after rollback." );
			},
			
			
			"rollback() should fire the 'rollback' event" : function() {
				var rollbackEventCount = 0;
				
				var model = new this.TestModel( {
					attribute1 : 'orig1',
					attribute2 : 'orig2'
				} );
				model.on( 'rollback', function() {
					rollbackEventCount++;
				} );
				
				
				model.set( 'attribute1', 'new1' );
				
				Y.Assert.areSame( 0, rollbackEventCount, "Initial condition: The rollback event should not have been fired yet" );
				model.rollback();
				Y.Assert.areSame( 1, rollbackEventCount, "The rollback event should have been fired exactly once" );
			}
			
		},
		
		
		
		{
			/*
			 * Test load()
			 */
			name: 'Test load()',
			
			setUp : function() {
				this.TestModel = Kevlar.extend( Kevlar.Model, {
					addAttributes: [
						{ name: 'attribute1' },
						{ name: 'attribute2', defaultValue: "attribute2's default" },
						{ name: 'attribute3', defaultValue: function() { return "attribute3's default"; } },
						{ name: 'attribute4', set : function( value, model ) { return model.get( 'attribute1' ) + " " + model.get( 'attribute2' ); } },
						{ name: 'attribute5', set : function( value, model ) { return value + " " + model.get( 'attribute2' ); } }
					]
				} );
			},
		
			
			// Special instructions
			_should : {
				error : {
					"load() should throw an error if there is no configured persistenceProxy" : "Kevlar.Model::load() error: Cannot load. No persistenceProxy."
				}
			},
			
			
			"load() should throw an error if there is no configured persistenceProxy" : function() {
				var model = new this.TestModel( {
					// note: no configured persistenceProxy
				} );
				model.load();
				Y.Assert.fail( "load() should have thrown an error with no configured persistenceProxy" );
			},
			
			
			"load() should delegate to its persistenceProxy's read() method to retrieve the data" : function() {
				var readCallCount = 0;
				var MockProxy = Kevlar.persistence.Proxy.extend( {
					read : function( model, options ) {
						readCallCount++;
					}
				} );
				
				var MyModel = this.TestModel.extend( {
					persistenceProxy : new MockProxy()
				} );
				
				var model = new MyModel();
				
				// Run the load() method to delegate 
				model.load();
				
				Y.Assert.areSame( 1, readCallCount, "The persistenceProxy's read() method should have been called exactly once" );
			}
		},
		
		
		{
			/*
			 * Test save()
			 */
			name: 'Test save()',
			ttype: 'testsuite',
			
			items : [
				{
					name : "General save() tests",
					
					// Special instructions
					_should : {
						error : {
							"save() should throw an error if there is no configured persistenceProxy" : "Kevlar.Model::save() error: Cannot save. No persistenceProxy."
						}
					},
					
					
					"save() should throw an error if there is no configured persistenceProxy" : function() {
						var Model = Kevlar.Model.extend( {
							// note: no persistenceProxy
						} );
						var model = new Model();
						model.save();
						Y.Assert.fail( "save() should have thrown an error with no configured persistenceProxy" );
					},
					
					
					"save() should delegate to its persistenceProxy's create() method to persist changes when the Model does not have an id set" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							persistenceProxy : mockProxy
						} );
						
						var model = new Model();  // note: no 'id' set
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( mockProxy ).create();
						} catch( message ) {
							Y.Assert.fail( "The persistenceProxy's update() method should have been called exactly once. " + message );
						}
					},
					
					
					"save() should delegate to its persistenceProxy's update() method to persist changes, when the Model has an id" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'id' ],
							idAttribute : 'id',
							
							persistenceProxy : mockProxy
						} );
						
						var model = new Model( { id: 1 } );
						
						// Run the save() method to delegate 
						model.save();
						
						try {
							JsMockito.verify( mockProxy, JsMockito.Verifiers.once() ).update();
						} catch( message ) {
							Y.Assert.fail( "The persistenceProxy's update() method should have been called exactly once. " + message );
						}
					}
				},
					
				
				{
					name : "save() callbacks tests",
					
					setUp : function() {
						this.mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						
						// Note: setting both create() and update() methods here
						this.mockProxy.create = this.mockProxy.update = function( model, options ) {
							if( options.success ) { options.success.call( options.scope || window ); }
							if( options.error ) { options.error.call( options.scope || window ); }
							if( options.complete ) { options.complete( options.scope || window ); }
						};
						
						this.Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1' ],
							persistenceProxy  : this.mockProxy
						} );
					},
					
					
					"save should call its 'success' and 'complete' callbacks if the persistenceProxy successfully creates" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						var model = new this.Model();
						model.save( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error while creating" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						var model = new this.Model();
						model.save( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'success' and 'complete' callbacks if the persistenceProxy successfully updates" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						var model = new this.Model( { id: 1 } );
						model.save( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"save should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error while updating" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						var model = new this.Model( { id: 1 } );
						model.save( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					}
				},
				
				
				{
					name : "Test basic persistence",
					
					setUp : function() {
						this.Model = Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ]
						} );
					},
					
					// ---------------------------------
					
					
					"Model attributes that have been persisted should not be persisted again if they haven't changed since the last persist" : function() {
						var dataToPersist;
						var MockProxy = Kevlar.persistence.Proxy.extend( {
							update : function( model, options ) {
								dataToPersist = model.getChanges();
								options.success.call( options.scope );
							}
						} );
						var MyModel = this.Model.extend( {
							persistenceProxy : new MockProxy()
						} );
						var model = new MyModel( { id: 1 } );
						
						
						// Change attribute1 first (so that it has changes), then save
						model.set( 'attribute1', 'newattribute1value' );
						model.save();
						
						Y.Assert.areSame( 1, Kevlar.util.Object.length( dataToPersist ), "The dataToPersist should only have one key after attribute1 has been changed" );
						Y.ObjectAssert.ownsKeys( [ 'attribute1' ], dataToPersist, "The dataToPersist should have 'attribute1'" );
						
						
						// Now change attribute2. The dataToPersist should not include attribute1, since it has been persisted
						model.set( 'attribute2', 'newattribute2value' );
						model.save();
						
						Y.Assert.areSame( 1, Kevlar.util.Object.length( dataToPersist ), "The dataToPersist should only have one key after attribute2 has been changed" );
						Y.ObjectAssert.ownsKeys( [ 'attribute2' ], dataToPersist, "The dataToPersist should have 'attribute2'" );
					}
				},
				
				
					
				{
					name : "Test concurrent persistence and model updates",
										
					
					// Creates a test Model with a mock persistenceProxy, which fires its 'success' callback after the given timeout
					createModel : function( timeout ) {
						var MockProxy = Kevlar.persistence.Proxy.extend( {
							update : function( model, options ) {
								// update method just calls 'success' callback in 50ms
								window.setTimeout( function() {
									options.success.call( options.scope || window );
								}, timeout );
							}
						} );
						
						return Kevlar.Model.extend( {
							addAttributes : [ 'id', 'attribute1', 'attribute2' ],
							persistenceProxy : new MockProxy()
						} );
					},
					
					
					// ----------------------------
					
					// Test that model attributes that are updated during a persistence request do not get marked as committed
					
					"Model attributes that are updated (via set()) while a persistence request is in progress should not be marked as committed when the persistence request completes" : function() {
						var test = this;
						
						var Model = this.createModel( 50 ), // 50ms success callback
						    model = new Model( { id: 1 } );
						
						// Initial set
						model.set( 'attribute1', "origValue1" );
						model.set( 'attribute2', "origValue2" );
						
						// Begin persistence operation, defining a callback for when it is complete
						model.save( {
							success : function() {
								test.resume( function() {
									Y.Assert.isTrue( model.isDirty(), "The model should still be dirty after the persistence operation. attribute1 was set after the persistence operation began." );
									
									Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified (dirty). It was updated (set) after the persistence operation began." );
									Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should not be marked as modified. It was not updated after the persistence operation began." );
									
									Y.Assert.areSame( "newValue1", model.get( 'attribute1' ), "a get() operation on attribute1 should return the new value." );
									Y.Assert.areSame( "origValue2", model.get( 'attribute2' ), "a get() operation on attribute2 should return the persisted value. It was not updated since the persistence operation began." );
								} );
							}
						} );
						
						
						// Now set the attribute while the async persistence operation is in progress. Test will resume when the timeout completes
						model.set( 'attribute1', "newValue1" );
						// note: not setting attribute2 here
						
						// Wait for the setTimeout in the MockProxy
						test.wait( 100 );
					},
					
					
					"Model attributes that are updated *more than once* (via set()) while a persistence request is in progress should not be marked as committed when the persistence request completes" : function() {
						var test = this;
						
						var Model = this.createModel( 50 ), // 50ms success callback
						    model = new Model( { id: 1 } );
						
						// Initial set
						model.set( 'attribute1', "origValue1" );
						model.set( 'attribute2', "origValue2" );
						
						// Begin persistence operation, defining a callback for when it is complete
						model.save( {
							success : function() {
								test.resume( function() {
									Y.Assert.isTrue( model.isDirty(), "The model should still be dirty after the persistence operation. attribute1 was set after the persistence operation began." );
									
									Y.Assert.isTrue( model.isModified( 'attribute1' ), "attribute1 should be marked as modified (dirty). It was updated (set) after the persistence operation began." );
									Y.Assert.isFalse( model.isModified( 'attribute2' ), "attribute2 should not be marked as modified. It was not updated after the persistence operation began." );
									
									Y.Assert.areSame( "newValue11", model.get( 'attribute1' ), "a get() operation on attribute1 should return the new value." );
									Y.Assert.areSame( "origValue2", model.get( 'attribute2' ), "a get() operation on attribute2 should return the persisted value. It was not updated since the persistence operation began." );
									
									// Now rollback the model, and see if the original value of attribute1 is still there
									model.rollback();
									Y.Assert.areSame( "origValue1", model.get( 'attribute1' ), "The value for attribute1 should have been rolled back to its original value" ); 
								} );
							}
						} );
						
						
						// Now set the attribute twice while the async persistence operation is in progress. Test will resume when the timeout completes
						model.set( 'attribute1', "newValue1" );
						model.set( 'attribute1', "newValue11" );  // set it again
						// note: not setting attribute2 here
						
						// Wait for the setTimeout in the MockProxy
						test.wait( 100 );
					}
					
				}
			]
		},
		
		
		{
			/*
			 * Test destroy()
			 */
			name: 'Test destroy()',
			ttype : 'testsuite',
			
			items : [
				{
					name : "General destroy() tests",
					
					// Special instructions
					_should : {
						error : {
							"destroy() should throw an error if there is no configured persistenceProxy" : "Kevlar.Model::destroy() error: Cannot destroy. No persistenceProxy."
						}
					},
					
					
					"destroy() should throw an error if there is no configured persistenceProxy" : function() {
						var Model = Kevlar.Model.extend( {
							addAttributes : [ 'attribute1', 'attribute2' ]
							// note: no persistenceProxy
						} );
						
						var model = new Model();
						model.destroy();
						Y.Assert.fail( "destroy() should have thrown an error with no configured persistenceProxy" );
					},
					
					
					"destroy() should delegate to its persistenceProxy's destroy() method to persist the destruction of the model" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );				
						var Model = Kevlar.Model.extend( {
							persistenceProxy : mockProxy
						} );
						
						var model = new Model();
						
						// Run the destroy() method to delegate 
						model.destroy();
						
						try {
							JsMockito.verify( mockProxy, JsMockito.Verifiers.once() ).destroy();
						} catch( e ) {
							Y.Assert.fail( "The model should have delegated to the destroy method exactly once." );
						}
					},
					
					
					"upon successful destruction of the Model, the Model should fire its 'destroy' event" : function() {
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						mockProxy.destroy = function( model, options ) {
							options.success.call( options.scope );
						};
						
						var Model = Kevlar.Model.extend( {
							persistenceProxy : mockProxy
						} );
						
						var model = new Model();
						
						var destroyEventFired = false;
						model.addListener( 'destroy', function() {
							destroyEventFired = true;
						} );
						
						// Run the destroy() method to delegate 
						model.destroy();
						Y.Assert.isTrue( destroyEventFired, "Should have fired its destroy event" );
					}
				},
			
			
				{
					name : "destroy() callbacks tests",
					
					setUp : function() {
						this.mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						this.mockProxy.destroy = function( model, options ) {
							if( options.success )  { options.success.call( options.scope ); }
							if( options.error )    { options.error.call( options.scope ); }
							if( options.complete ) { options.complete( options.scope ); }
						};
					},
					
			
					"destroy() should call its 'success' and 'complete' callbacks if the persistenceProxy is successful" : function() {
						var successCallCount = 0,
						    completeCallCount = 0;
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1' ],
							persistenceProxy  : this.mockProxy
						} );
						var model = new Model();
						
						model.destroy( {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					},
					
					
					"destroy() should call its 'error' and 'complete' callbacks if the persistenceProxy encounters an error" : function() {
						var errorCallCount = 0,
						    completeCallCount = 0;
						    
						var mockProxy = JsMockito.mock( Kevlar.persistence.Proxy );
						mockProxy.destroy = function( model, options ) {
							options.error.call( options.scope );
							options.complete( options.scope );
						};
						
						var Model = Kevlar.Model.extend( {
							attributes : [ 'attribute1' ],
							persistenceProxy  : this.mockProxy
						} );
						var model = new Model();
						
						model.destroy( {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; },
							scope    : this
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' function should have been called exactly once" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' function should have been called exactly once" );
					}
				}
			]
		}
	]
	
} ) );
