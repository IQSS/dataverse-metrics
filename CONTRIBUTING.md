Please feel free to contribute ideas, bug reports, documentation, code, and anything else that comes to mind!

Running your HTML through [tidy][] using the provided config file is appreciated. Here is a suggestion of how to run `tidy`:

    tidy -config tidyconfig.txt -file errors.txt -modify index.html

Running your Javascript through [js-beautify][] is appreciated:

    js-beautify --indent-size=4 -n --replace plots.js

If you would like to run your code through jshint ([2.6.3][] for now), this command is suggested:

    java -jar rhino-1.7.9.jar jshint-rhino.js plots.js undef=true,maxerr=999

Running your Python through [flake8][] is appreciated. Some day it would be nice to use [Black][].

Please run tests with both `python test.py` (Python 2) and `python3 test.py` (Python 3). Both versions of Python are tested at https://travis-ci.org/IQSS/dataverse-metrics

[tidy]: http://www.html-tidy.org
[js-beautify]: https://pypi.org/project/jsbeautifier/
[2.6.3]: https://github.com/jshint/jshint/issues/2308
[flake8]: https://pypi.org/project/flake8/
[Black]: https://github.com/ambv/black
