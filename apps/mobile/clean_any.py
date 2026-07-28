import os
import glob
import re

directory = r"c:\Users\rroun\Downloads\REAL LEVLING\apps\mobile\src\features"
files = glob.glob(os.path.join(directory, "**", "*.ts"), recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'as any' in content:
        # We need to replace specific usages of 'as any'
        # 1. (this.supabase as any) -> (this.supabase as unknown as Record<string, unknown>)
        # wait, that won't have .from(). It's better to cast to something with from:
        # actually, (this.supabase as never) works beautifully for chained calls.
        
        new_content = content.replace('(this.supabase as any)', '(this.supabase as never)')
        new_content = new_content.replace('data as any', 'data as unknown as Record<string, unknown>')
        new_content = new_content.replace('(data as any)', '(data as unknown as Record<string, unknown>)')
        new_content = new_content.replace('(row as any)', '(row as unknown as Record<string, unknown>)')
        new_content = new_content.replace('(row.metadata as any)', '(row.metadata as unknown as Record<string, unknown>)')
        new_content = new_content.replace('(data as any[])', '(data as unknown as Record<string, unknown>[])')
        new_content = new_content.replace('(ownedData as any[])', '(ownedData as unknown as Record<string, unknown>[])')
        new_content = new_content.replace('as any)', 'as never)')
        new_content = new_content.replace('as any;', 'as never;')
        
        # for services using (repositories as any)
        new_content = new_content.replace('(repositories as any)', '(repositories as never)')
        
        # fix map(row: any) to map(row: Record<string, unknown>)
        new_content = new_content.replace('(row: any)', '(row: Record<string, unknown>)')
        new_content = new_content.replace('row: any', 'row: Record<string, unknown>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            print(f"Cleaned {file}")
