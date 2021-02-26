/**
 * This module provides a cool routing syntax with the function `routeExecuter`.
 * 
 * Tests are written in docstring and can be run using https://github.com/davidchambers/doctest.
 * Use the following command: `doctest scripts/route-resolver.js --module esm`
 */


/**
 *
 * @param {{path: string, func: Function}[]} routes
 * @param {string} queriedPath
 * @param {Function} fallback
 *
 *
 * > routeExecuter([
 * . { path: "/", func: () => "main page"},
 * . { path: "/user", func: () => "user page"},
 * . { path: "/user/:id", func: ({ id }) => "user page of " + id}],
 * . "/", () => "Not found")
 * "main page"
 *
 * > routeExecuter([
 * . { path: "/", func: () => "main page"},
 * . { path: "/user", func: () => "user page"},
 * . { path: "/user/:id", func: ({ id }) => "user page of " + id}],
 * . "/user", () => "Not found")
 * "user page"
 *
 * > routeExecuter([
 * . { path: "/", func: () => "main page"},
 * . { path: "/user", func: () => "user page"},
 * . { path: "/user/:id", func: ({ id }) => "user page of " + id}],
 * . "/user/jjg", () => "Not found")
 * "user page of jjg"
 *
 * > routeExecuter([
 * . { path: "/", func: () => "main page"},
 * . { path: "/user", func: () => "user page"},
 * . { path: "/user/:id", func: ({ id }) => "user page of " + id}],
 * . "/oops", () => "Not found")
 * "Not found"
 *
 */
export function routeExecuter(routes, queriedPath, fallback) {
  const sanitizedQueriedPath = sanitizePath(queriedPath);
  for (const { path, func } of routes) {
    const { matches, routeParams } = doesPathMatch({
      path,
      queriedPath: sanitizedQueriedPath
    })
    if(matches) {
      return func(routeParams);
    }
  }
  return fallback();
}



/**
 *
 * @param {string} path
 * @return {boolean}
 *
 * a path is a string starting with `/` and not finishing by `/`
 *
 * > isValidPath('/user')
 * true
 *
 * > isValidPath('/')
 * true
 * 
 * > isValidPath('')
 * false
 *
 * > isValidPath('/user/:id')
 * true
 *
 * > isValidPath('/user/')
 * false
 *
 * > isValidPath('/user/:id/')
 * false
 *
 * > isValidPath('user')
 * false
 *
 * > isValidPath('user/:id')
 * false
 *
 * > isValidPath('//')
 * false
 *
 */
const isValidPath = (path) => (
  (path.slice(0, 1) ===  '/' && path.slice(-1) !==  '/') ||
  path === '/'
);


/**
 *
 * @param {{path: string; queriedPath: string}}
 * @return {{matches: boolean; routeParams: {[key: string]: any}}}
 *
 * 1/ It handles simple path matching:
 *
 * > doesPathMatch({ path: "/", queriedPath: "/"})
 * { matches: true, routeParams: {} }
 *
 * > doesPathMatch({ path: "/", queriedPath: "/jjg"})
 * { matches: false, routeParams: {} }
 *
 * > doesPathMatch({ path: "/user", queriedPath: "/user"})
 * { matches: true, routeParams: {} }
 *
 * > doesPathMatch({ path: "/user", queriedPath: "/jjg "})
 * { matches: false, routeParams: {} }
 *
 * > doesPathMatch({ path: "/user/settings", queriedPath: "/user/settings"})
 * { matches: true, routeParams: {} }
 *
 * > doesPathMatch({ path: "/user/settings", queriedPath: "/user/oops"})
 * { matches: false, routeParams: {} }
 *
 * 2/ It handle dynamic path matching:
 *
 * > doesPathMatch({ path: "/user/:id", queriedPath: "/user/jjg" })
 * { matches: true, routeParams: { id: "jjg" } }
 *
 * > doesPathMatch({ path: "/user/:id", queriedPath: "/oops/jjg" })
 * { matches: false, routeParams: {} }
 *
 * > doesPathMatch({ path: "/:action/:id", queriedPath: "/up/23300" })
 * { matches: true, routeParams: { action: "up", id: "23300" } }
 *
 * > doesPathMatch({ path: "/:action/:id", queriedPath: "/up/23300/oops" })
 * { matches: false, routeParams: {} }
 *
 *
 * 3/ It raises if `path` or `queriedPath` are "invalid path"
 *
 * > doesPathMatch({ path: "/user", queriedPath: "/user/"})
 * ! TypeError
 *
 * > doesPathMatch({ path: "/user", queriedPath: "user"})
 * ! TypeError
 *
 * > doesPathMatch({ path: "user", queriedPath: "/user"})
 * ! TypeError
 *
 * > doesPathMatch({ path: "/user/", queriedPath: "/user"})
 * ! TypeError
 *
 * 4/ Edge Case
 *
 * > doesPathMatch({ path: "/user/settings", queriedPath: "/user/settings "})
 * { matches: false, routeParams: {} }
 *
 * > doesPathMatch({ path: "/user/settings", queriedPath: "/user/settings/oops"})
 * { matches: false, routeParams: {} }
 *
 * > doesPathMatch({ path: "/:who", queriedPath: "/me"})
 * { matches: true, routeParams: { who: "me"} }
 *
 * > doesPathMatch({ path: "/", queriedPath: "//"})
 * ! TypeError
 *
 */
function doesPathMatch({ path, queriedPath }) {
  if(!isValidPath(path)) throw TypeError(`${path} is not a valid path`)
  if(!isValidPath(queriedPath)) throw TypeError(`${queriedPath} is not a valid path`)

  if (path.split('/').length !== queriedPath.split('/').length) {
    return { matches: false, routeParams: {} }
  }

  const routeParams = {};
  for(const [e1, e2] of zip(path.split('/'), queriedPath.split('/'))) {
    if (e1.slice(0, 1) === ':' && e2 !== '') {
      routeParams[e1.slice(1)] = e2;
      continue
    } else if (e1 === e2) {
      continue
    } else {
      return { matches: false, routeParams: {} }
    }
  }

  return { matches: true, routeParams }
}


/**
 *
 * @param {string} path
 *
 * > sanitizePath("user")
 * "/user"
 *
 * > sanitizePath("/user")
 * "/user"
 *
 * > sanitizePath("/user/")
 * "/user"
 *
 * > sanitizePath("user/")
 * "/user"
 * 
 * > sanitizePath("/")
 * "/"
 */
const sanitizePath = (path) => {
  if (path === '/') return '/'
  let pre = path[0] === '/' ? '': '/';
  let post = path.slice(-1) === '/' ? '': path.slice(-1);
  return `${pre}${path.slice(0, -1)}${post}`
}


/**
 * @param {Array} a
 * @param {Array} b
 * @returns {Array[]}
 *
 * > zip(['x', 'y', 'z'], ['X', 'Y', 'Z'])
 * [['x', 'X'], ['y', 'Y'], ['z', 'Z']]
 *
 * > zip(['x'], ['X'])
 * [['x', 'X']]
 *
 */
const zip = (a, b) => a.map((e, i) => [e, b[i]]);
