import csv
import json

output = []
with open("Data/Verbs.csv", encoding="windows-1252") as f:
    reader = csv.DictReader(f, delimiter=",")
    print(reader.fieldnames)
    for row in reader:
        entry = {
            "id": int(row["Sr."]),
            "front": row["Verb"],
            "back": {
                "definition": row["Definition"],
                "examples": [e.strip() for e in row["Examples"].split(";")],
                "conjugation": {
                    "Präsens": row["Praesens"],
                    "Präteritum": row["Praeterium"],
                    "Perfekt": row["Perfekt"]
                }
            },
            "tags": [t.strip() for t in row["Tag"].split(",")]
        }
        output.append(entry)

with open("Data/Verben.json", "w", encoding="windows-1252") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)