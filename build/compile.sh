#!/bin/bash

#Advanced Option, goddamn externs
#java -jar compiler.jar --js=../src/unburyme.js --js=../src/config.js --js=../src/date.js --js=../src/graph.js --js=../src/interface.js --js=../src/loan_app.js --js=../src/loan.js --js=../src/result_bar.js --js=../src/total_results.js --js_output_file=../build/unburyme.js --compilation_level=ADVANCED_OPTIMIZATIONS --externs jquery-1.5.externs.js --externs jquery.ui.widget.externs.js

java -jar compiler.jar \
--js_output_file=../js/unburyme.js \
--compilation_level=SIMPLE_OPTIMIZATIONS \
--js=../src/unburyme.js \
--js=../src/config.js \
--js=../src/date.js \
--js=../src/graph.js \
--js=../src/interface.js \
--js=../src/loan_app.js \
--js=../src/loan.js \
--js=../src/result_bar.js \
--js=../src/total_results.js
