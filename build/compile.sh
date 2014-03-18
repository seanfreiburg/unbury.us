#!/bin/bash

#Advanced Option, goddamn externs
#java -jar compiler.jar --js=../src/Unburyme.js --js=../src/Config.js --js=../src/Date.js --js=../src/Graph.js --js=../src/interface.js --js=../src/LoanApp.js --js=../src/Loan.js --js=../src/ResultBar.js --js=../src/TotalResults.js --js_output_file=../build/unburyme.js --compilation_level=ADVANCED_OPTIMIZATIONS --externs jquery-1.5.externs.js --externs jquery.ui.widget.externs.js

java -jar compiler.jar \
--js_output_file=../js/unburyme.js \
--compilation_level=SIMPLE_OPTIMIZATIONS \
--js=../src/Unburyme.js \
--js=../src/Config.js \
--js=../src/Date.js \
--js=../src/Graph.js \
--js=../src/interface.js \
--js=../src/LoanApp.js \
--js=../src/Loan.js \
--js=../src/ResultBar.js \
--js=../src/TotalResults.js
