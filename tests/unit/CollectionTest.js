/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestSuite( {
	name: 'Kevlar.Collection',
	
	
	items : [
	
		/*
		 * Test add()
		 */
		{
			name : "Test add()",
			
			"add() should be able to add a single Model instance to the Collection" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					modelClass : Model
				} );
				
				var collection = new Collection();
				var model = new Model( { attr: 'value' } );
				
				collection.add( model );
				
			},
			
			
			"add() should be able to add an array of Model instances to the Collection" : function() {
				
			},
			
			
			"add() should fire the 'add' event with the array of inserted models" : function() {
				
			},
			
			
			// -------------------------
			
			
			// Test converting anonymous configs to Model instances
			
			"add() should transform anonymous data objects to Model instances, based on the modelClass config" : function() {
				
			},
			
			
			"add() should fire the 'add' event with instantiated models for any anonymous config objects" : function() {
				
			}
		},
		
		
		
		/*
		 * Test createModel()
		 */
		{
			name : "Test createModel()",
			
			"createModel() should take an anonymous config object, and transform it into a Model instance, based on the modelClass config" : function() {
				var Model = Kevlar.Model.extend( {
					attributes : [ 'attr' ]
				} );
				
				var Collection = Kevlar.Collection.extend( {
					modelClass : Model
				} );
				
				var collection = new Collection();
				var model = collection.createModel( { attr: 'testValue' } );
				
				Y.Assert.isInstanceOf( Model, model );
				Y.Assert.areSame( 'testValue', model.get( 'attr' ) );
			}
		}
	]
	
} ) );