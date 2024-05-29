import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  jwt_token_secret: process.env.JWT_TOKEN_SECRET,
  jwt_token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN,
  frontend_url: process.env.FRONTEND_URL,
};
