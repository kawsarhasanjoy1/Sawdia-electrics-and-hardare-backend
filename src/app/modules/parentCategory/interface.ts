import { Types } from 'mongoose';

export type TParentCategoryName = 'Electronics' | 'Mobile Accessories' | 'Computers & Laptops' | 'Televisions & Home Entertainment' | 'Kitchen Appliances' | 'Power Tools' | 'Hardware & Construction' | 'Lighting & Electrical' | 'Cables & Wires' | 'Gaming & Consoles';



export interface TParentCategory {
    name: TParentCategoryName;
    slug: string;
    description?: string;
    isActive: boolean;
    createdBy: Types.ObjectId;
}
