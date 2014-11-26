#!/usr/bin/env python
import os
import sys
import shutil
from subprocess import call, check_output
from fabric.colors import (green, red, cyan, magenta, yellow)
from tivor.action import Action
from tivor.utils import run_command, load_config


class ScanContainer(Action):
  def action(self):
    """
      Scans for active containers and removes them
      if exists with the same name
    """
    container_name = self.config.get('container_name')
    print cyan('scan for container: %s' % container_name)

    scan = 'sudo docker ps -a'
    out = run_command(scan)
    for x in xrange(1, len(out)):
      line = out[x]
      if line:
        parsed = [a for a in line.split(' ') if a]
        if parsed[-1] == container_name:
          print cyan('return for container: %s' % container_name)
          command = 'sudo docker rm %s' % container_name
          return run_command(command)
    return False


def scan_image(config):
  image_name = config.get('image_name')
  print cyan('scan for image: %s' % image_name)

  scan = 'sudo docker images'
  out = run_command(scan)
  for x in xrange(1, len(out)):
    if out[x]:
      line = [a for a in out[x].split(' ') if a][0]
      if line == image_name:
        return True
  return False

def remove_image(image_name):
  command = 'sudo docker rmi %(image_name)s'  % {'image_name': image_name}
  return run_command(command)


class BuildAppMixin(object):
  def action(self):
    image_name = self.config.get('image_name')
    print cyan('build image: %s' % image_name)
    command  = 'sudo docker build -t %s .' % image_name
    return call(command.split(' '))


class BuildImage(BuildAppMixin, Action):
  before_actions = ['ScanContainer']


class BuildAppImageAction(BuildAppMixin, Action):
  before_actions = ['ScanContainer', 'BundleAction']
  after_actions = []


class BundleAction(Action):
  before_actions = []
  after_actions = []

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


def run_container(config):
  command = config['run'] % config
  print yellow(command)
  return run_command(command)

def clean_images():
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

def clear_bundle():
  print yellow('will clear bundle here %s' % os.getcwd())
  shutil.rmtree('bundle')


if __name__ == "__main__":
  config = load_config()
  print magenta(config)

  # search for run
  if 'run' in sys.argv:
    run_container(config)
  elif 'clean' in sys.argv:
    print red('clean')
    clean_images()
  elif 'bundle' in sys.argv:
    print red('bundle')
    BundleAction(config).run()
  else:
    BuildImage(config).run()