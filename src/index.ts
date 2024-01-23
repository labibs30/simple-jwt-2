import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const app = express();
const PORT = 5009;
const prisma = new PrismaClient();
app.use(express.json());

// REGISTER
app.use("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json({
    message: "user created",
  });
});
//

app.use("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (!user.password) {
    return res.status(404).json({
      message: "Password not set",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    return res.json({
      data: {
        id: user.id,
        name: user.name,
        address: user.address,
      },
    });
  } else {
    return res.status(403).json({
      message: "Wrong password",
    });
  }
});

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
