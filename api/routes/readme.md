# Routes Documentation

## User Routes

### `GET localhost:5000/api/users`

Description: Get all users in the system, regardless of whether they are a student or a tutor.

Sample usage: `GET localhost:5000/api/users`

Required query parameters: None

Required body parameters: None

Sample response:

```json
[
    {
        "availability": {
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
            "sunday": []
        },
        "_id": "63e40ce23491cbaee74e134b",
        "firstName": "Zachary",
        "lastName": "Baldwin",
        "email": "zacharyjbaldwin@gmail.com",
        "favoriteTutors": [],
        "isTutor": true,
        "isAdmin": true,
        "skills": [
            "CS 2337",
            "MATH 2414"
        ]
    }
]
```

### `GET localhost:5000/api/users/:userId`

Description: Get a user in the system by their user id (user id is assigned by MongoDB when the user is created).

Sample usage: `GET localhost:5000/api/users/63e40ce23491cbaee74e134b`

Required query parameters: userId

Required body parameters: None

Sample response:

```json
{
    "availability": {
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
        "sunday": []
    },
    "_id": "63e40ce23491cbaee74e134b",
    "firstName": "Zachary",
    "lastName": "Baldwin",
    "email": "zacharyjbaldwin@gmail.com",
    "favoriteTutors": [],
    "isTutor": true,
    "isAdmin": true,
    "skills": [
        "CS 2337",
        "MATH 2414"
    ]
}
```

## Tutor Routes

### `GET localhost:5000/api/tutors`

Description: Get all tutors in the database.

Optional query string parameters:

* pageSize -> number, specifies the number of tutors per page
* pageNumber -> number, specifies the page to retrieve in the database
* searchQuery -> string, attempts to match results to the given search query

Sample usage:

* `GET localhost:5000/api/tutors`
* `GET localhost:5000/api/tutors?pageSize=10&pageNumber=0`
* `GET localhost:5000/api/tutors?searchQuery=zachary`
* `GET localhost:5000/api/tutors?pageSize=10&pageNumber=0&searchQuery=zachary`

Sample response:

```json
{
    "tutorCount": 1,
    "pageCount": 1,
    "tutors": [
        {
            "availability": {
                "monday": [],
                "tuesday": [],
                "wednesday": [],
                "thursday": [],
                "friday": [],
                "saturday": [],
                "sunday": []
            },
            "_id": "63e40ce23491cbaee74e134b",
            "firstName": "Zachary",
            "lastName": "Baldwin",
            "email": "zacharyjbaldwin@gmail.com",
            "favoriteTutors": [],
            "isTutor": true,
            "isAdmin": true,
            "skills": [
                "CS 2337",
                "MATH 2414"
            ]
        }
    ]
}
```

### `GET localhost:5000/api/tutors/:tutorId`

Description: Get a tutor in the system by their user id

Sample usage: `GET localhost:5000/api/tutors/63e40ce23491cbaee74e134b`

Required query parameters: userId

Required body parameters: None

Sample response:

```json
{
    "availability": {
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
        "sunday": []
    },
    "_id": "63e40ce23491cbaee74e134b",
    "firstName": "Zachary",
    "lastName": "Baldwin",
    "email": "zacharyjbaldwin@gmail.com",
    "favoriteTutors": [],
    "isTutor": true,
    "isAdmin": true,
    "skills": [
        "CS 2337",
        "MATH 2414"
    ]
}
```

<!-- ### `POST localhost:5000/api/tutors` -->

### `PATCH localhost:5000/api/tutors/:tutorId`

Description: Update a tutor document by his id

Required query parameters: tutorId
Required body parameters: object containing the values that will replace values in the original document

Sample usage: `PATCH localhost:5000/api/tutors/63e40ce23491cbaee74e134b`
Request body:

```json
{
    "firstName": "James"
}
```

Sample response:

```json
{
    "message": "Updated tutor",
    "tutor": {
        "availability": {
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
            "sunday": []
        },
        "_id": "63e40ce23491cbaee74e134b",
        "firstName": "James",
        "lastName": "Baldwin",
        "email": "zacharyjbaldwin@gmail.com",
        "favoriteTutors": [],
        "isTutor": true,
        "isAdmin": true,
        "skills": [
            "CS 2337",
            "MATH 2414"
        ]
    }
}
```

### `DELETE localhost:5000/api/tutors/:tutorId`

Description: Delete a tutor by his id

Required parameters: tutorId

Sample usage: `DELETE localhost:5000/api/tutors/63e40ce23491cbaee74e134b`

Sample response: `204 No Content`


## Favorites routes

### `POST .../api/favorites`

Description: add/removes the tutor from the user's favorite tutors list. If the tutor's id is not in the list, this route adds it. If the tutor's id is already in the list, it removes it.

Note: You must be logged in to use this route because it fetches the user id (of the user making the request) from the authentication middleware.

Required query string paramter: `tutorId` (see sample usage)

Usage: `POST .../api/favorites`

Sample usage: `POST localhost:5000/api/favorites?tutorId=63fa577a5e5f21d524196846`

Sample response (json):

```json
{
    "message": "Toggled favorite tutor."
}
```