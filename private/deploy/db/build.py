#!/usr/bin/env python
import simplejson as json
from subprocess import call, check_output
from fabric.colors import (green, red, cyan, magenta, yellow)


def run(command):
  assert command
  out = check_output(command.split(' '))
  assert out
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

if __name__ == "__main__":
  config = load_config()
  print config
  assert (config['container'])

  if scan_container(config['container']['name']):
    print red('container found ..')
    remove_container(config['container']['name'])

  if scan_image(config['image']['name']):
    print red('image found, removing..')
    remove_image(config['image']['name'])

  # finally build image
  build_image(config['image']['name'])
