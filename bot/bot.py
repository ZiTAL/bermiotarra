#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
import json
import random
import tempfile

from glob     import glob
from hashlib  import md5
from PIL	     import Image, ImageFont, ImageDraw
from mastodon import Mastodon
from time     import sleep

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
         # berbie edo esamoldie topa
         resource = re.search(r"^#\s([^#]+)\s#", line)
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
element = resources[r]

# gudoten bat hartun
"""
local_time = localtime()
local_time = strftime("%Y-%m-%d", local_time)
if(local_time=="2019-04-26"):
   for i in resources:
      if(i['id']=='2797b748eb9425e3975f1d724c7e1ff2'):
         element = i
"""

# markdown sortu

# fuentien tamañue
md = r"""
---
documentclass: extarticle
fontsize: 20pt
header-includes:
  - \pagestyle{empty}
---
"""

md = md +"## "+element['title']+" ##\n"+element['desc']

# artxibo tenporala
fd, path = tempfile.mkstemp()
with os.fdopen(fd, 'w') as tmp:
   tmp.write(md)

# pdf-ra pasa
#os.system("pandoc "+path+" -f markdown -t latex --pdf-engine=xelatex -o "+path+".pdf")
os.system("pandoc "+path+" -f markdown -t latex -o "+path+".pdf")

# pdf-tik png-ra
#os.system("convert "+path+".pdf -background white -alpha remove -colorspace RGB "+path+".png")
os.system("magick "+path+".pdf -background white -alpha remove "+path+".png")

os.remove(path)
os.remove(path+".pdf")

# png fitxeruek hartun

files = glob(path+"*.png")
files.sort()

font = ImageFont.truetype(sys.path[0]+"/UniversCondensed.ttf", 20)

for i in files:
   img = Image.open(i)
   img = img.convert('RGBA')

   d = ImageDraw.Draw(img)

   d.text((344, 750), "https://bermiotarra.zital.eus", font = font, fill=(0, 0, 0, 255))

   img.save(i, "PNG")

txt = f"Egunien berba edo esamolde bat, gaurkuen: {element['title']}\n\nhttps://bermiotarra.zital.eus\n\n#bermiotarra #zitalbot"

#mastodon

with open(f"{sys.path[0]}/mastodon.json", 'r') as f:
   mastodon_config = json.load(f)

mastodon = Mastodon(
   access_token = mastodon_config['token'],
   api_base_url = mastodon_config['instance']
)

images = []
for i in files:
   a = mastodon.media_post(i);
   images.append([a.id])
   os.remove(i)

sleep(15)

m = mastodon.status_post(txt, visibility='public', media_ids=images)

# toka dan berbie cache-n sartu #

words_cached.append(element['id'])

with open(words_cache_file, 'w') as outfile:
    json.dump(words_cached, outfile)

sys.exit()

