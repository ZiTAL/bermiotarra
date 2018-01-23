#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from glob import glob
import json

# fitxero danak hartun #

files = []

dir = sys.path[0]+"/.."
dir = os.path.realpath(dir)
dir_resources = []
dir_resources.append(dir+"/berbak")
dir_resources.append(dir+"/esamoldiek")

for i in dir_resources:
	l = glob(i+"/*.md")
	l.sort()
	files = files + l

# ariñautik erabili duzen berbak hartun #

words_cached = []
words_cache_file = sys.path[0]+"/bot.cache"

with open(words_cache_file, 'r') as f:
	words_cached = json.load(f)

# berba / esamolde danak karga #

resources = []

for file in files:
	with open(file, 'r') as f:
		for line in f:
			resource = re.search("^##\s([^#]+)\s##", line)
			if resource != None:
				resources.append(resource.group(1))

# ariñautik erabili duzenak kendu #

for i in words_cached:
	if i in resources:
		resources.remove(i)

print(resources)

sys.exit()
