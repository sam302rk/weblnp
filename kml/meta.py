import glob

def iterate(filepath):
    new_filepath = filepath.replace(".kml", ".json")
    try:
        new_file = open(new_filepath, 'x')
        print(f"No meta found for '{filepath}'. Generating...")
        new_file.write("{}")
        new_file.close()
    except:
        print(f"'{new_filepath}' exists. Skipping.")

for filepath in glob.iglob('*/*.kml'):
    iterate(filepath)

