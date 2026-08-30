"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  GraduationCap,
  Award,
  ChevronDown
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data for students
const studentsData = [
  {
    id: "STU-001",
    name: "Aarav Sharma",
    grade: "10th",
    section: "A",
    rollNo: "10A01",
    attendance: "95%",
    performance: "Excellent",
    status: "Present",
    parentContact: "+91 9876543210",
    avatar: "AS"
  },
  {
    id: "STU-002",
    name: "Priya Patel",
    grade: "10th",
    section: "A",
    rollNo: "10A02",
    attendance: "88%",
    performance: "Good",
    status: "Absent",
    parentContact: "+91 9876543211",
    avatar: "PP"
  },
  {
    id: "STU-003",
    name: "Rohan Kumar",
    grade: "10th",
    section: "B",
    rollNo: "10B14",
    attendance: "72%",
    performance: "Needs Improvement",
    status: "Present",
    parentContact: "+91 9876543212",
    avatar: "RK"
  },
  {
    id: "STU-004",
    name: "Ananya Singh",
    grade: "9th",
    section: "C",
    rollNo: "09C05",
    attendance: "99%",
    performance: "Outstanding",
    status: "Present",
    parentContact: "+91 9876543213",
    avatar: "AS"
  },
  {
    id: "STU-005",
    name: "Karan Desai",
    grade: "10th",
    section: "A",
    rollNo: "10A18",
    attendance: "85%",
    performance: "Good",
    status: "Present",
    parentContact: "+91 9876543214",
    avatar: "KD"
  },
  {
    id: "STU-006",
    name: "Neha Gupta",
    grade: "9th",
    section: "B",
    rollNo: "09B22",
    attendance: "91%",
    performance: "Excellent",
    status: "Present",
    parentContact: "+91 9876543215",
    avatar: "NG"
  }
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            My Students
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and monitor student performance and attendance.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Student Note
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              className="pl-9 bg-background/50 border-muted focus-visible:ring-cyan-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3 flex-1 md:justify-end">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-[150px] bg-background/50">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2 bg-background/50">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="group overflow-hidden border-border/50 hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 bg-card">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.avatar}`} />
                      <AvatarFallback className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight group-hover:text-cyan-600 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.id} • Class {student.grade} {student.section}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Add Note</DropdownMenuItem>
                      <DropdownMenuItem>Message Parent</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 my-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Attendance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{student.attendance}</span>
                      {parseInt(student.attendance) > 90 ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Good</Badge>
                      ) : parseInt(student.attendance) > 75 ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">Avg</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">Low</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Status</span>
                    <div className="mt-1">
                      {student.status === "Present" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 shadow-none dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                          Present
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0 shadow-none dark:text-red-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                          Absent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-secondary/50 hover:bg-secondary border-none">
                    <Award className="h-3.5 w-3.5 mr-1.5 text-cyan-600" />
                    Performance
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs bg-secondary/50 hover:bg-secondary border-none">
                    <Phone className="h-3.5 w-3.5 mr-1.5 text-cyan-600" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              We couldn&apos;t find any students matching your search criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery(""); setSelectedGrade("all");}}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
