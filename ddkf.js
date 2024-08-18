
npm install eslint --save-dev
 
npx eslint --init
 
for html report
 
npm install eslint-html-reporter --save-dev
 
inside package.json 
 
scripts
"lint":"eslint . -f node_modules/eslint-html-reporter/reporter.js -o eslint-report.html"
 
