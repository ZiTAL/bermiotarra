#!/usr/bin/python3
# -*- coding: utf-8 -*-

#import sys
#import os
import json

import importlib

path1 = importlib.import_module('os', 'path')
path2 = importlib.import_module('sys', 'path')


script_folder = sys.path[0]
project_folder = script_folder+"/.."
project_folder = os.path.realpath(parent_folder)

os2 = __import__(modulename)

"""
cache =  open('cache.json', 'r')
cache_json = json.load(cache)
"""

print(parent_folder)
