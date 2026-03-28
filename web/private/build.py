import re
import os
import subprocess

def get_files(dirs: list[str], allow: list[re.Pattern] = []) -> list[str]:
    files = []
    for dir in dirs:
        for g in os.listdir(dir):
            if allow:
                for a in allow:
                    if re.search(a, g):
                        files.append(f'{dir}/{g}')
            else:
                files.append(f'{dir}/{g}')
    return files

md_dirs  = [os.path.realpath('../../berbak-esamoldiek')]
md_files = get_files(md_dirs, [re.compile(r'\.md$', re.IGNORECASE)])

full = ''

for md in md_files:
    letter = re.search(r'([^/]+)\.[^.]+$', md)
    if letter:
        content = open(md, 'r', encoding='utf-8').read().replace('#', '##')
        full += f'# {letter.group(1).upper()} #\n\n{content}\\pagebreak\n\n'

full = open('../../BEGONA.md', 'r', encoding='utf-8').read() + f'\\pagebreak\n\n{full}'
full = open('../../README.md', 'r', encoding='utf-8').read() + f'\\pagebreak\n\n{full}'

open('../public/resources/full.md', 'w', encoding='utf-8').write(full)

os.remove('../public/resources/bermiotarra.pdf')
os.remove('../public/resources/bermiotarra.epub')
subprocess.run('pandoc ../public/resources/full.md -f markdown -t latex --pdf-engine=pdflatex -o ../public/resources/bermiotarra.pdf', shell=True)
subprocess.run('pandoc ../public/resources/full.md -o ../public/resources/bermiotarra.epub', shell=True)
os.remove('../public/resources/full.md')