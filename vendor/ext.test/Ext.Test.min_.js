/*!
 * Ext.Test
 * GPL Licensed (unfortunately...)
 * 
 * https://github.com/gregjacobs/Ext.test
 */
var Y={};Y.ObjectAssert={};YUI().use("*",function(a){Y=a;Y.ObjectAssert.hasProperty=Y.ObjectAssert.hasKey});Ext.ns("Ext.test");Ext.test.TestSuite=Ext.extend(Y.Test.Suite,{defaults:{},disableRegister:false,constructor:function(a){Ext.test.TestSuite.superclass.constructor.apply(this,arguments);this.initItems()},initItems:function(){var c=this.items.slice(0);this.items=[];if(c){var b=c.length;var a;for(var d=0;d<b;d++){a=c[d];Ext.applyIf(a,this.defaults);this.add(a)}}},add:function(b){var a=b;a.parentSuite=this;if(!(b instanceof Ext.test.TestCase)&&!(b instanceof Ext.test.TestSuite)){if(a.ttype=="testsuite"||a.ttype=="suite"){a=new Ext.test.TestSuite(b)}else{a=new Ext.test.TestCase(b)}}return Ext.test.TestSuite.superclass.add.call(this,a)},addTo:function(a){a.add(this);return this},getTestSuiteCount:function(){var b=this.items,a=b.length,f=0,e;for(var d=0;d<a;d++){e=b[d];if(e instanceof Ext.test.TestSuite){f+=e.getTestSuiteCount()+1}}return f},getTestCaseCount:function(){var b=this.items,a=b.length,f=0,e;for(var d=0;d<a;d++){e=b[d];if(e instanceof Ext.test.TestCase){f++}else{if(e instanceof Ext.test.TestSuite){f+=e.getTestCaseCount()}}}return f},cascade:function(k,l){var h=this.items,f=h.length,d;l=l||this;var g=k.call(l,this);if(g==false){return}for(var e=0;e<f;e++){d=h[e];if(d instanceof Ext.test.TestSuite){g=d.cascade(k,l);if(g==false){return}}else{if(d instanceof Ext.test.TestCase){k.call(l,d);var a=d.getTests();for(var c=0,b=a.length;c<b;c++){k.call(l,a[c])}}}}}});Ext.test.Suite=Ext.test.TestSuite;Y.Test.Suite=Ext.test.TestSuite;Ext.test.TestCase=Ext.extend(Y.Test.Case,{constructor:function(a){Ext.test.TestCase.superclass.constructor.apply(this,arguments)},addTo:function(a){a.add(this);return this},getTests:function(){var a=[];for(var b in this){if(Ext.isFunction(this[b])){if(b.indexOf("test")===0||(b.toLowerCase().indexOf("should")>-1&&b.indexOf(" ")>-1)){a.push(new Ext.test.Test(b,this,this[b]))}}}return a},getParentSuite:function(){return this.parentSuite}});Ext.test.Case=Ext.test.TestCase;Y.Test.Case=Ext.test.TestCase;Ext.test.Test=function(b,a,c){if(!b||typeof b!=="string"){throw new Error("'name' arg required for Ext.test.Test constructor")}if(!(a instanceof Ext.test.TestCase)){throw new Error("'testCase' arg for Ext.test.Test constructor must be an Ext.test.TestCase")}if(typeof c!=="function"){throw new Error("'fn' arg for Ext.test.Test constructor must be a function")}this.name=b;this.testCase=a;this.fn=c};Ext.test.Session=Ext.extend(Ext.util.Observable,{constructor:function(a){Ext.apply(this,a);Ext.test.Session.superclass.constructor.apply(this,arguments);this.addEvents("registersuite","registercase");this.masterSuite=new Ext.test.TestSuite({name:document.title,disableRegister:true,testSession:this})},addSuite:function(a,c){var b;if(typeof a==="string"){b=this.getSuite(a)}else{c=a;b=c.parentSuite||this.masterSuite}if(!(c instanceof Ext.test.TestSuite)){c.ttype="testsuite"}b.add(c)},addTest:function(b,a){var c;if(typeof b==="string"){c=this.getSuite(b)}else{a=b;c=a.parentSuite||this.masterSuite}c.add(a)},getSuite:function(a){var b=this.findSuite(a);if(!b){b=this.createSuite(a);this.masterSuite.add(b)}return b},createSuite:function(a){return new Ext.test.TestSuite({name:a})},findSuite:function(b){var a;this.masterSuite.cascade(function(c){if(c instanceof Ext.test.TestSuite&&c.name==b){a=c;return false}},this);return a},registerSuite:function(a){this.masterSuite.add(a);this.fireEvent("registersuite",this,a)},registerCase:function(a){this.masterSuite.add(a);this.fireEvent("registercase",this,a)},findCase:function(a){var b;this.masterSuite.cascade(function(c){if(c instanceof Ext.test.TestCase&&c.name==a){b=c;return false}},this);return b},getTestCaseCount:function(){return this.masterSuite.getTestCaseCount()},getTestSuiteCount:function(){return this.masterSuite.getTestSuiteCount()},getMasterSuite:function(){return this.masterSuite},destroy:function(){this.purgeListeners()}});Ext.test.SessionImpl=Ext.test.Session;Ext.test.Session=new Ext.test.Session();Ext.test.Runner=Ext.extend(Ext.util.Observable,{testSession:Ext.test.Session,constructor:function(){Ext.test.Runner.superclass.constructor.apply(this,arguments);this.addEvents("beforebegin","begin","complete","pass","fail","ignore","testcasebegin","testcasecomplete","testsuitebegin","testsuitecomplete");this.monitorYUITestRunner()},monitorYUITestRunner:function(){var b=Y.Test.Runner;b.disableLogging();var a=this.onTestRunnerEvent;b.subscribe("begin",a,this,true);b.subscribe("complete",a,this,true);b.subscribe("fail",a,this,true);b.subscribe("ignore",a,this,true);b.subscribe("pass",a,this,true);b.subscribe("testcasebegin",a,this,true);b.subscribe("testcasecomplete",a,this,true);b.subscribe("testsuitebegin",a,this,true);b.subscribe("testsuitecomplete",a,this,true);this.runner=b},onTestRunnerEvent:function(b){var a=b.type;if(a=="testsuitebegin"&&b.testSuite.name==this.runner.getName()){return}this.fireEvent(a,this,b)},run:function(){this.fireEvent("beforebegin",this);var a=this.testSession.getMasterSuite();this.runner.add(a);this.runner.run(true)},clear:function(){this.runner.clear()},destroy:function(){this.runner.unsubscribeAll();this.purgeListeners()}});Ext.test.Runner=new Ext.test.Runner();Ext.ns("Ext.test.view");Ext.test.view.Logger=Ext.extend(Ext.grid.GridPanel,{autoWidth:true,viewConfig:{forceFit:true},cls:"x-test-logger",disableSelection:true,trackMouseOver:false,initComponent:function(){this.configureStore();this.configureColumns();this.monitorTestRunner();Ext.test.view.Logger.superclass.initComponent.apply(this,arguments)},configureStore:function(){this.store=new Ext.data.JsonStore({fields:["logs","state"]})},configureColumns:function(){this.columns=[{header:"Logs",dataIndex:"logs",renderer:function(c,a,b){return'<span class="x-test-logger-state-'+b.get("state")+'">'+c+"</span>"}}]},monitorTestRunner:function(){var a=this.onTestRunnerEvent;var b=Ext.test.Runner;this.mon(b,"begin",a,this);this.mon(b,"complete",a,this);this.mon(b,"fail",a,this);this.mon(b,"pass",a,this);this.mon(b,"ignore",a,this);this.mon(b,"testcasebegin",a,this);this.mon(b,"testcasecomplete",a,this);this.mon(b,"testsuitebegin",a,this);this.mon(b,"testsuitecomplete",a,this)},onTestRunnerEvent:function(b,c){var a;switch(c.type){case"begin":a="Begin at "+new Date();break;case"complete":a="Completed at "+new Date();break;case"testcasebegin":a="TestCase "+c.testCase.name+" : Begin.";break;case"testcasecomplete":a="TestCase "+c.testCase.name+" : Complete.";break;case"testsuitebegin":a="TestSuite "+c.testSuite.name+" : Begin.";break;case"testsuitecomplete":a="TestSuite "+c.testSuite.name+" : Complete.";break;case"pass":a=c.testName+" : Passed.";break;case"fail":a=c.testName+" : Failed! <br />"+c.error.toString();break;case"ignore":a=c.testName+" : Ignored.";break}if(a){this.store.add(new Ext.data.Record({logs:a,state:c.type}))}}});Ext.reg("testlogger",Ext.test.view.Logger);Ext.test.view.ColumnTree=Ext.extend(Ext.tree.TreePanel,{useArrows:true,passText:"Passed",failText:"Failed!",ignoreText:"(Ignored)",autoScroll:true,rootVisible:false,lines:false,borderWidth:Ext.isBorderBox?0:2,cls:"x-column-tree",initComponent:function(){Ext.apply(this,Ext.apply(this.initialConfig,{root:new Ext.tree.TreeNode({expanded:true}),columns:[{dataIndex:"name",header:"Name",id:"name",width:500,renderer:function(f,d){var e="";var c=d.attributes.errors;if(c!=""){e='ext:qtip="'+c+'"'}return"<span "+e+">"+f+"</span>"}},{dataIndex:"state",header:"State",id:"state",renderer:function(e,d){var c="#000";if(e==d.ownerTree.passText){c="#00FF00"}else{if(e==d.ownerTree.failText){c="#FF0000"}}return'<span style="color: '+c+';font-weight: bold;">'+e+"</span>"},width:75},{dataIndex:"passed",header:"Passed",width:50},{dataIndex:"failed",header:"Failed",width:50},{dataIndex:"ignored",header:"Ignored",width:50},{dataIndex:"message",header:"Message",width:800}]}));var a=this.onTestRunnerEvent;var b=Ext.test.Runner;this.mon(b,"begin",a,this);this.mon(b,"complete",a,this);this.mon(b,"fail",a,this);this.mon(b,"pass",a,this);this.mon(b,"ignore",a,this);this.mon(b,"testcasebegin",a,this);this.mon(b,"testcasecomplete",a,this);this.mon(b,"testsuitebegin",a,this);this.mon(b,"testsuitecomplete",a,this);this.mon(b,"beforebegin",this.resetNodes,this);Ext.test.view.ColumnTree.superclass.initComponent.apply(this,arguments)},onRender:function(){Ext.test.view.ColumnTree.superclass.onRender.apply(this,arguments);this.colheaders=this.bwrap.createChild({cls:"x-tree-headers"},this.bwrap.dom.lastChild);var d=this.columns,e;for(var b=0,a=d.length;b<a;b++){e=d[b];this.colheaders.createChild({cls:"x-tree-hd "+(e.cls?e.cls+"-hd":""),cn:{cls:"x-tree-hd-text",html:e.header},style:"width:"+(e.width-this.borderWidth)+"px;"})}this.colheaders.createChild({cls:"x-clear"});this.colheaders.setWidth("auto");this.createTree()},createTree:function(){var a=Ext.test.Session.getMasterSuite();a.cascade(function(b){if(b===a){this.addSuiteNode(a,this.root,true)}else{if(!b.parentSuite){if(b instanceof Ext.test.TestSuite){this.addSuiteNode(b)}else{if(b instanceof Ext.test.TestCase){this.addCaseNode(b)}else{var c=this.getCaseNode(b.testCase);this.addTestNode(b,c)}}}else{var d=this.getSuiteNode(b.parentSuite);if(b instanceof Ext.test.TestCase){this.addCaseNode(b,d)}else{this.addSuiteNode(b,d)}}}},this)},resetNodes:function(){var a,b;this.root.cascade(function(c){if(c!=this.root){a=c.attributes;b=c.ui;a.passed="";a.failed="";a.ignored="";a.errors="";a.state="";a.message="";b.setIconElClass("x-tree-node-icon");b.refresh()}},this)},createSuiteNode:function(b,a){return new Ext.tree.TreeNode({name:b.name,testSuite:b,uiProvider:Ext.test.view.uiProvider,type:"testSuite",expanded:a,state:"",passed:"",failed:"",ignored:"",errors:"",message:""})},addSuiteNode:function(c,d,a){d=d||this.root;var b=this.getSuiteNode(c);if(b){b.remove(true)}var e=this.createSuiteNode(c,a);d.appendChild(e)},createCaseNode:function(a){return new Ext.tree.TreeNode({name:a.name,testCase:a,uiProvider:Ext.test.view.uiProvider,type:"testCase",state:"",passed:"",failed:"",ignored:"",errors:"",message:""})},addCaseNode:function(a,b){b=b||this.root;var c=this.createCaseNode(a);b.appendChild(c)},createTestNode:function(a){return new Ext.tree.TreeNode({name:a.name,test:a,uiProvider:Ext.test.view.uiProvider,type:"test",state:"",passed:"",failed:"",ignored:"",errors:"",message:""})},addTestNode:function(a,b){b=b||this.root;var c=this.createTestNode(a);b.appendChild(c)},getSuiteNode:function(a){var b;this.root.cascade(function(c){if(c.attributes.testSuite===a){b=c;return false}},this);return b},getCaseNode:function(a){var b;this.root.cascade(function(c){if(c.attributes.testCase===a){b=c;return false}},this);return b},getTestNode:function(b,a){var c;b.cascade(function(e){var d=e.attributes;if(d.type=="test"&&d.name===a){c=e;return false}},this);return c},onTestRunnerEvent:function(d,c){var b,e,a;switch(c.type){case"fail":e=this.getCaseNode(c.testCase);e.attributes.state=this.failText;e.ui.setIconElClass("testcase-failed");e.attributes.errors=c.error.getMessage();e.ui.refresh();b=this.getTestNode(e,c.testName);b.attributes.state=this.failText;b.ui.setIconElClass("testcase-failed");b.attributes.errors=c.error.getMessage();b.attributes.message=c.error.getMessage();b.ui.refresh();break;case"pass":e=this.getCaseNode(c.testCase);b=this.getTestNode(e,c.testName);b.attributes.state=this.passText;b.ui.setIconElClass("testcase-passed");b.ui.refresh();break;case"ignore":e=this.getCaseNode(c.testCase);b=this.getTestNode(e,c.testName);b.attributes.state=this.ignoreText;b.ui.refresh();break;case"testcasebegin":b=this.getCaseNode(c.testCase);b.attributes.state="Running...";b.ui.setIconElClass("testcase-running");b.ui.refresh();break;case"testcasecomplete":b=this.getCaseNode(c.testCase);a=c.results;if(a.failed===0){b.attributes.state=this.passText;b.ui.setIconElClass("testcase-passed")}b.attributes.passed=a.passed;b.attributes.failed=a.failed;b.attributes.ignored=a.ignored;b.ui.refresh();break;case"testsuitebegin":b=this.getSuiteNode(c.testSuite);b.ui.setIconElClass("testsuite-running");b.ui.refresh();break;case"testsuitecomplete":b=this.getSuiteNode(c.testSuite);a=c.results;if(a.failed===0){b.attributes.state=this.passText;b.ui.setIconElClass("testsuite-passed")}if(a.failed>0){b.attributes.state=this.failText;b.ui.setIconElClass("testsuite-failed")}b.attributes.passed=a.passed;b.attributes.failed=a.failed;b.attributes.ignored=a.ignored;b.ui.refresh();break}}});Ext.reg("testtree",Ext.test.view.ColumnTree);Ext.test.view.ProgressBar=Ext.extend(Ext.ProgressBar,{testCaseCount:0,initComponent:function(){this.monitorTestRunner();Ext.test.view.ProgressBar.superclass.initComponent.apply(this,arguments)},monitorTestRunner:function(){this.mon(Ext.test.Runner,"begin",this.onBegin,this);this.mon(Ext.test.Runner,"testcasecomplete",this.onTestCaseComplete,this);this.mon(Ext.test.Runner,"testsuitecomplete",this.onTestSuiteComplete,this);this.mon(Ext.test.Runner,"complete",this.onComplete,this)},onBegin:function(){this.testCaseCount=0},onTestCaseComplete:function(){this.testCaseCount++},onTestSuiteComplete:function(){var a=Ext.test.Session.getTestCaseCount();var b=this.testCaseCount/a;this.updateProgress(b,Math.round(100*b)+"% completed...")},onComplete:function(){this.updateProgress(1,"100% completed...")}});Ext.reg("testprogressbar",Ext.test.view.ProgressBar);Ext.test.view.StartButton=Ext.extend(Ext.Button,{text:"Re-run",iconCls:"x-tbar-page-next",initComponent:function(){this.setHandler(this.runTests,this);this.monitorTestRunner();Ext.test.view.StartButton.superclass.initComponent.apply(this,arguments)},runTests:function(){this.disable();Ext.test.Runner.run()},monitorTestRunner:function(){this.mon(Ext.test.Runner,"complete",this.enable,this)}});Ext.reg("teststartbutton",Ext.test.view.StartButton);Ext.test.view.uiProvider=Ext.extend(Ext.tree.TreeNodeUI,{focus:Ext.emptyFn,renderElements:function(d,m,h,o){this.indentMarkup=d.parentNode?d.parentNode.ui.getChildIndent():"";var p=d.getOwnerTree();var l=p.columns;var k=p.borderWidth;var j=l[0];var b=['<li class="x-tree-node"><div ext:tree-node-id="',d.id,'" class="x-tree-node-el x-tree-node-leaf ',m.cls,'">','<div class="x-tree-col" style="width:',j.width-k,'px;">','<span class="x-tree-node-indent">',this.indentMarkup,"</span>",'<img src="',this.emptyIcon,'" class="x-tree-ec-icon x-tree-elbow">','<img src="',m.icon||this.emptyIcon,'" class="',(m.icon?" x-tree-node-inline-icon":""),(m.iconCls?" "+m.iconCls:"x-tree-node-icon"),'" unselectable="on">','<a hidefocus="on" class="x-tree-node-anchor" href="',m.href?m.href:"#",'" tabIndex="1" ',m.hrefTarget?' target="'+m.hrefTarget+'"':"",">",'<span unselectable="on">',d.text||(j.renderer?j.renderer(m[j.dataIndex],d,m):m[j.dataIndex]),"</span></a>","</div>"];for(var e=1,g=l.length;e<g;e++){j=l[e];b.push('<div class="x-tree-col ',(j.cls?j.cls:""),'" style="width:',j.width-k,'px;">','<div class="x-tree-col-text">',(j.renderer?j.renderer(m[j.dataIndex],d,m):m[j.dataIndex]),"</div>","</div>")}b.push('<div class="x-clear"></div></div>','<ul class="x-tree-node-ct" style="display:none;"></ul>',"</li>");if(o!==true&&d.nextSibling&&d.nextSibling.ui.getEl()){this.wrap=Ext.DomHelper.insertHtml("beforeBegin",d.nextSibling.ui.getEl(),b.join(""))}else{this.wrap=Ext.DomHelper.insertHtml("beforeEnd",h,b.join(""))}this.elNode=this.wrap.childNodes[0];this.ctNode=this.wrap.childNodes[1];var f=this.elNode.firstChild.childNodes;this.indentNode=f[0];this.ecNode=f[1];this.iconNode=f[2];this.anchor=f[3];this.textNode=f[3].firstChild},refresh:function(){var c=this.node;if(!c.rendered){return}var l=c.getOwnerTree();var j=c.attributes;var h=l.columns;var b=c.ui.getEl().firstChild;var m=b.childNodes;for(var e=1,f=h.length;e<f;e++){var g=h[e].dataIndex;var k=(j[g]!=null)?j[g]:"";if(h[e].renderer){k=h[e].renderer(k,c)}m[e].firstChild.innerHTML=k}},setIconElClass:function(b){var c=this.node;if(!c.rendered){c.attributes.iconCls=b;return}var a=this.getIconEl();a.className=b}});