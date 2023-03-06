const fastify = require('fastify')({ logger:  true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

fastify.post('/account/create', async (request, reply) => {
  const account = request.body;

  const foundAccount = await prisma.account.findUnique({
    where: {
      username: account.username,
    },
  });

  if (foundAccount) {
    reply.code(409).send({ message: 'Username already exists.' });
  }

  const createdAccount = await prisma.account.create({
    data: {
      name: account.name,
      username: account.username,
      password: account.password,
    },
  });

  if (!createdAccount) {
    reply.code(500).send({ message: 'Account not created.' });
  }

  reply.code(201).send({ message: 'Account successfully created.' });
});

fastify.post('/task/create/:accountId', async (request, reply) => {
  const { accountId } = request.params;
  const task = request.body;

  const foundAccount = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!foundAccount) {
    reply.code(404).send({ message: 'Account not found.' });
  }

  const taskCreated = await prisma.task.create({
    data: {
      content: task.content,
      accountId,
    },
  });

  if (!taskCreated) {
    reply.code(500).send({ message: 'Task not created.' });
  }

  reply.code(201).send({ message: 'Task successfully created.' });
});

fastify.get('/task/find/:accountId', async (request, reply) => {
  const { accountId } = request.params;
  
  const foundAccount = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!foundAccount) {
    reply.code(404).send({ message: 'Account not found.' });
  }

  const foundTasks = await prisma.task.findMany({
    where: {
      accountId,
    },
  });

  reply.code(200).send(foundTasks);
});

fastify.patch('/task/update/:taskId', async (request, reply) => {
  const { taskId } = request.params;
  const task = request.body;

  const foundTask = await prisma.task.findUnique({
    id: taskId,
  });

  if (!foundTask) {
    reply.code(404).send({ message: 'Task not found.' });
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      content: task.content,
      finished: task.finished,
    },
  });

  if (!updatedTask) {
    reply.code(500).send({ message: 'Task not updated.' });
  }

  reply.code(200).send({ message: 'Task successfully updated.' });
});

const start = async () => {
  try {
    await fastify.listen({ port: port });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();