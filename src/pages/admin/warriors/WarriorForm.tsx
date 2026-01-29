import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { toast } from "sonner";
import { format, parse, parseISO } from "date-fns";
import api, { getMediaUrl } from "@/lib/api";
import { useFieldArray } from "react-hook-form";
import { Trash2, PlusCircle, User, Users } from "lucide-react";

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
    birthDate: z.string().optional(),
    avatar: z.string().optional(),
    gender: z.string().optional(),
    phoneNumber: z.string().optional(),
    notes: z.string().optional(),
    strengths: z.string().optional(),
    aspirations: z.string().optional(),
    hometownProvinceCode: z.string().optional(),
    hometownCommuneCode: z.string().optional(),
    hometownAddress: z.string().optional(),
    currentProvinceCode: z.string().optional(),
    currentCommuneCode: z.string().optional(),
    currentAddress: z.string().optional(),
    familyMembers: z.array(z.object({
        name: z.string().min(1, "Vui lòng nhập tên"),
        gender: z.string().optional(),
        birthYear: z.preprocess((val) => val === "" ? undefined : Number(val), z.number().optional()),
        occupation: z.string().optional(),
        relationship: z.string().min(1, "Vui lòng chọn mối quan hệ"),
    })).optional(),
    totalLeaveDays: z.preprocess((val) => val === "" ? undefined : Number(val), z.number().optional()),
});

const WarriorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [provinces, setProvinces] = useState<any[]>([]);
    const [hometownCommunes, setHometownCommunes] = useState<any[]>([]);
    const [currentCommunes, setCurrentCommunes] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rank: "",
            unit: "",
            birthDate: "",
            avatar: "",
            gender: "Nam",
            phoneNumber: "",
            notes: "",
            strengths: "",
            aspirations: "",
            hometownProvinceCode: "",
            hometownCommuneCode: "",
            hometownAddress: "",
            currentProvinceCode: "",
            currentCommuneCode: "",
            currentAddress: "",
            familyMembers: [],
            totalLeaveDays: undefined,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "familyMembers",
    });

    useEffect(() => {
        const fetchWarrior = async () => {
            if (isEditMode && id) {
                try {
                    const response = await api.get(`/cms/warriors/${id}`);
                    if (response.data && response.data.success) {
                        const data = response.data.data;
                        const birthDateStr = data.birthDate ? format(parse(data.birthDate, "dd/MM/yyyy", new Date()), "yyyy-MM-dd") : "";

                        // Ensure all fields are strings (backend might return null)
                        const sanitizedData = { ...data };
                        Object.keys(sanitizedData).forEach(key => {
                            if (sanitizedData[key] === null) {
                                sanitizedData[key] = "";
                            }
                        });

                        form.reset({
                            ...sanitizedData,
                            birthDate: birthDateStr,
                            familyMembers: data.familyMembers || [],
                        });
                        if (data.avatar) {
                            setImagePreview(getMediaUrl(data.avatar));
                        }

                        // Explicitly fetch communes and WAIT for them before UI rendering implies they are ready
                        // This helps avoid race conditions where form value is set before options exist
                        const promises = [];
                        if (data.hometownProvinceCode) {
                            promises.push(fetchHometownCommunes(data.hometownProvinceCode));
                        }
                        if (data.currentProvinceCode) {
                            promises.push(fetchCurrentCommunes(data.currentProvinceCode));
                        }
                        await Promise.all(promises);

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

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await api.get("/api/v1/public/administrative-units/provinces");
                if (response.data && response.data.data) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    const fetchHometownCommunes = async (provinceCode: string) => {
        if (!provinceCode) return;
        try {
            const response = await api.get(`/api/v1/public/administrative-units/communes/province/${provinceCode}`);
            if (response.data && response.data.data) {
                setHometownCommunes(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch hometown communes:", error);
        }
    };

    const fetchCurrentCommunes = async (provinceCode: string) => {
        if (!provinceCode) return;
        try {
            const response = await api.get(`/api/v1/public/administrative-units/communes/province/${provinceCode}`);
            if (response.data && response.data.data) {
                setCurrentCommunes(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch current communes:", error);
        }
    };

    const hometownProvinceCode = form.watch("hometownProvinceCode");
    const currentProvinceCode = form.watch("currentProvinceCode");

    // Removed useEffects to avoid double-fetching/race conditions with form.reset()
    // Data fetching is now handled in fetchWarrior (initial load) and onValueChange (user interaction)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            toast.error("File quá lớn. Vui lòng chọn file dưới 100MB.");
            return;
        }

        setSelectedFile(file);
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));

        // Clear input value to allow selecting same file again
        if (e.target) e.target.value = "";
    };

    const uploadToCloudinary = async (file: File) => {
        try {
            // 1. Get signature from backend
            const sigResponse = await api.get("/cms/upload/signature");
            const { signature, timestamp, apiKey, cloudName } = sigResponse.data.data;

            // 2. Upload directly to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);

            const resourceType = file.type.startsWith("video") ? "video" : "image";
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const response = await axios.post(uploadUrl, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            return response.data.secure_url;
        } catch (error) {
            console.error("Direct upload to Cloudinary failed:", error);
            throw error;
        }
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        try {
            const secureUrl = await uploadToCloudinary(selectedFile);
            form.setValue("avatar", secureUrl);
            toast.success("Upload ảnh thành công");
            setSelectedFile(null);
            setImagePreview(getMediaUrl(secureUrl));
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload ảnh thất bại");
            setImagePreview(form.getValues("avatar") ? getMediaUrl(form.getValues("avatar")) : null);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCancelSelection = () => {
        setSelectedFile(null);
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(form.getValues("avatar") ? getMediaUrl(form.getValues("avatar")) : null);
    };

    const removeImage = () => {
        setSelectedFile(null);
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        form.setValue("avatar", "");
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

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
                    {isEditMode ? "Chỉnh sửa thông tin" : "Thêm thông tin quân nhân"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/admin/warriors")}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4 pb-4 border-b">
                            <FormLabel className="text-base font-semibold">Ảnh đại diện</FormLabel>
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                            {selectedFile && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="text-[10px] text-white font-medium bg-black/60 px-2 py-1 rounded text-center">Chờ xác nhận</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="text-center p-2 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                            <span className="text-xs text-gray-400">Tải ảnh lên</span>
                                        </div>
                                    )}
                                </div>
                                {imagePreview && !selectedFile && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {selectedFile ? (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={handleConfirmUpload}
                                        disabled={isUploading}
                                        className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                                    >
                                        {isUploading ? "Đang tải..." : "Xác nhận"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelSelection}
                                        disabled={isUploading}
                                        className="h-8 text-xs"
                                    >
                                        Huỷ
                                    </Button>
                                </div>
                            ) : (
                                !imagePreview && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-8 text-xs"
                                    >
                                        <Upload className="h-3 w-3 mr-1" /> Chọn ảnh
                                    </Button>
                                )
                            )}

                            <p className="text-[10px] text-muted-foreground text-center">
                                Hỗ trợ: JPG, PNG, GIF (Tối đa 100MB)
                            </p>
                        </div>

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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="09xxxxxxxx" {...field} />
                                        </FormControl>
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
                                        <FormLabel>Cấp bậc, chức vụ <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập cấp bậc..." {...field} />
                                        </FormControl>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="strengths"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sở trường</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Sở trường của quân nhân..."
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="aspirations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nguyện vọng</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nguyện vọng của quân nhân..."
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="totalLeaveDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tổng số ngày phép</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Ví dụ: 20" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 pb-4 border-b">
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ghi chú</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ghi chú thêm..."
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold text-lg">Quê quán</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="hometownProvinceCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                                            <SearchableSelect
                                                options={provinces.map(p => ({ value: p.code, label: p.name }))}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    fetchHometownCommunes(value);
                                                    form.setValue("hometownCommuneCode", "");
                                                }}
                                                value={field.value}
                                                placeholder="Chọn Tỉnh/Thành phố"
                                                searchPlaceholder="Tìm kiếm tỉnh..."
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hometownCommuneCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Xã/Phường/Thị trấn</FormLabel>
                                            <SearchableSelect
                                                options={hometownCommunes.map(c => ({ value: c.id, label: c.name }))}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!hometownProvinceCode}
                                                placeholder="Chọn Xã/Phường/Thị trấn"
                                                searchPlaceholder="Tìm kiếm xã..."
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="hometownAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ (Số nhà, đường...)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Số 123, đường ABC..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold text-lg">Nơi ở hiện tại</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="currentProvinceCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                                            <SearchableSelect
                                                options={provinces.map(p => ({ value: p.code, label: p.name }))}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    fetchCurrentCommunes(value);
                                                    form.setValue("currentCommuneCode", "");
                                                }}
                                                value={field.value}
                                                placeholder="Chọn Tỉnh/Thành phố"
                                                searchPlaceholder="Tìm kiếm tỉnh..."
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="currentCommuneCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Xã/Phường/Thị trấn</FormLabel>
                                            <SearchableSelect
                                                options={currentCommunes.map(c => ({ value: c.id, label: c.name }))}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!currentProvinceCode}
                                                placeholder="Chọn Xã/Phường/Thị trấn"
                                                searchPlaceholder="Tìm kiếm xã..."
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="currentAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ (Số nhà, đường...)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Số 456, đường XYZ..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Thông tin gia đình
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: "", gender: "Nam", birthYear: undefined, occupation: "", relationship: "" })}
                                    className="flex items-center gap-2"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Thêm thành viên
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-muted-foreground">Chưa có thông tin thành viên gia đình</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 relative group">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`familyMembers.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Tên thành viên" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`familyMembers.${index}.relationship`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mối quan hệ <span className="text-red-500">*</span></FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Chọn quan hệ" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {["Cha", "Mẹ", "Vợ", "Con", "Anh", "Chị", "Em"].map((rel) => (
                                                                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`familyMembers.${index}.gender`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Giới tính</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Giới tính" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Nam">Nam</SelectItem>
                                                                    <SelectItem value="Nữ">Nữ</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`familyMembers.${index}.birthYear`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Năm sinh</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Năm sinh" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`familyMembers.${index}.occupation`}
                                                    render={({ field }) => (
                                                        <FormItem className="md:col-span-2">
                                                            <FormLabel>Nghề nghiệp</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Nghề nghiệp..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </Button>
                    </form>
                </Form>
            </div>

            {isUploading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Đang tải ảnh lên...</h3>
                            <span className="text-primary font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                            {uploadProgress < 100
                                ? "Đang gửi dữ liệu đến máy chủ..."
                                : "Máy chủ đang xử lý và lưu trữ dữ liệu..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarriorForm;
