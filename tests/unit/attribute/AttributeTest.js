/*global Ext, Y, Kevlar, tests */
tests.unit.attribute.add( new Ext.test.TestCase( {
	
	name: 'Kevlar.attribute.Attribute',
	
	
	setUp : function() {
		
	},
	
	
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
	
	
	
	// --------------------------------
	//             Tests
	// --------------------------------
	
	
	// Check that the name property was provided
	
	"Instantiating an Attribute without a 'name' should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute();
	},
	
	
	"Instantiating an Attribute with an undefined 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( undefined );
	},
	
	
	"Instantiating an Attribute with an undefined 'name' property should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : undefined
		} );
	},
	
	
	"Instantiating an Attribute with a null 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( null );
	},
	
	
	"Instantiating an Attribute with a null 'name' property should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : null
		} );
	},
	
	
	"Instantiating an Attribute with an empty 'name' argument should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( "" );
	},
	
	
	"Instantiating an Attribute with an empty 'name' property should throw an error" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : ""
		} );
	},
	
	
	
	// Check that the 'name' property can be retrieved by getName()
	
	"The name property should be retrievable by getName()" : function() {
		var attribute1 = new Kevlar.attribute.Attribute( { name: 'testName' } );
		Y.Assert.areSame( 'testName', attribute1.getName(), "getName() not properly retriving Attribute's name. Was looking for 'testName'." );
		
		var attribute2 = new Kevlar.attribute.Attribute( { name: '_' } );
		Y.Assert.areSame( '_', attribute2.getName(), "getName() not properly retriving Attribute's name. Was looking for '_'." );
		
		var attribute3 = new Kevlar.attribute.Attribute( { name: "abc" } );
		Y.Assert.areSame( "abc", attribute3.getName(), "getName() not properly retriving Attribute's name. Was looking for 'abc'." );
	},
	
	
	// Make sure a number provided to the constructor as the 'name' is converted to a string datatype
	
	"Providing the attribute name as a number directly to the constructor argument should be converted to a string for the attribute's name" : function() {
		var attribute = new Kevlar.attribute.Attribute( 0 );
		Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
	},
	
	"Providing the attribute name as a property on the config should be converted to a string for the attribute's name" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : 0
		} );
		Y.Assert.areSame( "0", attribute.getName(), "the attribute name should have been converted to a string" );
	},
	
	
	// --------------------------------------
	
	
	// Check that defaultValue is handled correctly
	
	"A default provided as the keyword 'default' should be accepted properly as defaultValue" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : "TestAttribute",
			'default' : 1
		} );
		
		Y.Assert.areSame( 1, attribute.getDefaultValue() );
	},
	
	
	"A default provided as the keyword 'default' that is a function should be executed and set properly to defaultValue" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : "TestAttribute",
			'default' : function() { return 1; }
		} );
		
		Y.Assert.areSame( 1, attribute.getDefaultValue() );
	},
	
	
	"A default provided as defaultValue should be accepted properly" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : "TestAttribute",
			defaultValue : 1
		} );
		
		Y.Assert.areSame( 1, attribute.getDefaultValue() );
	},
	
	
	"A default provided as defaultValue that is a function should be executed and set properly to defaultValue" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
			name : "TestAttribute",
			defaultValue : function() { return 1; }
		} );
		
		Y.Assert.areSame( 1, attribute.getDefaultValue() );
	},
	
	
	"A default provided as defaultValue that is a function should be executed each time the default is called for" : function() {
		var counter = 0;
		var attribute = new Kevlar.attribute.Attribute( {
			name : "TestAttribute",
			defaultValue : function() { return ++counter; }
		} );
		
		Y.Assert.areSame( 1, attribute.getDefaultValue() );
		Y.Assert.areSame( 2, attribute.getDefaultValue() );
	},
	
	
	"A defaultValue provided as an object should be recursed for functions, and those functions' return values should be used in the default" : function() {
		var attribute = new Kevlar.attribute.Attribute( {
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
	
} ) );
