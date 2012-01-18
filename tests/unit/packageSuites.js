/*global Ext, tests */
tests.unit = new Ext.test.TestSuite( { name : 'unit' } );
tests.unit.persistence = new Ext.test.TestSuite( { name : 'persistence', parentSuite: tests.unit } );
tests.unit.util = new Ext.test.TestSuite( { name : 'util', parentSuite: tests.unit } );