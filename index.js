#!/usr/bin/env node

var readline = require('readline');
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

var rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', function(chunk) {
  var data;

  try {
    data = JSON.parse(chunk);
  } catch (err) {
    console.error('Input is not valid JSON');
    return;
  }

  collector.add(data);

  console.log('Collected coverage data');
});

rl.on('close', function() {
  reporter.write(collector, false, function(err) {
    if (err) {
      console.error('Failed to write coverage report');
      console.error(err);
    } else {
      console.log('Finished writing coverage report');
    }
  });
});

console.log('Waiting for input...');
