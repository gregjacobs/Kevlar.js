/*global window, Ext, Y, JsMockito, tests, Kevlar */
tests.integration.persistence.add( new Ext.test.TestSuite( {
	
	name: 'RestProxy with Nested Models',
	
	
	items : [
		
		{
			/*
			 * Test updating when nested model attributes are changed
			 */
			name : "Test updating when nested model attributes are changed",
			
			setUp : function() {
				// A RestProxy subclass used for testing
				this.ajaxCallCount = 0;
				this.RestProxy = Kevlar.persistence.RestProxy.extend( {
					ajax : function() { 
						this.ajaxCallCount++; 
						return {};  // just an anonymous "ajax" object 
					}.createDelegate( this )
				} );
				
				this.ParentModel = Kevlar.Model.extend( {
					attributes : [
						{ name: 'id', type: 'string' },
						{ name: 'child', type: 'model', embedded: true }
					]
				} );
				
				this.ChildModel = Kevlar.Model.extend( {
					attributes : [
						{ name : 'persistedAttr', type: 'string' },
						{ name : 'unpersistedAttr', type: 'string', persist: false }
					]
				} );
			},
			
			
			"The parent model should *not* be persisted when only a non-persisted attribute of a nested model is changed" : function() {
				var ajaxCallCount = 0;
				
				var childModel = new this.ChildModel();
				var parentModel = new this.ParentModel( {
					id: 1,
					child: childModel
				} );
				childModel.set( 'unpersistedAttr', 'newValue' );
				
				var proxy = new this.RestProxy(),
				    result = proxy.update( parentModel );
				
				Y.Assert.isNull( result, "The update() method should have returned null, because there should have been nothing to persist" );
			}
			
		}
	
	]
	
} ) );