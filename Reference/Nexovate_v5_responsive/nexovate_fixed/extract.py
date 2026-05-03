import os
import re

def extract_files(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    files = {
        'css/base.css': [],
        'css/chrome.css': [],
        'css/transitions.css': [],
        'js/navigate.js': [],
        'js/chrome.js': [],
        'js/events-data.js': [],
        'css/hero.css': [],
        'css/dossier.css': [],
        'css/hacksprint.css': [],
        'js/registration.js': [],
        'css/registration.css': [],
        'js/confirmation.js': [],
        'css/confirmation.css': [],
        'js/schematic.js': []
    }
    
    current_file = None
    in_code_block = False
    
    for i, line in enumerate(lines):
        # Look for headers or explicit filenames
        for fname in files.keys():
            if f"`{fname}`" in line or f"**`{fname}`**:" in line or f"**`{fname}`" in line:
                # Except if it's in the list of files in section 1
                if "├──" not in line and "└──" not in line and "│" not in line:
                    current_file = fname
                    break
            
            # Special case for schematic.js inside section 5
            if "js/schematic.js" in line and "Full Specification" in line:
                current_file = "js/schematic.js"
                break
        
        # When entering a code block
        if line.startswith("```css") or line.startswith("```js"):
            if current_file:
                in_code_block = True
            continue
            
        # When exiting a code block
        if line.strip() == "```" and in_code_block:
            in_code_block = False
            # We don't reset current_file immediately because some files have multiple blocks (like base.css)
            # but if we hit another header it will change.
            continue
            
        if in_code_block and current_file:
            files[current_file].append(line)
            
    # Combine the blocks for base.css because it has multiple blocks
    # Actually, the logic above already appends all blocks while current_file matches.
    
    # Write files
    for fname, content in files.items():
        if content:
            os.makedirs(os.path.dirname(fname), exist_ok=True)
            with open(fname, 'w', encoding='utf-8') as f:
                f.write(''.join(content))
            print(f"Created {fname} ({len(content)} lines)")
        else:
            print(f"Warning: No content found for {fname}")

if __name__ == '__main__':
    extract_files('Reference/nexovate_design_doc.md')
