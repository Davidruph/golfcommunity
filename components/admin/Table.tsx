'use client'
import { BadgeCheck, Funnel } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GoDotFill } from 'react-icons/go'
import { PiDotsThreeOutlineLight } from 'react-icons/pi'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { PaginationEllipsis } from '@/components/ui/pagination'

const users = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    membership: 'Premium',
    status: 'Active',
    communities: 3,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Member',
    membership: 'Basic',
    status: 'Active',
    communities: 1,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    role: 'Member',
    membership: 'Premium',
    status: 'Inactive',
    communities: 5,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Moderator',
    membership: 'Pro',
    status: 'Active',
    communities: 8,
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'dwilson@example.com',
    role: 'Member',
    membership: 'Basic',
    status: 'Pending',
    communities: 0,
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    email: 'jtaylor@example.com',
    role: 'Member',
    membership: 'Premium',
    status: 'Active',
    communities: 2,
  },
  {
    id: '7',
    name: 'Robert Martinez',
    email: 'rmartinez@example.com',
    role: 'Admin',
    membership: 'Pro',
    status: 'Active',
    communities: 12,
  },
]

const CustomDataTable = () => {
  return (
    <div className="mt-6 w-full">
      <div className="table-filters flex flex-col md:flex-row gap-2 items-center justify-start">
        <input
          type="text"
          className="table-filter-inputs w-full max-w-[596px] h-[40px]"
          placeholder="Search users by name or email..."
        />
        <select className="table-filter-inputs w-full max-w-[152px] h-[40px]">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="member">Member</option>
        </select>
        <select className="table-filter-inputs w-full max-w-[152px] h-[40px]">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <select className="table-filter-inputs w-full max-w-[152px] h-[40px]">
          <option value="">All Tiers</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="pro">Pro</option>
        </select>
        <div className="filter-btn flex items-center justify-center cursor-pointer">
          <Funnel />
        </div>
      </div>

      <div className="table-data mt-5 border border-[#F0F0F0] bg-white rounded-[10px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="table-data-head">NAME</TableHead>
              <TableHead className="table-data-head">EMAIL</TableHead>
              <TableHead className="table-data-head">ROLE</TableHead>
              <TableHead className="table-data-head">MEMBERSHIP</TableHead>
              <TableHead className="table-data-head">STATUS</TableHead>
              <TableHead className="table-data-head">COMMUNITIES</TableHead>
              <TableHead className="table-data-head">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="table-data-body">
                <TableCell className="p-[10px]">{user.name}</TableCell>
                <TableCell className="p-[10px]">{user.email}</TableCell>
                <TableCell className="p-[10px]">
                  {' '}
                  <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="p-[10px]">
                  <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
                    {user.membership}
                  </span>
                </TableCell>
                <TableCell className="p-[10px]">
                  <span
                    className={`table-badge px-2 py-1 items-center flex w-[100px] h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB] justify-start`}
                  >
                    <GoDotFill
                      className={`${
                        user.status === 'Active'
                          ? 'text-[#069769]'
                          : user.status === 'Inactive'
                            ? 'text-[#FF8400]'
                            : 'text-[#FF0000]'
                      }`}
                    />{' '}
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="p-[10px]">{user.communities}</TableCell>
                <TableCell className="p-[10px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <PiDotsThreeOutlineLight size={20} color="black" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
                      side={'bottom'}
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full mt-4 flex items-center justify-end gap-2 text-[#262626]">
        <button className="pagination-btns px-4 py-2 mr-2 flex gap-2 items-center">
          <FaAngleLeft /> Previous
        </button>
        <button className="pagination-btns h-[36px] w-[36px]">1</button>
        <button className="pagination-btns h-[36px] w-[36px] bg-[#069768] text-white">2</button>
        <button className="pagination-btns h-[36px] w-[36px]">3</button>
        <button className="pagination-btns h-[36px] w-[36px]">4</button>
        <button className="pagination-btns h-[36px] w-[36px]">5</button>
        <button className="pagination-btns h-[36px] w-[36px]">6</button>
        <button className="pagination-btns h-[36px] w-[36px]">
          {' '}
          <PaginationEllipsis />
        </button>
        <button className="pagination-btns px-4 py-2 flex items-center gap-2">
          Next <FaAngleRight />
        </button>
      </div>
    </div>
  )
}

export default CustomDataTable
