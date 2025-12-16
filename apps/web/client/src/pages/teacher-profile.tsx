import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  BookOpen,
  Users,
  Star,
  Award,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  ExternalLink,
  GraduationCap,
  TrendingUp,
  Trophy,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Code,
  Brain,
  Target
} from "lucide-react";

interface TeacherProfile {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  specialization: string[];
  experience: number; // years
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalReviews: number;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
  };
  achievements: string[];
  stats: {
    coursesCreated: number;
    studentsTaught: number;
    avgRating: number;
    totalHours: number;
    certifications: string[];
  };
}

interface CoursePreview {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  tags: string[];
  lastUpdated: string;
}

interface Review {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  courseTitle: string;
  createdAt: string;
  helpful: number;
}

export default function TeacherProfilePage() {
  const { teacherId } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock teacher data - in real app, fetch from API
  const teacher: TeacherProfile = {
    id: teacherId || "teacher-1",
    name: "Dr. Sarah Johnson",
    avatar: "SJ",
    bio: "Experienced educator with 8+ years teaching Mathematics and Computer Science. Passionate about making complex concepts accessible and fostering critical thinking in students.",
    specialization: ["Mathematics", "Computer Science", "Data Structures", "Algorithms"],
    experience: 8,
    rating: 4.8,
    totalStudents: 15420,
    totalCourses: 12,
    totalReviews: 2847,
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      website: "https://sarahjohnson.teach"
    },
    achievements: ["Top Instructor 2024", "100K+ Students", "5-Star Rating", "Course Creator"],
    stats: {
      coursesCreated: 12,
      studentsTaught: 15420,
      avgRating: 4.8,
      totalHours: 156,
      certifications: ["PhD Mathematics", "MSc Computer Science", "Certified Educator"]
    }
  };

  const courses: CoursePreview[] = [
    {
      id: "course-1",
      title: "Advanced Calculus: From Theory to Applications",
      description: "Master differential equations, integrals, and real-world applications of advanced calculus concepts.",
      thumbnail: "/api/placeholder/400/250",
      rating: 4.9,
      students: 2847,
      duration: "24 hours",
      level: "advanced",
      price: 89.99,
      tags: ["calculus", "mathematics", "advanced"],
      lastUpdated: "2024-01-15"
    },
    {
      id: "course-2",
      title: "Data Structures & Algorithms in Python",
      description: "Comprehensive guide to essential data structures and algorithms with Python implementations.",
      thumbnail: "/api/placeholder/400/250",
      rating: 4.7,
      students: 5231,
      duration: "32 hours",
      level: "intermediate",
      price: 99.99,
      tags: ["python", "algorithms", "data-structures"],
      lastUpdated: "2024-02-20"
    },
    {
      id: "course-3",
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, algorithms, and practical implementations.",
      thumbnail: "/api/placeholder/400/250",
      rating: 4.8,
      students: 3892,
      duration: "28 hours",
      level: "intermediate",
      price: 79.99,
      tags: ["machine-learning", "ai", "python"],
      lastUpdated: "2024-03-10"
    }
  ];

  const reviews: Review[] = [
    {
      id: "review-1",
      studentName: "Alex Chen",
      studentAvatar: "AC",
      rating: 5,
      comment: "Dr. Johnson's explanations are incredibly clear and thorough. The course structure makes complex topics much more approachable.",
      courseTitle: "Advanced Calculus",
      createdAt: "2024-01-20",
      helpful: 24
    },
    {
      id: "review-2",
      studentName: "Maria Rodriguez",
      studentAvatar: "MR",
      rating: 5,
      comment: "Outstanding course! The practical examples and coding exercises really helped solidify my understanding of data structures.",
      courseTitle: "Data Structures & Algorithms",
      createdAt: "2024-02-15",
      helpful: 18
    }
  ];

  const handleFollow = () => {
    toast({
      title: "Following Dr. Sarah Johnson",
      description: "You'll receive updates about new courses and content."
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to the instructor."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Profile link copied",
      description: "Share this profile with others!"
    });
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-500",
      intermediate: "bg-yellow-500",
      advanced: "bg-red-500"
    };
    return colors[level as keyof typeof colors] || "bg-gray-500";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="text-2xl">{teacher.avatar}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{teacher.experience} years experience</span>
                </div>
                <p className="text-muted-foreground mb-4 max-w-2xl">{teacher.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.specialization.map(spec => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button onClick={handleFollow}>
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {renderStars(teacher.rating)}
                </div>
                <div className="text-2xl font-bold">{teacher.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{teacher.totalStudents.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{teacher.totalCourses}</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{teacher.totalReviews.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses ({teacher.totalCourses})
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews ({teacher.totalReviews})
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-muted-foreground" />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(course.rating)}
                      <span className="text-sm font-medium ml-1">{course.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({course.students.toLocaleString()} students)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getLevelBadge(course.level)}>{course.level}</Badge>
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${course.price}</span>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Professional Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-muted-foreground">{teacher.experience} years teaching</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="space-y-2">
                    {teacher.stats.certifications.map(cert => (
                      <div key={cert} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specialization.map(spec => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {teacher.stats.coursesCreated}
                    </div>
                    <div className="text-sm text-muted-foreground">Courses Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {teacher.stats.studentsTaught.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Students Taught</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Rating</span>
                    <span className="text-sm font-medium">{teacher.stats.avgRating}/5.0</span>
                  </div>
                  <Progress value={teacher.stats.avgRating * 20} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Teaching Hours</span>
                    <span className="text-sm font-medium">{teacher.stats.totalHours}h</span>
                  </div>
                  <Progress value={(teacher.stats.totalHours / 200) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {teacher.socialLinks.website && (
                  <Button variant="outline" asChild>
                    <a href={teacher.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {teacher.socialLinks.linkedin && (
                  <Button variant="outline" asChild>
                    <a href={teacher.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                )}
                {teacher.socialLinks.github && (
                  <Button variant="outline" asChild>
                    <a href={teacher.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{review.studentAvatar}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{review.studentName}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            in {review.courseTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-3">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          👍 Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.achievements.map((achievement, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{achievement}</h3>
                  <Badge variant="secondary">Unlocked</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
