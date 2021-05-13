# Replit API
Replit provides two free, public API endpoints to help you get basic information about users and repls.

### Endpoints
- /data/profiles/[username]
- /data/repls/@[username]/[repl-slug]
  
### How to use the API
To use the API, simply make a ` GET ` request to one of the provided endpoints with your parameters. For the profile endpoint, the ` @ ` symbol should not appear before the username, but should appear before the username for the repl endpoint.

Example in Python:
<iframe src="https://replit.com/@CoolCoderSJ/GoodAdventurousObjectcode?lite=true" height="400px" width="400px"></iframe>

### Response
In response, the api will return the following data in JSON (JavaScript Object Notation) format-

#### Profiles
- classrooms
- hashed email
- organization
- ten most recent repls
- user id
- username
- first name
- last name
- bio
- icon
  - url
  - id
- isTeam (bool)
- top three languages
- hacker (bool)

#### Repls
- id
- user id
- title
- description
- is_project (bool)
- is_private (bool)
- time_created
- time_updated
- views
- content_length
- origin_id
- slug
- config
    - ivVnc (bool)
    - domain
    - isServer (bool)
- is_renamed (bool)
- folder_id
- url
- language
- fileNames (list)
- isOwner (bool)
- show_chat (bool)
- is_mobile (bool)
