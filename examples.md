`GET http://localhost:3000/projects/67c9b5cc6c7ecfbea1b1d2ed/sprints`  

```json
[
    {
        "_id": "67c9b58d6c7ecfbea1b1d2eb",
        "name": "Sprint 1",
        "start": "2025-03-10T00:00:00.000Z",
        "end": "2025-03-24T00:00:00.000Z",
        "items": [
            "67c9ad1eb412c0d6db091248"
        ],
        "__v": 0
    }
]
```

`GET http://localhost:3000/sprints/67c9b58d6c7ecfbea1b1d2eb/items`  

```json
[
    {
        "_id": "67c9ad1eb412c0d6db091248",
        "title": "Improve Login Flow",
        "description": "Enhance user authentication experience",
        "priority": 2,
        "sustainability": true,
        "storyPoints": 5,
        "sustainabilityPoints": 3,
        "status": "In Progress",
        "tags": [
            "feature",
            "authentication"
        ],
        "effects": [
            "user satisfaction"
        ],
        "sprint": "sprint_1",
        "responsible": "John Doe",
        "__v": 0
    }
]
```
`POST http://localhost:3000/projects`  

```json
{
    "name": "New Scrum Project 3",
    "sprints": [],
    "items": [],
    "_id": "67ca1a7376f4d75990c955ad",
    "__v": 0
}
```
