import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware is running"); // Check if this appears
  return NextResponse.next();
  // const locale = request.headers.get("accept-language")?.split(",")[0] || "en";
  // const cookies = request.headers.get("cookie");
  
  // // You can set headers or cookies in response here if needed
  // const response = NextResponse.next();
  // response.headers.set("x-locale", locale);
  // response.headers.set("x-cookies", cookies);

  // return response;
}

export const config = {
  matcher: "/", // Adjust the matcher to your routes
};
