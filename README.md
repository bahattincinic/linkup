# reddit score ranking

A starting point for MeteorJS applications. Includes iron-router, Bootstrap 3, Font Awesome, LESS and more.

* [Reddit score updates](http://amix.dk/blog/post/19588)

# Use local mongodb instead of minimongo
set -x MONGO_URL mongodb://localhost:27017/linkup
set -x NODE_OPTIONS '--debug-brk'

### mongodb config (optional)
mongo admin --eval  "db.createUser({user: 'admin', pwd: 'admin', roles: [ 'root' ] });"
# mongo admin --eval "db.createUser({user: 'linkup', pwd: 'linkup', roles: [{ role: 'dbOwner', db: 'linkup' }]});"
mongo admin --eval "db.createUser({user: 'linkup', pwd: 'linkup', roles: [{ role: 'read', db: 'admin' }]});"

### run mongo
/usr/bin/mongod --config /etc/mongod.conf &
