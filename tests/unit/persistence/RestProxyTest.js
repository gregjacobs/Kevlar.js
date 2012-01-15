/*global window, jQuery, Ext, Y, JsMockito, Kevlar */
Ext.test.Session.addSuite( 'Kevlar.persistence', {
                                                 
	name: 'Kevlar.persistence.RestProxy',
	
	
	items : [
	
		{
			/*
			 * Test create()
			 */
			name: "Test create",
			ttype: 'testsuite',
			
			items : [
				{
					name: 'General create() tests',
					
					"create() should populate the model with any response data upon a successful ajax request" : function() {
						var testData = { field1: 'value1', field2: 'value2' };
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function( options ) { 
								options.success( testData );
							}
						} );
						var proxy = new TestProxy();
						
						var mockModel = JsMockito.mock( Kevlar.Model );
						proxy.create( mockModel );
						
						try {
							JsMockito.verify( mockModel ).set( testData );
						} catch( e ) {
							Y.Assert.fail( "The model should have had its data set to the testData" );
						}
					}
				},
				
				{
					name : "create()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'POST'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.create( model );
						Y.Assert.areSame( 'POST', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								create : 'PUT'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.create( model );
						Y.Assert.areSame( 'PUT', httpMethod );
					}
				}
			]
		},
					
	
		{
			/*
			 * Test read()
			 */
			name: "Test read",
			ttype: 'testsuite',
			
			items : [
				{
					name: 'General read() tests',
					
					"read() should populate the model data upon a successful ajax request" : function() {
						var testData = { field1: 'value1', field2: 'value2' };
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function( options ) { 
								options.success( testData );
							}
						} );
						var proxy = new TestProxy();
						
						var mockModel = JsMockito.mock( Kevlar.Model );
						proxy.read( mockModel );
						
						try {
							JsMockito.verify( mockModel ).set( testData );
						} catch( e ) {
							Y.Assert.fail( "The model should have had its data set to the testData" );
						}
					}
				},
				
				
				{
					name : "read()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'GET'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.read( model );
						Y.Assert.areSame( 'GET', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								read : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.read( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				}
			]
		},
		
		
		
		
		{
			/*
			 * Test update()
			 */
			name: "Test update()",
			ttype: 'testsuite',
			
			items : [
				{
					name : "General update() tests",
					
					
					"update() should NOT actually call the ajax method when no fields have been changed" : function() {
						var ajaxCallCount = 0;
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function() { ajaxCallCount++; }
						} );
						var proxy = new TestProxy();
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( {} );
						
						proxy.update( model );
						
						Y.Assert.areSame( 0, ajaxCallCount, "The proxy's ajax() method should not have not been called, since there are no changes" );
					},
					
					
					"update() should in fact call the ajax method when fields have been changed" : function() {
						var ajaxCallCount = 0;
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : function() { ajaxCallCount++; }
						} );
						var proxy = new TestProxy();
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						proxy.update( model );
						
						Y.Assert.areSame( 1, ajaxCallCount, "The proxy's ajax() method should have been called, since there are changes to persist" );
					}
				},
					
				
				{
					name : "Test update() callbacks",
					
					setUp : function() {
						this.ajaxCallCount = 0;
						
						this.TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax: jQuery.proxy( function( options ) { 
								this.ajaxCallCount++;
								
								if( options.success ) { options.success(); }
								if( options.error ) { options.error(); }
								if( options.complete ) { options.complete(); }
							}, this )
						} );
					},
					
						
					"The 'success' and 'complete' callbacks provided to update() should be called if no fields have been changed, and it does not need to do its ajax request" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( {} );
						
						var proxy = new this.TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						proxy.update( model, {
							success : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 0, this.ajaxCallCount, "The ajax method should not have been called" );
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided update() should have been called even though there are no changes and the proxy didn't need to persist anything" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called even though there are no changes and the proxy didn't need to persist anything" );
					},
					
					
					"The 'success' and 'complete' callbacks provided to update() should be called if the ajax request is successful" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var proxy = new this.TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						    
						proxy.update( model, {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided update() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called" );
					},
					
					
					"The 'error' and 'complete' callbacks provided to update() should be called if the ajax request fails" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
							
						var proxy = new this.TestProxy();
						
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						proxy.update( model, {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' callback provided update() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided update() should have been called" );
					}
				},
					
					
				{
					name : "HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'PUT'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.update( model );
						Y.Assert.areSame( 'PUT', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								update : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.update( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				},
				
				
				
				{
					/*
					 * Test incremental updates
					 */
					name : "Test incremental updates",
					
					setUp : function() {						
						this.mockModel = JsMockito.mock( Kevlar.Model );
						JsMockito.when( this.mockModel ).getPersistedData().thenReturn( { field1: 'value1', field2: 'value2' } );
						JsMockito.when( this.mockModel ).getPersistedChanges().thenReturn( { field2: 'value2' } );  // 'field2' is the "change"
					},
					
					
					"update() should provide the full set of data to the ajax method if the proxy is not set to do incremental updates" : function() {
						var dataPersisted;
						var ajaxFn = function( options ) {
							dataPersisted = JSON.parse( options.data );  // the data is fed as a JSON encoded string
						};
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : ajaxFn,
							incremental: false
						} );
						var proxy = new TestProxy();
						
						proxy.update( this.mockModel );
						
						Y.Assert.areEqual( 2, Kevlar.util.Object.length( dataPersisted ), "The dataPersisted have exactly 2 keys, one for each of the fields in the model" );
						Y.ObjectAssert.ownsKeys( [ 'field1', 'field2' ], dataPersisted );
						Y.Assert.areEqual( 'value1', dataPersisted.field1 );
						Y.Assert.areEqual( 'value2', dataPersisted.field2 );
					},
					
					
					"update() should provide only the changed data if the proxy is set to do incremental updates" : function() {
						var dataPersisted;
						var ajaxFn = function( options ) {
							dataPersisted = JSON.parse( options.data );  // the data is fed as a JSON encoded string
						};
						var TestProxy = Kevlar.persistence.RestProxy.extend( {
							ajax : ajaxFn,
							incremental: true
						} );
						var proxy = new TestProxy();
						
						proxy.update( this.mockModel );
						
						Y.Assert.areEqual( 1, Kevlar.util.Object.length( dataPersisted ), "The dataPersisted have exactly 1 key, the one that was changed" );
						Y.ObjectAssert.ownsKeys( [ 'field2' ], dataPersisted );
						Y.Assert.areEqual( 'value2', dataPersisted.field2 );
					}
				}
			]
		},
		
		
		{
			/*
			 * Test destroy()
			 */
			name : 'Test destroy',
			ttype : 'testsuite',
			
			
			items : [
				{
					name : "Test destroy()'s callbacks", 
						
					"The 'success' and 'complete' callbacks provided to destroy() should be called if the ajax request is successful" : function() {
						var ajaxFn = function( options ) { 
							options.success();
							options.complete();
						};
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: ajaxFn
						} );
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var proxy = new TestProxy();
						
						var successCallCount = 0,
						    completeCallCount = 0;
						proxy.destroy( model, {
							success  : function() { successCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, successCallCount, "The 'success' callback provided destroy() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided destroy() should have been called" );
					},
					
					
					"The 'error' and 'complete' callbacks provided to destroy() should be called if the ajax request fails" : function() {
						var ajaxFn = function( options ) { 
							options.error();
							options.complete();
						};
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: ajaxFn
						} );
						
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var proxy = new TestProxy();
						
						var errorCallCount = 0,
						    completeCallCount = 0;
						
						proxy.destroy( model, {
							error    : function() { errorCallCount++; },
							complete : function() { completeCallCount++; }
						} );
						
						Y.Assert.areSame( 1, errorCallCount, "The 'error' callback provided destroy() should have been called" );
						Y.Assert.areSame( 1, completeCallCount, "The 'complete' callback provided destroy() should have been called" );
					}
				},
									
					
				{
					name : "destroy()'s HTTP method tests",
					
					
					"By default, the ajax function should be called with the HTTP method 'DELETE'" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							}
						} );
						var proxy = new TestProxy();
						
						proxy.destroy( model );
						Y.Assert.areSame( 'DELETE', httpMethod );
					},
					
					
					"The HTTP method should be overridable via the actionMethods config" : function() {
						var model = JsMockito.mock( Kevlar.Model );
						JsMockito.when( model ).getPersistedChanges().thenReturn( { field1: 'value1' } );
						
						var httpMethod = "";
						var TestProxy = Kevlar.extend( Kevlar.persistence.RestProxy, {
							ajax: function( options ) {
								httpMethod = options.type;
							},
							
							actionMethods : {
								destroy : 'POST'  // override
							}
						} );
						var proxy = new TestProxy();
						
						proxy.destroy( model );
						Y.Assert.areSame( 'POST', httpMethod );
					}
				}
			]
		},
		
		
		{
			/*
			 * Test buildUrl()
			 */
			name: 'Test buildUrl()',
			
			
			"buildUrl() should return simply the configured urlRoot, if the 'appendId' config is false" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				var proxy = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl',
					appendId : false
				} );
				
				Y.Assert.areSame( '/testUrl', proxy.buildUrl( mockModel ), "buildUrl() should have simply still returned the url" );
			},
			
			
			"buildUrl() should return the configured urlRoot with the model's id, if the 'appendId' config is true" : function() {
				var mockModel = JsMockito.mock( Kevlar.Model );
				JsMockito.when( mockModel ).getId().thenReturn( 42 );
				
				// Try with no trailing slash on the url
				var proxy1 = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl',  // note: no trailing slash
					appendId : true
				} );
				
				Y.Assert.areSame( '/testUrl/42', proxy1.buildUrl( mockModel ), "buildUrl() should have returned the url with the id appended" );
				
				// Try with a trailing slash on the url
				var proxy2 = new Kevlar.persistence.RestProxy( {
					urlRoot : '/testUrl/',  // note: trailing slash exists
					appendId : true
				} );
				
				Y.Assert.areSame( '/testUrl/42', proxy2.buildUrl( mockModel ), "buildUrl() should have returned the url with the id appended" );
			}
		}
	]
} );