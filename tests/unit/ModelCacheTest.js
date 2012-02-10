/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.unit.add( new Ext.test.TestCase( {
	name: 'Kevlar.ModelCache',
	
	setUp : function() {
		this.MockModel1 = function() {};
		this.MockModel1.__Kevlar_modelTypeId = 1;
		
		this.MockModel2 = function() {};
		this.MockModel2.__Kevlar_modelTypeId = 2;
		
		// Reset the ModelCache between tests
		Kevlar.ModelCache.models = {};
	},
	
	tearDown : function() {
		// Reset the ModelCache on tearDown as well, so we don't affect other tests
		Kevlar.ModelCache.models = {};
	},
	
	
	// --------------------------------
	
		
	"get() should return a reference to the same model provided to it if not providing an id" : function() {
		var model = new this.MockModel1();
		
		var retrievedModel = Kevlar.ModelCache.get( model );
		Y.Assert.areSame( model, retrievedModel );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed in with the same type (subclass), but not passing in any id's" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1 );
		var retrievedModel2 = Kevlar.ModelCache.get( model2 );
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should return a reference to the first model, when a second one is passed with the same id" : function() {
		var model1 = new this.MockModel1();
		var model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // 1 on both
		
		Y.Assert.areSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same id, but of a different model type (subclass)" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel2();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same id of 1 on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 1 );  // but different types of models
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	},
	
	
	"get() should *not* return a reference to the first model, when a second one is passed with the same type (subclass), but with a different id" : function() {
		var model1 = new this.MockModel1(),
		    model2 = new this.MockModel1();
		
		var retrievedModel1 = Kevlar.ModelCache.get( model1, 1 );  // same type on both,
		var retrievedModel2 = Kevlar.ModelCache.get( model2, 2 );  // but different id's
		
		Y.Assert.areNotSame( retrievedModel1, retrievedModel2 );
	}
	
	
} ) );