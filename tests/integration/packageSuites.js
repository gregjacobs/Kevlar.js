/*global Ext, tests */
tests.integration = new Ext.test.TestSuite( { name : 'integration' } );
//tests.integration.persistence = new Ext.test.TestSuite( { name : 'persistence', parentSuite: tests.integration } );
//tests.integration.util = new Ext.test.TestSuite( { name : 'util', parentSuite: tests.integration } );

// Because we don't have an integration test for Kevlar
tests.integration.Kevlar = {};