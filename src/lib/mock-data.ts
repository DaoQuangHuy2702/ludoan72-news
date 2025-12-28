export interface Warrior {
    id: string;
    name: string;
    rank: string;
    unit: string;
    status: string;
    birthDate?: string;
    gender?: string;
    address?: string;
    createdAt?: string;
    phoneNumber?: string;
    notes?: string;
    strengths?: string;
    aspirations?: string;
    hometownProvinceCode?: string;
    hometownCommuneCode?: string;
    hometownAddress?: string;
    currentProvinceCode?: string;
    currentCommuneCode?: string;
    currentAddress?: string;
    hometownProvinceName?: string;
    hometownCommuneName?: string;
    currentProvinceName?: string;
    currentCommuneName?: string;
    avatar?: string;
}

export const mockWarrior: Warrior = {
    id: "1",
    name: "Nguyễn Văn A",
    rank: "Trung sĩ",
    unit: "Tiểu đoàn 1",
    status: "active",
    birthDate: "1995-05-15",
    gender: "Nam",
    address: "Hà Nội"
};

export const mockPaginatedWarriors = {
    content: [mockWarrior],
    totalPages: "1",
    totalElements: "1",
    size: 10,
    number: 0
};

export const mockWarriors: Warrior[] = [
    { id: "1", name: 'Nguyễn Văn A', rank: 'Thiếu úy', unit: 'Tiểu đoàn 1', status: 'active' },
    { id: "2", name: 'Trần Thị B', rank: 'Trung úy', unit: 'Tiểu đoàn 2', status: 'active' },
    { id: "3", name: 'Lê Văn C', rank: 'Thượng sĩ', unit: 'Đại đội 3', status: 'inactive' },
];
