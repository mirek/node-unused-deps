(function() {
  var deps, endsWithAny, fs, head, isExec, isNodeish, path, requires, scanRequires, unused;

  fs = require('fs');

  path = require('path');

  endsWithAny = function(a, bs) {
    return bs.some(function(b) {
      return a.slice(-b.length) === b;
    });
  };

  requires = function(src) {
    var m, r, re;
    re = /(import.*?from|require|loadNpmTasks)[\( ]+['"]([^\.][^'"]+)/g;
    r = [];
    while (m = re.exec(src)) {
      r.push(m[2].split('/')[0]);
    }
    return r;
  };

  head = function(at) {
    try {
      return fs.readFileSync(at, {
        encoding: 'utf8',
        start: 0,
        end: 256
      }).slice(0, 256);
    } catch (_error) {
      return '';
    }
  };

  isExec = function(at, stat) {
    if (stat == null) {
      stat = null;
    }
    if (/^win/.test(process.platform)) {
      return true;
    } else {
      return (stat != null ? stat : fs.statSync(at)).mode | 0x49;
    }
  };

  isNodeish = function(at, stat) {
    if (endsWithAny(at, ['.coffee', '.js', '.es', '.es6'])) {
      return true;
    } else {
      return isExec(at, stat) && /node|coffee/.test(head(at));
    }
  };

  scanRequires = function(at, map, root) {
    var e, i, len, ref, stat;
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
    if (stat.isFile() && isNodeish(at, stat)) {
      ref = requires(fs.readFileSync(at, {
        encoding: 'utf8'
      }));
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        map[e] = true;
      }
    }
    if (stat.isDirectory() && (at !== '.git' && at !== '.svn' && at !== '.hg' && at !== '.idea' && at !== 'node_modules' && at !== 'bower_components')) {
      fs.readdirSync(at).forEach(function(e) {
        return scanRequires(path.join(at, e), map, false);
      });
    }
    if (root) {
      return Object.keys(map).sort();
    }
  };

  deps = function(at, envs) {
    var dep, i, j, json, k, len, len1, r, ref, ref1;
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
    for (i = 0, len = envs.length; i < len; i++) {
      k = envs[i];
      ref1 = Object.keys((ref = json[k]) != null ? ref : {});
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dep = ref1[j];
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
    deps: deps,
    endsWithAny: endsWithAny,
    isNodeish: isNodeish,
    requires: requires,
    scanRequires: scanRequires,
    unused: unused
  };

}).call(this);
