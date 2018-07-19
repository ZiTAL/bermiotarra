#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from glob import glob
import json
import random
from hashlib import md5
from PIL import Image, ImageFont, ImageDraw

# fitxero danak hartun #

dir = sys.path[0]+"/.."
dir = os.path.realpath(dir)+"/berbak-esamoldiek"

files = glob(dir+"/*.md")
files.sort()

# ariñautik erabili duzen berbak hartun #

words_cached = []
words_cache_file = sys.path[0]+"/bot.cache"

with open(words_cache_file, 'r') as f:
	words_cached = json.load(f)

# berba / esamolde danak karga #

resources = []
b = None

for file in files:
	with open(file, 'r') as f:
		for line in f:
			resource = re.search("^##\s([^#]+)\s##", line)
			if resource != None:
				tmp = resource.group(1).encode('utf-8')
				if b:
					resources.append(b)
				hash = md5()
				hash.update(tmp)
				hash = hash.hexdigest()
				# ariñautik erabili duzenak kendu #
				if(hash not in words_cached):
					b = {'id': hash, 'title': tmp.decode('utf-8'), 'desc': ''}
				else:
					b = None
			else:
				if b:
					b['desc'] = b['desc'] + line

# aleatoidxue hartun

r = random.randint(0, len(resources))

# toka dan berbie cache-n sartu #

words_cached.append(resources[r]['id'])

with open(words_cache_file, 'w') as outfile:
    json.dump(words_cached, outfile)

#print(resources[r]['id'])
#print(resources[r]['title'])
#print(resources[r]['desc'])

# irudidxe sortu

base = Image.new('RGB', (1280, 720), (255, 255, 255, 0))
base = base.convert('RGBA')

font = ImageFont.truetype('UniversCondensed.ttf', 20)

d = ImageDraw.Draw(base)

d.text((10,20), resources[r]['title'], font = font, fill=(0, 0, 0, 255))
d.text((10,30), resources[r]['desc'], font = font, fill=(0, 0, 0, 255))

#base.show()

base.save("image.png", "PNG")

sys.exit()