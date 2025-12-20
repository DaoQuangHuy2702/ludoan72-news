import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { mockWarriors, Warrior } from "@/lib/mock-data";
import { toast } from "sonner";

const WarriorList = () => {
    const [warriors, setWarriors] = useState<Warrior[]>(mockWarriors);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredWarriors = warriors.filter((w) =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setWarriors(warriors.filter((w) => w.id !== id));
        toast.success("Warrior deleted successfully");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Chiến sĩ</h2>
                <Link to="/admin/warriors/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm chiến sĩ
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Đơn vị</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredWarriors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Không tìm thấy chiến sĩ nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredWarriors.map((warrior) => (
                                <TableRow key={warrior.id}>
                                    <TableCell className="font-medium">{warrior.name}</TableCell>
                                    <TableCell>{warrior.rank}</TableCell>
                                    <TableCell>{warrior.unit}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${warrior.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {warrior.status === "active" ? "Đang công tác" : "Đã nghỉ/Chuyển"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/warriors/${warrior.id}/detail`}>
                                                <Button variant="ghost" size="icon" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link to={`/admin/warriors/${warrior.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác. Chiến sĩ này sẽ bị xoá khỏi hệ thống.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(warrior.id)} className="bg-red-600 hover:bg-red-700">
                                                            Xoá
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default WarriorList;
