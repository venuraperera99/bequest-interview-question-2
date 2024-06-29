import crypto from "crypto";
import express, { Request, Response } from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
let database: { data: string; checksum: string } = { data: "Hello World", checksum: "" };
let versions: { data: string; checksum: string }[] = [];

app.use(cors());
app.use(express.json());

const calculateChecksum = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

database.checksum = calculateChecksum(database.data);

app.get("/", (req: Request, res: Response) => {
  res.json(database);
});

app.get("/versions", (req: Request, res: Response) => {
  res.json(versions);
});

app.post("/", (req: Request, res: Response) => {
  versions.push({ ...database });
  database.data = req.body.data;
  database.checksum = calculateChecksum(database.data);
  res.sendStatus(200);
});

app.post("/rollback", (req: Request, res: Response) => {
  const { version } = req.body;
  if (versions[version]) {
    database = versions[version];
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
