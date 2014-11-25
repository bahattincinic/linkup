#!/usr/bin/env python
import os
import sys
import simplejson as json
from subprocess import call, check_output
from fabric.colors import (green, red, cyan, magenta, yellow)


def run(command):
  assert command
  out = check_output(command.split(' '))
  return [x for x in out.split('\n') if x]

def load_config():
  config = {}

  with open('container.json', 'r') as f:
    config = json.loads(f.read())
  return config

def scan_container(container_name):
  print cyan('scan for container: %s' % container_name)

  scan = 'sudo docker ps -a'
  out = run(scan)
  for x in xrange(1, len(out)):
    line = out[x]
    if line:
      parsed = [a for a in line.split(' ') if a]
      if parsed[-1] == container_name:
        return True
  return False

def scan_image(image_name):
  print cyan('scan for image: %s' % image_name)

  scan = 'sudo docker images'
  out = run(scan)
  for x in xrange(1, len(out)):
    if out[x]:
      line = [a for a in out[x].split(' ') if a][0]
      if line == image_name:
        return True
  return False

def remove_image(image_name):
  command = 'sudo docker rmi %(image_name)s'  % {'image_name': image_name}
  return run(command)

def remove_container(container_name):
  print cyan('return for container: %s' % container_name)
  command = 'sudo docker rm %s' % container_name
  return run(command)

def build_image(image_name):
  print cyan('build image: %s' % image_name)
  command  = 'sudo docker build -t %s .' % image_name
  return call(command.split(' '))

def run_container(config):
  command = config['run'] % config
  print yellow(command)
  return run(command)

def clean_images():
  command = "sudo docker images"
  out = run(command)
  for x in xrange(0, len(out)):
    line = out[x]
    if not line:
      continue
    words = [a for a in line.split(' ') if a]
    print yellow(words)
    del_command = "sudo docker rmi %(image_id)s"
    if words[0] == words[1] == '<none>':
      run(del_command % {'image_id': words[2]})
      print red('del')


def bundle(config):
  if not (config and config.get('root') and config.get('bundle_name')):
    print red('root or config missin')
    return

  current = os.getcwd()
  os.chdir(config.get('root'))
  bundle = 'meteor bundle %s' % config.get('bundle_name')
  run(bundle)
  os.chdir(current)
  print red('done bundle')


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
    bundle(config)
  else:
    if scan_container(config['container_name']):
      print red('container found ..')
      remove_container(config['container_name'])

    # if scan_image(config['image_name']):
    #   print red('image found, removing..')
    #   remove_image(config['image_name'])

    # finally build image
    build_image(config['image_name'])

