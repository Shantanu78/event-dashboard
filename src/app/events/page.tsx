import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { getAllEventsFromDB } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

export default async function EventsPage() {
    const session = await auth();
    const events = await getAllEventsFromDB();

    const pendingEvents = events.filter((e) =>
        ["SUBMITTED", "VP_APPROVED", "ADMIN_PENDING", "ADMIN_PENDING_SENIOR"].includes(
            e.status
        )
    );
    const approvedEvents = events.filter((e) => e.status === "APPROVED");
    const completedEvents = events.filter((e) =>
        ["COMPLETED", "CLOSED"].includes(e.status)
    );
    const rejectedEvents = events.filter((e) => e.status === "REJECTED");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Navbar user={session?.user} />

            <main className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">All Events</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse and manage all college events
                    </p>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="grid w-full max-w-lg grid-cols-5">
                        <TabsTrigger value="all" className="gap-1">
                            All
                            <Badge variant="secondary" className="ml-1">
                                {events.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="gap-1">
                            Pending
                            <Badge variant="secondary" className="ml-1">
                                {pendingEvents.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="gap-1">
                            Approved
                            <Badge variant="secondary" className="ml-1">
                                {approvedEvents.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="gap-1">
                            Done
                            <Badge variant="secondary" className="ml-1">
                                {completedEvents.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="gap-1">
                            Rejected
                            <Badge variant="secondary" className="ml-1">
                                {rejectedEvents.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {pendingEvents.length > 0 ? (
                                pendingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <p className="text-muted-foreground col-span-2 text-center py-8">
                                    No pending events
                                </p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {approvedEvents.length > 0 ? (
                                approvedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <p className="text-muted-foreground col-span-2 text-center py-8">
                                    No approved events
                                </p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {completedEvents.length > 0 ? (
                                completedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <p className="text-muted-foreground col-span-2 text-center py-8">
                                    No completed events
                                </p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {rejectedEvents.length > 0 ? (
                                rejectedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <p className="text-muted-foreground col-span-2 text-center py-8">
                                    No rejected events
                                </p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
