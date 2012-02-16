/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.add( new Ext.test.TestSuite( {
	
	name: 'Model with ModelAttribute',
	
	
	items : [
		{
			/*
			 * Test provided set() function
			 */
			name : "Test provided set() function",
			
			
			"The set() function provided to a ModelAttribute should be passed the instantiated Model if a 'modelClass' config is provided" : function() {
				var setValue;
				
				var InnerModel = Kevlar.Model.extend( {
					attributes : [ 'someAttr' ]
				} );
				
				var Model = Kevlar.Model.extend( {
					attributes : [
						{
							name : 'attr',
							type : 'model',
							modelClass : InnerModel,
							
							set : function( value ) {
								setValue = value;
								return value;
							}
						}
					]
				} );
				
				var model = new Model( {
					attr : { someAttr: 1 }
				} );
				Y.Assert.isInstanceOf( InnerModel, setValue );
			}
		},
		
		
		{
			/*
			 * Test retrieving the inner model from the outer model after it is set
			 */
			name : "Test retrieving the inner model from the outer model after it is set",
			
			
			"The get() method should be able to retrieve the Model after it has been set" : function() {
				var InnerModel = Kevlar.Model.extend( {
					attributes : [ 'someValue' ]
				} );
				
				var Model = Kevlar.Model.extend( {
					attributes : [
						{
							name : 'innerModel',
							type : 'model',
							modelClass : InnerModel
						}
					]
				} );
				
				var model = new Model( {
					innerModel : { someValue: 1 }
				} );
				var innerModel = model.get( 'innerModel' );
				
				Y.Assert.isInstanceOf( InnerModel, innerModel );
			}
		}
	]
	
} ) );