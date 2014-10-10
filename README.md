#JBoss EAP 6.1 (AS 7.2) using WebSocket alpha extension + jQuery + websockets

Requirements:
JBoss AS 7.1.2 or later + JBoss Native connectors enabled + Maven + WebSocket-supporting browser such as Chrome

Tested with
 - Windows 7 64-bit, JBoss EAP 6.1.Alpha, Oracle JDK 7
 - Centos 6.5 64-bit, JBoss EAP 6.1, Oracle JDK 7, running on VirtualBox

There are two ways to run this demo, either set up JBoss yourself, deploy there and use
your regular browser (Chrome or Firefox) or use Vagrant script to set up JBoss environment
for you in a VirtualBox box and deploy there. First one is recommended, but if you're having
difficulties to set it up you can try the automated script way.

## Configuring your JBoss instance yourself

If you go with setting up JBoss yourself, often the only change needed to vanilla JBoss
configuration is that APR (Apache Portable Runtime) needs to be enabled.
It should be enabled with changing:

```xml
<subsystem xmlns="urn:jboss:domain:web:1.1"
          default-virtual-server="default-host" native="false">
```
to:

```xml
<subsystem xmlns="urn:jboss:domain:web:1.1"
          default-virtual-server="default-host" native="true">
```
in standalone.xml / domain.xml

That should be it, as the native connectors *should* be packaged with the installation out of the box.
After that you can start your JBoss, issue `mvn clean package jboss-as:deploy -Djboss-as.username=YOURUSERNAME
-Djboss-as.password=YOURPASS`, open your browser and navigate to [http://localhost:8080/websocket-web-app/](http://localhost:8080/websocket-web-app/)

If on startup you get an error like this:

```
21:27:30,434 INFO  [org.apache.catalina.core] (MSC service thread 1-10) JBWEB001065: The native library which allows optimal
performance in production environments was not found on the java.library.path
```

check for the folder "org/jboss/as/web/main/lib" within your JBoss modules folder. It should list your
current architecture as a subfolder, containing native connectors for your platform. If lib folder is
missing - it is missing at least if you build your JBoss server yourself - you need to retrieve and instal
native connectors as well.

Also, for some environments, such as ARM architecture, native connectors are not available OOB.

If you need to install native connectors yourself, you should first try one of the [binaries provided for
download](http://www.jboss.org/jbossweb/downloads.html) and if that is not an option or doesn't work,
compile them from source code. To compile, download sources from http://www.jboss.org/jbossweb/downloads.html ->
JBoss Web Native Connectors -> source tarball, and follow the compiling and installing steps
given here: https://community.jboss.org/wiki/JbosswebBuildNative.

It's been reported in [issue #6](https://github.com/eis/jboss-websocket-demo/issues/6) that native libraries
need to be installed separately on OSX as well.

## Using Vagrant script to create a VM for you and run it there

Requirements for this:
 - [Vagrant](https://www.vagrantup.com/) installed
 - [VirtualBox](https://www.virtualbox.org/) installed
 - Vagrant-omnibus plugin for Vagrant (Installing: `vagrant plugin install vagrant-omnibus`)
 - Support for 64-bit VMs (often means 64-bit host OS + virtualization support turned on from BIOS)
 - 500MB memory to spare to throw to VM

Recommended steps:
 - download JBoss EAP 6.1 and save the downloaded jboss-eap-6.1.0.zip to the same folder as this file (has to be exactly that file!)
 - run `vagrant up` (will take some time, 30+ minutes)
 - run `mvn clean package jboss-as:deploy -Djboss-as.username=admin -Djboss-as.password=adminpass1!`
 - Switch to VM window
 - Login with vagrant/vagrant (the black screen you see is just a screen saver, it'll go away when you type)
 - Start graphical window system with `startx`
 - Start firefox with firefox icon on the top of the screen (if you don't have a mouse cursor, restart the VM. Machine -> Reset.)
 - Navigate to [http://localhost:8080/websocket-web-app/](http://localhost:8080/websocket-web-app/)

You can also not download JBoss EAP yourself, in which case the script will download the source codes and build the EAP for you.
This is slow though. It takes about an hour on my machine. The reason the script doesn't just download the binary is JBoss EAP
licensing preventing that. However, building it from source code should be ok. It only build it once, after which it leaves the
built .zip file in this folder.

Reason for using a browser within VM is that VirtualBox seems to have issues with exposing WebSockets outside VM. Regular
HTTP traffic works just fine.