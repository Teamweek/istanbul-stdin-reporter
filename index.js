#!/usr/bin/env node

var JSONStream = require('JSONStream');
var istanbul = require('istanbul');
var yargs = require('yargs');

var argv = yargs
  .usage('Usage: $0 [options]')
  .option('f', {
    alias: 'format',
    default: 'html',
    describe: 'Report format'
  })
  .option('o', {
    alias: 'output',
    default: 'coverage',
    describe: 'Output directory'
  })
  .help()
  .argv;

var collector = new istanbul.Collector();

var reporter = new istanbul.Reporter(null, argv.o);
reporter.add(argv.f);

var stream = JSONStream.parse('*');

stream.on('data', function(data) {
  collector.add(data);
  console.log('Collected coverage data');
});

stream.on('end', function() {
  reporter.write(collector, false, function(err) {
    if (err) {
      console.error('Failed to write coverage report');
      console.error(err);
    } else {
      console.log('Finished writing coverage report');
    }
  });
});

process.stdin.pipe(stream);
console.log('Waiting for input...');
