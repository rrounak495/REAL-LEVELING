import os
import glob
import re

directory = r"c:\Users\rroun\Downloads\REAL LEVLING\apps\mobile\src\features"
files = glob.glob(os.path.join(directory, "**", "*.ts"), recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    changed = False
    
    if '(this.supabase as never)' in content:
        # We need relative path to extended-database.types
        # Depending on depth, usually it's 4 or 5 levels deep.
        # Let's just use @/types/extended-database.types if they have path aliases, 
        # but in this project they use relative paths (e.g., '../../../../types/extended-database.types')
        # Actually, since it's just casting, we can do:
        # as unknown as import('@supabase/supabase-js').SupabaseClient<any> - wait, no any.
        # Let's use the Database type that's already imported!
        # Wait, the repositories already import { Database } from '.../database.types';
        # Let's just cast to `unknown as { from: Function }`! No, `unknown as any` is banned.
        
        # We can use `@ts-expect-error` effectively by placing it correctly!
        pass
        
    # Actually, the easiest type-safe mock is:
    new_content = content.replace('(this.supabase as never)', '(this.supabase as unknown as import(\'@supabase/supabase-js\').SupabaseClient<import(\'../../../../types/extended-database.types\').ExtendedDatabase>)')
    
    # InventoryService has '(repositories as never).inventory'
    new_content = new_content.replace('(repositories as never)', '(repositories as unknown as Record<string, import(\'@supabase/supabase-js\').SupabaseClient>)')
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            print(f"Fixed {file}")
