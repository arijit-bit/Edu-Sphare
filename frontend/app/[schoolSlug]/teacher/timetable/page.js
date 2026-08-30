"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Video,
  MoreHorizontal
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy data for timetable
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"
];

const scheduleData = [
  {
    id: 1,
    day: "Monday",
    time: "08:00 AM",
    duration: 1, // in slots
    subject: "Mathematics",
    class: "10th - Section A",
    room: "Room 302",
    type: "Theory",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    iconColor: "text-cyan-500"
  },
  {
    id: 2,
    day: "Monday",
    time: "10:00 AM",
    duration: 1,
    subject: "Physics",
    class: "11th - Science",
    room: "Lab 2",
    type: "Practical",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    iconColor: "text-emerald-500"
  },
  {
    id: 3,
    day: "Tuesday",
    time: "09:00 AM",
    duration: 2,
    subject: "Mathematics",
    class: "12th - Commerce",
    room: "Room 405",
    type: "Theory",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    iconColor: "text-cyan-500"
  },
  {
    id: 4,
    day: "Wednesday",
    time: "11:00 AM",
    duration: 1,
    subject: "Staff Meeting",
    class: "All Faculty",
    room: "Conference Hall",
    type: "Meeting",
    color: "from-purple-500/20 to-fuchsia-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
    iconColor: "text-purple-500"
  },
  {
    id: 5,
    day: "Thursday",
    time: "01:00 PM",
    duration: 1,
    subject: "Mathematics (Remedial)",
    class: "10th - Mixed",
    room: "Online",
    type: "Online",
    color: "from-orange-500/20 to-amber-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
    iconColor: "text-orange-500"
  },
  {
    id: 6,
    day: "Friday",
    time: "08:00 AM",
    duration: 1,
    subject: "Mathematics",
    class: "10th - Section B",
    room: "Room 304",
    type: "Theory",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    iconColor: "text-cyan-500"
  }
];

export default function TimetablePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format for displaying current week (dummy logic for visual purposes)
  const formatWeek = () => {
    return "October 16 - October 21, 2023";
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            My Timetable
          </h2>
          <p className="text-muted-foreground mt-1">
            View and manage your weekly class schedule.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-xl border shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 font-medium">
            <CalendarIcon className="h-4 w-4 text-cyan-600" />
            <span className="text-sm">{formatWeek()}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="h-6 w-px bg-border mx-1"></div>
          
          <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
            Today
          </Button>
        </div>
      </div>

      {/* Stats/Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-xl font-bold">18/week</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teaching Hours</p>
              <p className="text-xl font-bold">16 hrs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meetings</p>
              <p className="text-xl font-bold">2/week</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col justify-center gap-2 p-4 bg-card/30 rounded-xl border-dashed border-2 border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Legend</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 text-[10px]">Theory</Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 text-[10px]">Practical</Badge>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/50 text-[10px]">Online</Badge>
          </div>
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <Card className="border-none shadow-lg overflow-hidden bg-card/80 backdrop-blur-md hidden lg:block">
        <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-muted/50 border-b border-border/50">
          <div className="p-4 flex items-center justify-center border-r border-border/50">
            <Clock className="h-5 w-5 text-muted-foreground opacity-50" />
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-4 text-center border-r border-border/50 last:border-0">
              <span className="font-semibold text-sm block">{day}</span>
            </div>
          ))}
        </div>
        
        <div className="relative">
          {/* Grid lines & Time slots */}
          {timeSlots.map((time, index) => (
            <div key={time} className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-border/50 last:border-0 relative h-24">
              <div className="p-3 text-xs font-medium text-muted-foreground text-center border-r border-border/50 flex flex-col justify-center bg-muted/20">
                {time}
              </div>
              {daysOfWeek.map((day) => (
                <div key={`${day}-${time}`} className="border-r border-border/50 border-dashed last:border-0 h-full p-1 group transition-colors hover:bg-muted/10 relative">
                  {/* Empty cell */}
                </div>
              ))}
            </div>
          ))}

          {/* Schedule Events (Absolute positioned over the grid) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {scheduleData.map((item) => {
              const dayIndex = daysOfWeek.indexOf(item.day);
              const timeIndex = timeSlots.indexOf(item.time);
              
              if (dayIndex === -1 || timeIndex === -1) return null;
              
              const top = `${timeIndex * 96}px`; // 96px is h-24
              const height = `${item.duration * 96 - 8}px`; // Subtract 8px for gap
              const left = `calc(100px + ${dayIndex} * ((100% - 100px) / 6))`;
              const width = `calc((100% - 100px) / 6 - 8px)`;
              
              return (
                <div 
                  key={item.id}
                  className={cn(
                    "absolute ml-1 mt-1 rounded-xl border p-3 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all pointer-events-auto cursor-pointer group hover:z-10 bg-gradient-to-br backdrop-blur-md",
                    item.color
                  )}
                  style={{ top, left, width, height }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm leading-tight truncate pr-2">{item.subject}</span>
                      {item.type === 'Online' ? (
                        <Video className={cn("h-3.5 w-3.5 shrink-0 opacity-70", item.iconColor)} />
                      ) : (
                        <MoreHorizontal className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span className="text-xs font-medium opacity-80 block truncate">{item.class}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2 bg-background/50 rounded-md px-2 py-1 w-fit border border-current/10">
                    <MapPin className={cn("h-3 w-3", item.iconColor)} />
                    <span className="text-[10px] font-semibold">{item.room}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Mobile/Tablet List View */}
      <div className="lg:hidden space-y-6">
        {daysOfWeek.map(day => {
          const dayEvents = scheduleData.filter(item => item.day === day).sort((a, b) => {
             return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
          });
          
          if (dayEvents.length === 0) return null;
          
          return (
            <div key={day} className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-cyan-500"></span>
                {day}
              </h3>
              
              <div className="space-y-3 pl-3">
                {dayEvents.map(event => (
                  <Card key={event.id} className="border-none shadow-sm overflow-hidden bg-card/80">
                    <div className={cn("h-1 w-full bg-gradient-to-r", event.color.split(' ')[0])}></div>
                    <CardContent className="p-4 flex gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[70px] border-r pr-4 border-border/50">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">{event.time.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.time.split(' ')[0]}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm">{event.subject}</h4>
                          <Badge variant="outline" className={cn("text-[10px] bg-background", event.color)}>{event.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{event.class}</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin className={cn("h-3.5 w-3.5", event.iconColor)} />
                          <span>{event.room}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
