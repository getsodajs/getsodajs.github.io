export interface Step {
  title: string
  note: string
  code: string
}

export const steps: Step[] = [
  {
    title: 'Values',
    note: 'List what a route needs: it arrives read, converted and validated, or the request gets a `400`. Or take the context and read it yourself.',
    code: "@Get(':id', [param('id', int)])\nfindOne(id: number) {\n  return this.#users.find(id)\n}\n\n// or read it from the context\n@Get(':id')\nfindOne(ctx: Context<':id'>) {\n  return this.#users.find(ctx.param('id'))\n}",
  },
  {
    title: 'Routes',
    note: 'A decorator for every HTTP method, `@Route` for any other. Paths join the controller\'s.',
    code: "@Controller('users')\nexport class UsersController {\n  @Get() list() {}\n  @Post() create() {}\n  @Put(':id') replace() {}\n  @Patch(':id') update() {}\n  @Delete(':id') remove() {}\n  @All('legacy/*') legacy() {}\n}",
  },
  {
    title: 'Pipeline',
    note: 'Guards decide, interceptors wrap the handler, filters turn errors into responses. On a class or on a method.',
    code: '@UseGuards(AuthGuard)\n@UseInterceptors(TimingInterceptor)\n@UseFilters(NotFoundFilter)\nexport class AdminController {}',
  },
  {
    title: 'Response',
    note: 'The status and fixed headers, declared next to the route.',
    code: "@Delete(':id', [param('id', int)])\n@HttpCode(204)\n@Header('cache-control', 'no-store')\nremove(id: number) {}",
  },
  {
    title: 'Rate limits',
    note: 'Per route, over the global limits. Past them, `429` with `Retry-After`.',
    code: "@Post('login')\n@Throttle({ default: { limit: 5, ttl: 60_000 } })\nlogin() {}",
  },
  {
    title: 'Streams',
    note: 'Return an async generator: it is streamed as server-sent events, and stopped when the client leaves.',
    code: "@Sse('ticks')\nasync *ticks(): AsyncGenerator<SseMessage> {\n  for (let i = 0; ; i++) {\n    yield { data: { tick: i } }\n    await Bun.sleep(1000)\n  }\n}",
  },
  {
    title: 'Your own',
    note: '`createDecorator()` stores a value on a route; a guard reads it with `ctx.metadata()`.',
    code: "export const Roles = createDecorator<string[]>('Roles')\n\n@Delete(':id', [param('id', int)])\n@Roles(['admin'])\n@UseGuards(AuthGuard, RolesGuard)\nremove(id: number) {}",
  },
]

export type Size = 'big' | 'wide' | 'medium' | 'small'

export interface Item {
  path: string
  name: string
  text: string
  code?: string
  href: string
  size: Size
}

export const included = (doc: (path: string) => string): Item[] => [
  {
    path: '@getsoda/core/openapi',
    name: 'OpenAPI',
    text: 'The document and a Swagger UI page from the parsers and schemas that already validate your routes. Nothing written twice.',
    code: "OpenApiModule.forRoot({\n  info: { title: 'Shop', version: '1.0.0' },\n  ui: '/docs',\n})",
    href: doc('openapi'),
    size: 'big',
  },
  {
    path: '@getsoda/core/jwt',
    name: 'JWT',
    text: 'Signs and verifies with WebCrypto, without dependencies. The algorithm comes from the options, never from the token.',
    code: "@Get('me', [value(JWT_PAYLOAD)])\n@UseGuards(JwtGuard)\nme(payload: JwtPayload) {}",
    href: doc('authentication'),
    size: 'big',
  },
  {
    path: '@getsoda/core/throttler',
    name: 'Rate limiting',
    text: 'Per client and route, `429` with `Retry-After`.',
    code: '@Throttle({ default: { limit: 5, ttl: 60_000 } })',
    href: doc('rate-limiting'),
    size: 'wide',
  },
  {
    path: '@getsoda/core/cqrs',
    name: 'CQRS',
    text: 'Command, query and event buses. `execute()` resolves with the type the command declares.',
    href: `${doc('cqrs')}`,
    size: 'small',
  },
  {
    path: '@getsoda/core/testing',
    name: 'Testing',
    text: 'The app on a free port, any provider replaced.',
    code: 'createTestApp(AppModule, { overrides })',
    href: doc('testing'),
    size: 'wide',
  },
  {
    path: '@getsoda/core',
    name: 'WebSockets',
    text: "Gateways on Bun's native WebSockets and pub/sub.",
    code: "@WebSocketGateway('/chat')",
    href: doc('websockets'),
    size: 'medium',
  },
  {
    path: '@getsoda/core',
    name: 'Server-sent events',
    text: 'An async generator, streamed as `text/event-stream`.',
    code: "@Sse('ticks')",
    href: `${doc('controllers')}#server-sent-events`,
    size: 'medium',
  },
  {
    path: '@getsoda/core',
    name: 'Configuration',
    text: 'The environment as a schema, validated at startup, injected with its type.',
    href: doc('configuration'),
    size: 'small',
  },
  {
    path: '@getsoda/core',
    name: 'Cookies',
    text: "Bun's `CookieMap`, and signed cookies a client can read but not forge.",
    href: `${doc('authentication')}#cookies`,
    size: 'small',
  },
  {
    path: '@getsoda/core',
    name: 'Logging',
    text: 'An injectable `Logger` with levels and contexts, lines or JSON.',
    href: doc('logging'),
    size: 'small',
  },
  {
    path: '@getsoda/core',
    name: 'Graceful shutdown',
    text: 'Requests in flight finish before services are destroyed.',
    href: `${doc('production')}#shutdown`,
    size: 'small',
  },
  {
    path: '@getsoda/core',
    name: 'CORS',
    text: 'Middleware that runs before routing, preflights included.',
    href: `${doc('request-pipeline')}#cors`,
    size: 'small',
  },
  {
    path: 'bun dev',
    name: 'Hot reload',
    text: 'Runs with `bun --hot`: changes apply without a restart.',
    href: `${doc('getting-started')}#scripts`,
    size: 'small',
  },
]
