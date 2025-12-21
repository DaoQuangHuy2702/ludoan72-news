import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api, { getMediaUrl } from "@/lib/api";
import { FileText, Image as ImageIcon, Loader2, Upload } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Tiêu đề phải có ít nhất 5 ký tự.",
    }),
    type: z.enum(["NEWS", "ACTIVITY"], {
        required_error: "Vui lòng chọn loại bài viết.",
    }),
    excerpt: z.string().optional(),
    content: z.string().min(20, {
        message: "Nội dung bài viết không được để trống.",
    }),
    categoryId: z.string({
        required_error: "Vui lòng chọn danh mục.",
    }),
    thumbnail: z.string().min(1, {
        message: "Vui lòng upload ảnh đại diện.",
    }),
});

interface Category {
    id: string;
    name: string;
}

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            type: "NEWS",
            excerpt: "",
            content: "",
            categoryId: "",
            thumbnail: "",
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/cms/categories', { params: { size: 100 } });
                if (response.data && response.data.success) {
                    setCategories(response.data.data.content);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Không thể tải danh sách danh mục");
            }
        };

        const fetchArticle = async () => {
            if (isEditMode && id) {
                setLoading(true);
                try {
                    const response = await api.get(`/cms/articles/${id}`);
                    if (response.data && response.data.data) {
                        const data = response.data.data;
                        form.reset({
                            title: data.title,
                            type: data.type || "NEWS",
                            excerpt: data.excerpt || "",
                            content: data.content || "",
                            categoryId: data.category?.id || "",
                            thumbnail: data.thumbnail || "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch article:", error);
                    toast.error("Không tìm thấy thông tin bài viết");
                    navigate("/admin/articles");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCategories();
        fetchArticle();
    }, [id, isEditMode, form, navigate]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File quá lớn. Vui lòng chọn file dưới 5MB.");
            return;
        }

        setSelectedFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));

        // Clear input value to allow selecting same file again
        if (event.target) event.target.value = "";
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await api.post("/cms/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.success) {
                form.setValue("thumbnail", response.data.data);
                toast.success("Upload ảnh thành công");
                // Clear local selection after successful upload
                setSelectedFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleCancelSelection = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            if (isEditMode && id) {
                const response = await api.put(`/cms/articles/${id}`, values);
                toast.success(response.data.message || "Cập nhật thành công!");
            } else {
                const response = await api.post("/cms/articles", values);
                toast.success(response.data.message || "Đăng bài thành công!");
            }
            navigate("/admin/articles");
        } catch (error: any) {
            console.error("Submit failed:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/admin/articles")}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiêu đề <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tiêu đề bài viết..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Loại bài viết <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn loại" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="NEWS">Tin tức</SelectItem>
                                                        <SelectItem value="ACTIVITY">Hoạt động</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Danh mục <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="thumbnail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ảnh đại diện <span className="text-red-500">*</span></FormLabel>
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Sẽ tự động điền khi upload..."
                                                        readOnly
                                                        {...field}
                                                        className="bg-muted text-xs"
                                                    />
                                                    {!selectedFile ? (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={uploading}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" /> Chọn ảnh
                                                        </Button>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="default"
                                                                onClick={handleConfirmUpload}
                                                                disabled={uploading}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận"}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={handleCancelSelection}
                                                                disabled={uploading}
                                                            >
                                                                Huỷ
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileSelect}
                                                    />
                                                </div>
                                                <div className="aspect-video rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                                                    {previewUrl ? (
                                                        <>
                                                            <img src={previewUrl} alt="Local Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">Xem trước bản địa</span>
                                                            </div>
                                                        </>
                                                    ) : field.value ? (
                                                        <img src={getMediaUrl(field.value)} alt="Server Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-gray-400">
                                                            <ImageIcon size={40} />
                                                            <span className="text-xs mt-2">Chưa có ảnh</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tóm tắt bài viết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Một đoạn mô tả ngắn về nội dung bài viết..."
                                            className="h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung chi tiết <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col mb-16 relative">
                                            <style>{`
                                                 .quill > .ql-container {
                                                     height: 300px;
                                                 }
                                             `}</style>
                                            <ReactQuill
                                                theme="snow"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="quill"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        ['link', 'clean']
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading || uploading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Lưu thay đổi" : "Đăng bài viết"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ArticleForm;
