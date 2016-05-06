command util

## install

> npm install tailor-cmd -g

## configuration

```
//set
tailor set {item} {key=value}

//unset
tailor unset {item} {key}
```

## vagrant

set the boxes repo

> tailor set vagrant repo=path

global order 

```
tailor vagrant global-staus
tailor vagrant box list
...
```

operate the box

```
tailor vagrant init -boxname
tailor vagrant up -boxname
tailor vagrant halt -boxname
...
```

## nginx

set the nginx path

> tailor set nginx path=path

proxy the order 

```
tailor nginx
tailor nginx -s quit
...
```

## git

proxy the order

> tailor git [commands...]

## project

set repo and lib path

> tailor set project repo=path
> tailor set project lib=path

* create project

> tailor create name --[static|node] --[sass|less]? --es6?

* add project

> tailor add name url?

* remove project

> tailor remove name -f?

* use project

> tailor use project name

* compile sass to css

> tailor sass

* compile less to css

> tailor less

* compile js by webpack

> tailor webpack

* compress css or js or both

> tailor compress --[css|js|both]?

* compress img by tinypng

set tinykey

> tailor set tinypng key=tinykey

usage

> tailor tinypng

* zip current project or another

> tailor zip name?

* watch file change on current project or another

> tailor watch name?

* run a local server for current project or another

> tailor server name?
