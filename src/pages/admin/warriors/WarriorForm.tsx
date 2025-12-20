import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { mockWarriors } from "@/lib/mock-data";

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
    joinDate: z.string(),
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
            joinDate: new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        if (isEditMode) {
            const warrior = mockWarriors.find((w) => w.id === id);
            if (warrior) {
                form.reset(warrior);
            } else {
                toast.error("Warrior not found");
                navigate("/admin/warriors");
            }
        }
    }, [id, isEditMode, form, navigate]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast.success(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
        navigate("/admin/warriors");
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
                                name="joinDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày nhập ngũ</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
