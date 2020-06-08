install_subdir('quests', install_dir: pkgdatadir)

session_bus_services_dir = get_option('session-bus-services-dir')
if session_bus_services_dir == ''
   session_bus_services_dir = dbus_dep.get_pkgconfig_variable('session_bus_services_dir')
endif

conf = configuration_data()
conf.set('bindir', join_paths(get_option('prefix'), get_option('bindir')))

configure_file(
    input: 'com.hack_computer.Libquest.service.in',
    output: 'com.hack_computer.Libquest.service',
    install: true,
    install_dir: session_bus_services_dir,
    configuration: conf
)
