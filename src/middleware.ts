import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const cookieStore = cookies();
  const token = cookieStore.get('next_demo_cookie')?.value;

  // const a = jwt.verify(token!, process.env.JWT_SECRET!);
  // console.log(a);

  // if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
  //   return NextResponse.redirect(new URL('/caralho', request.url));
  // }
  console.log(request.url);
  // if(request.url)

  console.log('Middleware is running'); // Check if this appears
  return NextResponse.next({});
  // const locale = request.headers.get("accept-language")?.split(",")[0] || "en";
  // const cookies = request.headers.get("cookie");

  // // You can set headers or cookies in response here if needed
  // const response = NextResponse.next();
  // response.headers.set("x-locale", locale);
  // response.headers.set("x-cookies", cookies);

  // return response;
}

export const config = {
  matcher: ['/', '/login', '/register', '/dick'], // Adjust the matcher to your routes
};
