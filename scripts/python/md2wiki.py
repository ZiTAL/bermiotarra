#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# wikipediarako md wiki bihurtu :)

import os
import re

dir   = '../../berbak-esamoldiek/'
files = os.listdir(dir)
files = [x for x in files if re.match(r"^[a-z]{1}\.md$", x)]
files.sort()
for file in files:
    command = f"pandoc --from=markdown --to=mediawiki {dir}{file} -o {dir}{file}.wiki"
    os.system(command)