(function() {
  var deps, endsWithAny, fs, path, requires, scanRequires, unused;

  fs = require('fs');

  path = require('path');

  endsWithAny = function(a, bs) {
    return bs.some(function(b) {
      return a.slice(-b.length) === b;
    });
  };

  requires = function(src) {
    var m, r, re;
    re = /(require|loadNpmTasks)[\( ]+['"]([^\.][^'"]+)/g;
    r = [];
    while (m = re.exec(src)) {
      r.push(m[2].split('/')[0]);
    }
    return r;
  };

  scanRequires = function(at, map, root) {
    var e, stat, _i, _len, _ref;
    if (at == null) {
      at = '.';
    }
    if (map == null) {
      map = {};
    }
    if (root == null) {
      root = true;
    }
    stat = fs.statSync(at);
    if (stat.isFile() && endsWithAny(at, ['.coffee', '.js'])) {
      _ref = requires(fs.readFileSync(at, {
        encoding: 'utf8'
      }));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        map[e] = true;
      }
    }
    if (stat.isDirectory() && (at !== 'node_modules')) {
      fs.readdirSync(at).forEach(function(e) {
        return scanRequires(path.join(at, e), map, false);
      });
    }
    if (root) {
      return Object.keys(map).sort();
    }
  };

  deps = function(at, envs) {
    var dep, json, k, r, _i, _j, _len, _len1, _ref, _ref1;
    if (at == null) {
      at = 'package.json';
    }
    if (envs == null) {
      envs = ['dependencies', 'devDependencies'];
    }
    r = {};
    json = JSON.parse(fs.readFileSync(at, {
      encoding: 'utf8'
    }));
    for (_i = 0, _len = envs.length; _i < _len; _i++) {
      k = envs[_i];
      _ref1 = Object.keys((_ref = json[k]) != null ? _ref : {});
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        dep = _ref1[_j];
        r[dep] = true;
      }
    }
    return Object.keys(r).sort();
  };

  unused = function(a, b) {
    var ai, bi, ra, rb;
    ra = [];
    rb = [];
    ai = bi = 0;
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        ai++;
        bi++;
      } else {
        if (a[ai] < b[bi]) {
          ra.push(a[ai++]);
        } else {
          rb.push(b[bi++]);
        }
      }
    }
    while (ai < a.length) {
      ra.push(a[ai++]);
    }
    while (bi < b.length) {
      rb.push(b[bi++]);
    }
    return ra;
  };

  module.exports = {
    endsWithAny: endsWithAny,
    requires: requires,
    scanRequires: scanRequires,
    deps: deps,
    unused: unused
  };

}).call(this);
