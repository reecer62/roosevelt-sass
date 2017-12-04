roosevelt-sass
===

[![Greenkeeper badge](https://badges.greenkeeper.io/rooseveltframework/roosevelt-sass.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/rooseveltframework/roosevelt-sass.svg?branch=master)](https://travis-ci.org/rooseveltframework/roosevelt-sass) [![npm](https://img.shields.io/npm/v/roosevelt-sass.svg)](https://www.npmjs.com/package/roosevelt-sass)

[SASS](http://sass-lang.com/) CSS preprocessor support for [Roosevelt MVC web framework](https://github.com/rooseveltframework/roosevelt).

Usage
===

Declare this module as a dependency in your app, for example:

```js
"dependencies": {
  "roosevelt": "*",
  "roosevelt-sass": "*"
}
```

Declare your CSS compiler by passing it as a param to Roosevelt:

```js
"rooseveltConfig": {
  "cssCompiler": {nodeModule: "roosevelt-sass", params: {outputStyle: compressed}}
}
```

See the [node-sass](https://github.com/sass/node-sass#options) repo API docs for documentation on available params.
