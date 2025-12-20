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
import { format, parse } from "date-fns";
import api from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Họ và tên phải có ít nhất 2 ký tự.",
    }),
    rank: z.string().min(1, {
        message: "Vui lòng chọn cấp bậc.",
    }),
    unit: z.string().min(1, {
        message: "Vui lòng nhập đơn vị.",
    }),
    status: z.enum(["active", "inactive"]),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
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
            birthDate: "",
            gender: "Nam",
            address: "",
        },
    });

    useEffect(() => {
        const fetchWarrior = async () => {
            if (isEditMode && id) {
                try {
                    const response = await api.get(`/cms/warriors/${id}`);
                    if (response.data && response.data.data) {
                        const warriorData = response.data.data;
                        // Convert dd/MM/yyyy to yyyy-MM-dd for native input
                        let displayDate = "";
                        const birthDateStr = warriorData.birthDate || "";
                        if (birthDateStr && birthDateStr.includes("/")) {
                            try {
                                const date = parse(birthDateStr, "dd/MM/yyyy", new Date());
                                displayDate = format(date, "yyyy-MM-dd");
                            } catch (e) {
                                console.error("Date conversion failed in load:", e);
                            }
                        } else if (birthDateStr) {
                            displayDate = birthDateStr;
                        }

                        form.reset({
                            name: warriorData.name,
                            rank: warriorData.rank,
                            unit: warriorData.unit,
                            status: warriorData.status,
                            birthDate: displayDate,
                            gender: warriorData.gender || "Nam",
                            address: warriorData.address || "",
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
            // Convert yyyy-MM-dd to dd/MM/yyyy for backend
            const submitValues = { ...values };
            if (values.birthDate) {
                try {
                    const date = parse(values.birthDate, "yyyy-MM-dd", new Date());
                    submitValues.birthDate = format(date, "dd/MM/yyyy");
                } catch (e) {
                    console.error("Date conversion failed in submit:", e);
                }
            }

            if (isEditMode && id) {
                const response = await api.put(`/cms/warriors/${id}`, submitValues);
                toast.success(response.data.message || "Cập nhật thành công!");
            } else {
                const response = await api.post("/cms/warriors", submitValues);
                toast.success(response.data.message || "Thêm mới thành công!");
            }
            navigate("/admin/warriors");
        } catch (error: any) {
            console.error("Submit failed:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Chỉnh sửa thông tin" : "Thêm chiến sĩ mới"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/admin/warriors")}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nguyễn Văn A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giới tính</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Nam">Nam</SelectItem>
                                                <SelectItem value="Nữ">Nữ</SelectItem>
                                                <SelectItem value="Khác">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày sinh</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="bg-background h-10"
                                            />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="rank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cấp bậc <span className="text-red-500">*</span></FormLabel>
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
                                        <FormLabel>Đơn vị <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tiểu đoàn 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hà Nội, Việt Nam" {...field} />
                                    </FormControl>
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

export default WarriorForm;
