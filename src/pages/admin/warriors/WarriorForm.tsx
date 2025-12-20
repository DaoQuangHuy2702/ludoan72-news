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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Tên phải có ít nhất 2 ký tự.",
    }),
    rank: z.string().min(1, {
        message: "Vui lòng chọn cấp bậc.",
    }),
    unit: z.string().min(1, {
        message: "Đơn vị không được để trống.",
    }),
    status: z.enum(["active", "inactive"]),
});

const WarriorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rank: "",
            unit: "",
            status: "active",
        },
    });

    useEffect(() => {
        const fetchWarrior = async () => {
            if (isEditMode && id) {
                try {
                    const response = await api.get(`/cms/warriors/${id}`);
                    if (response.data && response.data.data) {
                        const warrior = response.data.data;
                        form.reset({
                            name: warrior.name,
                            rank: warrior.rank,
                            unit: warrior.unit,
                            status: warrior.status,
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch warrior:", error);
                    toast.error("Không tìm thấy thông tin chiến sĩ");
                    navigate("/admin/warriors");
                }
            }
        };
        fetchWarrior();
    }, [id, isEditMode, form, navigate]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditMode && id) {
                await api.put(`/cms/warriors/${id}`, values);
                toast.success("Cập nhật thành công!");
            } else {
                await api.post("/cms/warriors", values);
                toast.success("Thêm mới thành công!");
            }
            navigate("/admin/warriors");
        } catch (error) {
            console.error("Submit failed:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Chỉnh sửa thông tin" : "Thêm chiến sĩ mới"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/admin/warriors")}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyễn Văn A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="rank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cấp bậc</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn cấp bậc" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Binh nhì">Binh nhì</SelectItem>
                                                <SelectItem value="Binh nhất">Binh nhất</SelectItem>
                                                <SelectItem value="Hạ sĩ">Hạ sĩ</SelectItem>
                                                <SelectItem value="Trung sĩ">Trung sĩ</SelectItem>
                                                <SelectItem value="Thượng sĩ">Thượng sĩ</SelectItem>
                                                <SelectItem value="Thiếu úy">Thiếu úy</SelectItem>
                                                <SelectItem value="Trung úy">Trung úy</SelectItem>
                                                <SelectItem value="Thượng úy">Thượng úy</SelectItem>
                                                <SelectItem value="Đại úy">Đại úy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đơn vị</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tiểu đoàn 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trạng thái</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Đang công tác</SelectItem>
                                                <SelectItem value="inactive">Đã nghỉ/Chuyển</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default WarriorForm;
