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

const start = async () => {
  try {
    await fastify.listen({ port: port });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();