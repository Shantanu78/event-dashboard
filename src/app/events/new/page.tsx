"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Wallet, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewEventPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        venue: "",
        eventDate: "",
        eventTime: "",
        isMonetary: false,
        budget: 0,
        clubName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Event name is required");
            return;
        }

        if (!session?.user) {
            toast.error("Please sign in to create an event");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    venue: formData.venue,
                    eventDate: formData.eventDate ? new Date(`${formData.eventDate}T${formData.eventTime || "00:00"}`).toISOString() : null,
                    isMonetary: formData.isMonetary,
                    budget: formData.budget,
                    clubName: formData.clubName,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create event");
            }

            toast.success("Event submitted successfully!", {
                description: "Your event is now pending VP approval.",
            });

            router.push("/events");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create event");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Navbar user={session?.user} />

            <main className="container py-8 max-w-2xl">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <FileText className="h-6 w-6 text-blue-500" />
                            Create New Event
                        </CardTitle>
                        <CardDescription>
                            Fill in the details below to submit your event for approval
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Event Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Event Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Annual Tech Fest 2026"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Club Name */}
                            <div className="space-y-2">
                                <Label htmlFor="clubName">Organizing Club *</Label>
                                <Select
                                    value={formData.clubName}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, clubName: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your club" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech">Tech Club</SelectItem>
                                        <SelectItem value="cultural">Cultural Club</SelectItem>
                                        <SelectItem value="sports">Sports Club</SelectItem>
                                        <SelectItem value="entrepreneurship">E-Cell</SelectItem>
                                        <SelectItem value="photography">Photography Club</SelectItem>
                                        <SelectItem value="music">Music Club</SelectItem>
                                        <SelectItem value="drama">Drama Club</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your event, its objectives, and expected outcomes..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="eventDate" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Event Date
                                    </Label>
                                    <Input
                                        id="eventDate"
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, eventDate: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eventTime">Event Time</Label>
                                    <Input
                                        id="eventTime"
                                        type="time"
                                        value={formData.eventTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, eventTime: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="space-y-2">
                                <Label htmlFor="venue" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Venue
                                </Label>
                                <Input
                                    id="venue"
                                    placeholder="e.g., Main Auditorium, Conference Hall B"
                                    value={formData.venue}
                                    onChange={(e) =>
                                        setFormData({ ...formData, venue: e.target.value })
                                    }
                                />
                            </div>

                            {/* Budget Section */}
                            <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label className="flex items-center gap-2">
                                        <Wallet className="h-4 w-4" />
                                        Does this event require funding?
                                    </Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={formData.isMonetary ? "default" : "outline"}
                                            size="sm"
                                            onClick={() =>
                                                setFormData({ ...formData, isMonetary: true })
                                            }
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={!formData.isMonetary ? "default" : "outline"}
                                            size="sm"
                                            onClick={() =>
                                                setFormData({ ...formData, isMonetary: false, budget: 0 })
                                            }
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>

                                {formData.isMonetary && (
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Estimated Budget (₹)</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            placeholder="e.g., 50000"
                                            value={formData.budget || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    budget: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Note: Monetary events require additional approval from Senior Admin
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit for Approval"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
