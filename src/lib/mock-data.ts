export interface Warrior {
    id: string;
    name: string;
    rank: string;
    unit: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export const mockWarriors: Warrior[] = [
    { id: 1, name: 'Nguyễn Văn A', rank: 'Thiếu úy', unit: 'Tiểu đoàn 1', status: 'active' },
    { id: 2, name: 'Trần Thị B', rank: 'Trung úy', unit: 'Tiểu đoàn 2', status: 'active' },
    { id: 3, name: 'Lê Văn C', rank: 'Thượng sĩ', unit: 'Đại đội 3', status: 'inactive' },
];
