JBoss EAP 6.1 (AS 7.2) using WebSocket alpha extension + jQuery websockets

Tested with Windows 7, 64-bit, EAP 6.1.Alpha, Oracle JDK 7

Build with mvn clean package, deploy with mvn jboss-as:deploy.

Changes needed to vanilla JBoss configuration:

 - native="true" on domain:web section in standalone.xml/domain.xml
