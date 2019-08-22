module.exports = `const _import = require('@/router/' + process.env.NODE_ENV)

let routes = [
  {
    path: "/{{name}}",
    name: "",
    component: _import("{{page}}/index"),
    children: [
      {{list}}
    ]
  },
  {
    path: "/",
    redirect: "/{{name}}"
  }
];

export default routes
`;

