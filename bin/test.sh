#!/usr/bin/env bash

echo 'Test build'

printf ' * Test environment=test build'

ember build --environment test --output-path ./tmp/build-test &> log-test.txt
diff --brief ./tmp/build-test/assets/tests.js ./build-tests/fixtures/tests-transformed.js >/dev/null
comp_value=$?

if [ $comp_value -eq 1 ]; then
  echo ' FAILED'
  echo '---------'
  cat log-test.txt

  exit 1001
else
  echo 'OK'
fi
