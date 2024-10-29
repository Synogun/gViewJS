import os

def add_white():
    for file in os.listdir('.'):
        if file.endswith('.svg'):
            content = ''
            with open(file, 'r') as icon:
                content = icon.read()
                print(content)
                content = content.replace('fill="#ffffff"><', ' fill="#ffffff"><', 1)
            with open(file, 'w') as icon:
                icon.write(content)


add_white()