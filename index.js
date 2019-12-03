const express = require("express");
const postsRouter = require("./routes/postsRouter");
const server = express();

const port = 4000;

server.use("/api/posts", postsRouter);

server.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
