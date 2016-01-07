FROM        centos:centos6

RUN         rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

COPY 	    bb8-server.js /server

RUN         yum upgrade -y
RUN         yum install -y npm \
&& npm -g install commander cylon cylon-ble cylon-sphero \
&& rm -rf /var/cache/yum \
&& rm -rf /usr/lib/locale \
&& rm -rf /usr/lib/gcc \
&& rm -rf /usr/share/locale

EXPOSE      ${PORT}
ENTRYPOINT  ["node", "/server/bb8-server.js"]
