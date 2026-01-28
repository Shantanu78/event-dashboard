import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllEventsFromDB, getEventStatsFromDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  let events: any[] = [];
  let stats = { total: 0, pending: 0, approved: 0, completed: 0, rejected: 0 };
  let session: any = null;
  let userRole = null;
  let error = null;

  try {
    session = await auth();
    events = await getAllEventsFromDB();
    stats = await getEventStatsFromDB();

    // Get user role from database
    if (session?.user?.email) {
      const user = await prisma.user.findFirst({
        where: { email: { equals: session.user.email, mode: 'insensitive' } },
        select: { role: true },
      });
      userRole = user?.role;
    }
  } catch (e: any) {
    console.error("Dashboard Data Fetch Error:", e);
    error = e.message || "Failed to load dashboard data";
  }

  const canCreateEvents = userRole === 'PRESIDENT';

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-red-200">
          <h1 className="text-xl font-bold text-red-600 mb-2">System Error</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            The dashboard could not be loaded. This is likely due to a database connection issue or missing configuration.
          </p>
          <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded text-xs font-mono overflow-auto max-h-40 mb-4">
            {error}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Troubleshooting:</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-slate-500">
              <li>Check <code className="bg-slate-200 px-1 rounded">DATABASE_URL</code> in Vercel Environment Variables.</li>
              <li>Ensure database migrations have been run (tables must exist).</li>
              <li>Check <a href="/api/diagnostics" className="text-blue-500 hover:underline">/api/diagnostics</a> for details.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Get recent events (last 5)
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  // Get upcoming events
  const upcomingEvents = events
    .filter(
      (e) =>
        e.eventDate &&
        new Date(e.eventDate) > new Date() &&
        !["REJECTED", "CLOSED"].includes(e.status)
    )
    .sort(
      (a, b) =>
        new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime()
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar user={session?.user} />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Event Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all college events in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.total}</span>
                <TrendingUp className="h-8 w-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.pending}</span>
                <Clock className="h-8 w-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.approved}</span>
                <CheckCircle2 className="h-8 w-8 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stats.completed}</span>
                <Calendar className="h-8 w-8 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Recent Activity */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Badge variant="secondary">{recentEvents.length} events</Badge>
            </div>
            <div className="grid gap-4">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full xl:w-80 shrink-0 space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                        {new Date(event.eventDate!).getDate()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{event.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.eventDate!).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No upcoming events
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canCreateEvents && (
                  <a
                    href="/events/new"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
                  >
                    <span className="text-2xl">+</span>
                    <span className="font-medium">Create New Event</span>
                  </a>
                )}
                <a
                  href="/events"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">📋</span>
                  <span className="font-medium">View All Events</span>
                </a>
                {userRole && ['VP_CLUBS', 'ADMIN', 'SENIOR_ADMIN'].includes(userRole) && (
                  <a
                    href="/approvals"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                  >
                    <span className="text-2xl">✓</span>
                    <span className="font-medium">Review Approvals</span>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
