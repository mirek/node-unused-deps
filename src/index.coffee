
fs = require 'fs'
path = require 'path'

# Check if string ends with at least one of provided suffixes.
endsWithAny = (a, bs) ->
  bs.some (b) -> a[-b.length..-1] is b

# Returns a list of requires in source file by naive regex scan of requires
# and grunt's loadNpmTasks.
requires = (src) ->
  re = /(require|loadNpmTasks)[\( ]+['"]([^\.][^'"]+)/g
  r = []
  while m = re.exec src
    r.push m[2].split('/')[0] # First component only ('foo/bar' -> 'foo')
  r

# Recursively scan all coffee and js files returning used requires.
scanRequires = (at = '.', map = {}, root = true) ->
  stat = fs.statSync at

  if stat.isFile() and endsWithAny at, [ '.coffee', '.js' ]
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
  endsWithAny
  requires
  scanRequires
  deps
  unused
}
