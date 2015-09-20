A not-so opinionated static site generator.

## Stuff installed:

- [Gulp.js](http://gulpjs.com) for automation and compiling.
- [Modernizr](http://modernizr.com) for keeping browsers in check.
- [Normalize](http://necolas.github.io/normalize.css) to get your styles going without a heavy framework.

## Pre-compiled languages

- [Swig](http://paularmstrong.github.io/swig) as the official templating language.
- [Sass](http://sass-lang.com) as the official css pre-processing language.
- [Coffeescript](http://coffeescript.org) for when you need a break from JavaScript.

## Stuff that has to be installed

- [Compass](http://compass-style.org) for sprite building, and other fun stuff with Sass.

## Software used

- [Brackets](http://brackets.io) the official text editor for this repo.
- [Node.js](http://nodejs.org) because you can't run Gulp.js without it.

## How to use and configure
### to run it
```bash
npm install
```
```bash
npm gulp
```
Use files in the `dev` folder.

### to deploy
- Create a repo subtree, using `git subtree push --prefix build origin gh-pages`
- Configure the [gulp-gh-pages](https://github.com/rowoot/gulp-gh-pages) plugin in the gulpfile to point to the repo.
- Use the task `gulp deploy`. It will send the contents of the build folder to Github pages.
- The URL of the project will be at `username.github.io/repo`.

## Where to get it
- [Repository](https://github.com/harrypujols/gulp)
- [Download](https://github.com/harrypujols/gulp/releases)
