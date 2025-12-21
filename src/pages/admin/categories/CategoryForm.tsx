import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import api from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Tên danh mục phải có ít nhất 2 ký tự.",
    }),
    colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Vui lòng nhập mã màu hợp lệ (VD: #3498db).",
    }),
});

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            colorCode: "#000000",
        },
    });

    useEffect(() => {
        const fetchCategory = async () => {
            if (isEditMode && id) {
                try {
                    const response = await api.get(`/cms/categories/${id}`);
                    if (response.data && response.data.data) {
                        const categoryData = response.data.data;
                        form.reset({
                            name: categoryData.name,
                            colorCode: categoryData.colorCode || "#000000",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch category:", error);
                    toast.error("Không tìm thấy thông tin danh mục");
                    navigate("/admin/categories");
                }
            }
        };
        fetchCategory();
    }, [id, isEditMode, form, navigate]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditMode && id) {
                const response = await api.put(`/cms/categories/${id}`, values);
                toast.success(response.data.message || "Cập nhật thành công!");
            } else {
                const response = await api.post("/cms/categories", values);
                toast.success(response.data.message || "Thêm mới thành công!");
            }
            navigate("/admin/categories");
        } catch (error: any) {
            console.error("Submit failed:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Chỉnh sửa danh mục bài viết" : "Thêm danh mục bài viết mới"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/admin/categories")}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sự kiện" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="colorCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã màu <span className="text-red-500">*</span></FormLabel>
                                    <div className="flex gap-4">
                                        <FormControl className="flex-1">
                                            <Input placeholder="#3498db" {...field} />
                                        </FormControl>
                                        <Input
                                            type="color"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="w-12 p-1"
                                        />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CategoryForm;
