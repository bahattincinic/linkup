/usr/bin/mongod --smallfiles --nojournal  &

RET=1
while [[ RET -ne 0 ]]; do
    echo "=> Waiting for confirmation of MongoDB service startup"
    sleep 3
    mongo admin --eval "help" >/dev/null 2>&1
    RET=$?
done

echo "=> Creating an admin user with a admin password in MongoDB"
mongo admin --eval "db.createUser({user: 'admin', pwd: 'admin', roles: [ 'root' ] });"
mongo admin --eval "db.shutdownServer();"