import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
const PORT = 5009;
const prisma = new PrismaClient();
app.use(express.json());
// CREATE
app.post("/users", async (req, res) => {
  const { name, email, address } = req.body;
  const result = await prisma.users.create({
    data: {
      name,
      email,
      address,
    },
  });
  res.json({ data: result, message: "Users Created" });
});

// READ
app.get("/users", async (req, res) => {
  const result = await prisma.users.findMany({
    select: { id: true, name: true, email: true, address: true },
  });

  res.json({ data: result, message: "Users List" });
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;
  const result = await prisma.users.update({
    where: { id: Number(id) },
    data: { name, email, address },
  });
  res.json({ data: result, message: `Users ${id} Updated` });
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.users.delete({ where: { id: Number(id) } });
  res.json({ data: result, message: `Users ${id} Deleted` });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
