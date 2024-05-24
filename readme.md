# Lost and Found System Backend

This is a lost item management backend project. User can register and manage their profile. User can report found items, claim a lost item from the reported items, track their claim status and search lost items with a robust filterring system.

### [Live Site Link](https://gadgets-inventory-management-backend.vercel.app)

## Technology

1.  NodeJS
2.  ExpressJS
3.  Prisma
4.  TypeScript
5.  Jsonwebtoken

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).
- Postgress (optional: if you want to use local database).

### Installation

1. Clone this repo:
   - `git clone https://github.com/Porgramming-Hero-web-course/l2-b2-fullstack-track-assignment-8-NaZmuZ-SaKiB`
2. Install all necessary dependencies:
   - `cd l2-b2-fullstack-track-assignment-8-NaZmuZ-SaKiB`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

   - `NODE_ENV` = development/ production
   - `PORT` = (any port number)
   - `DATABASE_URL` = (your database url for connection)
   - `JWT_TOKEN_SECRET` = secret for jwt
   - `JWT_TOKEN_EXPIRES_IN` = jwt expire time

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:
   - `npm run start` or `yarn start`

## API Documentation

### `POST /api/register`

User Registration.

**Body** raw (json)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "profile": {
    "bio": "Passionate about helping people find their lost items.",
    "age": 30
  }
}
```

### `POST /api/login`

User Login.

**Body** raw (json)

```json
{
  "email": "john@example.com",
  "password": "password"
}
```

### `POST /api/found-item-categories`

Create new Category for found items.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

**Body** raw (json)

```json
{
  "name": "Electronics"
}
```

### `POST /api/found-items`

Create new found item.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

**Body** raw (json)

```json
{
  "categoryId": "9deaf54e-3f4f-4b50-9902-6c272f73db4a",
  "foundItemName": "iPhone 12 Pro",
  "description": "Lost iPhone 12 Pro, some other information about the item",
  "location": "Rampura, Banssree"
}
```

### `GET /api/found-items`

Get Paginated and Filtered Found Items.

**Query Parameters**

- page
- limit
- sortBy (foundItemName, category, foundDate)
- sortOrder (asc | desc)
- searchTerm
- foundItemName

### `POST /api/claims`

Create new claim.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

**Body** raw (json)

```json
{
  "foundItemId": "9deaf54e-3f4f-4b50-9902-6c272f73db4a",
  "distinguishingFeatures": "My phone has a small scratch on the back cover.",
  "lostDate": "2024-03-25T10:00:00Z"
}
```

### `GET /api/claims`

Get all claims.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

### `PUT /api/claims`

Update claim status.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

**Body** raw (json)

```json
{
  "status": "APPROVED"
}
```

### `GET /api/my-profile`

Get logged in user's profile info.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

### `PUT /api/my-profile`

Update profile info like bio and age.

**Request Headers**

```
Authorization: <JWT_TOKEN>
```

**Body** raw (json)

```json
{
  "bio": "Updated bio text",
  "age": 35
}
```

## Success Response

```json
{
  "success": true,
  "statusCode": "status code",
  "message": "success message",
  "data": "data",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 40
  }
}
```

## Error Response

```json
{
  "success": false,
  "message": "error message",
  "errorDetails": "Error Details"
}
```

## Deployment

1. Build the project.
2. Install Vercel CLI:
   - `npm i -g vercel` or `yarn global add vercel`
3. Log in to vercel:
   - `vercel login`
4. For first time deploy run `vercel`
5. For next deploys:
   - Build the project each time.
   - Run: `vercel --prod`
