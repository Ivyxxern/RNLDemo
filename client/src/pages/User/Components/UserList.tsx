import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface UserListProps {
  onAddUser: () => void

}

const UserList: FC<UserListProps> = ({ onAddUser }) => {
  const users = [
    {
      user_id: 1,
      first_name: 'John',
      middle_name: '',
      last_name: 'Doe',
      suffix_name: '',
      gender: 'Male',
      address: 'Roxas City',
      action: (
        <>
          <div className="flex gap-4">
            <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">
              Edit
              </button>
            <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">
              Delete
              </button>
          </div>
        </>
      ),
    },
    {
      user_id: 2,
      first_name: 'Mikha',
      middle_name: 'Bini',
      last_name: 'Lim',
      suffix_name: '',
      gender: 'Female',
      address: 'Iloilo City',
      action: (
        <>
          <div className="flex gap-4">
            <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">
              Edit
              </button>
            <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">
              Delete
              </button>
          </div>
        </>
      ),
    },
    {
      user_id: 3,
      first_name: 'Johnathan',
      middle_name: 'Baba Yaga',
      last_name: 'Wick',
      suffix_name: 'Jr',
      gender: 'Prefer Not to Say',
      address: 'Lawaan',
      action: (
        <>
          <div className="flex gap-4">
            <button type="button" className="text-green-600 font-medium cursor-pointer hover:underline">
              Edit
              </button>
            <button type="button" className="text-red-600 font-medium cursor-pointer hover:underline">
              Delete
              </button>
          </div>
        </>
      )
    }
  ]

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="p-4 flex justify-end">
                  <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                  rounded-lg shadow-lg transition cursor-pointer"
                  onClick={onAddUser}
                  >
                    Add User</button>
                </div>
              </div>
            </caption>
            <TableHeader className="bg-blue-600 text-white">
              <TableRow>

                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  First Name
                </TableCell>
                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Middle Name
                </TableCell>
                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Last Name
                </TableCell>
                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Suffix Name
                </TableCell>
                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Gender
                </TableCell>
                <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Address
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-600">
              {users.map((user, index) => (
                <TableRow className="hover:bg-gray-50" key={index}>
                  <TableCell className="px-4 py-2.5 text-center">
                    {user.user_id}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-center">
                    {user.first_name}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-center">
                    {user.middle_name}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-center">
                    {user.last_name}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-center">
                    {user.suffix_name}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {user.gender}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {user.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default UserList