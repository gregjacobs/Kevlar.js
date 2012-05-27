/*global Ext, Y, JsMockito, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestSuite( {
	
	name: 'Attribute',
	
	
	
	items: [
		{
			/*
			 * Test constructor
			 */
			name : "Test constructor",
	
			// --------------------------------
			//        Special Instructions
			// --------------------------------
			_should : {
				error : {
					"Instantiating an Attribute without a 'name' should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an undefined 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an undefined 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with a null 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with a null 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an empty 'name' argument should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor",
					"Instantiating an Attribute with an empty 'name' property should throw an error" : "no 'name' property provided to Kevlar.attribute.Attribute constructor"
				}
			},
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			// -----------------------
			
			// Check that the name property was provided
			
			"Instantiating an Attribute without a 'name' should throw an error" : function() {
				var attribute = new this.Attribute();
			},
			
			
			"Instantiating an Attribute with an undefined 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( undefined );
			},
			
			
			"Instantiating an Attribute with an undefined 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : undefined
				} );
			},
			
			
			"Instantiating an Attribute with a null 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( null );
			},
			
			
			"Instantiating an Attribute with a null 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : null
				} );
			},
			
			
			"Instantiating an Attribute with an empty 'name' argument should throw an error" : function() {
				var attribute = new this.Attribute( "" );
			},
			
			
			"Instantiating an Attribute with an empty 'name' property should throw an error" : function() {
				var attribute = new this.Attribute( {
					name : ""
				} );
			}
		},
		
		
		{
			/*
			 * Test getName()
			 */
			name: "Test getName()",
			
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			"The name property should be retrievable by getName()" : function() {
				var attribute1 = new this.Attribute( { name: 'testName' } );
				Y.Assert.areSame( 'testName', attribute1.getName(), "getName() not properly retriving Attribute's name. Was looking for 'testName'." );
				
				var attribute2 = new this.Attribute( { name: '_' } );
				Y.Assert.areSame( '_', attribute2.getName(), "getName() not properly retriving Attribute's name. Was looking for '_'." );
				
				var attribute3 = new this.Attribute( { name: "abc" } );
				Y.Assert.areSame( "abc", attribute3.getName(), "getName() not properly retriving Attribute's name. Was looking for 'abc'." );
			},
		
		
			// Make sure a number provided to the constructor as the 'name' is converted to a string datatype
			
			"Providing the attribute name as a number directly to the constructor argument should be converted to a string for the attribute's name" : function() {
				var attribute = new this.Attribute( 0 );
				Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
			},
			
			"Providing the attribute name as a property on the config should be converted to a string for the attribute's name" : function() {
				var attribute = new this.Attribute( {
					name : 0
				} );
				Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
			}
		},
		
		
		{
			/*
			 * Test getDefaultValue()
			 */
			name: "Test getDefaultValue()",
			
			
			setUp : function() {
				// A "concrete" subclass of Kevlar.attribute.Attribute(), used for the tests
				this.Attribute = Kevlar.attribute.Attribute.extend( {} );
			},
			
			
			// Check that the defaultValue is handled correctly
	
			"A default provided as the keyword 'default' should be accepted properly as defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					'default' : 1
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as the keyword 'default' that is a function should be executed and set properly to defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					'default' : function() { return 1; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue should be accepted properly" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : 1
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue that is a function should be executed and set properly to defaultValue" : function() {
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : function() { return 1; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
			},
			
			
			"A default provided as defaultValue that is a function should be provided the Attribute instance as its first argument" : function() {
				var argToDefaultValueFn;
				
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : function( arg ) {
						argToDefaultValueFn = arg;
						return 1;
					}
				} );
				
				// Run getDefaultValue() which will call the anonymous function provided as the defaultValue config
				attribute.getDefaultValue();
				
				Y.Assert.areSame( attribute, argToDefaultValueFn );
			},
			
			
			"A default provided as defaultValue that is a function should be executed each time the default is called for" : function() {
				var counter = 0;
				var attribute = new this.Attribute( {
					name : "TestAttribute",
					defaultValue : function() { return ++counter; }
				} );
				
				Y.Assert.areSame( 1, attribute.getDefaultValue() );
				Y.Assert.areSame( 2, attribute.getDefaultValue() );
			},
			
			
			"A defaultValue provided as an object should be recursed for functions, and those functions' return values should be used in the default" : function() {
				var attribute = new this.Attribute( {
					name : 'TestAttribute',
					'default' : { 
						a : "A",
						b : {
							innerB1 : function() {
								return "B1";
							},
							innerB2 : "B2"
						},
						c : {
							innerC1 : "C",
							innerC2 : function() {
								return "C2";
							}
						}
					}
				} );
				var defaultData = attribute.getDefaultValue();
				Y.Assert.areSame( "A", defaultData.a, "The 'default' config provided as an object should have had the value 'A' for property 'a'." );
				Y.Assert.areSame( "B1", defaultData.b.innerB1, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
				Y.Assert.areSame( "C2", defaultData.c.innerC2, "The 'default' config provided as an object should have been recursed for functions, and their return values used as the properties." );
			}
		},
		
		
		/*
		 * Test the doSet() method
		 */
		{
			name: "Test the doSet() method",
			
			
			"doSet() should call the Attribute's prototype set() method if there is no 'set' config, with the appropriate arguments" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var providedModel, 
				    providedNewValue, 
				    providedOldValue;
				    
				var Attribute = Kevlar.attribute.Attribute.extend( {
					set : function( model, newValue, oldValue ) {
						providedModel = model;
						providedNewValue = newValue;
						providedOldValue = oldValue;
					}
				} );
				
				var attribute = new Attribute( 'attr' );
				attribute.doSet( mockModel, newValue, oldValue );
				
				Y.Assert.areSame( mockModel, providedModel, "The mock model should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( newValue, providedNewValue, "The new value should have been provided as the second arg to the set() method" );
				Y.Assert.areSame( oldValue, providedOldValue, "The old value should have been provided as the third arg to the set() method" );
			},
			
			
			"doSet() should call a provided 'set' config function if provided to the Attribute, and it should be called in the scope of the model" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var contextCalledIn, 
				    providedNewValue, 
				    providedOldValue;
				    
				var Attribute = Kevlar.attribute.Attribute.extend( {} );
				
				var attribute = new Attribute( {
					name: 'attr',
					set: function( newValue, oldValue ) {
						contextCalledIn = this;
						providedNewValue = newValue;
						providedOldValue = oldValue;
					}
				} );
				
				attribute.doSet( mockModel, newValue, oldValue );
				
				Y.Assert.areSame( mockModel, contextCalledIn, "The 'set' config should have been called in the context of the mock model" );
				Y.Assert.areSame( newValue, providedNewValue, "The new value should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( oldValue, providedOldValue, "The old value should have been provided as the second arg to the set() method" );
			},
			
			
			"doSet() should wrap the provided 'set' config function if provided to the Attribute so that this._super() can be called from it for the original conversion" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model ),
				    newValue = 42,
				    oldValue = 27;
				
				var setMethodModel,
				    setMethodNewValue,
				    setMethodOldValue,
				    
				    setConfigContext,
				    setConfigNewValue,
				    setConfigOldValue;
				
				var Attribute = Kevlar.attribute.Attribute.extend( {
					set : function( model, newValue, oldValue ) {
						setMethodModel = model;
						setMethodNewValue = newValue;
						setMethodOldValue = oldValue;
					}
				} );
				
				var attribute = new Attribute( {
					name: 'attr',
					set: function( newValue, oldValue ) {   // the 'set' config
						setConfigContext = this;
						setConfigNewValue = newValue;
						setConfigOldValue = oldValue;
						
						this._super( arguments );
					}
				} );
				
				attribute.doSet( mockModel, newValue, oldValue );
				
				
				Y.Assert.areSame( mockModel, setMethodModel, "The mock model should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( newValue, setMethodNewValue, "The new value should have been provided as the second arg to the set() method" );
				Y.Assert.areSame( oldValue, setMethodOldValue, "The old value should have been provided as the third arg to the set() method" );
				
				Y.Assert.areSame( mockModel, setConfigContext, "The 'set' config should have been called in the context of the mock model" );
				Y.Assert.areSame( newValue, setConfigNewValue, "The new value should have been provided as the first arg to the set() method" );
				Y.Assert.areSame( oldValue, setConfigOldValue, "The old value should have been provided as the second arg to the set() method" );
			}
		}
	]
	
} ) );
