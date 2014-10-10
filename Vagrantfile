# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

# Timezone seems unbelievably hard to get right automatically, so setting it ourselves manually
timezone = 'Europe/Helsinki'

# We use Omnibus for our Chef integration, so checking it at this point
unless Vagrant.has_plugin?("vagrant-omnibus")
  raise 'vagrant-omnibus is required for chef support, but not installed'
end

# Below are some scripts that are used later on (or not)

# First one is a script to download JBoss EAP source code and build EAP based on it

$if_not_exists_build_eap_script = <<SCRIPT
if [ ! -f /vagrant/jboss-eap-6.1.0.zip ]; then
  wget https://github.com/hasalex/eap-build/archive/master.zip -O eap-build-master.zip
  unzip eap-build-master.zip
  cd eap-build-master
  ./build-eap.sh 6.1.0
  mv dist/*.zip /vagrant
  cd ..
  rm -rf eap-build-master*
fi
SCRIPT

# Then there is a snippet to download source code for native connectors and build them
# It's not used since prebuilt binaries work for our case

#$native_connectors_build_and_install_script = <<SCRIPT
#if [ ! -f /vagrant/jboss-native-2.0.10-linux2-x64.tar.gz ]; then
#  wget http://downloads.jboss.org/jbossnative/2.0.10.GA/jboss-native-2.0.10-src-ssl.tar.gz
#  tar zxvf jboss-native-2.0.10-src-ssl.tar.gz
#  cd jboss-native-2.0.10-src-ssl
#  export JAVA_HOME=/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.65.x86_64
#  bash build.sh 
#  mv output/*.tar.gz /vagrant
#  cd ..
#  rm -rf jboss-native-2.0.10-src-ssl
#  rm -f jboss-native-2.0.10-src-ssl.tar.gz
#fi
#sudo tar zxvf jboss-native-2.0.10-linux2-x64.tar.gz
#cp bin/native/* /opt/jboss/modules/system/layers/base/org/jboss/as/web/main/lib/linux-x86_64
#rm -rf bin
#rm -rf licenses
#sudo chown -R jboss:jboss /opt/jboss/modules/system/layers/base/org/jboss/as/web/main/*
#SCRIPT

# Snippet to get prebuilt native connector binaries and install them

$install_prebuilt_native_script = <<SCRIPT
if [ ! -f /vagrant/jboss-native-2.0.10-linux2-x64-ssl.tar.gz ]; then
  wget http://downloads.jboss.org/jbossnative//2.0.10.GA/jboss-native-2.0.10-linux2-x64-ssl.tar.gz
fi
tar xzvf jboss-native-2.0.10-linux2-x64-ssl.tar.gz
mkdir -p /opt/jboss/modules/system/layers/base/org/jboss/as/web/main/lib/linux-x86_64
cp bin/native/* /opt/jboss/modules/system/layers/base/org/jboss/as/web/main/lib/linux-x86_64
rm -rf bin
rm -rf licenses
chown -R jboss:jboss /opt/jboss/modules/system/layers/base/org/jboss/as/web/main/*
SCRIPT

# Actual Vagrant stuff begins at this point

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "chef/centos-6.5"

  # These would be used if we want to expose our JBoss instance outside our box,
  # but we do not

  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 9990, host: 9990

  # This we need to be able to deploy using Maven
  config.vm.network "forwarded_port", guest: 9999, host: 9999

  # GUI settings for testing
  # Needs more memory than the default
  config.vm.provider :virtualbox do |vb|
    vb.gui = true
  end

  # Update the timezone to match host timezone
  config.vm.provision :shell, :privileged => true, :inline => "echo \"#{timezone}\" | tee /etc/sysconfig/clock && yum reinstall tzdata -y"

  # Needed tools for compilation
  config.vm.provision :shell, :privileged => true, :inline => "yum install unzip patch java-1.7.0-openjdk java-1.7.0-openjdk-devel -y"

  # Optional tools I used for development
  # config.vm.provision :shell, :privileged => true, :inline => "yum install elinks nano -y"

  # GUI
  config.vm.provision :shell, :privileged => true, :inline => "yum groupinstall \"X Window System\" \"Desktop\" \"Graphical Internet\" -y"

  # Firefox browser for testing
  config.vm.provision :shell, :privileged => true, :inline => "yum install firefox -y"
  
  # Download and build EAP .zip if needed
  config.vm.provision :shell, :privileged => false, :inline => $if_not_exists_build_eap_script

  # Use Chef to install EAP
  config.omnibus.chef_version = :latest

  config.vm.provision "chef_solo" do |chef|
    #chef.log_level = :debug
    #chef.arguments = '-l debug'

    # To fix ssl verification
    # See http://stackoverflow.com/questions/22991561/chef-solo-ssl-warning-when-provisioning
    chef.custom_config_path = "Vagrantfile.chef"

    chef.cookbooks_path = "chef-recipes/cookbooks"
    chef.data_bags_path = "chef-recipes/data_bags"
    chef.add_recipe "jboss-eap-preconfigured"
  end

  # Native JBoss connectors: Download source code, compile it and install them
  # Alternative to using prebuilt binaries, so commented out

  #config.vm.provision :shell, :privileged => false, :inline => $native_connectors_build_and_install_script

  # Native JBoss connectors: Download prebuild binaries and install them
  # Faster alternative to the above

  config.vm.provision :shell, :privileged => true, :inline => $install_prebuilt_native_script

  # Start EAP

  config.vm.provision :shell, :privileged => true, :inline => "service jboss start"

  # Enable JBoss listening interface outside VM
  # Our Maven is outside, so we want to enable this

  # Note that without the colon reload is synchronized (https://bugzilla.redhat.com/show_bug.cgi?id=908955)

  config.vm.provision :shell, :privileged => true, :inline =>
     '/opt/jboss/bin/jboss-cli.sh --user=admin --password=adminpass1! -c --commands="'+
      '/interface=unsecure:remove,'+
      '/interface=unsecure:add(any-address=true),'+
      '/socket-binding-group=standard-sockets/socket-binding=http:write-attribute(name=interface, value=unsecure),'+
      '/socket-binding-group=standard-sockets/socket-binding=management-native:write-attribute(name=interface, value=unsecure),'+
      '/socket-binding-group=standard-sockets/socket-binding=management-http:write-attribute(name=interface, value=unsecure),'+
      '/socket-binding-group=standard-sockets/socket-binding=management-https:write-attribute(name=interface, value=unsecure)"'

  # Enable native interface (APR) and reload JBoss
  # user + pass are specified in jboss-eap-preconfigured chef script

  config.vm.provision :shell, :privileged => true, :inline =>
     '/opt/jboss/bin/jboss-cli.sh --user=admin --password=adminpass1! -c --commands="'+
        '/subsystem=web:write-attribute(name=native,value=true)"'

  config.vm.provision :shell, :privileged => true, :inline => "service jboss restart"

end
