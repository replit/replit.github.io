# Secrets & environment variables

Sensitive information such as credentials and API keys should be separate from your codebase so that you can share your code with others but ensure that they cannot access your services, such as your user database.

A common way to give your application access to this information without leaking it to others is to store it in environment variables.

With Replit, you can add environment variables as key-value pairs, and then read these values from your backend code. Users who clone your repl will have access to all of the code, but will have to set their own values for these environment variables.

To access your own private environment variables, navigate to the padlock icon in the sidebar.

![The environment variables panel](/images/repls/env-variables.png)

## Adding, viewing and editing environment variables

To configure certain software and services, you'll need to add environment variables with specific keys and unique values given to you by your service provider (e.g. Stripe).

You can add a new variable by filling in the key and value fields and pressing "Add new secret". You can view or edit any previously saved variable by clicking on the name (by default, the values which are usually sensitive are not shown).

## Using environment variables in your code

The sidebar will prompt you with example code based on the language used in your repl. Here are some examples for Python and JavaScript, assuming you have set environment variables with `DB_USERNAME` -> `admin` and `TOKEN` -> `38zdJSDF48fKJSD4824fN` respectively.

### Python

```python
import os
print(os.getenv("DB_USERNAME"))
# prints 'admin'
```

### JavaScript

```javascript
console.log(process.env.TOKEN)
// prints '38zdJSDF48fKJSD4824fN'
```

Note that you cannot set environment variables for repls that have only a frontend, e.g. HTML repls.
