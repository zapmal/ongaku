// validateJwt(request: Request & { user: Record<string, unknown> }) {
//   const authHeader = request.headers.authorization;
//   const SECRET = process.env.JWT_SECRET;

//   if (!authHeader || authHeader.startsWith('Bearer ')) {
//     return false;
//   }

//   const token = authHeader.split(' ')[1];
//   const user = verify(token, SECRET) as Record<string, unknown>;

//   request.user = user;

//   return true;
// }
