## Summary

Report unused npm packages in nodejs project.

## Installation

    [sudo] npm install -g unused-deps

## Usage

Go to your project's root (where `package.json` is stored) and run:

    unused-deps

You should see similar output:

    npm uninstall --save     ansi
    npm uninstall --save     debug
    npm uninstall --save     ejs
    npm uninstall --save-dev faker2
    npm uninstall --save-dev hotnode

An empty result means there are no unused npms in `package.json`.

If you want to skip reporting of unused npms you can list them in a comment
for example in `Gruntfile.coffee` (or `.js`):

    # Skip unused-deps:
    #
    # require 'coffee-script'
    # require 'grunt'
    # require 'grunt-cli'
    # require 'mocha-jenkins-reporter'
    # require 'codo'
    # require 'coffeelint'
    # require 'hotnode'
    # require 'mocha'

# License

    The MIT License (MIT)

    Copyright (c) 2014 Mirek Rusin

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
