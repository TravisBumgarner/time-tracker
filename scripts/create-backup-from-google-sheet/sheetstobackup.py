import csv
import uuid
import json
from datetime import datetime

# Path to the CSV file
csv_file_path = 'import.csv'

def parse_csv(file_path):
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return list(reader)

def convert_csv_to_json(file_path):
    records = parse_csv(file_path)
    projects_map = {}
    tasks = []

    for record in records:
        print(record)
        project = record['Project']
        start = record['Start']
        end = record['End']
        comments = record['Comments']
        effort = record['Effort']

        if project not in projects_map:
            projects_map[project] = str(uuid.uuid4())

        tasks.append({
            "start": start,
            "end": end,
            "id": str(uuid.uuid4()),
            "projectId": projects_map[project],
            "details": comments or '',
            "effort": effort
        })

    projects = [{"id": id, "title": title, "status": "ACTIVE"} for title, id in projects_map.items()]

    return {
        "projects": projects,
        "tasks": tasks
    }

json_result = convert_csv_to_json(csv_file_path)

with open('output.json', 'w') as f:
    json.dump(json_result, f, indent=2)

print('JSON output saved to output.json')
