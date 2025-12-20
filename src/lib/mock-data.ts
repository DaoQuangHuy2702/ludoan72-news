export interface Warrior {
    id: string;
    name: string;
    rank: string;
    unit: string;
    joinDate: string;
    status: 'active' | 'inactive';
}

export const mockWarriors: Warrior[] = [
    { id: '1', name: 'Nguyễn Văn A', rank: 'Thiếu úy', unit: 'Tiểu đoàn 1', joinDate: '2023-01-15', status: 'active' },
    { id: '2', name: 'Trần Thị B', rank: 'Trung úy', unit: 'Tiểu đoàn 2', joinDate: '2022-05-20', status: 'active' },
    { id: '3', name: 'Lê Văn C', rank: 'Thượng sĩ', unit: 'Đại đội 3', joinDate: '2021-11-10', status: 'inactive' },
];
