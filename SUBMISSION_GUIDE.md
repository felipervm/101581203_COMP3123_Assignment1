# Submission Guide — What Felipe Must Do Manually

The source code, README, Postman collection, validation, JWT, ownership logic, tests, logging, health check, and Vercel configuration are already in this repository.

## 1. Clone and install

```powershell
git clone https://github.com/felipervm/101581203_COMP3123_Assignment1.git
cd 101581203_COMP3123_Assignment1
npm install
```

After `npm install`, commit the generated `package-lock.json`:

```powershell
git add package-lock.json
git commit -m "chore: add dependency lock file"
git push
```

## 2. Create MongoDB Atlas database

Create or use a MongoDB Atlas cluster.

The database name must be:

```text
comp3123_assignment1
```

Create a database user and allow your current IP address to connect.

Copy the Atlas connection string.

## 3. Create local .env

Copy:

```text
.env.example
```

to:

```text
.env
```

Set:

```env
PORT=3000
MONGODB_URI=<your Atlas URI>
JWT_SECRET=<your long random secret>
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

Do NOT commit `.env`.

## 4. Start and verify locally

```powershell
npm start
```

Check:

```text
http://localhost:3000/health
```

Expected status: 200.

## 5. Import Postman collection

Import:

```text
postman/COMP3123_Assignment1.postman_collection.json
```

Keep `baseUrl` as:

```text
http://localhost:3000
```

Run the requests in logical order.

## 6. Screenshots required

Capture screenshots for the DOCX submission.

### MongoDB Atlas
- database named `comp3123_assignment1`
- `users` collection
- `employees` collection
- hashed password visible in MongoDB
- employee `user` ObjectId showing ownership relationship

Do not expose the Atlas connection string or database password.

### User endpoints
- Signup 201
- Duplicate signup 409
- Invalid signup 400
- Login 200 with JWT
- Invalid login 401

### JWT / security
- Missing JWT 401
- Invalid JWT 401
- Helmet headers visible in Postman response headers
- Rate-limit response 429

For 429, call signup/login more than five times inside one minute.

### Employee CRUD
- GET all 200
- POST 201
- GET by id 200
- PUT 200
- DELETE 204

### Validation / errors
- invalid ObjectId 400
- invalid salary 400
- non-existing employee 404

### Two-user authorization
1. Signup/login User A.
2. Create Employee A.
3. Signup/login User B.
4. Create Employee B.
5. Use User A token to GET Employee B ID → 403.
6. Use User B token to GET Employee A ID → 403.
7. Screenshot both.

### Health and logs
- GET /health 200
- open `logs/app.log` locally and screenshot request/authentication log entries

## 7. Run automated tests

```powershell
npm test
```

Take a screenshot of the passing tests.

## 8. Deploy to Vercel

Import this GitHub repository into Vercel.

Add these Vercel Environment Variables:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV=production
```

Do not add `PORT` unless Vercel specifically requires it.

After deploy, test:

```text
https://<your-project>.vercel.app/health
```

Then change Postman `baseUrl` to the deployed URL and verify the main endpoints.

## 9. Export Postman

Export the final collection from Postman and keep the JSON file with the submission.

The repository already includes a ready-to-use collection; exporting again after your testing preserves any local changes.

## 10. Create DOCX

Create one DOCX with clear headings and screenshots in this order:

1. GitHub repository
2. Local /health
3. Signup
4. Login + JWT
5. Employee CRUD
6. Validation and errors
7. Two-user ownership test
8. Rate limiting
9. Helmet headers
10. MongoDB collections / relationship / hashed password
11. Local logs
12. Automated tests
13. Vercel deployment URL and deployed /health

## 11. Create ZIP

Before zipping, remove `node_modules`.

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
```

Then zip the project folder.

Make sure the ZIP still contains:

- source code
- README.md
- .env.example
- .gitignore
- Postman collection
- package.json
- package-lock.json
- Vercel configuration

Do not include:

- `.env`
- `node_modules`
- real secrets

## Final links

GitHub:

https://github.com/felipervm/101581203_COMP3123_Assignment1

Add the Vercel URL to the README and your DOCX once deployment is complete.
