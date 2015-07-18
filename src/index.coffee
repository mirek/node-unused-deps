
fs = require 'fs'
path = require 'path'

# Check if string ends with at least one of provided suffixes.
endsWithAny = (a, bs) ->
  bs.some (b) -> a[-b.length..-1] is b

# Returns a list of requires in source file by naive regex scan of requires
# and grunt's loadNpmTasks.
requires = (src) ->
  re = /(import.*?from|require|loadNpmTasks)[\( ]+['"]([^\.][^'"]+)/g
  r = []
  while m = re.exec src
    r.push m[2].split('/')[0] # First component only ('foo/bar' -> 'foo')
  r

# We want to be sync so we don't use it, maybe later.
# asyncHead = (at, done) ->
#   r = ''
#   stream = fs.createReadStream at, { start: 0, end: 256 }
#   stream.on 'data', (data) -> r += data
#   stream.on 'error', (err) ->
#     done err
#   stream.on 'end', ->
#     done null, r

# Reads "head" of file (first ~256 bytes).
# TODO: Don't read it twice if start/end doesn't work for readFileSync like it does for createReadStream.
head = (at) ->
  fs.readFileSync(at, { encoding: 'utf8', start: 0, end: 256 })[0...256]

# Check if file is exec on unixy sys, on windows it's always exec.
isExec = (at, stat = null) ->
  if /^win/.test process.platform
    true
  else
    (if stat? then stat else fs.statSync(at)).mode | 0o111

# Returns true if file looks like node/coffee script.
isNodeish = (at, stat) ->
  if endsWithAny(at, [ '.coffee', '.js', '.es', '.es6' ])
    true
  else
    isExec(at, stat) and /node|coffee/.test head(at)

# Recursively scan all coffee and js files returning used requires.
scanRequires = (at = '.', map = {}, root = true) ->
  stat = fs.statSync at

  if stat.isFile() and isNodeish(at, stat)
    for e in requires fs.readFileSync(at, { encoding: 'utf8' })
      map[e] = true

  if stat.isDirectory() and at not in [ '.git', '.svn', '.hg', '.idea', 'node_modules', 'bower_components']
    fs.readdirSync(at).forEach (e) ->
      scanRequires path.join(at, e), map, false

  Object.keys(map).sort() if root

# Return dependencies as defined in package.json file.
deps = (at = 'package.json', envs = [ 'dependencies', 'devDependencies' ]) ->
  r = {}
  json = JSON.parse fs.readFileSync(at, { encoding: 'utf8' })
  for k in envs
    for dep in Object.keys (json[k] ? {})
      r[dep] = true
  Object.keys(r).sort()

# Return one side difference for two sorted arrays.
unused = (a, b) ->
  ra = []
  rb = []
  ai = bi = 0
  while ai < a.length and bi < b.length
    if a[ai] is b[bi]
      ai++
      bi++
    else
      if a[ai] < b[bi]
        ra.push a[ai++]
      else
        rb.push b[bi++]
  ra.push a[ai++] while ai < a.length
  rb.push b[bi++] while bi < b.length
  ra

module.exports = {
  deps
  endsWithAny
  isNodeish
  requires
  scanRequires
  unused
}
