import os
import re
import glob

base_dir = r"t:\freelance\2"

# Read about artist.txt
with open(os.path.join(base_dir, "about artist.txt"), "r", encoding="utf-8") as f:
    lines = f.readlines()

parsed_html = []
parsed_html.append('<header class="page-header fade-in-up" style="text-align: center; padding: 8rem 2rem 4rem; background-color: var(--bg-color);">')

i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
        
    if line.startswith("**H1:"):
        title = line.replace("**H1:", "").replace("**", "").strip()
        parsed_html.append(f'    <h1 class="page-title" style="font-family: var(--font-display); font-size: 3rem; color: var(--text-color); margin-bottom: 1rem;">{title}</h1>')
    elif line.startswith("**H2:"):
        subtitle = line.replace("**H2:", "").replace("**", "").strip()
        parsed_html.append(f'    <h2 class="page-subtitle" style="font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: rgba(62,39,35,0.8); margin-bottom: 2rem;">{subtitle}</h2>')
        parsed_html.append('</header>\n<section class="about-content-section fade-in-up delay-1" style="max-width: 800px; margin: 0 auto; padding: 0 2rem 6rem; font-family: var(--font-sans); line-height: 1.8; color: var(--text-color);">')
    elif line.startswith("**P:**"):
        i += 1
        while i < len(lines) and not lines[i].strip():
            i += 1
        if i < len(lines):
            p_text = lines[i].strip()
            if "highlight-intro" not in "".join(parsed_html):
                parsed_html.append(f'    <p class="highlight-intro" style="font-family: var(--font-serif); font-size: 1.25rem; line-height: 1.6; margin-bottom: 2.5rem; text-align: center;">{p_text}</p>')
            else:
                parsed_html.append(f'    <p style="margin-bottom: 1.5rem;">{p_text}</p>')
    i += 1

parsed_html.append('</section>')
about_section_html = "\n".join(parsed_html)

# Read index.html to use as template
with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    index_content = f.read()

# Extract from <body> start to end of sidebar
header_match = re.search(r'(<body.*?</aside>)', index_content, re.DOTALL)
footer_match = re.search(r'(<footer.*?>.*?</footer>\s*<script.*?</script>\s*</body>\s*</html>)', index_content, re.DOTALL)
head_match = re.search(r'(<!DOCTYPE html>.*?<head>.*?</head>)', index_content, re.DOTALL)

if header_match and footer_match and head_match:
    head_content = head_match.group(1)
    head_content = re.sub(r'<title>.*?</title>', '<title>About the Artist | Areena</title>', head_content)
    
    new_html = head_content + "\n" + header_match.group(1) + "\n<main>\n" + about_section_html + "\n</main>\n" + footer_match.group(1)
    
    # Write to about.html
    with open(os.path.join(base_dir, "about.html"), "w", encoding="utf-8") as f:
        f.write(new_html)

# Now update navigation in all HTML files
for file_path in glob.glob(os.path.join(base_dir, "*.html")):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_content = content
    # Update sidebar links
    content = content.replace('<li><a href="#">THE ARTIST</a></li>', '<li><a href="about.html">THE ARTIST</a></li>')
    # Update index.html about section button
    if "index.html" in file_path:
        # Make sure we only change the "Get to Know Me" button
        content = content.replace('<a href="contact.html" class="btn-primary">Get to Know Me</a>', '<a href="about.html" class="btn-primary">Get to Know Me</a>')
    
    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("done")
