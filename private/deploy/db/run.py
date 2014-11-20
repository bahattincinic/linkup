#!/usr/bin/env python
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

def run_container(config):
  params = {
    "container_name": config['container']['name'],
    "image_name": config['image']['name'],
    "command": config['run']['command']
  }

  command = 'sudo docker run --name %(container_name)s %(image_name)s %(command)s' % params
  print yellow(command)
  return run(command)

if __name__ == "__main__":
  run_container(load_config())
