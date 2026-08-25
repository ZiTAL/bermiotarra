#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
import json
import random
import tempfile
import shutil

from glob     import glob
from hashlib  import md5
from PIL	     import Image, ImageFont, ImageDraw
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
            b = {'id': hash, 'title': tmp.decode('utf-8'), 'desc': ''}

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

# Markdown for WeasyPrint; it does not need LaTeX document metadata.
md = "## "+element['title']+" ##\n"+element['desc']

# artxibo tenporala
fd, path = tempfile.mkstemp()
with os.fdopen(fd, 'w', encoding='utf-8') as tmp:
   tmp.write(md)

# PDF-ra pasa: WeasyPrint erabili beti.
if not shutil.which('weasyprint'):
   sys.exit("No PDF renderer found. Install weasyprint.")

result = os.system("pandoc "+path+" -f markdown -t html -o "+path+".html")
if result == 0:
   with open(path+".html", 'r', encoding='utf-8') as html:
      content = html.read()
   with open(path+".html", 'w', encoding='utf-8') as html:
      html.write("""<!doctype html>
<html><head><meta charset="utf-8"><style>
@page { size: 1080px 1500px; margin: 80px; }
body { font-size: 34pt; line-height: 1.2; }
h2 { font-size: 45pt; line-height: 1.2; margin: 0 0 0.5em; }
</style></head><body>"""+content+"</body></html>")
   result = os.system("weasyprint "+path+".html "+path+".pdf")

if result != 0:
   sys.exit("Could not create the PDF.")

# pdf-tik png-ra
#os.system("convert "+path+".pdf -background white -alpha remove -colorspace RGB "+path+".png")
if os.system("magick "+path+".pdf -background white -alpha remove "+path+".png") != 0:
   sys.exit("Could not convert the PDF to PNG.")

os.remove(path)
os.remove(path+".pdf")
if os.path.exists(path+".html"):
   os.remove(path+".html")

# png fitxeruek hartun

files = glob(path+"*.png")
files.sort()

font = ImageFont.truetype(sys.path[0]+"/UniversCondensed.ttf", 28)

for i in files:
   img = Image.open(i)
   img = img.convert('RGBA')

   d = ImageDraw.Draw(img)

   d.text((img.width - 30, img.height - 30), "https://bermiotarra.zital.eus", font = font, fill=(0, 0, 0, 255), anchor='rs')

   img.save(i, "PNG")

txt = f"Egunien berba edo esamolde bat, gaurkuen: {element['title']}\n\nhttps://bermiotarra.zital.eus\n\n#bermiotarra #zitalbot"

#mastodon

from mastodon import Mastodon

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

sys.exit()
