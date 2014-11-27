#!/usr/bin/env python
import os
import sys
import shutil
from subprocess import call, check_output
from fabric.colors import (green, red, cyan, magenta, yellow)
from tivor.action import Action
from tivor.utils import run_command, load_config

DEBUG = False

class CleanImagesAction(Action):
  def action(self):
    command = "sudo docker images"
    out = run_command(command)
    for x in xrange(0, len(out)):
      line = out[x]
      if not line:
        continue
      words = [a for a in line.split(' ') if a]
      if DEBUG: print yellow(words)
      del_command = "sudo docker rmi %(image_id)s"
      if words[0] == words[1] == '<none>':
        run_command(del_command % {'image_id': words[2]})
        if DEBUG: print red('del')
    return


class ClearBundleAction(Action):
  def action(self):
    if DEBUG: print yellow('Will clear bundle here %s' % os.getcwd())
    bundle_name = 'bundle'
    if os.path.exists(bundle_name) and os.path.isdir(bundle_name):
      shutil.rmtree('bundle')


class StopContainerAction(Action):
  def action(self):
    if not (self.config and self.config.get('stop')):
      print red('stop command not defined in container.json config')

    stop = self.config.get('stop') % self.config
    print yellow(stop)
    run_command(stop)


class RemoveContainerAction(Action):
  def action(self):
    """
      Scans for active containers and removes them
      if exists with the same name
    """
    container_name = self.config.get('container_name')
    if DEBUG: print cyan('scan for container: %s' % container_name)

    scan = "sudo docker ps -a"
    out = run_command(scan)
    for x in xrange(1, len(out)):
      line = out[x]
      if line:
        parsed = [a for a in line.split(' ') if a]
        if parsed[-1] == container_name:
          if DEBUG: print cyan('return for container: %s' % container_name)
          stop = "sudo docker stop %s" % container_name
          run_command(stop)
          command = "sudo docker rm -f %s" % container_name
          run_command(command)
          return True
    return False


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


class BuildAppMixin(object):
  def action(self):
    image_name = self.config.get('image_name')
    print cyan('Build image: %s' % image_name)
    command  = 'sudo docker build -t %s .' % image_name
    return call(command.split(' '))


class BuildImageAction(BuildAppMixin, Action):
  preceding_actions = [RemoveContainerAction]


class BuildAppImageAction(BuildAppMixin, Action):
  preceding_actions = [ClearBundleAction, RemoveContainerAction, BundleAction]
  succeeding_actions = [ClearBundleAction]


class RunContainerAction(Action):
  preceding_actions = [RemoveContainerAction]

  def action(self):
    command = self.config['run'] % self.config
    if DEBUG: print yellow(command)
    return run_command(command)


if __name__ == "__main__":
  config = load_config()

  if 'verbose' in sys.argv:
    DEBUG = True
    config['verbose'] = DEBUG

  if DEBUG: print magenta(config)

  if 'run' in sys.argv:
    RunContainerAction(config).run()
  elif 'clean' in sys.argv:
    CleanImagesAction(config).run()
  elif 'stop' in sys.argv:
    StopContainerAction(config).run()
  else:
    if config and config.get('action'):
      eval(config.get('action'))(config).run()
    else:
      BuildImageAction(config).run()
