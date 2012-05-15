/*global Ext, tests */
(function() {
	tests.integration               = new Ext.test.TestSuite( 'integration' );
	tests.integration.persistence   = new Ext.test.TestSuite( 'persistence' ) .addTo( tests.integration );
	//tests.integration.util        = new Ext.test.TestSuite( 'util' )        .addTo( tests.integration );
	
	Ext.test.Session.addSuite( tests.integration );
})();