import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee',
  //   icon: 'user',
  //   shortcut: ['e', 'e'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'shopping',
    shortcut: ['o', 'o'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'user',
    shortcut: ['u', 'u'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Stores',
    url: '/dashboard/stores',
    icon: 'store',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Listings',
    url: '/dashboard/listings',
    icon: 'product',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Wallet',
    url: '/dashboard/wallet',
    icon: 'wallet',
    shortcut: ['w', 'w'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Shipping Labels',
    url: '/dashboard/labels',
    icon: 'truck',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Payouts',
    url: '/dashboard/payouts',
    icon: 'money',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Discounts',
    url: '/dashboard/discounts',
    icon: 'discount',
    shortcut: ['d', 'd'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Blogs',
    url: '/dashboard/blogs',
    icon: 'post',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Waitlists',
    url: '/dashboard/waitlists',
    icon: 'list',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['a', 'a']
      }
      // {
      //   title: 'Login',
      //   shortcut: ['l', 'l'],
      //   url: '/',
      //   icon: 'login'
      // }
    ]
  }
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export const storenavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'shopping',
    shortcut: ['o', 'o'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Listings',
    url: '/dashboard/listings',
    icon: 'product',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Payouts',
    url: '/dashboard/payouts',
    icon: 'money',
    shortcut: ['e', 'e'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Labels',
    url: '/dashboard/labels',
    icon: 'truck',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['a', 'a']
      }
    ]
  }
];

export const steps = [
  {
    target: '.dashboard-overview',
    content:
      'This is your Dashboard — view your overall store performance here.',
    disableBeacon: true
  },
  {
    target: '.dashboard-recent-orders',
    content: 'View recent orders from your customers'
  },
  {
    target: '.dashboard-areagraph',
    content: 'Shows your earns on a weekly/monthly basis'
  },
  {
    target: '.dashboard-barchat',
    content: 'Shows your top performing listings'
  },
  {
    target: '.dashboard-piechat',
    content: 'Shows how much fulfillments you made on your orders'
  },
  {
    target: '.sidebar-icon-wallet',
    content: 'Here you can manage and track your orders.'
  },
  {
    target: '.sidebar-icon-pay',
    content: 'Here you enable payouts for your store'
  },
  {
    target: '.sidebar-icon-product',
    content: 'Your listings — add or manage products displayed in your store.'
  },
  {
    target: '.sidebar-icon-money',
    content:
      'Your payouts — here you enable payments for your store and start receiving payouts.'
  },
  {
    target: '.sidebar-icon-truck',
    content:
      'Your labels — here you enable see shipping labels for orders that you purchased.'
  },
  {
    target: '.header-notification-icon',
    content:
      'This bell icon shows your new orders and fulfillment notifications.'
  },

  {
    target: '.tour-end',
    content:
      'Now lets start adding products, fulfilling orders and making customers happy.'
  }
];
