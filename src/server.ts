import config from "./app/config";
import app from "./app";

const port = config.port || 5050;

async function runServer() {
  app.listen(port, () => {
    console.log(`🚀 App is running on port ${port}`);
  });
}

runServer().catch((error) => {
  console.log(error?.message || "😈 Server Crashed");
});
