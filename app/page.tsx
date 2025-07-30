"use client";

import type React from "react";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Users,
  BarChart3,
  Coffee,
  Heart,
  MessageCircle,
  Clock,
  User,
  LogOut,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const initialPosts: Post[] = [
  {
    id: 0,
    title: "[공지] BamBoo하우스 이용 안내",
    content:
      "안녕하세요! BamBoo하우스에 오신 것을 환영합니다. 이곳은 웹 개발팀과 데이터 분석팀이 함께 소통할 수 있는 익명 공간입니다. 서로 존중하며 건설적인 대화를 나누어 주세요.",
    category: "공지사항",
    timestamp: "1주 전",
    likes: 45,
    comments: 3,
    isLiked: false,
  },
  {
    id: 1,
    title: "새로운 프레임워크 도입에 대한 고민",
    content:
      "팀에서 React에서 Next.js로 전환을 고려하고 있는데, 러닝 커브가 걱정됩니다. 경험 있으신 분들의 조언 부탁드려요.",
    category: "웹 개발팀",
    timestamp: "2시간 전",
    likes: 12,
    comments: 8,
    isLiked: false,
  },
  {
    id: 2,
    title: "데이터 시각화 툴 추천해주세요",
    content:
      "대시보드 제작을 위한 데이터 시각화 툴을 찾고 있습니다. D3.js vs Chart.js vs 기타 라이브러리들 중에서 어떤 게 좋을까요?",
    category: "데이터 분석팀",
    timestamp: "4시간 전",
    likes: 8,
    comments: 15,
    isLiked: true,
  },
  {
    id: 3,
    title: "야근이 너무 많아서 힘들어요",
    content:
      "요즘 프로젝트 데드라인 때문에 야근이 너무 많습니다. 다들 어떻게 워라밸을 맞추고 계신가요?",
    category: "일반",
    timestamp: "6시간 전",
    likes: 24,
    comments: 12,
    isLiked: false,
  },
  {
    id: 4,
    title: "SQL 쿼리 최적화 팁 공유",
    content:
      "대용량 데이터 처리할 때 쿼리 성능 개선 방법들을 정리해봤습니다. 인덱스 활용법과 조인 최적화 등...",
    category: "데이터 분석팀",
    timestamp: "1일 전",
    likes: 18,
    comments: 6,
    isLiked: false,
  },
  {
    id: 5,
    title: "코드 리뷰 문화 개선하고 싶어요",
    content:
      "팀 내 코드 리뷰가 형식적으로 이루어지고 있는 것 같아요. 더 건설적인 리뷰 문화를 만들려면 어떻게 해야 할까요?",
    category: "웹 개발팀",
    timestamp: "1일 전",
    likes: 15,
    comments: 9,
    isLiked: true,
  },
];

const categories = [
  { value: "all", label: "전체", icon: MessageSquare },
  { value: "공지사항", label: "공지사항", icon: Users },
  { value: "웹 개발팀", label: "웹 개발팀", icon: Users },
  { value: "데이터 분석팀", label: "데이터 분석팀", icon: BarChart3 },
  { value: "일반", label: "일반", icon: Coffee },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "공지사항":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "웹 개발팀":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "데이터 분석팀":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "일반":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export default function BambooForestBoard() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.category) {
      const post: Post = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        timestamp: "방금 전",
        likes: 0,
        comments: 0,
        isLiked: false,
      };
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "", category: "" });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BamBoo하우스
                </h1>
                <p className="text-sm text-gray-600">
                  {isLoggedIn ? `${username}님, 안녕하세요!` : "익명 소통 공간"}
                </p>
              </div>
            </div>

            {/* 검색창 추가 */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    글쓰기
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>새 글 작성</DialogTitle>
                    <DialogDescription>
                      익명으로 고민이나 이야기를 공유해보세요.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) =>
                          setNewPost({ ...newPost, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="공지사항">공지사항</SelectItem>
                          <SelectItem value="웹 개발팀">웹 개발팀</SelectItem>
                          <SelectItem value="데이터 분석팀">
                            데이터 분석팀
                          </SelectItem>
                          <SelectItem value="일반">일반</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">제목</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) =>
                          setNewPost({ ...newPost, title: e.target.value })
                        }
                        placeholder="제목을 입력하세요"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">내용</Label>
                      <Textarea
                        id="content"
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        placeholder="내용을 입력하세요"
                        rows={6}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        취소
                      </Button>
                      <Button type="submit">게시하기</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {isLoggedIn ? (
                <>
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    마이페이지
                  </Button>
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUsername("");
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUsername("익명사용자");
                  }}
                >
                  로그인
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">카테고리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start gap-2"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전체 글</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">공지사항</span>
                  <span className="font-semibold">
                    {posts.filter((p) => p.category === "공지사항").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">웹 개발팀</span>
                  <span className="font-semibold">
                    {posts.filter((p) => p.category === "웹 개발팀").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">데이터 분석팀</span>
                  <span className="font-semibold">
                    {posts.filter((p) => p.category === "데이터 분석팀").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">일반</span>
                  <span className="font-semibold">
                    {posts.filter((p) => p.category === "일반").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {post.timestamp}
                          </div>
                        </div>
                        <CardTitle className="text-lg mb-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {post.content}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-1 ${
                            post.isLiked ? "text-red-600" : "text-gray-600"
                          }`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              post.isLiked ? "fill-current" : ""
                            }`}
                          />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-gray-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        자세히 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {searchQuery ? (
                    <>
                      <p className="text-gray-600">
                        "{searchQuery}"에 대한 검색 결과가 없습니다.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        다른 키워드로 검색해보세요.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">아직 게시글이 없습니다.</p>
                      <p className="text-sm text-gray-500 mt-1">
                        첫 번째 글을 작성해보세요!
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
