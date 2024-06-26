'use client';

import Link from 'next/link';

export default function TicketPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Open a Ticket</h1>
            <p className="text-lg text-gray-700 mb-6">This is a placeholder page for opening a ticket.</p>
            <Link // Remove the <a> tag
                href="/Issues"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Back to Issues
            </Link>
        </div>
    );
}
