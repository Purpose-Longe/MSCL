# MSCL Backend API - Sample Payloads

## Authentication

### Register
```json
{
  "email": "user@example.com",
  "password": "password123",
  "dob": "1990-01-01",
  "weight": 70.5,
  "height": 175.0
}
```

### Login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "dob": "1990-01-01T00:00:00.000Z",
    "weight": 70.5,
    "height": 175
  }
}
```

## Workouts

### Create Workout
```json
{
  "name": "Leg Day",
  "type": "strength",
  "started_at": "2026-03-20T18:00:00.000Z",
  "ended_at": "2026-03-20T19:05:00.000Z",
  "exercises": [
    {
      "exercise_library_id": 1,
      "order": 1,
      "rest_time": 90,
      "strength_sets": [
        {
          "set": 1,
          "rep": 8,
          "weight": 80,
          "unit": "kg",
          "rest_time": 120
        },
        {
          "set": 2,
          "rep": 6,
          "weight": 85,
          "unit": "kg",
          "rest_time": 120
        }
      ]
    },
    {
      "exercise_library_id": 2,
      "order": 2,
      "rest_time": 60,
      "cardio_sets": [
        {
          "duration": 1800,
          "distance": 5.0,
          "calories": 300,
          "pace": "6:00"
        }
      ]
    }
  ]
}
```

### Update Workout
```json
{
  "name": "Updated Leg Day",
  "ended_at": "2026-03-20T19:15:00.000Z"
}
```

## Exercises

### Create Custom Exercise
```json
{
  "name": "Custom Squat",
  "workout_type": "strength",
  "description": "My custom squat variation"
}
```

## Activities

### Create Activity
```json
{
  "description": "Completed morning run",
  "category": "exercise"
}
```

## Error Responses

### Validation Error
```json
{
  "errors": [
    {
      "msg": "Email is invalid",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Unauthorized
```json
{
  "message": "Authorization header missing or malformed"
}
```

### Not Found
```json
{
  "message": "Workout session not found"
}
```

## Headers

For protected routes, include:
```
Authorization: Bearer <token>
```