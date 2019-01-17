pid=`ps -ef|grep node|grep "index.js"|grep -v grep|awk -F " " '{print $2}'`
kill -9 $pid
nohup node index.js &
