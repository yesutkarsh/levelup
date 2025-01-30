import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    // If user is not authenticated, redirect to home page
    if (!isUserAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Get the current user if authenticated
    const user = await getUser();

    // Check if user is approved
    async function isApproved(user) {
        try {
            const response = await fetch('http://localhost:3000/api/userStatus/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'email': `"${user.email}"` // Wrap email in double quotes
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.approved || false; // Default to false if approved is not set
        } catch (error) {
            console.error("Error checking approval status:", error);
            return false; // Assume not approved if there's an error
        }
    }

    const userIsApproved = await isApproved(user);
    const isProfilePage = request.nextUrl.pathname === '/Profile';

    // If user is authenticated but not approved
    if (!userIsApproved) {
        // Allow access to profile page
        if (isProfilePage) {
            return NextResponse.next();
        }
        // Redirect to profile page for all other routes
        return NextResponse.redirect(new URL('/Profile', request.url));
    }

    // If user is both authenticated and approved, allow access to all pages
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - Root route (/)
         * - api routes (/api/*)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!$|api|_next/static|_next/image|favicon.ico).*)',
    ],
};