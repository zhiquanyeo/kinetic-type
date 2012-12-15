require.config({
	urlArgs: 'cb=' + Math.random(),
	paths: {
		jasmine: '../tests/lib/jasmine/jasmine',
		'jasmine-html': '../tests/lib/jasmine/jasmine-html',
		spec: '../tests/spec/',
	},
	shim: {
		jasmine: {
			exports: 'jasmine'
		},
		'jasmine-html': {
			deps: ['jasmine'],
			exports: 'jasmine'
		}
	}
});

require(['jasmine-html'],
function(jasmine) {
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();
	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	var specs = [];

	specs.push('spec/core/ConstraintContainerSpec');
	specs.push('spec/core/TimelineSpec');

	require(specs, function() {
		jasmineEnv.execute();
	});
});