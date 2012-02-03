/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestCase( {
	name: 'Kevlar.ModelCache',
	
	setUp : function() {
		// Reset the ModelCache's modelTypeIdCounter back to 0, and its models cache back to empty between tests
		Kevlar.ModelCache.modelTypeIdCounter = 0;
		Kevlar.ModelCache.models = {};
	},
	
	tearDown : function() {
		// Reset the ModelCache's variables on tearDown as well, so we don't affect other tests
		Kevlar.ModelCache.modelTypeIdCounter = 0;
		Kevlar.ModelCache.models = {};
	},
	
	
	
	"get() should assign a '__Kevlar_modelTypeId' to a model subclass that hasn't had one assigned yet (i.e. a new one)" : function() {
		var MockModel = function(){};
		
		Y.Assert.isUndefined( MockModel.__Kevlar_modelTypeId, "Initial condition: the Model should not have a __Kevlar_modelTypeId yet" );
		
		var model = new MockModel();
		Kevlar.ModelCache.get( model );
		
		Y.Assert.areSame( 1, MockModel.__Kevlar_modelTypeId, "The Model should have had a new __Kevlar_modelTypeId assigned" );
	},
	
	
	"get() should return a reference to the same model provided to it if not providing an id" : function() {
		var MockModel = function(){};
		var model = new MockModel();
		
		var retrievedModel = Kevlar.ModelCache.get( model );
		Y.Assert.areSame( model, retrievedModel );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed in with the same type (subclass), but not passing in any id's" : function() {
		var MockModel = function(){};
		    
		var model1 = new MockModel(),
		    model2 = new MockModel();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1 );
		var retrievedModel2 = Kevlar.ModelCache.get( model2 );
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should return a reference to the first model, when a second one is passed with the same id" : function() {
		var MockModel = function(){};
		var model1 = new MockModel();
		var model2 = new MockModel();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // 1 on both
		
		Y.Assert.areSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same id, but of a different model type (subclass)" : function() {
		var MockModel1 = function(){},
		    MockModel2 = function(){};
		    
		var model1 = new MockModel1(),
		    model2 = new MockModel2();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of 1 on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // but different types of models
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same type (subclass), but with a different id" : function() {
		var MockModel = function(){};
		    
		var model1 = new MockModel(),
		    model2 = new MockModel();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same type on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 2 );  // but different id's
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	}
	
	
} ) );