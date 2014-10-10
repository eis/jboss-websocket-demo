node.override['jboss-eap']['version'] = "6.1.0"
node.override['jboss-eap']['install_path'] = '/opt'
node.override['jboss-eap']['package_url'] = 'file:///vagrant/jboss-eap-6.1.0.zip'
node.override['jboss-eap']['checksum'] = '5B1A9E0FA09BD2F62A8E243DB3AA373E724457ACC65E9BF5F7128D8CB4F4413D'
node.override['jboss-eap']['log_dir'] = '/var/log/jboss'
node.override['jboss-eap']['jboss_user'] = 'jboss'
node.override['jboss-eap']['jboss_group'] = 'jboss'
node.override['jboss-eap']['admin_user'] = "admin" # admin will not do due to grep in recipes/default.rb
node.override['jboss-eap']['admin_passwd'] = "adminpass1!" # Note the password has to be >= 8 characters, one numeric, one special
node.override['jboss-eap']['start_on_boot'] = true
include_recipe "jboss-eap"