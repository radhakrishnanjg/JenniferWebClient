export class Helpmenu {

    HelpMenuID: number;
    MenuType: string;
    ParentId?: number;
    LinkText: string;
    ShortDescription: string;
    PageContent: string;
    IsActive: boolean; 
    LoginId:number;

}

export interface Employee {
    id: number;
    managerId?: number;
    name: string;
    title: string;
    phone: string;
    hireDate?: Date;
}

export const employees: Employee[] = [
    {
        id: 1,
        name: 'Daryl Sweeney',
        title: 'Chief Executive Officer',
        phone: '(555) 924-9726',
        managerId: null,
        hireDate: new Date('2019-01-15')
    },
    {
        id: 2,
        name: 'Guy Wooten',
        title: 'Chief Technical Officer',
        phone: '(438) 738-4935',
        managerId: 1,
        hireDate: new Date('2019-02-19')
    },
    {
        id: 32,
        name: 'Buffy Weber',
        title: 'VP, Engineering',
        phone: '(699) 838-6121',
        managerId: 2,
        hireDate: new Date('2019-04-13')
    },
    {
        id: 11,
        name: 'Hyacinth Hood',
        title: 'Team Lead',
        phone: '(889) 345-2438',
        managerId: 32,
        hireDate: new Date('2018-01-17')
    }, 
  ];
