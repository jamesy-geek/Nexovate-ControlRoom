import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Get the full SVG from Reference/index.html
ref_index = read_file('Reference/index.html')
start_idx = ref_index.find('<svg width="270" height="270" viewBox="0 0 270 270" xmlns="http://www.w3.org/2000/svg">')
end_idx = ref_index.find('</svg>', start_idx) + 6
patch_svg = ref_index[start_idx:end_idx]

# Replace in index.html
index_html = read_file('index.html')
svg_start = index_html.find('<svg width="220"')
svg_end = index_html.find('</svg>', svg_start) + 6

new_index = index_html[:svg_start] + patch_svg + index_html[svg_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Replaced patch SVG in index.html")
