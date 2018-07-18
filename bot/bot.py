#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from glob import glob
import json
import random
from hashlib import md5

# fitxero danak hartun #

files = []

dir = sys.path[0]+"/.."
dir = os.path.realpath(dir)+"/berbak-esamoldiek"

l = glob(dir+"/*.md")
l.sort()
files = files + l

# ariñautik erabili duzen berbak hartun #

words_cached = []
words_cache_file = sys.path[0]+"/bot.cache"

with open(words_cache_file, 'r') as f:
	words_cached = json.load(f)

# berba / esamolde danak karga #

resources = []
a = None

for file in files:
	with open(file, 'r') as f:
		for line in f:
			resource = re.search("^##\s([^#]+)\s##", line)
			if resource != None:
				tmp = resource.group(1).encode('utf-8')
				if a:
					resources.append(a)
				hash = md5()
				hash.update(tmp)
				hash = hash.hexdigest()
				# ariñautik erabili duzenak kendu #
				if(hash not in words_cached):
					a = {'id': hash, 'title': tmp, 'desc': ''}
				else:
					a = None
			else:
				if a:
					a['desc'] = a['desc'] + line + "\n"

# aleatoidxue hartun

r = random.randint(0, len(resources))

print(resources[r])

# toka dan berbie cache-n sartu #

words_cached.append(resources[r]['id'])

with open(words_cache_file, 'w') as outfile:
    json.dump(words_cached, outfile)

sys.exit()