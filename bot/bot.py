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

# Use --local-only to render a preview without posting it or updating the cache.
local_only = '--local-only' in sys.argv
preview_file = sys.path[0]+"/preview.png"

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
# extarticle only supports class sizes up to 20pt.  A larger value is ignored
# by LaTeX and silently falls back to its 10pt default.
fontsize: 20pt
header-includes:
  - \pagestyle{empty}
  # Use an explicit size for the generated content instead of an unsupported
  # document-class option.  The second value is the line height.
  - \AtBeginDocument{\fontsize{20}{24}\selectfont}
  # Pandoc renders a Markdown ## heading as \subsection.  Give it an
  # explicit size too, since the class's relative heading size is based on
  # the 20pt class option.
  - \makeatletter
  - \renewcommand{\subsection}{\@startsection{subsection}{2}{\z@}{3.5ex \@plus 1ex \@minus .2ex}{2.3ex \@plus .2ex}{\normalfont\fontsize{30}{36}\bfseries}}
  - \makeatother
---
"""

md = md +"## "+element['title']+" ##\n"+element['desc']

# artxibo tenporala
fd, path = tempfile.mkstemp()
with os.fdopen(fd, 'w') as tmp:
   tmp.write(md)

# pdf-ra pasa
#os.system("pandoc "+path+" -f markdown -t latex --pdf-engine=xelatex -o "+path+".pdf")
latex_engine = next((engine for engine in ('xelatex', 'lualatex', 'pdflatex') if shutil.which(engine)), None)
if latex_engine:
   result = os.system("pandoc "+path+" -f markdown -t latex --pdf-engine="+latex_engine+" -o "+path+".pdf")
elif local_only and shutil.which('weasyprint'):
   result = os.system("pandoc "+path+" -f markdown -t html -o "+path+".html")
   if result == 0:
      with open(path+".html", 'r') as html:
         content = html.read()
      with open(path+".html", 'w') as html:
         html.write("""<!doctype html>
<html><head><style>
@page { size: 1080px 1500px; margin: 80px; }
body { font-size: 40pt; line-height: 1.25; }
h2 { font-size: 60pt; margin: 0 0 0.5em; }
</style></head><body>"""+content+"</body></html>")
      result = os.system("weasyprint "+path+".html "+path+".pdf")
else:
   sys.exit("No PDF renderer found. Install a LaTeX engine or use weasyprint for --local-only.")

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

font = ImageFont.truetype(sys.path[0]+"/UniversCondensed.ttf", 48)

for i in files:
   img = Image.open(i)
   img = img.convert('RGBA')

   d = ImageDraw.Draw(img)

   d.text((img.width - 30, img.height - 30), "https://bermiotarra.zital.eus", font = font, fill=(0, 0, 0, 255), anchor='rs')

   img.save(i, "PNG")

txt = f"Egunien berba edo esamolde bat, gaurkuen: {element['title']}\n\nhttps://bermiotarra.zital.eus\n\n#bermiotarra #zitalbot"

if local_only:
   if os.path.exists(preview_file):
      sys.exit("Preview already exists: "+preview_file)
   shutil.move(files[0], preview_file)
   for i in files[1:]:
      os.remove(i)
   print("Preview saved to "+preview_file)
   sys.exit()

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

# toka dan berbie cache-n sartu #

words_cached.append(element['id'])

with open(words_cache_file, 'w') as outfile:
    json.dump(words_cached, outfile)

sys.exit()
