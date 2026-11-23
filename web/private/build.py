import re
import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LATEX_HEADER = os.path.join(BASE_DIR, 'latex-header.tex')
EPUB_CSS = os.path.join(BASE_DIR, 'epub.css')

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
        content = open(md, 'r', encoding='utf-8').read()
        content = re.sub(r'^#[ \t]+(.+?)[ \t]*$', r'## \1', content, flags=re.M)
        full += f'# {letter.group(1).upper()}\n\n{content}\\pagebreak\n\n'

full = open('../../BEGONA.md', 'r', encoding='utf-8').read() + f'\\pagebreak\n\n{full}'
full = open('../../README.md', 'r', encoding='utf-8').read() + f'\\pagebreak\n\n{full}'

open('../public/resources/full.md', 'w', encoding='utf-8').write(full)

pdf_path     = '../public/resources/bermiotarra.pdf'
epub_path    = '../public/resources/bermiotarra.epub'
full_md_path = '../public/resources/full.md'

if os.path.exists(pdf_path):
    os.remove(pdf_path)
if os.path.exists(epub_path):
    os.remove(epub_path)

subprocess.run(
    f'pandoc ../public/resources/full.md -f markdown -t latex --include-in-header={LATEX_HEADER} --pdf-engine=pdflatex -o ../public/resources/bermiotarra.pdf',
    shell=True,
)
subprocess.run(
    f'pandoc ../public/resources/full.md -f markdown --css={EPUB_CSS} -o ../public/resources/bermiotarra.epub',
    shell=True,
)

if os.path.exists(full_md_path):
    os.remove(full_md_path)
