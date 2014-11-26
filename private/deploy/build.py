#!/usr/bin/env python
import os
import sys
import shutil
from subprocess import call, check_output
from fabric.colors import (green, red, cyan, magenta, yellow)
from tivor.action import Action
from tivor.utils import run_command, load_config


class ScanContainerAction(Action):
  def action(self):
    """
      Scans for active containers and removes them
      if exists with the same name
    """
    container_name = self.config.get('container_name')
    print cyan('scan for container: %s' % container_name)

    scan = "sudo docker ps -a"
    out = run_command(scan)
    for x in xrange(1, len(out)):
      line = out[x]
      if line:
        parsed = [a for a in line.split(' ') if a]
        if parsed[-1] == container_name:
          print cyan('return for container: %s' % container_name)
          command = "sudo docker rm %s" % container_name
          return run_command(command)
    return False


class BuildAppMixin(object):
  def action(self):
    image_name = self.config.get('image_name')
    print cyan('Build image: %s' % image_name)
    command  = 'sudo docker build -t %s .' % image_name
    return call(command.split(' '))


class BuildImage(BuildAppMixin, Action):
  before_actions = ['ScanContainerAction']


class BuildAppImageAction(BuildAppMixin, Action):
  before_actions = ['ScanContainerAction', 'BundleAction']
  after_actions = ['ClearBundleAction']


class BundleAction(Action):
  def action(self):
    assert (config and config.get('root') and config.get('bundle_name'))

    current = os.getcwd()
    # check for old bundle dir
    if os.path.isdir('bundle'):
      shutil.rmtree('bundle')

    os.chdir(config.get('root'))
    # check for old tgz file
    if os.path.exists(config.get('bundle_name')):
      os.remove(config.get('bundle_name'))

    bundle = "meteor bundle %s" % config.get('bundle_name')
    print yellow('extract bundle to %s' % current)
    extract_bundle = "tar xvfz %s -C %s" % (config.get('bundle_name'), current)
    run_command(bundle)
    print yellow(extract_bundle)
    run_command(extract_bundle)
    os.chdir(current)
    print red('done bundle')
    return


class RunContainerAction(Action):
  def action(self):
    command = self.config['run'] % self.config
    print yellow(command)
    return run_command(command)


class CleanImagesAction(Action):
  def action(self):
    command = "sudo docker images"
    out = run_command(command)
    for x in xrange(0, len(out)):
      line = out[x]
      if not line:
        continue
      words = [a for a in line.split(' ') if a]
      print yellow(words)
      del_command = "sudo docker rmi %(image_id)s"
      if words[0] == words[1] == '<none>':
        run_command(del_command % {'image_id': words[2]})
        print red('del')
    return


class ClearBundleAction(Action):
  def action(self):
    print yellow('Will clear bundle here %s' % os.getcwd())
    shutil.rmtree('bundle')



if __name__ == "__main__":
  config = load_config()
  print magenta(config)

  # search for run
  if 'run' in sys.argv:
    RunContainerAction(config).run()
  elif 'clean' in sys.argv:
    print red('clean')
    CleanImagesAction(config).run()
  elif 'bundle' in sys.argv:
    print red('bundle')
    BundleAction(config).run()
  else:
    BuildImage(config).run()