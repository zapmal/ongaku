<div align="center">
  <img src="https://i.imgur.com/lCYaVxX.png" alt="Logo" />
</div>

## Setup

This assumes that you're in the directory that's `highlighted`.

### Frontend (`web`)

Run:

- `npm install`
- `cp .env.example .env`
- `npm run dev`

Ready to go.

---

### 

### Backend

For `node-api`

Run:

- `cp .env.example .env.dev`
- Fill the env vars:

```
DATABASE_URL="postgresql://username:secretpassword@localhost:5433/ongaku"

JWT_SECRET="Secret"
JWT_EXPIRY_TIME="90d"

COOKIE_SECRET="Cookie secret"

FRONTEND_URL="http://localhost:3000"

MAIL_HOST="smtp.gmail.com"
MAIL_PORT=465
MAIL_USER="you know"

MAIL_PASSWORD="you know"
MAIL_FROM="noreply@ongaku.com"

MAIL_TRANSPORT="smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}"

UPLOADED_FILES_DESTINATION=./assets
```

Then, inside `/node-api/assets` create the following folders:

- `artist`
- `album`
- `playlist`
- `song`
- `user`

Now, create the database (`ongaku`) by using pgAdmin or the shell, then:

- `npm install`
- `npm run migrate`
- `npm run start:dev`
- `npm run seed`

The `/demo` folder contains data that can be used safely for tests.

Regarding prisma, some extra scripts are available:

> Prepend `dotenv -e .env.dev --` or create an .env file to run these.

- To apply migrations: `npx prisma migrate dev`
- For further migrations: `npx prisma migrate dev --name <change-made>`
- To reset the database: `npx prisma migrate reset`

If a new model needs to be added then create it under `/prisma/schemas` and
run the `updateSchemas.sh` script:

- `./updateSchemas.sh`

In order for the script to work there needs to be a `/prisma/schemas` directory
and a `/prisma/base.prisma`, both are already on the repository so don't delete
them.

If there's a problem with the script then you can still do it manually, adding the models
on `/prisma/schema.prisma`.
