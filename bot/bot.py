#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from glob import glob
import json
import random
from hashlib import md5
import tempfile
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
				tmp = resource.group(0).encode('utf-8')
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

# markdown sortu

# fuentien tamañue
md = """
---
documentclass: extarticle
fontsize: 20pt
---
"""

# orridxen zenbakidxe kendu
"""

\pagenumbering{gobble}

"""

md = md +resources[r]['title']+"\n"+resources[r]['desc']+resources[r]['title']+"\n"+resources[r]['desc']+resources[r]['title']+"\n"+resources[r]['desc']

# artxibo tenporala
fd, path = tempfile.mkstemp()
with os.fdopen(fd, 'w') as tmp:
	tmp.write(md)

# pdf-ra pasa
os.system("pandoc "+path+" -f markdown -t latex --latex-engine=xelatex -o "+path+".pdf")

# pdf-tik png-ra
os.system("convert "+path+".pdf -background white -alpha remove "+path+".png")

os.remove(path)
os.remove(path+".pdf")

# png fitxeruek hartun

files = glob(path+"*.png")
files.sort()

font = ImageFont.truetype('UniversCondensed.ttf', 20)

for i in files:
	img = Image.open(i)
	img = img.convert('RGBA')

	d = ImageDraw.Draw(img)

	d.text((472, 730), "#zitalbot", font = font, fill=(0, 0, 0, 255))
	d.text((300, 750), "http://zital-pi.no-ip.org/bermiotarra/", font = font, fill=(0, 0, 0, 255))

	img.save(i, "PNG")

sys.exit()