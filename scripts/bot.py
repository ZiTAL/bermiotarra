#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import re

dir = sys.path[0]+"/.."
file = dir+"/berbak/a.md"

words = []
with open(file, 'r') as f:
	for line in f:
		word = re.search("^##\s([^#]+)\s##", line)
		if word != None:
			words.append(word.group(1))
print(words)
