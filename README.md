JBoss EAP 6.1 (AS 7.2) using WebSocket alpha extension + jQuery websockets

Tested with Windows 7, 64-bit, EAP 6.1.Alpha, Oracle JDK 7

Build with mvn clean package, deploy with mvn jboss-as:deploy.

Change needed to vanilla JBoss configuration:

APR (Apache Portable Runtime) needs to be enabled, it should be enabled with changing:

  <subsystem xmlns="urn:jboss:domain:web:1.1"
          default-virtual-server="default-host" native="true">

to:

  <subsystem xmlns="urn:jboss:domain:web:1.1"
          default-virtual-server="default-host" native="true">

in standalone.xml / domain.xml

That's it. For some unusual environments, such as ARM architecture, native connectors are not available OOB.
If this is the case, you'll get an error message about missing libraries when starting up JBoss with
native enabled. In that case, they can be compiled from source code (download: http://www.jboss.org/jbossweb/downloads.html ->
JBoss Web Native Connectors -> source tarball, compiling: https://community.jboss.org/wiki/JbosswebBuildNative).