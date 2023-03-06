const fastify = require('fastify')({ logger:  true });

const port = process.env.PORT || 3000;

fastify.get('/', async (request, reply) => {
  return { hello: 'world.' };
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