#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

file = '/home/projects/bermiotarra/berbak/a.md'

words = []
with open(file, 'r') as f:
	for line in f:
		word = re.search("^##\s([^#]+)\s##", line)
		if word != None:
			words.append(word.group(1))
f.close()

print(words)
