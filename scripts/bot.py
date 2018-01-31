#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# pip3 install Pillow

from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from PIL import ImageFilter

img = Image.open("tmp2.jpg")
bimg = img.filter(ImageFilter.GaussianBlur(radius = 25))
draw = ImageDraw.Draw(bimg)
# font = ImageFont.truetype(<font-file>, <font-size>)
font01 = ImageFont.truetype('/usr/share/fonts/truetype/droid/DroidSans.ttf', 68)
font02 = ImageFont.truetype('/usr/share/fonts/truetype/droid/DroidSans.ttf', 64)
# draw.text((x, y),"Sample Text",(r,g,b))
draw.text((50, 50), 'Sample Text', (255,255,255), font = font01)
draw.text((50, 50), 'Sample Text', (0, 0 , 0), font = font02)

bimg.save('sample-out.jpg')
