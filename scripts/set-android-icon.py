from PIL import Image
from pathlib import Path
root=Path('android/app/src/main/res')
source=Image.open('public/brand-logo.png').convert('RGBA')
# Legacy launcher icons
for folder,size in {'mipmap-mdpi':48,'mipmap-hdpi':72,'mipmap-xhdpi':96,'mipmap-xxhdpi':144,'mipmap-xxxhdpi':192}.items():
    target=root/folder
    target.mkdir(parents=True,exist_ok=True)
    canvas=Image.new('RGBA',(size,size),(10,24,42,255))
    mark=source.copy()
    mark.thumbnail((int(size*.72),int(size*.72)))
    canvas.alpha_composite(mark,((size-mark.width)//2,(size-mark.height)//2))
    canvas.save(target/'ic_launcher.png')
    canvas.save(target/'ic_launcher_round.png')
# Adaptive icon foreground layers
for folder,size in {'mipmap-mdpi':108,'mipmap-hdpi':162,'mipmap-xhdpi':216,'mipmap-xxhdpi':324,'mipmap-xxxhdpi':432}.items():
    target=root/folder
    canvas=Image.new('RGBA',(size,size),(0,0,0,0))
    mark=source.copy()
    mark.thumbnail((int(size*.62),int(size*.62)))
    canvas.alpha_composite(mark,((size-mark.width)//2,(size-mark.height)//2))
    canvas.save(target/'ic_launcher_foreground.png')
anydpi=root/'mipmap-anydpi-v26'
anydpi.mkdir(parents=True,exist_ok=True)
(anydpi/'ic_launcher.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/launcher_background" />\n    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n</adaptive-icon>\n''',encoding='utf-8')
(anydpi/'ic_launcher_round.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/launcher_background" />\n    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n</adaptive-icon>\n''',encoding='utf-8')
values=root/'values'
values.mkdir(parents=True,exist_ok=True)
colors=values/'colors.xml'
existing=colors.read_text(encoding='utf-8') if colors.exists() else '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n'
if 'launcher_background' not in existing:
    existing=existing.replace('</resources>','    <color name="launcher_background">#0A182A</color>\n</resources>')
colors.write_text(existing,encoding='utf-8')
